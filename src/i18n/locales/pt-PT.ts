// pt-PT: translated from src/i18n/locales/en.ts, which carries
// the reasoning behind each section and is meant to be read beside this.
//
// Scaffolded by scripts/i18n-build-locale.js, hand-edited from there on.
// `catalog.test.ts` enforces the same rules on every change.

import type { Plurals, Strings } from "./types";

export const strings: Strings = {
  // ---- Common vocabulary ----
  "common.cancel": "Cancelar",
  "common.done": "Pronto",
  "common.ok": "OK",
  "common.close": "Fechar",
  "common.back": "Voltar",
  "common.delete": "Eliminar",
  "common.remove": "Remover",
  "common.add": "Adicionar",
  "common.copy": "Copiar",
  "common.copied": "Copiado",
  "common.share": "Partilhar",
  "common.continue": "Continuar",
  "common.try_again": "Tentar de novo",
  "common.settings": "Definições",
  "common.off": "Desligado",

  // ---- Dates ----
  "format.today": "Hoje",
  "format.yesterday": "Ontem",
  "format.minutes_ago": "há {count} min",
  "format.hours_ago": "há {count} h",
  "format.days_ago": "há {count} d",

  // ---- App shell: tabs, sub-tabs, search ----
  "nav.tab.chats": "Conversas",
  "nav.tab.mesh": "Malha",
  "nav.tab.wallet": "Carteira",
  "nav.tab.profile": "Tu",
  "a11y.tab.new_peers": "{label}, alguém novo por perto",
  "nav.notifications": "Notificações",
  "chat.subtab.channels": "Canais",
  "chat.subtab.direct": "Diretas",
  "chat.subtab.dms": "Mensagens diretas",
  "chat.search.placeholder": "Procurar nas conversas…",
  "chat.search.a11y": "Procurar em conversas e mensagens",
  "chat.search.close": "Fechar a procura",
  "chat.search.clear": "Limpar a procura",
  "mesh.view.radar": "Vista de radar",
  "mesh.view.list": "Vista de lista",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "Lista",

  // ---- Legal document names ----
  "legal.last_updated": "Última atualização: {date}",
  "legal.terms": "Termos de Serviço",
  "legal.privacy": "Política de Privacidade",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Comunicação em malha privada",
  "onboarding.welcome.cta": "Começar",
  "onboarding.welcome.cta_hint": "Aceita os termos abaixo para continuares",
  "onboarding.welcome.consent_a11y":
    "Aceitar os Termos de Serviço e a Política de Privacidade",
  "onboarding.welcome.open_terms": "Abrir os Termos de Serviço",
  "onboarding.welcome.open_privacy": "Abrir a Política de Privacidade",
  "onboarding.welcome.consent":
    "Ao tocares em {cta}, aceitas os nossos {terms} e a nossa {privacy}.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "A gerar a tua identidade",
  "onboarding.identity.body":
    "A criar um par de chaves Ed25519 neste dispositivo.\nNada é enviado para lado nenhum.",
  "onboarding.identity.failed_heading": "Não foi possível criar as tuas chaves",
  "onboarding.identity.failed_body":
    "Este dispositivo não deixou o Airhop guardá-las com segurança. Tenta de novo, ou reinicia o telemóvel e abre o Airhop outra vez.",
  "onboarding.identity.steps_a11y": "Passos: {steps}",
  "onboarding.identity.step.x25519": "A gerar o par de chaves estáticas X25519",
  "onboarding.identity.step.ed25519":
    "A gerar o par de chaves de assinatura Ed25519",
  "onboarding.identity.step.keychain":
    "A guardar as chaves no porta-chaves do sistema",
  "onboarding.identity.step.peer_id": "A derivar o ID de par",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "O teu nome na malha",
  "onboarding.username.peer_id": "ID de par",
  "onboarding.username.card_a11y":
    "O teu nome na malha é {username}. ID de par {peerID}. {props}.",
  "onboarding.username.explanation":
    "Este nome de utilizador é derivado de forma determinística da tua chave pública. É o mesmo em todos os dispositivos que veem o teu ID de par.",
  "onboarding.username.cta": "Entrar no Airhop",
  "onboarding.username.prop.algorithm": "Algoritmo",
  "onboarding.username.prop.storage": "Armazenamento",
  "onboarding.username.prop.storage_value": "Apenas o porta-chaves do sistema",
  "onboarding.username.prop.account": "Conta necessária",
  "onboarding.username.prop.account_value": "Nenhuma",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Bem-vindo ao Airhop",
  "onboarding.hello.p1":
    "Olá. O Airhop é construído sobre o bitchat como um projeto paralelo independente e de código aberto. Não tem ligação nem aval do projeto bitchat ou da permissionless tech: é só algo que gosto de construir e partilhar com a comunidade.",
  "onboarding.hello.p2":
    "Esta é a primeira versão para iOS e Android, por isso, mesmo tendo-a testado com amigos, é provável que encontres alguns erros. Se isso acontecer, ou se tiveres uma ideia para uma funcionalidade, adorava saber. Abre uma issue no {github} ou escreve-me para {email}.",
  "onboarding.hello.p3":
    "Se o Airhop te for útil, considera deixar uma estrela no {github} ou uma avaliação na {store}. Ajuda mais gente a descobrir o projeto. Obrigado por experimentares!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Antes de o teu telemóvel perguntar",
  "onboarding.primer.lede": "Eis o que cada permissão faz, e o que não faz.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Encontra dispositivos por perto e passa mensagens entre eles. É assim que a malha nasce, e funciona sem ligação à Internet.",
  "onboarding.primer.location.title": "Localização",
  "onboarding.primer.location.body":
    "Coloca-te nos canais das áreas próximas, do quarteirão à região. O Airhop nunca te segue nem envia a tua localização exata para fora do dispositivo.",
  "onboarding.primer.notifications.title": "Notificações",
  "onboarding.primer.notifications.body":
    "Recebe avisos de mensagens novas mesmo com a aplicação fechada. As notificações são criadas no teu dispositivo, sem nenhum servidor envolvido.",
  "onboarding.primer.footnote":
    "Podes recusar. As mensagens continuam a viajar pela Internet, e podes mudar de ideias depois nas definições.",
  "onboarding.primer.cta_a11y": "Continuar para os pedidos de permissão",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Acesso ao Bluetooth",
  "permission.bluetooth.purpose": "encontrar dispositivos por perto na malha",
  "permission.open_settings": "Abrir definições",
  "permission.not_now": "Agora não",
  "permission.blocked_title": "{label} está desligado",
  "permission.blocked_body": "Liga nas definições para {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Algo correu mal",
  "error.boundary.body":
    "O Airhop encontrou um problema inesperado e teve de interromper o que estava a mostrar.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Canais predefinidos",
  "chat.channels.yours": "Os teus canais",
  "chat.channels.none": "Ainda não há canais",
  "chat.channels.none_hint":
    "Toca em {plus} acima para entrares num ou criares um.",
  "chat.channels.none_desc":
    "Ainda não há canais. Usa o botão de adicionar no cabeçalho para entrares num ou criares um.",
  "chat.channels.show_fewer": "Mostrar menos canais predefinidos",
  "chat.channels.show_less": "Mostrar menos",
  "chat.channels.info": "Informações do canal",
  "chat.channels.pin": "Fixar o canal",
  "chat.channels.unpin": "Desafixar o canal",
  "chat.channels.mute": "Silenciar o canal",
  "chat.channels.unmute": "Reativar o som do canal",
  "chat.channels.leave": "Sair do canal",
  "chat.channels.leave_confirm": "Sair",
  "chat.channels.clear_body":
    "Eliminar todas as mensagens de {name}? Não é possível anular.",
  "chat.channels.leave_body":
    "Sair de {name}? Deixas de receber as mensagens dele, e o histórico é removido deste dispositivo.",
  "chat.channels.more_options": "Mais opções para {name}",
  "chat.channels.teleported_tag": "{level}  ·  teletransportado",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Limpar a conversa",
  "chat.dm.remove_contact": "Remover o contacto",
  "chat.dm.block": "Bloquear este par",
  "chat.dm.block_confirm": "Bloquear",
  "chat.dm.delete": "Eliminar a conversa",
  "chat.dm.delete_body":
    "Isto tira a conversa da tua lista e elimina as mensagens dela. O contacto fica, e uma mensagem nova da pessoa começa uma conversa nova.",
  "chat.dm.in_range": "ao alcance",
  "chat.dm.row_hint": "Toca duas vezes e mantém para mais opções",
  "chat.channels.row_hint": "Toca duas vezes e mantém para mais opções",
  "chat.dm.you_prefix": "Tu:",
  "chat.dm.none": "Nenhuma mensagem direta",
  "chat.dm.none_desc":
    "Vai ao separador Malha e toca num par para começares uma mensagem direta encriptada.",
  "chat.dm.contact_info": "Informações do contacto",
  "chat.dm.pin": "Fixar a conversa",
  "chat.dm.unpin": "Desafixar a conversa",
  "chat.dm.mute": "Silenciar a conversa",
  "chat.dm.unmute": "Reativar o som da conversa",
  "chat.dm.clear_body":
    "Eliminar todas as mensagens com {name}? Não é possível anular.",
  "chat.dm.remove_contact_body":
    "Remover {name}? Isto elimina a conversa e esquece o contacto. A pessoa continua a poder alcançar-te se escrever de novo.",
  "chat.dm.block_body":
    "Bloquear {name}? Não a verás no separador Malha nem receberás mensagens dela, mesmo que esteja por perto.",
  "chat.dm.more_options": "Mais opções para {name}",
  "chat.dm.remove_contact_short": "Remover o contacto",
  "chat.dm.block_short": "Bloquear o contacto",
  "chat.dm.delete_short": "Eliminar a conversa",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Limpar as mensagens",
  "chat.clear_confirm": "Limpar",
  "chat.group_badge": "Grupo",
  "chat.more": "Mais",
  "chat.no_messages": "Ainda não há mensagens",
  "chat.you": "Tu",
  "chat.a11y.channel": "Canal {name}",
  "chat.a11y.group": "Grupo {name}",
  "chat.a11y.muted": "silenciado",
  "chat.a11y.pinned": "fixado",

  // ---- Chats: start something new ----
  "chat.new.title": "Começar algo novo",
  "chat.new.channel": "Criar um canal privado",
  "chat.new.channel_label": "Canal privado",
  "chat.new.channel_desc":
    "Uma sala em que qualquer pessoa com a ligação pode entrar. Cria uma, ou entra com uma ligação que te mandaram.",
  "chat.new.group": "Criar um grupo privado",
  "chat.new.group_label": "Grupo privado",
  "chat.new.group_desc":
    "Escolhe pessoas específicas. Até 16. Fica no Bluetooth.",
  "chat.new.place": "Ir a um lugar por geohash",
  "chat.new.place_label": "Ir a um lugar",
  "chat.new.place_desc":
    "Abre o canal de localização de qualquer lugar pelo geohash dele.",
  "chat.new.reach": "Alcance",
  "chat.new.reach_internet":
    "Alcança os membros por Bluetooth e pela Internet.",
  "chat.new.reach_mesh":
    "Funciona dentro do alcance do Bluetooth, não pela Internet.",
  "chat.new.reach_internet_desc":
    "Também alcança os membros pela Internet. Os relays conseguem ver que o canal está ativo, nunca as mensagens nem quem está nele.",
  "chat.new.reach_mesh_desc":
    "Fica na malha local. O mais privado: nada sai do alcance do Bluetooth.",
  "chat.new.join_link": "Entrar num canal privado com uma ligação de convite",
  "chat.new.back_to_chooser": "Voltar à escolha",
  "chat.new.create_channel": "Criar o canal",
  "chat.new.name_required": "Escreve antes um nome de canal",
  "chat.new.name_taken": "Esse nome já está a ser usado",
  "chat.new.create": "Criar",
  "chat.new.e2ee":
    "Encriptado ponta a ponta. Só os membros conseguem ler as mensagens.",
  "chat.new.invite_only":
    "Só por convite. Qualquer pessoa com quem partilhes a ligação pode entrar. Fica escondido de todos os outros, até dos pares por perto.",
  "chat.new.name_exists": "Já existe um canal com este nome.",
  "chat.new.reach_bluetooth_chip": "Só Bluetooth",
  "chat.new.reach_internet_chip": "Bluetooth + Internet",
  "chat.new.have_link": "Entrar com uma ligação de convite",

  // ---- Chats: join by link ----
  "chat.join.title": "Entrar com uma ligação",
  "chat.join.not_airhop": "Essa não é uma ligação do Airhop.",
  "chat.join.reach_internet":
    "Alcança os membros por Bluetooth e pela Internet.",
  "chat.join.reach_mesh": "Fica dentro do alcance do Bluetooth.",
  "chat.join.contact_card":
    "Um cartão de contacto. Adiciona a pessoa aos teus contactos e abre a conversa.",
  "chat.join.unverified": "Não foi possível verificar essa ligação",
  "chat.join.unverified_body":
    "O cartão de contacto não corresponde às próprias chaves, por isso não foi adicionado. Pede que te mandem um novo.",
  "chat.join.paste": "Colar da área de transferência",
  "chat.join.join": "Entrar",
  "chat.join.public_channel":
    "Canal público {name}. Qualquer pessoa por perto consegue ler.",
  "chat.join.private_channel": "Canal privado {name}. {reach}",
  "chat.join.dm_with": "Mensagem direta com {name}.",
  "chat.join.joined_as": "Entraste como {name}",
  "chat.join.name_clash_body":
    "Já estás noutro {name}. Os nomes de canal são só rótulos, por isso este convite abriu o seu próprio canal e aquele em que estavas ficou intacto. Podes mudar o nome de qualquer um deles nas informações do canal.",
  "chat.join.paste_hint":
    "Cola um convite que comece por airhop://. Tocar numa ligação também resulta; isto é para uma ligação em que não consegues tocar.",
  "chat.join.key_note":
    "O convite de um canal privado leva a chave, por isso entrar é imediato e não é pedido nada a mais ninguém.",
  "chat.join.offline_note":
    "Funciona offline. A ligação é lida neste dispositivo, e o canal alcança até onde quem o criou definiu.",

  // ---- Chats: go to a place ----
  "chat.jump.failed":
    "Não foi possível abrir essa célula. Tenta de novo daqui a pouco.",
  "chat.jump.title": "Ir a um lugar",
  "chat.jump.saved": "LUGARES GUARDADOS",
  "chat.jump.anywhere":
    "Abre o canal de localização público de qualquer lugar, mesmo de um onde não estás.",
  "chat.jump.geohash_note":
    "Escreve o geohash dele. Toda a gente cuja localização caia nessa célula partilha o canal.",
  "chat.jump.teleport_note":
    "Apareces como teletransportado, não como por perto. Só alcança pela Internet.",
  "chat.jump.level_cell": "Célula de {level}",
  "chat.jump.already_here": "Já estás aqui. Ir abre o teu canal {name}.",
  "chat.jump.open_direction": "Abrir a célula a {direction}",
  "chat.jump.open_place": "Abrir {name}",
  "chat.jump.remove_place": "Remover {name} dos lugares guardados",
  "chat.jump.go": "Ir",
  "chat.jump.how":
    "Para encontrar um geohash: abre um canal de localização > toca no nome dele > copia dali.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Não foi possível alcançar todos os membros. Tenta de novo quando estiverem por perto.",
  "chat.group.you_were_added": "Foste adicionado a {name}.",
  "chat.group.added_you": "Adicionou-te a {name}",
  "chat.group.you_were_removed":
    "Foste removido de {name}. Já não podes ler nem enviar mensagens aqui.",
  "chat.group.removed_you": "Removeu-te de {name}",
  "chat.group.add_failed": "Não foi possível adicionar",
  "chat.group.add_failed_body":
    "Nada mudou. Ou a pessoa não está acessível agora, ou o grupo está cheio com 16, ou não és tu quem o criou.",
  "chat.group.remove_failed": "Não foi possível remover",
  "chat.group.remove_failed_body":
    "Nada mudou. Só quem criou o grupo pode mudar quem está nele.",
  "chat.group.e2ee":
    "Encriptado ponta a ponta. Só os membros conseguem ler as mensagens.",
  "chat.group.cap":
    "Até 16 pessoas, escolhidas por ti. Não existe ligação de convite, por isso ninguém entra por ter recebido uma reencaminhada.",
  "chat.group.bluetooth":
    "Só Bluetooth. Os membros fora de alcance recebem as mensagens quando voltarem.",
  "chat.group.members_label": "MEMBROS",
  "chat.group.none_in_range":
    "Não há ninguém ao alcance. Os membros têm de estar por perto quando crias o grupo.",
  "chat.group.create_title": "Criar um grupo",
  "chat.group.name_placeholder": "Nome do grupo",
  "chat.group.create": "Criar",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Malha local · só Bluetooth",
  "chat.scope.mesh_desc":
    "Alcança os dispositivos dentro do alcance do Bluetooth (mais ou menos de 10 a 100 metros). Não precisa de Internet. Ideal para se organizarem no local.",
  "chat.scope.block": "Quarteirão · ~100 m",
  "chat.scope.block_desc":
    "Cobertura do tamanho de um quarteirão. As mensagens passam pela Internet para que pares fora do alcance do Bluetooth mas por perto também participem.",
  "chat.scope.neighborhood": "Bairro · ~1 km",
  "chat.scope.neighborhood_desc":
    "Cobertura de bairro. Com a ajuda dos relays, os pares de toda a área ficam acessíveis mesmo sem uma ligação Bluetooth direta.",
  "chat.scope.city": "Cidade · ~10 km",
  "chat.scope.city_desc":
    "Canal para a cidade inteira. Usa relays de Internet geolocalizados para alcançar pares de toda a área metropolitana.",
  "chat.scope.province": "Província ou estado · ~100 km",
  "chat.scope.province_desc":
    "Cobertura provincial ou estadual. Ligada pela Internet para um alcance regional de centenas de quilómetros.",
  "chat.scope.country": "País ou região · ~1000 km",
  "chat.scope.country_desc":
    "Cobertura no país inteiro. Qualquer utilizador do Airhop ou do bitchat na região pode entrar e ler as mensagens.",
  "chat.transport.bluetooth": "Só Bluetooth",
  "chat.transport.both": "Bluetooth + Internet",
  "chat.transport.internet": "Só Internet",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Comando /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Manda um abraço",
  "chat.cmd.slap_hint": "Dá uma bofetada com uma truta grande",
  "chat.status.sending": "A enviar…",
  "chat.status.undo_send": "Anular o envio",
  "chat.status.undo": "Anular",
  "chat.status.sent": "Enviada",
  "chat.status.received": "Recebida",
  "chat.status.failed": "Falhou",
  "chat.status.canceled": "Cancelada",
  "chat.status.waiting": "A aguardar",
  "chat.status.sending_short": "A enviar",
  "chat.status.receiving": "A receber",
  "chat.thread.not_available": "Indisponível aqui",
  "chat.thread.private_channel": "Canal privado",
  "chat.thread.location_channel": "Canal de localização",
  "chat.thread.public_channel": "Canal público",
  "chat.thread.notices": "Avisos deste canal",
  "chat.thread.invite": "Convidar alguém para este canal",
  "chat.thread.not_in_range":
    "Fora do alcance do Bluetooth. A entregar pela Internet.",
  "chat.thread.not_nearby":
    "Não está por perto. Entregamos quando voltar ao alcance ou ficar online.",
  "chat.thread.no_keys":
    "Vais precisar de estar dentro do alcance do Bluetooth, ou de ler o código da pessoa, para lhe escreveres.",
  "chat.geo.card_received":
    "{name} partilhou o contacto. Partilha o teu para continuarem a conversar depois de um de vocês mudar de sítio.",
  "chat.geo.exchange_complete":
    "Contactos trocados. Agora alcançam-se de qualquer lugar.",
  "chat.geo.keep_person": "Guardar esta pessoa",
  "chat.geo.keep_person_desc":
    "Partilha o teu contacto para continuarem a conversar depois de um de vocês mudar de sítio. A pessoa vai ficar a conhecer a tua identidade permanente.",
  "chat.geo.card_sent": "Partilhado · a aguardar o dela",
  "chat.thread.left_cell":
    "Saíste desta área, por isso a pessoa não te consegue alcançar aqui. Troquem códigos para continuarem a conversar de qualquer lugar.",
  "chat.thread.no_route":
    "Não é possível alcançar a pessoa agora. A mensagem sai quando houver uma rota disponível.",
  "chat.thread.empty": "Ainda não há mensagens",
  "chat.thread.empty_desc": "Começa uma conversa encriptada.",
  "chat.thread.jump_latest": "Ir para a última mensagem",
  "chat.thread.back_to_members": "Voltar aos membros",
  "chat.thread.nostr_key": "Chave pública Nostr",
  "chat.thread.in_range": "Ao alcance",
  "chat.voice.not_recorded": "A nota de voz não foi gravada",
  "chat.thread.message": "Mensagem",
  "chat.thread.message_placeholder": "Mensagem…",
  "chat.thread.length_full": "A mensagem está cheia",
  "chat.thread.waiting_for": "A aguardar que {name} volte · {percent}%",
  "chat.thread.peer": "par",
  "chat.thread.cancel_transfer": "Cancelar {name}",
  "chat.thread.queued_more": "Mais {count} a aguardar para sair",
  "chat.thread.across_bridge": "{count} do outro lado da ponte",
  "chat.thread.bridged": "pela ponte",
  "chat.thread.invite_body":
    "Encontra-te comigo em {channel} no Airhop — mensagens em malha privadas, feitas primeiro para o offline.",
  "chat.thread.go_back_unread": "Voltar, {count} não lidas",
  "chat.thread.view_info": "Ver as informações de {name}",
  "chat.thread.notices_new": "Avisos deste canal, {count} novos",
  "chat.thread.say_something": "Diz alguma coisa em {channel}.",
  "chat.thread.jump_latest_new": "Ir para a última mensagem, {count} novas",
  "chat.thread.unconfirmed_since": "Nenhuma entrega confirmada desde {date}",
  "chat.thread.no_reach": "Nenhum par por perto · ainda ninguém recebeu isto",
  "chat.thread.channel_needs_internet":
    "Internet desligada · este canal só alcança quem está dentro do alcance do Bluetooth",
  "chat.thread.cell_needs_internet":
    "Internet desligada · esta célula só é acessível pela Internet",
  "chat.thread.geo_dm_needs_internet":
    "Internet desligada · esta conversa passa só pela Internet",
  "chat.thread.via_gateway":
    "Internet desligada · um dispositivo por perto está a levar isto online por ti",
  "chat.thread.group_queued":
    "Ainda não há ninguém deste grupo por perto. Chega quando estiverem.",
  "chat.thread.no_group_key":
    "Já não estás neste grupo, por isso isto não pode ser enviado",
  "chat.thread.no_reach_offline":
    "Internet desligada e nenhum par por perto · ainda ninguém recebeu isto",
  "chat.thread.mention": "Mencionar {name}",
  "chat.thread.someone_talking": "{hold}. {name} está a falar.",
  "chat.thread.attach_note":
    "Os ficheiros só saem dentro do alcance do Bluetooth. Texto e pagamentos alcançam contactos pela Internet; anexos não.",
  "chat.thread.message_peer": "Escrever a {name}",
  "chat.thread.send": "Enviar a mensagem",
  "chat.thread.group": "Grupo",
  "chat.bridge.nearby_only":
    "Só por perto: mantém esta mensagem fora da ponte de malha",
  "chat.bridge.nearby_label": "Só por perto · fica no Bluetooth",
  "chat.bridge.bridging_label":
    "A ligar a áreas próximas · toca para só por perto",
  "chat.screenshot.you_took": "Fizeste uma captura de ecrã",
  "chat.screenshot.you_took_private":
    "Fizeste uma captura de ecrã · ninguém foi avisado",
  "chat.screenshot.heads_up": "Atenção",
  "chat.screenshot.notice": "* {name} fez uma captura de ecrã *",
  "chat.screenshot.notified_dm":
    "{name} foi avisado de que fizeste uma captura de ecrã desta conversa.",
  "chat.screenshot.notified":
    "Toda a gente neste canal foi avisada de que fizeste uma captura de ecrã.",
  "chat.screenshot.not_notified":
    "Ninguém foi avisado. Este canal é público, por isso anunciar uma captura registaria que estiveste aqui.",
  "chat.thread.error": "Erro",
  "chat.thread.go_back": "Voltar",
  "chat.bubble.via_bridge": "pela ponte de malha",
  "chat.bubble.view_profile": "Ver o perfil de {name}",
  "chat.bubble.forwarded": "Reencaminhada",
  "chat.bubble.attachment": "anexo",
  "chat.bubble.a11y": "{sender}: {body}. Mantém premido para mais opções.",
  "chat.bubble.failed_retry": "Falha ao enviar. Toca para tentar de novo.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Informações da mensagem",
  "chat.info.delivered_to": "Entregue a {name}",
  "chat.info.read_by": "Lida por {name}",
  "chat.info.group_reach_desc":
    "Acessíveis agora, não é uma confirmação de entrega",
  "chat.info.group_alone": "Nenhum outro membro",
  "chat.info.today_at": "Hoje às {time}",
  "chat.info.sending": "A enviar…",
  "chat.info.failed": "Falha ao enviar",
  "chat.info.courier": "Levada por um amigo",
  "chat.info.sent": "Enviada",
  "chat.info.queued": "A aguardar para sair",
  "chat.info.waiting": "A aguardar…",
  "chat.action.info": "Informações da mensagem",
  "chat.action.save_photos": "Guardar nas fotografias",
  "chat.action.save_copy": "Guardar uma cópia",
  "chat.action.forward": "Reencaminhar",
  "chat.action.select": "Selecionar",
  "chat.select.cancel": "Cancelar a seleção",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Câmara",
  "chat.attach.camera_desc": "Tira uma fotografia ou grava um vídeo",
  "chat.attach.library": "Galeria de fotografias",
  "chat.attach.library_desc": "Escolhe da tua galeria",
  "chat.attach.document": "Documento",
  "chat.attach.document_desc": "Envia qualquer ficheiro ou PDF",
  "chat.attach.voice": "Nota de voz",
  "chat.attach.voice_desc": "Grava e envia uma mensagem de voz",
  "chat.attach.ecash": "Enviar ecash",
  "chat.attach.ecash_desc": "Envia sats Cashu da tua carteira",
  "chat.attach.location": "Localização",
  "chat.attach.location_desc": "Envia onde estás agora",
  "chat.attach.title": "Anexar",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Partilhou uma localização",
  "chat.location.received_summary": "Partilhou a localização",
  "chat.location.title": "Localização",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "Marcada há {ago}",
  "chat.location.open_maps": "Abrir no Mapas",
  "chat.location.no_forward": "As localizações não são reencaminhadas",
  "chat.location.no_forward_body":
    "Uma localização é enviada a uma só pessoa. Partilha a tua se quiseres que outra pessoa a tenha.",
  "chat.location.no_fix":
    "Permite a localização para veres a que distância isto está",
  "chat.location.send_title": "Enviar a tua localização",
  "chat.location.send_body":
    "{name} vai ver um único ponto: onde estás agora. Não fica a atualizar-se.",
  "chat.location.send": "Enviar a localização",
  "chat.location.finding": "A procurar a tua localização…",
  "chat.location.no_location": "Não foi possível obter a tua localização",
  "chat.location.no_location_body":
    "Permite o acesso à localização e confirma que os serviços de localização estão ligados, depois tenta de novo.",
  "chat.location.not_delivered": "Não foi possível enviar a tua localização",
  "chat.location.not_delivered_body":
    "Uma localização só vale a pena enquanto está atual, por isso não fica em fila para depois. Tenta de novo quando {name} estiver acessível.",
  "chat.location.direction.n": "a norte",
  "chat.location.direction.ne": "a nordeste",
  "chat.location.direction.e": "a este",
  "chat.location.direction.se": "a sudeste",
  "chat.location.direction.s": "a sul",
  "chat.location.direction.sw": "a sudoeste",
  "chat.location.direction.w": "a oeste",
  "chat.location.direction.nw": "a noroeste",
  "chat.attach.send_anyway": "Enviar mesmo assim",
  "chat.attach.bitchat_too_big": "Isto pode não chegar",
  "chat.attach.bitchat_too_big_body":
    "{name} está no bitchat, que desiste a meio com ficheiros grandes. Abaixo de uns 350 KiB é fiável. Enviar para um contacto do Airhop não tem esse limite.",
  "chat.attach.bitchat_unopenable": "A pessoa pode não conseguir abrir",
  "chat.attach.bitchat_unopenable_body":
    "{name} está no bitchat, que mostra fotografias e notas de voz mas lista tudo o resto como um ficheiro que não consegue abrir. Vai chegar, só que talvez ela não consiga ver.",
  "chat.attach.file": "Anexar um ficheiro",
  "chat.attach.unavailable": "Anexos indisponíveis aqui",
  "chat.attach.not_sent": "Anexo não enviado",
  "chat.attach.read_failed":
    "Algo correu mal ao ler esse ficheiro. Tenta outro.",
  "chat.attach.caption": "Adiciona uma legenda…",
  "chat.attach.send": "Enviar o anexo",
  "chat.attach.generic": "Anexo",
  "chat.media.view_full": "Ver a fotografia em ecrã inteiro",
  "chat.media.gone_photo": "A fotografia não está neste dispositivo",
  "chat.media.gone_video": "O vídeo não está neste dispositivo",
  "chat.media.gone_voice": "A nota de voz não está neste dispositivo",
  "chat.media.gone_file": "O ficheiro não está neste dispositivo",
  "chat.media.gone_note":
    "Removido ao fim de 7 dias ou quando a cache foi limpa",
  "chat.media.ask_resend": "Pedir de novo",
  "chat.media.resend_draft": "Podes mandar-me {kind} de novo?",
  "chat.media.kind_photo": "aquela fotografia",
  "chat.media.kind_video": "aquele vídeo",
  "chat.media.kind_voice": "aquela nota de voz",
  "chat.media.kind_file": "aquele ficheiro",
  "chat.media.pause_voice": "Pausar a nota de voz",
  "chat.media.play_voice": "Reproduzir a nota de voz",
  "chat.media.voice_position": "Posição na nota de voz",
  "chat.media.voice_scrub":
    "Toca ao longo das barras para saltares para esse ponto",
  "chat.media.image": "Imagem",
  "chat.media.tap_load_photo": "Toca para carregar a fotografia",
  "chat.media.open_document": "Abrir {name}",
  "chat.media.document": "documento",
  "chat.media.tap_load_video": "Toca para carregar o vídeo",
  "chat.media.video": "Vídeo",
  "chat.media.photo": "Fotografia",
  "chat.media.close_photo": "Fechar a fotografia",
  "chat.media.save_photo": "Guardar a fotografia nas tuas fotografias",
  "chat.media.share_photo": "Partilhar a fotografia",
  "chat.media.saved_videos": "Guardado nos teus vídeos",
  "chat.media.saved_photos": "Guardado nas tuas fotografias",
  "chat.media.not_saved": "Não guardado",
  "chat.media.cant_open": "Não é possível abrir o ficheiro",
  "chat.media.no_app":
    "Este dispositivo não tem nenhuma aplicação para abrir ou partilhar este ficheiro.",
  "chat.media.open_failed":
    "Não foi possível abrir o ficheiro. Pode ter sido limpo da cache.",
  "media.blocked.nostr_only":
    "Só conheces esta pessoa por um relay. Só é possível enviar texto. Fotografias, ficheiros e notas de voz precisam de Bluetooth.",
  "media.blocked.private_channel":
    "Um anexo de difusão é assinado mas não é encriptado, por isso enviá-lo para um canal privado deixá-lo-ia aberto enquanto o texto daqui continua encriptado.",
  "media.blocked.private_group":
    "Um anexo de difusão é assinado mas não é encriptado, por isso enviá-lo para um grupo privado deixá-lo-ia aberto enquanto o texto daqui continua encriptado.",
  "media.blocked.location_channel":
    "Um canal de localização alcança as pessoas pela Internet, e fotografias, ficheiros e notas de voz viajam por Bluetooth, por isso nunca chegariam.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Notas de voz indisponíveis aqui",
  "chat.voice.hold_live": "Mantém premido para falares em direto",
  "chat.voice.hold_record": "Mantém premido para gravares uma nota de voz",
  "chat.voice.cancel_recording": "Cancelar a gravação",
  "chat.voice.slide_cancel": "Desliza para cancelar",
  "chat.voice.release_cancel": "Larga para cancelar",
  "chat.voice.a11y_toggle":
    "Toca duas vezes para começares ou parares de falar.",
  "chat.voice.limit_reached":
    "Limite de dois minutos atingido, larga para enviar",
  "chat.voice.limit_sent": "Limite de dois minutos atingido, nota enviada",
  "chat.voice.stop_send": "Parar a gravação e enviar",
  "chat.voice.lift_lock": "Desliza para cima para gravares sem manter premido",
  "chat.voice.live_speaking": "{name} está a falar",
  "voice.unavailable": "Voz em direto indisponível",
  "voice.recording_stopped": "Gravação interrompida",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Acesso à câmara",
  "chat.perm.camera_purpose": "tirar uma fotografia para enviar",
  "chat.perm.photo_label": "Acesso às fotografias",
  "chat.perm.photo_purpose": "escolher uma fotografia ou um vídeo para enviar",
  "chat.perm.photo_save_purpose": "guardar isto nas tuas fotografias",
  "chat.perm.mic_label": "Acesso ao microfone",
  "chat.perm.mic_live_purpose": "falar com quem está por perto",
  "chat.perm.mic_note_purpose": "gravar uma nota de voz",
  "chat.perm.recording_stopped": "Gravação interrompida",
  "chat.perm.record_failed":
    "Não foi possível iniciar a gravação. Verifica as permissões do microfone.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Resgatado",
  "chat.ecash.reclaimed": "Retomado",
  "chat.ecash.claiming": "A resgatar…",
  "chat.ecash.claim": "Resgatar",
  "chat.ecash.claim_amount": "Resgatar {amount} {unit}",
  "chat.ecash.already_claimed": "Já resgatado",
  "chat.ecash.already_claimed_body":
    "Todas as provas deste token já estão na tua carteira, por isso nada foi adicionado.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "Entregue à malha para levar como for possível",
  "chat.info.queued_desc":
    "Guardada neste telemóvel até haver uma rota até à pessoa",
  "chat.info.reclaimed": "Retomado",
  "chat.info.reclaimed_desc":
    "Trouxeste este pagamento de volta para a tua carteira, por isso não será entregue",
  "chat.info.about": "Acerca",
  "chat.info.group_desc":
    "Um grupo privado. Só os membros que quem o criou adicionou conseguem ler, e fica no Bluetooth.",
  "chat.info.teleported_desc":
    "Um canal de localização público para esta célula de geohash. Qualquer pessoa na célula, no Airhop ou no bitchat, partilha-o pela Internet. Estás teletransportado, não fisicamente aqui.",
  "chat.info.custom_desc":
    "Um canal personalizado. Qualquer pessoa que saiba o nome pode entrar de qualquer dispositivo com Airhop ou bitchat.",
  "chat.info.private_e2ee": "Privado · encriptado ponta a ponta",
  "chat.info.public_plain": "Público · sem encriptação",
  "chat.info.group_privacy":
    "Só os membros mostrados abaixo conseguem ler este grupo. As mensagens ficam no Bluetooth, por isso membros fora de alcance recebem-nas quando voltarem.",
  "chat.info.teleport_privacy":
    "Um lugar para onde te teletransportaste. Alcança toda a gente nesta célula pela Internet, e ninguém dentro do alcance do Bluetooth.",
  "chat.info.location_off_privacy":
    "A localização está desligada, por isso este canal só alcança dispositivos por perto por Bluetooth. Liga a localização para alcançares a célula da área pela Internet.",
  "chat.info.invite_privacy":
    "Só quem convidares pela ligação consegue ler. Fica escondido de todos os outros, até dos pares por perto.",
  "chat.info.public_privacy":
    "Qualquer pessoa que entre consegue ler todas as mensagens. Usa uma mensagem direta para conversa privada; as diretas são encriptadas ponta a ponta.",
  "chat.info.remove_member": "Remover o membro",
  "chat.info.remove_member_body":
    "Remover {name} do grupo? A chave do grupo é trocada para que a pessoa não consiga mais ler as mensagens novas.",
  "chat.info.message_member": "Escrever a {name}",
  "chat.info.remove_member_a11y": "Remover {name}",
  "chat.info.no_addable":
    "Nenhum par acessível para adicionar. Os membros têm de estar por perto.",
  "chat.info.add_count": "Adicionar {count}",
  "chat.info.teleported_tag": "{level}  ·  teletransportado",
  "chat.info.active": "Ativo",
  "chat.info.members": "Membros",
  "chat.info.bookmark": "Guardar este lugar",
  "chat.info.remove_bookmark": "Tirar dos guardados",
  "chat.info.default_notice":
    "Não é possível sair dos canais predefinidos. Fazem parte do protocolo de malha do Airhop.",
  "chat.info.custom_channel": "Canal personalizado",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Copiar o geohash",
  "chat.info.relays": "Relays",
  "chat.info.show_relays": "Mostrar os relays que carregam este canal",
  "chat.info.relay_custom": "personalizado",
  "chat.info.relays_none": "Nenhum. Esta célula está só no Bluetooth agora.",
  "chat.info.search_members": "Procurar membros",
  "chat.info.search_members_placeholder": "Procurar membros…",
  "chat.info.teleported": "Teletransportado",
  "chat.info.creator": "Quem criou",
  "chat.info.no_matches": "Nenhum resultado",
  "chat.info.no_one_here": "Ainda não há ninguém aqui",
  "chat.info.add_members": "Adicionar membros",
  "chat.info.add_selected": "Adicionar os membros selecionados",
  "chat.info.add": "Adicionar",
  "chat.info.leave_group": "Sair do grupo",
  "chat.info.leave_channel": "Sair do canal",
  "chat.info.leave": "Sair",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "A conversar desde {date}",
  "chat.contact.verified_since": "Verificado desde {date}",
  "chat.contact.anonymous": "Anónimo",
  "chat.contact.anonymous_desc":
    "Um pseudónimo de geohash sem identidade duradoura para verificar",
  "chat.contact.verified": "Verificado",
  "chat.contact.verified_desc": "Leste o código QR da pessoa",
  "chat.contact.verified_desc_compared": "Compararam os códigos",
  "chat.contact.not_verified": "Não verificado",
  "chat.contact.not_verified_desc":
    "Lê o código da pessoa, ou comparem um numa chamada, para confirmares que é mesmo ela",
  "chat.contact.e2ee": "Encriptado ponta a ponta",
  "chat.contact.e2ee_nostr":
    "Embrulhado pelo NIP-17, por isso os relays não conseguem ler",
  "chat.contact.e2ee_mesh":
    "Noise XX, mais Double Ratchet entre dispositivos com Airhop",
  "chat.contact.copy_nostr": "Copiar a chave pública Nostr",
  "chat.contact.nostr_key": "Chave pública Nostr",
  "chat.contact.cell_key_note":
    "Esta chave pertence à área em que se encontraram. Muda se um de vocês mudar de sítio, e a conversa acaba com ela. Troquem contactos para continuarem a conversar de qualquer lugar.",
  "chat.contact.peer_name": "Nome do par",
  "chat.contact.peer_id": "ID de par",
  "chat.contact.rename": "Mudar o nome",
  "chat.contact.rename_needs_contact":
    "Podes mudar o nome a pessoas de quem tens as chaves. Troquem cartões de contacto primeiro, e depois isto passa a ser um nome que só tu vês.",
  "chat.contact.rename_needs_keys":
    "Ainda não há chaves deste contacto. Escreve à pessoa, ou lê o código dela, e poderás dar-lhe um nome que só tu vês.",
  "chat.contact.renamed_by_you": "O nome que lhe deste",
  "chat.contact.copy_peer_id": "Copiar o ID de par",
  "chat.contact.verify": "Verificar o contacto",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Avisos",
  "chat.notices.post_area": "Publicar um aviso nesta área",
  "chat.notices.post_mesh": "Publicar um aviso na malha",
  "chat.notices.mark_urgent": "Marcar como urgente",
  "chat.notices.post": "Publicar o aviso",
  "chat.notices.post_short": "Publicar",
  "chat.notices.delete": "Eliminar o aviso",
  "chat.notices.just_now": "agora mesmo",
  "chat.notices.fades_soon": "desaparece em breve",
  "chat.notices.1_day": "1 dia",
  "chat.notices.3_days": "3 dias",
  "chat.notices.7_days": "7 dias",
  "chat.notices.fading": "a desaparecer",
  "chat.notices.fades_in_hours": "desaparece em {count} h",
  "chat.notices.fades_in_days": "desaparece em {count} d",
  "chat.notices.scope_geo": "Geo",
  "chat.notices.scope_mesh": "Malha",
  "chat.notices.urgent_short": "Urgente",
  "chat.notices.permanent_warning":
    "Nunca desaparece. É público, está preso a esta área, e não o podes retirar.",
  "chat.notices.none":
    "Ainda não há avisos. Publica um para ficar aqui para os outros.",

  // ---- Chats: search results ----
  "chat.search.photos": "Fotografias",
  "chat.search.videos": "Vídeos",
  "chat.search.audio": "Áudio",
  "chat.search.documents": "Documentos",
  "chat.search.links": "Ligações",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Filtrar por {filter}",
  "chat.search.no_matches": "Nenhum {filter} corresponde a “{query}”",
  "chat.search.no_media": "Ainda não há {filter}",
  "chat.search.result_a11y": "{chat}, {kind} de {sender}",
  "chat.search.you": "tu",
  "chat.search.section_chats": "Conversas",
  "chat.search.section_messages": "Mensagens",
  "chat.search.section_notices": "Avisos",
  "chat.search.hint":
    "Procura mensagens e conversas, ou escolhe um filtro acima.",
  "chat.search.no_results": "Nenhum resultado para “{query}”",
  "chat.search.open_chat": "Abrir {name}",
  "chat.search.message_a11y": "{chat}, mensagem de {sender}: {snippet}",
  "chat.search.notice_a11y": "Aviso em {chat} de {author}: {snippet}",
  "chat.search.urgent": "Urgente ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "Há {count} nesta lista. Limpar tira só daqui, e as mensagens continuam por ler nas conversas delas. Marcar tudo como lido limpa os dois.",
  "chat.notif.mark_all_read": "Marcar tudo como lido",
  "chat.notif.clear_list": "Limpar a lista",
  "chat.notif.clear_all_a11y": "Limpar todas as {count} notificações",
  "chat.notif.title": "Notificações",
  "chat.notif.clear_short": "Limpar",
  "chat.notif.close": "Fechar as notificações",
  "chat.notif.none": "Ainda não há notificações",
  "chat.notif.none_desc":
    "Mensagens, menções e avisos dos teus canais e conversas aparecem aqui.",
  "chat.notif.new": "Novo",
  "chat.notif.notice_in": "aviso em {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Reencaminhar para…",
  "chat.forward.to": "Reencaminhar para {name}",
  "chat.forward.cant_send_here": "Não é possível reencaminhar aqui",
  "chat.forward.cant_send_to": "Não é possível reencaminhar para {name}",
  "chat.forward.channels": "Canais",
  "chat.forward.groups": "Grupos",
  "chat.forward.locations": "Localizações",
  "chat.forward.dms": "Mensagens diretas",
  "chat.forward.none": "Ainda não há outras conversas",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "A iniciar a malha…",
  "mesh.banner.no_bluetooth": "Sem Bluetooth neste dispositivo · só Internet",
  "mesh.banner.bluetooth_off": "Bluetooth desligado · malha indisponível",
  "mesh.banner.permission_needed": "É precisa a permissão de Bluetooth",
  "mesh.banner.blocked": "Bluetooth bloqueado · permite nas definições",
  "mesh.banner.location_permission":
    "É precisa a localização para encontrar pares",
  "mesh.banner.advertising_unsupported":
    "Este telemóvel vê os outros, mas não pode ser descoberto",
  "mesh.banner.location_off_android":
    "Localização desligada · o Android precisa dela para encontrar pares",
  "mesh.banner.paused": "Malha em pausa · estás ausente",
  "mesh.banner.location_off":
    "Localização desligada · canais de localização indisponíveis",
  "mesh.banner.battery_saver": "Poupança de bateria · procura menos frequente",
  "mesh.banner.wipe_incomplete":
    "Limpeza incompleta · pode ter sobrado algum dado; reabrir tenta de novo",
  "mesh.banner.wifi_off":
    "Wi-Fi desligado · os ficheiros grandes saem mais devagar",
  "mesh.banner.clock_skew":
    "O relógio deste telemóvel está errado · deixa a data e a hora no automático",
  "mesh.banner.internet_off": "Internet desligada · só Bluetooth",
  "mesh.banner.relaying": "Nenhum par por perto · a passar via Nostr",
  "mesh.banner.tor": "Tor ligado · tráfego de Internet encaminhado",
  "mesh.banner.tor_starting": "A iniciar o Tor · a ligar",
  "mesh.banner.tor_blocked":
    "O Tor não conseguiu ligar-se · a malha continua a funcionar",
  "mesh.banner.gateway":
    "Ponte de Internet ligada · a passar para os pares próximos",
  "mesh.banner.bridge": "Ponte de malha ligada · conversa pública ligada",
  "mesh.banner.background_limits":
    "O {brand} pode pôr a malha em pausa em segundo plano",
  "mesh.banner.bridge_across":
    "Ponte de malha ligada · {count} do outro lado da ponte",
  "mesh.banner.action.turn_on": "Ligar",
  "mesh.banner.action.allow": "Permitir",
  "mesh.banner.action.resume": "Retomar",
  "mesh.banner.action.fix": "Resolver",
  "mesh.banner.hint.resume": "Liga de novo o anúncio e a procura por Bluetooth",
  "mesh.banner.hint.enable_bluetooth": "Pede ao Android para ligar o Bluetooth",
  "mesh.banner.hint.location_settings":
    "Abre as definições de localização do sistema",
  "mesh.banner.hint.app_settings":
    "Abre as permissões do Airhop nas definições do sistema",
  "mesh.banner.hint.battery_settings":
    "Abre as definições de atividade em segundo plano deste telemóvel",
  "mesh.banner.dismiss": "Dispensar: {label}",
  "mesh.banner.hint.dismiss": "Esconde este aviso de vez",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "À procura de pares por perto…",
  "mesh.radar.starting": "A iniciar a malha…",
  "mesh.radar.no_bluetooth": "Este dispositivo não tem Bluetooth",
  "mesh.radar.bluetooth_off": "Bluetooth desligado · sem procura",
  "mesh.radar.permission_needed": "É precisa a permissão de Bluetooth",
  "mesh.radar.blocked": "Bluetooth bloqueado",
  "mesh.radar.location_permission": "É precisa a permissão de localização",
  "mesh.radar.location_off": "Localização desligada · sem procura",
  "mesh.radar.hint_rings":
    "Os anéis mostram a força do sinal BLE, não a distância",
  "mesh.radar.hint_checking": "A verificar o Bluetooth e as permissões",
  "mesh.radar.hint_internet": "As mensagens continuam a viajar pela Internet",
  "mesh.radar.hint_turn_on": "Liga o Bluetooth para descobrires pares",
  "mesh.radar.hint_allow": "Permite o Bluetooth para descobrires pares",
  "mesh.radar.hint_allow_settings":
    "Permite o Bluetooth nas definições para descobrires pares",
  "mesh.radar.hint_location_permission":
    "O Android 11 e anteriores precisam da localização para procurar por Bluetooth",
  "mesh.radar.hint_android_location":
    "O Android precisa da localização ligada para devolver resultados da procura Bluetooth",
  "mesh.radar.signal_strong": "Forte",
  "mesh.radar.signal_medium": "Médio",
  "mesh.radar.signal_weak": "Fraco",
  "mesh.radar.you_center": "Tu, no centro da malha",
  "mesh.radar.sonar_hint":
    "Toca uma varredura de sonar. A procura já é contínua.",
  "mesh.radar.paused": "Malha em pausa · estás ausente",
  "mesh.radar.ring_hint":
    "A posição no anel reflete a força do sinal, não a distância",
  "mesh.radar.set_online":
    "Deixa o teu estado como Online no perfil para descobrires pares",
  "mesh.radar.in_range": "ao alcance",
  "mesh.radar.recently_seen": "vistos há pouco",
  "mesh.radar.peer_hint":
    "Abre as opções para escrever a este par ou pagar-lhe",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "agora mesmo",
  "mesh.peer.none": "Nenhum par por perto",
  "mesh.peer.none_desc":
    "Outros dispositivos com Airhop ou bitchat dentro do alcance do Bluetooth aparecem aqui.",
  "mesh.peer.id_copied": "ID de par copiado",
  "mesh.peer.copy_id": "Copiar o ID de par",
  "mesh.peer.their_name": "Dá pelo nome de {name}",
  "mesh.peer.in_range": "Ao alcance",
  "mesh.peer.relay": "Nó repetidor",
  "mesh.peer.relay_body":
    "Um rádio que alguém deixou ligado para alargar a malha. Leva mensagens que não consegue ler. Não há aqui ninguém a quem escrever.",
  "mesh.peer.send_dm": "Enviar uma mensagem direta",
  "mesh.peer.message": "Mensagem",
  "mesh.peer.send_sats": "Enviar ecash",
  "mesh.peer.amount_placeholder": "Valor em sats",
  "mesh.peer.amount_first": "Enviar ecash, indica antes um valor",
  "mesh.peer.cancel_send": "Cancelar o envio de ecash",
  "mesh.peer.view_peer": "Ver o par {name}",
  "mesh.peer.view_peer_online": "Ver o par {name}, online",
  "mesh.peer.last_seen": "Visto há {ago}",
  "mesh.peer.send_amount": "Enviar {amount} sats",
  "mesh.peer.direct": "Ligação direta",
  "mesh.peer.check_distance": "Verificar a distância",
  "mesh.peer.checking": "A verificar",
  "mesh.peer.no_reply": "Sem resposta",
  "mesh.peer.no_reply_hint":
    "Pode ser que se tenham afastado, ou que a aplicação deles não responda",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Região",
  "mesh.level.province": "Distrito",
  "mesh.level.city": "Cidade",
  "mesh.level.neighborhood": "Bairro",
  "mesh.level.block": "Quarteirão",
  "mesh.level.building": "Edifício",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Disponível",
  "wallet.balance.unit_hint": "Alterna entre satoshis e bitcoin",
  "wallet.balance.a11y": "Saldo {value} {unit}",
  "wallet.balance.locked":
    "O armazenamento da carteira está trancado. As provas de ecash ficam num ficheiro encriptado cuja chave vive no porta-chaves do dispositivo, e não foi possível abri-lo. Desbloqueia o dispositivo e abre o Airhop de novo.",
  "wallet.balance.tor_blocked":
    "O Tor está ligado, por isso os pedidos à casa de emissão estão bloqueados: sairiam pela rede aberta e ligariam o teu IP às tuas provas. Enviar e receber pela malha continua a funcionar. Permite o tráfego com a casa de emissão em Definições, Segurança.",
  "wallet.balance.unconfirmed_note":
    "{amount} ainda por confirmar com a casa de emissão",
  "wallet.balance.reserved_note":
    "{amount} reservados para um envio a decorrer",
  "wallet.balance.other_mint_note":
    "{amount} numa conta de outra casa de emissão",
  "wallet.balance.test_mint_note":
    "Inclui dinheiro de brincadeira de uma casa de emissão de teste. Não é bitcoin e não é possível levantar.",
  "wallet.token": "Token",
  "wallet.action.send": "Enviar um token de ecash",
  "wallet.action.send_disabled":
    "Enviar um token de ecash, indisponível com o saldo a zero",
  "wallet.action.receive": "Receber um token de ecash",
  "wallet.action.zap": "Mandar um zap a um contacto do Nostr",
  "wallet.action.zap_disabled":
    "Mandar um zap a um contacto do Nostr, indisponível com o saldo a zero",
  "wallet.action.add_mint": "Adicionar uma casa de emissão Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Não foi possível montar o token",
  "wallet.send.title": "Enviar ecash",
  "wallet.send.amount_in": "Valor em {unit}",
  "wallet.send.body":
    "Montado offline a partir de provas que já tens. Nada sai do teu saldo em definitivo até confirmares que o token chegou.",
  "wallet.send.stale_fee_note":
    "As taxas foram verificadas pela última vez há {days} dias. Se esta casa de emissão aumentou a dela desde então, o envio pode custar um pouco mais.",
  "wallet.send.fee_note":
    "{spend} {unit} saem do teu saldo; os {fee} a mais cobrem a taxa da casa de emissão que a pessoa pagaria",
  "wallet.send.qr_too_big":
    "Este token está dividido em moedas a mais para caber num código QR. Partilha ou copia, ou atualiza na casa de emissão para as juntar.",
  "wallet.send.bearer_note":
    "Quem tiver esta sequência é dono do dinheiro. As provas estão reservadas, não gastas: se não chegar a ninguém, podes retomá-las em Pendentes.",
  "wallet.send.qr_too_big_short":
    "Este token está dividido em moedas a mais para caber num código QR. Partilha ou copia.",
  "wallet.send.scan_note":
    "Pede que leiam isto a partir da carteira deles. Continua retomável até o marcares como entregue.",
  "wallet.send.mesh_note":
    "O token sai como uma mensagem direta encriptada pela malha. Não precisa de Internet.",
  "wallet.send.no_peers_note":
    "Abre o separador Malha para encontrares dispositivos por perto, ou partilha o token de outra forma.",
  "wallet.send.send_to": "Enviar para {name}",
  "wallet.send.memo": "Nota (opcional, viaja com o token)",
  "wallet.send.building": "A montar…",
  "wallet.send.build": "Montar o token",
  "wallet.send.inexact_body":
    "As tuas provas não formam exatamente {amount} {unit} offline. O menor token que é possível montar é de {spend} {unit}, e offline não existe troco: os {extra} {unit} a mais vão para quem receber.\n\nAtualizar na casa de emissão com Internet dividiria as tuas provas em valores que dão a conta exata.",
  "wallet.send.send_amount": "Enviar {amount}",
  "wallet.send.sent_to": "{amount} {unit} enviados para {name}",
  "wallet.send.sent_to_body":
    "{route} Continua retomável em Pendentes até confirmares que a pessoa recebeu, ou até a casa de emissão avisar que as provas foram resgatadas.",
  "wallet.send.copy_token": "Copiar o token",
  "wallet.send.share_token": "Partilhar o token",
  "wallet.send.open_in_wallet": "Abrir este token noutra carteira",
  "wallet.send.open_in_wallet_short": "Abrir numa carteira",
  "wallet.send.to_peer": "Enviar o token a um par por perto",
  "wallet.send.to_peer_short": "Enviar a um par",
  "wallet.send.mark_delivered": "Marcar como entregue e concluir",
  "wallet.send.they_got_it": "A pessoa recebeu",
  "wallet.send.keep_pending": "Deixar este envio pendente",
  "wallet.send.decide_later": "Decidir depois",
  "wallet.send.no_peers": "Nenhum par ao alcance",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Este é o teu próprio pagamento",
  "wallet.receive.own_payment_body":
    "Estas moedas ainda estão reservadas para um envio que não fechaste, por isso não há o que resgatar. Usa Retomar nesse pagamento para as devolveres diretamente ao teu saldo.",
  "wallet.receive.already_have": "Já está na tua carteira",
  "wallet.receive.already_have_body":
    "Todas as provas deste token já estão guardadas aqui, por isso nada foi adicionado. Os saldos não mudaram.",
  "wallet.receive.stored_unconfirmed":
    "Guardado de {mint}, mas ainda por confirmar com a casa de emissão ({reason}).",
  "wallet.receive.offline": "offline",
  "wallet.receive.redeemed_here":
    "Resgatado em {mint}. Estas provas agora são só tuas: a cópia de quem enviou já não funciona.",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "Resgatado em {mint}. Agora é teu de forma comprovável: a cópia deste token que quem enviou tem já não funciona.",
  "wallet.receive.stored_pending":
    "Guardado de {mint}, mas a casa de emissão ainda não confirmou que não foi gasto{dleq}. Atualiza pelo separador Carteira assim que estiveres online.",
  "wallet.receive.dleq_inline":
    " (a assinatura confere, por isso o token é autêntico)",
  "wallet.receive.dleq_ok":
    "A assinatura da casa de emissão confere, por isso o token é autêntico.",
  "wallet.receive.dleq_uncached":
    "As chaves da casa de emissão não estão guardadas aqui, por isso não foi possível verificar a assinatura offline.",
  "wallet.receive.dleq_warning":
    "Até atualizares online, quem enviou poderia em princípio já o ter gasto noutro sítio.",
  "wallet.receive.failed": "Não foi possível receber",
  "wallet.receive.title": "Receber ecash",
  "wallet.receive.body":
    "Cola um token Cashu. Online é resgatado na casa de emissão de imediato; offline fica guardado e é confirmado da próxima vez que atualizares.",
  "wallet.receive.scan": "Ler um código QR de ecash",
  "wallet.receive.scan_short": "Ler QR",
  "wallet.receive.receiving": "A receber…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap recebido de {from}… e resgatado na tua carteira.",
  "wallet.zap.title": "Mandar um zap a uma identidade do Nostr",
  "wallet.zap.not_npub": "não é um npub",
  "wallet.zap.bad_key": "chave errada",
  "wallet.zap.invalid_pubkey": "Chave pública inválida",
  "wallet.zap.invalid_pubkey_body":
    "Escreve um npub1… ou uma chave pública do Nostr em hexadecimal de 64 caracteres.",
  "wallet.zap.sent": "Nutzap enviado",
  "wallet.zap.failed": "O zap falhou",
  "wallet.zap.body":
    "Se a pessoa publicar informações de nutzap do NIP-61, o ecash fica trancado na chave dela para que mais ninguém o possa gastar, e não é possível retomar. Se não, vai como um token retomável. Serás avisado do que aconteceu.",
  "wallet.zap.contact": "Mandar um zap a {name}",
  "wallet.zap.pubkey_placeholder": "npub1… ou hexadecimal de 64 caracteres",
  "wallet.zap.sending": "A enviar…",
  "wallet.nostr.copied_body":
    "Dá isto a alguém e a pessoa poderá mandar-te um zap do Airhop ou de qualquer outra carteira Nostr, sem precisar de Bluetooth.",
  "wallet.nostr.copy_key":
    "Copia a tua chave Nostr para que te possam mandar zaps",
  "wallet.nostr.your_key": "A tua chave Nostr",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Casa de emissão adicionada",
  "wallet.mint.add_failed": "Não foi possível adicionar a casa de emissão",
  "wallet.mint.added_named": "{name} adicionada",
  "wallet.mint.added_body":
    "{mint} emite {units}. As chaves dela estão guardadas neste dispositivo, por isso os tokens dela já podem ser verificados mesmo sem Internet.",
  "wallet.mint.remove_plain":
    "Remover {mint} da tua carteira? As chaves guardadas vão junto, por isso os tokens dela deixam de poder ser verificados offline.",
  "wallet.mint.title": "Casas de emissão",
  "wallet.mint.none": "Ainda nenhuma casa de emissão",
  "wallet.mint.none_desc":
    "Uma casa de emissão emite e resgata o teu ecash. Adiciona uma para depositares por Lightning, ou recebe um token e a dele é adicionada sozinha.",
  "wallet.mint.add": "Adicionar uma casa de emissão",
  "wallet.mint.add_body":
    "Uma casa de emissão guarda o Bitcoin que suporta o teu ecash, por isso escolhe uma a que confiarias o saldo que lá mantiveres. O URL é verificado antes de guardar. Corre a tua com o Nutshell se preferires não confiar em ninguém.",
  "wallet.mint.consolidate_body":
    "Um token só pode citar uma casa de emissão, por isso um saldo espalhado por várias não consegue pagar um valor maior do que o que a maior delas guarda. O Airhop pode movê-lo: cada uma das outras paga uma fatura Lightning emitida pela que escolheres. Custa uma pequena taxa de encaminhamento e precisa de Internet.",
  "wallet.mint.add_short": "Adicionar",
  "wallet.mint.checking": "A verificar…",
  "wallet.mint.remove_with_balance": "Remover uma casa de emissão com saldo?",
  "wallet.mint.remove": "Remover a casa de emissão",
  "wallet.mint.delete_anyway": "Eliminar mesmo assim",
  "wallet.mint.consolidate": "Mover todos os saldos para uma casa de emissão",
  "wallet.mint.confirm_with": "Confirmar as provas com {mint}",
  "wallet.mint.remove_a11y": "Remover {mint}",
  "wallet.mint.available_amount": "{amount} {unit} disponíveis",
  "wallet.mint.split_across":
    "Saldo espalhado por {count} casas de emissão. Move para uma só.",
  "wallet.mint.move_everything_to": "Mover tudo para {mint}",
  "wallet.mint.consolidate_title": "Mover para uma casa de emissão",
  "wallet.mint.moving": "A mover…",
  "wallet.mint.move": "Mover",
  "wallet.mint.moved": "Movido",
  "wallet.mint.moved_body":
    "{amount} {unit} estão agora em {mint}, depois de {fees} {unit} em taxas de encaminhamento Lightning.",
  "wallet.mint.nothing_moved": "Nada foi movido",
  "wallet.mint.destination": "· destino",
  "wallet.mint.will_move": "· será movido",
  "wallet.mint.issued_by": "Emitido por",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Carregamento da carteira Airhop",
  "wallet.ln.invoice_failed": "Não foi possível criar a fatura",
  "wallet.ln.price_failed": "Não foi possível calcular o valor desta fatura",
  "wallet.ln.paid": "Paga",
  "wallet.ln.deposit_credited":
    "Fatura paga e {amount} {unit} emitidos por {mint}. Este saldo está confirmado: podes gastá-lo offline de imediato.",
  "wallet.ln.withdrawn":
    "{paid} sats pagos por Lightning. A casa de emissão cobrou {fee} sats em taxas de encaminhamento.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sats pagos por Lightning. A casa de emissão cobrou {fee} sats em taxas de encaminhamento e devolveu {change} sats da reserva ao teu saldo.",
  "wallet.ln.payment_failed": "O pagamento falhou",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Transforma sats da Lightning em ecash que gastas offline, ou levanta ecash para qualquer fatura Lightning. Ambos precisam de Internet e de uma casa de emissão.",
  "wallet.ln.deposit_body":
    "A casa de emissão dá-te uma fatura. Paga-a a partir de qualquer carteira Lightning e os sats voltam como ecash que gastas offline.",
  "wallet.ln.pay_invoice_for":
    "Paga esta fatura de {amount} {unit}. A carteira está atenta ao pagamento e vai emitir o teu ecash automaticamente.",
  "wallet.ln.expired_body":
    "Esta fatura expirou. Se já a pagaste, o saldo é creditado automaticamente.",
  "wallet.ln.waiting_expires": "A aguardar o pagamento · expira em {countdown}",
  "wallet.ln.withdraw_body":
    "Cola uma fatura bolt11 e a casa de emissão paga-a com o teu ecash. Primeiro recebes a cotação da reserva de encaminhamento; o que o encaminhamento não usar volta ao teu saldo.",
  "wallet.ln.up_to": "até {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Pagar {amount} {unit}",
  "wallet.ln.deposit": "Depositar sats por Lightning",
  "wallet.ln.deposit_short": "Depositar",
  "wallet.ln.withdraw": "Levantar para uma fatura Lightning",
  "wallet.ln.withdraw_short": "Levantar",
  "wallet.ln.deposit_title": "Depositar por Lightning",
  "wallet.ln.amount_placeholder": "Valor em sats",
  "wallet.ln.requesting": "A pedir…",
  "wallet.ln.get_invoice": "Obter uma fatura",
  "wallet.ln.copy_invoice": "Copiar a fatura",
  "wallet.ln.open_wallet": "Abrir numa carteira Lightning",
  "wallet.ln.open_wallet_short": "Abrir numa carteira",
  "wallet.ln.waiting": "A aguardar o pagamento…",
  "wallet.ln.new_invoice": "Criar uma fatura nova",
  "wallet.ln.new_invoice_short": "Nova fatura",
  "wallet.ln.withdraw_title": "Levantar para a Lightning",
  "wallet.ln.scan_invoice": "Ler o código QR de uma fatura Lightning",
  "wallet.ln.paid_from": "Pago de",
  "wallet.ln.invoice": "Fatura",
  "wallet.ln.routing_reserve": "Reserva de encaminhamento",
  "wallet.ln.reserved": "Reservado do saldo",
  "wallet.ln.paying": "A pagar…",
  "wallet.ln.get_quote": "Obter uma cotação",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Cópia de segurança",
  "wallet.backup.setup_failed":
    "Não foi possível configurar a cópia de segurança",
  "wallet.backup.on": "Cópia de segurança ligada",
  "wallet.backup.on_body":
    "O teu saldo já pode ser reconstruído a partir daquelas doze palavras.\n\nTudo o que outra pessoa te deu fica fora da frase até atualizares na casa de emissão, e a recuperação precisa da tua lista de casas de emissão, por isso anota-a junto com as palavras.",
  "wallet.backup.no_phrase": "Nenhuma frase guardada",
  "wallet.backup.no_phrase_body":
    "Não foi possível ler a frase de recuperação no porta-chaves do dispositivo. Desbloqueia o dispositivo e tenta de novo.",
  "wallet.backup.replace_title": "Substituir a tua frase atual?",
  "wallet.backup.replace_body":
    "Já tens uma frase de recuperação. Restaurar outra substitui a atual. As moedas já cobertas pela frase antiga continuam a poder ser gastas neste dispositivo, mas deixam de ser restauráveis, por isso confirma que as palavras antigas estão anotadas antes de continuares.",
  "wallet.backup.replace": "Substituir",
  "wallet.backup.invalid_phrase": "Essa frase não é válida",
  "wallet.backup.invalid_phrase_body":
    "A frase tem uma soma de verificação embutida e esta não passa. Procura uma palavra mal escrita, em falta ou trocada de lugar.",
  "wallet.backup.not_bip39":
    "Estas não são palavras BIP-39: {words}. Verifica a grafia.",
  "wallet.backup.add_mint_first": "Adiciona antes uma casa de emissão",
  "wallet.backup.add_mint_first_body":
    "A recuperação funciona perguntando a uma casa de emissão que moedas assinou para ti, por isso precisa de saber a quem perguntar. Adiciona as que usavas e depois restaura.",
  "wallet.backup.restore_failed": "A restauração falhou",
  "wallet.backup.phrase": "Frase de recuperação",
  "wallet.backup.state_unconfirmed":
    "Cópia de segurança ligada mas não confirmada",
  "wallet.backup.state_off": "Cópia de segurança desligada",
  "wallet.backup.badge_on": "Ligada",
  "wallet.backup.badge_unconfirmed": "Não confirmada",
  "wallet.backup.badge_off": "Desligada",
  "wallet.backup.view": "Ver a frase de recuperação",
  "wallet.backup.setup": "Configurar uma frase de recuperação",
  "wallet.backup.view_short": "Ver a frase",
  "wallet.backup.setup_short": "Configurar",
  "wallet.backup.restore":
    "Restaurar uma carteira a partir de uma frase de recuperação",
  "wallet.backup.restore_short": "Restaurar",
  "wallet.backup.setup_title": "Configurar uma frase de recuperação",
  "wallet.backup.on_body_short":
    "O teu saldo pode ser reconstruído num dispositivo novo a partir das tuas doze palavras.",
  "wallet.backup.unconfirmed_body":
    "Nunca confirmaste ter uma cópia escrita. Neste momento as palavras existem só neste telemóvel, que é justamente aquilo a que uma cópia de segurança deveria sobreviver. Vê a frase e anota-a.",
  "wallet.backup.not_covered":
    "{amount} ainda não estão cobertos. As moedas que te deram carregam os segredos de quem as enviou, por isso só entram sob a tua frase depois de trocadas. Atualiza uma casa de emissão para as proteger.",
  "wallet.backup.off_body":
    "O teu ecash existe só neste telemóvel. Se o perderes, ninguém recupera o dinheiro, nem tu. Uma frase de recuperação são doze palavras capazes de reconstruir o teu saldo em qualquer lugar.",
  "wallet.backup.about_to_see":
    "Estás prestes a ver doze palavras. Elas são o dinheiro.",
  "wallet.backup.exact_order":
    "Doze palavras, exatamente por esta ordem. Quem as tiver, tem o teu saldo.",
  "wallet.backup.verify_body":
    "Uma frase que ninguém anotou é pior do que frase nenhuma, porque parece uma rede de proteção que não existe. Duas palavras para confirmar.",
  "wallet.backup.verify_mismatch": "Não confere. Verifica a tua cópia escrita.",
  "wallet.backup.restore_body":
    "Escreve as doze palavras. O Airhop deriva de novo as tuas moedas e pergunta a cada casa de emissão quais delas assinou, por isso o saldo volta dos registos que ela mantém.",
  "wallet.backup.warn_secret":
    "Qualquer pessoa que as leia pode levar o teu saldo. Não faças capturas de ecrã e não as guardes neste telemóvel.",
  "wallet.backup.warn_paper":
    "Escreve-as em papel e guarda-as em lugar seguro. O Airhop não as consegue mostrar de novo se o telemóvel desaparecer.",
  "wallet.backup.warn_scope":
    "Elas reconstroem só o teu ecash. A tua identidade, as tuas conversas e os teus contactos não estão cobertos.",
  "wallet.backup.warn_mints":
    "A recuperação precisa de perguntar a uma casa de emissão que moedas assinou, por isso anota a tua lista de casas de emissão junto com as palavras.",
  "wallet.backup.preparing": "A preparar…",
  "wallet.backup.show_phrase": "Mostrar a minha frase",
  "wallet.backup.your_phrase": "A tua frase de recuperação",
  "wallet.backup.write_down": "Anota estas palavras",
  "wallet.backup.copy_phrase":
    "Copiar a frase de recuperação para a área de transferência",
  "wallet.backup.copy_clipboard": "Copiar para a área de transferência",
  "wallet.backup.written_down": "Já as anotei",
  "wallet.backup.check_copy": "Verifica a tua cópia",
  "wallet.backup.confirm": "Confirmar",
  "wallet.backup.restore_title": "Restaurar a partir de uma frase",
  "wallet.backup.phrase_placeholder": "doze palavras separadas por espaços",
  "wallet.backup.no_mints_yet":
    "Ainda não há casas de emissão adicionadas. A recuperação precisa de perguntar a uma específica, por isso adiciona antes as que usavas.",
  "wallet.backup.scanning": "A procurar…",
  "wallet.backup.restore_progress":
    "{mint} · conjunto de chaves {step} de {total}",
  "wallet.backup.will_scan":
    "Serão consultadas: {mints}. Uma casa de emissão que não tenhas adicionado nunca é consultada, por isso o saldo lá fica invisível.",
  "wallet.backup.word_n": "Palavra {position}",
  "wallet.backup.unreachable_mints":
    "Não foi possível alcançar: {mints}. O saldo que lá estiver continua a existir. Tenta de novo com uma ligação melhor.",
  "wallet.backup.nothing_recovered":
    "Nada foi recuperado das casas de emissão consultadas.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Marcar como recebido?",
  "wallet.delivered.body":
    "Isto liberta {amount} {unit} em definitivo. Se na verdade nunca chegou, não o vais poder retomar.",
  "wallet.delivered.body_generic":
    "Isto liberta em definitivo o valor reservado. Se na verdade nunca chegou, não o vais poder retomar.",
  "wallet.delivered.cancel": "Ainda não",
  "wallet.delivered.confirm": "A pessoa recebeu",
  "wallet.reclaim.title": "Retomar este token?",
  "wallet.reclaim.body":
    "Os {amount} {unit} voltam para o teu saldo. Só faças isto se o token nunca chegou a ninguém: se a pessoa já tem a sequência, quem resgatar primeiro na casa de emissão fica com o dinheiro, e pode ser ela.",
  "wallet.reclaim.keep": "Deixar pendente",
  "wallet.reclaim.confirm": "Retomar",
  "wallet.copied.token_body":
    "O token está na tua área de transferência. Continua reservado aqui até o marcares como entregue, por isso podes colá-lo de novo se a primeira tentativa falhar.",
  "wallet.copied.phrase_body":
    "Cola-a num gestor de palavras-passe e depois limpa a área de transferência. Outras aplicações conseguem ler, e nalgumas configurações ela sincroniza com os teus outros dispositivos.",
  "wallet.refresh.failed": "A atualização falhou",
  "wallet.refresh.partly": "Atualizado em parte",
  "wallet.refresh.done": "Atualizado",
  "wallet.refresh.unreachable":
    "Não foi possível alcançar {mints}. Todo o resto está em dia.",
  "wallet.refresh.swapped":
    "{amount} {unit} confirmados e trocados por provas novas.",
  "wallet.refresh.secured":
    "{amount} {unit} estão agora cobertos pela tua frase de recuperação.",
  "wallet.refresh.all_confirmed":
    "Tudo aqui já estava confirmado com a casa de emissão.",
  "wallet.pending.title": "Pendentes",
  "wallet.pending.reserved_desc":
    "Montado e reservado, entrega por confirmar. As provas ficam fora do teu saldo para não poderem ser gastas duas vezes.",
  "wallet.pending.locked_desc":
    "Já trancado na chave de quem vai receber, por isso só a pessoa o pode gastar. Só que ainda não chegou até ela. Partilha o token para concluir.",
  "wallet.pending.show_qr": "Mostrar este token como código QR",
  "wallet.pending.copy_again": "Copiar o token de novo",
  "wallet.pending.share_again": "Partilhar o token de novo",
  "wallet.pending.mark_delivered": "Marcar este token como entregue",
  "wallet.pending.delivered": "Entregue",
  "wallet.pending.reclaim_into": "Retomar este token para o teu saldo",
  "wallet.activity.title": "Atividade",
  "wallet.activity.none": "Ainda nada",
  "wallet.activity.none_desc":
    "Os pagamentos que envias e recebes aparecem aqui, dos mais recentes aos mais antigos, com a casa de emissão e a taxa de cada um.",
  "wallet.activity.show_fewer": "Mostrar menos pagamentos",
  "wallet.activity.show_less": "Mostrar menos",
  "wallet.activity.received_unconfirmed": "Recebido, por confirmar",
  "wallet.activity.received": "Recebido",
  "wallet.activity.receive_failed": "Falha ao receber",
  "wallet.activity.reclaimed": "Retomado",
  "wallet.activity.send_failed": "Falha ao enviar",
  "wallet.activity.sent": "Enviado",
  "wallet.activity.status_pending": "pendente",
  "wallet.activity.status_failed": "falhou",
  "wallet.activity.status_reclaimed": "retomado",
  "wallet.activity.status_expired": "expirado",
  "wallet.activity.ln_deposit": "Depósito Lightning",
  "wallet.activity.ln_withdrawal": "Levantamento Lightning",
  "wallet.activity.nutzap_received": "Nutzap recebido",
  "wallet.activity.spent_removed": "Provas gastas removidas",
  "wallet.activity.refreshed": "Provas atualizadas",
  "wallet.activity.refreshing": "A atualizar as provas",
  "wallet.activity.just_now": "agora mesmo",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Malha offline",
  "wallet.mesh_offline_body":
    "O serviço da malha não está a correr, por isso não há a quem entregar o token. Continua reservado em Pendentes.",
  "wallet.xfer.route_mesh":
    "Entregue diretamente no dispositivo da pessoa pela malha.",
  "wallet.xfer.route_nostr":
    "A pessoa estava fora do alcance do Bluetooth, por isso foi pela Internet.",
  "wallet.xfer.route_courier":
    "Não há rota até à pessoa agora. Outros dispositivos vão levá-lo e entregá-lo quando um deles a alcançar.",
  "wallet.xfer.route_queued":
    "Ainda não é possível alcançar a pessoa. Está em fila e sai assim que for possível.",
  "wallet.xfer.mesh_offline_body":
    "O serviço da malha não está a correr, por isso não há forma de entregar o token. Nada foi descontado.",
  "wallet.xfer.could_not_send": "Não foi possível enviar",
  "wallet.xfer.inexact_body":
    "As tuas provas não formam exatamente {amount} {unit} offline. O menor token que é possível montar é de {spend} {unit}, e os {extra} {unit} a mais vão para a pessoa sem forma de os recuperar.\n\nAtualizar na casa de emissão com Internet divide as tuas provas em valores que dão a conta exata.",
  "wallet.xfer.send_amount": "Enviar {amount}",
  "wallet.xfer.mesh_offline": "Malha offline",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Trancado na chave da pessoa e publicado no Nostr. É dela, esteja online ou não.",
  "wallet.pay.rail_nutzap_dm":
    "Trancado na chave da pessoa. O relay não o aceitou, por isso chegou como uma mensagem.",
  "wallet.pay.rail_nutzap_undelivered":
    "Trancado na chave da pessoa, mas ainda nada o conseguiu levar. Está em fila, e o token está em Pendentes.",
  "wallet.pay.final":
    "Pagamentos trancados não podem ser retomados: agora só a chave da pessoa pode gastar estas moedas.",
  "wallet.pay.reclaimable":
    "Continua retomável pelo separador Carteira até confirmares que chegou.",
  "wallet.pay.why": "Enviado assim porque {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} para {name}",
  "wallet.pay.thread_receipt":
    "Enviaste {amount} {unit}, trancados na chave da pessoa.",
  "wallet.pay.title": "Enviar ecash",
  "wallet.pay.to": "Para {name}",
  "wallet.pay.amount": "Valor em sats",
  "wallet.pay.memo": "Observação (opcional, pública)",
  "wallet.pay.send": "Enviar",
  "wallet.pay.sending": "A enviar…",
  "wallet.pay.action": "Enviar ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Acesso à câmara",
  "wallet.scan.camera_purpose": "ler um código QR de ecash",
  "wallet.scan.photo_label": "Acesso às fotografias",
  "wallet.scan.photo_purpose": "ler um QR de ecash a partir de uma imagem",
  "wallet.scan.no_token": "Nenhum token de ecash encontrado nessa imagem.",
  "wallet.scan.no_invoice": "Nenhuma fatura Lightning encontrada nessa imagem.",
  "wallet.scan.unreadable": "Não foi possível ler essa imagem.",
  "wallet.scan.camera_failed":
    "Não foi possível iniciar a câmara. Fecha outras aplicações de câmara e tenta de novo.",
  "wallet.scan.close": "Fechar o leitor",
  "wallet.scan.on_device":
    "É lido neste dispositivo; nada é enviado para lado nenhum.",
  "wallet.scan.aim_token": "Aponta para um código QR de ecash.",
  "wallet.scan.aim_invoice": "Aponta para o código QR de uma fatura Lightning.",
  "wallet.scan.title_token": "Ler ecash",
  "wallet.scan.title_invoice": "Ler fatura",
  "wallet.scan.desc_token":
    "Lê um token Cashu de outra carteira. Funciona com qualquer carteira Cashu, não só com o Airhop.",
  "wallet.scan.desc_invoice":
    "Lê uma fatura Lightning para a pagares com o teu saldo.",
  "wallet.scan.use_camera_a11y": "Ler com a câmara",
  "wallet.scan.use_camera": "Usar a câmara",
  "wallet.scan.pick_image_a11y":
    "Ler um código QR a partir de uma imagem guardada",
  "wallet.scan.pick_image": "Escolher das fotografias",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "O que é o Cashu?",
  "wallet.explain.intro":
    "O Cashu é ecash para Bitcoin. Um token é uma sequência que vale dinheiro para quem a tiver, assinada às cegas por uma casa de emissão para que ela não consiga saber quem gastou o quê. Sem contas, sem inícios de sessão.",
  "wallet.explain.send": "Enviar",
  "wallet.explain.send_desc":
    "Transforma um valor num token que entregas a um par por perto via Bluetooth, ou partilhas como texto. Funciona sem Internet. As provas ficam reservadas até confirmares que chegou.",
  "wallet.explain.receive": "Receber",
  "wallet.explain.receive_desc":
    "Cola um token para o adicionares. Online é trocado na casa de emissão de imediato, o que o torna teu de forma comprovável. Offline fica guardado e marcado como por confirmar até atualizares.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Paga a uma identidade do Nostr. Se a pessoa publicar informações de nutzap do NIP-61, o ecash fica trancado na chave dela para que só ela o possa gastar. Se não, recorre a uma mensagem direta encriptada. Precisa de Internet.",
  "wallet.explain.add_mint": "Adicionar casa de emissão",
  "wallet.explain.add_mint_desc":
    "Guarda a casa de emissão que emite e resgata o teu ecash, e guarda as chaves públicas dela para que os tokens possam ser verificados offline. Escolhe uma a que confiarias o saldo que lá mantiveres.",
  "wallet.explain.phrase": "Frase de recuperação",
  "wallet.explain.phrase_desc":
    "As tuas moedas derivam de doze palavras que a carteira gera no início, por isso um telemóvel novo consegue reconstruir o saldo perguntando às tuas casas de emissão que moedas assinaram. Até as veres e anotares, existem só neste telemóvel.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Carteira trancada",
  "wallet.err.mint_unreachable": "Casa de emissão inacessível",
  "wallet.err.tor_blocked": "Bloqueado com o Tor ligado",
  "wallet.err.insufficient": "Saldo insuficiente",
  "wallet.err.exact_amount": "Não é possível enviar esse valor exato",
  "wallet.err.no_mint": "Sem casa de emissão",
  "wallet.err.mint_unsupported": "A casa de emissão não faz isso",
  "wallet.err.mint_refused": "A casa de emissão recusou",
  "wallet.err.unreadable": "Token ilegível",
  "wallet.err.rejected": "Token rejeitado",
  "wallet.err.already_spent": "Já gasto",
  "wallet.err.change_pending": "Pago, troco pendente",
  "wallet.svc.mint_unreachable": "Não foi possível alcançar a casa de emissão.",
  "wallet.svc.tor_ios":
    "No iOS os pedidos à casa de emissão não passam pelo Tor.",
  "wallet.svc.tor_ios_body":
    "O Arti envolve só os WebSockets do Nostr, por isso este pedido chegaria à casa de emissão pela rede aberta e ligaria o teu IP a estas provas. Permite-o em Definições > Segurança, ou desliga antes o Tor. Enviar e receber ecash pela malha continua a funcionar.",
  "wallet.svc.keys_uncached":
    "As chaves desta casa de emissão não estão guardadas neste dispositivo.",
  "wallet.svc.keys_uncached_body":
    "Abre a carteira uma vez com Internet para as ir buscar.",
  "wallet.svc.phrase_invalid": "Essa frase de recuperação não é válida.",
  "wallet.svc.phrase_invalid_body":
    "Procura uma palavra mal escrita ou em falta. A frase tem uma soma de verificação embutida, por isso uma única palavra errada invalida tudo.",
  "wallet.svc.need_mint": "Adiciona antes pelo menos uma casa de emissão.",
  "wallet.svc.need_mint_body":
    "A recuperação funciona perguntando a uma casa de emissão que moedas assinou para ti, por isso precisa de saber a quem perguntar.",
  "wallet.svc.restored": "Restaurado a partir da frase de recuperação",
  "wallet.svc.storage_locked": "O armazenamento da carteira está trancado.",
  "wallet.svc.storage_locked_body":
    "O Airhop guarda as provas de ecash num ficheiro encriptado cuja chave vive no porta-chaves do dispositivo. Desbloqueia o dispositivo e abre a aplicação de novo.",
  "wallet.svc.bad_url": "Isso não é um URL válido.",
  "wallet.svc.needs_https":
    "O URL de uma casa de emissão tem de começar por https://.",
  "wallet.svc.refuse_http":
    "Recusamos usar uma casa de emissão em http sem encriptação.",
  "wallet.svc.refuse_http_body":
    "Qualquer pessoa no caminho da rede poderia ler ou alterar as tuas provas. Usa uma casa de emissão com https://.",
  "wallet.svc.mint_not_saved": "Não foi possível guardar a casa de emissão.",
  "wallet.svc.unreadable_token": "Isso não é um token Cashu legível.",
  "wallet.svc.unreadable_token_body":
    "Os tokens começam por cashuA ou cashuB. Verifica se nada foi cortado na cópia.",
  "wallet.svc.wrong_mint":
    "Este token não foi assinado pela casa de emissão que cita.",
  "wallet.svc.already_spent": "Estas provas já foram gastas.",
  "wallet.svc.already_spent_body":
    "Quem enviou este token resgatou-o primeiro, ou mandou o mesmo token a outra pessoa.",
  "wallet.svc.receiving_offline": "a receber offline",
  "wallet.svc.amount_positive": "Escreve um valor maior que zero.",
  "wallet.svc.coins_raced":
    "Essas moedas acabaram de ser usadas por outro pagamento.",
  "wallet.svc.coins_raced_body":
    "Nada foi descontado. Tenta de novo e a carteira escolhe outro conjunto.",
  "wallet.svc.no_ecash": "Ainda sem ecash.",
  "wallet.svc.no_ecash_body":
    "Adiciona uma casa de emissão e deposita por Lightning, ou recebe um token de alguém.",
  "wallet.svc.split_across_mints":
    "O teu saldo está espalhado por várias casas de emissão.",
  "wallet.svc.mint_says_spent":
    "A casa de emissão indicou estas provas como já gastas.",
  "wallet.svc.issue_against_invoice":
    "emitir ecash contra uma fatura Lightning",
  "wallet.svc.pay_invoice": "pagar uma fatura Lightning",
  "wallet.svc.unknown_deposit": "Depósito desconhecido.",
  "wallet.svc.invoice_expired_before": "A fatura expirou antes de ser paga.",
  "wallet.svc.invoice_expired": "Essa fatura expirou.",
  "wallet.svc.invoice_unpaid": "A fatura ainda não foi paga.",
  "wallet.svc.payment_unknown":
    "Estado do pagamento desconhecido; será verificado de novo na próxima atualização.",
  "wallet.svc.melt_change_pending": "A tua fatura foi paga.",
  "wallet.svc.melt_change_pending_body":
    "A casa de emissão ainda não devolveu a taxa de encaminhamento não usada. É reclamada automaticamente na próxima atualização, e nada se perde entretanto.",
  "wallet.svc.mint_did_not_pay":
    "A casa de emissão não pagou esta fatura. O teu saldo não mudou.",
  "wallet.svc.not_an_invoice": "Isso não é uma fatura Lightning.",
  "wallet.svc.not_an_invoice_body":
    "Cola uma fatura bolt11 que comece por lnbc.",
  "wallet.svc.insufficient_for_invoice": "Saldo insuficiente para esta fatura.",
  "wallet.svc.coins_raced_invoice_body":
    "Nada foi descontado e a fatura não foi paga. Tenta de novo.",
  "wallet.svc.same_mint": "Escolhe outra casa de emissão de destino.",
  "wallet.svc.same_mint_body":
    "A origem e o destino são a mesma casa de emissão, por isso não há o que mover.",
  "wallet.svc.quote_failed_retried": "A cotação falhou, consolidação repetida",
  "wallet.svc.amount_unfit_retried": "O valor não coube, consolidação repetida",
  "wallet.svc.cannot_size": "Não foi possível dimensionar esta transferência.",
  "wallet.svc.insufficient_at_mint": "Saldo insuficiente em {mint}.",
  "wallet.svc.inexact_title":
    "As tuas provas não formam exatamente {amount} {unit} offline.",
  "wallet.svc.inexact_detail":
    "O menor token que podes enviar é de {spend} {unit}. Offline não existe troco, por isso os {extra} {unit} a mais vão para quem receber.",
  "wallet.svc.no_single_mint":
    "Nenhuma casa de emissão sozinha guarda {amount} {unit}. Ecash de casas diferentes não pode ser juntado num só token: consolida primeiro numa delas, ou envia em valores separados.",
  "wallet.svc.have_tried_send":
    "Tens {total} {unit} e tentaste enviar {amount}.",
  "wallet.svc.invoice_needs":
    "Esta fatura precisa de {total} {unit} incluindo a reserva de encaminhamento, e tens {balance}.",
  "wallet.svc.nothing_to_move": "{mint} não tem {unit} para mover.",
  "wallet.svc.consolidate_memo": "Consolidação a partir de {mint}",
  "wallet.svc.cannot_size_detail":
    "Depois das taxas de encaminhamento Lightning, {from} não consegue mover um valor útil para {to}. Tenta mover um valor menor e específico.",
  "wallet.svc.mint_cannot": "{mint} não consegue {action}.",
  "wallet.svc.no_nut": "A casa de emissão não anuncia o NUT-{nut}.",
  "wallet.svc.unknown_mint":
    "Esse pagamento cita uma casa de emissão que não usas.",
  "wallet.svc.unknown_mint_body":
    "Adiciona-a tu mesmo se confiares nela; nada é resgatado de uma casa de emissão que não escolheste.",
  "wallet.svc.no_relay": "sem ligação a nenhum relay",
  "wallet.svc.no_shared_mint":
    "nenhuma casa de emissão em comum com saldo suficiente",
  "wallet.svc.no_nutzap_info":
    "quem vai receber não publicou informações de nutzap (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Trancado na chave da pessoa mas ainda não entregue. Partilha o token desta transação para concluir.",
  "wallet.svc.swap_lost":
    "A casa de emissão nunca concluiu esta troca, por isso nada foi emitido em contrapartida.",
  "wallet.svc.swap_unreadable":
    "Esta troca foi guardada num formato que esta versão não consegue repetir.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Verificado por QR",
  "contacts.qr.keys_unverified": "Chaves recebidas, não verificadas",
  "contacts.qr.not_verified": "Ainda não verificado",
  "contacts.qr.message": "Mensagem",
  "contacts.qr.add": "Adicionar contacto",
  "contacts.qr.scan_title": "Ler código QR",
  "contacts.qr.aim": "Aponta a câmara para o código QR da pessoa",
  "contacts.qr.add_desc": "Alcança alguém que não está por perto na malha.",
  "contacts.qr.peer_id_hint":
    "Um ID de par tem 16 caracteres. Um código de contacto começa por airhop:.",
  "contacts.qr.or_scan": "ou lê o QR da pessoa",
  "contacts.qr.trust_note":
    "Só um QR que leias com a tua câmara verifica a chave da pessoa. Um código colado traz as chaves dela, mas não a prova de que veio dela.",
  "contacts.qr.peer_id": "ID de par ou código de contacto",
  "contacts.qr.peer_id_placeholder": "Cola um ID ou um código de contacto",
  "contacts.qr.scan_camera_a11y": "Ler o código QR com a câmara",
  "contacts.qr.scan_camera_desc": "Usa a tua câmara",
  "contacts.qr.upload_a11y": "Carregar uma imagem de QR da galeria",
  "contacts.qr.upload": "Carregar da galeria",
  "contacts.qr.upload_desc": "Escolhe uma imagem de QR guardada",
  "contacts.qr.scan_a11y": "Adicionar um contacto lendo um código QR",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Cola um ID de par de 16 caracteres, uma ligação airhop://peer/… ou um código de contacto.",
  "contacts.scan.camera_label": "Acesso à câmara",
  "contacts.scan.camera_purpose": "ler o código QR de um contacto",
  "contacts.scan.camera_needed":
    "É preciso acesso à câmara para ler. Ainda podes adicionar pelo ID de par.",
  "contacts.scan.camera_failed":
    "Não foi possível iniciar a câmara. Fecha outras aplicações de câmara e tenta de novo.",
  "contacts.scan.photo_label": "Acesso às fotografias",
  "contacts.scan.photo_purpose": "ler um código QR que tenhas guardado",
  "contacts.scan.photo_needed":
    "É preciso acesso às fotografias para escolher uma imagem. Ainda podes adicionar pelo ID de par.",
  "contacts.scan.no_qr": "Nenhum código QR do Airhop encontrado nessa imagem.",
  "contacts.scan.unreadable": "Não foi possível ler um código QR nessa imagem.",
  "contacts.scan.bitchat_expired":
    "Esse código do bitchat expirou. Pede à pessoa que abra o QR de novo.",
  "contacts.scan.tampered":
    "Este código QR não é válido: o ID de par não corresponde às chaves. Pode ter sido adulterado.",
  "contacts.scan.already_added": "Já está nos teus contactos",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "A aguardar o acesso à câmara…",
  "contacts.verify.camera_off": "A câmara está desligada",
  "contacts.verify.open_settings": "Abrir definições",
  "contacts.verify.verified": "Verificado",
  "contacts.verify.different": "Contacto diferente",
  "contacts.verify.scan_again": "Ler de novo",
  "contacts.verify.failed": "Não foi possível verificar",
  "contacts.verify.done": "Pronto",
  "contacts.verify.title": "Verificar {name}",
  "contacts.verify.aim": "Aponta a câmara para o código QR da pessoa",
  "contacts.verify.camera_off_body":
    "Liga o acesso à câmara nas definições para verificares por QR.",
  "contacts.verify.match_body":
    "A chave de {name} confere. Podes confiar neste contacto.",
  "contacts.verify.different_body":
    "Este QR é de outra pessoa. Pede a {name} que mostre o próprio código.",
  "contacts.verify.tampered_body":
    "Este QR parece adulterado: o ID não corresponde à chave.",
  "contacts.verify.choose_title": "Como queres verificar?",
  "contacts.verify.choose_body":
    "As duas formas confirmam que as chaves deste telemóvel são mesmo de {name}.",
  "contacts.verify.method_scan": "Ler o código da pessoa",
  "contacts.verify.method_scan_sub": "Está aqui contigo",
  "contacts.verify.method_compare": "Comparar um código",
  "contacts.verify.method_compare_sub": "Leiam um ao outro numa chamada",
  "contacts.verify.no_keys":
    "Ainda não há chaves deste contacto. Escreve à pessoa, ou lê o código dela quando se encontrarem.",
  "contacts.verify.compare_title": "Leiam isto um ao outro",
  "contacts.verify.compare_body":
    "{name} vê as mesmas seis palavras. Se corresponderem, ambos sabem que as chaves são autênticas.",
  "contacts.verify.codes_match": "Correspondem",
  "contacts.verify.codes_differ": "Não correspondem",
  "contacts.verify.compared_body":
    "Tu e {name} confirmaram o mesmo código. Este contacto está verificado.",

  // ---- Settings: shared chrome ----
  "settings.back": "Voltar",
  "settings.coming_soon": "Em breve",
  "settings.opens_externally": "{label}, abre fora da aplicação",
  "settings.peer_id": "ID de par",
  "settings.share_peer_id": "Partilhar o teu ID de par",
  "settings.share_id_short": "Partilhar o ID",
  "settings.peer_id_sheet.title": "O teu ID de par",
  "settings.peer_id_sheet.copy": "Copiar o ID de par",
  "settings.peer_id_sheet.note":
    "Isto só resulta quando ambos estão dentro do alcance do Bluetooth. Para deixares que te escrevam de qualquer lugar, partilha antes o teu código QR.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Geral",
  "settings.section.general_desc":
    "Funcionalidades opcionais, anular o envio, multimédia, reposição",
  "settings.section.privacy": "Privacidade e segurança",
  "settings.section.privacy_desc":
    "Sigilo persistente, pacotes assinados, pares bloqueados",
  "settings.section.network": "Rede e relays",
  "settings.section.network_desc":
    "Recurso à Internet, relays nostr, compatibilidade com o bitchat",
  "settings.section.permissions": "Permissões",
  "settings.section.permissions_desc":
    "Bluetooth, localização, notificações, câmara, microfone",
  "settings.section.storage": "Armazenamento e dados",
  "settings.section.diagnostics": "Diagnóstico",

  // ---- Settings: group headings ----
  "settings.group.transports": "Transportes",
  "settings.group.internet": "Internet",
  "settings.group.nearby": "Por perto",
  "settings.group.sync": "Sincronização",
  "settings.group.features": "Funcionalidades",
  "settings.group.messages": "Mensagens",
  "settings.group.local": "Local",
  "settings.group.media": "Multimédia",
  "settings.group.reset": "Reposição",
  "settings.group.always_on": "Sempre ligado",
  "settings.group.notifications": "Notificações",
  "settings.group.blocked": "Bloqueados",
  "settings.group.theme": "Tema",
  "settings.group.font": "Tipo de letra",
  "settings.group.language": "Idioma",
  "settings.section.diagnostics_desc":
    "Estado da ligação e dispositivos por perto",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Ligações Bluetooth",
  "settings.diag.ble_links_desc":
    "Os dispositivos a que este telemóvel está ligado diretamente",
  "settings.diag.lan": "Rede local",
  "settings.diag.lan_desc": "Telemóveis na mesma rede Wi-Fi",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "Telemóvel a telemóvel sem router",
  "settings.diag.wifi_active": "A funcionar",
  "settings.diag.wifi_unsupported": "Não suportado neste dispositivo",
  "settings.diag.wifi_permission": "Bloqueado por uma permissão",
  "settings.diag.wifi_unavailable": "Indisponível de momento",
  "settings.diag.wifi_unpaired": "Nada emparelhado",
  "settings.diag.wifi_unknown": "À espera do rádio",
  "settings.diag.relays": "Relays Nostr",
  "settings.diag.relays_desc":
    "Usados para os canais de localização e para o alcance pela Internet",
  "settings.diag.connected": "Ligado",
  "settings.diag.disconnected": "Não ligado",
  "settings.diag.peer_direct": "Ligação direta",
  "settings.diag.peer_relayed": "Ouvido através de outro dispositivo",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Sem leitura de sinal",
  "settings.diag.no_peers": "Ninguém ao alcance",
  "settings.diag.no_peers_desc": "{links} ligações de rádio abertas",
  "settings.diag.gcs_size": "Tamanho do filtro",
  "settings.diag.gcs_size_desc": "O maior filtro de sincronização posto no ar",
  "settings.diag.fpr": "Taxa de falsos positivos",
  "settings.diag.fpr_desc":
    "Com que frequência o filtro diz que temos um pacote que nos falta",
  "settings.diag.bytes": "{n} bytes",
  "settings.diag.footnote":
    "Nada aqui pode ser alterado. Estes valores são fixos para que o Airhop se mantenha compatível com o bitchat.",
  "settings.section.storage_desc": "Utilização e cache",
  "settings.section.appearance": "Aspeto",
  "settings.section.appearance_desc": "Tema, tipo de letra e idioma",
  "settings.section.help": "Ajuda e comentários",
  "settings.section.help_desc":
    "Contacta-nos, comunica um erro, ou lê as perguntas frequentes",
  "settings.section.support": "Apoiar",
  "settings.section.support_desc": "Ajuda a manter o desenvolvimento ativo",
  "settings.section.about": "Acerca",
  "settings.section.about_desc": "Versão, registo de alterações e código",

  // ---- Settings: general ----
  "settings.general.undo": "Anular o envio",
  "settings.general.feature_ai": "IA",
  "settings.general.feature_wallet": "Carteira",
  "settings.general.undo_seconds": "{count} segundos",
  "settings.general.undo_a11y": "Anular o envio: {value}",
  "settings.general.quality_a11y": "Definir a qualidade de envio para {value}",
  "settings.general.undo_desc":
    "Segura um instante a mensagem enviada para a poderes retomar antes de sair",
  "settings.general.undo_off_desc": "Enviar de imediato, sem anular",
  "settings.general.undo_2": "2 segundos",
  "settings.general.undo_2_desc": "Uma hipótese rápida de a retomar",
  "settings.general.undo_10": "10 segundos",
  "settings.general.undo_10_desc": "A janela mais longa",
  "settings.general.quality": "Qualidade de envio",
  "settings.general.quality_desc":
    "Aplica-se às fotografias enviadas da câmara ou da galeria. De qualquer forma, cada fotografia é ajustada à malha.",
  "settings.general.quality_low": "Baixa",
  "settings.general.quality_low_desc":
    "Fotografias mais pequenas, envio mais rápido",
  "settings.general.quality_medium": "Média",
  "settings.general.quality_medium_desc":
    "Equilíbrio entre detalhe e velocidade",
  "settings.general.quality_high": "Alta",
  "settings.general.quality_high_desc": "Guarda o máximo de detalhe",
  "settings.general.feature_wallet_desc":
    "Envia ecash Cashu de par para par pela malha",
  "settings.general.feature_wallet_a11y": "Carteira (sempre ligada)",
  "settings.general.feature_ai_desc":
    "Assistente privado no próprio dispositivo, sem chamadas de rede",
  "settings.general.feature_feeds": "Feeds",
  "settings.general.feature_feeds_desc":
    "Lê e publica nos feeds do Bluesky e do Mastodon",
  "settings.general.show_media": "Mostrar multimédia automaticamente",
  "settings.general.show_media_desc":
    "As fotografias e os vídeos aparecem na conversa, ou ficam atrás de um toque",
  "settings.general.reset": "Repor as definições",
  "settings.general.media_retention": "Guardar multimédia durante",
  "settings.general.media_retention_desc":
    "As fotografias, os vídeos e as notas de voz são eliminados depois do tempo escolhido",
  "settings.general.media_retention_sheet":
    "Escolhe quanto tempo a multimédia fica neste dispositivo. Multimédia eliminada não pode ser recuperada.",
  "settings.general.retention_7_desc":
    "O mínimo deixado para trás. Melhor se o risco for o próprio telemóvel.",
  "settings.general.retention_14_desc":
    "Um meio-termo para uma ou duas semanas longe da rede.",
  "settings.general.retention_30_desc":
    "Mantém as conversas legíveis mais tempo, e ocupa mais disco.",
  "settings.general.reset_desc":
    "Repõe todas as preferências nos valores originais, deixando intactos a tua identidade, mensagens, contactos e carteira",
  "settings.general.reset_title": "Repor as definições?",
  "settings.general.reset_body":
    "Todas as preferências voltam ao original: aspeto, anular o envio, e a ligação (Internet, Tor, ponte de Internet, ponte de malha, relays). A tua identidade, mensagens, contactos e carteira ficam intactos.",
  "settings.general.reset_confirm": "Repor",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Sigilo persistente",
  "settings.security.forward_secrecy_desc":
    "O Double Ratchet está sempre ligado nas mensagens diretas",
  "settings.security.signed_packets": "Pacotes assinados",
  "settings.security.signed_packets_desc": "Cada pacote é assinado com Ed25519",
  "settings.security.hide_previews":
    "Ocultar as pré-visualizações nas notificações",
  "settings.security.hide_previews_desc":
    "Mantém o remetente e a mensagem fora do ecrã bloqueado, que os mostra sem ser preciso desbloquear",
  "settings.security.no_blocked": "Nenhum par bloqueado",
  "settings.security.no_blocked_desc":
    "Os pares bloqueados não te podem escrever nem aparecem no separador Malha",
  "settings.security.unblock_title": "Desbloquear este par",
  "settings.security.unblock": "Desbloquear",
  "settings.security.unblock_peer": "Desbloquear {name}",
  "settings.security.unblock_body":
    "{name} vai poder escrever-te de novo e volta a aparecer no separador Malha quando estiver por perto.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Recurso à Internet",
  "settings.network.internet_desc":
    "Continua pelos relays Nostr quando os pares da malha estão fora de alcance",
  "settings.network.internet_off_title": "Desligar a Internet?",
  "settings.network.internet_off_body":
    "O Airhop vai funcionar só com Bluetooth. Deixa de contactar qualquer relay Nostr, e o Tor, a ponte de Internet e a ponte de malha desligam-se todos. A conversa por Bluetooth por perto continua a funcionar.",
  "settings.network.turn_off": "Desligar",
  "settings.network.discovery": "Descoberta de relays por localização",
  "settings.network.discovery_desc":
    "Escolhe automaticamente os relays mais próximos de uma célula de localização entre mais de 300 distribuídos",
  "settings.network.discovery_needs_relay":
    "Adiciona antes um relay personalizado",
  "settings.network.discovery_needs_relay_body":
    "É a descoberta automática que aponta o Airhop aos relays mais próximos. Desligá-la só faz sentido depois de fixares os teus próprios relays abaixo, por isso adiciona pelo menos um antes.",
  "settings.network.custom_only_title":
    "Usar só os teus relays personalizados?",
  "settings.network.custom_only_body":
    "Os canais de localização e a ponte de malha deixam de escolher automaticamente os relays mais próximos e usam só os que adicionaste. Isto pode reduzir o alcance, e podes deixar de encontrar utilizadores do bitchat, que convergem nos relays mais próximos.",
  "settings.network.custom": "Relays personalizados",
  "settings.network.custom_desc":
    "Adiciona os teus próprios relays para os canais de localização e a ponte de malha",
  "settings.network.custom_added": "{count} de {max} adicionados",
  "settings.network.dm_relays": "Relays de mensagens",
  "settings.network.dm_relays_desc":
    "As mensagens diretas e os canais privados usam sempre estes. Os relays personalizados não os alteram.",
  "settings.network.discovery_back_on":
    "Descoberta de relays por localização ligada de novo",
  "settings.network.discovery_back_on_body":
    "Esse era o teu último relay personalizado. Os canais de localização precisam de algum sítio onde publicar, por isso o Airhop voltou a escolher automaticamente os relays mais próximos.",
  "settings.network.add_relay": "Adicionar relay",
  "settings.network.remove_relay": "Remover {url}",
  "settings.network.add_short": "Adicionar",
  "settings.network.relay_limit":
    "Podes adicionar {count} relays. Remove um para adicionares outro.",
  "settings.network.relay_duplicate": "Esse relay já está na tua lista.",
  "settings.network.relay_invalid":
    "Escreve um anfitrião de relay válido, por exemplo relay.example.com. Só é preciso uma porta se o relay não usar a predefinida. Não são permitidos endereços IP nem nomes locais.",
  "settings.network.lan": "Rede local",
  "settings.network.lan_desc":
    "Alcance quem está na mesma WiFi, incluindo entre iPhone e Android. Outros dispositivos na rede podem ver que está a usar o Airhop.",
  "settings.network.lan_searching": "Nenhum dispositivo Airhop nesta rede",
  "settings.network.lan_active": "Ligado nesta rede",
  "settings.network.lan_unavailable": "Não está numa rede WiFi",
  "settings.network.lan_permission":
    "O acesso à rede local está desligado para o Airhop",
  "settings.network.lan_unsupported": "Não disponível neste dispositivo",
  "settings.network.lan_foreground":
    "Pausa quando o Airhop está em segundo plano. O Bluetooth continua.",
  "settings.network.wifi_pair": "Emparelhamento",
  "settings.network.wifi_paired": "Dispositivos emparelhados",
  "settings.network.wifi_pair_find": "Encontrar um dispositivo",
  "settings.network.wifi_pair_find_desc":
    "Procurar um iPhone por perto que se esteja a mostrar. Ambos precisam de iOS 26 ou posterior.",
  "settings.network.wifi_pair_show": "Mostrar este iPhone",
  "settings.network.wifi_pair_show_desc":
    "Deixe um iPhone por perto encontrar este. Um procura e o outro mostra-se, ao mesmo tempo.",
  "settings.network.wifi_pair_find_action": "Escolher um iPhone por perto",
  "settings.network.wifi_pair_show_action": "Tornar este iPhone detetável",
  "settings.network.wifi_pair_unavailable":
    "O Wi-Fi Aware não está disponível de momento",
  "settings.network.wifi_pair_forget":
    "Remova um emparelhamento na app Settings",
  "settings.network.bitchat": "Compatibilidade com o bitchat",
  "settings.network.bitchat_desc":
    "A mesma malha BLE do bitchat, totalmente interoperável. Está sempre ligada e não pode ser desativada.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Funcionar em segundo plano",
  "settings.conn.background_desc":
    "Mantém a malha a funcionar com o Airhop fechado",
  "settings.conn.background_on_title": "Manter a malha a funcionar?",
  "settings.conn.background_on_body":
    "O Airhop continua a repassar e a receber quando está fechado, por isso as mensagens chegam enquanto estás fora. Enquanto o faz, o Android mostra uma notificação permanente.",
  "settings.conn.background_off_title": "Parar a malha quando o Airhop fecha?",
  "settings.conn.background_off_body":
    "As mensagens só chegam com o Airhop aberto, e este telemóvel deixa de repassar para quem está por perto. A notificação permanente desaparece.",
  "settings.conn.live_voice": "Voz em direto",
  "settings.conn.live_voice_desc":
    "Fala com quem está por perto como num walkie-talkie",
  "settings.conn.live_voice_on_title": "Ligar a voz em direto?",
  "settings.conn.live_voice_on_body":
    "Manter o microfone premido envia a tua voz a toda a gente dentro do alcance do Bluetooth à medida que falas, e a voz deles toca no teu telemóvel. Nada é gravado.",
  "settings.conn.live_voice_off_title": "Desligar a voz em direto?",
  "settings.conn.live_voice_off_body":
    "Manter o microfone premido grava antes uma nota de voz. Ela sai quando largares, e ninguém a ouve até a reproduzir.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Encaminhamento por Tor",
  "settings.conn.tor_desc":
    "Encaminha o tráfego Nostr pelo Tor para mais privacidade",
  "settings.conn.tor_on_title": "Encaminhar o tráfego Nostr pelo Tor?",
  "settings.conn.tor_on_body":
    "Os relays deixam de ver o teu endereço IP. Ligar demora mais e as mensagens chegam mais devagar. O Bluetooth não é afetado.",
  "settings.conn.tor_off_title": "Desligar o encaminhamento por Tor?",
  "settings.conn.tor_off_body":
    "O tráfego Nostr volta à tua ligação normal, por isso os relays voltam a ver o teu endereço IP. De qualquer forma, o Bluetooth não é afetado.",
  "settings.conn.tor_unavailable":
    "O encaminhamento por Tor não está disponível nesta versão.",
  "settings.conn.tor_timeout":
    "O Tor está a demorar mais de um minuto a ligar-se. Fica ligado e continua a tentar; o separador Malha diz quando estiver a encaminhar, ou se esta rede o estiver a bloquear.",
  "settings.conn.tor_failed":
    "Não foi possível iniciar o Tor. Confirma que a aplicação tem acesso à rede.",
  "settings.conn.mint_clearnet":
    "Permitir o tráfego da casa de emissão pela rede aberta",
  "settings.conn.mint_clearnet_desc":
    "No iOS o Tor só cobre o Nostr. Deixa desligado para bloquear os pedidos à casa de emissão; de qualquer forma o ecash pela malha continua a funcionar.",
  "settings.conn.gateway": "Ponte de Internet",
  "settings.conn.gateway_desc":
    "Empresta a tua ligação a um telemóvel offline por perto para que ele ainda alcance os canais de localização",
  "settings.conn.gateway_on_title": "Ligar a ponte de Internet?",
  "settings.conn.gateway_on_body":
    "Os telemóveis por perto sem ligação própria vão enviar e receber mensagens dos canais de localização pela tua. Usa os teus dados móveis e a tua bateria, e as mensagens deles continuam encriptadas ponta a ponta, por isso não consegues ler o que passa.",
  "settings.conn.gateway_off_title": "Desligar a ponte de Internet?",
  "settings.conn.gateway_off_body":
    "Os telemóveis offline por perto deixam de alcançar os canais de localização pela tua ligação. As tuas próprias mensagens não são afetadas.",
  "settings.conn.bridge": "Ponte de malha",
  "settings.conn.bridge_desc":
    "Liga a conversa pública #bluetooth desta área a outro grupo de Bluetooth fora de alcance, pela Internet",
  "settings.conn.bridge_on_title": "Ligar a ponte de malha?",
  "settings.conn.bridge_on_body":
    "As tuas mensagens públicas em #bluetooth vão ser publicadas no teu bairro pela Internet, para que quem está além do alcance do Bluetooth as possa ler. As mensagens privadas nunca passam pela ponte, e “só por perto” mantém qualquer mensagem local.",
  "settings.conn.bridge_off_title": "Desligar a ponte de malha?",
  "settings.conn.bridge_off_body":
    "As tuas mensagens públicas em #bluetooth voltam a ficar dentro do alcance do Bluetooth, e as mensagens do grupo do outro lado deixam de chegar aqui.",
  "settings.conn.bridge_needs_location":
    "A ponte de malha precisa da localização",
  "settings.conn.bridge_needs_location_desc":
    "Encontra o teu bairro a partir de uma localização. Concede a localização para começar a fazer a ponte.",
  "settings.conn.grant_location": "Conceder a permissão de localização",
  "settings.conn.grant_short": "Conceder",
  "settings.conn.internet_off": "A Internet está desligada",
  "settings.conn.internet_off_desc":
    "O Tor, a ponte de malha e a ponte de Internet usam todos a Internet. Liga o Recurso à Internet em Rede para os usares.",
  "settings.conn.turn_on": "Ligar",
  "settings.conn.turn_off": "Desligar",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Encontra dispositivos por perto e passa mensagens entre eles. Sem isto, a malha não pode funcionar.",
  "settings.permissions.location": "Localização",
  "settings.permissions.location_desc":
    "Abre os canais das áreas próximas. Sem isto, esses canais ficam fechados e a malha Bluetooth continua normalmente.",
  "settings.permissions.notifications": "Notificações",
  "settings.permissions.notifications_desc":
    "Recebe avisos de mensagens novas mesmo com a aplicação fechada. Sem isto, só as vês quando abres o Airhop.",
  "settings.permissions.camera": "Câmara",
  "settings.permissions.camera_desc":
    "Lê códigos QR e capta fotografias ou vídeos para enviar. Sem isto, ainda podes partilhar multimédia da tua galeria.",
  "settings.permissions.photos": "Fotografias",
  "settings.permissions.photos_desc":
    "Envia fotografias da tua galeria e guarda a multimédia recebida. Sem isto, ainda podes tirar e enviar fotografias novas com a câmara.",
  "settings.permissions.microphone": "Microfone",
  "settings.permissions.microphone_desc":
    "Grava e envia mensagens de voz ou usa a voz em direto. Sem isto, as mensagens de voz e a voz em direto não funcionam.",
  "settings.permissions.allow": "Conceder esta permissão",
  "settings.permissions.open_settings":
    "Abrir as definições do sistema para alterar esta permissão",
  "settings.permissions.system": "Sistema",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Utilização da rede",
  "settings.storage.storage_usage": "Utilização do armazenamento",
  "settings.storage.storage_usage_desc":
    "Mensagens, provas da carteira e anexos em cache",
  "settings.storage.session_usage":
    "Esta sessão · {sent} enviados, {received} recebidos",
  "settings.storage.cache": "Cache",
  "settings.storage.cache_desc": "{size} de anexos",
  "settings.storage.clear_cache": "Limpar a cache de anexos",
  "settings.storage.clear": "Limpar",
  "settings.storage.clear_title": "Limpar a multimédia em cache?",
  "settings.storage.clear_body":
    "As fotografias, os vídeos, as notas de voz e os ficheiros são removidos deste dispositivo, tanto os enviados como os recebidos. Não podem ser transferidos de novo: os balões vão dizê-lo, e podes pedir a quem enviou que reenvie. As mensagens e a carteira ficam intactas.",
  "settings.storage.cleared": "Cache limpa",
  "settings.storage.freed": "Libertou {size}.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Definir o aspeto para {value}",
  "settings.font.set_a11y": "Definir o tipo de letra monoespaçado para {value}",
  "settings.font.system": "Sistema",
  "settings.font.system_desc":
    "Usa o tipo de letra monoespaçado predefinido do teu dispositivo",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Moderno e fácil de ler",
  "settings.language.en": "Inglês",
  "settings.language.am": "Amárico",
  "settings.language.ar": "Árabe",
  "settings.language.bn": "Bengali",
  "settings.language.my": "Birmanês",
  "settings.language.zh_hans": "Chinês (simplificado)",
  "settings.language.zh_hant": "Chinês (tradicional)",
  "settings.language.nl": "Neerlandês",
  "settings.language.fil": "Filipino",
  "settings.language.fr": "Francês",
  "settings.language.ka": "Georgiano",
  "settings.language.de": "Alemão",
  "settings.language.hi": "Hindi",
  "settings.language.id": "Indonésio",
  "settings.language.it": "Italiano",
  "settings.language.ja": "Japonês",
  "settings.language.ko": "Coreano",
  "settings.language.mg": "Malgaxe",
  "settings.language.ms": "Malaio",
  "settings.language.ne": "Nepalês",
  "settings.language.fa": "Persa",
  "settings.language.pl": "Polaco",
  "settings.language.pt_br": "Português (Brasil)",
  "settings.language.pt_pt": "Português (Portugal)",
  "settings.language.pa": "Punjabi",
  "settings.language.ru": "Russo",
  "settings.language.es": "Espanhol",
  "settings.language.sw": "Suaíli",
  "settings.language.sv": "Sueco",
  "settings.language.ta": "Tâmil",
  "settings.language.th": "Tailandês",
  "settings.language.tr": "Turco",
  "settings.language.uk": "Ucraniano",
  "settings.language.ur": "Urdu",
  "settings.language.vi": "Vietnamita",
  "settings.language.pseudo": "Pseudolocalização",
  "settings.language.soon": "Em breve",
  "settings.language.soon_a11y": "{value}, em breve",
  "settings.language.set_a11y": "Definir o idioma para {value}",
  "settings.language.pending": "Na próxima abertura",
  "settings.language.pending_a11y":
    "{value}, aplica-se da próxima vez que abrires o Airhop",
  "settings.language.rtl_restart": "Reabrir agora",
  "settings.language.rtl_title": "Reabre o Airhop para concluir",
  "settings.language.rtl_body":
    "{value} lê-se da direita para a esquerda, e o Airhop só pode mudar de direção quando arranca. Fecha-o e abre-o outra vez para concluir a mudança. Nada se perde, e a tua malha mantém-se ligada até lá.",
  "settings.theme.light": "Claro",
  "settings.theme.light_desc": "Usar sempre a paleta clara",
  "settings.theme.dark": "Escuro",
  "settings.theme.dark_desc": "Usar sempre a paleta escura",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Online",
  "settings.status.online_desc": "Detetável, a anunciar e a procurar",
  "settings.status.away": "Ausente",
  "settings.status.away_desc": "Malha em pausa, sem procurar nem anunciar",
  "settings.status.invisible": "Invisível",
  "settings.status.invisible_desc": "A procurar, mas escondido da descoberta",
  "settings.status.title": "Estado",
  "settings.status.set_a11y": "Definir o estado para {value}",
  "settings.status.edit": "Editar o estado",
  "settings.status.desc": "Escolhe o quanto estás visível na malha.",
  "settings.transfer.identity": "Identidade e chaves",
  "settings.transfer.identity_desc":
    "O teu ID de par, nome de utilizador e contactos",
  "settings.transfer.chats": "Conversas e histórico",
  "settings.transfer.chats_desc":
    "Conversas, grupos e os canais em que entraste",
  "settings.transfer.wallet": "Saldo da carteira",
  "settings.transfer.wallet_desc": "Provas Cashu e histórico de transações",
  "settings.transfer.title": "Transferir para um telemóvel novo",
  "settings.transfer.desc":
    "Move a tua identidade, conversas e carteira para outro dispositivo",
  "settings.transfer.coming_soon_a11y":
    "Transferir para um telemóvel novo, em breve",
  "settings.transfer.body":
    "Encosta os dois telemóveis um ao outro e passa tudo por Bluetooth. Nada passa por um servidor, por isso funciona sem Internet.",
  "settings.qr.permission_label": "Acesso às fotografias",
  "settings.qr.permission_purpose": "guardar o teu código QR",
  "settings.qr.saved": "Guardado",
  "settings.qr.saved_body": "Código QR guardado na tua galeria de fotografias.",
  "settings.qr.save_failed": "Não foi possível guardar",
  "settings.qr.save_failed_body":
    "Não foi possível guardar o código QR. Tenta de novo.",
  "settings.qr.share_message": "Adiciona-me no Airhop",
  "settings.qr.share_body":
    "Adiciona-me no Airhop — mensagens em malha privadas, feitas primeiro para o offline.",
  "settings.qr.show_short": "Mostrar QR",
  "settings.qr.title": "O teu código QR",
  "settings.qr.note":
    "Contém as tuas chaves públicas, que permitem que te escrevam de qualquer lugar. Partilha-o só com quem confias. Não muda a menos que apagues a tua identidade.",
  "settings.qr.code_label": "Código de contacto",
  "settings.qr.copy_code": "Copiar o código de contacto",
  "settings.qr.share": "Partilhar o código QR",
  "settings.qr.share_short": "Partilhar QR",
  "settings.qr.download": "Transferir o código QR",
  "settings.qr.download_short": "Transferir QR",
  "settings.qr.show": "Mostrar o código QR",
  "settings.wipe.trigger": "Acionar a limpeza de emergência",
  "settings.wipe.trigger_desc":
    "Toca três vezes para limpar de imediato sem confirmar",
  "settings.wipe.title": "Limpeza de emergência",
  "settings.wipe.now": "Limpar agora",
  "settings.wipe.desc":
    "Destrói de imediato todas as chaves, mensagens e provas",
  "settings.wipe.body":
    "Isto vai destruir de imediato todas as tuas chaves, mensagens e provas da carteira. Não é possível anular.",
  "settings.wipe.in_progress": "A limpar",
  "settings.wipe.in_progress_body":
    "A destruir as tuas chaves, mensagens e ficheiros. Demora alguns segundos, e termina sozinho mesmo que a aplicação seja fechada.",
  "settings.wipe.got_it": "Percebi",
  "settings.wipe.keys_failed": "Não foi possível destruir as chaves",
  "settings.wipe.keys_failed_body":
    "As tuas mensagens, contactos e carteira desapareceram, mas o dispositivo recusou libertar as tuas chaves. Desbloqueia o dispositivo e limpa de novo.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Contacta-nos",
  "settings.help.contact_a11y": "Enviar e-mail para {address}",
  "settings.help.bug": "Comunicar um erro",
  "settings.help.bug_desc": "Abre uma issue no GitHub",
  "settings.help.bug_a11y": "Comunicar um erro no GitHub",
  "settings.help.faq": "Perguntas frequentes",
  "settings.help.faq_desc": "Respostas às dúvidas mais comuns",
  "settings.help.faq_a11y": "Abrir as perguntas frequentes",
  "settings.help.terms_desc": "Como o Airhop pode ser usado",
  "settings.help.terms_a11y": "Abrir os Termos de Serviço",
  "settings.help.privacy_desc": "O que não recolhemos",
  "settings.help.privacy_a11y": "Abrir a Política de Privacidade",

  // ---- Settings: support ----
  "settings.support.card": "Cartão ou UPI",
  "settings.support.card_desc": "Homebanking e carteiras, em todo o mundo",
  "settings.support.card_a11y":
    "Apoiar por cartão, UPI, homebanking ou carteira",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Mensal ou pontual, sem comissão da plataforma",
  "settings.support.sponsors_a11y": "Apoiar através do GitHub Sponsors",
  "settings.support.note":
    "Faço o Airhop nos tempos livres. Não há investidores nem anúncios. Se te for útil, uma contribuição ajuda muito a manter o desenvolvimento ativo. De qualquer forma, todas as funcionalidades continuam gratuitas.",

  // ---- Settings: about and version ----
  "settings.about.version": "Versão",
  "settings.about.version_desc": "Versão atual",
  "settings.about.version_a11y": "Ver a versão e procurar atualizações",
  "settings.about.release_notes": "Notas da versão",
  "settings.about.release_notes_desc":
    "O que há de novo na versão mais recente",
  "settings.about.release_notes_a11y":
    "Abrir as notas da versão mais recente no GitHub",
  "settings.about.source": "Código-fonte",
  "settings.about.source_a11y": "Abrir o código-fonte no GitHub",
  "settings.about.licenses": "Licenças de código aberto",
  "settings.about.open_repo": "Abrir o repositório {name}",
  "settings.about.licenses_desc": "Pacotes de código aberto de terceiros",
  "settings.about.licenses_a11y": "Ver as licenças de terceiros",
  "settings.version.codename": "Nome de código",
  "settings.version.checking": "A procurar",
  "settings.version.check": "Procurar atualizações",
  "settings.version.checking_title": "A procurar atualizações",
  "settings.version.up_to_date": "Estás na versão mais recente.",
  "settings.version.release_notes": "Ver as notas da versão",
  "settings.version.made_with": "Feito com",
  "settings.version.number": "Versão {version}",
  "settings.version.update_to": "Atualizar para {version}",
  "settings.version.update_to_a11y": "Atualizar para a versão {version}",
  "settings.version.released_under": "Lançado sob {license}",
  "settings.version.notes_a11y": "Ver as notas da versão {version}",
  "settings.version.tor_paused":
    "A procura de atualizações fica em pausa com o Tor ligado, para não expor o teu IP. Consulta a página de versões num navegador.",
  "settings.version.check_failed":
    "Não foi possível procurar atualizações. Verifica a tua ligação e tenta de novo.",
  "settings.version.downloading": "A transferir {percent}%",
  "settings.version.install": "Instalar",
  "settings.version.download_failed":
    "A transferência falhou. Verifique a sua ligação e tente novamente.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} tem {size} KiB e passa do limite de {cap} KiB.",
  "transfer.failed.malformed":
    "Um anexo chegou danificado e não abriu. Pede à pessoa que o envie de novo.",
  "transfer.failed.unsupported_type":
    "Um anexo chegou num formato que esta aplicação não consegue abrir.",
  "transfer.failed.type_mismatch":
    "Um anexo foi recusado: o conteúdo não corresponde ao tipo de ficheiro declarado.",
  "transfer.failed.storage":
    "Um anexo chegou mas não pôde ser guardado. Verifica o espaço livre.",
  "transfer.badge.waiting": "A aguardar · {name}",
  "transfer.badge.active_count": "{count} transferências",
  "transfer.badge.sending": "A enviar {name}",
  "transfer.badge.receiving": "A receber {name}",
  "transfer.badge.a11y": "{label}, {percent} por cento. Abrir a conversa.",
  "transfer.kind.photo": "Fotografia",
  "transfer.kind.video": "Vídeo",
  "transfer.kind.voice": "Nota de voz",
  "transfer.this.photo": "Esta fotografia",
  "transfer.this.video": "Este vídeo",
  "transfer.this.voice": "Esta nota de voz",
  "transfer.this.file": "Este ficheiro",
  "transfer.kind.document": "Documento",
  "transfer.kind.voice_preview": "Nota de voz",
  "transfer.kind.photo_preview": "Fotografia",
  "transfer.kind.video_preview": "Vídeo",
  "transfer.kind.document_preview": "Documento",

  // ---- System notifications ----
  "notif.channel.messages": "Mensagens",
  "notif.channel.nearby": "Pares por perto",
  "notif.channel.nearby_desc":
    "Um aviso ocasional quando a malha encontra gente dentro do alcance do Bluetooth.",
  "notif.nearby.body":
    "Dentro do alcance do Bluetooth agora. Toca para abrir a malha.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Alguém",
  "notif.notice_urgent": "Aviso urgente · {content}",
  "notif.notice": "Aviso · {content}",
  "notif.incoming_file": "Ficheiro a chegar",
  "notif.preview.photo": "📷 Fotografia",
  "notif.preview.voice": "🎤 Mensagem de voz",
  "notif.preview.video": "🎥 Vídeo",
  "notif.preview.document": "📄 Documento",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Mensagem nova",
  "notif.hidden.channel": "Atividade nova",
  "notif.hidden.mention": "Foste mencionado",
  "notif.mention.title": "{sender} mencionou-te",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Mostrar mais {count}",
    many: "Mostrar mais {count}",
    other: "Mostrar mais {count}",
  },
  "chat.channels.show_more_a11y": {
    one: "Mostrar mais {count} canal predefinido",
    many: "Mostrar mais {count} canais predefinidos",
    other: "Mostrar mais {count} canais predefinidos",
  },

  // ---- Chats: vocabulary shared by both lists ----
  "a11y.unread_count": {
    one: "{label}, {count} não lida",
    many: "{label}, {count} não lidas",
    other: "{label}, {count} não lidas",
  },
  "a11y.new_count": {
    one: "{label}, {count} nova",
    many: "{label}, {count} novas",
    other: "{label}, {count} novas",
  },
  "chat.a11y.unread": {
    one: "{count} não lida",
    many: "{count} não lidas",
    other: "{count} não lidas",
  },
  "chat.thread.length_left": {
    one: "resta {count}",
    many: "restam {count}",
    other: "restam {count}",
  },
  "settings.general.retention_days": {
    one: "{count} dia",
    many: "{count} dias",
    other: "{count} dias",
  },
  "chat.info.group_reach": {
    one: "{reachable} de {count} membro acessível",
    many: "{reachable} de {count} membros acessíveis",
    other: "{reachable} de {count} membros acessíveis",
  },
  "chat.group_members": {
    one: "Grupo privado  ·  {count} membro",
    many: "Grupo privado  ·  {count} membros",
    other: "Grupo privado  ·  {count} membros",
  },
  "chat.select.count": {
    one: "{count} selecionada",
    many: "{count} selecionadas",
    other: "{count} selecionadas",
  },
  "chat.select.forward": {
    one: "Reencaminhar {count} mensagem",
    many: "Reencaminhar {count} mensagens",
    other: "Reencaminhar {count} mensagens",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} a falar",
    many: "{count} a falar",
    other: "{count} a falar",
  },

  // ---- Mesh: peer list ----
  "mesh.peers_in_range": {
    one: "{count} par ao alcance",
    many: "{count} pares ao alcance",
    other: "{count} pares ao alcance",
  },
  "mesh.peer.hops_away": {
    one: "a {count} salto",
    many: "a {count} saltos",
    other: "a {count} saltos",
  },
  "chat.presence.active": {
    one: "{count} ativo",
    many: "{count} ativos",
    other: "{count} ativos",
  },
  "chat.presence.nearby": {
    one: "{count} por perto",
    many: "{count} por perto",
    other: "{count} por perto",
  },

  // ---- Wallet: mints ----
  "wallet.mint_count": {
    one: "{count} mint",
    many: "{count} mints",
    other: "{count} mints",
  },
  "wallet.mint.remove_body": {
    one: "{mint} tem {balance} {unit} em {count} prova. Removê-lo apaga essa prova deste dispositivo para sempre, e não há cópia de segurança dela. Levanta ou envia primeiro o saldo.",
    many: "{mint} tem {balance} {unit} em {count} provas. Removê-lo apaga essas provas deste dispositivo para sempre, e não há cópia de segurança delas. Levanta ou envia primeiro o saldo.",
    other:
      "{mint} tem {balance} {unit} em {count} provas. Removê-lo apaga essas provas deste dispositivo para sempre, e não há cópia de segurança delas. Levanta ou envia primeiro o saldo.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} depósito a aguardar pagamento. É verificado de novo sempre que a aplicação abre.",
    many: "{count} depósitos a aguardar pagamento. São verificados de novo sempre que a aplicação abre.",
    other:
      "{count} depósitos a aguardar pagamento. São verificados de novo sempre que a aplicação abre.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{count} prova por gastar recuperada de {mints}.",
    many: "{count} provas por gastar recuperadas de {mints}.",
    other: "{count} provas por gastar recuperadas de {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "Foi encontrada {count} moeda, mas já tinha sido gasta, por isso nada foi creditado por ela. É normal: cada moeda que alguma vez gastaste continua nos registos que o mint guarda.",
    many: "Foram encontradas {count} moedas, mas já tinham sido gastas, por isso nada foi creditado por elas. É normal: cada moeda que alguma vez gastaste continua nos registos que o mint guarda.",
    other:
      "Foram encontradas {count} moedas, mas já tinham sido gastas, por isso nada foi creditado por elas. É normal: cada moeda que alguma vez gastaste continua nos registos que o mint guarda.",
  },

  // ---- Wallet: pending and activity ----
  "wallet.activity.show_more": {
    one: "Mostrar mais {count}",
    many: "Mostrar mais {count}",
    other: "Mostrar mais {count}",
  },
  "wallet.activity.show_more_a11y": {
    one: "Mostrar mais {count} pagamento",
    many: "Mostrar mais {count} pagamentos",
    other: "Mostrar mais {count} pagamentos",
  },
  "wallet.mint.unconfirmed_count": {
    one: "{count} por confirmar",
    many: "{count} por confirmar",
    other: "{count} por confirmar",
  },
  "wallet.proof_count": {
    one: "{count} prova",
    many: "{count} provas",
    other: "{count} provas",
  },
  "wallet.spent_removed_detail": {
    one: "{count} prova já tinha sido gasta, e foi removida.",
    many: "{count} provas já tinham sido gastas, e foram removidas.",
    other: "{count} provas já tinham sido gastas, e foram removidas.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Há alguém por perto",
    many: "Há {count} pessoas por perto",
    other: "Há {count} pessoas por perto",
  },
};

export const ptPT = { strings, plurals };
