/**
 * Title outline offset
 *
 * Webflow custom attributes:
 *   data-offset-scope   — section that tracks the mouse
 *   data-offset-title   — heading; movement is measured from its center
 *   data-offset-stroke  — outline copy of each line (same text as the live word)
 *
 * Optional, on the scope:
 *   data-offset-rest="-0.04"    — rest lift in em. 0 sits dead behind the fill.
 *   data-offset-move="0.035"    — how far the cursor drags it, in em
 *   data-offset-color="#FF3621" — outline color
 *   data-offset-width="0.005em" — outline thickness
 *
 * At rest the outline sits slightly above the fill.
 * Moving the cursor shifts it; leaving the section resets it.
 */

(function () {
  const SELECTOR = {
    scope: "[data-offset-scope]",
    title: "[data-offset-title]",
    stroke: "[data-offset-stroke]",
  };

  const REST_Y_EM = -0.04;
  const MOVE_EM = 0.035;
  const STROKE_COLOR = "#FF3621";
  const STROKE_WIDTH = "0.005em";

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function cursorFromCenter(event, element) {
    const box = element.getBoundingClientRect();
    const x = (event.clientX - (box.left + box.width / 2)) / Math.max(box.width / 2, 1);
    const y = (event.clientY - (box.top + box.height / 2)) / Math.max(box.height / 2, 1);
    return {
      x: clamp(x, -1, 1),
      y: clamp(y, -1, 1),
    };
  }

  function number(value, fallback) {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function text(value, fallback) {
    const trimmed = (value || "").trim();
    return trimmed || fallback;
  }

  function readOptions(scope) {
    return {
      rest: number(scope.getAttribute("data-offset-rest"), REST_Y_EM),
      move: number(scope.getAttribute("data-offset-move"), MOVE_EM),
      color: text(scope.getAttribute("data-offset-color"), STROKE_COLOR),
      width: text(scope.getAttribute("data-offset-width"), STROKE_WIDTH),
    };
  }

  function styleOutline(stroke, options) {
    const line = stroke.parentElement;
    if (line) line.style.position = "relative";

    stroke.style.position = "absolute";
    stroke.style.left = "0";
    stroke.style.top = "0";
    stroke.style.color = "transparent";
    stroke.style.webkitTextFillColor = "transparent";
    stroke.style.webkitTextStroke = `${options.width} ${options.color}`;
    stroke.style.pointerEvents = "none";
    stroke.style.userSelect = "none";
    stroke.style.willChange = "transform";
    // The outline is a duplicate of the word; keep it out of the a11y tree.
    stroke.setAttribute("aria-hidden", "true");
  }

  function initTitleOffset(scope) {
    if (typeof gsap === "undefined") return;

    const title = scope.querySelector(SELECTOR.title);
    const strokes = title ? [...title.querySelectorAll(SELECTOR.stroke)] : [];
    if (!title || !strokes.length) return;

    const options = readOptions(scope);
    strokes.forEach((stroke) => styleOutline(stroke, options));

    const fontSize = () => parseFloat(getComputedStyle(title).fontSize) || 16;
    const restY = () => options.rest * fontSize();
    const moveRange = () => options.move * fontSize();

    gsap.set(strokes, { opacity: 0, x: 0, y: 0 });

    let ready = false;
    let moveX = [];
    let moveY = [];

    gsap
      .timeline({
        delay: 0.15,
        onComplete() {
          moveX = strokes.map((el) =>
            gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" })
          );
          moveY = strokes.map((el) =>
            gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" })
          );
          ready = true;
        },
      })
      .to(strokes, {
        opacity: 1,
        y: restY,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

    function onMove(event) {
      if (!ready) return;
      const cursor = cursorFromCenter(event, title);
      const x = cursor.x * moveRange();
      const y = restY() + cursor.y * moveRange();
      moveX.forEach((to) => to(x));
      moveY.forEach((to) => to(y));
    }

    function onLeave() {
      if (!ready) return;
      moveX.forEach((to) => to(0));
      moveY.forEach((to) => to(restY()));
    }

    scope.addEventListener("mousemove", onMove);
    scope.addEventListener("mouseleave", onLeave);
  }

  onReady(() => {
    document.querySelectorAll(SELECTOR.scope).forEach(initTitleOffset);
  });
})();
