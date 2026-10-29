/*
 * 공통 스크립트: 헤더/푸터 그리기, 다크모드, 설정값 바인딩, 계좌 복사, 갤러리 확대
 * 모든 페이지에서 config.js 다음에 불러옵니다.
 */
(function () {
  const S = window.SITE;
  const PENDING = "추후 안내";

  const NAV = [
    ["index.html", "홈"],
    ["about.html", "소개"],
    ["products.html", "취급 품목"],
    ["gallery.html", "갤러리"],
    ["notice.html", "공지사항"],
    ["location.html", "오시는 길"],
    ["contact.html", "문의하기"]
  ];

  // ---------- 다크모드 ----------
  const THEME_KEY = "theme";
  function savedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute("data-theme", t);
  }
  applyTheme(savedTheme());

  function currentTheme() {
    const t = document.documentElement.getAttribute("data-theme");
    if (t) return t;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  }

  // ---------- 헤더 / 푸터 ----------
  function page() {
    const p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }

  function renderHeader() {
    const el = document.getElementById("site-header");
    if (!el) return;
    const cur = page() === "post.html" ? "notice.html" : page();
    el.className = "site-header";
    el.innerHTML = `
      <div class="container header-inner">
        <a class="logo" href="index.html"><span class="logo-mark" aria-hidden="true"></span><span class="logo-text">${S.name}<small>${S.nameEn}</small></span></a>
        <nav class="nav" id="nav" aria-label="주 메뉴">
          ${NAV.map(([href, label]) =>
            `<a href="${href}"${href === cur ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
        </nav>
        <div class="header-actions">
          <a class="btn btn-sm btn-primary header-call" href="tel:${S.phone}">전화 문의</a>
          <button class="icon-btn" id="theme-toggle" type="button" aria-label="다크모드 전환">
            <svg class="i-sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            <svg class="i-moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
          </button>
          <button class="icon-btn menu-btn" id="menu-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="nav">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>`;

    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    const menuBtn = document.getElementById("menu-toggle");
    menuBtn.addEventListener("click", () => {
      const open = el.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
  }

  function renderFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.className = "site-footer";
    el.innerHTML = `
      <div class="container footer-inner">
        <div>
          <strong class="footer-name">${S.name}</strong>
          <p>${S.address} ${S.addressNote}</p>
          <p>대표 ${S.owner} · 전화 <a href="tel:${S.phone}">${S.phone}</a> · 팩스 ${S.fax}</p>
          <p>이메일 <a href="mailto:${S.email}">${S.email}</a></p>
          <p>영업시간 ${S.hours || PENDING}</p>
        </div>
        <div class="footer-account">
          <span class="muted">입금 계좌</span>
          <p>${S.account.bank} ${S.account.number}<br>예금주 ${S.account.holder}</p>
        </div>
      </div>
      <div class="container footer-copy">© ${new Date().getFullYear()} ${S.name}. All rights reserved.</div>`;
  }

  // ---------- 설정값 바인딩 ----------
  // HTML에서 <span data-site="phone"></span> 처럼 쓰면 config.js 값이 들어갑니다.
  function get(path) {
    return path.split(".").reduce((o, k) => (o == null ? o : o[k]), S);
  }
  function bindSiteValues() {
    document.querySelectorAll("[data-site]").forEach((el) => {
      const v = get(el.dataset.site);
      el.textContent = v ? v : PENDING;
      if (!v) el.classList.add("pending");
    });
    document.querySelectorAll("[data-site-tel]").forEach((el) => el.setAttribute("href", "tel:" + S.phone));
    document.querySelectorAll("[data-site-mail]").forEach((el) => el.setAttribute("href", "mailto:" + S.email));
    document.querySelectorAll("[data-map]").forEach((el) => {
      const q = encodeURIComponent(S.address.replace(", 1층", ""));
      const urls = {
        naver: "https://map.naver.com/p/search/" + q,
        kakao: "https://map.kakao.com/link/search/" + q
      };
      el.setAttribute("href", urls[el.dataset.map]);
    });
  }

  // ---------- 계좌 복사 ----------
  function bindCopy() {
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const text = get(btn.dataset.copy);
        try {
          await navigator.clipboard.writeText(text);
          flash(btn, "복사됨");
        } catch (e) {
          prompt("아래 번호를 복사하세요", text);
        }
      });
    });
  }
  function flash(btn, msg) {
    const old = btn.textContent;
    btn.textContent = msg;
    setTimeout(() => (btn.textContent = old), 1500);
  }

  // ---------- 갤러리 확대 ----------
  function bindLightbox() {
    const items = document.querySelectorAll(".gallery-item");
    if (!items.length) return;
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = '<button class="lightbox-close" aria-label="닫기">×</button><img alt=""><p></p>';
    document.body.appendChild(box);
    const img = box.querySelector("img");
    const cap = box.querySelector("p");
    items.forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      img.src = a.getAttribute("href");
      cap.textContent = a.dataset.caption || "";
      box.classList.add("open");
    }));
    box.addEventListener("click", (e) => { if (e.target !== img) box.classList.remove("open"); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") box.classList.remove("open"); });
  }

  renderHeader();
  renderFooter();
  bindSiteValues();
  bindCopy();
  bindLightbox();
  if (document.title.indexOf("{name}") >= 0) document.title = document.title.replace("{name}", S.name);
})();
