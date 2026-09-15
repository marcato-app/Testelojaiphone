/* ÓRBITA — renderiza a página de artigo (post.html) de acordo com o
   layout escolhido no admin. Cada função LAYOUT_RENDERERS[key] retorna o
   HTML do miolo do artigo (cabeçalho + conteúdo específico do layout). */

function articleHeader(post, opts) {
  opts = opts || {};
  return `
  <div class="article-head container-narrow">
    <span class="kicker ${post.breaking ? "breaking" : ""}">${post.breaking ? "🔴 " : ""}${escapeHtml(post.category)}</span>
    <h1>${escapeHtml(post.title)}</h1>
    ${post.subtitle ? `<p class="dek">${escapeHtml(post.subtitle)}</p>` : ""}
    <div class="byline">
      <div class="avatar">${initials(post.author)}</div>
      <div>
        <div class="who">${escapeHtml(post.author)}</div>
        <div class="when">${formatDate(post.date)} · ${post.readTime || 3} min de leitura</div>
      </div>
      <div class="share-row">
        <button class="icon-btn" title="Compartilhar" onclick="navigator.share ? navigator.share({title: document.title, url: location.href}) : navigator.clipboard.writeText(location.href)">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  </div>`;
}

function articleCover(post) {
  if (!post.cover) return "";
  const media = post.cover.type === "video"
    ? `<video src="${escapeHtml(post.cover.src)}" ${post.cover.poster ? `poster="${escapeHtml(post.cover.poster)}"` : ""} controls playsinline></video>`
    : `<img src="${escapeHtml(post.cover.src)}" alt="${escapeHtml(post.cover.alt || post.title)}" loading="lazy">`;
  return `<figure class="article-cover container-narrow">${media}${post.cover.caption ? `<figcaption>${escapeHtml(post.cover.caption)}</figcaption>` : ""}</figure>`;
}

function relatedSection(post) {
  const related = Store.sortedByDate(Store.getAll().filter(p => p.id !== post.id && p.category === post.category)).slice(0, 3);
  const pool = related.length ? related : Store.sortedByDate(Store.getAll().filter(p => p.id !== post.id)).slice(0, 3);
  return `
  <div class="container-narrow">
    ${adSlot("infeed")}
    <div class="section-head" style="margin-top:12px"><h2 class="section-title">Leia também</h2></div>
    <div class="grid grid-3">${pool.map(renderCard).join("")}</div>
  </div>`;
}

