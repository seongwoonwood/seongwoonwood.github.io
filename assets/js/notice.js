/*
 * 공지사항: posts/posts.json 목록을 읽어 목록(#post-list)을 그리고,
 * post.html?id=파일명 이면 posts/파일명.md 를 읽어 본문(#post)을 그립니다.
 */
(function () {
  const PENDING_LIST = '<li><a><span class="post-title muted">등록된 공지가 없습니다.</span></a></li>';

  async function loadIndex() {
    const res = await fetch("posts/posts.json", { cache: "no-cache" });
    const posts = await res.json();
    // 고정글 먼저, 그다음 최신순
    return posts.sort((a, b) => (b.pinned === true) - (a.pinned === true) || b.date.localeCompare(a.date));
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  async function renderList(el) {
    try {
      let posts = await loadIndex();
      const limit = parseInt(el.dataset.limit || "0", 10);
      if (limit) posts = posts.slice(0, limit);
      el.innerHTML = posts.length ? posts.map((p) => `
        <li><a href="post.html?id=${encodeURIComponent(p.id)}">
          ${p.pinned ? '<span class="post-badge">공지</span>' : ""}
          <span class="post-title">${esc(p.title)}</span>
          <span class="post-date">${esc(p.date)}</span>
        </a></li>`).join("") : PENDING_LIST;
    } catch (e) {
      el.innerHTML = PENDING_LIST;
    }
  }

  async function renderPost(el) {
    const id = new URLSearchParams(location.search).get("id");
    try {
      const posts = await loadIndex();
      const meta = posts.find((p) => p.id === id);
      if (!meta) throw new Error("not found");
      const res = await fetch(`posts/${encodeURIComponent(id)}.md`, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      const md = await res.text();
      document.title = `${meta.title} | ${window.SITE.name}`;
      el.innerHTML = `
        <h1>${esc(meta.title)}</h1>
        <div class="article-meta">${esc(meta.date)}</div>
        <div class="article-body">${marked.parse(md)}</div>
        <p style="margin-top:40px"><a class="btn btn-sm" href="notice.html">← 목록으로</a></p>`;
    } catch (e) {
      el.innerHTML = '<h1>글을 찾을 수 없습니다</h1><p><a class="btn btn-sm" href="notice.html">← 목록으로</a></p>';
    }
  }

  const list = document.getElementById("post-list");
  if (list) renderList(list);
  const post = document.getElementById("post");
  if (post) renderPost(post);
})();
