function applyCornerCircleCutoutsV2() {
  // Target all divs that need SVGs (parent or child)
  const targets = document.querySelectorAll('[data-cutout="true"], [data-cutout-child="true"]');

  targets.forEach((container, index) => {
    const isChild = container.getAttribute("data-cutout-child") === "true";
    const isParent = container.getAttribute("data-cutout") === "true";

    // Prevent duplication if SVG already injected
    if (container.querySelector("svg.cutout-svg")) return;

    // Determine cutout radius
    let radius = parseFloat(container.getAttribute("data-cutout-radius") || "50");
    let offset = 0;

    // Determine fill color
    const fill = container.getAttribute("data-cutout-fill") || "#ffffff";

    // If child, calculate offset from parent
    if (isChild) {
      let current = container;
      let totalPadding = 0;
      let foundBase = false;

      while (current && current !== document.body) {
        const base = current.querySelector('[data-cutout="true"]');
        if (base) {
          const baseRadius = parseFloat(base.getAttribute("data-cutout-radius") || "50");
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
        console.warn("No base parent container found for child:", container);
      }
    }

    // Create SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("cutout-svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.zIndex = "-1";

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", fill);
    svg.appendChild(rect);

    container.insertBefore(svg, container.firstChild); // Inject SVG

    // Apply cutout mask logic
    const diameter = radius * 2;
    const parentWidth = container.offsetWidth;
    const parentHeight = container.offsetHeight;

    svg.setAttribute("width", parentWidth);
    svg.setAttribute("height", parentHeight);
    svg.setAttribute("viewBox", `0 0 ${parentWidth} ${parentHeight}`);

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
      [0 - offset, 0 - offset],
      [parentWidth + offset, 0 - offset],
      [0 - offset, parentHeight + offset],
      [parentWidth + offset, parentHeight + offset],
    ];

    positions.forEach(([cx, cy]) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", radius);
      circle.setAttribute("fill", "black");
      mask.appendChild(circle);
    });

    defs.appendChild(mask);
    svg.insertBefore(defs, svg.firstChild);
  });
}

window.addEventListener("load", applyCornerCircleCutoutsV2);
window.addEventListener("resize", () => {
  // Clear old svgs and reapply
  document.querySelectorAll("svg.cutout-svg").forEach(el => el.remove());
  applyCornerCircleCutoutsV2();
});
