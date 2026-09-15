/* ÓRBITA — conteúdo inicial (seed). Isso é usado quando não há nada salvo
   ainda no navegador (localStorage). O admin pode editar/criar posts em
   /admin — as alterações ficam salvas neste navegador. Para publicar de
   forma permanente para todos os visitantes, use "Exportar" no admin e
   substitua o conteúdo deste arquivo pelo código gerado.

   As imagens de exemplo abaixo são artes abstratas locais
   (assets/images/*.svg) para o site funcionar 100% offline, sem depender
   de nenhum serviço externo de fotos. Basta trocá-las pelas suas próprias
   fotos e vídeos pelo painel /admin. */

window.SEED_POSTS = [
  {
    id: "p1",
    slug: "novo-chip-a20-bateria-liquid-glass",
    layout: "standard",
    category: "Apple",
    title: "Apple revela chip A20 com novo núcleo neural e 30% mais eficiência",
    subtitle: "Processador chega junto do iOS 27 e da nova linguagem visual Liquid Glass, prometendo o maior salto de desempenho em três gerações.",
    author: "Marina Alves",
    date: "2026-09-14T09:30:00",
    readTime: 6,
    featured: true,
    cover: { type: "image", src: "assets/images/cover-1.svg", alt: "Chip de silício em close-up", caption: "O A20 é fabricado em processo de 2nm." },
    excerpt: "Processador chega junto do iOS 27 e da nova linguagem visual Liquid Glass, prometendo o maior salto de desempenho em três gerações.",
    tags: ["Apple", "Chip", "iPhone"],
    body: "A Apple anunciou nesta manhã o chip A20, sucessor do A19 Pro, com uma arquitetura de núcleo neural redesenhada e ganhos de até 30% em eficiência energética.\n\n## Desempenho e eficiência\n\nSegundo a empresa, o novo chip usa processo de fabricação de 2 nanômetros, permitindo mais transistores em um espaço menor. Isso resulta em desempenho superior sem aumentar o consumo de bateria — pelo contrário, os testes internos mostram até 6 horas a mais de autonomia em uso intenso.\n\n> \"É o maior salto geracional desde a transição para o silício da Apple\", disse a vice-presidente de engenharia de hardware durante o evento.\n\n![Comparativo de desempenho entre gerações de chips](assets/images/longform-inline.svg)\n\n## Integração com Liquid Glass\n\nO A20 foi desenhado em conjunto com a nova interface Liquid Glass do iOS 27, que utiliza aceleração de hardware para renderizar efeitos de vidro, refração e profundidade em tempo real em toda a interface do sistema.\n\n---\n\nA Apple não confirmou quais dispositivos usarão o chip primeiro, mas rumores apontam para a próxima linha de iPhones no fim do ano."
  },
  {
    id: "p2",
    slug: "ao-vivo-evento-apple-setembro",
    layout: "breaking",
    category: "Eventos",
    title: "AO VIVO: Apple anuncia nova linha de dispositivos e sistema Liquid Glass",
    subtitle: "Acompanhe em tempo real os principais anúncios do keynote desta manhã.",
    author: "Redação Órbita",
    date: "2026-09-14T13:00:00",
    readTime: 3,
    breaking: true,
    cover: { type: "image", src: "assets/images/cover-2.svg", alt: "Palco de evento de tecnologia" },
    excerpt: "Acompanhe em tempo real os principais anúncios do keynote desta manhã.",
    tags: ["Apple", "Evento", "Ao vivo"],
    liveUpdates: [
      { time: "13:42", title: "Encerramento do evento", text: "A Apple encerra o keynote reforçando a chegada do iOS 27 em outubro para todos os modelos compatíveis." },
      { time: "13:15", title: "Novo design Liquid Glass", text: "A empresa detalha a nova linguagem visual do sistema operacional, com camadas translúcidas e reflexos dinâmicos de luz." },
      { time: "12:58", title: "Chip A20 é anunciado", text: "Processador promete 30% mais eficiência energética e novo núcleo neural dedicado a IA generativa." },
      { time: "12:30", title: "Keynote começa", text: "Executivos sobem ao palco no Apple Park para o evento mais aguardado do ano." }
    ]
  },
  {
    id: "p3",
    slug: "video-primeiras-impressoes-ios27",
    layout: "video",
    category: "Análises",
    title: "Vídeo: testamos o iOS 27 e o novo visual Liquid Glass por uma semana",
    subtitle: "Nosso review em vídeo mostra os detalhes da nova interface translúcida em uso real.",
    author: "Rafael Nunes",
    date: "2026-09-12T16:00:00",
    readTime: 4,
    cover: { type: "image", src: "assets/images/video-poster.svg", alt: "Prévia do vídeo de review" },
    excerpt: "Nosso review em vídeo mostra os detalhes da nova interface translúcida em uso real.",
    tags: ["iOS", "Vídeo", "Review"],
    video: { src: "", poster: "assets/images/video-poster.svg" },
    body: "Passamos sete dias usando a beta pública do iOS 27 no dia a dia. No vídeo acima mostramos como os elementos de vidro líquido reagem à luz e ao movimento, além do impacto real na bateria.\n\n## O que achamos\n\nA transição de app para app ficou visivelmente mais fluida, com os painéis de vidro reagindo ao conteúdo abaixo deles em tempo real."
  },
  {
    id: "p4",
    slug: "galeria-bastidores-apple-park",
    layout: "gallery",
    category: "Eventos",
    title: "Galeria: os bastidores do evento no Apple Park",
    subtitle: "Fotos exclusivas de dentro do Steve Jobs Theater durante os preparativos do keynote.",
    author: "Bianca Ferraz",
    date: "2026-09-13T11:20:00",
    readTime: 3,
    cover: { type: "image", src: "assets/images/cover-4.svg", alt: "Auditório de evento" },
    excerpt: "Fotos exclusivas de dentro do Steve Jobs Theater durante os preparativos do keynote.",
    tags: ["Apple Park", "Fotos", "Bastidores"],
    gallery: [
      { src: "assets/images/gallery-1.svg", caption: "O palco poucas horas antes do início." },
      { src: "assets/images/gallery-2.svg", caption: "Área de imprensa credenciada." },
      { src: "assets/images/gallery-3.svg", caption: "Detalhe da iluminação do teatro." },
      { src: "assets/images/gallery-4.svg", caption: "Equipe técnica ajustando os telões." },
      { src: "assets/images/gallery-5.svg", caption: "Vista externa do campus Apple Park." },
      { src: "assets/images/gallery-6.svg", caption: "Detalhe de um dos novos dispositivos exibidos." }
    ]
  },
  {
    id: "p5",
    slug: "10-recursos-liquid-glass-que-voce-precisa-conhecer",
    layout: "list",
    category: "Guias",
    title: "10 recursos do Liquid Glass que vão mudar como você usa seu iPhone",
    subtitle: "Da tela de bloqueio aos widgets, veja o que muda com a nova linguagem visual da Apple.",
    author: "Diego Martins",
    date: "2026-09-11T08:00:00",
    readTime: 8,
    cover: { type: "image", src: "assets/images/cover-5.svg", alt: "Interface translúcida em smartphone" },
    excerpt: "Da tela de bloqueio aos widgets, veja o que muda com a nova linguagem visual da Apple.",
    tags: ["iOS", "Liquid Glass", "Lista"],
    listItems: [
      { title: "Painéis de vidro dinâmico", image: "assets/images/list-1.svg", text: "Os menus agora refratam a luz e as cores do conteúdo ao fundo em tempo real, criando profundidade." },
      { title: "Nova Central de Controle", image: "assets/images/list-2.svg", text: "Os botões flutuam sobre um vidro fosco que se adapta ao papel de parede." },
      { title: "Widgets com profundidade", image: "assets/images/list-3.svg", text: "Camadas de widgets ganham sombra e paralaxe ao inclinar o aparelho." },
      { title: "Tela de bloqueio reativa", image: "assets/images/list-4.svg", text: "O relógio e notificações reagem ao toque com ondulações de vidro líquido." },
      { title: "Modo de foco translúcido", image: "assets/images/list-5.svg", text: "Ícones de apps bloqueados ficam com efeito fosco, indicando indisponibilidade." },
      { title: "Câmera com HUD de vidro", image: "assets/images/list-6.svg", text: "Os controles da câmera flutuam sobre a cena sem cobrir o enquadramento." },
      { title: "Novo teclado com profundidade", image: "assets/images/list-7.svg", text: "Teclas ganham leve elevação e reflexo ao serem pressionadas." },
      { title: "Multitarefa em camadas", image: "assets/images/list-8.svg", text: "Apps recentes aparecem como painéis de vidro empilhados com profundidade real." },
      { title: "Modo Noturno com âmbar dinâmico", image: "assets/images/list-9.svg", text: "O tom do vidro muda de frio para âmbar conforme o horário do dia." },
      { title: "Acessibilidade sob medida", image: "assets/images/list-10.svg", text: "É possível reduzir a transparência mantendo a nova estética em blocos sólidos." }
    ]
  },
  {
    id: "p6",
    slug: "review-iphone-17-pro-max",
    layout: "review",
    category: "Análises",
    title: "Review: iPhone 17 Pro Max é o mais completo, mas ainda caro",
    subtitle: "Câmera, bateria e desempenho impressionam — o preço, nem tanto.",
    author: "Camila Rocha",
    date: "2026-09-09T14:10:00",
    readTime: 9,
    cover: { type: "image", src: "assets/images/cover-6.svg", alt: "iPhone sobre mesa de madeira" },
    excerpt: "Câmera, bateria e desempenho impressionam — o preço, nem tanto.",
    tags: ["iPhone", "Review", "Apple"],
    review: {
      score: 92,
      verdict: "Excelente",
      pros: ["Câmera principal impressionante em pouca luz", "Bateria dura o dia inteiro com folga", "Tela mais brilhante da linha"],
      cons: ["Preço elevado em relação ao modelo anterior", "Carregador ainda não acompanha a caixa"],
      specs: { "Tela": "6.9\" OLED ProMotion 120Hz", "Chip": "Apple A20 Pro", "Câmera": "48MP + 48MP + 12MP", "Bateria": "Até 33h de vídeo", "Preço": "A partir de R$ 11.999" }
    },
    body: "Depois de duas semanas de uso intenso, o iPhone 17 Pro Max se confirma como o smartphone mais completo da Apple até hoje — mas também o mais caro.\n\n## Design e tela\n\nO acabamento em titânio permanece, agora com um acabamento fosco que resiste melhor a impressões digitais. A tela chega a 3.000 nits de brilho de pico, visível até sob sol forte.\n\n## Câmeras\n\nO novo sensor principal de 48MP entrega fotos noturnas nitidamente superiores às do modelo anterior, com menos ruído e cores mais naturais.\n\n## Bateria e desempenho\n\nCom o chip A20 Pro, o aparelho não esquenta mesmo em jogos pesados, e a autonomia passou dos rivais Android testados no mesmo período."
  },
  {
    id: "p7",
    slug: "entrevista-diretor-design-apple",
    layout: "interview",
    category: "Entrevistas",
    title: "\"Queríamos que a interface parecesse viva\", diz diretor de design da Apple",
    subtitle: "Em entrevista exclusiva, executivo fala sobre o processo criativo por trás do Liquid Glass.",
    author: "Pedro Salles",
    date: "2026-09-08T10:00:00",
    readTime: 7,
    cover: { type: "image", src: "assets/images/cover-7.svg", alt: "Executivo em entrevista" },
    excerpt: "Em entrevista exclusiva, executivo fala sobre o processo criativo por trás do Liquid Glass.",
    tags: ["Entrevista", "Design", "Apple"],
    qa: [
      { q: "Como surgiu a ideia do Liquid Glass?", a: "Vem de anos estudando como a luz se comporta em materiais reais. Queríamos trazer isso para a tela de um jeito que parecesse tangível, não apenas decorativo." },
      { q: "Qual foi o maior desafio técnico?", a: "Manter 120 quadros por segundo com todos os efeitos de refração ativos, sem sacrificar a bateria. Isso exigiu trabalho conjunto com o time de silício." },
      { q: "O visual muda entre os apps?", a: "Sim. Cada app pode tingir levemente o vidro com sua cor de marca, mantendo consistência com o sistema." },
      { q: "O que vem depois do Liquid Glass?", a: "Não posso adiantar detalhes, mas posso dizer que essa é uma fundação, não um destino final." }
    ]
  },
  {
    id: "p8",
    slug: "historia-por-tras-do-liquid-glass",
    layout: "longform",
    category: "Reportagem",
    title: "A jornada de cinco anos para reinventar a interface da Apple",
    subtitle: "Uma reportagem especial sobre como equipes de design, engenharia e hardware trabalharam juntas para criar o Liquid Glass.",
    author: "Marina Alves",
    date: "2026-09-05T07:00:00",
    readTime: 12,
    cover: { type: "image", src: "assets/images/cover-8.svg", alt: "Escritório de design moderno" },
    excerpt: "Uma reportagem especial sobre como equipes de design, engenharia e hardware trabalharam juntas para criar o Liquid Glass.",
    tags: ["Reportagem", "Design", "Apple"],
    chapters: [
      { title: "O início", text: "Tudo começou em 2021, num laboratório interno dedicado a materiais e luz, muito antes de qualquer código de interface ser escrito.\n\nDesigners e engenheiros de óptica passaram meses estudando como diferentes vidros refratam luz em condições reais, catalogando referências para alimentar os primeiros protótipos digitais." },
      { title: "Os protótipos", text: "As primeiras versões rodavam apenas em Macs potentes, incapazes de manter mais que 20 quadros por segundo.\n\n![Protótipo inicial em tela grande](assets/images/longform-inline.svg)\n\nFoi preciso reescrever partes do compositor gráfico do sistema para viabilizar o efeito em tempo real em um iPhone." },
      { title: "A integração com o silício", text: "Somente com o desenvolvimento do núcleo gráfico do chip A20 os efeitos puderam rodar de forma eficiente, sem comprometer a bateria.\n\n> \"Foi a primeira vez que hardware e software foram desenhados literalmente na mesma sala, ao mesmo tempo\", relembra um engenheiro que participou do projeto." },
      { title: "O lançamento", text: "Após cinco anos, o resultado chegou a bilhões de dispositivos de uma só vez, com o iOS 27, redefinindo a identidade visual da Apple para a próxima década." }
    ]
  },
  {
    id: "p9",
    slug: "breve-atualizacao-macos-liquid-glass",
    layout: "brief",
    category: "Notas Rápidas",
    title: "macOS também ganhará visual Liquid Glass ainda este ano",
    subtitle: "Atualização é esperada para a próxima versão do sistema, em outubro.",
    author: "Redação Órbita",
    date: "2026-09-14T18:45:00",
    readTime: 2,
    cover: { type: "image", src: "assets/images/cover-9.svg", alt: "MacBook sobre mesa" },
    excerpt: "Atualização é esperada para a próxima versão do sistema, em outubro.",
    tags: ["macOS", "Nota Rápida"],
    body: "A Apple confirmou que o macOS também receberá a nova linguagem visual Liquid Glass, unificando a experiência entre iPhone, iPad e Mac. A atualização deve chegar em outubro, junto com o lançamento oficial do iOS 27."
  },
  {
    id: "p10",
    slug: "nota-rapida-novo-macbook-pro",
    layout: "brief",
    category: "Notas Rápidas",
    title: "Rumor: novo MacBook Pro com tela OLED pode chegar em 2027",
    subtitle: "Segundo analistas, painel OLED substituiria o mini-LED atual.",
    author: "Diego Martins",
    date: "2026-09-10T12:00:00",
    readTime: 2,
    cover: { type: "image", src: "assets/images/cover-10.svg", alt: "MacBook aberto" },
    excerpt: "Segundo analistas, painel OLED substituiria o mini-LED atual.",
    tags: ["MacBook", "Rumor"],
    body: "Analistas da cadeia de fornecimento asiática apontam que a Apple estaria testando painéis OLED para os próximos MacBooks Pro, com produção em massa prevista para 2027. A mudança prometeria cores mais vivas e pretos mais profundos em relação à tecnologia mini-LED usada atualmente."
  }
];
