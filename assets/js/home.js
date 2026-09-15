/* ÓRBITA — lógica da homepage */

function renderHome() {
  const posts = Store.sortedByDate(Store.getAll());
  const featured = posts.find(p => p.featured) || posts[0];
  const breaking = posts.find(p => p.breaking);
  const rest = posts.filter(p => p.id !== featured.id);

  // Faixa de última hora
  const tickerRoot = document.getElementById("ticker-root");
  if (breaking) {
    tickerRoot.innerHTML = `
    <div class="ticker">
      <div class="ticker-inner">
        <span><span class="live-dot"></span> ÚLTIMA HORA — ${escapeHtml(breaking.title)}</span>
        <span><span class="live-dot"></span> ÚLTIMA HORA — ${escapeHtml(breaking.title)}</span>
      </div>
    </div>`;
    tickerRoot.querySelector(".ticker").addEventListener("click", () => location.href = `post.html?slug=${encodeURIComponent(breaking.slug)}`);
    tickerRoot.querySelector(".ticker").style.cursor = "pointer";
  }

  // Hero
  const heroRoot = document.getElementById("hero-root");
  const isVideo = featured.cover && featured.cover.type === "video";
  heroRoot.innerHTML = `
  <a class="hero" href="post.html?slug=${encodeURIComponent(featured.slug)}">
    <div class="hero-media">${isVideo
      ? `<video src="${escapeHtml(featured.cover.src)}" autoplay muted loop playsinline poster="${escapeHtml(featured.cover.poster || "")}"></video>`
      : `<img src="${escapeHtml(featured.cover ? featured.cover.src : "")}" alt="${escapeHtml(featured.title)}">`}</div>
    <div class="hero-scrim"></div>
    <div class="hero-content">
      <span class="kicker">${escapeHtml(featured.category)}</span>
      <h1>${escapeHtml(featured.title)}</h1>
      <p class="dek">${escapeHtml(featured.subtitle || featured.excerpt || "")}</p>
      <div class="hero-meta"><span>${escapeHtml(featured.author)}</span><span>·</span><span>${timeAgo(featured.date)}</span><span>·</span><span>${featured.readTime || 3} min</span></div>
    </div>
  </a>`;

  // Grid principal (3 cards)
  document.getElementById("grid-main").innerHTML = rest.slice(0, 3).map(renderCard).join("");

  // Card overlay em destaque (2 colunas)
  const overlayPosts = rest.slice(3, 5);
  document.getElementById("grid-overlay").innerHTML = overlayPosts.map(renderCardOverlay).join("");

  // Sidebar - mais lidas
  const sidebarList = document.getElementById("sidebar-popular");
  sidebarList.innerHTML = rest.slice(0, 5).map((p, i) => `
    <a class="sidebar-item" href="post.html?slug=${encodeURIComponent(p.slug)}">
      <span class="num">${i + 1}</span>
      <span class="title">${escapeHtml(p.title)}</span>
    </a>`).join("");

  // Sidebar - tags
  const tags = Array.from(new Set(posts.flatMap(p => p.tags || []))).slice(0, 10);
  document.getElementById("sidebar-tags").innerHTML = tags.map(t => `<span class="tag-pill">${escapeHtml(t)}</span>`).join("");

  // Grade final (restante, tipo feed)
  const feed = rest.slice(5);
  const feedRoot = document.getElementById("grid-feed");
  let feedHtml = "";
  feed.forEach((p, i) => {
    feedHtml += renderCard(p);
    if ((i + 1) % 6 === 0 && i !== feed.length - 1) feedHtml += adSlot("infeed");
  });
  feedRoot.innerHTML = feedHtml || `<p style="color:var(--text-tertiary)">Mais matérias em breve.</p>`;

  // categorias em destaque
  const catRoot = document.getElementById("categories-strip");
  const cats = Store.categories();
  catRoot.innerHTML = cats.map(c => `<a class="tag-pill" href="categoria.html?c=${encodeURIComponent(c)}">${escapeHtml(c)}</a>`).join("");

  setupRevealAnimations();
}
