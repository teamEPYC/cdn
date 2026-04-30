console.log("hello");

//hero code desktop
if (window.innerWidth >= 768) {
  document.querySelectorAll(".ag-tab-link").forEach((link) => {
    link.addEventListener("click", function () {
      document
        .querySelectorAll(".ag-tab-link")
        .forEach((el) => el.classList.remove("is-active"));
      document
        .querySelectorAll(".ag-tab-content-wrap")
        .forEach((el) => el.classList.remove("is-active"));

      this.classList.add("is-active");
      this.nextElementSibling?.classList.add("is-active");
    });
  });

  // Set first one active on load
  const firstLink = document.querySelector(".ag-tab-link");
  if (firstLink) {
    firstLink.classList.add("is-active");
    firstLink.nextElementSibling?.classList.add("is-active");
  }
}

//hero code mobile
if (window.innerWidth < 768) {
  const items = document.querySelectorAll(".ag-tab-content-item");

  items.forEach((item) => {
    const dropdown = item.querySelector(".ag-mobile-dropdown");
    const hideDesktop = item.querySelector(".hide-desktop");

    const wrap = document.createElement("div");
    wrap.className = "ag-mobile-wrap";

    dropdown && wrap.appendChild(dropdown);
    hideDesktop && wrap.appendChild(hideDesktop);

    item.prepend(wrap);
  });

  const allCards = document.querySelectorAll(
    ".ag-tab-content-item .trails-sub-menu-card"
  );
  const ddList = document.querySelector(
    ".ag-mobile-dropdown .trails-sub-menu-wrap.is-payments-list"
  );

  ddList.querySelectorAll(".trails-sub-menu-card").forEach((el) => el.remove());
  allCards.forEach((card) => {
    ddList.appendChild(card.cloneNode(true));
  });

  const allRichTexts = document.querySelectorAll(
    ".ag-tab-content-item .ag-hero-rich-text-wrap"
  );
  const firstMobileWrap = document.querySelector(".ag-mobile-wrap");

  allRichTexts.forEach((el, index) => {
    if (index === 0) el.classList.add("is-active");
    firstMobileWrap.appendChild(el);
  });

  document.querySelectorAll(".ag-tab-content-wrap").forEach((wrap) => {
    const copyBtn = wrap.querySelector('[data-copy="para"]');
    if (!copyBtn) return;

    copyBtn.addEventListener("click", () => {
      const activeRichText = firstMobileWrap.querySelector(
        ".ag-hero-rich-text-wrap.is-active"
      );
      const target =
        activeRichText &&
        activeRichText.querySelector('[data-target-copied="para"]');
      const text = target ? target.textContent.trim() : "";
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const btnCopy = copyBtn.querySelector("div");
        const original = btnCopy.textContent; // capture before changing
        btnCopy.textContent = "COPIED";
        setTimeout(() => {
          btnCopy.textContent = "TRY WITH YOUR AGENT";
        }, 1000);
      });
    });
  });

  const cards = ddList.querySelectorAll(".trails-sub-menu-card");
  const richTexts = firstMobileWrap.querySelectorAll(".ag-hero-rich-text-wrap");

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      richTexts.forEach((el) => el.classList.remove("is-active"));
      cards.forEach((c) => c.classList.remove("is-active"));

      card.classList.add("active");
      if (richTexts[index]) richTexts[index].classList.add("is-active");

      const toggle = document.querySelector(
        ".ag-mobile-dropdown .uc-dd-toggle div"
      );
      if (toggle) toggle.textContent = card.textContent.trim();
    });
  });
}

// richtext copy

if (window.innerWidth >= 768) {
  document.querySelectorAll(".ag-tab-content-wrap").forEach((wrap) => {
    const copyBtn = wrap.querySelector('[data-copy="para"]');
    const target = wrap.querySelector('[data-target-copied="para"]');

    if (!copyBtn || !target) return;

    const textEl = copyBtn.querySelector("div");
    const originalText = textEl?.textContent;

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(target.textContent.trim()).then(() => {
        if (textEl) textEl.textContent = "Copied";
        setTimeout(() => {
          if (textEl) textEl.textContent = originalText;
        }, 1000);
      });
    });
  });
}

// rich text code colors
document
  .querySelectorAll(".ag-card-rich-text pre code, .ag-card-rich-text pre")
  .forEach((block) => {
    // Strip any existing spans to get plain text
    const temp = document.createElement("div");
    temp.innerHTML = block.innerHTML;
    const plainText = temp.textContent || temp.innerText;

    const colored = plainText.replace(
      /"([^"]+)":\s*("([^"]*)"|(\b(?:true|false|null)\b)|(-?\d+\.?\d*))/g,
      (match, key, rawVal, strVal, boolVal, numVal) => {
        const keySpan = `<span style="color:#670DE5">"${key}"</span>`;

        let valSpan;
        if (numVal !== undefined) {
          valSpan = `<span style="color:#FF7421">${numVal}</span>`;
        } else if (boolVal !== undefined) {
          valSpan =
            key === "ok"
              ? `<span style="color:#00FF08">${boolVal}</span>`
              : `<span style="color:#ffffff">${boolVal}</span>`;
        } else if (strVal !== undefined) {
          if (key === "ok") {
            valSpan = `<span style="color:#00FF08">"${strVal}"</span>`;
          } else if (strVal.trim().includes(" ") || strVal.length > 20) {
            valSpan = `<span style="color:#707BB7">"${strVal}"</span>`;
          } else {
            valSpan = `<span style="color:#ffffff">"${strVal}"</span>`;
          }
        } else {
          valSpan = rawVal;
        }

        return `${keySpan}: ${valSpan}`;
      }
    );

    block.innerHTML = colored;
  });

(() => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (!isSafari) return;

  const videoMap = {
    ".agent-hero-video":
      "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/agent%20hero%20safari.mov",
    ".agent-section-video":
      "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/agent%20full%20safari%20video.mov",
  };

  Object.entries(videoMap).forEach(([selector, src]) => {
    document.querySelectorAll(selector).forEach((video) => {
      video.src = src;
      video.load();
    });
  });
})();

//copy uc card data
document.querySelectorAll("[data-code-copy]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.parentElement.querySelector("[data-target]");
    if (target) {
      navigator.clipboard.writeText(target.textContent.trim());
    }

    const overlay = btn.querySelector(".ag-copy-overlay");
    if (overlay) overlay.style.display = "flex";

    const embedText = btn.querySelector(".ag-copy-embed");
    if (embedText) embedText.style.color = "#721FE5";

    btn
      .querySelectorAll(".ag-copy-icon.is-normal")
      .forEach((el) => (el.style.display = "none"));
    btn
      .querySelectorAll(".ag-copy-icon.is-copied")
      .forEach((el) => (el.style.display = "flex"));

    setTimeout(() => {
      if (overlay) overlay.style.display = "none";
      if (embedText) embedText.style.color = "inherit";
      btn
        .querySelectorAll(".ag-copy-icon.is-normal")
        .forEach((el) => (el.style.display = "flex"));
      btn
        .querySelectorAll(".ag-copy-icon.is-copied")
        .forEach((el) => (el.style.display = "none"));
    }, 1000);
  });
});

gsap.set(".ag-section-video-embed", { y: "-25%" }); // start position (top)

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".ag-video-section",
    start: "top bottom", // when section enters viewport
    end: "bottom top", // when section fully leaves
    scrub: true,
  },
});

tl.to(".ag-section-video-embed", { y: "0%", ease: "none" }) // enters → moves down to center
  .to(".ag-section-video-embed", { y: "25%", ease: "none" }); // exits → moves further down/up
