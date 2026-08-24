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
  "footer.group.download": "Baixar",
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
  "settings.language.suggestion": "Ver esta página em português (Brasil)",
  "settings.language.dismiss": "Fechar",

  "home.hero.release": "Versão mais recente",
  "home.hero.title": "Mensagens que funcionam sem internet.",
  "home.hero.body":
    "Celulares por perto formam uma rede mesh por Bluetooth e retransmitem suas mensagens por até sete saltos, com criptografia de ponta a ponta. {no_servers}, {no_accounts}, {no_tracking}.",
  "home.hero.body.no_servers": "Sem servidores",
  "home.hero.body.no_accounts": "sem contas",
  "home.hero.body.no_tracking": "sem rastreamento",
  "home.hero.download": "Baixar o app",
  "home.hero.badges": "Licença MIT · Livre e de código aberto · Funciona com o bitchat",
  "home.hero.group.mobile": "Celular",
  "home.hero.group.desktop": "Computador",
  "home.hero.option.f_droid": "Catálogo de código aberto",
  "home.hero.option.apk": "Download direto",
  "home.hero.option.soon": "Em breve",

  "home.about.eyebrow": "O que é o Airhop",
  "home.about.title": "A maioria dos apps depende de um servidor central.",
  "home.about.sub":
    "Um servidor pode ser vigiado, desligado ou bloqueado. O Airhop não tem nenhum, então não há empresa a ser pressionada nem serviço a ser fechado.",
  "home.about.card": "Visão técnica",
  "home.about.link.mesh": "rede mesh Bluetooth Low Energy",
  "home.about.link.wire_protocol": "protocolo de transmissão",
  "home.about.body.built":
    "O Airhop é um app de código aberto para iOS e Android de mensagens privadas ponto a ponto sobre {mesh}. Ele é construído sobre a base do {bitchat}, reaproveitando seu {wire_protocol} e seu modelo de segurança, e estendendo tudo com pagamentos {ecash} offline e IA offline. Funciona com zero conectividade de internet, e as mensagens são retransmitidas automaticamente entre dispositivos próximos (cerca de 10 a 30 metros por salto em ambientes fechados, mais em campo aberto), por até 7 saltos.",
  "home.about.body.identity":
    "Sua identidade é um par de chaves {ed25519} gerado no seu dispositivo e guardado no {ios_keychain} ou no {android_keystore}. Não há contas, nem cadastros, nem nada que toque um servidor, ou seja, dá para usar como app descartável que não deixa nada ligando de volta a você depois de excluído.",
  "home.about.body.crypto":
    "Cada sessão usa o protocolo {noise} para um handshake autenticado. As mensagens armazenadas usam o algoritmo {ratchet}, ou seja, mesmo que seu dispositivo seja comprometido depois, suas mensagens antigas continuam ilegíveis. A limpeza de pânico destrói todas as chaves e mensagens em menos de um segundo.",
  "home.about.body.internet":
    "Quando você e um contato estão fora do alcance do Bluetooth, os relays do {nostr} servem de ponte pela internet, usando mensagens diretas embrulhadas no formato {nip17}, então a rede mesh se estende globalmente sempre que vocês dois estiverem on-line. O suporte a {tor} também está disponível no iOS (via {arti}) e no Android (via {orbot}).",
  "home.about.optional.title": "O Airhop tem recursos opcionais que você pode ativar:",
  "home.about.optional.payments.label": "Pagamentos offline:",
  "home.about.optional.payments.body":
    "Envie e receba pagamentos pela rede mesh usando o protocolo {cashu} (somente Bitcoin).",
  "home.about.optional.ai.label": "IA offline:",
  "home.about.optional.ai.body":
    "Um pequeno assistente de IA no dispositivo que responde perguntas importantes. Todo o processamento e os dados ficam no seu dispositivo.",
  "home.about.body.compatible":
    "O Airhop é compatível com o bitchat no nível do protocolo. Um dispositivo com Airhop e um com bitchat na mesma rede mesh se descobrem automaticamente e podem trocar mensagens e mensagens diretas sem nenhuma configuração.",

  "home.situations.eyebrow": "Quando você precisa",
  "home.situations.title": "Para o dia em que a rede cai.",
  "home.situations.sub":
    "Desastres naturais, apagões de internet, protestos em massa ou um fim de semana comum fora de alcance.",
  "home.situations.disaster.label": "Desastre",
  "home.situations.disaster.line":
    "As torres caíram. Um aviso no mural chega a quem passar por ali.",
  "home.situations.offgrid.label": "Fora da rede",
  "home.situations.offgrid.line": "Dois dias de trilha. A última barrinha de sinal sumiu ontem.",
  "home.situations.protest.label": "Protesto",
  "home.situations.protest.line":
    "Um QR code num panfleto abre um canal criptografado para a marcha.",
  "home.situations.festival.label": "Festival",
  "home.situations.festival.line":
    "Sem sinal no local. As mensagens saltam pelos celulares de desconhecidos.",

  "home.showcase.eyebrow": "Veja o app",
  "home.showcase.title": "Um mensageiro comum, offline.",
  "home.showcase.sub":
    "Conversas, canais, uma carteira e uma identidade. Familiar na superfície, com uma rede mesh embaixo fazendo o trabalho.",
  "home.showcase.mesh.title": "Mesh",
  "home.showcase.mesh.caption":
    "Todo mundo ao alcance, posicionado pela proximidade. Ninguém precisa ser adicionado antes.",
  "home.showcase.mesh.alt":
    "A tela Mesh do app Airhop, mostrando quatro pares próximos dispostos num radar por intensidade de sinal.",
  "home.showcase.chats.title": "Conversas",
  "home.showcase.chats.caption":
    "Conversas comuns. Os celulares que repassam cada mensagem não conseguem abri-la.",
  "home.showcase.chats.alt":
    "Uma conversa de mensagem direta no Airhop durante uma queda de energia, retransmitida por três celulares.",
  "home.showcase.channels.title": "Canais",
  "home.showcase.channels.caption":
    "Salas públicas do tamanho de um quarteirão ou de uma região inteira, abertas a quem estiver lá.",
  "home.showcase.channels.alt":
    "A tela de conversas do app Airhop, listando canais públicos delimitados a um quarteirão, bairro, cidade e região.",
  "home.showcase.wallet.title": "Carteira",
  "home.showcase.wallet.caption":
    "Passe ecash para quem está ao seu lado por Bluetooth, sem nenhum dos dois celulares on-line.",
  "home.showcase.wallet.alt":
    "A tela da carteira do app Airhop, mostrando um saldo em ecash que pode ser enviado por Bluetooth.",
  "home.showcase.identity.title": "Identidade",
  "home.showcase.identity.caption":
    "Sem cadastro, sem número de telefone, sem e-mail. Só uma chave que nunca sai deste celular.",
  "home.showcase.identity.alt":
    "A tela de perfil do app Airhop, mostrando uma identidade gerada no dispositivo, sem conta.",

  "home.how.eyebrow": "Como funciona",
  "home.how.title": "A rede mesh se forma sozinha.",
  "home.how.sub":
    "Nós próximos formam uma rede mesh que se recupera sozinha por Bluetooth. Quando há internet, os relays do Nostr a estendem, sem infraestrutura controlada por ninguém.",
  "home.how.cta": "Ler a arquitetura completa",
  "home.how.discover.title": "Descobrir",
  "home.how.discover.line":
    "Celulares rodando Airhop ou bitchat se encontram automaticamente por Bluetooth. Sem pareamento, sem configuração.",
  "home.how.relay.title": "Retransmitir",
  "home.how.relay.line":
    "Uma mensagem salta de celular em celular, por até sete saltos. Os celulares no meio nunca veem o que carregam.",
  "home.how.reach.title": "Ir mais longe",
  "home.how.reach.line":
    "Quando há internet, os relays do Nostr levam a mesma conversa mais longe, opcionalmente pelo Tor.",
  "home.how.swipe": "deslize para explorar",
  "home.how.diagram": "Rede mesh BLE · rede local ponto a ponto",
  "home.how.legend.node": "Nó da rede mesh BLE (offline)",
  "home.how.legend.relay": "Retransmissão multissalto (criptografada com Noise XX)",
  "home.how.legend.bitchat": "Compatível com bitchat na mesma rede mesh",
  "home.how.legend.nostr": "Ponte Nostr (internet, quando on-line)",

  "home.map.aria": "Mapa-múndi das localizações dos relays Nostr",
  "home.map.summary": "Ponte Nostr · {relays} em {locations} pelo mundo",
  "home.map.detail": "{place} · {relays} · {hosts}",
  "home.map.site_aria": "{host}, {relays}",

  "home.features.eyebrow": "O que ele faz",
  "home.features.title": "Um mensageiro de verdade, não uma demonstração.",
  "home.features.sub":
    "Conversa, identidade, rede e dinheiro. Tudo feito para funcionar sem sinal, sem conta e sem nada no meio.",

  "home.features.messaging.title": "Mensagens",
  "home.features.messaging.summary":
    "Tudo o que um mensageiro tem, com zero infraestrutura por trás.",
  "home.features.messaging.dms.name": "Mensagens diretas privadas",
  "home.features.messaging.dms.line":
    "Criptografadas de ponta a ponta, com confirmação de entrega e de leitura.",
  "home.features.messaging.location.name": "Canais por localização",
  "home.features.messaging.location.line":
    "Salas ligadas a um lugar, de um quarteirão a uma região.",
  "home.features.messaging.groups.name": "Canais e grupos privados",
  "home.features.messaging.groups.line":
    "Links de convite para uma sala, ou uma lista assinada de até 16.",
  "home.features.messaging.board.name": "Mural de avisos",
  "home.features.messaging.board.line": "Avisos fixados numa área por até sete dias.",
  "home.features.messaging.voice.name": "Voz ao vivo",
  "home.features.messaging.voice.line":
    "Segure o microfone e fale com quem estiver ao alcance, estilo walkie-talkie.",
  "home.features.messaging.notes.name": "Notas de voz",
  "home.features.messaging.notes.line": "Áudio gravado, mais rápido do que digitar instruções.",
  "home.features.messaging.files.name": "Fotos, vídeo e arquivos",
  "home.features.messaging.files.line": "Qualquer formato, até 1 MiB, sem precisar de sinal.",
  "home.features.messaging.forward.name": "Armazenar e encaminhar",
  "home.features.messaging.forward.line":
    "Lacrada e carregada por um celular próximo até chegar ao destino.",

  "home.features.identity.title": "Identidade",
  "home.features.identity.summary": "Nada para cadastrar, nada para apreender.",
  "home.features.identity.keys.name": "Identidade por par de chaves",
  "home.features.identity.keys.line": "Criada neste celular, guardada no chaveiro do sistema.",
  "home.features.identity.names.name": "Nomes legíveis",
  "home.features.identity.names.line": "Derivados da sua chave, então ninguém pode tomar o seu.",
  "home.features.identity.qr.name": "Contatos por QR",
  "home.features.identity.qr.line": "Uma leitura carrega as chaves, não só o nome.",
  "home.features.identity.panic.name": "Limpeza de pânico",
  "home.features.identity.panic.line":
    "Todas as chaves e mensagens destruídas em menos de um segundo.",

  "home.features.networking.title": "Rede",
  "home.features.networking.summary": "Os celulares são a rede.",
  "home.features.networking.mesh.name": "Rede mesh Bluetooth",
  "home.features.networking.mesh.line":
    "Sem internet, sem roteador, em celulares que as pessoas já têm.",
  "home.features.networking.bridge.name": "Ponte mesh",
  "home.features.networking.bridge.line":
    "Liga sua conversa pública a um grupo próximo fora de alcance.",
  "home.features.networking.wifi.name": "Atalho por WiFi",
  "home.features.networking.wifi.line":
    "Transferências mais rápidas entre dois Androids ou dois iPhones.",
  "home.features.networking.bitchat.name": "Compatível com bitchat",
  "home.features.networking.bitchat.line":
    "Os dois apps entram na mesma rede mesh sem configuração.",

  "home.features.internet.title": "Internet",
  "home.features.internet.summary": "Uma extensão, nunca um requisito.",
  "home.features.internet.nostr.name": "Alternativa via Nostr",
  "home.features.internet.nostr.line":
    "Mensagens diretas e canais por localização continuam fluindo além do alcance do rádio.",
  "home.features.internet.relays.name": "Descoberta de georrelays",
  "home.features.internet.relays.line":
    "Mais de 300 relays públicos independentes, nenhum deles nosso.",
  "home.features.internet.gateway.name": "Gateway de internet",
  "home.features.internet.gateway.line":
    "Empreste sua conexão para que um celular offline por perto alcance os canais por localização.",
  "home.features.internet.tor.name": "Integração com Tor",
  "home.features.internet.tor.line":
    "Roteado nas duas plataformas, então os relays nunca veem seu IP.",

  "home.features.optional.title": "Opcional",
  "home.features.optional.summary": "Desligado por padrão. Ligado quando você quiser.",
  "home.features.optional.cashu.name": "Ecash com Cashu",
  "home.features.optional.cashu.line": "Pague quem está ao seu lado sem nenhum celular on-line.",
  "home.features.optional.lightning.name": "Lightning",
  "home.features.optional.lightning.line": "Recarregue ou saque em bitcoin pela rede Lightning.",
  "home.features.optional.ai.name": "IA local",
  "home.features.optional.ai.line": "Respostas no dispositivo, nada sai do celular.",
  "home.features.optional.social.name": "Pontes sociais",
  "home.features.optional.social.line": "Bluesky e Mastodon com a mesma identidade.",

  "home.compare.eyebrow": "Como se compara",
  "home.compare.title": "Offline, sem hardware extra e aberto.",
  "home.compare.sub":
    "Todo app aqui é bom em alguma coisa. Só alguns continuam funcionando quando a rede não funciona.",
  "home.compare.col.project": "Projeto",
  "home.compare.col.transport": "Transporte",
  "home.compare.col.encryption": "Criptografia",
  "home.compare.col.offline": "Funciona offline",
  "home.compare.col.hardware_free": "Sem hardware extra",
  "home.compare.col.open_source": "Código aberto",
  "home.compare.mark.yes": "Sim",
  "home.compare.mark.no": "Não",
  "home.compare.mark.partial": "Parcial, os clientes são de código aberto, os servidores não",
  "home.compare.mark.partial_hint": "Os clientes são de código aberto, os servidores não",
  "home.compare.transport.servers": "Servidores centralizados",
  "home.compare.transport.onion": "Roteamento onion (nós de serviço)",
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
    "{headline} Todo o código é revisado pessoalmente e passa por um {review} antes de ser publicado, e a biblioteca criptográfica que ele usa é auditada pela Cure53, mas isso não substitui uma auditoria formal do app em si. Uma está prevista para a {version}. Não confie nele para casos de uso sensíveis até lá.",
  "home.explore.audit.link.review": "agente de revisão de segurança",
  "home.explore.source.title": "Código-fonte",
  "home.explore.source.desc":
    "Tudo no GitHub sob licença MIT. Issues, pull requests e discussões abertas.",
  "home.explore.protocol.title": "Especificação do protocolo",
  "home.explore.protocol.desc":
    "O formato exato de transmissão, os UUIDs BLE e as constantes, compartilhados com o bitchat.",
  "home.explore.architecture.title": "Arquitetura",
  "home.explore.architecture.desc":
    "O detalhamento técnico completo, de tocar em enviar até os bytes no rádio.",
  "home.explore.roadmap.title": "Roadmap",
  "home.explore.roadmap.desc":
    "Metas por versão, da v0.5.0 à v2.0.0, incluindo a auditoria planejada.",
  "home.explore.vision.title": "Visão",
  "home.explore.vision.desc": "Por que o Airhop existe e os princípios que não mudam sob pressão.",
  "home.explore.brand.title": "Kit de marca",
  "home.explore.brand.desc":
    "O pássaro de pixels, os tokens de cor e tipografia, materiais de imprensa e textos padrão.",

  "home.contribute.eyebrow": "Apoie este projeto",
  "home.contribute.title": "Independente e às claras.",
  "home.contribute.sub":
    "Não há investidores, nem anúncios, nem versão paga. Todos os recursos continuam gratuitos de qualquer forma, e o trabalho é financiado por quem o acha útil.",
  "home.contribute.contribute.chip": "Contribuir",
  "home.contribute.contribute.body":
    "Dê uma estrela ao repositório, abra issues e envie pull requests. Relatos de bugs, propostas de recursos e contribuições de código são todos bem-vindos.",
  "home.contribute.contribute.cta": "Ver no GitHub",
  "home.contribute.sponsor.chip": "Patrocinar",
  "home.contribute.sponsor.body":
    "Se o Airhop é útil para você, uma doação única ou um patrocínio recorrente ajuda muito a manter o desenvolvimento ativo.",
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
  "page.notfound.body": "A página que você procura não existe ou foi movida.",

  "page.english_only": "Esta página está disponível apenas em inglês.",

  "seo.breadcrumb.home": "Início",

  "seo.home.title": "Airhop — Mensageiro privado e offline-first",
  "seo.home.description":
    "Mensagens privadas ponto a ponto para iOS e Android. Sem internet, sem servidores, sem contas. Comunique-se por rede mesh Bluetooth em qualquer lugar.",

  "seo.architecture.title": "Arquitetura — Airhop",
  "seo.architecture.description":
    "Como o Airhop funciona, de cima a baixo: identidade, escolha de transporte, a rede mesh Bluetooth, criptografia, a camada de internet, Tor, ecash offline, IA no dispositivo e o formato de transmissão compatível com o bitchat.",
  "seo.architecture.breadcrumb": "Arquitetura",
  "seo.architecture.headline": "Arquitetura do Airhop",
  "seo.architecture.summary":
    "Um detalhamento técnico completo do Airhop: identidade, transportes, a rede mesh Bluetooth, criptografia, a camada de internet Nostr, Tor, a carteira Cashu, o assistente de IA no dispositivo e o formato de transmissão.",

  "seo.faq.title": "Perguntas frequentes — Airhop",
  "seo.faq.description":
    "Respostas sobre as mensagens por rede mesh Bluetooth do Airhop, criptografia, pagamentos offline, a camada de internet Nostr e a compatibilidade com o bitchat.",
  "seo.faq.breadcrumb": "Perguntas frequentes",

  "seo.blogs.title": "Blog — Airhop",
  "seo.blogs.description": "Textos sobre redes mesh, privacidade e software offline-first.",
  "seo.blogs.breadcrumb": "Blog",

  "seo.brand.title": "Kit de marca — Airhop",
  "seo.brand.description":
    "O kit de marca do Airhop: o pássaro de pixels, o logotipo, os tokens de cor e tipografia, materiais de imprensa e textos padrão.",
  "seo.brand.breadcrumb": "Kit de marca",

  "seo.privacy.title": "Política de privacidade — Airhop",
  "seo.privacy.description":
    "Como o Airhop trata os dados: sem contas, sem servidores, sem rastreamento. Sua identidade e suas mensagens ficam no seu dispositivo.",
  "seo.privacy.breadcrumb": "Política de privacidade",

  "seo.terms.title": "Termos de serviço — Airhop",
  "seo.terms.description": "Termos que regem o uso do app e do site do Airhop.",
  "seo.terms.breadcrumb": "Termos de serviço",

  "seo.notfound.title": "Página não encontrada — Airhop",
  "seo.notfound.description": "A página que você procura não existe ou foi movida.",
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
