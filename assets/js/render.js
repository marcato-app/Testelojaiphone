/* ÓRBITA — helpers de renderização compartilhados entre home, categoria e post. */

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) +
      " às " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch (e) { return iso; }
}
function formatDateShort(iso) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  } catch (e) { return iso; }
}
function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return Math.max(1, Math.round(diff / 60)) + " min atrás";
  if (diff < 86400) return Math.round(diff / 3600) + "h atrás";
  return Math.round(diff / 86400) + "d atrás";
}
function initials(name) {
  return (name || "?").split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

/* -------- Mini-markdown para o corpo do texto -------- */
function parseBody(text) {
  if (!text) return "";
  const blocks = String(text).split(/\n\s*\n/);
  return blocks.map(block => {
    const line = block.trim();
    if (!line) return "";
    if (line === "---") return "<hr>";
    if (line.startsWith("### ")) return `<h3>${inline(line.slice(4))}</h3>`;
    if (line.startsWith("## ")) return `<h2>${inline(line.slice(3))}</h2>`;
    if (line.startsWith("> ")) return `<blockquote>${inline(line.replace(/^> ?/, ""))}</blockquote>`;
    const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) return `<figure><img src="${escapeHtml(imgMatch[2])}" alt="${escapeHtml(imgMatch[1])}" loading="lazy">${imgMatch[1] ? `<figcaption>${escapeHtml(imgMatch[1])}</figcaption>` : ""}</figure>`;
    const vidMatch = line.match(/^\[video\]\((.*?)\)$/);
    if (vidMatch) return `<figure><video src="${escapeHtml(vidMatch[1])}" controls playsinline></video></figure>`;
    return `<p>${inline(line)}</p>`;
  }).join("\n");
}
function inline(str) {
  let s = escapeHtml(str);
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  s = s.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s.replace(/\n/g, "<br>");
}

/* -------- Anúncios -------- */
function adSlot(type, label) {
  const sizes = {
    leaderboard: { cls: "ad-leaderboard", size: "970 × 90" },
    rectangle: { cls: "ad-rectangle", size: "300 × 250" },
    infeed: { cls: "ad-infeed", size: "responsivo" },
    mobile: { cls: "ad-mobile", size: "336 × 100" }
  };
  const s = sizes[type] || sizes.infeed;
  return `<div class="ad-slot ${s.cls}" data-ad-slot="${type}">
    <!-- Substitua este bloco pelo código do seu provedor de anúncios (ex: <ins class="adsbygoogle">) -->
    <span class="ad-label">Espaço Publicitário</span>
    <span class="ad-size">${label || s.size}</span>
  </div>`;
}

/* -------- Cards de listagem -------- */
function mediaThumb(post) {
  if (post.cover && post.cover.type === "video") {
    return `<div class="card-media"><video src="${escapeHtml(post.cover.src)}" muted playsinline preload="metadata"></video><div class="card-play"><span>▶</span></div></div>`;
  }
  const src = post.cover ? post.cover.src : "";
  return `<div class="card-media"><img src="${escapeHtml(src)}" alt="${escapeHtml(post.cover ? post.cover.alt : post.title)}" loading="lazy"></div>`;
}

function renderCard(post) {
  return `<a class="card reveal" href="post.html?slug=${encodeURIComponent(post.slug)}">
    ${mediaThumb(post)}
    <div class="card-body">
      <span class="card-cat">${escapeHtml(post.category)}</span>
      <h3 class="card-title">${escapeHtml(post.title)}</h3>
      <p class="card-excerpt">${escapeHtml(post.excerpt || "")}</p>
      <div class="card-meta"><span>${escapeHtml(post.author)}</span><span>·</span><span>${timeAgo(post.date)}</span><span>·</span><span>${post.readTime || 3} min</span></div>
    </div>
  </a>`;
}

function renderCardLarge(post) {
  return `<a class="card card-lg reveal" href="post.html?slug=${encodeURIComponent(post.slug)}">
    ${mediaThumb(post)}
    <div class="card-body">
      <span class="card-cat">${escapeHtml(post.category)}</span>
      <h3 class="card-title">${escapeHtml(post.title)}</h3>
      <p class="card-excerpt">${escapeHtml(post.excerpt || "")}</p>
      <div class="card-meta"><span>${escapeHtml(post.author)}</span><span>·</span><span>${timeAgo(post.date)}</span></div>
    </div>
  </a>`;
}