const LAYOUT_RENDERERS = {
  standard(post) {
    return `
    ${articleHeader(post)}
    ${articleCover(post)}
    <div class="container-narrow"><div class="prose dropcap">${parseBody(post.body)}</div></div>
    ${relatedSection(post)}`;
  },

  breaking(post) {
    const label = post.liveLabel || (post.layout === "live" ? "AO VIVO" : "ÚLTIMA HORA");
    return `
    <div class="container-narrow">
      <div class="breaking-banner">
        <span class="kicker">🔴 ${escapeHtml(label)}</span>
        <h1>${escapeHtml(post.title)}</h1>
        ${post.subtitle ? `<p style="opacity:.9">${escapeHtml(post.subtitle)}</p>` : ""}
      </div>
      <div class="byline">
        <div class="avatar">${initials(post.author)}</div>
        <div><div class="who">${escapeHtml(post.author)}</div><div class="when">Atualizado ${timeAgo(post.date)}</div></div>
      </div>
    </div>
    ${articleCover(post)}
    <div class="container-narrow">
      ${post.body ? `<div class="prose">${parseBody(post.body)}</div>` : ""}
      <h2 class="section-title" style="margin:32px 0 4px;">Linha do tempo</h2>
      <div class="breaking-updates">
        ${(post.liveUpdates || []).map(u => `
          <div class="update-item">
            <div class="time-col"><div class="time">${escapeHtml(u.time)}</div><div class="dot-line"></div></div>
            <div><div class="u-title">${escapeHtml(u.title)}</div><div class="u-text">${escapeHtml(u.text)}</div></div>
          </div>`).join("")}
      </div>
    </div>
    ${relatedSection(post)}`;
  },

  video(post) {
    const v = post.video || post.cover || {};
    const others = Store.sortedByDate(Store.getAll().filter(p => p.id !== post.id && p.layout === "video")).slice(0, 4);
    const embed = embedUrl(v.src);
    const hasVideo = !!v.src;
    return `
    ${articleHeader(post)}
    <div class="container-narrow">
      <div class="video-player">
        ${embed
          ? `<div class="video-embed"><iframe src="${escapeHtml(embed)}" title="${escapeHtml(post.title)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
          : hasVideo
          ? `<video src="${escapeHtml(v.src)}" ${v.poster ? `poster="${escapeHtml(v.poster)}"` : ""} controls playsinline></video>`
          : `<div style="position:relative;aspect-ratio:16/9;">
               <img src="${escapeHtml(v.poster || "")}" alt="" style="width:100%;height:100%;object-fit:cover;">
               <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:rgba(0,0,0,.35);">
                 <span style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.18);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;">▶</span>
                 <span style="color:#fff;font-size:13px;background:rgba(0,0,0,.4);padding:6px 14px;border-radius:999px;">Prévia — envie um vídeo pelo admin para reproduzir aqui</span>
               </div>
             </div>`}
      </div>
      <div class="prose" style="margin-top:26px;">${parseBody(post.body)}</div>
      <h2 class="section-title">Mais vídeos</h2>
      <div class="video-related">${others.map(renderCardHorizontal).join("") || "<p style='color:var(--text-tertiary)'>Novos vídeos em breve.</p>"}</div>
    </div>
    ${relatedSection(post)}`;
  },

  gallery(post) {
    const imgs = post.gallery || [];
    return `
    ${articleHeader(post)}
    <div class="container">
      <div class="gallery-strip">
        ${imgs.map((g, i) => `
          <div class="gallery-item" onclick="openLightbox(${i})">
            <img src="${escapeHtml(g.src)}" alt="${escapeHtml(g.caption || "")}" loading="lazy">
            ${g.caption ? `<div class="g-cap">${escapeHtml(g.caption)}</div>` : ""}
          </div>`).join("")}
      </div>
    </div>
    <div class="container-narrow">
      ${post.body ? `<div class="prose" style="margin-top:30px">${parseBody(post.body)}</div>` : ""}
    </div>
    <div id="lightbox-root"></div>
    ${relatedSection(post)}`;
  },

  live(post) {
    return LAYOUT_RENDERERS.breaking(post);
  },

  list(post) {
    const items = post.listItems || [];
    return `
    ${articleHeader(post)}
    ${articleCover(post)}
    <div class="container-narrow">
      ${post.body ? `<div class="prose">${parseBody(post.body)}</div>` : ""}
      ${items.map((it, i) => `
        <div class="list-item">
          <div class="rank">${i + 1}</div>
          ${it.image ? `<div class="li-media"><img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.title)}" loading="lazy"></div>` : ""}
          <div><div class="li-title">${escapeHtml(it.title)}</div><div class="li-text">${escapeHtml(it.text || "")}</div></div>
        </div>`).join("")}
    </div>
    ${relatedSection(post)}`;
  },

  review(post) {
    const r = post.review || {};
    return `
    ${articleHeader(post)}
    ${articleCover(post)}
    <div class="container-narrow">
      <div class="review-score">
        <div class="score-ring" style="--pct:${r.score || 0}"><span>${r.score || "–"}</span></div>
        <div class="review-verdict"><strong>${escapeHtml(r.verdict || "")}</strong>Nota da redação com base em testes de uso real por pelo menos uma semana.</div>
      </div>
      <div class="prose">${parseBody(post.body)}</div>
      <div class="pros-cons">
        <div class="pc-box pros"><h4>Prós</h4><ul>${(r.pros || []).map(p => `<li>✅ ${escapeHtml(p)}</li>`).join("")}</ul></div>
        <div class="pc-box cons"><h4>Contras</h4><ul>${(r.cons || []).map(p => `<li>⚠️ ${escapeHtml(p)}</li>`).join("")}</ul></div>
      </div>
      <table class="specs-table">${Object.entries(r.specs || {}).map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`).join("")}</table>
    </div>
    ${relatedSection(post)}`;
  },

  interview(post) {
    const qa = post.qa || [];
    return `
    ${articleHeader(post)}
    ${articleCover(post)}
    <div class="container-narrow">
      ${post.body ? `<div class="prose">${parseBody(post.body)}</div>` : ""}
      ${qa.map(item => `
        <div class="qa-block">
          <div class="qa-q"><span class="qmark">P</span>${escapeHtml(item.q)}</div>
          <div class="qa-a">${escapeHtml(item.a)}</div>
        </div>`).join("")}
    </div>
    ${relatedSection(post)}`;
  },

  longform(post) {
    const chapters = post.chapters || [];
    return `
    <div class="hero longform-hero">
      <div class="hero-media">${post.cover ? `<img src="${escapeHtml(post.cover.src)}" alt="">` : ""}</div>
      <div class="hero-scrim"></div>
      <div class="hero-content container-narrow" style="padding-left:0;padding-right:0;">
        <span class="kicker">${escapeHtml(post.category)}</span>
        <h1>${escapeHtml(post.title)}</h1>
        ${post.subtitle ? `<p class="dek">${escapeHtml(post.subtitle)}</p>` : ""}
        <div class="hero-meta"><span>${escapeHtml(post.author)}</span><span>·</span><span>${formatDate(post.date)}</span><span>·</span><span>${post.readTime || 10} min</span></div>
      </div>
    </div>
    <div class="container-narrow">
      <div class="chapter-nav">${chapters.map((c, i) => `<a href="#cap-${i}">${i + 1}. ${escapeHtml(c.title)}</a>`).join("")}</div>
      ${chapters.map((c, i) => `
        <h2 id="cap-${i}" style="font-size:28px;font-weight:800;margin:44px 0 14px;">${escapeHtml(c.title)}</h2>
        <div class="prose ${i === 0 ? "dropcap" : ""}">${parseBody(c.text)}</div>`).join("")}
    </div>
    ${relatedSection(post)}`;
  },

  brief(post) {
    return `
    <div class="container-narrow">
      <div class="brief-card">
        <span class="kicker">${escapeHtml(post.category)}</span>
        <h1 style="font-size:26px;font-weight:800;">${escapeHtml(post.title)}</h1>
        ${post.cover ? `<img src="${escapeHtml(post.cover.src)}" style="border-radius:16px;" alt="">` : ""}
        <div class="prose" style="font-size:16px;">${parseBody(post.body)}</div>
        <div class="brief-meta"><span>${escapeHtml(post.author)}</span><span class="dot"></span><span>${formatDate(post.date)}</span></div>
      </div>
    </div>
    ${relatedSection(post)}`;
  }
};

function openLightbox(startIdx) {
  const imgs = window.__GALLERY__ || [];
  let idx = startIdx;
  const root = document.getElementById("lightbox-root");
  function draw() {
    const g = imgs[idx];
    root.innerHTML = `
    <div class="lightbox">
      <button class="icon-btn lb-close" onclick="document.getElementById('lightbox-root').innerHTML=''"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg></button>
      <img src="${escapeHtml(g.src)}" alt="">
      ${g.caption ? `<div class="lb-cap">${escapeHtml(g.caption)}</div>` : ""}
      <div class="lb-nav">
        <button class="icon-btn" style="color:#fff" onclick="window.__lbPrev()">‹ Anterior</button>
        <span style="color:rgba(255,255,255,.6);font-size:13px;">${idx + 1} / ${imgs.length}</span>
        <button class="icon-btn" style="color:#fff" onclick="window.__lbNext()">Próxima ›</button>
      </div>
    </div>`;
  }
  window.__lbPrev = () => { idx = (idx - 1 + imgs.length) % imgs.length; draw(); };
  window.__lbNext = () => { idx = (idx + 1) % imgs.length; draw(); };
  draw();
}

function renderPostPage() {
  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");
  const post = slug ? Store.getBySlug(slug) : null;
  const root = document.getElementById("article-root");
  if (!post) {
    root.innerHTML = `<div class="container-narrow" style="padding:80px 0;text-align:center;">
      <h1 style="font-size:26px;font-weight:800;margin-bottom:12px;">Matéria não encontrada</h1>
      <p style="color:var(--text-secondary);margin-bottom:24px;">O conteúdo que você procura pode ter sido movido ou removido.</p>
      <a class="btn btn-primary" href="index.html">Voltar para a home</a>
    </div>`;
    return;
  }
  document.title = post.title + " — Órbita Tech";
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", post.excerpt || "");
  const renderer = LAYOUT_RENDERERS[post.layout] || LAYOUT_RENDERERS.standard;
  window.__GALLERY__ = post.gallery || [];
  root.innerHTML = renderer(post);
  setupRevealAnimations();
  setupReadProgress();
}

function setupReadProgress() {
  const bar = document.createElement("div");
  bar.className = "read-progress";
  document.body.appendChild(bar);
  const update = () => {
    const scrollable = document.body.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}
