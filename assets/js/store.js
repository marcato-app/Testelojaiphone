/* ÓRBITA — camada de dados.
   Fonte de verdade: localStorage (chave ORBITA_POSTS_KEY).
   Se estiver vazio, usa o conteúdo semente (seed-data.js). */

const ORBITA_POSTS_KEY = "orbita_posts_v1";
const ORBITA_AUTH_KEY = "orbita_admin_auth";
const ORBITA_THEME_KEY = "orbita_theme";
const LAYOUTS = [
  { key: "standard", label: "Artigo Padrão", desc: "Texto + imagem de capa. O clássico de qualquer matéria." },
  { key: "breaking", label: "Última Hora / Breaking", desc: "Faixa vermelha em destaque para notícias urgentes." },
  { key: "video", label: "Destaque em Vídeo", desc: "Player de vídeo no topo, ideal para reviews em vídeo." },
  { key: "gallery", label: "Galeria de Fotos", desc: "Grade de imagens com zoom em tela cheia." },
  { key: "live", label: "Cobertura Ao Vivo", desc: "Linha do tempo de atualizações, tipo liveblog." },
  { key: "list", label: "Lista / Ranking", desc: "Formato \"Top 10\", com item numerado e imagem." },
  { key: "review", label: "Review de Produto", desc: "Nota, prós/contras e tabela de especificações." },
  { key: "interview", label: "Entrevista (Perguntas e Respostas)", desc: "Blocos alternados de pergunta e resposta." },
  { key: "longform", label: "Grande Reportagem", desc: "Capa cinematográfica + capítulos, para textos longos." },
  { key: "brief", label: "Nota Rápida", desc: "Cartão curto e objetivo, sem corpo extenso." }
];

const Store = {
  _readRaw() {
    try {
      const raw = localStorage.getItem(ORBITA_POSTS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  },
  getAll() {
    const saved = this._readRaw();
    if (saved && Array.isArray(saved) && saved.length) return saved;
    return (window.SEED_POSTS || []).slice();
  },
  saveAll(posts) {
    localStorage.setItem(ORBITA_POSTS_KEY, JSON.stringify(posts));
  },
  ensureInitialized() {
    if (!this._readRaw()) this.saveAll(window.SEED_POSTS || []);
  },
  getBySlug(slug) {
    return this.getAll().find(p => p.slug === slug) || null;
  },
  getById(id) {
    return this.getAll().find(p => p.id === id) || null;
  },
  upsert(post) {
    const all = this.getAll();
    const idx = all.findIndex(p => p.id === post.id);
    if (idx >= 0) all[idx] = post; else all.unshift(post);
    this.saveAll(all);
  },
  remove(id) {
    const all = this.getAll().filter(p => p.id !== id);
    this.saveAll(all);
  },
  resetToSeed() {
    this.saveAll(window.SEED_POSTS || []);
  },
  categories() {
    return Array.from(new Set(this.getAll().map(p => p.category))).filter(Boolean);
  },
  sortedByDate(posts) {
    return posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  newId() {
    return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },
  isAuthed() {
    return sessionStorage.getItem(ORBITA_AUTH_KEY) === "1";
  },
  login(pass) {
    // Autenticação simples do lado do cliente para separar a área /admin
    // do site público. Como é um site estático, não há um servidor validando
    // a senha — não use isto para proteger conteúdo sensível de verdade.
    if (pass === "orbita2027" || pass === "admin") {
      sessionStorage.setItem(ORBITA_AUTH_KEY, "1");
      return true;
    }
    return false;
  },
  logout() { sessionStorage.removeItem(ORBITA_AUTH_KEY); }
};

const Theme = {
  init() {
    const saved = localStorage.getItem(ORBITA_THEME_KEY);
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  },
  toggle() {
    const cur = document.documentElement.getAttribute("data-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const curEffective = cur || (prefersDark ? "dark" : "light");
    const next = curEffective === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(ORBITA_THEME_KEY, next);
  }
};

Store.ensureInitialized();
Theme.init();