function renderCardOverlay(post) {
  const isVideo = post.cover && post.cover.type === "video";
  const mediaTag = isVideo
    ? `<video src="${escapeHtml(post.cover.src)}" muted playsinline preload="metadata"></video>`
    : `<img src="${escapeHtml(post.cover ? post.cover.src : "")}" alt="${escapeHtml(post.title)}" loading="lazy">`;
  return `<a class="card-overlay reveal" href="post.html?slug=${encodeURIComponent(post.slug)}">
    ${mediaTag}
    <div class="overlay-scrim"></div>
    <div class="overlay-body">
      <span class="card-cat">${escapeHtml(post.category)}</span>
      <h3 class="card-title">${escapeHtml(post.title)}</h3>
      <div class="card-meta" style="color:rgba(255,255,255,.7)">${timeAgo(post.date)} · ${post.readTime || 3} min</div>
    </div>
  </a>`;
}

function renderCardHorizontal(post) {
  return `<a class="card-h reveal" href="post.html?slug=${encodeURIComponent(post.slug)}">
    ${mediaThumb(post)}
    <div class="card-body">
      <span class="card-cat">${escapeHtml(post.category)}</span>
      <h3 class="card-title" style="font-size:14.5px">${escapeHtml(post.title)}</h3>
      <div class="card-meta">${timeAgo(post.date)}</div>
    </div>
  </a>`;
}

/* -------- Navegação / rodapé -------- */
function renderNav(activeCategory) {
  const cats = ["Apple", "Análises", "Eventos", "Guias", "Entrevistas", "Reportagem"];
  const links = cats.map(c => `<a class="nav-link${c === activeCategory ? " active" : ""}" href="categoria.html?c=${encodeURIComponent(c)}">${c}</a>`).join("");
  document.getElementById("nav-root").innerHTML = `
  <header class="site-header">
    <nav class="glass-nav">
      <div class="nav-inner">
        <a class="brand" href="index.html">
          <span class="brand-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" stroke-width="1.4"/></svg>
          </span>
          Órbita
        </a>
        <div class="nav-links">${links}</div>
        <div class="nav-actions">
          <button class="icon-btn" id="theme-toggle" title="Alternar tema" aria-label="Alternar tema">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
          </button>
          <a class="btn btn-glass btn-sm" href="admin/index.html">Admin</a>
          <button class="icon-btn nav-burger" id="burger-toggle" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>
    </nav>
    <div class="mobile-menu glass" id="mobile-menu" hidden>${links}</div>
  </header>`;
  document.getElementById("theme-toggle").addEventListener("click", () => Theme.toggle());
  const burger = document.getElementById("burger-toggle");
  const menu = document.getElementById("mobile-menu");
  if (burger) burger.addEventListener("click", () => { menu.hidden = !menu.hidden; });
}

function renderFooter() {
  document.getElementById("footer-root").innerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="brand" href="index.html" style="margin-bottom:12px;">
            <span class="brand-mark"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" stroke-width="1.4"/></svg></span>
            Órbita
          </a>
          <p style="font-size:13.5px;color:var(--text-secondary);max-width:280px;margin-top:10px;">Notícias, análises e reportagens sobre o universo da tecnologia — todos os dias.</p>
        </div>
        <div><h4>Editorias</h4>
          <a href="categoria.html?c=Apple">Apple</a><a href="categoria.html?c=Análises">Análises</a><a href="categoria.html?c=Eventos">Eventos</a>
        </div>
        <div><h4>Institucional</h4>
          <a href="admin/index.html">Área do editor</a><a href="index.html">Sobre a Órbita</a><a href="index.html">Contato</a>
        </div>
        <div><h4>Siga</h4>
          <a href="#">X / Twitter</a><a href="#">Instagram</a><a href="#">YouTube</a>
        </div>
      </div>
      ${adSlot("leaderboard")}
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Órbita Tech. Todos os direitos reservados.</span>
        <span>Feito com Liquid Glass 🩵</span>
      </div>
    </div>
  </footer>
  <div class="ad-slot ad-sticky-mobile glass active" id="sticky-ad">
    <span class="ad-label">Publicidade</span>
  </div>`;
}

function setupRevealAnimations() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}
