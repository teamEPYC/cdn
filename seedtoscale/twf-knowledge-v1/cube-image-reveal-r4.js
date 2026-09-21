/**
 * Cube mosaic reveal
 *
 * Webflow custom attributes:
 *   data-cube-scope   — the section (set height / borders in Webflow)
 *   data-cube-canvas  — a canvas that fills the section
 *
 * Copy lives under the canvas in Webflow (pointer-events: none).
 * Hover erases cubes. Click sends a ring. Edge cubes can stay locked.
 *
 * r4 (Early Access page): the canvas fills the strip that contains it, and the
 * cubes that never erase form an irregular ring around the copy instead of a
 * fixed edge band. Each side's band spans the space between the text and that
 * edge, so the ring reads on a phone as well as on desktop, and no locked cube
 * ever sits over the text. Phones use smaller cubes (26px) for a finer ring.
 */

(function () {
  const SELECTOR = {
    scope: "[data-cube-scope]",
    canvas: "[data-cube-canvas]",
  };

  const CONFIG = {
    grid: {
      cell: 40,
      mobileCell: 26,
      narrow: 768,
      gap: 0,
      minCols: 8,
      minRows: 6,
    },
    ring: {
      pad: 0.35,
      power: 2.4,
      jitter: 0.3,
      start: 0.05,
      curve: 0.7,
      density: 0.8,
      smallDensity: 1,
      smallCols: 20,
    },
    lock: {
      top: 2,
      side: 3.5,
      bottom: 3,
      jitter: 0.2,
    },
    trail: {
      spread: 2,
      stamps: 6,
    },
    fade: {
      rate: 0.94,
      done: 0.02,
    },
    click: {
      waveSpeed: 0.5,
      skipChance: 0.58,
    },
    cube: {
      hue: 10,
      hueSpread: 18,
      sat: 0.68,
      satSpread: 0.22,
      litMin: 0.38,
      litMax: 0.72,
    },
    loop: {
      idleMs: 50,
      rootMargin: "80px",
    },
  };

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function hash(n) {
    const t = Math.sin(n * 127.1) * 43758.5453;
    return t - Math.floor(t);
  }

  function hslToRgb(hue, sat, lit) {
    const chroma = sat * Math.min(lit, 1 - lit);
    const channel = (n) => {
      const k = (n + hue / 30) % 12;
      return lit - chroma * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    return {
      r: Math.round(255 * channel(0)),
      g: Math.round(255 * channel(8)),
      b: Math.round(255 * channel(4)),
    };
  }

  function cubeColor(seed, lightness) {
    const { hue, hueSpread, sat, satSpread } = CONFIG.cube;
    return hslToRgb(
      hue + hash(seed) * hueSpread,
      sat + hash(seed + 11) * satSpread,
      lightness
    );
  }

  function isLocked(x, y, cols, rows, box) {
    const ring = CONFIG.ring;
    const area = box || { x0: cols * 0.2, y0: rows * 0.3, x1: cols * 0.8, y1: rows * 0.7 };
    const x0 = area.x0 - ring.pad;
    const y0 = area.y0 - ring.pad;
    const x1 = area.x1 + ring.pad;
    const y1 = area.y1 + ring.pad;
    const cx = x + 0.5;
    const cy = y + 0.5;
    if (cx > x0 && cx < x1 && cy > y0 && cy < y1) return 0;

    const ox = cx < x0 ? (x0 - cx) / Math.max(x0, 0.5) : cx > x1 ? (cx - x1) / Math.max(cols - x1, 0.5) : 0;
    const oy = cy < y0 ? (y0 - cy) / Math.max(y0, 0.5) : cy > y1 ? (cy - y1) / Math.max(rows - y1, 0.5) : 0;
    const reach =
      Math.pow(Math.pow(ox, ring.power) + Math.pow(oy, ring.power), 1 / ring.power) +
      (hash(x * 31 + y * 57 + 5) - 0.5) * ring.jitter;
    const chance = Math.max(0, Math.min(1, (reach - ring.start) / (1 - ring.start)));
    const density = cols < ring.smallCols ? ring.smallDensity : ring.density;
    return hash(x * 47 + y * 13 + 71) < Math.pow(chance, ring.curve) * density ? 1 : 0;
  }

  function buildField(cols, rows, box) {
    const count = cols * rows;
    const red = new Uint8Array(count);
    const green = new Uint8Array(count);
    const blue = new Uint8Array(count);
    const cover = new Float32Array(count);
    const fading = new Uint8Array(count);
    const locked = new Uint8Array(count);
    const { litMin, litMax } = CONFIG.cube;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const index = y * cols + x;
        const groupX = Math.floor(x / 2);
        const groupY = Math.floor(y / 2);
        const nx = groupX / Math.max(Math.floor(cols / 2), 1);
        const ny = groupY / Math.max(Math.floor(rows / 2), 1);
        const mosaic = Math.min(
          1,
          Math.max(
            0,
            0.16 + nx * 0.28 + ny * 0.52 + (hash(groupX * 17 + groupY * 29) - 0.5) * 0.22
          )
        );
        const lightness = Math.min(
          litMax,
          Math.max(
            litMin,
            litMin + mosaic * (litMax - litMin) + (hash(index + 41) - 0.5) * 0.1
          )
        );
        const rgb = cubeColor(groupX * 17 + groupY * 29 + index, lightness);
        red[index] = rgb.r;
        green[index] = rgb.g;
        blue[index] = rgb.b;
        cover[index] = 1;
        locked[index] = isLocked(x, y, cols, rows, box);
      }
    }

    return { red, green, blue, cover, fading, locked, dirty: [] };
  }

  function styleCanvas(section, canvas) {
    section.style.position = section.style.position || "relative";
    section.style.overflow = "hidden";

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.zIndex = "10";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.cursor = "pointer";
    canvas.style.background = "transparent";
  }

  function initCubeReveal(section) {
    const canvas = section.querySelector(SELECTOR.canvas);
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    styleCanvas(section, canvas);

    const { cell, gap, minCols, minRows } = CONFIG.grid;
    const { spread, stamps } = CONFIG.trail;
    const { rate: fadeRate, done: fadeDone } = CONFIG.fade;
    const { waveSpeed, skipChance } = CONFIG.click;
    const idleMs = CONFIG.loop.idleMs;

    let cols = 24;
    let rows = 12;
    let field = buildField(cols, rows, null);
    let raf = 0;
    let visible = true;
    let lastIdle = 0;
    let lastCol = -1;
    let lastRow = -1;
    let seed = 1;
    const waves = [];
    const rect = { left: 0, top: 0, width: 1, height: 1 };

    function resetContext() {
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = 1;
    }

    function cacheRect() {
      const box = canvas.getBoundingClientRect();
      rect.left = box.left;
      rect.top = box.top;
      rect.width = box.width || 1;
      rect.height = box.height || 1;
    }

    function revealCell(x, y) {
      if (x < 0 || y < 0 || x >= cols || y >= rows) return;
      const index = y * cols + x;
      if (field.locked[index] || field.cover[index] <= 0) return;
      if (!field.fading[index]) {
        field.fading[index] = 1;
        field.dirty.push(index);
      }
    }

    function stampAt(col, row, stampSeed) {
      const span = spread * 2 + 1;
      for (let k = 0; k < stamps; k++) {
        revealCell(
          col + Math.floor(hash(stampSeed * 17 + k * 91) * span) - spread,
          row + Math.floor(hash(stampSeed * 29 + k * 53) * span) - spread
        );
      }

      const radius = spread + 0.35;
      for (let y = row - spread; y <= row + spread; y++) {
        for (let x = col - spread; x <= col + spread; x++) {
          const dx = x - col;
          const dy = y - row;
          if (dx * dx + dy * dy > radius * radius) continue;
          revealCell(x, y);
        }
      }
    }

    function stampRing(originX, originY, radius, ringSeed) {
      function visit(x, y) {
        if (hash(x * 13 + y * 47 + ringSeed + radius * 9) > skipChance) return;
        revealCell(x, y);
      }

      if (radius <= 0) {
        visit(originX, originY);
        return;
      }

      for (let x = originX - radius; x <= originX + radius; x++) {
        visit(x, originY - radius);
        visit(x, originY + radius);
      }
      for (let y = originY - radius + 1; y < originY + radius; y++) {
        visit(originX - radius, y);
        visit(originX + radius, y);
      }
    }

    function cellFromEvent(event) {
      const col = Math.max(
        0,
        Math.min(cols - 1, Math.floor(((event.clientX - rect.left) / rect.width) * cols))
      );
      const row = Math.max(
        0,
        Math.min(rows - 1, Math.floor(((event.clientY - rect.top) / rect.height) * rows))
      );
      return { col, row };
    }

    function paint() {
      const { red, green, blue, cover } = field;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      for (let index = 0, y = 0; y < rows; y++) {
        const y0 = Math.floor((y * height) / rows);
        const y1 = Math.floor(((y + 1) * height) / rows) + 1;
        for (let x = 0; x < cols; x++, index++) {
          const visibility = cover[index];
          if (visibility < fadeDone) continue;
          const x0 = Math.floor((x * width) / cols);
          const x1 = Math.floor(((x + 1) * width) / cols) + 1;
          ctx.globalAlpha = visibility;
          ctx.fillStyle = `rgb(${red[index]},${green[index]},${blue[index]})`;
          ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        }
      }
      ctx.globalAlpha = 1;
    }

    function tick(now) {
      if (!visible) {
        raf = 0;
        return;
      }

      const busy = waves.length || field.dirty.length;
      if (!busy && now - lastIdle < idleMs) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastIdle = now;

      const maxRadius = Math.max(cols, rows) + 3;
      let keep = 0;
      for (let i = 0; i < waves.length; i++) {
        const wave = waves[i];
        wave.r += waveSpeed;
        const ring = Math.floor(wave.r);
        while (wave.last < ring) {
          wave.last += 1;
          stampRing(wave.ox, wave.oy, wave.last, wave.seed);
        }
        if (wave.r <= maxRadius) waves[keep++] = wave;
      }
      waves.length = keep;

      const { cover, fading, dirty } = field;
      let write = 0;
      for (let i = 0; i < dirty.length; i++) {
        const index = dirty[i];
        const next = cover[index] * fadeRate;
        if (next < fadeDone) {
          cover[index] = 0;
          fading[index] = 0;
        } else {
          cover[index] = next;
          dirty[write++] = index;
        }
      }
      dirty.length = write;

      paint();
      raf = requestAnimationFrame(tick);
    }

    function startLoop() {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    }

    const frame = canvas.parentElement || section;
    const copy = frame.querySelector(".twf_cube-copy");
    let fieldKey = "";

    function measureCopy(box, nextCols, nextRows) {
      if (!copy) return null;
      const range = document.createRange();
      range.selectNodeContents(copy);
      const text = range.getBoundingClientRect();
      if (!text.width || !text.height) return null;
      const cellW = box.width / nextCols;
      const cellH = box.height / nextRows;
      return {
        x0: (text.left - box.left) / cellW,
        y0: (text.top - box.top) / cellH,
        x1: (text.right - box.left) / cellW,
        y1: (text.bottom - box.top) / cellH,
      };
    }

    function resize() {
      const box = frame.getBoundingClientRect();
      const { width, height } = box;
      const size = width < CONFIG.grid.narrow ? CONFIG.grid.mobileCell : cell;
      const nextCols = Math.max(minCols, Math.round((width + gap) / (size + gap)));
      const nextRows = Math.max(minRows, Math.round((height + gap) / (size + gap)));
      const textBox = measureCopy(box, nextCols, nextRows);
      const dpr = Math.max(1, window.devicePixelRatio || 1);

      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      resetContext();

      const key = [nextCols, nextRows]
        .concat(textBox ? [textBox.x0, textBox.y0, textBox.x1, textBox.y1].map((v) => Math.round(v * 4)) : [])
        .join(",");
      if (key !== fieldKey) {
        fieldKey = key;
        cols = nextCols;
        rows = nextRows;
        field = buildField(cols, rows, textBox);
        lastCol = -1;
        lastRow = -1;
        waves.length = 0;
      }

      cacheRect();
      paint();
    }

    function onMove(event) {
      const { col, row } = cellFromEvent(event);
      if (col === lastCol && row === lastRow) return;

      if (lastCol < 0) {
        seed += 1;
        stampAt(col, row, seed);
      } else {
        const steps = Math.max(Math.abs(col - lastCol), Math.abs(row - lastRow));
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          seed += 1;
          stampAt(
            Math.round(lastCol + (col - lastCol) * t),
            Math.round(lastRow + (row - lastRow) * t),
            seed
          );
        }
      }

      lastCol = col;
      lastRow = row;
      startLoop();
    }

    function onLeave() {
      lastCol = -1;
      lastRow = -1;
    }

    function onClick(event) {
      cacheRect();
      const { col, row } = cellFromEvent(event);
      seed += 1;
      waves.push({ ox: col, oy: row, r: 0, last: -1, seed });
      startLoop();
    }

    resize();
    cacheRect();
    raf = requestAnimationFrame(tick);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(frame);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry && entry.isIntersecting);
        if (visible) startLoop();
        else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: CONFIG.loop.rootMargin }
    );
    visibility.observe(section);

    canvas.addEventListener("pointerenter", cacheRect);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);
    window.addEventListener("scroll", cacheRect, { passive: true });
  }

  onReady(() => {
    document.querySelectorAll(SELECTOR.scope).forEach(initCubeReveal);
  });
})();
