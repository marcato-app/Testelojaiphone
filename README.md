# Órbita Tech

Site de notícias de tecnologia com identidade visual inspirada na Apple
("Liquid Glass"), painel administrativo próprio e 10 layouts de matéria
diferentes. Site 100% estático (HTML/CSS/JS puro) — não precisa de build,
servidor ou banco de dados para funcionar.

**No ar em:** https://marcato-app.github.io/Testelojaiphone/
(publicação automática pelo GitHub Pages a cada push na `main`).

## Recursos

- Busca no site (ícone de lupa na barra superior, ou tecla `/`)
- Tema claro/escuro automático, com alternância manual
- Barra de progresso de leitura nas matérias
- Vídeos por upload, link direto `.mp4`, YouTube ou Vimeo
- Espaços de anúncio prontos em toda a navegação
- Painel `/admin` com busca, filtro por editoria, duplicação e exportação

## Estrutura

```
index.html          → Home
post.html           → Página de matéria (todos os 10 layouts)
categoria.html      → Listagem por editoria
admin/index.html    → Login + dashboard do editor
admin/editor.html   → Criar/editar matéria
assets/css/         → Design system (main.css) + estilos do admin (admin.css)
assets/js/
  seed-data.js      → 10 matérias de exemplo (uma para cada layout)
  store.js          → Camada de dados (localStorage)
  render.js         → Componentes visuais compartilhados (cards, nav, anúncios...)
  post.js           → Os 10 renderizadores de layout de matéria
  home.js           → Lógica da homepage
  admin.js          → Lógica do painel administrativo
assets/images/      → Artes de capa geradas localmente (SVG), sem depender de serviços externos
```

## Como usar o painel administrativo

1. Abra `/admin` e entre com a senha `orbita2027` (trocável em `assets/js/store.js`, função `Store.login`).
2. Clique em **Nova matéria**, escolha um dos 10 layouts e preencha os campos.
3. Envie fotos e vídeos diretamente do seu computador (ou cole uma URL). Imagens grandes são redimensionadas automaticamente antes de salvar.
4. Clique em **Salvar matéria**.

### Como o conteúdo é salvo

Este é um site estático: não existe um servidor validando login nem um banco
de dados compartilhado. Tudo que você cria no `/admin` fica salvo no
`localStorage` **do navegador em que você está editando**. Isso significa:

- Você pode criar, editar e testar matérias livremente.
- Outras pessoas que visitarem o site (ou você em outro navegador/dispositivo)
  **não verão automaticamente** o que foi criado — elas continuam vendo o
  conteúdo de exemplo (`seed-data.js`) até você publicar de verdade.

### Publicando de verdade (para todo mundo ver)

No dashboard do admin, use o botão **Exportar conteúdo** — ele baixa um
arquivo `seed-data.js` com tudo que você criou. Substitua o arquivo
`assets/js/seed-data.js` do projeto por ele, faça commit/push (ou upload no
seu hospedeiro), e pronto: agora todo visitante do site vê o conteúdo
atualizado. O botão **Importar conteúdo** faz o caminho inverso (útil para
recuperar um backup ou migrar de outro navegador).

Se quiser conteúdo dinâmico "de verdade" (múltiplos editores publicando ao
vivo, sem exportar/importar arquivo), este site precisaria de um backend
com banco de dados — hoje ele foi feito propositalmente sem essa dependência
para poder rodar em qualquer hospedagem estática (GitHub Pages, Netlify,
Vercel, um servidor simples etc.).

## Os 10 layouts de matéria

1. **Artigo Padrão** — texto + imagem de capa (o clássico).
2. **Última Hora / Breaking** — faixa vermelha + linha do tempo de atualizações.
3. **Destaque em Vídeo** — player de vídeo no topo.
4. **Galeria de Fotos** — grade de fotos com zoom em tela cheia (lightbox).
5. **Cobertura Ao Vivo** — mesmo formato de linha do tempo do Breaking.
6. **Lista / Ranking** — formato "Top 10", item numerado com imagem.
7. **Review de Produto** — nota circular, prós/contras, ficha técnica.
8. **Entrevista (P&R)** — blocos alternados de pergunta e resposta.
9. **Grande Reportagem** — capa cinematográfica + capítulos com âncoras.
10. **Nota Rápida** — cartão curto, sem corpo extenso.

Todos suportam fotos e vídeos no corpo do texto usando uma sintaxe simples:
`## Subtítulo`, `> Citação`, `![legenda](url-da-foto)`, `[video](url-do-video)`,
`**negrito**`, `*itálico*`.

## Espaços de anúncio

Já existem espaços reservados (visualmente identificados como
"Espaço Publicitário") em: topo/rodapé (leaderboard 970×90), barra lateral
(retângulo 300×250, dois na home), meio do feed (in-feed a cada 6 matérias e
dentro de cada matéria) e uma barra fixa no rodapé no celular. Para ativar
anúncios reais (Google AdSense ou outro), procure por `.ad-slot` em
`assets/js/render.js` (função `adSlot`) e troque o conteúdo pelo código do
seu provedor.

## Rodando localmente

Como é um site 100% estático, basta um servidor HTTP simples na raiz do projeto:

```bash
python3 -m http.server 8000
```

E acessar `http://localhost:8000`.
