function applyCornerCircleCutouts(className = "cutout-svg") {
  document.querySelectorAll(`svg.${className}`).forEach((svg, index) => {
    const isChild = svg.getAttribute("data-cutout-child") === "true";
    let offset = 0;
    let radius = 50; // fallback

    if (isChild) {
      let current = svg.parentElement;
      let totalPadding = 0;
      let foundBase = false;

      while (current && current !== document.body) {
        const baseSvg = current.querySelector(`svg.cutout-svg[data-cutout-parent="true"]`);
        if (baseSvg) {
          const baseRadius = parseFloat(baseSvg.getAttribute("data-cutout-radius") || "50");
          radius = baseRadius + totalPadding;
          offset = totalPadding;
          foundBase = true;
          break;
        }

        const style = getComputedStyle(current.parentElement);
        const pt = parseFloat(style.paddingTop || "0");
        const pl = parseFloat(style.paddingLeft || "0");
        totalPadding += Math.max(pt, pl);

        current = current.parentElement;
      }

      if (!foundBase) {
        console.warn("No base parent SVG found for child:", svg);
        radius = 50;
        offset = totalPadding;
      }

      svg.setAttribute("data-cutout-offset", offset);
      svg.setAttribute("data-cutout-radius", radius);
    }

    // Clean old defs
    svg.querySelectorAll("defs").forEach(def => def.remove());

    // Set layout properties
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.zIndex = "-1";

    const offsetAttr = parseFloat(svg.getAttribute("data-cutout-offset") || "0");
    const diameter = parseFloat(svg.getAttribute("data-cutout-radius") || "50") * 2;
    const circleRadius = diameter / 2;

    const parent = svg.parentElement;
    const parentWidth = parent.offsetWidth;
    const parentHeight = parent.offsetHeight;

    svg.setAttribute("width", parentWidth);
    svg.setAttribute("height", parentHeight);
    svg.setAttribute("viewBox", `0 0 ${parentWidth} ${parentHeight}`);

    const rect = svg.querySelector("rect");
    const maskId = `cutout-mask-${index}`;
    rect.setAttribute("mask", `url(#${maskId})`);

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
    mask.setAttribute("id", maskId);

    const whiteRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    whiteRect.setAttribute("width", "100%");
    whiteRect.setAttribute("height", "100%");
    whiteRect.setAttribute("fill", "white");
    mask.appendChild(whiteRect);

    const positions = [
      [0 - offsetAttr, 0 - offsetAttr],
      [parentWidth + offsetAttr, 0 - offsetAttr],
      [0 - offsetAttr, parentHeight + offsetAttr],
      [parentWidth + offsetAttr, parentHeight + offsetAttr],
    ];

    positions.forEach(([cx, cy]) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", circleRadius);
      circle.setAttribute("fill", "black");
      mask.appendChild(circle);
    });

    defs.appendChild(mask);
    svg.insertBefore(defs, svg.firstChild);
  });
}

window.addEventListener("load", () => applyCornerCircleCutouts());
window.addEventListener("resize", () => applyCornerCircleCutouts());
