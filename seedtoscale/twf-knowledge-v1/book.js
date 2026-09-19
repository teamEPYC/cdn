(() => {
  // webflow/three-shim.js
  var T = window.THREE;
  var ACESFilmicToneMapping = T.ACESFilmicToneMapping;
  var AmbientLight = T.AmbientLight;
  var Bone = T.Bone;
  var BoxGeometry = T.BoxGeometry;
  var CanvasTexture = T.CanvasTexture;
  var Clock = T.Clock;
  var Color = T.Color;
  var DirectionalLight = T.DirectionalLight;
  var Float32BufferAttribute = T.Float32BufferAttribute;
  var Group = T.Group;
  var HemisphereLight = T.HemisphereLight;
  var LinearFilter = T.LinearFilter;
  var LinearMipmapLinearFilter = T.LinearMipmapLinearFilter;
  var MathUtils = T.MathUtils;
  var Mesh = T.Mesh;
  var MeshPhysicalMaterial = T.MeshPhysicalMaterial;
  var MeshStandardMaterial = T.MeshStandardMaterial;
  var PCFSoftShadowMap = T.PCFSoftShadowMap || T.PCFShadowMap;
  var PerspectiveCamera = T.PerspectiveCamera;
  var PlaneGeometry = T.PlaneGeometry;
  var Raycaster = T.Raycaster;
  var SRGBColorSpace = T.SRGBColorSpace;
  var Scene = T.Scene;
  var ShadowMaterial = T.ShadowMaterial;
  var Skeleton = T.Skeleton;
  var SkinnedMesh = T.SkinnedMesh;
  var Uint16BufferAttribute = T.Uint16BufferAttribute;
  var Vector2 = T.Vector2;
  var Vector3 = T.Vector3;
  var WebGLRenderer = T.WebGLRenderer;

  // src/components/Book3D/config.js
  var CONFIG = {
    openAngle: 50,
    series: "THE WORKING KNOWLEDGE",
    author: "TARUN RAHEJA  \xB7  ACCEL  \xB7  21 SEPT 2026",
    cover: {
      number: "01",
      badge: "V1.0",
      title: ["Harness", "Engineering"]
    },
    back: {
      title: "The Working Knowledge",
      credit: "TARUN RAHEJA  \xB7  ACCEL  \xB7  21 SEPT 2026"
    },
    pages: [
      {
        layout: "intro",
        kicker: "THE FILE",
        body: "This playbook discusses how to extend frontier model capabilities via Harness Engineering, and how to durably retain your moat."
      },
      {
        layout: "index",
        kicker: "INDEX",
        items: [
          "Benchmarking model capabilities in your domain",
          "Harness engineering to improve frontier performance",
          "Productionizing and scaling up",
          "Retaining moats and staying ahead"
        ]
      },
      {
        layout: "sections",
        kicker: "THE FILE",
        sections: [
          {
            number: "01",
            heading: "BENCHMARKING MODEL CAPABILITIES IN YOUR DOMAIN",
            body: "Frontier models are superhuman at some tasks, and useless at others - unpredictably. We show ways to understand where the model is weak / strong in your domain in a principled manner."
          },
          {
            number: "02",
            heading: "HARNESS ENGINEERING TO IMPROVE FRONTIER PERFORMANCE",
            body: "Simple prompts cannot elicit peak capabilities from frontier models. We show how to achieve it - with tools, context management, loops, decomposition - and how to cleanly measure improvements."
          }
        ]
      },
      {
        layout: "sections",
        kicker: "THE FILE",
        sections: [
          {
            number: "03",
            heading: "PRODUCTIONIZING AND SCALING UP",
            body: "Demo harnesses are too unreliable and expensive in production. We show how you can build bulletproof evals, route model calls by reliability, and decide when fine-tuning is worth it."
          },
          {
            number: "04",
            heading: "RETAINING MOATS AND STAYING AHEAD",
            body: "Every new model release makes parts of our harness unnecessary or unwieldy, and throttles performance. We show what to delete when, and what parts of it a competitor cannot copy."
          }
        ]
      }
    ],
    variants: {
      frontier: {
        number: "02",
        badge: "IN PROGRESS",
        stamp: "IN PROGRESS",
        title: ["In the", "Making"]
      },
      teams: {
        number: "03",
        badge: "UPCOMING",
        stamp: "IN PROGRESS",
        title: ["Coming", "Next"]
      }
    }
  };

  // src/components/Book3D/textures.js
  var CREAM = "#F6F2EC";
  var INK = "#222222";
  var CORAL = "#FF7A61";
  var CORAL_DEEP = "#FF6B4A";
  var PAGE = "#EFE9E1";
  var TX = 2;
  function px(n) {
    return n * TX;
  }
  function cssFont(name) {
    if (typeof document === "undefined") return "";
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value ? `${value}, ` : "";
  }
  function sans(weight, size) {
    return `${weight} ${size}px ${cssFont("--font-fragment-sans")}Arial, sans-serif`;
  }
  function glare(weight, size) {
    return `${weight} ${size}px ${cssFont("--font-fragment-glare")}Georgia, serif`;
  }
  function avenir(weight, size) {
    return `${weight} ${size}px ${cssFont("--font-avenir")}Arial, sans-serif`;
  }
  function textWidth(ctx, text2) {
    return ctx.measureText(text2).width;
  }
  function fillCentered(ctx, text2, x, y) {
    const prev = ctx.textAlign;
    ctx.textAlign = "left";
    ctx.fillText(text2, x - textWidth(ctx, text2) / 2, y);
    ctx.textAlign = prev;
  }
  function drawPixelRing(ctx, x, y, size, thickness, cell) {
    ctx.fillStyle = CORAL;
    const gap = Math.max(1, cell * 0.18);
    const drawCell = (cx, cy) => {
      ctx.fillRect(cx, cy, cell - gap, cell - gap);
    };
    for (let ix = x; ix < x + size; ix += cell) {
      for (let iy = y; iy < y + thickness; iy += cell) drawCell(ix, iy);
      for (let iy = y + size - thickness; iy < y + size; iy += cell)
        drawCell(ix, iy);
    }
    for (let iy = y; iy < y + size; iy += cell) {
      for (let ix = x; ix < x + thickness; ix += cell) drawCell(ix, iy);
      for (let ix = x + size - thickness; ix < x + size; ix += cell)
        drawCell(ix, iy);
    }
  }
  function hash(ix, iy) {
    const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
    return n - Math.floor(n);
  }
  function drawCoverFrame(ctx, w, h) {
    ctx.fillStyle = CREAM;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = INK;
    ctx.lineWidth = px(4);
    ctx.strokeRect(px(28), px(28), w - px(56), h - px(56));
  }
  function drawSeriesLabel(ctx, number, series = CONFIG.series) {
    ctx.fillStyle = INK;
    ctx.font = avenir(500, px(28));
    ctx.fillText(`${series}  \xB7  ${number}`, px(64), px(110));
  }
  function drawOutlineBadge(ctx, w, label) {
    ctx.font = avenir(500, px(18));
    const textW = textWidth(ctx, label);
    const padX = px(14);
    const boxW = Math.max(px(118), textW + padX * 2);
    const boxH = px(40);
    const x = w - px(68) - boxW;
    ctx.strokeStyle = INK;
    ctx.lineWidth = px(3);
    ctx.strokeRect(x, px(70), boxW, boxH);
    ctx.fillStyle = INK;
    ctx.fillText(label, x + padX, px(97));
  }
  function roundedRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }
  function fillSpacedText(ctx, text2, x, y, spacing) {
    const chars = [...text2];
    const widths = chars.map((char) => textWidth(ctx, char));
    const total = widths.reduce((sum, width) => sum + width, 0) + spacing * (chars.length - 1);
    let cursor = x - total / 2;
    ctx.textAlign = "left";
    chars.forEach((char, i) => {
      ctx.fillText(char, cursor, y);
      cursor += widths[i] + spacing;
    });
  }
  function drawStamp(ctx, x, y, rotation, label = "IN PROGRESS") {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const w = Math.max(px(420), px(48) + [...label].length * px(28));
    const h = px(112);
    const color = "#FF3621";
    ctx.strokeStyle = color;
    ctx.fillStyle = "rgba(255, 54, 33, 0.07)";
    ctx.lineWidth = px(10);
    roundedRect(ctx, -w / 2, -h / 2, w, h, px(12));
    ctx.fill();
    ctx.stroke();
    ctx.lineWidth = px(3);
    roundedRect(ctx, -w / 2 + px(13), -h / 2 + px(13), w - px(26), h - px(26), px(7));
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = avenir(500, px(34));
    fillSpacedText(ctx, label, 0, px(2), px(6));
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 28; i++) {
      const ix = -w / 2 + px(8) + hash(i, 2) * (w - px(16));
      const iy = -h / 2 + px(6) + hash(i, 9) * (h - px(12));
      ctx.fillRect(ix, iy, px(2.4), px(2.4));
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  function drawCoverTitles(ctx, w, h, lines, author = CONFIG.author) {
    ctx.fillStyle = INK;
    ctx.font = glare(400, px(72));
    lines.forEach((line, i) => {
      ctx.fillText(line, px(64), h - px(220) + i * px(80));
    });
    ctx.font = avenir(500, px(22));
    ctx.fillText(author, px(64), h - px(84));
  }
  function drawFrontierArt(ctx, w) {
    const x = px(150);
    const y = px(190);
    const size = w - px(300);
    const cols = 18;
    const cell = size / cols;
    const palette = ["#F6D5C4", "#F0B8A4", "#E8C4B4", "#FADFD2", "#E7A992", "#F3E6DC"];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < cols; j++) {
        const dx = i - cols / 2;
        const dy = j - cols / 2;
        const falloff = 1 - Math.min(1, Math.hypot(dx, dy) / (cols * 0.62));
        if (falloff <= 0.04) continue;
        ctx.globalAlpha = 0.35 + falloff * 0.65;
        ctx.fillStyle = palette[Math.floor(hash(i, j) * palette.length)];
        ctx.fillRect(x + i * cell, y + j * cell, cell + 0.6, cell + 0.6);
      }
    }
    ctx.globalAlpha = 1;
  }
  function drawTeamsArt(ctx, w) {
    const x = px(150);
    const y = px(190);
    const size = w - px(300);
    const cols = 42;
    const cell = size / cols;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < cols; j++) {
        const nx = i / cols - 0.5;
        const ny = j / cols - 0.5;
        const blob = Math.exp(-(nx * nx * 18 + ny * ny * 22));
        const grain = hash(i, j);
        if (grain > blob * 0.92 + 0.18) continue;
        ctx.fillStyle = blob > 0.45 ? CORAL : grain > 0.55 ? "#C8C2B8" : "#8A8680";
        ctx.fillRect(x + i * cell, y + j * cell, cell * 0.82, cell * 0.82);
      }
    }
  }
  function layoutLines(ctx, text2, maxWidth) {
    const words = String(text2 || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    const pushChunked = (word) => {
      let chunk = "";
      for (const ch of word) {
        const next = chunk + ch;
        if (chunk && textWidth(ctx, next) > maxWidth) {
          lines.push(chunk);
          chunk = ch;
        } else {
          chunk = next;
        }
      }
      line = chunk;
    };
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (textWidth(ctx, test) <= maxWidth) {
        line = test;
        continue;
      }
      if (line) lines.push(line);
      if (textWidth(ctx, word) <= maxWidth) line = word;
      else pushChunked(word);
    }
    if (line) lines.push(line);
    return lines;
  }
  function drawLines(ctx, lines, x, y, lineHeight) {
    const centered = ctx.textAlign === "center";
    lines.forEach((line, i) => {
      if (centered) fillCentered(ctx, line, x, y + i * lineHeight);
      else ctx.fillText(line, x, y + i * lineHeight);
    });
    return y + Math.max(lines.length - 1, 0) * lineHeight;
  }
  function fitFontSize(ctx, text2, maxWidth, maxHeight, fontFn, minSize, maxSize, lineRatio) {
    let size = maxSize;
    let lines = [];
    while (size >= minSize) {
      ctx.font = fontFn(size);
      lines = layoutLines(ctx, text2, maxWidth);
      if (lines.length * size * lineRatio <= maxHeight) break;
      size -= TX;
    }
    return { size, lines, lineHeight: size * lineRatio };
  }
  function drawCover(ctx, w, h, content = CONFIG) {
    const { number, badge, title } = content.cover ?? CONFIG.cover;
    ctx.fillStyle = CREAM;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = INK;
    ctx.lineWidth = px(4);
    ctx.strokeRect(px(28), px(28), w - px(56), h - px(56));
    drawSeriesLabel(ctx, number, content.series);
    ctx.fillStyle = INK;
    ctx.fillRect(w - px(168), px(72), px(92), px(36));
    ctx.fillStyle = CREAM;
    ctx.font = avenir(500, px(20));
    ctx.fillText(badge, w - px(148), px(97));
    const artX = px(150);
    const artY = px(180);
    const artSize = w - px(300);
    const cell = artSize / 26;
    ctx.fillStyle = CORAL;
    for (let i = 0; i < 26; i++) {
      ctx.fillRect(artX + i * cell, artY, cell * 0.82, cell * 0.82);
      ctx.fillRect(artX + i * cell, artY + cell * 2, cell * 0.82, cell * 0.82);
    }
    drawPixelRing(ctx, artX, artY + cell * 4, artSize, cell * 2.2, cell);
    drawPixelRing(
      ctx,
      artX + cell * 4.2,
      artY + cell * 8.2,
      artSize - cell * 8.4,
      cell * 2,
      cell
    );
    drawPixelRing(
      ctx,
      artX + cell * 8.2,
      artY + cell * 12.2,
      artSize - cell * 16.4,
      cell * 1.8,
      cell
    );
    ctx.fillStyle = CORAL_DEEP;
    const core = cell * 3.4;
    ctx.fillRect(
      artX + artSize / 2 - core / 2,
      artY + cell * 4 + artSize / 2 - core / 2,
      core,
      core
    );
    ctx.fillStyle = CORAL;
    for (let i = 0; i < 26; i++) {
      ctx.fillRect(
        artX + i * cell,
        artY + artSize + cell * 2.2,
        cell * 0.82,
        cell * 0.82
      );
      ctx.fillRect(
        artX + i * cell,
        artY + artSize + cell * 4.2,
        cell * 0.82,
        cell * 0.82
      );
    }
    drawCoverTitles(ctx, w, h, title, content.author);
    if (content.cover?.stamp) {
      drawStamp(ctx, w * 0.7, h - px(310), -0.3, content.cover.stamp);
    }
  }
  function drawFrontierCover(ctx, w, h, content = CONFIG) {
    const variant = content.variants?.frontier ?? CONFIG.variants.frontier;
    drawCoverFrame(ctx, w, h);
    drawSeriesLabel(ctx, variant.number, content.series);
    drawOutlineBadge(ctx, w, variant.badge);
    drawFrontierArt(ctx, w);
    drawCoverTitles(ctx, w, h, variant.title ?? [], content.author);
    drawStamp(ctx, w * 0.7, h - px(310), -0.32, variant.stamp ?? "IN PROGRESS");
  }
  function drawTeamsCover(ctx, w, h, content = CONFIG) {
    const variant = content.variants?.teams ?? CONFIG.variants.teams;
    drawCoverFrame(ctx, w, h);
    drawSeriesLabel(ctx, variant.number, content.series);
    drawOutlineBadge(ctx, w, variant.badge);
    drawTeamsArt(ctx, w);
    ctx.fillStyle = INK;
    ctx.font = glare(400, px(64));
    (variant.title ?? []).forEach((line, i) => {
      ctx.fillText(line, px(64), h - px(240) + i * px(80));
    });
    ctx.font = avenir(500, px(22));
    ctx.fillText(content.author, px(64), h - px(84));
    drawStamp(ctx, w * 0.7, h - px(310), -0.28, variant.stamp ?? "UPCOMING");
  }
  function drawHairline(ctx, x, y, width, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = px(2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.stroke();
  }
  function drawIntroPage(ctx, page, x, y, maxW, bottom, ink, content = CONFIG) {
    const text2 = page.body || page.heading || "";
    const cx = x + maxW / 2;
    const measure = maxW * 0.92;
    ctx.save();
    ctx.textAlign = "left";
    ctx.fillStyle = ink;
    if (page?.kicker) {
      ctx.font = avenir(500, px(22));
      fillSpacedText(ctx, page.kicker, cx, y, px(8));
    }
    const fitted = fitFontSize(
      ctx,
      text2,
      measure,
      bottom - y - px(160),
      (size) => glare(400, size),
      px(44),
      px(68),
      1.28
    );
    const blockHeight = fitted.size * 0.92 + Math.max(fitted.lines.length - 1, 0) * fitted.lineHeight;
    const contentTop = y + (page?.kicker ? px(88) : px(12));
    const contentBottom = bottom - px(110);
    const start = contentTop + Math.max(0, (contentBottom - contentTop - blockHeight) * 0.38);
    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.font = glare(400, fitted.size);
    const lastY = drawLines(
      ctx,
      fitted.lines,
      cx,
      start + fitted.size * 0.92,
      fitted.lineHeight
    );
    const ruleY = lastY + px(52);
    ctx.strokeStyle = ink;
    ctx.lineWidth = px(1.5);
    ctx.beginPath();
    ctx.moveTo(cx - px(36), ruleY);
    ctx.lineTo(cx + px(36), ruleY);
    ctx.stroke();
    ctx.fillStyle = ink;
    ctx.font = avenir(500, px(20));
    fillCentered(ctx, content.author ?? CONFIG.author, cx, ruleY + px(44));
    if (page?.slot) {
      ctx.font = avenir(500, px(20));
      fillCentered(ctx, String(page.slot).padStart(2, "0"), cx, bottom + px(32));
    }
    ctx.restore();
  }
  function drawIndexPage(ctx, page, x, y, maxW, bottom, ink) {
    const items = page.items ?? [];
    if (!items.length) return;
    const slot = (bottom - y) / items.length;
    items.forEach((item, i) => {
      const y0 = y + i * slot;
      if (i > 0) drawHairline(ctx, x, y0, maxW, ink);
      ctx.fillStyle = ink;
      ctx.font = avenir(500, px(28));
      ctx.fillText(String(i + 1).padStart(2, "0"), x, y0 + px(48));
      const fitted = fitFontSize(
        ctx,
        item,
        maxW,
        slot - px(84),
        (size) => glare(400, size),
        px(36),
        px(50),
        1.16
      );
      ctx.fillStyle = ink;
      ctx.font = glare(400, fitted.size);
      drawLines(ctx, fitted.lines, x, y0 + px(48) + fitted.size + px(18), fitted.lineHeight);
    });
  }
  function drawSectionsPage(ctx, page, x, y, maxW, bottom, ink) {
    const sections = page.sections ?? [];
    if (!sections.length) return;
    const slot = (bottom - y) / sections.length;
    sections.forEach((section, i) => {
      const y0 = y + i * slot;
      const y1 = y0 + slot - px(16);
      if (i > 0) drawHairline(ctx, x, y0, maxW, ink);
      let cursor = y0 + px(44);
      if (section.number) {
        ctx.fillStyle = ink;
        ctx.font = avenir(500, px(26));
        ctx.fillText(section.number, x, cursor);
        cursor += px(28);
      }
      const heading = fitFontSize(
        ctx,
        section.heading,
        maxW,
        Math.min(px(240), (y1 - cursor) * 0.4),
        (size) => glare(400, size),
        px(32),
        px(46),
        1.16
      );
      ctx.fillStyle = ink;
      ctx.font = glare(400, heading.size);
      const headingBottom = drawLines(
        ctx,
        heading.lines,
        x,
        cursor + heading.size,
        heading.lineHeight
      );
      const bodyTop = headingBottom + px(64);
      const body = fitFontSize(
        ctx,
        section.body,
        maxW,
        Math.max(px(80), y1 - bodyTop),
        (size) => sans(400, size),
        px(24),
        px(34),
        1.42
      );
      ctx.fillStyle = ink;
      ctx.font = sans(400, body.size);
      drawLines(ctx, body.lines, x, bodyTop + body.size * 0.85, body.lineHeight);
    });
  }
  function drawArticlePage(ctx, page, x, y, maxW, bottom, ink) {
    let cursor = y;
    if (page?.heading) {
      const heading = fitFontSize(
        ctx,
        page.heading,
        maxW,
        px(280),
        (size) => glare(400, size),
        px(40),
        px(64),
        1.16
      );
      ctx.fillStyle = ink;
      ctx.font = glare(400, heading.size);
      cursor = drawLines(ctx, heading.lines, x, cursor + heading.size, heading.lineHeight);
      cursor += px(64);
    }
    if (page?.body) {
      const body = fitFontSize(
        ctx,
        page.body,
        maxW,
        Math.max(px(80), bottom - cursor),
        (size) => sans(400, size),
        px(26),
        px(36),
        1.4
      );
      ctx.fillStyle = ink;
      ctx.font = sans(400, body.size);
      drawLines(ctx, body.lines, x, cursor + body.size * 0.85, body.lineHeight);
    }
  }
  function drawPage(ctx, w, h, page, content = CONFIG) {
    const black = Boolean(page?.black);
    const bg = black ? INK : PAGE;
    const ink = black ? CREAM : INK;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = ink;
    ctx.lineWidth = px(3);
    ctx.lineJoin = "miter";
    ctx.setLineDash([]);
    ctx.strokeRect(px(40), px(40), w - px(80), h - px(80));
    const padX = px(88);
    const top = px(118);
    const bottom = h - px(96);
    const maxW = w - padX * 2;
    const layout = page?.layout || "article";
    if (layout === "intro") {
      drawIntroPage(ctx, page, padX, top, maxW, bottom, ink, content);
      return;
    }
    if (page?.kicker) {
      ctx.fillStyle = ink;
      ctx.font = avenir(500, px(26));
      ctx.fillText(page.kicker, padX, top);
    }
    const contentTop = page?.kicker ? top + px(52) : top;
    if (layout === "index") {
      drawIndexPage(ctx, page, padX, contentTop, maxW, bottom, ink);
    } else if (layout === "sections") {
      drawSectionsPage(ctx, page, padX, contentTop, maxW, bottom, ink);
    } else {
      drawArticlePage(ctx, page, padX, contentTop, maxW, bottom, ink);
    }
    if (page?.slot) {
      ctx.fillStyle = ink;
      ctx.font = avenir(500, px(20));
      ctx.textAlign = "right";
      ctx.fillText(String(page.slot).padStart(2, "0"), w - padX, h - px(64));
      ctx.textAlign = "left";
    }
  }
  function drawBlank(ctx, w, h, black) {
    ctx.fillStyle = black ? INK : PAGE;
    ctx.fillRect(0, 0, w, h);
  }
  function drawBackCover(ctx, w, h, content = CONFIG) {
    ctx.fillStyle = CREAM;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = INK;
    ctx.lineWidth = px(4);
    ctx.strokeRect(px(28), px(28), w - px(56), h - px(56));
    const back = content.back ?? CONFIG.back;
    ctx.fillStyle = INK;
    ctx.font = glare(400, px(40));
    fillCentered(ctx, back.title ?? "", w / 2, h / 2 - px(12));
    ctx.font = avenir(500, px(20));
    fillCentered(ctx, back.credit ?? "", w / 2, h / 2 + px(36));
  }
  function drawSide(ctx, w, h, side, content) {
    if (!side) return;
    if (side.kind === "page") {
      drawPage(ctx, w, h, side, content);
      return;
    }
    if (side.kind === "blank") {
      drawBlank(ctx, w, h, side.black);
      return;
    }
    makeDrawings(content)[side.kind]?.(ctx, w, h);
  }
  function makeDrawings(content) {
    return {
      cover: (ctx, w, h) => drawCover(ctx, w, h, content),
      "cover-frontier": (ctx, w, h) => drawFrontierCover(ctx, w, h, content),
      "cover-teams": (ctx, w, h) => drawTeamsCover(ctx, w, h, content),
      backcover: (ctx, w, h) => drawBackCover(ctx, w, h, content)
    };
  }
  var canvasCache = /* @__PURE__ */ new Map();
  var painted = /* @__PURE__ */ new Set();
  var fontWatch = false;
  function paint(canvas, side, content) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = PAGE;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawSide(ctx, canvas.width, canvas.height, side, content);
  }
  function watchFonts() {
    if (fontWatch || typeof document === "undefined" || !document.fonts) return;
    fontWatch = true;
    document.fonts.ready.then(() => {
      painted.forEach((entry) => {
        paint(entry.canvas, entry.side, entry.content);
        entry.texture.needsUpdate = true;
      });
    });
  }
  function createPageTexture(side, content = CONFIG) {
    const key = JSON.stringify({
      side,
      series: content.series,
      author: content.author,
      cover: content.cover,
      back: content.back,
      variants: content.variants
    });
    let canvas = canvasCache.get(key);
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.width = px(1024);
      canvas.height = px(1370);
      paint(canvas, side, content);
      canvasCache.set(key, canvas);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 16;
    texture.needsUpdate = true;
    painted.add({ texture, canvas, side, content });
    watchFonts();
    return texture;
  }

  // src/components/Book3D/createBook.js
  var easingFactor = 0.5;
  var PAGE_CLOSED_Y = Math.PI / 2;
  var PAGE_WIDTH = 1.28;
  var PAGE_HEIGHT = 1.71;
  var PAGE_DEPTH = 0.01;
  var PAGE_SEGMENTS = 30;
  var SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;
  var pageGeometry = new BoxGeometry(
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_DEPTH,
    PAGE_SEGMENTS,
    2
  );
  pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);
  var position = pageGeometry.attributes.position;
  var vertex = new Vector3();
  var skinIndexes = [];
  var skinWeights = [];
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    const x = vertex.x;
    const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
    const skinWeight = x % SEGMENT_WIDTH / SEGMENT_WIDTH;
    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
  }
  pageGeometry.setAttribute(
    "skinIndex",
    new Uint16BufferAttribute(skinIndexes, 4)
  );
  pageGeometry.setAttribute(
    "skinWeight",
    new Float32BufferAttribute(skinWeights, 4)
  );
  var paperColor = new Color("#ffffff");
  var emissiveColor = new Color("#FF3621");
  var mattePaper = {
    roughness: 0.72,
    metalness: 0,
    envMapIntensity: 0
  };
  function createEdgeMaterials() {
    return [
      new MeshStandardMaterial({ color: "#EFE9E1", ...mattePaper }),
      new MeshStandardMaterial({ color: "#1A1A1A", ...mattePaper, roughness: 0.88 }),
      new MeshStandardMaterial({ color: "#EFE9E1", ...mattePaper }),
      new MeshStandardMaterial({ color: "#E8E1D8", ...mattePaper })
    ];
  }
  function shortestAngle(from, to) {
    let delta = to - from;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    return delta;
  }
  function dampAngle(object, key, target, smoothTime, dt) {
    const current = object[key];
    const delta = shortestAngle(current, target);
    object[key] = current + delta * (1 - Math.exp(-1 / smoothTime * dt));
  }
  function degToRad(deg) {
    return deg * Math.PI / 180;
  }
  function pageSide(page, index) {
    return {
      kind: "page",
      layout: page.layout ?? "article",
      kicker: page.kicker ?? "",
      heading: page.heading ?? "",
      body: page.body ?? "",
      items: page.items ?? [],
      sections: page.sections ?? [],
      black: Boolean(page.black),
      slot: index + 1
    };
  }
  function sheetsFromPages(content, coverKind) {
    const pages = content.pages ?? [];
    const sheets = [
      {
        front: { kind: coverKind },
        back: pages[0] ? pageSide(pages[0], 0) : { kind: "backcover" }
      }
    ];
    for (let i = 1; i < pages.length; i += 2) {
      sheets.push({
        front: pageSide(pages[i], i),
        back: pages[i + 1] ? pageSide(pages[i + 1], i + 1) : { kind: "backcover" }
      });
    }
    return sheets;
  }
  function createSkinnedPage(number, front, back, pageCount, edgeMaterials, content) {
    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone();
      bones.push(bone);
      bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;
      if (i > 0) bones[i - 1].add(bone);
    }
    const skeleton = new Skeleton(bones);
    const picture = createPageTexture(front, content);
    const picture2 = createPageTexture(back, content);
    const isCover = number === 0 || number === pageCount - 1;
    const roughness = isCover ? 0.32 : 0.68;
    const materials = [
      ...edgeMaterials,
      new MeshPhysicalMaterial({
        color: paperColor,
        map: picture,
        roughness,
        metalness: 0,
        clearcoat: isCover ? 0.24 : 0.06,
        clearcoatRoughness: isCover ? 0.78 : 0.9,
        envMapIntensity: 0,
        emissive: emissiveColor,
        emissiveIntensity: 0
      }),
      new MeshPhysicalMaterial({
        color: paperColor,
        map: picture2,
        roughness,
        metalness: 0,
        clearcoat: isCover ? 0.24 : 0.06,
        clearcoatRoughness: isCover ? 0.78 : 0.9,
        envMapIntensity: 0,
        emissive: emissiveColor,
        emissiveIntensity: 0
      })
    ];
    const mesh = new SkinnedMesh(pageGeometry.clone(), materials);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    mesh.userData.pageIndex = number;
    return mesh;
  }
  var PageSheet = class {
    constructor(number, front, back, pageCount, edgeMaterials, content) {
      this.number = number;
      this.opened = false;
      this.highlighted = false;
      this.group = new Group();
      this.group.rotation.y = Math.PI / 2;
      this.mesh = createSkinnedPage(
        number,
        front,
        back,
        pageCount,
        edgeMaterials,
        content
      );
      this.group.add(this.mesh);
      this.openY = -((content.openAngle ?? 50) * Math.PI) / 180;
    }
    setState({ opened, page, bookClosed }) {
      this.opened = opened;
      this.bookClosed = bookClosed;
      this.mesh.position.z = -this.number * PAGE_DEPTH + page * PAGE_DEPTH;
    }
    update(delta) {
      const emissiveIntensity = this.highlighted ? 0.42 : 0;
      this.mesh.material[4].emissiveIntensity = this.mesh.material[5].emissiveIntensity = MathUtils.lerp(
        this.mesh.material[4].emissiveIntensity,
        emissiveIntensity,
        0.22
      );
      let targetRotation = this.opened ? this.openY : PAGE_CLOSED_Y;
      if (!this.bookClosed) {
        targetRotation += degToRad(this.number * 0.8);
      }
      const bones = this.mesh.skeleton.bones;
      for (let i = 0; i < bones.length; i++) {
        const target = i === 0 ? this.group : bones[i];
        dampAngle(target.rotation, "y", i === 0 ? targetRotation : 0, easingFactor, delta);
        dampAngle(target.rotation, "x", 0, easingFactor, delta);
      }
    }
  };
  function createBook(cover = "cover", content = CONFIG) {
    const pageList = sheetsFromPages(content, cover);
    const edgeMaterials = createEdgeMaterials();
    const group = new Group();
    group.rotation.y = -Math.PI / 2;
    group.position.x = -PAGE_WIDTH / 2;
    const sheets = pageList.map(
      (pageData, index) => new PageSheet(
        index,
        pageData.front,
        pageData.back,
        pageList.length,
        edgeMaterials,
        content
      )
    );
    sheets.forEach((sheet) => group.add(sheet.group));
    let page = 0;
    let delayedPage = 0;
    let timeout = null;
    const applyPage = (value) => {
      delayedPage = value;
      const bookClosed = delayedPage === 0 || delayedPage === pageList.length;
      sheets.forEach((sheet, index) => {
        sheet.setState({
          opened: delayedPage > index,
          page: delayedPage,
          bookClosed
        });
      });
    };
    applyPage(0);
    const stepToward = () => {
      if (page === delayedPage) return;
      timeout = setTimeout(
        () => {
          if (page > delayedPage) applyPage(delayedPage + 1);
          else if (page < delayedPage) applyPage(delayedPage - 1);
          stepToward();
        },
        Math.abs(page - delayedPage) > 2 ? 50 : 150
      );
    };
    return {
      group,
      meshes: sheets.map((sheet) => sheet.mesh),
      sheets,
      setPage(next) {
        page = Math.max(0, Math.min(pageList.length, next));
        clearTimeout(timeout);
        stepToward();
      },
      highlight(index) {
        sheets.forEach((sheet, i) => {
          sheet.highlighted = i === index;
        });
      },
      update(delta) {
        const targetX = delayedPage === 0 ? -PAGE_WIDTH / 2 : delayedPage === pageList.length ? PAGE_WIDTH / 2 : 0;
        group.position.x += (targetX - group.position.x) * (1 - Math.exp(-3.4 * delta));
        sheets.forEach((sheet) => sheet.update(delta));
      },
      dispose() {
        clearTimeout(timeout);
      }
    };
  }

  // src/components/Book3D/content.js
  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }
  function clone(value) {
    if (Array.isArray(value)) return value.map(clone);
    if (isObject(value)) {
      const out = {};
      Object.keys(value).forEach((key) => {
        out[key] = clone(value[key]);
      });
      return out;
    }
    return value;
  }
  function isEmpty(value) {
    if (value === void 0 || value === null) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    if (isObject(value)) return Object.keys(value).every((key) => isEmpty(value[key]));
    return false;
  }
  function merge(base, patch) {
    if (!isObject(patch)) return isEmpty(patch) ? clone(base) : clone(patch);
    const out = isObject(base) ? clone(base) : {};
    Object.keys(patch).forEach((key) => {
      const value = patch[key];
      if (isEmpty(value)) return;
      out[key] = isObject(value) ? merge(out[key], value) : clone(value);
    });
    return out;
  }
  function toLines(value) {
    if (Array.isArray(value)) return value.map((line) => String(line).trim()).filter(Boolean);
    return String(value ?? "").split(/\r?\n|\|/).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
  }
  function normalize(override) {
    if (!isObject(override)) return null;
    const out = clone(override);
    if (out.cover?.title) out.cover.title = toLines(out.cover.title);
    if (isObject(out.variants)) {
      Object.keys(out.variants).forEach((key) => {
        const variant = out.variants[key];
        if (variant?.title) variant.title = toLines(variant.title);
      });
    }
    return out;
  }
  function resolveBookContent(override, variant = "harness") {
    const base = clone(CONFIG);
    base.variants = base.variants || {};
    const variantPages = base.variants[variant]?.pages;
    if (variantPages?.length) base.pages = variantPages;
    const patch = normalize(override);
    if (!patch) return base;
    const content = merge(base, patch);
    content.variants = content.variants || {};
    if (variant !== "harness" && isObject(patch.cover)) {
      content.variants[variant] = merge(content.variants[variant], patch.cover);
    }
    if (patch.pages?.length) {
      if (content.variants[variant]) delete content.variants[variant].pages;
    }
    return content;
  }

  // webflow/book-content.js
  var ATTRS = [
    ["data-book-series", ["series"]],
    ["data-book-author", ["author"]],
    ["data-book-number", ["cover", "number"]],
    ["data-book-badge", ["cover", "badge"]],
    ["data-book-stamp", ["cover", "stamp"]],
    ["data-book-title", ["cover", "title"]],
    ["data-book-back-title", ["back", "title"]],
    ["data-book-back-credit", ["back", "credit"]]
  ];
  var LAYOUTS = ["intro", "index", "sections", "article"];
  function text(el) {
    return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function textLines(el) {
    if (!el) return [];
    const blocks = Array.from(el.children).filter((child) => text(child));
    if (blocks.length) return blocks.map(text);
    return el.textContent.split(/\r?\n|\|/).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
  }
  function put(target, path, value) {
    if (value === "" || value === void 0 || value === null) return;
    let node = target;
    for (let i = 0; i < path.length - 1; i++) {
      node[path[i]] = node[path[i]] || {};
      node = node[path[i]];
    }
    node[path[path.length - 1]] = value;
  }
  function ownedBy(page, el, selector) {
    return el.closest(selector) === page;
  }
  function readSection(el) {
    return {
      number: text(el.querySelector("[data-book-section-number]")),
      heading: text(el.querySelector("[data-book-section-heading]")),
      body: text(el.querySelector("[data-book-section-body]"))
    };
  }
  function readPage(el) {
    const items = Array.from(el.querySelectorAll("[data-book-item]")).filter((node) => ownedBy(el, node, "[data-book-page]")).map(text).filter(Boolean);
    const sections = Array.from(el.querySelectorAll("[data-book-section]")).filter((node) => ownedBy(el, node, "[data-book-page]")).map(readSection).filter((section) => section.heading || section.body);
    const declared = (el.getAttribute("data-book-page") || el.getAttribute("data-book-layout") || "").trim().toLowerCase();
    const layout = LAYOUTS.includes(declared) ? declared : sections.length ? "sections" : items.length ? "index" : "article";
    const page = { layout };
    const kicker = text(el.querySelector("[data-book-kicker]"));
    const heading = text(el.querySelector("[data-book-heading]"));
    const body = text(el.querySelector("[data-book-body]"));
    if (kicker) page.kicker = kicker;
    if (heading) page.heading = heading;
    if (body) page.body = body;
    if (items.length) page.items = items;
    if (sections.length) page.sections = sections;
    if (el.hasAttribute("data-book-black")) {
      page.black = el.getAttribute("data-book-black") !== "false";
    }
    return page;
  }
  function readBlock(root) {
    if (!root) return null;
    const pick = (selector) => text(root.querySelector(selector));
    const content = {};
    put(content, ["series"], pick("[data-book-series]"));
    put(content, ["author"], pick("[data-book-author]"));
    put(content, ["cover", "number"], pick("[data-book-cover-number]"));
    put(content, ["cover", "badge"], pick("[data-book-cover-badge]"));
    put(content, ["cover", "stamp"], pick("[data-book-cover-stamp]"));
    put(content, ["back", "title"], pick("[data-book-back-title]"));
    put(content, ["back", "credit"], pick("[data-book-back-credit]"));
    const title = textLines(root.querySelector("[data-book-cover-title]"));
    if (title.length) put(content, ["cover", "title"], title);
    const pages = Array.from(root.querySelectorAll("[data-book-page]")).filter((el) => !el.parentElement?.closest("[data-book-page]")).map(readPage);
    if (pages.length) content.pages = pages;
    return content;
  }
  function readJson(root) {
    const script = root?.matches?.("[data-book-json]") ? root : root?.querySelector?.("[data-book-json]");
    if (!script) return null;
    try {
      return JSON.parse(script.textContent);
    } catch (error) {
      console.warn("[book] data-book-json is not valid JSON", error);
      return null;
    }
  }
  function readAttrs(canvas) {
    const content = {};
    ATTRS.forEach(([attr, path]) => {
      const value = (canvas.getAttribute(attr) || "").trim();
      if (!value) return;
      put(content, path, value);
    });
    return content;
  }
  function findBlock(canvas, wrap, variant) {
    const selector = canvas.getAttribute("data-book-content");
    if (selector) {
      const target = document.querySelector(selector);
      if (target) return target;
      console.warn(`[book] no element matches data-book-content="${selector}"`);
    }
    const forVariant = (nodes) => nodes.find((node) => (node.getAttribute("data-book-for") || "") === variant) || nodes.find((node) => !node.getAttribute("data-book-for")) || null;
    const inWrap = wrap.querySelector("[data-book-content]");
    if (inWrap) return inWrap;
    const scope = canvas.closest("[data-library-card]") || canvas.closest("[data-featured-scope]") || canvas.closest("[data-featured-stage]") || canvas.closest("section");
    if (scope) {
      const found = forVariant(Array.from(scope.querySelectorAll("[data-book-content]")));
      if (found) return found;
    }
    const all = Array.from(document.querySelectorAll("[data-book-content]"));
    if (!all.length) return null;
    const tagged = all.find((node) => (node.getAttribute("data-book-for") || "") === variant);
    if (tagged) return tagged;
    return document.querySelectorAll("[data-book]").length === 1 ? all[0] : null;
  }
  function globalContent(variant) {
    const global = window.site?.bookContent;
    if (!global || typeof global !== "object") return null;
    const scoped = global[variant];
    if (scoped && typeof scoped === "object") return { ...global, ...scoped };
    return global;
  }
  function stack(...sources) {
    const out = {};
    sources.filter(Boolean).forEach((source) => {
      Object.keys(source).forEach((key) => {
        const value = source[key];
        if (value === void 0) return;
        if (value && typeof value === "object" && !Array.isArray(value)) {
          out[key] = { ...out[key] || {}, ...value };
        } else {
          out[key] = value;
        }
      });
    });
    return out;
  }
  function readBookContent(canvas, wrap, variant = "harness") {
    const block = findBlock(canvas, wrap, variant);
    if (block && !block.hasAttribute("data-book-content-visible")) {
      block.style.display = "none";
    }
    return stack(
      globalContent(variant),
      readBlock(block),
      readJson(block) || readJson(document),
      readAttrs(canvas)
    );
  }

  // webflow/book-entry.js
  var COVERS = {
    harness: "cover",
    frontier: "cover-frontier",
    teams: "cover-teams"
  };
  var TILT_PITCH = 18;
  var TILT_YAW = 24;
  var TILT_ROLL = 10;
  var TILT_FOLLOW = 7;
  var TILT_RETURN = 4.5;
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }
  function parseRest(value) {
    const parts = String(value || "0,0,0").split(",").map((n) => Number(n.trim()));
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  }
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
  function mountBook(canvas) {
    const wrap = canvas.closest("[data-featured-book], [data-library-book], [data-book-wrap]") || canvas.parentElement;
    if (!wrap) return null;
    const variant = canvas.getAttribute("data-book-variant") || "harness";
    const interactive = canvas.getAttribute("data-book-interactive") !== "false";
    const cameraDistance = Number(canvas.getAttribute("data-book-distance") || 4.2);
    const tiltStrength = Number(canvas.getAttribute("data-book-tilt") || 0.45);
    const [restX, restY, restZ] = parseRest(canvas.getAttribute("data-book-rest") || "0,-0.42,0");
    const cover = COVERS[variant] ?? "cover";
    const hint = wrap.querySelector("[data-book-hint]");
    wrap.style.pointerEvents = "auto";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "auto";
    const embed = canvas.parentElement;
    if (embed && embed !== wrap) {
      embed.style.display = "block";
      embed.style.width = "100%";
      embed.style.height = "100%";
      embed.style.pointerEvents = "auto";
    }
    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(
      Math.min(Math.max(window.devicePixelRatio || 1, 1.5), interactive ? 2.5 : 2)
    );
    renderer.shadowMap.enabled = interactive;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.42;
    renderer.setClearColor(0, 0);
    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.set(0, 0, cameraDistance);
    camera.lookAt(0, 0, 0);
    scene.add(new AmbientLight(16774892, 0.82));
    scene.add(new HemisphereLight(16775410, 12891812, 0.95));
    const key = new DirectionalLight(16775410, interactive ? 1.45 : 1.62);
    key.position.set(2.6, 3.8, 3.4);
    key.castShadow = interactive;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 8;
    key.shadow.bias = -15e-4;
    key.shadow.normalBias = 0.035;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 14;
    key.shadow.camera.left = -3.2;
    key.shadow.camera.right = 3.2;
    key.shadow.camera.top = 3.2;
    key.shadow.camera.bottom = -3.2;
    const shadowIntensity = 0.12;
    const hasShadowIntensity = typeof key.shadow.intensity === "number";
    if (hasShadowIntensity) key.shadow.intensity = shadowIntensity;
    scene.add(key);
    const fill = new DirectionalLight(16774376, 0.78);
    fill.position.set(-3.4, 1.6, 2.6);
    scene.add(fill);
    const bounce = new DirectionalLight(16775410, 0.58);
    bounce.position.set(-1.1, 2.4, 3.2);
    scene.add(bounce);
    const rim = new DirectionalLight(15722977, 0.58);
    rim.position.set(-1.4, 2.6, -3.6);
    scene.add(rim);
    let content = resolveBookContent(readBookContent(canvas, wrap, variant), variant);
    let book = createBook(cover, content);
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const dressBook = () => {
      book.meshes.forEach((mesh) => {
        mesh.castShadow = interactive;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          if (mat.map) mat.map.anisotropy = maxAniso;
        });
      });
    };
    const disposeBook = (target) => {
      target.dispose();
      target.meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          mat.map?.dispose();
          mat.dispose();
        });
      });
    };
    dressBook();
    const tiltGroup = new Group();
    const pivot = new Group();
    pivot.rotation.set(restX, restY, restZ);
    pivot.add(book.group);
    tiltGroup.add(pivot);
    scene.add(tiltGroup);
    const ground = new Mesh(
      new PlaneGeometry(8, 8),
      new ShadowMaterial({
        opacity: hasShadowIntensity ? 0.1 : 0.1 * shadowIntensity,
        transparent: true
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.92;
    ground.receiveShadow = true;
    scene.add(ground);
    const raycaster = new Raycaster();
    const pointer = new Vector2();
    const clock = new Clock();
    const tilt = { x: 0, y: 0 };
    let frame = 0;
    let running = true;
    const setPointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const pickPage = () => {
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(book.meshes, false);
      if (!hits.length) return null;
      return hits[0].object.userData.pageIndex;
    };
    const hintTarget = { x: 0, y: 0 };
    const hintPos = { x: 0, y: 0 };
    let hintShow = false;
    let hintVis = 0;
    const applyHint = () => {
      if (!hint) return;
      const scale = 0.82 + 0.18 * hintVis;
      hint.style.opacity = String(hintVis);
      hint.style.transform = `translate3d(${hintPos.x}px, ${hintPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
    };
    const onMove = (event) => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width && rect.height) {
        tilt.x = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
        tilt.y = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
      }
      if (!interactive) return;
      setPointer(event);
      const index = pickPage();
      wrap.style.cursor = index !== null ? "pointer" : "default";
      canvas.style.cursor = index !== null ? "pointer" : "default";
      book.highlight(index);
      hintShow = Boolean(hint) && index !== null && !book.sheets[0].opened;
      if (hintShow) {
        hintTarget.x = event.clientX - rect.left;
        hintTarget.y = event.clientY - rect.top;
        if (hintVis < 0.02) {
          hintPos.x = hintTarget.x;
          hintPos.y = hintTarget.y;
        }
      }
    };
    const onClick = (event) => {
      if (!interactive) return;
      setPointer(event);
      const index = pickPage();
      if (index === null) {
        book.setPage(0);
        book.highlight(null);
        return;
      }
      const opened = book.sheets[index].opened;
      book.setPage(opened ? index : index + 1);
      book.highlight(null);
      hintShow = false;
    };
    const onLeave = () => {
      tilt.x = 0;
      tilt.y = 0;
      wrap.style.cursor = "default";
      canvas.style.cursor = "default";
      book.highlight(null);
      hintShow = false;
    };
    const resize = () => {
      const width = canvas.clientWidth || wrap.clientWidth;
      const height = canvas.clientHeight || wrap.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const tick = () => {
      if (!running) return;
      const delta = Math.min(clock.getDelta(), 1 / 30);
      book.update(delta);
      if (hint) {
        const followHint = 1 - Math.exp(-12 * delta);
        const openHint = 1 - Math.exp(-9 * delta);
        hintVis += ((hintShow ? 1 : 0) - hintVis) * openHint;
        hintPos.x += (hintTarget.x - hintPos.x) * followHint;
        hintPos.y += (hintTarget.y - hintPos.y) * followHint;
        applyHint();
      }
      const idle = Math.abs(tilt.x) < 1e-3 && Math.abs(tilt.y) < 1e-3;
      const follow = delta * (idle ? TILT_RETURN : TILT_FOLLOW);
      const targetX = -tilt.y * MathUtils.degToRad(TILT_PITCH * tiltStrength);
      const targetY = tilt.x * MathUtils.degToRad(TILT_YAW * tiltStrength);
      const targetZ = -tilt.x * MathUtils.degToRad(TILT_ROLL * tiltStrength);
      tiltGroup.rotation.x += (targetX - tiltGroup.rotation.x) * follow;
      tiltGroup.rotation.y += (targetY - tiltGroup.rotation.y) * follow;
      tiltGroup.rotation.z += (targetZ - tiltGroup.rotation.z) * follow;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    resize();
    tick();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    observer.observe(canvas);
    const vis = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        if (visible && !running) {
          running = true;
          clock.getDelta();
          tick();
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { rootMargin: "20% 0px", threshold: 0 }
    );
    vis.observe(wrap.parentElement ?? wrap);
    wrap.closest("[data-featured-stage]")?.querySelectorAll("[data-featured-overlay], [data-featured-strips]").forEach((el) => {
      el.style.pointerEvents = "none";
    });
    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);
    const api = {
      canvas,
      get pageCount() {
        return book.sheets.length;
      },
      get content() {
        return content;
      },
      // Swap the copy at runtime: window.site.books.get(canvas).setContent({...})
      setContent(next) {
        content = resolveBookContent(next, variant);
        const page = book.sheets.findIndex((sheet) => !sheet.opened);
        const previous = book;
        pivot.remove(previous.group);
        book = createBook(cover, content);
        pivot.add(book.group);
        dressBook();
        disposeBook(previous);
        if (page > 0) book.setPage(Math.min(page, book.sheets.length));
        return api;
      },
      open(page = 1) {
        book.setPage(Math.max(1, Math.min(book.sheets.length, page)));
      },
      close() {
        book.setPage(0);
      },
      setPage(page) {
        book.setPage(page);
      },
      dispose() {
        running = false;
        cancelAnimationFrame(frame);
        observer.disconnect();
        vis.disconnect();
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", onLeave);
        canvas.removeEventListener("click", onClick);
        disposeBook(book);
        ground.geometry.dispose();
        ground.material.dispose();
        renderer.dispose();
        wrap.style.cursor = "default";
      }
    };
    canvas.dispatchEvent(new CustomEvent("book:ready", { detail: api, bubbles: true }));
    return api;
  }
  function init() {
    if (typeof window.THREE === "undefined") {
      console.warn("[book] Three.js is not loaded");
      return;
    }
    window.site = window.site || {};
    window.site.books = window.site.books || /* @__PURE__ */ new Map();
    document.querySelectorAll("[data-book]").forEach((canvas) => {
      if (window.site.books.has(canvas)) return;
      const api = mountBook(canvas);
      if (api) window.site.books.set(canvas, api);
    });
  }
  onReady(init);
})();
