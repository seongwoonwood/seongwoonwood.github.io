/*
 * 문의 폼 전송. config.js의 formEndpoint(Formspree 주소)로 보냅니다.
 * 주소가 비어 있으면 전송하지 않고 전화 안내를 보여줍니다.
 */
(function () {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const S = window.SITE;

  function show(msg) {
    status.innerHTML = msg;
    status.classList.add("show");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (!S.formEndpoint) {
      show(`온라인 문의는 준비 중입니다. 전화 <a href="tel:${S.phone}">${S.phone}</a>로 연락해 주세요.`);
      return;
    }

    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      const res = await fetch(S.formEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      show("문의가 접수되었습니다. 확인 후 연락드리겠습니다.");
    } catch (err) {
      show(`전송에 실패했습니다. 전화 <a href="tel:${S.phone}">${S.phone}</a>로 연락해 주세요.`);
    } finally {
      btn.disabled = false;
    }
  });
})();
