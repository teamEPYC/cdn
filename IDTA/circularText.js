const el = document.querySelector('.i-hero-right-circular-text');
if (el) {
  el.setAttribute('data-count', window.innerWidth > 992 ? 65 : 40);
}

(() => {
  const NS  = "http://www.w3.org/2000/svg";
  const TAU = Math.PI * 2;

  const arc = (cx, cy, r, a1, a2) => {
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const laf = (Math.abs(a2 - a1) % TAU) > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${laf} 1 ${x2} ${y2}`;
  };

  function initCircularText(el) {
    if (!el) return;

    let text  = (el.dataset.text || "WORD").trim();
    let count = Math.max(1, parseInt(el.dataset.count || "4", 10));

    const svg  = document.createElementNS(NS, "svg");
    const defs = document.createElementNS(NS, "defs");
    const g    = document.createElementNS(NS, "g");
    svg.append(defs, g);
    el.textContent = "";
    el.appendChild(svg);

    // Hidden measurer for text width
    const measurer = document.createElementNS(NS, "text");
    measurer.setAttribute("visibility", "hidden");
    measurer.setAttribute("dominant-baseline", "middle");
    measurer.setAttribute("text-anchor", "middle");
    svg.appendChild(measurer);

    const ro = new ResizeObserver(render);
    ro.observe(el);

    const measure = (s) => {
      measurer.textContent = s;
      return measurer.getComputedTextLength() || 1;
    };

    function render() {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      const cx = w / 2, cy = h / 2;
      const fontSize = parseFloat(getComputedStyle(el).fontSize) || 16;
      const r = Math.max(0, Math.min(cx, cy) - fontSize * 1);

      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

      defs.innerHTML = "";
      g.innerHTML = "";

      const wordWidth = Math.max(1, measure(text));
      const pad = Math.max(1, fontSize * 0.1);
      const arcLen = wordWidth + pad;
      const span = Math.min(TAU - 1e-3, arcLen / Math.max(1, r));

      for (let i = 0; i < count; i++) {
        const theta = (i / count) * TAU;
        const a1 = theta - span / 2;
        const a2 = theta + span / 2;

        const seg = document.createElementNS(NS, "path");
        const id = `cw-seg-${Math.random().toString(36).slice(2)}`;
        seg.setAttribute("id", id);
        seg.setAttribute("d", arc(cx, cy, r, a1, a2));
        defs.appendChild(seg);

        const t = document.createElementNS(NS, "text");
        const tp = document.createElementNS(NS, "textPath");
        tp.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${id}`);
        tp.setAttribute("startOffset", "50%");
        tp.textContent = text;
        t.appendChild(tp);
        g.appendChild(t);
      }
    }

    render();

    return {
      update({ text: t, count: c } = {}) {
        if (t != null) text = String(t).trim();
        if (c != null) count = Math.max(1, parseInt(c, 10));
        render();
      },
      destroy() { ro.disconnect(); el.innerHTML = ""; },
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('[data-circular-text="true"]').forEach(initCircularText);
  });

  window.initCircularText = initCircularText;
})();
