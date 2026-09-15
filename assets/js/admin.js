/* ÓRBITA — lógica da área administrativa (dashboard + editor). */

// admin/ está uma pasta abaixo da raiz do site — caminhos relativos salvos
// nos posts (ex: "assets/images/x.svg") precisam desse prefixo aqui.
function adminSrc(src) {
  if (!src) return "";
  if (/^(https?:|data:|blob:|\.\.\/)/.test(src)) return src;
  return "../" + src;
}

function toast(msg, type) {
  const el = document.createElement("div");
  el.className = "toast " + (type || "success");
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function requireAuth() {
  if (!Store.isAuthed()) location.href = "index.html";
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// Redimensiona imagens grandes antes de guardar como dataURL, para não
// estourar o limite do localStorage do navegador.
function imageFileToDataURL(file, maxW) {
  maxW = maxW || 1600;
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------------- Dashboard ---------------- */
function renderDashboard() {
  const posts = Store.sortedByDate(Store.getAll());
  document.getElementById("stat-total").textContent = posts.length;
  document.getElementById("stat-cats").textContent = Store.categories().length;
  document.getElementById("stat-breaking").textContent = posts.filter(p => p.breaking).length;
  document.getElementById("stat-media").textContent = posts.filter(p => p.gallery && p.gallery.length || (p.video)).length;

  const tbody = document.getElementById("posts-tbody");
  tbody.innerHTML = posts.map(p => {
    const layoutInfo = LAYOUTS.find(l => l.key === p.layout);
    const thumb = p.cover ? (p.cover.type === "video" ? "" : `<img class="row-thumb" src="${escapeHtml(adminSrc(p.cover.src))}">`) : "";
    return `<tr>
      <td>${thumb}</td>
      <td><strong>${escapeHtml(p.title)}</strong><div style="color:var(--text-tertiary);font-size:12px;">${escapeHtml(p.category)} · ${escapeHtml(p.author)}</div></td>
      <td><span class="layout-badge">${layoutInfo ? layoutInfo.label : p.layout}</span></td>
      <td style="white-space:nowrap;color:var(--text-tertiary);font-size:13px;">${formatDateShort(p.date)}</td>
      <td>
        <div class="row-actions">
          <a class="btn btn-glass btn-sm" href="editor.html?id=${p.id}">Editar</a>
          <a class="btn btn-glass btn-sm" href="../post.html?slug=${encodeURIComponent(p.slug)}" target="_blank">Ver</a>
          <button class="btn btn-danger btn-sm" onclick="deletePost('${p.id}')">Excluir</button>
        </div>
      </td>
    </tr>`;
  }).join("") || `<tr><td colspan="5" style="text-align:center;padding:40px;color:var(--text-tertiary);">Nenhum post ainda. Crie o primeiro!</td></tr>`;
}

function deletePost(id) {
  if (!confirm("Excluir esta matéria? Essa ação não pode ser desfeita.")) return;
  Store.remove(id);
  renderDashboard();
  toast("Matéria excluída.");
}

function exportPosts() {
  const posts = Store.getAll();
  const code = "window.SEED_POSTS = " + JSON.stringify(posts, null, 2) + ";\n";
  const blob = new Blob([code], { type: "text/javascript" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "seed-data.js";
  a.click();
  toast("Arquivo seed-data.js baixado. Substitua assets/js/seed-data.js por ele para publicar de vez.");
}

function importPosts(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      let text = reader.result;
      const match = text.match(/=\s*(\[[\s\S]*\]);?\s*$/);
      const json = match ? match[1] : text;
      const posts = JSON.parse(json);
      if (!Array.isArray(posts)) throw new Error("Formato inválido");
      Store.saveAll(posts);
      renderDashboard();
      toast("Conteúdo importado com sucesso!");
    } catch (e) {
      toast("Não foi possível importar: " + e.message, "error");
    }
  };
  reader.readAsText(file);
}

function resetSeed() {
  if (!confirm("Isso vai restaurar os 10 posts de exemplo e apagar suas edições locais. Continuar?")) return;
  Store.resetToSeed();
  renderDashboard();
  toast("Conteúdo de exemplo restaurado.");
}

/* ---------------- Editor ---------------- */
let editorState = { layout: "standard", cover: null, gallery: [], liveUpdates: [], listItems: [], qa: [], chapters: [], specs: [], video: null };

function initEditor() {
  document.getElementById("layout-picker").innerHTML = LAYOUTS.map(l => `
    <div class="layout-opt" data-layout="${l.key}" onclick="selectLayout('${l.key}')">
      <div class="lo-title">${l.label}</div>
      <div class="lo-desc">${l.desc}</div>
    </div>`).join("");

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (id) {
    const post = Store.getById(id);
    if (post) loadPostIntoForm(post);
  } else {
    selectLayout("standard");
  }
}

function selectLayout(key) {
  editorState.layout = key;
  document.querySelectorAll(".layout-opt").forEach(el => el.classList.toggle("selected", el.dataset.layout === key));
  document.querySelectorAll("[data-layout-panel]").forEach(el => {
    el.hidden = !el.dataset.layoutPanel.split(",").includes(key);
  });
}

function setupCoverUpload() {
  const box = document.getElementById("cover-upload");
  const input = document.getElementById("cover-file");
  const urlInput = document.getElementById("cover-url");
  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video");
    const dataUrl = isVideo ? await fileToDataURL(file) : await imageFileToDataURL(file);
    editorState.cover = { type: isVideo ? "video" : "image", src: dataUrl };
    urlInput.value = "";
    renderCoverPreview();
  });
  urlInput.addEventListener("input", () => {
    if (!urlInput.value) return;
    const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(urlInput.value);
    editorState.cover = { type: isVideo ? "video" : "image", src: urlInput.value };
    renderCoverPreview();
  });
}

function renderCoverPreview() {
  const box = document.getElementById("cover-preview");
  if (!editorState.cover) { box.innerHTML = ""; return; }
  box.innerHTML = editorState.cover.type === "video"
    ? `<video src="${escapeHtml(adminSrc(editorState.cover.src))}" controls></video>`
    : `<img src="${escapeHtml(adminSrc(editorState.cover.src))}">`;
}

/* ---- Repeaters genéricos ---- */
function addGalleryItem(data) {
  const id = "g" + Math.random().toString(36).slice(2, 8);
  editorState.gallery.push(Object.assign({ id, src: "", caption: "" }, data));
  renderGalleryEditor();
}
function renderGalleryEditor() {
  const root = document.getElementById("gallery-editor");
  root.innerHTML = editorState.gallery.map(g => `
    <div class="repeat-item">
      <button type="button" class="icon-btn remove-btn" onclick="removeGalleryItem('${g.id}')">✕</button>
      <div class="upload-box" style="margin-bottom:10px;">
        ${g.src ? `<img src="${escapeHtml(adminSrc(g.src))}">` : `<span class="up-label">Clique para enviar uma foto</span>`}
        <input type="file" accept="image/*" onchange="handleGalleryUpload('${g.id}', this)">
      </div>
      <input type="text" placeholder="Legenda da foto" value="${escapeHtml(g.caption)}" oninput="updateGalleryCaption('${g.id}', this.value)">
    </div>`).join("") || `<p class="help">Nenhuma foto adicionada ainda.</p>`;
}
async function handleGalleryUpload(id, input) {
  const file = input.files[0];
  if (!file) return;
  const dataUrl = await imageFileToDataURL(file, 1400);
  const item = editorState.gallery.find(g => g.id === id);
  item.src = dataUrl;
  renderGalleryEditor();
}
function updateGalleryCaption(id, val) {
  const item = editorState.gallery.find(g => g.id === id);
  if (item) item.caption = val;
}
function removeGalleryItem(id) {
  editorState.gallery = editorState.gallery.filter(g => g.id !== id);
  renderGalleryEditor();
}

function addLiveUpdate(data) {
  const id = "u" + Math.random().toString(36).slice(2, 8);
  editorState.liveUpdates.unshift(Object.assign({ id, time: "", title: "", text: "" }, data));
  renderLiveEditor();
}
function renderLiveEditor() {
  const root = document.getElementById("live-editor");
  root.innerHTML = editorState.liveUpdates.map(u => `
    <div class="repeat-item">
      <button type="button" class="icon-btn remove-btn" onclick="removeLiveUpdate('${u.id}')">✕</button>
      <div class="field-row">
        <div class="field"><label>Horário</label><input type="text" placeholder="14:32" value="${escapeHtml(u.time)}" oninput="updateLive('${u.id}','time',this.value)"></div>
        <div class="field"><label>Título</label><input type="text" value="${escapeHtml(u.title)}" oninput="updateLive('${u.id}','title',this.value)"></div>
      </div>
      <div class="field"><label>Texto</label><textarea oninput="updateLive('${u.id}','text',this.value)">${escapeHtml(u.text)}</textarea></div>
    </div>`).join("") || `<p class="help">Nenhuma atualização ainda.</p>`;
}
function updateLive(id, key, val) { const it = editorState.liveUpdates.find(u => u.id === id); if (it) it[key] = val; }
function removeLiveUpdate(id) { editorState.liveUpdates = editorState.liveUpdates.filter(u => u.id !== id); renderLiveEditor(); }

function addListItem(data) {
  const id = "li" + Math.random().toString(36).slice(2, 8);
  editorState.listItems.push(Object.assign({ id, title: "", image: "", text: "" }, data));
  renderListEditor();
}
function renderListEditor() {
  const root = document.getElementById("list-editor");
  root.innerHTML = editorState.listItems.map((it, i) => `
    <div class="repeat-item">
      <button type="button" class="icon-btn remove-btn" onclick="removeListItem('${it.id}')">✕</button>
      <div class="field"><label>#${i + 1} — Título</label><input type="text" value="${escapeHtml(it.title)}" oninput="updateListItem('${it.id}','title',this.value)"></div>
      <div class="upload-box" style="margin-bottom:10px;">
        ${it.image ? `<img src="${escapeHtml(adminSrc(it.image))}">` : `<span class="up-label">Foto do item</span>`}
        <input type="file" accept="image/*" onchange="handleListImage('${it.id}', this)">
      </div>
      <div class="field"><label>Descrição</label><textarea oninput="updateListItem('${it.id}','text',this.value)">${escapeHtml(it.text)}</textarea></div>
    </div>`).join("") || `<p class="help">Nenhum item ainda.</p>`;
}
async function handleListImage(id, input) {
  const file = input.files[0]; if (!file) return;
  const url = await imageFileToDataURL(file, 1200);
  const it = editorState.listItems.find(x => x.id === id); it.image = url;
  renderListEditor();
}
function updateListItem(id, key, val) { const it = editorState.listItems.find(x => x.id === id); if (it) it[key] = val; }
function removeListItem(id) { editorState.listItems = editorState.listItems.filter(x => x.id !== id); renderListEditor(); }

function addQA(data) {
  const id = "qa" + Math.random().toString(36).slice(2, 8);
  editorState.qa.push(Object.assign({ id, q: "", a: "" }, data));
  renderQAEditor();
}
function renderQAEditor() {
  const root = document.getElementById("qa-editor");
  root.innerHTML = editorState.qa.map(item => `
    <div class="repeat-item">
      <button type="button" class="icon-btn remove-btn" onclick="removeQA('${item.id}')">✕</button>
      <div class="field"><label>Pergunta</label><input type="text" value="${escapeHtml(item.q)}" oninput="updateQA('${item.id}','q',this.value)"></div>
      <div class="field"><label>Resposta</label><textarea oninput="updateQA('${item.id}','a',this.value)">${escapeHtml(item.a)}</textarea></div>
    </div>`).join("") || `<p class="help">Nenhuma pergunta ainda.</p>`;
}
function updateQA(id, key, val) { const it = editorState.qa.find(x => x.id === id); if (it) it[key] = val; }
function removeQA(id) { editorState.qa = editorState.qa.filter(x => x.id !== id); renderQAEditor(); }

function addChapter(data) {
  const id = "ch" + Math.random().toString(36).slice(2, 8);
  editorState.chapters.push(Object.assign({ id, title: "", text: "" }, data));
  renderChaptersEditor();
}
function renderChaptersEditor() {
  const root = document.getElementById("chapters-editor");
  root.innerHTML = editorState.chapters.map((c, i) => `
    <div class="repeat-item">
      <button type="button" class="icon-btn remove-btn" onclick="removeChapter('${c.id}')">✕</button>
      <div class="field"><label>Capítulo ${i + 1} — Título</label><input type="text" value="${escapeHtml(c.title)}" oninput="updateChapter('${c.id}','title',this.value)"></div>
      <div class="field"><label>Texto (use ## para subtítulo, > para citação, ![legenda](url) para foto)</label><textarea style="min-height:140px;" oninput="updateChapter('${c.id}','text',this.value)">${escapeHtml(c.text)}</textarea></div>
    </div>`).join("") || `<p class="help">Nenhum capítulo ainda.</p>`;
}
function updateChapter(id, key, val) { const it = editorState.chapters.find(x => x.id === id); if (it) it[key] = val; }
function removeChapter(id) { editorState.chapters = editorState.chapters.filter(x => x.id !== id); renderChaptersEditor(); }

function addSpec(data) {
  const id = "sp" + Math.random().toString(36).slice(2, 8);
  editorState.specs.push(Object.assign({ id, key: "", value: "" }, data));
  renderSpecsEditor();
}
function renderSpecsEditor() {
  const root = document.getElementById("specs-editor");
  root.innerHTML = editorState.specs.map(s => `
    <div class="field-row" style="margin-bottom:8px;align-items:center;">
      <input type="text" placeholder="Ex: Tela" value="${escapeHtml(s.key)}" oninput="updateSpec('${s.id}','key',this.value)">
      <div style="display:flex;gap:8px;">
        <input type="text" placeholder="Ex: 6.9&quot; OLED" value="${escapeHtml(s.value)}" oninput="updateSpec('${s.id}','value',this.value)">
        <button type="button" class="icon-btn" onclick="removeSpec('${s.id}')">✕</button>
      </div>
    </div>`).join("") || `<p class="help">Nenhuma especificação ainda.</p>`;
}
function updateSpec(id, key, val) { const it = editorState.specs.find(x => x.id === id); if (it) it[key] = val; }
function removeSpec(id) { editorState.specs = editorState.specs.filter(x => x.id !== id); renderSpecsEditor(); }

async function setupVideoUpload() {
  const input = document.getElementById("video-file");
  const urlInput = document.getElementById("video-url");
  const posterInput = document.getElementById("video-poster-url");
  input.addEventListener("change", async () => {
    const file = input.files[0]; if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast("Vídeo grande demais para salvar no navegador. Use um link externo (URL) em vez de enviar o arquivo.", "error");
      return;
    }
    editorState.video = Object.assign({}, editorState.video, { src: await fileToDataURL(file) });
    renderVideoPreview();
  });
  urlInput.addEventListener("input", () => { editorState.video = Object.assign({}, editorState.video, { src: urlInput.value }); renderVideoPreview(); });
  posterInput.addEventListener("input", () => { editorState.video = Object.assign({}, editorState.video, { poster: posterInput.value }); });
}
function renderVideoPreview() {
  const box = document.getElementById("video-preview");
  box.innerHTML = (editorState.video && editorState.video.src) ? `<video src="${escapeHtml(adminSrc(editorState.video.src))}" controls></video>` : "";
}

