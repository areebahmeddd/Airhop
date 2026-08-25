// pt-BR: translated from src/i18n/locales/en.ts, which carries
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
  "common.delete": "Excluir",
  "common.remove": "Remover",
  "common.add": "Adicionar",
  "common.copy": "Copiar",
  "common.copied": "Copiado",
  "common.share": "Compartilhar",
  "common.continue": "Continuar",
  "common.try_again": "Tentar de novo",
  "common.settings": "Configurações",
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
  "nav.tab.profile": "Você",
  "a11y.tab.new_peers": "{label}, alguém novo por perto",
  "nav.notifications": "Notificações",
  "chat.subtab.channels": "Canais",
  "chat.subtab.direct": "Diretas",
  "chat.subtab.dms": "Mensagens diretas",
  "chat.search.placeholder": "Buscar nas conversas…",
  "chat.search.a11y": "Buscar em conversas e mensagens",
  "chat.search.close": "Fechar a busca",
  "chat.search.clear": "Limpar a busca",
  "mesh.view.radar": "Visão de radar",
  "mesh.view.list": "Visão de lista",
  "mesh.view.radar_short": "Radar",
  "mesh.view.list_short": "Lista",

  // ---- Legal document names ----
  "legal.last_updated": "Última atualização: {date}",
  "legal.terms": "Termos de Serviço",
  "legal.privacy": "Política de Privacidade",

  // ---- Onboarding: welcome ----
  "onboarding.welcome.tagline": "Comunicação em malha privada",
  "onboarding.welcome.cta": "Começar",
  "onboarding.welcome.cta_hint": "Aceite os termos abaixo para continuar",
  "onboarding.welcome.consent_a11y":
    "Aceitar os Termos de Serviço e a Política de Privacidade",
  "onboarding.welcome.open_terms": "Abrir os Termos de Serviço",
  "onboarding.welcome.open_privacy": "Abrir a Política de Privacidade",
  "onboarding.welcome.consent":
    "Ao tocar em {cta}, você aceita nossos {terms} e nossa {privacy}.",

  // ---- Onboarding: identity generation ----
  "onboarding.identity.heading": "Gerando sua identidade",
  "onboarding.identity.body":
    "Criando um par de chaves Ed25519 neste aparelho.\nNada é enviado a lugar nenhum.",
  "onboarding.identity.failed_heading": "Não foi possível criar suas chaves",
  "onboarding.identity.failed_body":
    "Este aparelho não deixou o Airhop guardá-las com segurança. Tente de novo, ou reinicie o celular e abra o Airhop outra vez.",
  "onboarding.identity.steps_a11y": "Etapas: {steps}",
  "onboarding.identity.step.x25519": "Gerando o par de chaves estáticas X25519",
  "onboarding.identity.step.ed25519":
    "Gerando o par de chaves de assinatura Ed25519",
  "onboarding.identity.step.keychain":
    "Guardando as chaves no chaveiro do sistema",
  "onboarding.identity.step.peer_id": "Derivando o ID de par",

  // ---- Onboarding: your identity ----
  "onboarding.username.label": "Seu nome na malha",
  "onboarding.username.peer_id": "ID de par",
  "onboarding.username.card_a11y":
    "Seu nome na malha é {username}. ID de par {peerID}. {props}.",
  "onboarding.username.explanation":
    "Este nome de usuário é derivado de forma determinística da sua chave pública. Ele é o mesmo em todo aparelho que enxerga seu ID de par.",
  "onboarding.username.cta": "Entrar no Airhop",
  "onboarding.username.prop.algorithm": "Algoritmo",
  "onboarding.username.prop.storage": "Armazenamento",
  "onboarding.username.prop.storage_value": "Somente o chaveiro do sistema",
  "onboarding.username.prop.account": "Conta necessária",
  "onboarding.username.prop.account_value": "Nenhuma",

  // ---- Onboarding: the author's note ----
  "onboarding.hello.title": "Boas-vindas ao Airhop",
  "onboarding.hello.p1":
    "Olá. O Airhop é construído sobre o bitchat como um projeto paralelo independente e de código aberto. Não tem vínculo nem aval do projeto bitchat ou da permissionless tech: é só algo que eu gosto de construir e compartilhar com a comunidade.",
  "onboarding.hello.p2":
    "Esta é a primeira versão para iOS e Android, então mesmo tendo testado com amigos, você provavelmente vai esbarrar em alguns erros. Se isso acontecer, ou se você tiver uma ideia de recurso, eu adoraria saber. Abra uma issue no {github} ou me escreva em {email}.",
  "onboarding.hello.p3":
    "Se o Airhop for útil para você, considere deixar uma estrela no {github} ou uma avaliação na {store}. Isso ajuda mais gente a descobrir o projeto. Obrigado por experimentar!",

  // ---- Onboarding: permission primer ----
  "onboarding.primer.title": "Antes de o seu celular perguntar",
  "onboarding.primer.lede":
    "Veja o que cada permissão faz, e o que ela não faz.",
  "onboarding.primer.bluetooth.title": "Bluetooth",
  "onboarding.primer.bluetooth.body":
    "Encontra aparelhos por perto e repassa mensagens entre eles. É assim que a malha nasce, e funciona sem conexão com a internet.",
  "onboarding.primer.location.title": "Localização",
  "onboarding.primer.location.body":
    "Coloca você nos canais das áreas próximas, da quadra à região. O Airhop nunca rastreia você nem envia sua localização exata para fora do aparelho.",
  "onboarding.primer.notifications.title": "Notificações",
  "onboarding.primer.notifications.body":
    "Receba avisos de mensagens novas mesmo com o app fechado. As notificações são criadas no seu aparelho, sem nenhum servidor envolvido.",
  "onboarding.primer.footnote":
    "Você pode recusar. As mensagens continuam viajando pela internet, e dá para mudar de ideia depois nas configurações.",
  "onboarding.primer.cta_a11y": "Continuar para os pedidos de permissão",

  // ---- Permissions: the ask, and the dead end ----
  "permission.bluetooth.label": "Acesso ao Bluetooth",
  "permission.bluetooth.purpose": "encontrar aparelhos por perto na malha",
  "permission.open_settings": "Abrir configurações",
  "permission.not_now": "Agora não",
  "permission.blocked_title": "{label} está desligado",
  "permission.blocked_body": "Ligue nas configurações para {purpose}.",

  // ---- The screen after an unhandled error ----
  "error.boundary.title": "Algo deu errado",
  "error.boundary.body":
    "O Airhop encontrou um problema inesperado e precisou interromper o que estava mostrando.",

  // ---- Chats: channel list ----
  "chat.channels.default": "Canais padrão",
  "chat.channels.yours": "Seus canais",
  "chat.channels.none": "Nenhum canal ainda",
  "chat.channels.none_hint":
    "Toque em {plus} acima para entrar num ou criar um.",
  "chat.channels.none_desc":
    "Nenhum canal ainda. Use o botão de adicionar no cabeçalho para entrar num ou criar um.",
  "chat.channels.show_fewer": "Mostrar menos canais padrão",
  "chat.channels.show_less": "Mostrar menos",
  "chat.channels.info": "Informações do canal",
  "chat.channels.pin": "Fixar o canal",
  "chat.channels.unpin": "Desafixar o canal",
  "chat.channels.mute": "Silenciar o canal",
  "chat.channels.unmute": "Reativar o som do canal",
  "chat.channels.leave": "Sair do canal",
  "chat.channels.leave_confirm": "Sair",
  "chat.channels.clear_body":
    "Excluir todas as mensagens de {name}? Não dá para desfazer.",
  "chat.channels.leave_body":
    "Sair de {name}? Você deixa de receber as mensagens dele, e o histórico é removido deste aparelho.",
  "chat.channels.more_options": "Mais opções para {name}",
  "chat.channels.teleported_tag": "{level}  ·  teletransportado",

  // ---- Chats: direct message list ----
  "chat.dm.clear": "Limpar a conversa",
  "chat.dm.remove_contact": "Remover o contato",
  "chat.dm.block": "Bloquear este par",
  "chat.dm.block_confirm": "Bloquear",
  "chat.dm.delete": "Excluir a conversa",
  "chat.dm.delete_body":
    "Isto tira a conversa da sua lista e exclui as mensagens dela. O contato fica, e uma mensagem nova da pessoa começa uma conversa nova.",
  "chat.dm.in_range": "ao alcance",
  "chat.dm.row_hint": "Toque duas vezes e segure para mais opções",
  "chat.channels.row_hint": "Toque duas vezes e segure para mais opções",
  "chat.dm.you_prefix": "Você:",
  "chat.dm.none": "Nenhuma mensagem direta",
  "chat.dm.none_desc":
    "Vá até a aba Malha e toque num par para começar uma mensagem direta criptografada.",
  "chat.dm.contact_info": "Informações do contato",
  "chat.dm.pin": "Fixar a conversa",
  "chat.dm.unpin": "Desafixar a conversa",
  "chat.dm.mute": "Silenciar a conversa",
  "chat.dm.unmute": "Reativar o som da conversa",
  "chat.dm.clear_body":
    "Excluir todas as mensagens com {name}? Não dá para desfazer.",
  "chat.dm.remove_contact_body":
    "Remover {name}? Isto exclui a conversa e esquece o contato. A pessoa ainda consegue te alcançar se escrever de novo.",
  "chat.dm.block_body":
    "Bloquear {name}? Você não vai vê-la na aba Malha nem receber mensagens dela, mesmo se estiver por perto.",
  "chat.dm.more_options": "Mais opções para {name}",
  "chat.dm.remove_contact_short": "Remover o contato",
  "chat.dm.block_short": "Bloquear o contato",
  "chat.dm.delete_short": "Excluir a conversa",

  // ---- Chats: vocabulary shared by both lists ----
  "chat.clear_messages": "Limpar as mensagens",
  "chat.clear_confirm": "Limpar",
  "chat.group_badge": "Grupo",
  "chat.more": "Mais",
  "chat.no_messages": "Nenhuma mensagem ainda",
  "chat.you": "Você",
  "chat.a11y.channel": "Canal {name}",
  "chat.a11y.group": "Grupo {name}",
  "chat.a11y.muted": "silenciado",
  "chat.a11y.pinned": "fixado",

  // ---- Chats: start something new ----
  "chat.new.title": "Começar algo novo",
  "chat.new.channel": "Criar um canal privado",
  "chat.new.channel_label": "Canal privado",
  "chat.new.channel_desc":
    "Uma sala em que qualquer um com o link pode entrar. Crie uma, ou entre com um link que te mandaram.",
  "chat.new.group": "Criar um grupo privado",
  "chat.new.group_label": "Grupo privado",
  "chat.new.group_desc":
    "Escolha pessoas específicas. Até 16. Fica no Bluetooth.",
  "chat.new.place": "Ir a um lugar por geohash",
  "chat.new.place_label": "Ir a um lugar",
  "chat.new.place_desc":
    "Abra o canal de localização de qualquer lugar pelo geohash dele.",
  "chat.new.reach": "Alcance",
  "chat.new.reach_internet":
    "Alcança os membros por Bluetooth e pela internet.",
  "chat.new.reach_mesh":
    "Funciona dentro do alcance do Bluetooth, não pela internet.",
  "chat.new.reach_internet_desc":
    "Também alcança os membros pela internet. Os relays conseguem ver que o canal está ativo, nunca as mensagens nem quem está nele.",
  "chat.new.reach_mesh_desc":
    "Fica na malha local. O mais privado: nada sai do alcance do Bluetooth.",
  "chat.new.join_link": "Entrar num canal privado com um link de convite",
  "chat.new.back_to_chooser": "Voltar à escolha",
  "chat.new.create_channel": "Criar o canal",
  "chat.new.name_required": "Digite antes um nome de canal",
  "chat.new.name_taken": "Esse nome já está em uso",
  "chat.new.create": "Criar",
  "chat.new.e2ee":
    "Criptografado de ponta a ponta. Só os membros conseguem ler as mensagens.",
  "chat.new.invite_only":
    "Só por convite. Qualquer pessoa com quem você compartilhar o link pode entrar. Ele fica escondido de todo o resto, até dos pares por perto.",
  "chat.new.name_exists": "Já existe um canal com este nome.",
  "chat.new.reach_bluetooth_chip": "Só Bluetooth",
  "chat.new.reach_internet_chip": "Bluetooth + internet",
  "chat.new.have_link": "Entrar com um link de convite",

  // ---- Chats: join by link ----
  "chat.join.title": "Entrar com um link",
  "chat.join.not_airhop": "Esse não é um link do Airhop.",
  "chat.join.reach_internet":
    "Alcança os membros por Bluetooth e pela internet.",
  "chat.join.reach_mesh": "Fica dentro do alcance do Bluetooth.",
  "chat.join.contact_card":
    "Um cartão de contato. Adiciona a pessoa aos seus contatos e abre a conversa.",
  "chat.join.unverified": "Não foi possível verificar esse link",
  "chat.join.unverified_body":
    "O cartão de contato não bate com as próprias chaves, então não foi adicionado. Peça para mandarem um novo.",
  "chat.join.paste": "Colar da área de transferência",
  "chat.join.join": "Entrar",
  "chat.join.public_channel":
    "Canal público {name}. Qualquer um por perto pode ler.",
  "chat.join.private_channel": "Canal privado {name}. {reach}",
  "chat.join.dm_with": "Mensagem direta com {name}.",
  "chat.join.joined_as": "Você entrou como {name}",
  "chat.join.name_clash_body":
    "Você já está em outro {name}. Nomes de canal são só rótulos, então este convite abriu o próprio canal e aquele em que você estava ficou intacto. Dá para renomear qualquer um deles nas informações do canal.",
  "chat.join.paste_hint":
    "Cole um convite que comece com airhop://. Tocar num link também funciona; isto é para um link em que você não consegue tocar.",
  "chat.join.key_note":
    "O convite de um canal privado carrega a chave, então entrar é imediato e nada é pedido a mais ninguém.",
  "chat.join.offline_note":
    "Funciona offline. O link é lido neste aparelho, e o canal alcança até onde quem o criou configurou.",

  // ---- Chats: go to a place ----
  "chat.jump.failed":
    "Não foi possível abrir essa célula. Tente de novo daqui a pouco.",
  "chat.jump.title": "Ir a um lugar",
  "chat.jump.saved": "LUGARES SALVOS",
  "chat.jump.anywhere":
    "Abra o canal de localização público de qualquer lugar, mesmo de um onde você não está.",
  "chat.jump.geohash_note":
    "Digite o geohash dele. Todo mundo cuja localização cai nessa célula compartilha o canal.",
  "chat.jump.teleport_note":
    "Você aparece como teletransportado, não como por perto. Só alcança pela internet.",
  "chat.jump.level_cell": "Célula de {level}",
  "chat.jump.already_here": "Você já está aqui. Ir abre seu canal {name}.",
  "chat.jump.open_direction": "Abrir a célula a {direction}",
  "chat.jump.open_place": "Abrir {name}",
  "chat.jump.remove_place": "Remover {name} dos lugares salvos",
  "chat.jump.go": "Ir",
  "chat.jump.how":
    "Para achar um geohash: abra um canal de localização > toque no nome dele > copie de lá.",

  // ---- Chats: private groups ----
  "chat.group.unreachable":
    "Não foi possível alcançar todos os membros. Tente de novo quando estiverem por perto.",
  "chat.group.you_were_added": "Você foi adicionado a {name}.",
  "chat.group.added_you": "Adicionou você a {name}",
  "chat.group.you_were_removed":
    "Você foi removido de {name}. Não dá mais para ler nem enviar mensagens aqui.",
  "chat.group.removed_you": "Removeu você de {name}",
  "chat.group.add_failed": "Não foi possível adicionar",
  "chat.group.add_failed_body":
    "Nada mudou. Ou a pessoa não está acessível agora, ou o grupo está cheio com 16, ou você não é quem criou.",
  "chat.group.remove_failed": "Não foi possível remover",
  "chat.group.remove_failed_body":
    "Nada mudou. Só quem criou o grupo pode mudar quem está nele.",
  "chat.group.e2ee":
    "Criptografado de ponta a ponta. Só os membros conseguem ler as mensagens.",
  "chat.group.cap":
    "Até 16 pessoas, escolhidas por você. Não existe link de convite, então ninguém entra por ter recebido um encaminhado.",
  "chat.group.bluetooth":
    "Só Bluetooth. Os membros fora de alcance recebem as mensagens quando voltarem.",
  "chat.group.members_label": "MEMBROS",
  "chat.group.none_in_range":
    "Ninguém está ao alcance. Os membros precisam estar por perto quando você cria o grupo.",
  "chat.group.create_title": "Criar um grupo",
  "chat.group.name_placeholder": "Nome do grupo",
  "chat.group.create": "Criar",

  // ---- Chats: coverage and transport ----
  "chat.scope.mesh": "Malha local · só Bluetooth",
  "chat.scope.mesh_desc":
    "Alcança os aparelhos dentro do alcance do Bluetooth (mais ou menos de 10 a 100 metros). Não precisa de internet. Ideal para se organizar no local.",
  "chat.scope.block": "Quadra · ~100 m",
  "chat.scope.block_desc":
    "Cobertura no tamanho de uma quadra. As mensagens passam pela internet para que pares fora do alcance do Bluetooth mas por perto também participem.",
  "chat.scope.neighborhood": "Bairro · ~1 km",
  "chat.scope.neighborhood_desc":
    "Cobertura de bairro. Com ajuda dos relays, os pares de toda a área ficam acessíveis mesmo sem um enlace Bluetooth direto.",
  "chat.scope.city": "Cidade · ~10 km",
  "chat.scope.city_desc":
    "Canal para a cidade inteira. Usa relays de internet geolocalizados para alcançar pares de toda a região metropolitana.",
  "chat.scope.province": "Estado · ~100 km",
  "chat.scope.province_desc":
    "Cobertura estadual. Ligada pela internet para um alcance regional de centenas de quilômetros.",
  "chat.scope.country": "País ou região · ~1000 km",
  "chat.scope.country_desc":
    "Cobertura no país inteiro. Qualquer usuário do Airhop ou do bitchat na região pode entrar e ler as mensagens.",
  "chat.transport.bluetooth": "Só Bluetooth",
  "chat.transport.both": "Bluetooth + internet",
  "chat.transport.internet": "Só internet",

  // ---- Chats: message thread ----
  "chat.cmd.a11y": "Comando /{cmd}: {hint}",
  "chat.cmd.hug_hint": "Mande um abraço",
  "chat.cmd.slap_hint": "Dê um tapa com uma truta grande",
  "chat.status.sending": "Enviando…",
  "chat.status.undo_send": "Desfazer o envio",
  "chat.status.undo": "Desfazer",
  "chat.status.sent": "Enviada",
  "chat.status.received": "Recebida",
  "chat.status.failed": "Falhou",
  "chat.status.canceled": "Cancelada",
  "chat.status.waiting": "Aguardando",
  "chat.status.sending_short": "Enviando",
  "chat.status.receiving": "Recebendo",
  "chat.thread.not_available": "Indisponível aqui",
  "chat.thread.private_channel": "Canal privado",
  "chat.thread.location_channel": "Canal de localização",
  "chat.thread.public_channel": "Canal público",
  "chat.thread.notices": "Avisos deste canal",
  "chat.thread.invite": "Convidar alguém para este canal",
  "chat.thread.not_in_range":
    "Fora do alcance do Bluetooth. Entregando pela internet.",
  "chat.thread.not_nearby":
    "Não está por perto. Vamos entregar quando voltar ao alcance ou ficar online.",
  "chat.thread.no_keys":
    "Você vai precisar estar dentro do alcance do Bluetooth, ou escanear o código da pessoa, para escrever.",
  "chat.geo.card_received":
    "{name} compartilhou o contato. Compartilhe o seu para continuarem conversando depois que um de vocês se mover.",
  "chat.geo.exchange_complete":
    "Contatos trocados. Agora vocês se alcançam de qualquer lugar.",
  "chat.geo.keep_person": "Guardar esta pessoa",
  "chat.geo.keep_person_desc":
    "Compartilhe seu contato para continuarem conversando depois que um de vocês se mover. Ela vai conhecer sua identidade permanente.",
  "chat.geo.card_sent": "Compartilhado · aguardando o dela",
  "chat.thread.left_cell":
    "Você saiu desta área, então a pessoa não consegue te alcançar aqui. Troquem códigos para continuarem conversando de qualquer lugar.",
  "chat.thread.no_route":
    "Não dá para alcançar a pessoa agora. A mensagem sai quando houver uma rota disponível.",
  "chat.thread.empty": "Nenhuma mensagem ainda",
  "chat.thread.empty_desc": "Comece uma conversa criptografada.",
  "chat.thread.jump_latest": "Ir para a última mensagem",
  "chat.thread.back_to_members": "Voltar aos membros",
  "chat.thread.nostr_key": "Chave pública Nostr",
  "chat.thread.in_range": "Ao alcance",
  "chat.voice.not_recorded": "A nota de voz não foi gravada",
  "chat.thread.message": "Mensagem",
  "chat.thread.message_placeholder": "Mensagem…",
  "chat.thread.length_full": "A mensagem está cheia",
  "chat.thread.waiting_for": "Aguardando {name} voltar · {percent}%",
  "chat.thread.peer": "par",
  "chat.thread.cancel_transfer": "Cancelar {name}",
  "chat.thread.queued_more": "Mais {count} aguardando para sair",
  "chat.thread.across_bridge": "{count} do outro lado da ponte",
  "chat.thread.bridged": "pela ponte",
  "chat.thread.invite_body":
    "Me encontre em {channel} no Airhop — mensagens em malha privadas, feitas primeiro para o offline.",
  "chat.thread.go_back_unread": "Voltar, {count} não lidas",
  "chat.thread.view_info": "Ver as informações de {name}",
  "chat.thread.notices_new": "Avisos deste canal, {count} novos",
  "chat.thread.say_something": "Diga alguma coisa em {channel}.",
  "chat.thread.jump_latest_new": "Ir para a última mensagem, {count} novas",
  "chat.thread.unconfirmed_since": "Nenhuma entrega confirmada desde {date}",
  "chat.thread.no_reach": "Nenhum par por perto · ninguém recebeu isto ainda",
  "chat.thread.channel_needs_internet":
    "Internet desligada · este canal só alcança quem está dentro do alcance do Bluetooth",
  "chat.thread.cell_needs_internet":
    "Internet desligada · esta célula só é acessível pela internet",
  "chat.thread.geo_dm_needs_internet":
    "Internet desligada · esta conversa trafega só pela internet",
  "chat.thread.via_gateway":
    "Internet desligada · um aparelho por perto está levando isto online por você",
  "chat.thread.group_queued":
    "Ninguém deste grupo está por perto ainda. Vai chegar quando estiverem.",
  "chat.thread.no_group_key":
    "Você não está mais neste grupo, então isto não pode ser enviado",
  "chat.thread.no_reach_offline":
    "Internet desligada e nenhum par por perto · ninguém recebeu isto ainda",
  "chat.thread.mention": "Mencionar {name}",
  "chat.thread.someone_talking": "{hold}. {name} está falando.",
  "chat.thread.attach_note":
    "Arquivos só saem dentro do alcance do Bluetooth. Texto e pagamentos alcançam contatos pela internet; anexos não.",
  "chat.thread.message_peer": "Escrever para {name}",
  "chat.thread.send": "Enviar a mensagem",
  "chat.thread.group": "Grupo",
  "chat.bridge.nearby_only":
    "Só por perto: mantenha esta mensagem fora da ponte de malha",
  "chat.bridge.nearby_label": "Só por perto · fica no Bluetooth",
  "chat.bridge.bridging_label":
    "Conectando com áreas próximas · toque para só por perto",
  "chat.screenshot.you_took": "Você tirou um print",
  "chat.screenshot.you_took_private":
    "Você tirou um print · ninguém foi avisado",
  "chat.screenshot.heads_up": "Atenção",
  "chat.screenshot.notice": "* {name} tirou um print *",
  "chat.screenshot.notified_dm":
    "{name} foi avisado de que você tirou um print desta conversa.",
  "chat.screenshot.notified":
    "Todo mundo neste canal foi avisado de que você tirou um print.",
  "chat.screenshot.not_notified":
    "Ninguém foi avisado. Este canal é público, então anunciar um print registraria que você esteve aqui.",
  "chat.thread.error": "Erro",
  "chat.thread.go_back": "Voltar",
  "chat.bubble.via_bridge": "pela ponte de malha",
  "chat.bubble.view_profile": "Ver o perfil de {name}",
  "chat.bubble.forwarded": "Encaminhada",
  "chat.bubble.attachment": "anexo",
  "chat.bubble.a11y": "{sender}: {body}. Segure para mais opções.",
  "chat.bubble.failed_retry": "Falha ao enviar. Toque para tentar de novo.",

  // ---- Chats: message actions and info ----
  "chat.info.title": "Informações da mensagem",
  "chat.info.delivered_to": "Entregue a {name}",
  "chat.info.read_by": "Lida por {name}",
  "chat.info.group_reach_desc":
    "Acessíveis agora, não é uma confirmação de entrega",
  "chat.info.group_alone": "Nenhum outro membro",
  "chat.info.today_at": "Hoje às {time}",
  "chat.info.sending": "Enviando…",
  "chat.info.failed": "Falha ao enviar",
  "chat.info.courier": "Levada por um amigo",
  "chat.info.sent": "Enviada",
  "chat.info.queued": "Aguardando para sair",
  "chat.info.waiting": "Aguardando…",
  "chat.action.info": "Informações da mensagem",
  "chat.action.save_photos": "Salvar nas fotos",
  "chat.action.save_copy": "Salvar uma cópia",
  "chat.action.forward": "Encaminhar",
  "chat.action.select": "Selecionar",
  "chat.select.cancel": "Cancelar a seleção",

  // ---- Chats: attachments and media ----
  "chat.attach.camera": "Câmera",
  "chat.attach.camera_desc": "Tire uma foto ou grave um vídeo",
  "chat.attach.library": "Galeria de fotos",
  "chat.attach.library_desc": "Escolha da sua galeria",
  "chat.attach.document": "Documento",
  "chat.attach.document_desc": "Envie qualquer arquivo ou PDF",
  "chat.attach.voice": "Nota de voz",
  "chat.attach.voice_desc": "Grave e envie uma mensagem de voz",
  "chat.attach.ecash": "Enviar ecash",
  "chat.attach.ecash_desc": "Envie sats Cashu da sua carteira",
  "chat.attach.location": "Localização",
  "chat.attach.location_desc": "Envie onde você está agora",
  "chat.attach.title": "Anexar",

  // ---- Chat: location pin ----
  "chat.location.sent_summary": "Compartilhou uma localização",
  "chat.location.received_summary": "Compartilhou a localização",
  "chat.location.title": "Localização",
  "chat.location.away": "{distance} {direction}",
  "chat.location.taken": "Marcada há {ago}",
  "chat.location.open_maps": "Abrir no Maps",
  "chat.location.no_forward": "Localizações não são encaminhadas",
  "chat.location.no_forward_body":
    "Uma localização é enviada a uma só pessoa. Compartilhe a sua se quiser que outra pessoa tenha.",
  "chat.location.no_fix":
    "Libere a localização para ver a que distância isto está",
  "chat.location.send_title": "Enviar sua localização",
  "chat.location.send_body":
    "{name} vai ver um único ponto: onde você está agora. Não fica se atualizando.",
  "chat.location.send": "Enviar a localização",
  "chat.location.finding": "Procurando sua localização…",
  "chat.location.no_location": "Não foi possível obter sua localização",
  "chat.location.no_location_body":
    "Libere o acesso à localização e confira se os serviços de localização estão ligados, depois tente de novo.",
  "chat.location.not_delivered": "Não foi possível enviar sua localização",
  "chat.location.not_delivered_body":
    "Uma localização só vale a pena enquanto está atual, então ela não fica na fila para depois. Tente de novo quando {name} estiver acessível.",
  "chat.location.direction.n": "ao norte",
  "chat.location.direction.ne": "a nordeste",
  "chat.location.direction.e": "a leste",
  "chat.location.direction.se": "a sudeste",
  "chat.location.direction.s": "ao sul",
  "chat.location.direction.sw": "a sudoeste",
  "chat.location.direction.w": "a oeste",
  "chat.location.direction.nw": "a noroeste",
  "chat.attach.send_anyway": "Enviar mesmo assim",
  "chat.attach.bitchat_too_big": "Isto pode não chegar",
  "chat.attach.bitchat_too_big_body":
    "{name} está no bitchat, que desiste no meio do caminho com arquivos grandes. Abaixo de uns 350 KiB é confiável. Enviar para um contato do Airhop não tem esse limite.",
  "chat.attach.bitchat_unopenable": "A pessoa pode não conseguir abrir",
  "chat.attach.bitchat_unopenable_body":
    "{name} está no bitchat, que mostra fotos e notas de voz mas lista todo o resto como um arquivo que não consegue abrir. Vai chegar, só que talvez ela não consiga ver.",
  "chat.attach.file": "Anexar um arquivo",
  "chat.attach.unavailable": "Anexos não disponíveis aqui",
  "chat.attach.not_sent": "Anexo não enviado",
  "chat.attach.read_failed":
    "Algo deu errado ao ler esse arquivo. Tente outro.",
  "chat.attach.caption": "Adicione uma legenda…",
  "chat.attach.send": "Enviar o anexo",
  "chat.attach.generic": "Anexo",
  "chat.media.view_full": "Ver a foto em tela cheia",
  "chat.media.gone_photo": "A foto não está neste aparelho",
  "chat.media.gone_video": "O vídeo não está neste aparelho",
  "chat.media.gone_voice": "A nota de voz não está neste aparelho",
  "chat.media.gone_file": "O arquivo não está neste aparelho",
  "chat.media.gone_note":
    "Removido depois de 7 dias ou quando o cache foi limpo",
  "chat.media.ask_resend": "Pedir de novo",
  "chat.media.resend_draft": "Dá para me mandar {kind} de novo?",
  "chat.media.kind_photo": "aquela foto",
  "chat.media.kind_video": "aquele vídeo",
  "chat.media.kind_voice": "aquela nota de voz",
  "chat.media.kind_file": "aquele arquivo",
  "chat.media.pause_voice": "Pausar a nota de voz",
  "chat.media.play_voice": "Tocar a nota de voz",
  "chat.media.voice_position": "Posição na nota de voz",
  "chat.media.voice_scrub":
    "Toque ao longo das barras para pular para aquele ponto",
  "chat.media.image": "Imagem",
  "chat.media.tap_load_photo": "Toque para carregar a foto",
  "chat.media.open_document": "Abrir {name}",
  "chat.media.document": "documento",
  "chat.media.tap_load_video": "Toque para carregar o vídeo",
  "chat.media.video": "Vídeo",
  "chat.media.photo": "Foto",
  "chat.media.close_photo": "Fechar a foto",
  "chat.media.save_photo": "Salvar a foto nas suas fotos",
  "chat.media.share_photo": "Compartilhar a foto",
  "chat.media.saved_videos": "Salvo nos seus vídeos",
  "chat.media.saved_photos": "Salvo nas suas fotos",
  "chat.media.not_saved": "Não salvo",
  "chat.media.cant_open": "Não dá para abrir o arquivo",
  "chat.media.no_app":
    "Este aparelho não tem nenhum app para abrir ou compartilhar este arquivo.",
  "chat.media.open_failed":
    "Não foi possível abrir o arquivo. Ele pode ter sido limpo do cache.",
  "media.blocked.nostr_only":
    "Você só conhece esta pessoa por um relay. Só dá para enviar texto. Fotos, arquivos e notas de voz precisam de Bluetooth.",
  "media.blocked.private_channel":
    "Um anexo de difusão é assinado mas não é criptografado, então mandá-lo para um canal privado o deixaria aberto enquanto o texto daqui continua criptografado.",
  "media.blocked.private_group":
    "Um anexo de difusão é assinado mas não é criptografado, então mandá-lo para um grupo privado o deixaria aberto enquanto o texto daqui continua criptografado.",
  "media.blocked.location_channel":
    "Um canal de localização alcança as pessoas pela internet, e fotos, arquivos e notas de voz viajam por Bluetooth, então nunca chegariam.",

  // ---- Chats: voice ----
  "chat.voice.unavailable": "Notas de voz não disponíveis aqui",
  "chat.voice.hold_live": "Segure para falar ao vivo",
  "chat.voice.hold_record": "Segure para gravar uma nota de voz",
  "chat.voice.cancel_recording": "Cancelar a gravação",
  "chat.voice.slide_cancel": "Deslize para cancelar",
  "chat.voice.release_cancel": "Solte para cancelar",
  "chat.voice.a11y_toggle": "Toque duas vezes para começar ou parar de falar.",
  "chat.voice.limit_reached":
    "Limite de dois minutos atingido, solte para enviar",
  "chat.voice.limit_sent": "Limite de dois minutos atingido, nota enviada",
  "chat.voice.stop_send": "Parar a gravação e enviar",
  "chat.voice.lift_lock": "Deslize para cima para gravar sem segurar",
  "chat.voice.live_speaking": "{name} está falando",
  "voice.unavailable": "Voz ao vivo indisponível",
  "voice.recording_stopped": "Gravação interrompida",

  // ---- Chats: permissions asked mid-thread ----
  "chat.perm.camera_label": "Acesso à câmera",
  "chat.perm.camera_purpose": "tirar uma foto para enviar",
  "chat.perm.photo_label": "Acesso às fotos",
  "chat.perm.photo_purpose": "escolher uma foto ou um vídeo para enviar",
  "chat.perm.photo_save_purpose": "salvar isto nas suas fotos",
  "chat.perm.mic_label": "Acesso ao microfone",
  "chat.perm.mic_live_purpose": "falar com quem está por perto",
  "chat.perm.mic_note_purpose": "gravar uma nota de voz",
  "chat.perm.recording_stopped": "Gravação interrompida",
  "chat.perm.record_failed":
    "Não foi possível iniciar a gravação. Confira as permissões do microfone.",

  // ---- Chats: ecash in a thread ----
  "chat.ecash.claimed": "Resgatado",
  "chat.ecash.reclaimed": "Retomado",
  "chat.ecash.claiming": "Resgatando…",
  "chat.ecash.claim": "Resgatar",
  "chat.ecash.claim_amount": "Resgatar {amount} {unit}",
  "chat.ecash.already_claimed": "Já resgatado",
  "chat.ecash.already_claimed_body":
    "Toda prova deste token já está na sua carteira, então nada foi adicionado.",

  // ---- Chats: channel info ----
  "chat.info.courier_desc": "Entregue à malha para levar como der",
  "chat.info.queued_desc":
    "Guardada neste celular até haver uma rota até a pessoa",
  "chat.info.reclaimed": "Retomado",
  "chat.info.reclaimed_desc":
    "Você trouxe este pagamento de volta para sua carteira, então ele não será entregue",
  "chat.info.about": "Sobre",
  "chat.info.group_desc":
    "Um grupo privado. Só os membros que quem criou adicionou conseguem ler, e ele fica no Bluetooth.",
  "chat.info.teleported_desc":
    "Um canal de localização público para esta célula de geohash. Qualquer um na célula, no Airhop ou no bitchat, compartilha ele pela internet. Você está teletransportado, não fisicamente aqui.",
  "chat.info.custom_desc":
    "Um canal personalizado. Qualquer um que saiba o nome pode entrar de qualquer aparelho com Airhop ou bitchat.",
  "chat.info.private_e2ee": "Privado · criptografado de ponta a ponta",
  "chat.info.public_plain": "Público · sem criptografia",
  "chat.info.group_privacy":
    "Só os membros mostrados abaixo conseguem ler este grupo. As mensagens ficam no Bluetooth, então membros fora de alcance recebem quando voltarem.",
  "chat.info.teleport_privacy":
    "Um lugar para onde você se teletransportou. Alcança todo mundo nesta célula pela internet, e ninguém dentro do alcance do Bluetooth.",
  "chat.info.location_off_privacy":
    "A localização está desligada, então este canal só alcança aparelhos por perto via Bluetooth. Ligue a localização para alcançar a célula da área pela internet.",
  "chat.info.invite_privacy":
    "Só quem você convidar pelo link consegue ler. Ele fica escondido de todo o resto, até dos pares por perto.",
  "chat.info.public_privacy":
    "Qualquer um que entrar consegue ler toda mensagem. Use uma mensagem direta para conversa privada; as diretas são criptografadas de ponta a ponta.",
  "chat.info.remove_member": "Remover o membro",
  "chat.info.remove_member_body":
    "Remover {name} do grupo? A chave do grupo é trocada para que a pessoa não consiga mais ler as mensagens novas.",
  "chat.info.message_member": "Escrever para {name}",
  "chat.info.remove_member_a11y": "Remover {name}",
  "chat.info.no_addable":
    "Nenhum par acessível para adicionar. Os membros precisam estar por perto.",
  "chat.info.add_count": "Adicionar {count}",
  "chat.info.teleported_tag": "{level}  ·  teletransportado",
  "chat.info.active": "Ativo",
  "chat.info.members": "Membros",
  "chat.info.bookmark": "Salvar este lugar",
  "chat.info.remove_bookmark": "Tirar dos salvos",
  "chat.info.default_notice":
    "Não dá para sair dos canais padrão. Eles fazem parte do protocolo de malha do Airhop.",
  "chat.info.custom_channel": "Canal personalizado",
  "chat.info.geohash": "Geohash",
  "chat.info.copy_geohash": "Copiar o geohash",
  "chat.info.relays": "Relays",
  "chat.info.show_relays": "Mostrar os relays que carregam este canal",
  "chat.info.relay_custom": "personalizado",
  "chat.info.relays_none": "Nenhum. Esta célula está só no Bluetooth agora.",
  "chat.info.search_members": "Buscar membros",
  "chat.info.search_members_placeholder": "Buscar membros…",
  "chat.info.teleported": "Teletransportado",
  "chat.info.creator": "Quem criou",
  "chat.info.no_matches": "Nenhum resultado",
  "chat.info.no_one_here": "Ninguém aqui ainda",
  "chat.info.add_members": "Adicionar membros",
  "chat.info.add_selected": "Adicionar os membros selecionados",
  "chat.info.add": "Adicionar",
  "chat.info.leave_group": "Sair do grupo",
  "chat.info.leave_channel": "Sair do canal",
  "chat.info.leave": "Sair",

  // ---- Chats: contact info ----
  "chat.contact.chatting_since": "Conversando desde {date}",
  "chat.contact.verified_since": "Verificado desde {date}",
  "chat.contact.anonymous": "Anônimo",
  "chat.contact.anonymous_desc":
    "Um pseudônimo de geohash sem identidade duradoura para verificar",
  "chat.contact.verified": "Verificado",
  "chat.contact.verified_desc": "Você escaneou o código QR da pessoa",
  "chat.contact.verified_desc_compared": "Vocês compararam os códigos",
  "chat.contact.not_verified": "Não verificado",
  "chat.contact.not_verified_desc":
    "Escaneie o código da pessoa, ou comparem um numa ligação, para confirmar que é mesmo ela",
  "chat.contact.e2ee": "Criptografado de ponta a ponta",
  "chat.contact.e2ee_nostr":
    "Embrulhado pelo NIP-17, então os relays não conseguem ler",
  "chat.contact.e2ee_mesh":
    "Noise XX, mais Double Ratchet entre aparelhos com Airhop",
  "chat.contact.copy_nostr": "Copiar a chave pública Nostr",
  "chat.contact.nostr_key": "Chave pública Nostr",
  "chat.contact.cell_key_note":
    "Esta chave pertence à área em que vocês se encontraram. Ela muda se um de vocês se mover, e a conversa termina junto. Troquem contatos para continuarem conversando de qualquer lugar.",
  "chat.contact.peer_name": "Nome do par",
  "chat.contact.peer_id": "ID de par",
  "chat.contact.rename": "Renomear",
  "chat.contact.rename_needs_contact":
    "Você pode renomear pessoas de quem tem as chaves. Troquem cartões de contato primeiro, e aí isto vira um nome que só você vê.",
  "chat.contact.rename_needs_keys":
    "Ainda não há chaves deste contato. Escreva para a pessoa, ou escaneie o código dela, e você poderá dar um nome que só você vê.",
  "chat.contact.renamed_by_you": "O nome que você deu",
  "chat.contact.copy_peer_id": "Copiar o ID de par",
  "chat.contact.verify": "Verificar o contato",

  // ---- Chats: bulletin board notices ----
  "chat.notices.title": "Avisos",
  "chat.notices.post_area": "Publicar um aviso nesta área",
  "chat.notices.post_mesh": "Publicar um aviso na malha",
  "chat.notices.mark_urgent": "Marcar como urgente",
  "chat.notices.post": "Publicar o aviso",
  "chat.notices.post_short": "Publicar",
  "chat.notices.delete": "Excluir o aviso",
  "chat.notices.just_now": "agora mesmo",
  "chat.notices.fades_soon": "some logo",
  "chat.notices.1_day": "1 dia",
  "chat.notices.3_days": "3 dias",
  "chat.notices.7_days": "7 dias",
  "chat.notices.fading": "sumindo",
  "chat.notices.fades_in_hours": "some em {count} h",
  "chat.notices.fades_in_days": "some em {count} d",
  "chat.notices.scope_geo": "Geo",
  "chat.notices.scope_mesh": "Malha",
  "chat.notices.urgent_short": "Urgente",
  "chat.notices.permanent_warning":
    "Nunca some. É público, está preso a esta área, e você não pode retirar.",
  "chat.notices.none":
    "Nenhum aviso ainda. Publique um para ficar aqui para os outros.",

  // ---- Chats: search results ----
  "chat.search.photos": "Fotos",
  "chat.search.videos": "Vídeos",
  "chat.search.audio": "Áudio",
  "chat.search.documents": "Documentos",
  "chat.search.links": "Links",
  "chat.search.ecash": "Ecash",
  "chat.search.filter_by": "Filtrar por {filter}",
  "chat.search.no_matches": "Nenhum {filter} corresponde a “{query}”",
  "chat.search.no_media": "Nenhum {filter} ainda",
  "chat.search.result_a11y": "{chat}, {kind} de {sender}",
  "chat.search.you": "você",
  "chat.search.section_chats": "Conversas",
  "chat.search.section_messages": "Mensagens",
  "chat.search.section_notices": "Avisos",
  "chat.search.hint":
    "Busque mensagens e conversas, ou escolha um filtro acima.",
  "chat.search.no_results": "Nenhum resultado para “{query}”",
  "chat.search.open_chat": "Abrir {name}",
  "chat.search.message_a11y": "{chat}, mensagem de {sender}: {snippet}",
  "chat.search.notice_a11y": "Aviso em {chat} de {author}: {snippet}",
  "chat.search.urgent": "Urgente ·",

  // ---- Chats: notification center ----
  "chat.notif.actions_body":
    "Há {count} nesta lista. Limpar tira só daqui, e as mensagens continuam não lidas nas conversas delas. Marcar tudo como lido limpa os dois.",
  "chat.notif.mark_all_read": "Marcar tudo como lido",
  "chat.notif.clear_list": "Limpar a lista",
  "chat.notif.clear_all_a11y": "Limpar todas as {count} notificações",
  "chat.notif.title": "Notificações",
  "chat.notif.clear_short": "Limpar",
  "chat.notif.close": "Fechar as notificações",
  "chat.notif.none": "Nenhuma notificação ainda",
  "chat.notif.none_desc":
    "Mensagens, menções e avisos dos seus canais e conversas aparecem aqui.",
  "chat.notif.new": "Novo",
  "chat.notif.notice_in": "aviso em {channel}",

  // ---- Chats: forward ----
  "chat.forward.title": "Encaminhar para…",
  "chat.forward.to": "Encaminhar para {name}",
  "chat.forward.cant_send_here": "Não dá para encaminhar aqui",
  "chat.forward.cant_send_to": "Não dá para encaminhar para {name}",
  "chat.forward.channels": "Canais",
  "chat.forward.groups": "Grupos",
  "chat.forward.locations": "Localizações",
  "chat.forward.dms": "Mensagens diretas",
  "chat.forward.none": "Nenhuma outra conversa ainda",

  // ---- Mesh: status banner ----
  "mesh.banner.starting": "Iniciando a malha…",
  "mesh.banner.no_bluetooth": "Sem Bluetooth neste aparelho · só internet",
  "mesh.banner.bluetooth_off": "Bluetooth desligado · malha indisponível",
  "mesh.banner.permission_needed": "É preciso a permissão de Bluetooth",
  "mesh.banner.blocked": "Bluetooth bloqueado · libere nas configurações",
  "mesh.banner.location_permission":
    "É preciso a localização para encontrar pares",
  "mesh.banner.advertising_unsupported":
    "Este celular enxerga os outros, mas não pode ser descoberto",
  "mesh.banner.location_off_android":
    "Localização desligada · o Android precisa dela para encontrar pares",
  "mesh.banner.paused": "Malha pausada · você está ausente",
  "mesh.banner.location_off":
    "Localização desligada · canais de localização indisponíveis",
  "mesh.banner.battery_saver":
    "Economia de bateria · varredura menos frequente",
  "mesh.banner.wipe_incomplete":
    "Limpeza incompleta · pode ter sobrado algum dado; reabrir tenta de novo",
  "mesh.banner.wifi_off":
    "Wi-Fi desligado · arquivos grandes saem mais devagar",
  "mesh.banner.clock_skew":
    "O relógio deste celular está errado · deixe a data e a hora no automático",
  "mesh.banner.internet_off": "Internet desligada · só Bluetooth",
  "mesh.banner.relaying": "Nenhum par por perto · repassando via Nostr",
  "mesh.banner.tor": "Tor ligado · tráfego de internet roteado",
  "mesh.banner.tor_starting": "Iniciando o Tor · conectando",
  "mesh.banner.tor_blocked":
    "O Tor não conseguiu conectar · a malha continua funcionando",
  "mesh.banner.gateway":
    "Ponte de internet ligada · repassando para os pares próximos",
  "mesh.banner.bridge": "Ponte de malha ligada · conversa pública conectada",
  "mesh.banner.background_limits":
    "O {brand} pode pausar a malha em segundo plano",
  "mesh.banner.bridge_across":
    "Ponte de malha ligada · {count} do outro lado da ponte",
  "mesh.banner.action.turn_on": "Ligar",
  "mesh.banner.action.allow": "Permitir",
  "mesh.banner.action.resume": "Retomar",
  "mesh.banner.action.fix": "Resolver",
  "mesh.banner.hint.resume":
    "Liga de novo o anúncio e a varredura de Bluetooth",
  "mesh.banner.hint.enable_bluetooth": "Pede ao Android para ligar o Bluetooth",
  "mesh.banner.hint.location_settings":
    "Abre as configurações de localização do sistema",
  "mesh.banner.hint.app_settings":
    "Abre as permissões do Airhop nas configurações do sistema",
  "mesh.banner.hint.battery_settings":
    "Abre as configurações de atividade em segundo plano deste celular",
  "mesh.banner.dismiss": "Dispensar: {label}",
  "mesh.banner.hint.dismiss": "Esconde este aviso de vez",

  // ---- Mesh: radar ----
  "mesh.radar.scanning": "Procurando pares por perto…",
  "mesh.radar.starting": "Iniciando a malha…",
  "mesh.radar.no_bluetooth": "Este aparelho não tem Bluetooth",
  "mesh.radar.bluetooth_off": "Bluetooth desligado · sem varredura",
  "mesh.radar.permission_needed": "É preciso a permissão de Bluetooth",
  "mesh.radar.blocked": "Bluetooth bloqueado",
  "mesh.radar.location_permission": "É preciso a permissão de localização",
  "mesh.radar.location_off": "Localização desligada · sem varredura",
  "mesh.radar.hint_rings":
    "Os anéis mostram a força do sinal BLE, não a distância",
  "mesh.radar.hint_checking": "Verificando o Bluetooth e as permissões",
  "mesh.radar.hint_internet": "As mensagens continuam viajando pela internet",
  "mesh.radar.hint_turn_on": "Ligue o Bluetooth para descobrir pares",
  "mesh.radar.hint_allow": "Libere o Bluetooth para descobrir pares",
  "mesh.radar.hint_allow_settings":
    "Libere o Bluetooth nas configurações para descobrir pares",
  "mesh.radar.hint_location_permission":
    "O Android 11 e anteriores precisam da localização para varrer por Bluetooth",
  "mesh.radar.hint_android_location":
    "O Android precisa da localização ligada para devolver resultados da varredura Bluetooth",
  "mesh.radar.signal_strong": "Forte",
  "mesh.radar.signal_medium": "Médio",
  "mesh.radar.signal_weak": "Fraco",
  "mesh.radar.you_center": "Você, no centro da malha",
  "mesh.radar.sonar_hint":
    "Toca uma varredura de sonar. A busca já é contínua.",
  "mesh.radar.paused": "Malha pausada · você está ausente",
  "mesh.radar.ring_hint":
    "A posição do anel reflete a força do sinal, não a distância",
  "mesh.radar.set_online":
    "Deixe seu status como Online no perfil para descobrir pares",
  "mesh.radar.in_range": "ao alcance",
  "mesh.radar.recently_seen": "vistos há pouco",
  "mesh.radar.peer_hint": "Abre as opções para escrever ou pagar este par",

  // ---- Mesh: peer list ----
  "mesh.peer.just_now": "agora mesmo",
  "mesh.peer.none": "Nenhum par por perto",
  "mesh.peer.none_desc":
    "Outros aparelhos com Airhop ou bitchat dentro do alcance do Bluetooth aparecem aqui.",
  "mesh.peer.id_copied": "ID de par copiado",
  "mesh.peer.copy_id": "Copiar o ID de par",
  "mesh.peer.their_name": "Atende por {name}",
  "mesh.peer.in_range": "Ao alcance",
  "mesh.peer.relay": "Nó repetidor",
  "mesh.peer.relay_body":
    "Um rádio que alguém deixou ligado para ampliar a malha. Ele carrega mensagens que não consegue ler. Não há ninguém aqui para quem escrever.",
  "mesh.peer.send_dm": "Enviar uma mensagem direta",
  "mesh.peer.message": "Mensagem",
  "mesh.peer.send_sats": "Enviar ecash",
  "mesh.peer.amount_placeholder": "Valor em sats",
  "mesh.peer.amount_first": "Enviar ecash, informe um valor antes",
  "mesh.peer.cancel_send": "Cancelar o envio de ecash",
  "mesh.peer.view_peer": "Ver o par {name}",
  "mesh.peer.view_peer_online": "Ver o par {name}, online",
  "mesh.peer.last_seen": "Visto há {ago}",
  "mesh.peer.send_amount": "Enviar {amount} sats",
  "mesh.peer.direct": "Conexão direta",
  "mesh.peer.check_distance": "Conferir a distância",
  "mesh.peer.checking": "Conferindo",
  "mesh.peer.no_reply": "Sem resposta",
  "mesh.peer.no_reply_hint":
    "Pode ser que tenham se afastado, ou que o app deles não responda",
  "mesh.peer.rtt": "{ms} ms",

  // ---- Mesh: coverage level names ----
  "mesh.level.region": "Região",
  "mesh.level.province": "Estado",
  "mesh.level.city": "Cidade",
  "mesh.level.neighborhood": "Bairro",
  "mesh.level.block": "Quadra",
  "mesh.level.building": "Prédio",

  // ---- Wallet: balance and quick actions ----
  "wallet.balance.spendable": "Disponível",
  "wallet.balance.unit_hint": "Alterna entre satoshis e bitcoin",
  "wallet.balance.a11y": "Saldo {value} {unit}",
  "wallet.balance.locked":
    "O armazenamento da carteira está trancado. As provas de ecash ficam num arquivo criptografado cuja chave vive no chaveiro do aparelho, e não foi possível abri-lo. Desbloqueie o aparelho e abra o Airhop de novo.",
  "wallet.balance.tor_blocked":
    "O Tor está ligado, então os pedidos à casa de emissão estão bloqueados: eles sairiam pela rede aberta e ligariam seu IP às suas provas. Enviar e receber pela malha continua funcionando. Libere o tráfego com a casa de emissão em Configurações, Segurança.",
  "wallet.balance.unconfirmed_note":
    "{amount} ainda não confirmados com a casa de emissão",
  "wallet.balance.reserved_note":
    "{amount} reservados para um envio em andamento",
  "wallet.balance.other_mint_note":
    "{amount} numa conta de outra casa de emissão",
  "wallet.balance.test_mint_note":
    "Inclui dinheiro de brincadeira de uma casa de emissão de teste. Não é bitcoin e não dá para sacar.",
  "wallet.token": "Token",
  "wallet.action.send": "Enviar um token de ecash",
  "wallet.action.send_disabled":
    "Enviar um token de ecash, indisponível com saldo zerado",
  "wallet.action.receive": "Receber um token de ecash",
  "wallet.action.zap": "Mandar um zap para um contato do Nostr",
  "wallet.action.zap_disabled":
    "Mandar um zap para um contato do Nostr, indisponível com saldo zerado",
  "wallet.action.add_mint": "Adicionar uma casa de emissão Cashu",

  // ---- Wallet: send ----
  "wallet.send.build_failed": "Não foi possível montar o token",
  "wallet.send.title": "Enviar ecash",
  "wallet.send.amount_in": "Valor em {unit}",
  "wallet.send.body":
    "Montado offline a partir de provas que você já tem. Nada sai do seu saldo em definitivo até você confirmar que o token chegou.",
  "wallet.send.stale_fee_note":
    "As taxas foram conferidas pela última vez há {days} dias. Se esta casa de emissão aumentou a dela desde então, o envio pode custar um pouco mais.",
  "wallet.send.fee_note":
    "{spend} {unit} saem do seu saldo; os {fee} a mais cobrem a taxa da casa de emissão que a pessoa pagaria",
  "wallet.send.qr_too_big":
    "Este token está dividido em moedas demais para caber num código QR. Compartilhe ou copie, ou atualize na casa de emissão para juntá-las.",
  "wallet.send.bearer_note":
    "Quem tiver esta sequência é dono do dinheiro. As provas estão reservadas, não gastas: se ela não chegar a ninguém, você pode retomá-las em Pendentes.",
  "wallet.send.qr_too_big_short":
    "Este token está dividido em moedas demais para caber num código QR. Compartilhe ou copie.",
  "wallet.send.scan_note":
    "Peça para escanearem isto da carteira deles. Continua retomável até você marcar como entregue.",
  "wallet.send.mesh_note":
    "O token sai como uma mensagem direta criptografada pela malha. Não precisa de internet.",
  "wallet.send.no_peers_note":
    "Abra a aba Malha para achar aparelhos por perto, ou compartilhe o token de outro jeito.",
  "wallet.send.send_to": "Enviar para {name}",
  "wallet.send.memo": "Recado (opcional, viaja com o token)",
  "wallet.send.building": "Montando…",
  "wallet.send.build": "Montar o token",
  "wallet.send.inexact_body":
    "Suas provas não formam exatamente {amount} {unit} offline. O menor token que dá para montar é de {spend} {unit}, e offline não existe troco: os {extra} {unit} a mais vão para quem receber.\n\nAtualizar na casa de emissão com internet dividiria suas provas em valores que dão a conta exata.",
  "wallet.send.send_amount": "Enviar {amount}",
  "wallet.send.sent_to": "{amount} {unit} enviados para {name}",
  "wallet.send.sent_to_body":
    "{route} Continua retomável em Pendentes até você confirmar que a pessoa recebeu, ou até a casa de emissão avisar que as provas foram resgatadas.",
  "wallet.send.copy_token": "Copiar o token",
  "wallet.send.share_token": "Compartilhar o token",
  "wallet.send.open_in_wallet": "Abrir este token em outra carteira",
  "wallet.send.open_in_wallet_short": "Abrir numa carteira",
  "wallet.send.to_peer": "Enviar o token para um par por perto",
  "wallet.send.to_peer_short": "Enviar para um par",
  "wallet.send.mark_delivered": "Marcar como entregue e concluir",
  "wallet.send.they_got_it": "A pessoa recebeu",
  "wallet.send.keep_pending": "Deixar este envio pendente",
  "wallet.send.decide_later": "Decidir depois",
  "wallet.send.no_peers": "Nenhum par ao alcance",

  // ---- Wallet: receive ----
  "wallet.receive.own_payment": "Este é o seu próprio pagamento",
  "wallet.receive.own_payment_body":
    "Estas moedas ainda estão reservadas para um envio que você não fechou, então não há o que resgatar. Use Retomar nesse pagamento para devolvê-las direto ao seu saldo.",
  "wallet.receive.already_have": "Já está na sua carteira",
  "wallet.receive.already_have_body":
    "Toda prova deste token já está guardada aqui, então nada foi adicionado. Os saldos não mudaram.",
  "wallet.receive.stored_unconfirmed":
    "Guardado de {mint}, mas ainda não confirmado com a casa de emissão ({reason}).",
  "wallet.receive.offline": "offline",
  "wallet.receive.redeemed_here":
    "Resgatado em {mint}. Estas provas agora são só suas: a cópia de quem enviou não funciona mais.",
  "wallet.receive.memo_quoted": "\n\n“{memo}”",
  "wallet.receive.redeemed_at":
    "Resgatado em {mint}. Agora é seu de forma comprovável: a cópia deste token que quem enviou tem não funciona mais.",
  "wallet.receive.stored_pending":
    "Guardado de {mint}, mas a casa de emissão ainda não confirmou que não foi gasto{dleq}. Atualize pela aba Carteira assim que estiver online.",
  "wallet.receive.dleq_inline":
    " (a assinatura confere, então o token é autêntico)",
  "wallet.receive.dleq_ok":
    "A assinatura da casa de emissão confere, então o token é autêntico.",
  "wallet.receive.dleq_uncached":
    "As chaves da casa de emissão não estão guardadas aqui, então a assinatura não pôde ser conferida offline.",
  "wallet.receive.dleq_warning":
    "Até você atualizar online, quem enviou poderia em princípio já ter gasto em outro lugar.",
  "wallet.receive.failed": "Não foi possível receber",
  "wallet.receive.title": "Receber ecash",
  "wallet.receive.body":
    "Cole um token Cashu. Online ele é resgatado na casa de emissão na hora; offline ele fica guardado e é confirmado na próxima vez que você atualizar.",
  "wallet.receive.scan": "Escanear um código QR de ecash",
  "wallet.receive.scan_short": "Escanear QR",
  "wallet.receive.receiving": "Recebendo…",

  // ---- Wallet: zap ----
  "wallet.nutzap.received_title": "+{amount} {unit}",
  "wallet.nutzap.received_body":
    "Nutzap recebido de {from}… e resgatado na sua carteira.",
  "wallet.zap.title": "Mandar um zap para uma identidade do Nostr",
  "wallet.zap.not_npub": "não é um npub",
  "wallet.zap.bad_key": "chave errada",
  "wallet.zap.invalid_pubkey": "Chave pública inválida",
  "wallet.zap.invalid_pubkey_body":
    "Digite um npub1… ou uma chave pública do Nostr em hexadecimal de 64 caracteres.",
  "wallet.zap.sent": "Nutzap enviado",
  "wallet.zap.failed": "O zap falhou",
  "wallet.zap.body":
    "Se a pessoa publicar informações de nutzap do NIP-61, o ecash fica travado na chave dela para que mais ninguém possa gastar, e não dá para retomar. Se não, ele vai como um token retomável. Você será avisado do que aconteceu.",
  "wallet.zap.contact": "Mandar um zap para {name}",
  "wallet.zap.pubkey_placeholder": "npub1… ou hexadecimal de 64 caracteres",
  "wallet.zap.sending": "Enviando…",
  "wallet.nostr.copied_body":
    "Dê isto para alguém e a pessoa poderá mandar um zap do Airhop ou de qualquer outra carteira Nostr, sem precisar de Bluetooth.",
  "wallet.nostr.copy_key": "Copie sua chave Nostr para que possam mandar zaps",
  "wallet.nostr.your_key": "Sua chave Nostr",

  // ---- Wallet: mints ----
  "wallet.mint.added": "Casa de emissão adicionada",
  "wallet.mint.add_failed": "Não foi possível adicionar a casa de emissão",
  "wallet.mint.added_named": "{name} adicionada",
  "wallet.mint.added_body":
    "{mint} emite {units}. As chaves dela estão guardadas neste aparelho, então os tokens dela já podem ser verificados mesmo sem internet.",
  "wallet.mint.remove_plain":
    "Remover {mint} da sua carteira? As chaves guardadas vão junto, então os tokens dela não poderão mais ser verificados offline.",
  "wallet.mint.title": "Casas de emissão",
  "wallet.mint.none": "Nenhuma casa de emissão ainda",
  "wallet.mint.none_desc":
    "Uma casa de emissão emite e resgata seu ecash. Adicione uma para depositar por Lightning, ou receba um token e a dele é adicionada sozinha.",
  "wallet.mint.add": "Adicionar uma casa de emissão",
  "wallet.mint.add_body":
    "Uma casa de emissão guarda o Bitcoin que lastreia seu ecash, então escolha uma em que você confiaria o saldo que mantiver lá. A URL é conferida antes de salvar. Rode a sua com o Nutshell se preferir não confiar em ninguém.",
  "wallet.mint.consolidate_body":
    "Um token só pode citar uma casa de emissão, então um saldo espalhado por várias não consegue pagar um valor maior do que o que a maior delas guarda. O Airhop pode mover: cada uma das outras paga uma fatura Lightning emitida pela que você escolher. Custa uma pequena taxa de roteamento e precisa de internet.",
  "wallet.mint.add_short": "Adicionar",
  "wallet.mint.checking": "Conferindo…",
  "wallet.mint.remove_with_balance": "Remover uma casa de emissão com saldo?",
  "wallet.mint.remove": "Remover a casa de emissão",
  "wallet.mint.delete_anyway": "Excluir assim mesmo",
  "wallet.mint.consolidate": "Mover todos os saldos para uma casa de emissão",
  "wallet.mint.confirm_with": "Confirmar as provas com {mint}",
  "wallet.mint.remove_a11y": "Remover {mint}",
  "wallet.mint.available_amount": "{amount} {unit} disponíveis",
  "wallet.mint.split_across":
    "Saldo espalhado por {count} casas de emissão. Mova para uma só.",
  "wallet.mint.move_everything_to": "Mover tudo para {mint}",
  "wallet.mint.consolidate_title": "Mover para uma casa de emissão",
  "wallet.mint.moving": "Movendo…",
  "wallet.mint.move": "Mover",
  "wallet.mint.moved": "Movido",
  "wallet.mint.moved_body":
    "{amount} {unit} estão agora em {mint}, depois de {fees} {unit} em taxas de roteamento Lightning.",
  "wallet.mint.nothing_moved": "Nada foi movido",
  "wallet.mint.destination": "· destino",
  "wallet.mint.will_move": "· será movido",
  "wallet.mint.issued_by": "Emitido por",

  // ---- Wallet: Lightning ----
  "wallet.ln.deposit_memo": "Recarga da carteira Airhop",
  "wallet.ln.invoice_failed": "Não foi possível criar a fatura",
  "wallet.ln.price_failed": "Não foi possível calcular o valor desta fatura",
  "wallet.ln.paid": "Paga",
  "wallet.ln.deposit_credited":
    "Fatura paga e {amount} {unit} emitidos por {mint}. Este saldo está confirmado: você pode gastar offline na hora.",
  "wallet.ln.withdrawn":
    "{paid} sats pagos por Lightning. A casa de emissão cobrou {fee} sats em taxas de roteamento.",
  "wallet.ln.withdrawn_with_change":
    "{paid} sats pagos por Lightning. A casa de emissão cobrou {fee} sats em taxas de roteamento e devolveu {change} sats da reserva ao seu saldo.",
  "wallet.ln.payment_failed": "O pagamento falhou",
  "wallet.ln.title": "Lightning",
  "wallet.ln.body":
    "Transforme sats da Lightning em ecash que você gasta offline, ou saque ecash para qualquer fatura Lightning. As duas coisas precisam de internet e de uma casa de emissão.",
  "wallet.ln.deposit_body":
    "A casa de emissão te dá uma fatura. Pague por qualquer carteira Lightning e os sats voltam como ecash que você gasta offline.",
  "wallet.ln.pay_invoice_for":
    "Pague esta fatura de {amount} {unit}. A carteira está de olho no pagamento e vai emitir seu ecash automaticamente.",
  "wallet.ln.expired_body":
    "Esta fatura venceu. Se você já pagou, o saldo é creditado automaticamente.",
  "wallet.ln.waiting_expires": "Aguardando o pagamento · vence em {countdown}",
  "wallet.ln.withdraw_body":
    "Cole uma fatura bolt11 e a casa de emissão paga com o seu ecash. Primeiro você recebe a cotação da reserva de roteamento; o que o roteamento não usar volta ao seu saldo.",
  "wallet.ln.up_to": "até {amount} {unit}",
  "wallet.ln.amount_unit": "{amount} {unit}",
  "wallet.ln.pay_amount": "Pagar {amount} {unit}",
  "wallet.ln.deposit": "Depositar sats por Lightning",
  "wallet.ln.deposit_short": "Depositar",
  "wallet.ln.withdraw": "Sacar para uma fatura Lightning",
  "wallet.ln.withdraw_short": "Sacar",
  "wallet.ln.deposit_title": "Depositar por Lightning",
  "wallet.ln.amount_placeholder": "Valor em sats",
  "wallet.ln.requesting": "Solicitando…",
  "wallet.ln.get_invoice": "Obter uma fatura",
  "wallet.ln.copy_invoice": "Copiar a fatura",
  "wallet.ln.open_wallet": "Abrir numa carteira Lightning",
  "wallet.ln.open_wallet_short": "Abrir numa carteira",
  "wallet.ln.waiting": "Aguardando o pagamento…",
  "wallet.ln.new_invoice": "Criar uma fatura nova",
  "wallet.ln.new_invoice_short": "Nova fatura",
  "wallet.ln.withdraw_title": "Sacar para a Lightning",
  "wallet.ln.scan_invoice": "Escanear o código QR de uma fatura Lightning",
  "wallet.ln.paid_from": "Pago de",
  "wallet.ln.invoice": "Fatura",
  "wallet.ln.routing_reserve": "Reserva de roteamento",
  "wallet.ln.reserved": "Reservado do saldo",
  "wallet.ln.paying": "Pagando…",
  "wallet.ln.get_quote": "Obter uma cotação",

  // ---- Wallet: recovery phrase ----
  "wallet.backup.title": "Backup",
  "wallet.backup.setup_failed": "Não foi possível configurar o backup",
  "wallet.backup.on": "Backup ligado",
  "wallet.backup.on_body":
    "Seu saldo já pode ser reconstruído a partir daquelas doze palavras.\n\nTudo o que outra pessoa te deu fica fora da frase até você atualizar na casa de emissão, e a recuperação precisa da sua lista de casas de emissão, então anote junto com as palavras.",
  "wallet.backup.no_phrase": "Nenhuma frase guardada",
  "wallet.backup.no_phrase_body":
    "Não foi possível ler a frase de recuperação no chaveiro do aparelho. Desbloqueie o aparelho e tente de novo.",
  "wallet.backup.replace_title": "Substituir sua frase atual?",
  "wallet.backup.replace_body":
    "Você já tem uma frase de recuperação. Restaurar outra substitui a atual. As moedas já cobertas pela frase antiga continuam gastáveis neste aparelho, mas deixam de ser restauráveis, então confira se as palavras antigas estão anotadas antes de continuar.",
  "wallet.backup.replace": "Substituir",
  "wallet.backup.invalid_phrase": "Essa frase não é válida",
  "wallet.backup.invalid_phrase_body":
    "A frase tem uma soma de verificação embutida e esta não passa. Procure uma palavra digitada errado, faltando ou trocada de lugar.",
  "wallet.backup.not_bip39":
    "Estas não são palavras BIP-39: {words}. Confira a grafia.",
  "wallet.backup.add_mint_first": "Adicione antes uma casa de emissão",
  "wallet.backup.add_mint_first_body":
    "A recuperação funciona perguntando a uma casa de emissão quais moedas ela assinou para você, então ela precisa saber a quem perguntar. Adicione as que você usava e depois restaure.",
  "wallet.backup.restore_failed": "A restauração falhou",
  "wallet.backup.phrase": "Frase de recuperação",
  "wallet.backup.state_unconfirmed": "Backup ligado mas não confirmado",
  "wallet.backup.state_off": "Backup desligado",
  "wallet.backup.badge_on": "Ligado",
  "wallet.backup.badge_unconfirmed": "Não confirmado",
  "wallet.backup.badge_off": "Desligado",
  "wallet.backup.view": "Ver a frase de recuperação",
  "wallet.backup.setup": "Configurar uma frase de recuperação",
  "wallet.backup.view_short": "Ver a frase",
  "wallet.backup.setup_short": "Configurar",
  "wallet.backup.restore":
    "Restaurar uma carteira a partir de uma frase de recuperação",
  "wallet.backup.restore_short": "Restaurar",
  "wallet.backup.setup_title": "Configurar uma frase de recuperação",
  "wallet.backup.on_body_short":
    "Seu saldo pode ser reconstruído num aparelho novo a partir das suas doze palavras.",
  "wallet.backup.unconfirmed_body":
    "Você nunca confirmou ter uma cópia escrita. No momento as palavras existem só neste celular, que é justamente aquilo a que um backup deveria sobreviver. Veja a frase e anote.",
  "wallet.backup.not_covered":
    "{amount} ainda não estão cobertos. As moedas que te deram carregam os segredos de quem enviou, então só entram sob a sua frase depois de trocadas. Atualize uma casa de emissão para protegê-las.",
  "wallet.backup.off_body":
    "Seu ecash existe só neste celular. Se você perdê-lo, ninguém recupera o dinheiro, nem você. Uma frase de recuperação são doze palavras capazes de reconstruir seu saldo em qualquer lugar.",
  "wallet.backup.about_to_see":
    "Você está prestes a ver doze palavras. Elas são o dinheiro.",
  "wallet.backup.exact_order":
    "Doze palavras, exatamente nesta ordem. Quem as tiver, tem seu saldo.",
  "wallet.backup.verify_body":
    "Uma frase que ninguém anotou é pior do que frase nenhuma, porque parece uma rede de proteção que não existe. Duas palavras para confirmar.",
  "wallet.backup.verify_mismatch": "Não confere. Confira sua cópia escrita.",
  "wallet.backup.restore_body":
    "Digite as doze palavras. O Airhop deriva suas moedas de novo e pergunta a cada casa de emissão quais delas assinou, então o saldo volta dos registros que ela mantém.",
  "wallet.backup.warn_secret":
    "Qualquer um que leia pode levar seu saldo. Não tire print e não guarde neste celular.",
  "wallet.backup.warn_paper":
    "Escreva no papel e guarde em lugar seguro. O Airhop não consegue mostrar de novo se o celular sumir.",
  "wallet.backup.warn_scope":
    "Elas reconstroem só o seu ecash. Sua identidade, suas conversas e seus contatos não estão cobertos.",
  "wallet.backup.warn_mints":
    "A recuperação precisa perguntar a uma casa de emissão quais moedas ela assinou, então anote sua lista de casas de emissão junto com as palavras.",
  "wallet.backup.preparing": "Preparando…",
  "wallet.backup.show_phrase": "Mostrar minha frase",
  "wallet.backup.your_phrase": "Sua frase de recuperação",
  "wallet.backup.write_down": "Anote estas palavras",
  "wallet.backup.copy_phrase":
    "Copiar a frase de recuperação para a área de transferência",
  "wallet.backup.copy_clipboard": "Copiar para a área de transferência",
  "wallet.backup.written_down": "Já anotei",
  "wallet.backup.check_copy": "Confira sua cópia",
  "wallet.backup.confirm": "Confirmar",
  "wallet.backup.restore_title": "Restaurar de uma frase",
  "wallet.backup.phrase_placeholder": "doze palavras separadas por espaços",
  "wallet.backup.no_mints_yet":
    "Nenhuma casa de emissão adicionada ainda. A recuperação precisa perguntar a uma específica, então adicione antes as que você usava.",
  "wallet.backup.scanning": "Varrendo…",
  "wallet.backup.restore_progress":
    "{mint} · conjunto de chaves {step} de {total}",
  "wallet.backup.will_scan":
    "Serão varridas: {mints}. Uma casa de emissão que você não adicionou nunca é consultada, então o saldo lá fica invisível.",
  "wallet.backup.word_n": "Palavra {position}",
  "wallet.backup.unreachable_mints":
    "Não foi possível alcançar: {mints}. O saldo que estiver lá continua existindo. Tente de novo com uma conexão melhor.",
  "wallet.backup.nothing_recovered":
    "Nada foi recuperado das casas de emissão varridas.",

  // ---- Wallet: pending and activity ----
  "wallet.delivered.title": "Marcar como recebido?",
  "wallet.delivered.body":
    "Isto libera {amount} {unit} em definitivo. Se na verdade nunca chegou, você não vai poder retomar.",
  "wallet.delivered.body_generic":
    "Isto libera em definitivo o valor reservado. Se na verdade nunca chegou, você não vai poder retomar.",
  "wallet.delivered.cancel": "Ainda não",
  "wallet.delivered.confirm": "A pessoa recebeu",
  "wallet.reclaim.title": "Retomar este token?",
  "wallet.reclaim.body":
    "Os {amount} {unit} voltam para o seu saldo. Só faça isso se o token nunca chegou a ninguém: se a pessoa já tem a sequência, quem resgatar primeiro na casa de emissão fica com o dinheiro, e pode ser ela.",
  "wallet.reclaim.keep": "Deixar pendente",
  "wallet.reclaim.confirm": "Retomar",
  "wallet.copied.token_body":
    "O token está na sua área de transferência. Ele continua reservado aqui até você marcar como entregue, então dá para colar de novo se a primeira tentativa falhar.",
  "wallet.copied.phrase_body":
    "Cole num gerenciador de senhas e depois limpe a área de transferência. Outros apps conseguem ler, e em algumas configurações ela sincroniza com seus outros aparelhos.",
  "wallet.refresh.failed": "A atualização falhou",
  "wallet.refresh.partly": "Atualizado em parte",
  "wallet.refresh.done": "Atualizado",
  "wallet.refresh.unreachable":
    "Não foi possível alcançar {mints}. Todo o resto está em dia.",
  "wallet.refresh.swapped":
    "{amount} {unit} confirmados e trocados por provas novas.",
  "wallet.refresh.secured":
    "{amount} {unit} agora estão cobertos pela sua frase de recuperação.",
  "wallet.refresh.all_confirmed":
    "Tudo aqui já estava confirmado com a casa de emissão.",
  "wallet.pending.title": "Pendentes",
  "wallet.pending.reserved_desc":
    "Montado e reservado, entrega não confirmada. As provas ficam fora do seu saldo para não poderem ser gastas duas vezes.",
  "wallet.pending.locked_desc":
    "Já travado na chave de quem vai receber, então só a pessoa pode gastar. Só que ainda não chegou até ela. Compartilhe o token para concluir.",
  "wallet.pending.show_qr": "Mostrar este token como código QR",
  "wallet.pending.copy_again": "Copiar o token de novo",
  "wallet.pending.share_again": "Compartilhar o token de novo",
  "wallet.pending.mark_delivered": "Marcar este token como entregue",
  "wallet.pending.delivered": "Entregue",
  "wallet.pending.reclaim_into": "Retomar este token para o seu saldo",
  "wallet.activity.title": "Atividade",
  "wallet.activity.none": "Nada ainda",
  "wallet.activity.none_desc":
    "Os pagamentos que você envia e recebe aparecem aqui, dos mais recentes aos mais antigos, com a casa de emissão e a taxa de cada um.",
  "wallet.activity.show_fewer": "Mostrar menos pagamentos",
  "wallet.activity.show_less": "Mostrar menos",
  "wallet.activity.received_unconfirmed": "Recebido, não confirmado",
  "wallet.activity.received": "Recebido",
  "wallet.activity.receive_failed": "Falha ao receber",
  "wallet.activity.reclaimed": "Retomado",
  "wallet.activity.send_failed": "Falha ao enviar",
  "wallet.activity.sent": "Enviado",
  "wallet.activity.status_pending": "pendente",
  "wallet.activity.status_failed": "falhou",
  "wallet.activity.status_reclaimed": "retomado",
  "wallet.activity.status_expired": "vencido",
  "wallet.activity.ln_deposit": "Depósito Lightning",
  "wallet.activity.ln_withdrawal": "Saque Lightning",
  "wallet.activity.nutzap_received": "Nutzap recebido",
  "wallet.activity.spent_removed": "Provas gastas removidas",
  "wallet.activity.refreshed": "Provas atualizadas",
  "wallet.activity.refreshing": "Atualizando as provas",
  "wallet.activity.just_now": "agora mesmo",

  // ---- Wallet: handing a token to a peer ----
  "wallet.mesh_offline": "Malha offline",
  "wallet.mesh_offline_body":
    "O serviço da malha não está rodando, então não há a quem entregar o token. Ele continua reservado em Pendentes.",
  "wallet.xfer.route_mesh": "Entregue direto no aparelho da pessoa pela malha.",
  "wallet.xfer.route_nostr":
    "A pessoa estava fora do alcance do Bluetooth, então foi pela internet.",
  "wallet.xfer.route_courier":
    "Não há rota até a pessoa agora. Outros aparelhos vão carregar e entregar quando um deles a alcançar.",
  "wallet.xfer.route_queued":
    "Ainda não dá para alcançar a pessoa. Está na fila e sai assim que der.",
  "wallet.xfer.mesh_offline_body":
    "O serviço da malha não está rodando, então não há como entregar o token. Nada foi descontado.",
  "wallet.xfer.could_not_send": "Não foi possível enviar",
  "wallet.xfer.inexact_body":
    "Suas provas não formam exatamente {amount} {unit} offline. O menor token que dá para montar é de {spend} {unit}, e os {extra} {unit} a mais vão para a pessoa sem jeito de recuperar.\n\nAtualizar na casa de emissão com internet divide suas provas em valores que dão a conta exata.",
  "wallet.xfer.send_amount": "Enviar {amount}",
  "wallet.xfer.mesh_offline": "Malha offline",

  // ---- Wallet: paying a person ----
  "wallet.pay.rail_nutzap":
    "Travado na chave da pessoa e publicado no Nostr. É dela, esteja online ou não.",
  "wallet.pay.rail_nutzap_dm":
    "Travado na chave da pessoa. O relay não aceitou, então chegou como uma mensagem.",
  "wallet.pay.rail_nutzap_undelivered":
    "Travado na chave da pessoa, mas nada conseguiu carregar ainda. Está na fila, e o token está em Pendentes.",
  "wallet.pay.final":
    "Pagamentos travados não podem ser retomados: agora só a chave da pessoa pode gastar estas moedas.",
  "wallet.pay.reclaimable":
    "Continua retomável pela aba Carteira até você confirmar que chegou.",
  "wallet.pay.why": "Enviado assim porque {reason}.",
  "wallet.pay.sent_title": "{amount} {unit} para {name}",
  "wallet.pay.thread_receipt":
    "Você enviou {amount} {unit}, travados na chave da pessoa.",
  "wallet.pay.title": "Enviar ecash",
  "wallet.pay.to": "Para {name}",
  "wallet.pay.amount": "Valor em sats",
  "wallet.pay.memo": "Observação (opcional, pública)",
  "wallet.pay.send": "Enviar",
  "wallet.pay.sending": "Enviando…",
  "wallet.pay.action": "Enviar ecash",

  // ---- Wallet: QR scanner ----
  "wallet.scan.camera_label": "Acesso à câmera",
  "wallet.scan.camera_purpose": "escanear um código QR de ecash",
  "wallet.scan.photo_label": "Acesso às fotos",
  "wallet.scan.photo_purpose": "ler um QR de ecash de uma imagem",
  "wallet.scan.no_token": "Nenhum token de ecash encontrado nessa imagem.",
  "wallet.scan.no_invoice": "Nenhuma fatura Lightning encontrada nessa imagem.",
  "wallet.scan.unreadable": "Não foi possível ler essa imagem.",
  "wallet.scan.camera_failed":
    "Não foi possível iniciar a câmera. Feche outros apps de câmera e tente de novo.",
  "wallet.scan.close": "Fechar o leitor",
  "wallet.scan.on_device":
    "É lido neste aparelho; nada é enviado a lugar nenhum.",
  "wallet.scan.aim_token": "Aponte para um código QR de ecash.",
  "wallet.scan.aim_invoice": "Aponte para o código QR de uma fatura Lightning.",
  "wallet.scan.title_token": "Escanear ecash",
  "wallet.scan.title_invoice": "Escanear fatura",
  "wallet.scan.desc_token":
    "Leia um token Cashu de outra carteira. Funciona com qualquer carteira Cashu, não só com o Airhop.",
  "wallet.scan.desc_invoice":
    "Leia uma fatura Lightning para pagar com o seu saldo.",
  "wallet.scan.use_camera_a11y": "Escanear com a câmera",
  "wallet.scan.use_camera": "Usar a câmera",
  "wallet.scan.pick_image_a11y": "Ler um código QR de uma imagem salva",
  "wallet.scan.pick_image": "Escolher das fotos",

  // ---- Wallet: what is Cashu ----
  "wallet.explain.title": "O que é Cashu?",
  "wallet.explain.intro":
    "Cashu é ecash para Bitcoin. Um token é uma sequência que vale dinheiro para quem a tiver, assinada às cegas por uma casa de emissão para que ela não consiga saber quem gastou o quê. Sem contas, sem logins.",
  "wallet.explain.send": "Enviar",
  "wallet.explain.send_desc":
    "Transforma um valor num token que você entrega a um par por perto via Bluetooth, ou compartilha como texto. Funciona sem internet. As provas ficam reservadas até você confirmar que chegou.",
  "wallet.explain.receive": "Receber",
  "wallet.explain.receive_desc":
    "Cole um token para adicionar. Online ele é trocado na casa de emissão na hora, o que o torna seu de forma comprovável. Offline ele fica guardado e marcado como não confirmado até você atualizar.",
  "wallet.explain.zap": "Zap",
  "wallet.explain.zap_desc":
    "Paga uma identidade do Nostr. Se a pessoa publicar informações de nutzap do NIP-61, o ecash fica travado na chave dela para que só ela possa gastar. Se não, recorre a uma mensagem direta criptografada. Precisa de internet.",
  "wallet.explain.add_mint": "Adicionar casa de emissão",
  "wallet.explain.add_mint_desc":
    "Salva a casa de emissão que emite e resgata seu ecash, e guarda as chaves públicas dela para que os tokens possam ser verificados offline. Escolha uma em que você confiaria o saldo que mantiver lá.",
  "wallet.explain.phrase": "Frase de recuperação",
  "wallet.explain.phrase_desc":
    "Suas moedas derivam de doze palavras que a carteira gera no começo, então um celular novo consegue reconstruir o saldo perguntando às suas casas de emissão quais moedas elas assinaram. Até você ver e anotar, elas existem só neste celular.",

  // ---- Wallet: failures ----
  "wallet.err.locked": "Carteira trancada",
  "wallet.err.mint_unreachable": "Casa de emissão inacessível",
  "wallet.err.tor_blocked": "Bloqueado com o Tor ligado",
  "wallet.err.insufficient": "Saldo insuficiente",
  "wallet.err.exact_amount": "Não dá para enviar esse valor exato",
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
    "O Arti envolve só os WebSockets do Nostr, então este pedido chegaria à casa de emissão pela rede aberta e ligaria seu IP a estas provas. Libere em Configurações > Segurança, ou desligue o Tor antes. Enviar e receber ecash pela malha continua funcionando.",
  "wallet.svc.tor_paused": "O Tor está ligado, mas não conectado.",
  "wallet.svc.tor_paused_body":
    "O Orbot parou de rotear, então este pedido chegaria à casa de emissão pela rede aberta e ligaria seu IP a estas provas. Abra o Orbot de novo, ou desligue o Tor. Enviar e receber ecash pela malha continua funcionando.",
  "wallet.svc.keys_uncached":
    "As chaves desta casa de emissão não estão guardadas neste aparelho.",
  "wallet.svc.keys_uncached_body":
    "Abra a carteira uma vez com internet para buscá-las.",
  "wallet.svc.phrase_invalid": "Essa frase de recuperação não é válida.",
  "wallet.svc.phrase_invalid_body":
    "Procure uma palavra digitada errado ou faltando. A frase tem uma soma de verificação embutida, então uma única palavra errada invalida tudo.",
  "wallet.svc.need_mint": "Adicione antes pelo menos uma casa de emissão.",
  "wallet.svc.need_mint_body":
    "A recuperação funciona perguntando a uma casa de emissão quais moedas ela assinou para você, então ela precisa saber a quem perguntar.",
  "wallet.svc.restored": "Restaurado a partir da frase de recuperação",
  "wallet.svc.storage_locked": "O armazenamento da carteira está trancado.",
  "wallet.svc.storage_locked_body":
    "O Airhop guarda as provas de ecash num arquivo criptografado cuja chave vive no chaveiro do aparelho. Desbloqueie o aparelho e abra o app de novo.",
  "wallet.svc.bad_url": "Isso não é uma URL válida.",
  "wallet.svc.needs_https":
    "A URL de uma casa de emissão precisa começar com https://.",
  "wallet.svc.refuse_http":
    "Recusamos usar uma casa de emissão em http sem criptografia.",
  "wallet.svc.refuse_http_body":
    "Qualquer um no caminho da rede poderia ler ou alterar suas provas. Use uma casa de emissão com https://.",
  "wallet.svc.mint_not_saved": "Não foi possível salvar a casa de emissão.",
  "wallet.svc.unreadable_token": "Isso não é um token Cashu legível.",
  "wallet.svc.unreadable_token_body":
    "Os tokens começam com cashuA ou cashuB. Confira se nada foi cortado na cópia.",
  "wallet.svc.wrong_mint":
    "Este token não foi assinado pela casa de emissão que ele cita.",
  "wallet.svc.already_spent": "Estas provas já foram gastas.",
  "wallet.svc.already_spent_body":
    "Quem enviou este token resgatou primeiro, ou mandou o mesmo token para outra pessoa.",
  "wallet.svc.receiving_offline": "recebendo offline",
  "wallet.svc.amount_positive": "Digite um valor maior que zero.",
  "wallet.svc.coins_raced":
    "Essas moedas acabaram de ser usadas por outro pagamento.",
  "wallet.svc.coins_raced_body":
    "Nada foi descontado. Tente de novo e a carteira escolhe outro conjunto.",
  "wallet.svc.no_ecash": "Ainda sem ecash.",
  "wallet.svc.no_ecash_body":
    "Adicione uma casa de emissão e deposite por Lightning, ou receba um token de alguém.",
  "wallet.svc.split_across_mints":
    "Seu saldo está espalhado por várias casas de emissão.",
  "wallet.svc.mint_says_spent":
    "A casa de emissão informou estas provas como já gastas.",
  "wallet.svc.issue_against_invoice":
    "emitir ecash contra uma fatura Lightning",
  "wallet.svc.pay_invoice": "pagar uma fatura Lightning",
  "wallet.svc.unknown_deposit": "Depósito desconhecido.",
  "wallet.svc.invoice_expired_before": "A fatura venceu antes de ser paga.",
  "wallet.svc.invoice_expired": "Essa fatura venceu.",
  "wallet.svc.invoice_unpaid": "A fatura ainda não foi paga.",
  "wallet.svc.payment_unknown":
    "Situação do pagamento desconhecida; será conferida de novo na próxima atualização.",
  "wallet.svc.melt_change_pending": "Sua fatura foi paga.",
  "wallet.svc.melt_change_pending_body":
    "A casa de emissão ainda não devolveu a taxa de roteamento não usada. Ela é reivindicada automaticamente na próxima atualização, e nada se perde enquanto isso.",
  "wallet.svc.mint_did_not_pay":
    "A casa de emissão não pagou esta fatura. Seu saldo não mudou.",
  "wallet.svc.not_an_invoice": "Isso não é uma fatura Lightning.",
  "wallet.svc.not_an_invoice_body":
    "Cole uma fatura bolt11 começando com lnbc.",
  "wallet.svc.insufficient_for_invoice": "Saldo insuficiente para esta fatura.",
  "wallet.svc.coins_raced_invoice_body":
    "Nada foi descontado e a fatura não foi paga. Tente de novo.",
  "wallet.svc.same_mint": "Escolha outra casa de emissão de destino.",
  "wallet.svc.same_mint_body":
    "A origem e o destino são a mesma casa de emissão, então não há o que mover.",
  "wallet.svc.quote_failed_retried": "Cotação falhou, consolidação repetida",
  "wallet.svc.amount_unfit_retried": "O valor não coube, consolidação repetida",
  "wallet.svc.cannot_size": "Não foi possível dimensionar esta transferência.",
  "wallet.svc.insufficient_at_mint": "Saldo insuficiente em {mint}.",
  "wallet.svc.inexact_title":
    "Suas provas não formam exatamente {amount} {unit} offline.",
  "wallet.svc.inexact_detail":
    "O menor token que você pode enviar é de {spend} {unit}. Offline não existe troco, então os {extra} {unit} a mais vão para quem receber.",
  "wallet.svc.no_single_mint":
    "Nenhuma casa de emissão sozinha guarda {amount} {unit}. Ecash de casas diferentes não pode ser juntado num só token: consolide primeiro numa delas, ou envie em valores separados.",
  "wallet.svc.have_tried_send":
    "Você tem {total} {unit} e tentou enviar {amount}.",
  "wallet.svc.invoice_needs":
    "Esta fatura precisa de {total} {unit} incluindo a reserva de roteamento, e você tem {balance}.",
  "wallet.svc.nothing_to_move": "{mint} não tem {unit} para mover.",
  "wallet.svc.consolidate_memo": "Consolidação a partir de {mint}",
  "wallet.svc.cannot_size_detail":
    "Depois das taxas de roteamento Lightning, {from} não consegue mover um valor útil para {to}. Tente mover um valor menor e específico.",
  "wallet.svc.mint_cannot": "{mint} não consegue {action}.",
  "wallet.svc.no_nut": "A casa de emissão não anuncia o NUT-{nut}.",
  "wallet.svc.unknown_mint":
    "Esse pagamento cita uma casa de emissão que você não usa.",
  "wallet.svc.unknown_mint_body":
    "Adicione você mesmo se confiar nela; nada é resgatado de uma casa de emissão que você não escolheu.",
  "wallet.svc.no_relay": "sem conexão com nenhum relay",
  "wallet.svc.no_shared_mint":
    "nenhuma casa de emissão em comum com saldo suficiente",
  "wallet.svc.no_nutzap_info":
    "quem vai receber não publicou informações de nutzap (NIP-61 kind 10019)",
  "wallet.svc.locked_undelivered":
    "Travado na chave da pessoa mas ainda não entregue. Compartilhe o token desta transação para concluir.",
  "wallet.svc.swap_lost":
    "A casa de emissão nunca concluiu esta troca, então nada foi emitido em contrapartida.",
  "wallet.svc.swap_unreadable":
    "Esta troca foi salva num formato que esta versão não consegue repetir.",

  // ---- Contacts: add and share ----
  "contacts.qr.verified": "Verificado por QR",
  "contacts.qr.keys_unverified": "Chaves recebidas, não verificadas",
  "contacts.qr.not_verified": "Ainda não verificado",
  "contacts.qr.message": "Mensagem",
  "contacts.qr.add": "Adicionar contato",
  "contacts.qr.scan_title": "Escanear código QR",
  "contacts.qr.aim": "Aponte a câmera para o código QR da pessoa",
  "contacts.qr.add_desc": "Alcance alguém que não está por perto na malha.",
  "contacts.qr.peer_id_hint":
    "Um ID de par tem 16 caracteres. Um código de contato começa com airhop:.",
  "contacts.qr.or_scan": "ou escaneie o QR da pessoa",
  "contacts.qr.trust_note":
    "Só um QR que você escaneia com a sua câmera verifica a chave da pessoa. Um código colado traz as chaves dela, mas não a prova de que veio dela.",
  "contacts.qr.peer_id": "ID de par ou código de contato",
  "contacts.qr.peer_id_placeholder": "Cole um ID ou um código de contato",
  "contacts.qr.scan_camera_a11y": "Escanear o código QR com a câmera",
  "contacts.qr.scan_camera_desc": "Use sua câmera",
  "contacts.qr.upload_a11y": "Enviar uma imagem de QR da galeria",
  "contacts.qr.upload": "Enviar da galeria",
  "contacts.qr.upload_desc": "Escolha uma imagem de QR salva",
  "contacts.qr.scan_a11y": "Adicionar um contato escaneando um código QR",

  // ---- Contacts: scanning a code ----
  "contacts.scan.invalid_id":
    "Cole um ID de par de 16 caracteres, um link airhop://peer/… ou um código de contato.",
  "contacts.scan.camera_label": "Acesso à câmera",
  "contacts.scan.camera_purpose": "escanear o código QR de um contato",
  "contacts.scan.camera_needed":
    "É preciso acesso à câmera para escanear. Você ainda pode adicionar pelo ID de par.",
  "contacts.scan.camera_failed":
    "Não foi possível iniciar a câmera. Feche outros apps de câmera e tente de novo.",
  "contacts.scan.photo_label": "Acesso às fotos",
  "contacts.scan.photo_purpose": "escanear um código QR que você salvou",
  "contacts.scan.photo_needed":
    "É preciso acesso às fotos para escolher uma imagem. Você ainda pode adicionar pelo ID de par.",
  "contacts.scan.no_qr": "Nenhum código QR do Airhop encontrado nessa imagem.",
  "contacts.scan.unreadable": "Não foi possível ler um código QR nessa imagem.",
  "contacts.scan.bitchat_expired":
    "Esse código do bitchat expirou. Peça para a pessoa abrir o QR de novo.",
  "contacts.scan.tampered":
    "Este código QR não é válido: o ID de par não bate com as chaves. Pode ter sido adulterado.",
  "contacts.scan.already_added": "Já está nos seus contatos",

  // ---- Contacts: verifying by QR ----
  "contacts.verify.waiting_camera": "Aguardando o acesso à câmera…",
  "contacts.verify.camera_off": "A câmera está desligada",
  "contacts.verify.open_settings": "Abrir configurações",
  "contacts.verify.verified": "Verificado",
  "contacts.verify.different": "Contato diferente",
  "contacts.verify.scan_again": "Escanear de novo",
  "contacts.verify.failed": "Não foi possível verificar",
  "contacts.verify.done": "Pronto",
  "contacts.verify.title": "Verificar {name}",
  "contacts.verify.aim": "Aponte a câmera para o código QR da pessoa",
  "contacts.verify.camera_off_body":
    "Ligue o acesso à câmera nas configurações para verificar por QR.",
  "contacts.verify.match_body":
    "A chave de {name} confere. Você pode confiar neste contato.",
  "contacts.verify.different_body":
    "Este QR é de outra pessoa. Peça para {name} mostrar o próprio código.",
  "contacts.verify.tampered_body":
    "Este QR parece adulterado: o ID não bate com a chave.",
  "contacts.verify.choose_title": "Como você quer conferir?",
  "contacts.verify.choose_body":
    "As duas formas confirmam que as chaves deste celular são mesmo de {name}.",
  "contacts.verify.method_scan": "Escanear o código da pessoa",
  "contacts.verify.method_scan_sub": "Ela está aqui com você",
  "contacts.verify.method_compare": "Comparar um código",
  "contacts.verify.method_compare_sub": "Leiam um para o outro numa ligação",
  "contacts.verify.no_keys":
    "Ainda não há chaves deste contato. Escreva para a pessoa, ou escaneie o código dela quando se encontrarem.",
  "contacts.verify.compare_title": "Leiam isto um para o outro",
  "contacts.verify.compare_body":
    "{name} vê as mesmas seis palavras. Se baterem, vocês dois sabem que as chaves são autênticas.",
  "contacts.verify.codes_match": "Elas batem",
  "contacts.verify.codes_differ": "Elas não batem",
  "contacts.verify.compared_body":
    "Você e {name} confirmaram o mesmo código. Este contato está verificado.",

  // ---- Settings: shared chrome ----
  "settings.back": "Voltar",
  "settings.coming_soon": "Em breve",
  "settings.opens_externally": "{label}, abre fora do app",
  "settings.peer_id": "ID de par",
  "settings.share_peer_id": "Compartilhe seu ID de par",
  "settings.share_id_short": "Compartilhar ID",
  "settings.peer_id_sheet.title": "Seu ID de par",
  "settings.peer_id_sheet.copy": "Copiar o ID de par",
  "settings.peer_id_sheet.note":
    "Isto só funciona quando vocês dois estão dentro do alcance do Bluetooth. Para alguém escrever de qualquer lugar, compartilhe seu código QR.",

  // ---- Settings: hub rows ----
  "settings.section.general": "Geral",
  "settings.section.general_desc":
    "Recursos opcionais, desfazer envio, mídia, redefinição",
  "settings.section.privacy": "Privacidade e segurança",
  "settings.section.privacy_desc":
    "Sigilo futuro, pacotes assinados, pares bloqueados",
  "settings.section.network": "Rede e relays",
  "settings.section.network_desc":
    "Alternativa por internet, relays nostr, compatibilidade com bitchat",
  "settings.section.permissions": "Permissões",
  "settings.section.permissions_desc":
    "Bluetooth, localização, notificações, câmera, microfone",
  "settings.section.storage": "Armazenamento e dados",
  "settings.section.diagnostics": "Diagnóstico",

  // ---- Settings: group headings ----
  "settings.group.transports": "Transportes",
  "settings.group.nearby": "Por perto",
  "settings.group.sync": "Sincronização",
  "settings.group.features": "Recursos",
  "settings.group.messages": "Mensagens",
  "settings.group.media": "Mídia",
  "settings.group.reset": "Redefinição",
  "settings.group.always_on": "Sempre ligado",
  "settings.group.notifications": "Notificações",
  "settings.group.blocked": "Bloqueados",
  "settings.group.theme": "Tema",
  "settings.group.font": "Fonte",
  "settings.group.language": "Idioma",
  "settings.section.diagnostics_desc":
    "Estado da conexão e aparelhos por perto",

  // ---- Settings: diagnostics ----
  "settings.diag.ble_links": "Enlaces Bluetooth",
  "settings.diag.ble_links_desc":
    "Aparelhos aos quais este celular está conectado diretamente",
  "settings.diag.lan": "Rede local",
  "settings.diag.lan_desc": "Celulares na mesma rede Wi-Fi",
  "settings.diag.wifi": "Wi-Fi Aware",
  "settings.diag.wifi_about": "De celular para celular sem roteador",
  "settings.diag.wifi_active": "Em funcionamento",
  "settings.diag.wifi_unsupported": "Sem suporte neste aparelho",
  "settings.diag.wifi_permission": "Bloqueado por uma permissão",
  "settings.diag.wifi_unavailable": "Indisponível no momento",
  "settings.diag.wifi_unknown": "Aguardando o rádio",
  "settings.diag.relays": "Relays Nostr",
  "settings.diag.relays_desc":
    "Usados para os canais de localização e o alcance pela internet",
  "settings.diag.connected": "Conectado",
  "settings.diag.disconnected": "Sem conexão",
  "settings.diag.peer_direct": "Enlace direto",
  "settings.diag.peer_relayed": "Ouvido por meio de outro aparelho",
  "settings.diag.rssi": "{dbm} dBm",
  "settings.diag.no_rssi": "Sem leitura de sinal",
  "settings.diag.no_peers": "Ninguém ao alcance",
  "settings.diag.no_peers_desc": "{links} enlaces de rádio abertos",
  "settings.diag.gcs_size": "Tamanho do filtro",
  "settings.diag.gcs_size_desc":
    "O maior filtro de sincronização colocado no ar",
  "settings.diag.fpr": "Taxa de falsos positivos",
  "settings.diag.fpr_desc":
    "Com que frequência o filtro afirma ter um pacote que não temos",
  "settings.diag.bytes": "{n} bytes",
  "settings.diag.footnote":
    "Nada aqui pode ser alterado. Estes valores são fixos para que o Airhop continue compatível com o bitchat.",
  "settings.section.storage_desc": "Uso e cache",
  "settings.section.appearance": "Aparência",
  "settings.section.appearance_desc": "Tema, fonte e idioma",
  "settings.section.help": "Ajuda e comentários",
  "settings.section.help_desc":
    "Fale com a gente, relate um erro ou leia as perguntas frequentes",
  "settings.section.support": "Apoio",
  "settings.section.support_desc": "Ajude a manter o desenvolvimento ativo",
  "settings.section.about": "Sobre",
  "settings.section.about_desc": "Versão, histórico de mudanças e código-fonte",

  // ---- Settings: general ----
  "settings.general.undo": "Desfazer envio",
  "settings.general.feature_ai": "IA",
  "settings.general.feature_wallet": "Carteira",
  "settings.general.undo_seconds": "{count} segundos",
  "settings.general.undo_a11y": "Desfazer envio: {value}",
  "settings.general.quality_a11y": "Definir a qualidade de envio como {value}",
  "settings.general.undo_desc":
    "Segura a mensagem enviada por um instante para você poder recolhê-la antes que ela saia",
  "settings.general.undo_off_desc": "Enviar na hora, sem desfazer",
  "settings.general.undo_2": "2 segundos",
  "settings.general.undo_2_desc": "Uma chance rápida de recolher",
  "settings.general.undo_10": "10 segundos",
  "settings.general.undo_10_desc": "A janela mais longa",
  "settings.general.quality": "Qualidade de envio",
  "settings.general.quality_desc":
    "Vale para as fotos enviadas da câmera ou da galeria. De um jeito ou de outro, toda foto é ajustada à malha.",
  "settings.general.quality_low": "Baixa",
  "settings.general.quality_low_desc": "Fotos menores, envio mais rápido",
  "settings.general.quality_medium": "Média",
  "settings.general.quality_medium_desc":
    "Equilíbrio entre detalhe e velocidade",
  "settings.general.quality_high": "Alta",
  "settings.general.quality_high_desc": "Guarda o máximo de detalhe",
  "settings.general.feature_wallet_desc":
    "Envie ecash Cashu de pessoa para pessoa pela malha",
  "settings.general.feature_wallet_a11y": "Carteira (sempre ligada)",
  "settings.general.feature_ai_desc":
    "Assistente privado no aparelho, sem nenhuma chamada de rede",
  "settings.general.feature_feeds": "Feeds",
  "settings.general.feature_feeds_desc":
    "Leia e publique nos feeds do Bluesky e do Mastodon",
  "settings.general.show_media": "Mostrar mídia automaticamente",
  "settings.general.show_media_desc":
    "Fotos e vídeos aparecem na conversa, ou ficam atrás de um toque",
  "settings.general.reset": "Redefinir as configurações",
  "settings.general.media_retention": "Guardar mídia por",
  "settings.general.media_retention_desc":
    "Fotos, vídeos e notas de voz são apagados depois do tempo escolhido",
  "settings.general.media_retention_sheet":
    "Escolha por quanto tempo a mídia fica neste aparelho. Mídia apagada não pode ser recuperada.",
  "settings.general.retention_7_desc":
    "Deixa o menor rastro. É o melhor se o risco for o próprio celular.",
  "settings.general.retention_14_desc":
    "Um meio-termo para uma ou duas semanas longe do sinal.",
  "settings.general.retention_30_desc":
    "Mantém as conversas legíveis por mais tempo e ocupa mais disco.",
  "settings.general.reset_desc":
    "Devolve cada preferência ao padrão, sem mexer na sua identidade, mensagens, contatos e carteira",
  "settings.general.reset_title": "Redefinir as configurações?",
  "settings.general.reset_body":
    "Cada preferência volta ao padrão: aparência, desfazer envio e conectividade (internet, Tor, ponte de internet, ponte de malha, relays). Sua identidade, mensagens, contatos e carteira ficam intactos.",
  "settings.general.reset_confirm": "Redefinir",

  // ---- Settings: privacy and security ----
  "settings.security.forward_secrecy": "Sigilo futuro",
  "settings.security.forward_secrecy_desc":
    "O Double Ratchet fica sempre ligado nas mensagens diretas",
  "settings.security.signed_packets": "Pacotes assinados",
  "settings.security.signed_packets_desc": "Cada pacote é assinado com Ed25519",
  "settings.security.hide_previews": "Esconder as prévias das notificações",
  "settings.security.hide_previews_desc":
    "Mantém o remetente e a mensagem fora da tela de bloqueio, que os mostra sem desbloquear",
  "settings.security.no_blocked": "Nenhum par bloqueado",
  "settings.security.no_blocked_desc":
    "Pares bloqueados não conseguem escrever para você nem aparecem na aba Malha",
  "settings.security.unblock_title": "Desbloquear este par",
  "settings.security.unblock": "Desbloquear",
  "settings.security.unblock_peer": "Desbloquear {name}",
  "settings.security.unblock_body":
    "{name} poderá escrever para você de novo e vai reaparecer na aba Malha quando estiver por perto.",

  // ---- Settings: network and relays ----
  "settings.network.internet": "Alternativa por internet",
  "settings.network.internet_desc":
    "Continue pelos relays Nostr quando os pares da malha estiverem fora de alcance",
  "settings.network.internet_off_title": "Desligar a internet?",
  "settings.network.internet_off_body":
    "O Airhop vai funcionar só por Bluetooth. Ele para de contatar qualquer relay Nostr, e o Tor, a ponte de internet e a ponte de malha se desligam. A conversa por Bluetooth por perto continua funcionando.",
  "settings.network.turn_off": "Desligar",
  "settings.network.discovery": "Descoberta geográfica de relays",
  "settings.network.discovery_desc":
    "Escolhe automaticamente os relays mais próximos de uma célula de localização entre mais de 300 relays distribuídos",
  "settings.network.discovery_needs_relay":
    "Adicione antes um relay personalizado",
  "settings.network.discovery_needs_relay_body":
    "É a descoberta automática que aponta o Airhop para os relays mais próximos. Desligá-la só faz sentido depois que você fixar seus próprios relays abaixo, então adicione pelo menos um antes.",
  "settings.network.custom_only_title": "Usar só os seus relays?",
  "settings.network.custom_only_body":
    "Os canais de localização e a ponte de malha vão parar de escolher automaticamente os relays mais próximos e usar só os que você adicionou. Isso pode reduzir o alcance, e você pode deixar de encontrar usuários do bitchat, que se juntam nos relays mais próximos.",
  "settings.network.custom": "Relays personalizados",
  "settings.network.custom_desc":
    "Adicione seus próprios relays para os canais de localização e a ponte de malha",
  "settings.network.custom_added": "{count} de {max} adicionados",
  "settings.network.dm_relays": "Relays de mensagens",
  "settings.network.dm_relays_desc":
    "As mensagens diretas e os canais privados usam sempre estes. Os relays personalizados não os mudam.",
  "settings.network.discovery_back_on": "Descoberta geográfica religada",
  "settings.network.discovery_back_on_body":
    "Esse era seu último relay personalizado. Os canais de localização precisam de algum lugar para publicar, então o Airhop voltou a escolher automaticamente os relays mais próximos.",
  "settings.network.add_relay": "Adicionar um relay",
  "settings.network.remove_relay": "Remover {url}",
  "settings.network.add_short": "Adicionar",
  "settings.network.relay_limit":
    "Você pode adicionar {count} relays. Remova um para adicionar outro.",
  "settings.network.relay_duplicate": "Esse relay já está na sua lista.",
  "settings.network.relay_invalid":
    "Digite um host de relay válido, por exemplo relay.example.com. A porta só é necessária se o relay não usar a padrão. Endereços IP e nomes locais não são aceitos.",
  "settings.network.bitchat": "Compatibilidade com bitchat",
  "settings.network.bitchat_desc":
    "A mesma malha BLE do bitchat, totalmente interoperável. Fica sempre ligada e não dá para desligar.",

  // ---- Settings: connectivity toggles ----
  "settings.conn.background": "Rodar em segundo plano",
  "settings.conn.background_desc":
    "Mantenha a malha funcionando quando o Airhop estiver fechado",
  "settings.conn.background_on_title": "Manter a malha funcionando?",
  "settings.conn.background_on_body":
    "O Airhop continua repassando e recebendo mesmo fechado, então as mensagens chegam enquanto você está longe. O Android mostra uma notificação fixa enquanto isso.",
  "settings.conn.background_off_title": "Parar a malha quando o Airhop fechar?",
  "settings.conn.background_off_body":
    "As mensagens só vão chegar com o Airhop aberto, e este celular para de repassar para quem está por perto. A notificação fixa some.",
  "settings.conn.live_voice": "Voz ao vivo",
  "settings.conn.live_voice_desc":
    "Fale com quem está por perto como num walkie-talkie",
  "settings.conn.live_voice_on_title": "Ligar a voz ao vivo?",
  "settings.conn.live_voice_on_body":
    "Segurando o microfone, sua voz vai para todo mundo dentro do alcance do Bluetooth enquanto você fala, e a deles sai no seu celular. Nada é gravado.",
  "settings.conn.live_voice_off_title": "Desligar a voz ao vivo?",
  "settings.conn.live_voice_off_body":
    "Segurar o microfone passa a gravar uma nota de voz. Ela sai quando você solta, e ninguém ouve até tocar.",
  "settings.conn.tor_short": "Tor",
  "settings.conn.tor": "Roteamento por Tor",
  "settings.conn.tor_desc":
    "Faça o tráfego Nostr passar pelo Tor para mais privacidade",
  "settings.conn.tor_on_title": "Fazer o tráfego Nostr passar pelo Tor?",
  "settings.conn.tor_on_body":
    "Os relays deixam de ver seu endereço IP. Conectar demora mais e as mensagens chegam mais devagar. O Bluetooth não é afetado.",
  "settings.conn.tor_off_title": "Desligar o roteamento por Tor?",
  "settings.conn.tor_off_body":
    "O tráfego Nostr volta pela sua conexão comum, então os relays veem seu endereço IP de novo. De um jeito ou de outro, o Bluetooth não é afetado.",
  "settings.conn.tor_orbot_idle":
    "O Orbot está instalado mas não conectado. Abra o Orbot, inicie a VPN dele e depois ligue isto.",
  "settings.conn.tor_unavailable":
    "O roteamento por Tor não está disponível nesta versão.",
  "settings.conn.tor_timeout":
    "O Tor está demorando mais de um minuto para conectar. Ele continua ligado e tentando; a aba Malha vai dizer quando estiver roteando, ou se esta rede o estiver bloqueando.",
  "settings.conn.tor_failed":
    "Não foi possível iniciar o Tor. Verifique se o app tem acesso à rede.",
  "settings.conn.mint_clearnet":
    "Permitir o tráfego com a casa de emissão pela rede aberta",
  "settings.conn.mint_clearnet_desc":
    "No iOS o Tor cobre só o Nostr. Deixe desligado para bloquear os pedidos à casa de emissão; de um jeito ou de outro, o ecash pela malha continua funcionando.",
  "settings.conn.gateway": "Ponte de internet",
  "settings.conn.gateway_desc":
    "Empreste sua conexão a um celular por perto sem rede para que ele ainda alcance os canais de localização",
  "settings.conn.gateway_on_title": "Ligar a ponte de internet?",
  "settings.conn.gateway_on_body":
    "Celulares por perto sem conexão própria vão enviar e receber mensagens dos canais de localização pela sua. Isso usa seus dados móveis e sua bateria, e as mensagens deles continuam criptografadas de ponta a ponta, então você não consegue ler o que passa.",
  "settings.conn.gateway_off_title": "Desligar a ponte de internet?",
  "settings.conn.gateway_off_body":
    "Celulares por perto sem rede deixam de alcançar os canais de localização pela sua. Suas próprias mensagens não são afetadas.",
  "settings.conn.bridge": "Ponte de malha",
  "settings.conn.bridge_desc":
    "Conecte a conversa pública #bluetooth desta área a outro grupo de Bluetooth fora de alcance, pela internet",
  "settings.conn.bridge_on_title": "Ligar a ponte de malha?",
  "settings.conn.bridge_on_body":
    "Suas mensagens públicas no #bluetooth serão publicadas no seu bairro pela internet, para que pessoas fora do alcance do Bluetooth possam ler. Mensagens privadas nunca cruzam a ponte, e “só por perto” mantém qualquer mensagem específica na área.",
  "settings.conn.bridge_off_title": "Desligar a ponte de malha?",
  "settings.conn.bridge_off_body":
    "Suas mensagens públicas no #bluetooth voltam a ficar dentro do alcance do Bluetooth, e as do grupo conectado param de chegar aqui.",
  "settings.conn.bridge_needs_location":
    "A ponte de malha precisa da localização",
  "settings.conn.bridge_needs_location_desc":
    "Ela descobre seu bairro a partir de uma leitura de posição. Conceda a localização para começar a conectar.",
  "settings.conn.grant_location": "Conceder a permissão de localização",
  "settings.conn.grant_short": "Conceder",
  "settings.conn.orbot_body":
    "O Airhop faz o tráfego Tor passar pelo Orbot. Instale e ative o Orbot pela Play Store e depois ligue isto.",
  "settings.conn.internet_off": "A internet está desligada",
  "settings.conn.internet_off_desc":
    "O Tor, a ponte de malha e a ponte de internet usam internet. Ligue a alternativa por internet em Rede para usá-los.",
  "settings.conn.turn_on": "Ligar",
  "settings.conn.turn_off": "Desligar",
  "settings.conn.orbot_title": "Tor no Android",
  "settings.conn.get_orbot": "Baixar o Orbot",
  "settings.conn.later": "Mais tarde",

  // ---- Settings: permissions ----
  "settings.permissions.bluetooth": "Bluetooth",
  "settings.permissions.bluetooth_desc":
    "Encontra aparelhos por perto e repassa mensagens entre eles. Sem ele, a malha não funciona.",
  "settings.permissions.location": "Localização",
  "settings.permissions.location_desc":
    "Abre os canais das áreas próximas. Sem ela, esses canais ficam fechados e a malha Bluetooth segue normalmente.",
  "settings.permissions.notifications": "Notificações",
  "settings.permissions.notifications_desc":
    "Receba avisos de mensagens novas mesmo com o app fechado. Sem elas, você só vê ao abrir o Airhop.",
  "settings.permissions.camera": "Câmera",
  "settings.permissions.camera_desc":
    "Escaneia códigos QR e tira fotos ou vídeos para enviar. Sem ela, você ainda pode compartilhar mídia da galeria.",
  "settings.permissions.photos": "Fotos",
  "settings.permissions.photos_desc":
    "Envie fotos da galeria e salve a mídia recebida. Sem elas, você ainda pode tirar e enviar fotos novas com a câmera.",
  "settings.permissions.microphone": "Microfone",
  "settings.permissions.microphone_desc":
    "Grave e envie mensagens de voz ou use a voz ao vivo. Sem ele, as mensagens de voz e a voz ao vivo não funcionam.",
  "settings.permissions.allow": "Conceder esta permissão",
  "settings.permissions.open_settings":
    "Abrir as configurações do sistema para mudar esta permissão",
  "settings.permissions.system": "Sistema",

  // ---- Settings: storage and data ----
  "settings.storage.network_usage": "Uso de rede",
  "settings.storage.storage_usage": "Uso de armazenamento",
  "settings.storage.storage_usage_desc":
    "Mensagens, provas da carteira e anexos em cache",
  "settings.storage.session_usage":
    "Esta sessão · {sent} enviados, {received} recebidos",
  "settings.storage.cache": "Cache",
  "settings.storage.cache_desc": "{size} de anexos",
  "settings.storage.clear_cache": "Limpar o cache de anexos",
  "settings.storage.clear": "Limpar",
  "settings.storage.clear_title": "Limpar a mídia em cache?",
  "settings.storage.clear_body":
    "Fotos, vídeos, notas de voz e arquivos são removidos deste aparelho, tanto os enviados quanto os recebidos. Não dá para baixar de novo: os balões vão dizer isso, e você pode pedir para a pessoa reenviar. Mensagens e carteira não são tocadas.",
  "settings.storage.cleared": "Cache limpo",
  "settings.storage.freed": "{size} liberados.",

  // ---- Settings: appearance ----
  "settings.theme.set_a11y": "Definir a aparência como {value}",
  "settings.font.set_a11y": "Definir a fonte monoespaçada como {value}",
  "settings.font.system": "Sistema",
  "settings.font.system_desc":
    "Usa a fonte monoespaçada padrão do seu aparelho",
  "settings.font.jetbrains": "JetBrains Mono",
  "settings.font.jetbrains_desc": "Moderna e fácil de ler",
  "settings.language.en": "Inglês",
  "settings.language.am": "Amárico",
  "settings.language.ar": "Árabe",
  "settings.language.bn": "Bengali",
  "settings.language.my": "Birmanês",
  "settings.language.zh_hans": "Chinês (simplificado)",
  "settings.language.zh_hant": "Chinês (tradicional)",
  "settings.language.nl": "Holandês",
  "settings.language.fil": "Filipino",
  "settings.language.fr": "Francês",
  "settings.language.ka": "Georgiano",
  "settings.language.de": "Alemão",
  "settings.language.hi": "Híndi",
  "settings.language.id": "Indonésio",
  "settings.language.it": "Italiano",
  "settings.language.ja": "Japonês",
  "settings.language.ko": "Coreano",
  "settings.language.mg": "Malgaxe",
  "settings.language.ms": "Malaio",
  "settings.language.ne": "Nepalês",
  "settings.language.fa": "Persa",
  "settings.language.pl": "Polonês",
  "settings.language.pt_br": "Português (Brasil)",
  "settings.language.pt_pt": "Português (Portugal)",
  "settings.language.pa": "Panjabi",
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
  "settings.language.pseudo": "Pseudoidioma",
  "settings.language.soon": "Em breve",
  "settings.language.soon_a11y": "{value}, em breve",
  "settings.language.set_a11y": "Definir o idioma como {value}",
  "settings.language.pending": "Na próxima abertura",
  "settings.language.pending_a11y":
    "{value}, vale a partir da próxima vez que você abrir o Airhop",
  "settings.language.rtl_title": "Abra o Airhop de novo para concluir",
  "settings.language.rtl_body":
    "{value} se lê da direita para a esquerda, e o Airhop só consegue mudar de direção ao iniciar. Feche e abra de novo para concluir a troca. Nada se perde, e até lá sua malha continua conectada.",
  "settings.theme.light": "Claro",
  "settings.theme.light_desc": "Usar sempre a paleta clara",
  "settings.theme.dark": "Escuro",
  "settings.theme.dark_desc": "Usar sempre a paleta escura",

  // ---- Settings: profile and identity ----
  "settings.status.online": "Online",
  "settings.status.online_desc": "Descobrível, anunciando e varrendo",
  "settings.status.away": "Ausente",
  "settings.status.away_desc": "Malha pausada, sem varredura nem anúncio",
  "settings.status.invisible": "Invisível",
  "settings.status.invisible_desc": "Varrendo, mas escondido da descoberta",
  "settings.status.title": "Status",
  "settings.status.set_a11y": "Definir o status como {value}",
  "settings.status.edit": "Editar o status",
  "settings.status.desc": "Escolha o quanto você aparece na malha.",
  "settings.transfer.identity": "Identidade e chaves",
  "settings.transfer.identity_desc":
    "Seu ID de par, seu nome de usuário e seus contatos",
  "settings.transfer.chats": "Conversas e histórico",
  "settings.transfer.chats_desc":
    "Conversas, grupos e os canais em que você entrou",
  "settings.transfer.wallet": "Saldo da carteira",
  "settings.transfer.wallet_desc": "Provas Cashu e histórico de transações",
  "settings.transfer.title": "Passar para um celular novo",
  "settings.transfer.desc":
    "Leve sua identidade, suas conversas e sua carteira para outro aparelho",
  "settings.transfer.coming_soon_a11y": "Passar para um celular novo, em breve",
  "settings.transfer.body":
    "Encoste os dois celulares e transfira tudo por Bluetooth. Nada passa por um servidor, então funciona sem internet.",
  "settings.qr.permission_label": "Acesso às fotos",
  "settings.qr.permission_purpose": "salvar seu código QR",
  "settings.qr.saved": "Salvo",
  "settings.qr.saved_body": "Código QR salvo na sua galeria de fotos.",
  "settings.qr.save_failed": "Não foi possível salvar",
  "settings.qr.save_failed_body":
    "Não foi possível salvar o código QR. Tente de novo.",
  "settings.qr.share_message": "Me adicione no Airhop",
  "settings.qr.share_body":
    "Me adicione no Airhop — mensagens em malha privadas, feitas primeiro para o offline.",
  "settings.qr.show_short": "Ver QR",
  "settings.qr.title": "Seu código QR",
  "settings.qr.note":
    "Ele contém suas chaves públicas, que permitem escreverem para você de qualquer lugar. Compartilhe só com gente de confiança. Ele não muda a menos que você apague sua identidade.",
  "settings.qr.code_label": "Código de contato",
  "settings.qr.copy_code": "Copiar o código de contato",
  "settings.qr.share": "Compartilhar o código QR",
  "settings.qr.share_short": "Compartilhar QR",
  "settings.qr.download": "Baixar o código QR",
  "settings.qr.download_short": "Baixar QR",
  "settings.qr.show": "Ver o código QR",
  "settings.wipe.trigger": "Acionar a limpeza de emergência",
  "settings.wipe.trigger_desc":
    "Toque três vezes para apagar na hora, sem confirmar",
  "settings.wipe.title": "Limpeza de emergência",
  "settings.wipe.now": "Apagar agora",
  "settings.wipe.desc": "Destrói na hora todas as chaves, mensagens e provas",
  "settings.wipe.body":
    "Isto vai destruir na hora todas as suas chaves, mensagens e provas da carteira. Não dá para desfazer.",
  "settings.wipe.in_progress": "Apagando",
  "settings.wipe.in_progress_body":
    "Destruindo suas chaves, mensagens e arquivos. Leva alguns segundos e termina sozinho mesmo se o app for fechado.",
  "settings.wipe.got_it": "Entendi",
  "settings.wipe.keys_failed": "Não foi possível destruir as chaves",
  "settings.wipe.keys_failed_body":
    "Suas mensagens, contatos e carteira já foram, mas o aparelho se recusou a liberar suas chaves. Desbloqueie o aparelho e apague de novo.",

  // ---- Settings: help and feedback ----
  "settings.help.contact": "Fale com a gente",
  "settings.help.contact_a11y": "Enviar um e-mail para {address}",
  "settings.help.bug": "Relatar um erro",
  "settings.help.bug_desc": "Abra uma issue no GitHub",
  "settings.help.bug_a11y": "Relatar um erro no GitHub",
  "settings.help.faq": "Perguntas frequentes",
  "settings.help.faq_desc": "Respostas para as dúvidas mais comuns",
  "settings.help.faq_a11y": "Abrir as perguntas frequentes",
  "settings.help.terms_desc": "Como o Airhop pode ser usado",
  "settings.help.terms_a11y": "Abrir os Termos de Serviço",
  "settings.help.privacy_desc": "O que não coletamos",
  "settings.help.privacy_a11y": "Abrir a Política de Privacidade",

  // ---- Settings: support ----
  "settings.support.card": "Cartão ou UPI",
  "settings.support.card_desc":
    "Internet banking e carteiras digitais, no mundo todo",
  "settings.support.card_a11y":
    "Apoiar por cartão, UPI, internet banking ou carteira digital",
  "settings.support.sponsors": "GitHub Sponsors",
  "settings.support.sponsors_desc":
    "Mensal ou uma única vez, sem taxa da plataforma",
  "settings.support.sponsors_a11y": "Apoiar pelo GitHub Sponsors",
  "settings.support.note":
    "Eu construo o Airhop no meu tempo livre. Não há investidores nem anúncios. Se ele for útil para você, uma contribuição ajuda muito a manter o desenvolvimento ativo. De todo jeito, todo recurso continua gratuito.",

  // ---- Settings: about and version ----
  "settings.about.version": "Versão",
  "settings.about.version_desc": "Versão atual",
  "settings.about.version_a11y": "Ver a versão e procurar atualizações",
  "settings.about.release_notes": "Notas da versão",
  "settings.about.release_notes_desc": "O que há de novo na última versão",
  "settings.about.release_notes_a11y":
    "Abrir as notas da última versão no GitHub",
  "settings.about.source": "Código-fonte",
  "settings.about.source_a11y": "Abrir o código-fonte no GitHub",
  "settings.about.licenses": "Licenças de código aberto",
  "settings.about.open_repo": "Abrir o repositório do {name}",
  "settings.about.licenses_desc": "Pacotes de código aberto de terceiros",
  "settings.about.licenses_a11y": "Ver as licenças de terceiros",
  "settings.version.codename": "Codinome",
  "settings.version.checking": "Verificando",
  "settings.version.check": "Procurar atualizações",
  "settings.version.checking_title": "Procurando atualizações",
  "settings.version.up_to_date": "Você está na versão mais recente.",
  "settings.version.release_notes": "Ver as notas da versão",
  "settings.version.made_with": "Feito com",
  "settings.version.number": "Versão {version}",
  "settings.version.update_to": "Atualizar para {version}",
  "settings.version.update_to_a11y": "Atualizar para a versão {version}",
  "settings.version.released_under": "Publicado sob a licença {license}",
  "settings.version.notes_a11y": "Ver as notas da versão {version}",
  "settings.version.tor_paused":
    "A busca por atualizações fica pausada enquanto o Tor está ligado, para não vazar seu IP. Veja a página de versões no navegador.",
  "settings.version.check_failed":
    "Não foi possível procurar atualizações. Verifique sua conexão e tente de novo.",

  // ---- Transfers: attachment kinds and the floating badge ----
  "transfer.too_large": "{kind} tem {size} KiB e passa do limite de {cap} KiB.",
  "transfer.failed.malformed":
    "Um anexo chegou danificado e não abriu. Peça para a pessoa enviar de novo.",
  "transfer.failed.unsupported_type":
    "Um anexo chegou num formato que este app não consegue abrir.",
  "transfer.failed.type_mismatch":
    "Um anexo foi recusado: o conteúdo não bate com o tipo de arquivo declarado.",
  "transfer.failed.storage":
    "Um anexo chegou mas não pôde ser salvo. Confira seu espaço livre.",
  "transfer.badge.waiting": "Aguardando · {name}",
  "transfer.badge.active_count": "{count} transferências",
  "transfer.badge.sending": "Enviando {name}",
  "transfer.badge.receiving": "Recebendo {name}",
  "transfer.badge.a11y": "{label}, {percent} por cento. Abrir a conversa.",
  "transfer.kind.photo": "Foto",
  "transfer.kind.video": "Vídeo",
  "transfer.kind.voice": "Nota de voz",
  "transfer.this.photo": "Esta foto",
  "transfer.this.video": "Este vídeo",
  "transfer.this.voice": "Esta nota de voz",
  "transfer.this.file": "Este arquivo",
  "transfer.kind.document": "Documento",
  "transfer.kind.voice_preview": "Nota de voz",
  "transfer.kind.photo_preview": "Foto",
  "transfer.kind.video_preview": "Vídeo",
  "transfer.kind.document_preview": "Documento",

  // ---- System notifications ----
  "notif.channel.messages": "Mensagens",
  "notif.channel.nearby": "Pares por perto",
  "notif.channel.nearby_desc":
    "Um aviso ocasional quando a malha encontra gente dentro do alcance do Bluetooth.",
  "notif.nearby.body":
    "Dentro do alcance do Bluetooth agora. Toque para abrir a malha.",
  "notif.channel_message": "{sender}: {preview}",
  "notif.someone": "Alguém",
  "notif.notice_urgent": "Aviso urgente · {content}",
  "notif.notice": "Aviso · {content}",
  "notif.incoming_file": "Arquivo chegando",
  "notif.preview.photo": "📷 Foto",
  "notif.preview.voice": "🎤 Mensagem de voz",
  "notif.preview.video": "🎥 Vídeo",
  "notif.preview.document": "📄 Documento",
  "notif.hidden.title": "Airhop",
  "notif.hidden.dm": "Mensagem nova",
  "notif.hidden.channel": "Atividade nova",
  "notif.hidden.mention": "Você foi mencionado",
  "notif.mention.title": "{sender} mencionou você",
};

