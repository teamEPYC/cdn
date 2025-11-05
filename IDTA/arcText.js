(() => {
  // ---------- Constants ----------
  const SVG_NS = "http://www.w3.org/2000/svg";

  // Map data-text-align to <textPath startOffset> and <text text-anchor>
  const TEXT_ALIGN = {
    start: { startOffset: "0%", anchor: "start" },
    center: { startOffset: "50%", anchor: "middle" },
    end: { startOffset: "100%", anchor: "end" },
  };

  // ---------- Utilities ----------
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const normAngle = (deg) => ((deg % 360) + 360) % 360; // normalize into [0, 360)

  function buildArcPath(cx, cy, r, startDeg, endDeg, reversed = false) {
    // Ensure we draw a partial arc; SVG can't do a 360° sweep in one go
    // Calculate sweep from original direction
    const sweepDeg = (endDeg - startDeg + 360) % 360 || 359.999;

    let actualStart, actualEnd, sweepFlag;

    if (reversed) {
      // Reverse direction: start at endDeg, go backwards
      actualStart = endDeg;
      actualEnd = startDeg;
      sweepFlag = 0; // counter-clockwise (reversed)
    } else {
      actualStart = startDeg;
      actualEnd = endDeg;
      sweepFlag = 1; // clockwise
    }

    const largeArcFlag = sweepDeg > 180 ? 1 : 0;

    const a1 = toRadians(actualStart);
    const a2 = toRadians(actualEnd);

    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);

    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;
  }

  function createSvgEl(name) {
    return document.createElementNS(SVG_NS, name);
  }

  // ---------- Render ----------
  function renderArc(el) {
    // --- Size & geometry ---
    const width = Math.max(1, el.clientWidth);
    const height = Math.max(1, el.clientHeight);
    const cx = width / 2;
    const cy = height / 2;
    const rOuter = Math.min(cx, cy) - 1; // leave 1px padding

    // --- Inputs from data-attributes ---
    const startRaw = Number(el.dataset.start);
    const endRaw = Number(el.dataset.end);
    const text = el.dataset.text ?? "";
    const strokeW = Number(el.dataset.strokeWidth) || 0;

    const startDeg = Number.isFinite(startRaw) ? normAngle(startRaw) : 220;
    let endDeg = Number.isFinite(endRaw) ? normAngle(endRaw) : 360;
    if (endDeg === startDeg) endDeg = (endDeg + 359.999) % 360; // avoid full circle

    // --- Check for flip before alignment (flip affects alignment mapping) ---
    const flip = el.getAttribute("data-flip") === "true";

    // Reverse alignment when flipped: start <-> end, center stays center
    let alignKey = (el.dataset.textAlign || "start").toLowerCase();
    if (flip) {
      if (alignKey === "start") alignKey = "end";
      else if (alignKey === "end") alignKey = "start";
    }
    const { startOffset, anchor } = TEXT_ALIGN[alignKey] || TEXT_ALIGN.start;

    // --- Create or reuse SVG structure ---
    let svg = el.querySelector("svg[data-arc-el]");
    let strokePath, textGuidePath, textEl, textPath;

    if (!svg) {
      // Clear any existing content (so inner text doesn't double-render)
      el.innerHTML = "";

      svg = createSvgEl("svg");
      svg.setAttribute("data-arc-el", "");
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.width = "100%";
      svg.style.height = "100%";

      // Visible arc path (styled via CSS; color from .arc-stroke)
      strokePath = createSvgEl("path");
      strokePath.setAttribute("class", "arc-stroke");
      strokePath.setAttribute("fill", "none");
      strokePath.setAttribute("stroke-linecap", "round");
      svg.appendChild(strokePath);

      // Invisible guide path for text
      const guideId = `arc-guide-${Math.random().toString(36).slice(2)}`;
      textGuidePath = createSvgEl("path");
      textGuidePath.setAttribute("id", guideId);
      textGuidePath.setAttribute("class", "arc-textpath");
      textGuidePath.setAttribute("fill", "none");
      textGuidePath.setAttribute("stroke", "none");
      svg.appendChild(textGuidePath);

      // Text + textPath following the guide
      textEl = createSvgEl("text");
      textEl.setAttribute("xml:space", "preserve"); // keep multiple spaces
      textEl.setAttribute("text-anchor", anchor);

      textPath = createSvgEl("textPath");
      textPath.setAttribute("xml:space", "preserve");
      textPath.setAttribute("href", `#${guideId}`);
      textPath.setAttribute("startOffset", startOffset);
      textEl.appendChild(textPath);

      svg.appendChild(textEl);
      el.appendChild(svg);
    } else {
      strokePath = svg.querySelector(".arc-stroke");
      textGuidePath = svg.querySelector(".arc-textpath");
      textEl = svg.querySelector("text");
      textPath = svg.querySelector("textPath");

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      textEl.setAttribute("text-anchor", anchor);
      textPath.setAttribute("startOffset", startOffset);
    }

    // --- Inset for the text path (CSS var -> font-size fallback) ---
    const cs = getComputedStyle(el);
    const cssInset = parseFloat(cs.getPropertyValue("--text-inset"));
    const textFontSize = parseFloat(getComputedStyle(textEl).fontSize) || 12;
    const inset = Number.isFinite(cssInset) ? cssInset : textFontSize;

    // --- Apply geometry & content ---
    strokePath.setAttribute("stroke-width", String(strokeW));
    strokePath.setAttribute(
      "d",
      buildArcPath(cx, cy, rOuter, startDeg, endDeg, false)
    );

    // --- Illustrator-style flip: invert normal offset + reverse path direction ---
    // When flipped: text moves to opposite side (rOuter + inset instead of rOuter - inset)
    // and path direction reverses so characters stay upright
    const rText = flip
      ? Math.max(1, rOuter + inset) // Invert: move to opposite side
      : Math.max(1, rOuter - inset + 20); // Normal: inside the arc

    textGuidePath.setAttribute(
      "d",
      buildArcPath(cx, cy, rText, startDeg, endDeg, flip)
    );

    // Remove any transform styles (flip is handled geometrically)
    textEl.style.transform = "";

    textPath.textContent = text;
  }

  // ---------- Init ----------
  function init() {
    const els = document.querySelectorAll('[data-arc="true"]');
    els.forEach((el) => {
      renderArc(el);
      // Responsive re-render
      new ResizeObserver(() => renderArc(el)).observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