/* ---- Carregar / salvar post completo ---- */
function loadPostIntoForm(post) {
  document.getElementById("post-id").value = post.id;
  document.getElementById("f-title").value = post.title || "";
  document.getElementById("f-subtitle").value = post.subtitle || "";
  document.getElementById("f-category").value = post.category || "";
  document.getElementById("f-author").value = post.author || "";
  document.getElementById("f-excerpt").value = post.excerpt || "";
  document.getElementById("f-tags").value = (post.tags || []).join(", ");
  document.getElementById("f-readtime").value = post.readTime || 5;
  document.getElementById("f-featured").checked = !!post.featured;
  document.getElementById("f-breaking-flag").checked = !!post.breaking;
  document.getElementById("f-body").value = post.body || "";

  editorState.cover = post.cover || null;
  editorState.gallery = (post.gallery || []).map(g => Object.assign({ id: "g" + Math.random().toString(36).slice(2, 8) }, g));
  editorState.liveUpdates = (post.liveUpdates || []).map(u => Object.assign({ id: "u" + Math.random().toString(36).slice(2, 8) }, u));
  editorState.listItems = (post.listItems || []).map(u => Object.assign({ id: "li" + Math.random().toString(36).slice(2, 8) }, u));
  editorState.qa = (post.qa || []).map(u => Object.assign({ id: "qa" + Math.random().toString(36).slice(2, 8) }, u));
  editorState.chapters = (post.chapters || []).map(u => Object.assign({ id: "ch" + Math.random().toString(36).slice(2, 8) }, u));
  editorState.specs = Object.entries((post.review && post.review.specs) || {}).map(([k, v]) => ({ id: "sp" + Math.random().toString(36).slice(2, 8), key: k, value: v }));
  editorState.video = post.video || null;

  if (post.review) {
    document.getElementById("f-score").value = post.review.score || "";
    document.getElementById("f-verdict").value = post.review.verdict || "";
    document.getElementById("f-pros").value = (post.review.pros || []).join("\n");
    document.getElementById("f-cons").value = (post.review.cons || []).join("\n");
  }

  renderCoverPreview();
  renderGalleryEditor();
  renderLiveEditor();
  renderListEditor();
  renderQAEditor();
  renderChaptersEditor();
  renderSpecsEditor();
  renderVideoPreview();
  selectLayout(post.layout || "standard");
}

