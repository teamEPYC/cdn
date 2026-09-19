/**
 * Hover button
 * Circle grows from the cursor. Label and icon slide to a duplicate.
 *
 * Webflow custom attributes:
 *   data-button              — the link / button
 *   data-button-fill         — empty circle (set its background color in Webflow)
 *   data-button-label        — visible label at rest
 *   data-button-label-hover  — duplicate label that slides in
 *   data-button-icon         — visible icon at rest
 *   data-button-icon-hover   — duplicate icon that slides in
 *   data-button-arrow="down" — optional; use a vertical slide instead of horizontal
 */

(function () {
  const SELECTOR = {
    button: "[data-button]",
    fill: "[data-button-fill]",
    label: "[data-button-label]",
    labelHover: "[data-button-label-hover]",
    icon: "[data-button-icon]",
    iconHover: "[data-button-icon-hover]",
  };

  const CIRCLE_SIZE = 24;
  const SLIDE = { duration: 0.4, ease: "power3.out" };

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function circleScaleToCover(x, y, width, height) {
    const radius = Math.max(
      Math.hypot(x, y),
      Math.hypot(width - x, y),
      Math.hypot(x, height - y),
      Math.hypot(width - x, height - y)
    );
    return (radius * 2) / CIRCLE_SIZE;
  }

  function cursorInside(event, element) {
    const box = element.getBoundingClientRect();
    return {
      x: event.clientX - box.left,
      y: event.clientY - box.top,
      width: box.width,
      height: box.height,
    };
  }

  function styleCircle(fill) {
    fill.style.position = "absolute";
    fill.style.top = "0";
    fill.style.left = "0";
    fill.style.zIndex = "0";
    fill.style.width = `${CIRCLE_SIZE}px`;
    fill.style.height = `${CIRCLE_SIZE}px`;
    fill.style.marginLeft = `${-CIRCLE_SIZE / 2}px`;
    fill.style.marginTop = `${-CIRCLE_SIZE / 2}px`;
    fill.style.borderRadius = "50%";
    fill.style.pointerEvents = "none";
    gsap.set(fill, { scale: 0 });
  }

  function initButton(button) {
    if (typeof gsap === "undefined") return;

    const fill = button.querySelector(SELECTOR.fill);
    const label = button.querySelector(SELECTOR.label);
    const labelHover = button.querySelector(SELECTOR.labelHover);
    const icon = button.querySelector(SELECTOR.icon);
    const iconHover = button.querySelector(SELECTOR.iconHover);
    if (!fill) return;

    const isDownArrow = button.getAttribute("data-button-arrow") === "down";
    let fillTween = null;

    button.style.position = button.style.position || "relative";
    button.style.overflow = "hidden";
    styleCircle(fill);

    if (labelHover) gsap.set(labelHover, { yPercent: 110 });
    if (iconHover) {
      gsap.set(iconHover, isDownArrow ? { yPercent: -130 } : { xPercent: -130 });
    }

    function slideIn() {
      if (label) gsap.to(label, { yPercent: -110, ...SLIDE });
      if (labelHover) gsap.to(labelHover, { yPercent: 0, ...SLIDE });
      if (icon) {
        gsap.to(icon, isDownArrow ? { yPercent: 130, ...SLIDE } : { xPercent: 130, ...SLIDE });
      }
      if (iconHover) {
        gsap.to(iconHover, isDownArrow ? { yPercent: 0, ...SLIDE } : { xPercent: 0, ...SLIDE });
      }
    }

    function slideOut() {
      if (label) gsap.to(label, { yPercent: 0, ...SLIDE });
      if (labelHover) gsap.to(labelHover, { yPercent: 110, ...SLIDE });
      if (icon) {
        gsap.to(icon, isDownArrow ? { yPercent: 0, ...SLIDE } : { xPercent: 0, ...SLIDE });
      }
      if (iconHover) {
        gsap.to(
          iconHover,
          isDownArrow ? { yPercent: -130, ...SLIDE } : { xPercent: -130, ...SLIDE }
        );
      }
    }

    button.addEventListener("mouseenter", (event) => {
      const point = cursorInside(event, button);
      if (fillTween) fillTween.kill();
      gsap.set(fill, { left: point.x, top: point.y, scale: 0 });
      fillTween = gsap.to(fill, {
        scale: circleScaleToCover(point.x, point.y, point.width, point.height),
        duration: 0.5,
        ease: "power2.out",
      });
      slideIn();
    });

    button.addEventListener("mouseleave", (event) => {
      const point = cursorInside(event, button);
      if (fillTween) fillTween.kill();
      gsap.set(fill, { left: point.x, top: point.y });
      fillTween = gsap.to(fill, {
        scale: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
      slideOut();
    });
  }

  onReady(() => {
    document.querySelectorAll(SELECTOR.button).forEach(initButton);
  });
})();