export const plurals: Plurals = {
  // ---- Chats: channel list ----
  "chat.channels.show_more": {
    one: "Mostrar mais {count}",
    many: "Mostrar mais {count}",
    other: "Mostrar mais {count}",
  },
  "chat.channels.show_more_a11y": {
    one: "Mostrar mais {count} canal padrão",
    many: "Mostrar mais {count} canais padrão",
    other: "Mostrar mais {count} canais padrão",
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
    one: "{reachable} de {count} membro alcançável",
    many: "{reachable} de {count} membros alcançáveis",
    other: "{reachable} de {count} membros alcançáveis",
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
    one: "Encaminhar {count} mensagem",
    many: "Encaminhar {count} mensagens",
    other: "Encaminhar {count} mensagens",
  },
  "chat.voice.live_speaking_count": {
    one: "{count} falando",
    many: "{count} falando",
    other: "{count} falando",
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
    one: "{count} casa de emissão",
    many: "{count} casas de emissão",
    other: "{count} casas de emissão",
  },
  "wallet.mint.remove_body": {
    one: "{mint} guarda {balance} {unit} em {count} prova. Removê-la apaga essa prova deste aparelho em definitivo e não existe backup. Saque ou envie o saldo antes.",
    many: "{mint} guarda {balance} {unit} em {count} provas. Removê-la apaga essas provas deste aparelho em definitivo e não existe backup. Saque ou envie o saldo antes.",
    other:
      "{mint} guarda {balance} {unit} em {count} provas. Removê-la apaga essas provas deste aparelho em definitivo e não existe backup. Saque ou envie o saldo antes.",
  },

  // ---- Wallet: Lightning ----
  "wallet.ln.pending_deposits": {
    one: "{count} depósito aguardando pagamento. Verificado de novo sempre que o app abre.",
    many: "{count} depósitos aguardando pagamento. Verificados de novo sempre que o app abre.",
    other:
      "{count} depósitos aguardando pagamento. Verificados de novo sempre que o app abre.",
  },

  // ---- Wallet: recovery phrase ----
  "wallet.backup.recovered": {
    one: "{count} prova não gasta recuperada de {mints}.",
    many: "{count} provas não gastas recuperadas de {mints}.",
    other: "{count} provas não gastas recuperadas de {mints}.",
  },
  "wallet.backup.already_spent": {
    one: "{count} moeda foi encontrada, mas já estava gasta, então nada foi creditado por ela. Isso é normal: toda moeda que você já gastou continua aparecendo nos registros que a casa de emissão mantém.",
    many: "{count} moedas foram encontradas, mas já estavam gastas, então nada foi creditado por elas. Isso é normal: toda moeda que você já gastou continua aparecendo nos registros que a casa de emissão mantém.",
    other:
      "{count} moedas foram encontradas, mas já estavam gastas, então nada foi creditado por elas. Isso é normal: toda moeda que você já gastou continua aparecendo nos registros que a casa de emissão mantém.",
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
    one: "{count} não confirmada",
    many: "{count} não confirmadas",
    other: "{count} não confirmadas",
  },
  "wallet.proof_count": {
    one: "{count} prova",
    many: "{count} provas",
    other: "{count} provas",
  },
  "wallet.spent_removed_detail": {
    one: "{count} prova já estava gasta e foi removida.",
    many: "{count} provas já estavam gastas e foram removidas.",
    other: "{count} provas já estavam gastas e foram removidas.",
  },

  // ---- System notifications ----
  "notif.nearby.title": {
    one: "Alguém por perto",
    many: "{count} pessoas por perto",
    other: "{count} pessoas por perto",
  },
};

export const ptBR = { strings, plurals };