function slugify(str) {
  return String(str).toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function savePost(event) {
  event.preventDefault();
  const id = document.getElementById("post-id").value || Store.newId();
  const title = document.getElementById("f-title").value.trim();
  if (!title) { toast("Dê um título para a matéria.", "error"); return; }

  const existing = Store.getById(id);
  const post = {
    id,
    slug: existing ? existing.slug : slugify(title) + "-" + id.slice(-4),
    layout: editorState.layout,
    category: document.getElementById("f-category").value.trim() || "Geral",
    title,
    subtitle: document.getElementById("f-subtitle").value.trim(),
    author: document.getElementById("f-author").value.trim() || "Redação Órbita",
    date: existing ? existing.date : new Date().toISOString(),
    readTime: parseInt(document.getElementById("f-readtime").value, 10) || 5,
    featured: document.getElementById("f-featured").checked,
    breaking: document.getElementById("f-breaking-flag").checked,
    cover: editorState.cover,
    excerpt: document.getElementById("f-excerpt").value.trim(),
    tags: document.getElementById("f-tags").value.split(",").map(s => s.trim()).filter(Boolean),
    body: document.getElementById("f-body").value
  };

  if (editorState.layout === "breaking" || editorState.layout === "live") {
    post.liveUpdates = editorState.liveUpdates.map(({ id, ...rest }) => rest);
  }
  if (editorState.layout === "video") {
    post.video = editorState.video;
  }
  if (editorState.layout === "gallery") {
    post.gallery = editorState.gallery.map(({ id, ...rest }) => rest);
  }
  if (editorState.layout === "list") {
    post.listItems = editorState.listItems.map(({ id, ...rest }) => rest);
  }
  if (editorState.layout === "review") {
    const specs = {};
    editorState.specs.forEach(s => { if (s.key) specs[s.key] = s.value; });
    post.review = {
      score: parseInt(document.getElementById("f-score").value, 10) || 0,
      verdict: document.getElementById("f-verdict").value.trim(),
      pros: document.getElementById("f-pros").value.split("\n").map(s => s.trim()).filter(Boolean),
      cons: document.getElementById("f-cons").value.split("\n").map(s => s.trim()).filter(Boolean),
      specs
    };
  }
  if (editorState.layout === "interview") {
    post.qa = editorState.qa.map(({ id, ...rest }) => rest);
  }
  if (editorState.layout === "longform") {
    post.chapters = editorState.chapters.map(({ id, ...rest }) => rest);
  }

  try {
    Store.upsert(post);
    toast("Matéria salva com sucesso!");
    setTimeout(() => location.href = "index.html", 700);
  } catch (e) {
    toast("Erro ao salvar (talvez mídia grande demais para o armazenamento local): " + e.message, "error");
  }
}
