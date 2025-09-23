(function () {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const POLL_MS = 180; // low-frequency polling for Safari (cheap + smooth)

  function applyCornerCircleCutoutsV5() {
    const targets = document.querySelectorAll(
      '[data-cutout="true"], [data-cutout-child="true"]'
    );

    const px = (v) => (isNaN(v) ? 0 : v);
    const getMaxPadding = (el) => {
      if (!el) return 0;
      const cs = getComputedStyle(el);
      return Math.max(
        px(parseFloat(cs.paddingTop)),
        px(parseFloat(cs.paddingRight)),
        px(parseFloat(cs.paddingBottom)),
        px(parseFloat(cs.paddingLeft))
      );
    };

    const usePseudoLayer = (el) => {
      const c = getComputedStyle(el, "::before").content;
      return c && c !== "none";
    };

    const updateOne = (container) => {
      const isChild = container.getAttribute("data-cutout-child") === "true";
      const hasInset = container.getAttribute("data-cutout-inset") === "true";

      // Cleanup old inline mask & stale styles
      container.style.maskImage = "";
      container.style.webkitMaskImage = "";
      container.style.maskRepeat = "";
      container.style.webkitMaskRepeat = "";
      container.style.maskSize = "";
      container.style.webkitMaskSize = "";
      container.style.maskPosition = "";
      container.style.webkitMaskPosition = "";
      if (container.style.overflow === "hidden") container.style.overflow = "";
      if (container.style.height) container.style.height = "";

      // Radius / offset
      let radius = parseFloat(
        container.getAttribute("data-cutout-radius") || "50"
      );
      let offset = 0;
      if (isChild) {
        const base = container.closest('[data-cutout="true"]');
        if (base) {
          const baseRadius = parseFloat(
            base.getAttribute("data-cutout-radius") || "50"
          );
          const basePad = getMaxPadding(base);
          radius = baseRadius + basePad;
          offset = basePad;
        }
      }

      const rect = container.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);

      const circlesOuter = [
        [-offset, -offset],
        [w + offset, -offset],
        [-offset, h + offset],
        [w + offset, h + offset],
      ]
        .map(
          ([cx, cy]) =>
            `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="black"/>`
        )
        .join("");

      let insetPart = "";
      if (hasInset && window.innerWidth > 991) {
        const insetWidthPercent = parseFloat(
          container.getAttribute("data-inset-width") || "40"
        );
        const insetPadding = parseFloat(
          container.getAttribute("data-inset-padding") || "10"
        );
        const insetTotalWidth = (insetWidthPercent / 100) * w;
        const insetRectWidth = Math.max(0, insetTotalWidth - insetPadding * 2);
        const insetRectHeight = Math.max(0, h - insetPadding * 2);
        const insetX = w - insetRectWidth - insetPadding;
        const insetY = insetPadding;
        const expandedRadius = Math.max(0, radius + insetPadding);

        const insetCircleData = [
          [w - insetTotalWidth, 0],
          [w, 0],
          [w - insetTotalWidth, h],
          [w, h],
        ]
          .map(
            ([cx, cy]) =>
              `<circle cx="${cx}" cy="${cy}" r="${expandedRadius}" fill="white"/>`
          )
          .join("");

        insetPart =
          `<rect x="${insetX}" y="${insetY}" width="${insetRectWidth}" height="${insetRectHeight}" fill="black"/>` +
          insetCircleData;
      }

      const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}">
            <rect x="0" y="0" width="${w}" height="${h}" fill="white"/>
            ${insetPart}
            ${circlesOuter}
          </mask>
        </defs>
        <rect x="0" y="0" width="${w}" height="${h}" fill="black" mask="url(#m)"/>
      </svg>`;

      const url = `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`;

      if (usePseudoLayer(container)) {
        container.style.setProperty("--cutout", `url("${url}")`);
        container.style.webkitMaskImage = "";
        container.style.maskImage = "";
      } else {
        container.style.webkitMaskImage = `url("${url}")`;
        container.style.maskImage = `url("${url}")`;
        container.style.webkitMaskRepeat = "no-repeat";
        container.style.maskRepeat = "no-repeat";
        container.style.webkitMaskSize = "100% 100%";
        container.style.maskSize = "100% 100%";
        container.style.webkitMaskPosition = "0 0";
        container.style.maskPosition = "0 0";
      }
    };

    // --- Visibility-gated polling for Safari; ResizeObserver elsewhere ---
    const seen = new WeakMap();

    if (isSafari) {
      const timers = new WeakMap();
      const lastSize = new WeakMap(); // keeps last (w,h) per element to avoid redundant work

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            const el = e.target;
            if (e.isIntersecting) {
              if (timers.has(el)) return;
              let lw = 0,
                lh = 0;
              const tick = () => {
                const r = el.getBoundingClientRect();
                const w = Math.round(r.width * 2) / 2;
                const h = Math.round(r.height * 2) / 2;
                const prev = lastSize.get(el) || { w: 0, h: 0 };
                if (w !== prev.w || h !== prev.h) {
                  lastSize.set(el, { w, h });
                  updateOne(el);
                }
                lw = w;
                lh = h;
              };
              const id = setInterval(tick, POLL_MS);
              timers.set(el, id);
              // run once immediately
              tick();
            } else {
              if (timers.has(el)) {
                clearInterval(timers.get(el));
                timers.delete(el);
              }
            }
          });
        },
        { root: null, threshold: 0 }
      );

      targets.forEach((t) => {
        io.observe(t);
        t.querySelectorAll("img").forEach((img) => {
          if (!img.complete)
            img.addEventListener("load", () => updateOne(t), { once: true });
        });
      });

      // IMPORTANT: removed global window.resize handler so only elements
      // whose own size changes (detected by polling) get updated.
      // (No code here by design.)
    } else {
      // Non-Safari: use ResizeObserver (per-element)
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const el = entry.target;
          const r = el.getBoundingClientRect();
          const w = Math.round(r.width * 2) / 2;
          const h = Math.round(r.height * 2) / 2;
          const prev = seen.get(el);
          if (!prev || prev.w !== w || prev.h !== h) {
            seen.set(el, { w, h });
            updateOne(el);
          }
        }
      });
      targets.forEach((t) => {
        ro.observe(t);
        t.querySelectorAll("img").forEach((img) => {
          if (!img.complete)
            img.addEventListener("load", () => updateOne(t), { once: true });
        });
      });
      // initial render per element
      targets.forEach((t) => updateOne(t));
    }
  }

  // Boot
  window.addEventListener("load", applyCornerCircleCutoutsV5);
  window.addEventListener("orientationchange", applyCornerCircleCutoutsV5); // iOS Safari quirk
})();
