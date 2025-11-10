export function svgCutouts() {
function applyCornerCircleCutoutsV4() {
  const targets = document.querySelectorAll(
    '[data-cutout="true"], [data-cutout-child="true"]'
  );

  const raf = (fn) =>
    window.requestAnimationFrame ? requestAnimationFrame(fn) : fn();

  const px = (v) => (isNaN(v) ? 0 : v);

  const getBoxPaddings = (el) => {
    if (!el) return 0;
    const cs = getComputedStyle(el);
    return Math.max(
      px(parseFloat(cs.paddingTop)),
      px(parseFloat(cs.paddingRight)),
      px(parseFloat(cs.paddingBottom)),
      px(parseFloat(cs.paddingLeft))
    );
  };

  const updateOne = (container) => {
    const isChild = container.getAttribute("data-cutout-child") === "true";
    const hasInset = container.getAttribute("data-cutout-inset") === "true";

    // Cleanup old SVG artifacts and mask props (but avoid changing layout-affecting props)
    container.querySelectorAll("svg.cutout-svg").forEach((el) => el.remove());
    container.style.maskImage = "";
    container.style.webkitMaskImage = "";
    container.style.maskRepeat = "";
    container.style.webkitMaskRepeat = "";
    container.style.maskSize = "";
    container.style.webkitMaskSize = "";
    container.style.maskPosition = "";
    container.style.webkitMaskPosition = "";

    // Determine base radius and offset
    let radius = parseFloat(
      container.getAttribute("data-cutout-radius") || "50"
    );
    let offset = 0;

    // Restore v1-style ancestor padding accumulation for children
    if (isChild) {
      let current = container;
      let totalPadding = 0;
      let base = null;

      while (current && current !== document.body) {
        const maybeBase = current.querySelector('[data-cutout="true"]');
        if (maybeBase) {
          base = maybeBase;
          break;
        }
        const cs = getComputedStyle(current.parentElement);
        const pt = parseFloat(cs.paddingTop) || 0;
        const pl = parseFloat(cs.paddingLeft) || 0;
        totalPadding += Math.max(pt, pl);
        current = current.parentElement;
      }

      if (base) {
        const baseRadius = parseFloat(
          base.getAttribute("data-cutout-radius") || "50"
        );
        radius = baseRadius + totalPadding;
        offset = totalPadding;
      } else {
        console.warn(
          "No base [data-cutout] ancestor found for child:",
          container
        );
      }
    }

    // Use rounded, pixel-snapped geometry to avoid sub-pixel drift
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));

    // Outer corner bites
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

    // Optional right-side inset (desktop only)
    let insetPart = "";
    if (hasInset && window.innerWidth > 991) {
      const insetWidthPercent = parseFloat(
        container.getAttribute("data-inset-width") || "40"
      );
      const insetPadding = parseFloat(
        container.getAttribute("data-inset-padding") || "10"
      );

      const insetTotalWidth = Math.round((insetWidthPercent / 100) * w);
      const insetRectWidth = Math.max(0, insetTotalWidth - insetPadding * 2);
      const insetRectHeight = Math.max(0, h - insetPadding * 2);
      const insetX = w - insetRectWidth - insetPadding;
      const insetY = insetPadding;

      // Tie corner roundness to base radius + local inset padding; snap to px
      const expandedRadius = Math.max(0, Math.round(radius + insetPadding));

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

    // Apply as CSS mask
    container.style.webkitMaskImage = `url("${url}")`;
    container.style.maskImage = `url("${url}")`;
    container.style.webkitMaskRepeat = "no-repeat";
    container.style.maskRepeat = "no-repeat";
    container.style.webkitMaskSize = "100% 100%";
    container.style.maskSize = "100% 100%";
    container.style.webkitMaskPosition = "0 0";
    container.style.maskPosition = "0 0";
  };

  // Run once now
  targets.forEach((t) => updateOne(t));

  // Observe size changes for live recalculation
  if (!window.__cutoutResizeObserver) {
    window.__cutoutResizeObserver = new ResizeObserver((entries) => {
      // Batch in rAF to avoid layout thrash
      raf(() => {
        for (const entry of entries) {
          const el = entry.target;
          if (el.matches('[data-cutout="true"], [data-cutout-child="true"]')) {
            updateOne(el);
          }
        }
      });
    });
  }
  targets.forEach((t) => window.__cutoutResizeObserver.observe(t));

  // Recompute when images inside targets finish loading (content height changes)
  targets.forEach((t) => {
    t.querySelectorAll("img").forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", () => updateOne(t), { once: true });
      }
    });
  });
}

// Listeners
applyCornerCircleCutoutsV4();


window.addEventListener("resize", () => {
  // Debounce via rAF
  if (window.__cutoutResizeTick)
    cancelAnimationFrame(window.__cutoutResizeTick);
  window.__cutoutResizeTick = requestAnimationFrame(applyCornerCircleCutoutsV4);
});

}