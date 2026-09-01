import type { Locale, Plurals, Strings } from "./types.ts";

const strings: Strings = {
  "common.back_to_home": "Voltar ao início",
  "common.last_updated": "Última atualização: {date}",

  "nav.aria": "Principal",
  "nav.home": "Início do Airhop",
  "nav.skip": "Pular para o conteúdo",
  "nav.menu.open": "Abrir menu",
  "nav.menu.close": "Fechar menu",
  "nav.how_it_works": "Como funciona",
  "nav.architecture": "Arquitetura",
  "nav.faq": "Perguntas frequentes",

  "footer.aria": "Rodapé",
  "footer.tagline": "Comunicação mesh privada",
  "footer.credit": "© Feito com {heart} por {author}",
  "footer.group.download": "Transferir",
  "footer.group.resources": "Recursos",
  "footer.group.social": "Redes",
  "footer.group.legal": "Jurídico",
  "footer.link.app_store": "App Store",
  "footer.link.play_store": "Google Play",
  "footer.link.f_droid": "F-Droid",
  "footer.link.architecture": "Arquitetura",
  "footer.link.blogs": "Blog",
  "footer.link.faq": "Perguntas frequentes",
  "footer.link.x": "X",
  "footer.link.instagram": "Instagram",
  "footer.link.linkedin": "LinkedIn",
  "footer.link.terms": "Termos de serviço",
  "footer.link.privacy": "Política de privacidade",
  "footer.link.license": "Licença do projeto",

  "settings.theme.group": "Tema de cores",
  "settings.theme.light": "Tema claro",
  "settings.theme.dark": "Tema escuro",
  "settings.language.label": "Idioma",
  "settings.language.suggestion": "Ver esta página em português (Portugal)",
  "settings.language.dismiss": "Fechar",

  "home.hero.release": "Versão mais recente",
  "home.hero.title": "Mensagens que funcionam sem Internet.",
  "home.hero.body":
    "Telemóveis por perto formam uma rede mesh por Bluetooth e retransmitem as suas mensagens até sete saltos, com cifra ponta a ponta. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Sem servidores",
  "home.hero.body.no_accounts": "sem contas",
  "home.hero.body.no_tracking": "sem rastreamento",
  "home.hero.download": "Transferir a aplicação",
  "home.hero.badges": "Licença MIT · Livre e de código aberto · Funciona com o bitchat",
  "home.hero.group.mobile": "Telemóvel",
  "home.hero.group.desktop": "Computador",
  "home.hero.option.f_droid": "Catálogo de código aberto",
  "home.hero.option.apk": "Transferência direta",
  "home.hero.option.soon": "Em breve",

  "home.about.eyebrow": "O que é o Airhop",
  "home.about.title": "A maioria das aplicações depende de um servidor central.",
  "home.about.sub":
    "Um servidor pode ser vigiado, desligado ou bloqueado. O Airhop não tem nenhum, por isso não há empresa a pressionar nem serviço a fechar.",
  "home.about.card": "Visão técnica",
  "home.about.link.mesh": "rede mesh Bluetooth Low Energy",
  "home.about.link.wire_protocol": "protocolo de transmissão",
  "home.about.body.built":
    "O Airhop é uma aplicação de código aberto para iOS e Android de mensagens privadas ponto a ponto sobre {mesh}. É construída sobre a base do {bitchat}, reaproveitando o seu {wire_protocol} e o seu modelo de segurança, e estendendo tudo com pagamentos {ecash} offline e IA offline. Funciona com zero ligação à Internet, e as mensagens são retransmitidas automaticamente entre dispositivos próximos (cerca de 10 a 30 metros por salto em espaços fechados, mais em campo aberto), até 7 saltos.",
  "home.about.body.identity":
    "A sua identidade é um par de chaves {ed25519} gerado no seu dispositivo e guardado no {ios_keychain} ou no {android_keystore}. Não há contas, nem registos, nem nada que toque num servidor, ou seja, pode ser usada como aplicação descartável que não deixa nada a ligar de volta a si depois de eliminada.",
  "home.about.body.crypto":
    "Cada sessão usa o protocolo {noise} para um handshake autenticado. As mensagens guardadas usam o algoritmo {ratchet}, ou seja, mesmo que o seu dispositivo seja comprometido mais tarde, as suas mensagens antigas continuam ilegíveis. A limpeza de pânico destrói todas as chaves e mensagens em menos de um segundo.",
  "home.about.body.internet":
    "Quando você e um contacto estão fora do alcance do Bluetooth, os relays do {nostr} servem de ponte pela Internet, usando mensagens diretas embrulhadas no formato {nip17}, por isso a rede mesh estende-se globalmente sempre que os dois estiverem online. O suporte a {tor} está disponível no iOS e no Android, via {arti}.",
  "home.about.optional.title": "O Airhop tem funcionalidades opcionais que pode ativar:",
  "home.about.optional.payments.label": "Pagamentos offline:",
  "home.about.optional.payments.body":
    "Envie e receba pagamentos pela rede mesh usando o protocolo {cashu} (somente Bitcoin).",
  "home.about.optional.ai.label": "IA offline:",
  "home.about.optional.ai.body":
    "Um pequeno assistente de IA no dispositivo que responde perguntas importantes. Todo o processamento e os dados ficam no seu dispositivo.",
  "home.about.body.compatible":
    "O Airhop é compatível com o bitchat ao nível do protocolo. Um dispositivo com Airhop e um com bitchat na mesma rede mesh descobrem-se automaticamente e podem trocar mensagens e mensagens diretas sem qualquer configuração.",

  "home.situations.eyebrow": "Quando você precisa",
  "home.situations.title": "Para o dia em que a rede cai.",
  "home.situations.sub":
    "Catástrofes naturais, cortes de Internet, manifestações em massa ou um fim de semana normal fora de alcance.",
  "home.situations.disaster.label": "Desastre",
  "home.situations.disaster.line":
    "As torres caíram. Um aviso no quadro chega a quem passar por ali.",
  "home.situations.offgrid.label": "Fora da rede",
  "home.situations.offgrid.line":
    "Dois dias de caminhada. A última barra de sinal desapareceu ontem.",
  "home.situations.protest.label": "Manifestação",
  "home.situations.protest.line": "Um código QR num panfleto abre um canal cifrado para a marcha.",
  "home.situations.festival.label": "Festival",
  "home.situations.festival.line":
    "Sem rede no local. As mensagens saltam pelos telemóveis de desconhecidos.",

  "home.showcase.eyebrow": "Veja a aplicação",
  "home.showcase.title": "Um mensageiro comum, offline.",
  "home.showcase.sub":
    "Conversas, canais, uma carteira e uma identidade. Familiar à superfície, com uma rede mesh por baixo a fazer o trabalho.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Toda a gente ao alcance, colocada pela proximidade. Ninguém tem de ser adicionado antes.",
  "home.showcase.mesh.alt":
    "O ecrã Mesh da aplicação Airhop, mostrando quatro pares próximos dispostos num radar por intensidade de sinal.",
  "home.showcase.chats.title": "Conversas",
  "home.showcase.chats.caption":
    "Conversas normais. Os telemóveis que passam cada mensagem adiante não a conseguem abrir.",
  "home.showcase.chats.alt":
    "Uma conversa de mensagem direta no Airhop durante um corte de energia, retransmitida por três telemóveis.",
  "home.showcase.channels.title": "Canais",
  "home.showcase.channels.caption":
    "Salas públicas do tamanho de um quarteirão ou de uma região inteira, abertas a quem lá estiver.",
  "home.showcase.channels.alt":
    "O ecrã de conversas da aplicação Airhop, listando canais públicos delimitados a um quarteirão, bairro, cidade e região.",
  "home.showcase.wallet.title": "Carteira",
  "home.showcase.wallet.caption":
    "Passe ecash a quem está ao seu lado por Bluetooth, sem nenhum dos telemóveis online.",
  "home.showcase.wallet.alt":
    "O ecrã da carteira da aplicação Airhop, mostrando um saldo em ecash que pode ser enviado por Bluetooth.",
  "home.showcase.identity.title": "Identidade",
  "home.showcase.identity.caption":
    "Sem registo, sem número de telefone, sem email. Só uma chave que nunca sai deste telemóvel.",
  "home.showcase.identity.alt":
    "O ecrã de perfil da aplicação Airhop, mostrando uma identidade gerada no dispositivo, sem conta.",

  "home.how.eyebrow": "Como funciona",
  "home.how.title": "A rede mesh se forma sozinha.",
  "home.how.sub":
    "Nós próximos formam uma rede mesh que se repara sozinha por Bluetooth. Quando há Internet, os relays do Nostr estendem-na, sem infraestrutura controlada por ninguém.",
  "home.how.cta": "Ler a arquitetura completa",
  "home.how.discover.title": "Descobrir",
  "home.how.discover.line":
    "Telemóveis com Airhop ou bitchat encontram-se automaticamente por Bluetooth. Sem emparelhamento, sem configuração.",
  "home.how.relay.title": "Retransmitir",
  "home.how.relay.line":
    "Uma mensagem salta de telemóvel em telemóvel, até sete saltos. Os telemóveis pelo meio nunca veem o que transportam.",
  "home.how.reach.title": "Ir mais longe",
  "home.how.reach.line":
    "Quando há Internet, os relays do Nostr levam a mesma conversa mais longe, opcionalmente pelo Tor.",
  "home.how.swipe": "deslize para explorar",
  "home.how.diagram": "Rede mesh BLE · rede local ponto a ponto",
  "home.how.legend.node": "Nó da rede mesh BLE (offline)",
  "home.how.legend.relay": "Retransmissão multissalto (cifrada com Noise XX)",
  "home.how.legend.bitchat": "Compatível com bitchat na mesma rede mesh",
  "home.how.legend.nostr": "Ponte Nostr (Internet, quando online)",

  "home.map.aria": "Mapa-múndi das localizações dos relays Nostr",
  "home.map.summary": "Ponte Nostr · {relays} em {locations} pelo mundo",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "O que ele faz",
  "home.features.title": "Um mensageiro de verdade, não uma demonstração.",
  "home.features.sub":
    "Conversa, identidade, rede e dinheiro. Tudo feito para funcionar sem rede, sem conta e sem nada pelo meio.",

  "home.features.messaging.title": "Mensagens",
  "home.features.messaging.summary":
    "Tudo o que um mensageiro tem, com zero infraestrutura por trás.",
  "home.features.messaging.dms.name": "Mensagens diretas privadas",
  "home.features.messaging.dms.line":
    "Cifradas de ponta a ponta, com confirmação de entrega e de leitura.",
  "home.features.messaging.location.name": "Canais por localização",
  "home.features.messaging.location.line":
    "Salas ligadas a um lugar, de um quarteirão a uma região.",
  "home.features.messaging.groups.name": "Canais e grupos privados",
  "home.features.messaging.groups.line":
    "Links de convite para uma sala, ou uma lista assinada de até 16.",
  "home.features.messaging.board.name": "Quadro de avisos",
  "home.features.messaging.board.line": "Avisos fixados numa área por até sete dias.",
  "home.features.messaging.voice.name": "Voz ao vivo",
  "home.features.messaging.voice.line":
    "Prima o microfone e fale com quem estiver ao alcance, estilo walkie-talkie.",
  "home.features.messaging.notes.name": "Notas de voz",
  "home.features.messaging.notes.line": "Áudio gravado, mais rápido do que escrever indicações.",
  "home.features.messaging.files.name": "Fotos, vídeo e ficheiros",
  "home.features.messaging.files.line": "Qualquer formato, até 1 MiB, sem precisar de rede.",
  "home.features.messaging.forward.name": "Armazenar e encaminhar",
  "home.features.messaging.forward.line":
    "Selada e transportada por um telemóvel próximo até chegar ao destino.",

  "home.features.identity.title": "Identidade",
  "home.features.identity.summary": "Nada para registar, nada para apreender.",
  "home.features.identity.keys.name": "Identidade por par de chaves",
  "home.features.identity.keys.line":
    "Criada neste telemóvel, guardada no porta-chaves do sistema.",
  "home.features.identity.names.name": "Nomes legíveis",
  "home.features.identity.names.line":
    "Derivados da sua chave, por isso ninguém lhe pode tirar o seu.",
  "home.features.identity.qr.name": "Contatos por código QR",
  "home.features.identity.qr.line": "Uma leitura transporta as chaves, não só o nome.",
  "home.features.identity.panic.name": "Limpeza de pânico",
  "home.features.identity.panic.line":
    "Todas as chaves e mensagens destruídas em menos de um segundo.",

  "home.features.networking.title": "Rede",
  "home.features.networking.summary": "Os telemóveis são a rede.",
  "home.features.networking.mesh.name": "Rede mesh Bluetooth",
  "home.features.networking.mesh.line":
    "Sem Internet, sem router, em telemóveis que as pessoas já têm.",
  "home.features.networking.bridge.name": "Ponte mesh",
  "home.features.networking.bridge.line":
    "Liga a sua conversa pública a um grupo próximo fora de alcance.",
  "home.features.networking.wifi.name": "Atalho por WiFi",
  "home.features.networking.wifi.line":
    "Transferências mais rápidas entre dois Androids ou dois iPhones.",
  "home.features.networking.bitchat.name": "Compatível com bitchat",
  "home.features.networking.bitchat.line":
    "As duas aplicações entram na mesma rede mesh sem configuração.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Uma extensão, nunca um requisito.",
  "home.features.internet.nostr.name": "Alternativa via Nostr",
  "home.features.internet.nostr.line":
    "Mensagens diretas e canais por localização continuam a fluir para lá do alcance do rádio.",
  "home.features.internet.relays.name": "Descoberta de georrelays",
  "home.features.internet.relays.line":
    "Mais de 300 relays públicos independentes, nenhum deles nosso.",
  "home.features.internet.gateway.name": "Gateway de internet",
  "home.features.internet.gateway.line":
    "Empreste a sua ligação para que um telemóvel offline por perto alcance os canais por localização.",
  "home.features.internet.tor.name": "Integração com Tor",
  "home.features.internet.tor.line":
    "Encaminhado nas duas plataformas, por isso os relays nunca veem o seu IP.",

  "home.features.optional.title": "Opcional",
  "home.features.optional.summary": "Desligado por omissão. Ligado quando quiser.",
  "home.features.optional.cashu.name": "Ecash com Cashu",
  "home.features.optional.cashu.line": "Pague a quem está ao seu lado sem nenhum telemóvel online.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "Carregue ou levante em bitcoin pela rede Lightning.",
  "home.features.optional.ai.name": "IA local",
  "home.features.optional.ai.line": "Respostas no dispositivo, nada sai do telemóvel.",
  "home.features.optional.social.name": "Pontes sociais",
  "home.features.optional.social.line": "Bluesky e Mastodon com a mesma identidade.",

  "home.compare.eyebrow": "Como se compara",
  "home.compare.title": "Offline, sem hardware extra e aberto.",
  "home.compare.sub":
    "Todas as aplicações aqui são boas em alguma coisa. Só algumas continuam a funcionar quando a rede não funciona.",
  "home.compare.col.project": "Projeto",
  "home.compare.col.transport": "Transporte",
  "home.compare.col.encryption": "Cifra",
  "home.compare.col.offline": "Funciona offline",
  "home.compare.col.hardware_free": "Sem hardware extra",
  "home.compare.col.open_source": "Código aberto",
  "home.compare.mark.yes": "Sim",
  "home.compare.mark.no": "Não",
  "home.compare.mark.partial": "Parcial, os clientes são de código aberto, os servidores não",
  "home.compare.mark.partial_hint": "Os clientes são de código aberto, os servidores não",
  "home.compare.transport.servers": "Servidores centralizados",
  "home.compare.transport.onion": "Encaminhamento onion (nós de serviço)",
  "home.compare.transport.nostr": "Relays Nostr",
  "home.compare.transport.lora": "Rádio LoRa",
  "home.compare.transport.sub_ghz": "Rádio sub-GHz proprietário",

  "home.explore.eyebrow": "Aberto e honesto",
  "home.explore.title": "Toda afirmação aqui pode ser verificada.",
  "home.explore.sub":
    "O código, o protocolo e os planos são públicos. As limitações também. Verifique você mesmo antes de acreditar na nossa palavra.",
  "home.explore.audit.chip": "Auditoria pendente",
  "home.explore.audit.headline":
    "O Airhop ainda não passou por uma auditoria de segurança externa.",
  "home.explore.audit.body":
    "{headline} Todo o código é revisto pessoalmente e passa por um {review} antes de ser publicado, e a biblioteca criptográfica que usa é auditada pela Cure53, mas isso não substitui uma auditoria formal da aplicação em si. Está prevista uma para a {version}. Não confie nele para casos de uso sensíveis até lá.",
  "home.explore.audit.link.review": "agente de revisão de segurança",
  "home.explore.source.title": "Código-fonte",
  "home.explore.source.desc":
    "Tudo no GitHub sob licença MIT. Issues, pull requests e discussões abertas.",
  "home.explore.protocol.title": "Especificação do protocolo",
  "home.explore.protocol.desc":
    "O formato exato de transmissão, os UUID BLE e as constantes, partilhados com o bitchat.",
  "home.explore.architecture.title": "Arquitetura",
  "home.explore.architecture.desc":
    "A análise técnica completa, desde tocar em enviar até aos bytes no rádio.",
  "home.explore.roadmap.title": "Roadmap",
  "home.explore.roadmap.desc":
    "Metas por versão, da v0.5.0 à v2.0.0, incluindo a auditoria planejada.",
  "home.explore.vision.title": "Visão",
  "home.explore.vision.desc": "Por que o Airhop existe e os princípios que não mudam sob pressão.",
  "home.explore.brand.title": "Kit de marca",
  "home.explore.brand.desc":
    "O pássaro de píxeis, os tokens de cor e tipografia, materiais de imprensa e textos padrão.",

  "home.contribute.eyebrow": "Apoie este projeto",
  "home.contribute.title": "Independente e às claras.",
  "home.contribute.sub":
    "Não há investidores, nem anúncios, nem versão paga. Todas as funcionalidades continuam gratuitas de qualquer forma, e o trabalho é financiado por quem o acha útil.",
  "home.contribute.contribute.chip": "Contribuir",
  "home.contribute.contribute.body":
    "Dê uma estrela ao repositório, abra issues e envie pull requests. Relatórios de erros, propostas de funcionalidades e contribuições de código são todos bem-vindos.",
  "home.contribute.contribute.cta": "Ver no GitHub",
  "home.contribute.sponsor.chip": "Patrocinar",
  "home.contribute.sponsor.body":
    "Se o Airhop lhe é útil, um donativo único ou um patrocínio recorrente ajuda muito a manter o desenvolvimento ativo.",
  "home.contribute.sponsor.donate": "Doar uma vez",
  "home.contribute.sponsor.github": "Patrocinar no GitHub",

  "page.architecture.eyebrow": "Documentação",
  "page.architecture.title": "Arquitetura",
  "page.architecture.toc": "Nesta página",

  "page.faq.eyebrow": "Perguntas frequentes",
  "page.faq.title": "Perguntas frequentes",
  "page.faq.meta": "Dúvidas comuns sobre o Airhop.",
  "page.faq.contact":
    "Perguntas não respondidas aqui podem ser enviadas para {email} ou levantadas abrindo uma discussão no {github}.",

  "page.blogs.eyebrow": "Blog",
  "page.blogs.title": "Em breve",
  "page.blogs.body": "Textos sobre redes mesh, privacidade e software offline-first.",

  "page.brand.eyebrow": "Marca",
  "page.brand.title": "Kit de marca",
  "page.brand.meta":
    "Materiais e regras para usar o Airhop num artigo, numa página de loja, numa palestra ou num README. Livre para uso como referência e para a imprensa.",

  "page.legal.eyebrow": "Jurídico",
  "page.privacy.title": "Política de privacidade",
  "page.terms.title": "Termos de serviço",

  "page.notfound.title": "Página não encontrada",
  "page.notfound.body": "A página que procura não existe ou foi movida.",

  "page.english_only": "Esta página está disponível apenas em inglês.",

  "seo.breadcrumb.home": "Início",

  "seo.home.title": "Airhop — Mensageiro privado, offline-first",
  "seo.home.description":
    "Mensagens privadas ponto a ponto para iOS e Android. Sem Internet, sem servidores, sem contas. Comunique por rede mesh Bluetooth em qualquer lugar.",

  "seo.architecture.title": "Arquitetura — Airhop",
  "seo.architecture.description":
    "Como o Airhop funciona, de cima a baixo: identidade, escolha de transporte, a rede mesh Bluetooth, cifra, a camada de Internet, Tor, ecash offline, IA no dispositivo e o formato de transmissão compatível com o bitchat.",
  "seo.architecture.breadcrumb": "Arquitetura",
  "seo.architecture.headline": "Arquitetura do Airhop",
  "seo.architecture.summary":
    "Uma análise técnica completa do Airhop: identidade, transportes, a rede mesh Bluetooth, cifra, a camada de Internet Nostr, Tor, a carteira Cashu, o assistente de IA no dispositivo e o formato de transmissão.",

  "seo.faq.title": "Perguntas frequentes — Airhop",
  "seo.faq.description":
    "Respostas sobre as mensagens por rede mesh Bluetooth do Airhop, cifra, pagamentos offline, a camada de Internet Nostr e a compatibilidade com o bitchat.",
  "seo.faq.breadcrumb": "Perguntas frequentes",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description": "Textos sobre redes mesh, privacidade e software offline-first.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Kit de marca — Airhop",
  "seo.brand.description":
    "O kit de marca do Airhop: o pássaro de píxeis, o logótipo, os tokens de cor e tipografia, materiais de imprensa e textos padrão.",
  "seo.brand.breadcrumb": "Kit de marca",

  "seo.privacy.title": "Política de privacidade — Airhop",
  "seo.privacy.description":
    "Como o Airhop trata os dados: sem contas, sem servidores, sem rastreio. A sua identidade e as suas mensagens ficam no seu dispositivo.",
  "seo.privacy.breadcrumb": "Política de privacidade",

  "seo.terms.title": "Termos de serviço — Airhop",
  "seo.terms.description": "Termos que regem o uso da aplicação e do site do Airhop.",
  "seo.terms.breadcrumb": "Termos de serviço",

  "seo.notfound.title": "Página não encontrada — Airhop",
  "seo.notfound.description": "A página que procura não existe ou foi movida.",
};

const plurals: Plurals = {
  "home.map.relays": {
    one: "{count} relay",
    other: "{count} relays",
  },
  "home.map.locations": {
    one: "{count} localidade",
    other: "{count} localidades",
  },
};

export const locale: Locale = { strings, plurals };
