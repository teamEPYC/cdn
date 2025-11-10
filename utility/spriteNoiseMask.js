(() => {
  const SELECTOR = "[data-sprite]";
  const DEFAULT_SPRITE_URL =
    "https://cdn.prod.website-files.com/6904a418739bb0c76ab91cce/690cd83845a95bdc83bb7cda_sprite.png";

  const normalizeUrl = (v) => {
    if (!v) return "";
    const s = v.trim().replace(/^['"]|['"]$/g, "");
    const m = s.match(/^url\((.*)\)$/i);
    return (m ? m[1] : s).trim().replace(/^['"]|['"]$/g, "");
  };

  // preload + decode
  function preloadSprite(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        (img.decode?.() || Promise.resolve()).then(() => resolve(img)).catch(() => resolve(img));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async function ensureSprite(url) {
    try {
      await preloadSprite(url);
      return url;
    } catch {
      console.warn("sprite-mask: failed to load", url, "— using default fallback");
      await preloadSprite(DEFAULT_SPRITE_URL);
      return DEFAULT_SPRITE_URL;
    }
  }

  const initOne = async (el) => {
    if (el._spriteInit) return;
    el._spriteInit = true;

    const cs = getComputedStyle(el);
    const requestedUrl =
      el.dataset.spriteUrl ||
      normalizeUrl(cs.getPropertyValue("--sprite-url")) ||
      DEFAULT_SPRITE_URL;

    const cols =
      parseInt(el.dataset.cols || cs.getPropertyValue("--sprite-cols")) || 10;
    const rows =
      parseInt(el.dataset.rows || cs.getPropertyValue("--sprite-rows")) || 10;
    const total = cols * rows;

    const url = await ensureSprite(requestedUrl);

    Object.assign(el.style, {
      WebkitMaskImage: `url(${url})`,
      maskImage: `url(${url})`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskOrigin: "border-box",
      maskOrigin: "border-box",
      WebkitMaskClip: "border-box",
      maskClip: "border-box",
      willChange: "mask-position,-webkit-mask-position"
    });

    // ---- sizing state ----
    let frameW = 0, frameH = 0, maskW = 0, maskH = 0;
    const centerOffset = { x: 0, y: 0 };
    let currentFrame = 0;

    // --- quickSetter for faster updates ---
    const setCSS = gsap.quickSetter(el, "css");

    const setFrame = (i) => {
      const idx = Math.max(0, Math.min(total - 1, i | 0));
      currentFrame = idx;
      const col = idx % cols;
      const row = (idx / cols) | 0;
      const x = centerOffset.x - col * frameW;
      const y = centerOffset.y - row * frameH;
      // one optimized GSAP write per frame
      setCSS({
        WebkitMaskPosition: `${x}px ${y}px`,
        maskPosition: `${x}px ${y}px`
      });
    };

    const setProgress = (p) => {
      const clamped = Math.max(0, Math.min(1, +p || 0));
      setFrame(Math.round(clamped * (total - 1)));
    };

    const computeSizes = () => {
      const cw = el.clientWidth, ch = el.clientHeight;
      if (!cw || !ch) return;
      if (cw >= ch) { frameW = cw; frameH = cw; } else { frameH = ch; frameW = ch; }
      maskW = frameW * cols;
      maskH = frameH * rows;
      centerOffset.x = (cw - frameW) / 2;
      centerOffset.y = (ch - frameH) / 2;
      el.style.WebkitMaskSize = `${maskW}px ${maskH}px`;
      el.style.maskSize       = `${maskW}px ${maskH}px`;
      setFrame(currentFrame);
    };

    el._spriteSetFrame = setFrame;
    el._spriteSetProgress = setProgress;
    el._spriteRefresh = computeSizes;

    const ro = new ResizeObserver(() => requestAnimationFrame(computeSizes));
    ro.observe(el);
    computeSizes();
  };

  const initAll = (root = document) => {
    root.querySelectorAll(SELECTOR).forEach((el) => { void initOne(el); });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initAll());
  } else {
    initAll();
  }

  window.initSpriteMasks = initAll;
})();