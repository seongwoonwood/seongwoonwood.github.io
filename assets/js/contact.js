/*
 * 문의 폼 전송. config.js의 formKey(Web3Forms Access Key)로 보냅니다.
 * 키가 비어 있으면 전송하지 않고 전화 안내를 보여줍니다.
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
    if (!S.formKey) {
      show(`온라인 문의는 준비 중입니다. 전화 <a href="tel:${S.phone}">${S.phone}</a>로 연락해 주세요.`);
      return;
    }

    const data = new FormData(form);
    data.delete("agree");
    data.append("access_key", S.formKey);
    data.append("subject", `[홈페이지 문의] ${data.get("type")} - ${data.get("name")}`);
    data.append("from_name", `${S.name} 홈페이지`);

    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "보내는 중…";
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) !== "true") throw new Error(json.message || res.status);
      form.reset();
      show("문의가 접수되었습니다. 확인 후 연락드리겠습니다.");
    } catch (err) {
      show(`전송에 실패했습니다. 전화 <a href="tel:${S.phone}">${S.phone}</a>로 연락해 주세요.`);
    } finally {
      btn.disabled = false;
      btn.textContent = "문의 보내기";
    }
  });
})();
