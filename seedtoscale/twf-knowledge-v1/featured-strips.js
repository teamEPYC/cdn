/**
 * Featured strips background
 *
 * Webflow custom attributes:
 *   data-featured-stage   — right column (used for size)
 *   data-featured-strips  — a canvas inside the stage
 *
 * Does not touch [data-featured-book]. Load after featured.js is fine.
 */

(function () {
  const SELECTOR = {
    canvas: "[data-featured-strips]",
    stage: "[data-featured-stage]",
  };

  const COLORS = [
    "#FF3621",
    "#FF5A3A",
    "#E02E1C",
    "#FF7A62",
    "#F4A090",
    "#FFB5A3",
    "#E8A090",
    "#C9B8E8",
    "#B8C4F0",
    "#FBF8F3",
    "#E8E0D8",
  ];

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function makeStrip(w, h, fromRight, row, barH) {
    const barW = rand(w * 0.18, w * 0.85);
    return {
      x: fromRight ? w + rand(0, w * 0.6) : rand(-barW * 0.15, w * 0.55),
      y: row * barH,
      w: barW,
      h: barH,
      speed: rand(55, 140),
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: rand(0.45, 1),
      row,
    };
  }

  function makePixel(w, h, fromRight) {
    const size = rand(5, 14);
    return {
      x: fromRight ? w + rand(0, w * 0.5) : rand(0, w),
      y: rand(0, h),
      s: size,
      speed: rand(32, 110),
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: rand(0.35, 1),
    };
  }

  function styleCanvas(canvas) {
    canvas.style.display = "block";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "0";

    const parent = canvas.parentElement;
    if (
      parent &&
      !parent.hasAttribute("data-featured-book") &&
      !parent.hasAttribute("data-featured-stage")
    ) {
      parent.style.pointerEvents = "none";
    }
  }

  function mount(canvas) {
    const stage =
      canvas.closest(SELECTOR.stage) ||
      canvas.parentElement;
    if (!stage) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    styleCanvas(canvas);

    let width = 0;
    let height = 0;
    let strips = [];
    let pixels = [];
    let frame = 0;
    let running = true;
    let last = performance.now();

    const resize = () => {
      const nextW = stage.clientWidth;
      const nextH = stage.clientHeight;
      if (!nextW || !nextH) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = nextW;
      height = nextH;
      canvas.width = Math.floor(nextW * dpr);
      canvas.height = Math.floor(nextH * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(14, Math.round(nextH / 18));
      const barH = nextH / count;
      strips = Array.from({ length: count }, (_, i) =>
        makeStrip(nextW, nextH, true, i, barH)
      );
      pixels = Array.from({ length: 28 }, () => makePixel(nextW, nextH, true));
    };

    const draw = (now) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!width || !height) {
        frame = requestAnimationFrame(draw);
        return;
      }

      const g = ctx.createLinearGradient(0, 0, width, 0);
      g.addColorStop(0, "#D8D4CE");
      g.addColorStop(0.42, "#C9C4BE");
      g.addColorStop(0.72, "#E8A090");
      g.addColorStop(1, "#FF5A3A");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      for (const strip of strips) {
        strip.x -= strip.speed * dt;
        if (strip.x + strip.w < -40) {
          Object.assign(strip, makeStrip(width, height, true, strip.row, strip.h));
        }
        ctx.globalAlpha = strip.alpha;
        ctx.fillStyle = strip.color;
        ctx.fillRect(strip.x, strip.y, strip.w, strip.h + 1);
      }

      for (const pixel of pixels) {
        pixel.x -= pixel.speed * dt;
        if (pixel.x + pixel.s < -20) {
          Object.assign(pixel, makePixel(width, height, true));
        }
        ctx.globalAlpha = pixel.alpha;
        ctx.fillStyle = pixel.color;
        ctx.fillRect(pixel.x, pixel.y, pixel.s, pixel.s);
      }

      ctx.globalAlpha = 1;
      const haze = ctx.createLinearGradient(width * 0.45, 0, width, 0);
      haze.addColorStop(0, "rgba(255,54,33,0)");
      haze.addColorStop(1, "rgba(255,54,33,0.22)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, width, height);

      frame = requestAnimationFrame(draw);
    };

    resize();
    last = performance.now();
    frame = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    const vis = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        if (visible && !running) {
          running = true;
          last = performance.now();
          frame = requestAnimationFrame(draw);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { rootMargin: "15% 0px" }
    );
    vis.observe(stage);
  }

  function init() {
    document.querySelectorAll(SELECTOR.canvas).forEach(mount);
  }

  onReady(init);
})();
