/**
 * Featured section
 *
 * Webflow custom attributes:
 *   data-featured-scope   — the section (scroll trigger)
 *   data-featured-book    — wrapper around the 3D book (flies in on scroll)
 *   data-book             — the canvas (mounted by book.js)
 *   data-book-scroll="1"  — optional. Opens the book to this page while the
 *                           section is in view, closes when you leave.
 *
 * Copy, images, button, and background live in Webflow.
 * The book itself is drawn by book.js.
 * Moving strips: featured-strips.js
 */

(function () {
  const SELECTOR = {
    scope: "[data-featured-scope]",
    book: "[data-featured-book]",
    canvas: "[data-book]",
  };

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function flyIn(scope, bookWrap) {
    gsap.fromTo(
      bookWrap,
      {
        xPercent: 108,
        yPercent: -18,
        rotate: 10,
        rotateY: -16,
      },
      {
        xPercent: 0,
        yPercent: 0,
        rotate: 0,
        rotateY: 0,
        ease: "none",
        overwrite: "auto",
        immediateRender: true,
        scrollTrigger: {
          trigger: scope,
          start: "-10% 75%",
          end: "-40% -10%",
          scrub: true,
        },
      }
    );
  }

  function bookApiFor(canvas) {
    return window.site?.books?.get(canvas) || null;
  }

  function bindOpenClose(scope, canvas) {
    const raw = scope.getAttribute("data-book-scroll");
    if (raw === null || raw === "") return;

    const page = raw === "open" || raw === "true" ? 1 : Number(raw);
    if (!Number.isFinite(page) || page < 1) return;

    const run = (fn) => {
      const api = bookApiFor(canvas);
      if (api) fn(api);
    };

    ScrollTrigger.create({
      trigger: scope,
      start: "top 55%",
      end: "bottom 35%",
      onEnter: () => run((api) => api.open(page)),
      onEnterBack: () => run((api) => api.open(page)),
      onLeave: () => run((api) => api.close()),
      onLeaveBack: () => run((api) => api.close()),
    });
  }

  function initScope(scope) {
    const bookWrap = scope.querySelector(SELECTOR.book);
    if (bookWrap) flyIn(scope, bookWrap);

    const canvas = scope.querySelector(SELECTOR.canvas);
    if (!canvas) return;

    if (bookApiFor(canvas)) {
      bindOpenClose(scope, canvas);
      return;
    }

    canvas.addEventListener(
      "book:ready",
      () => bindOpenClose(scope, canvas),
      { once: true }
    );
  }

  function init() {
    if (typeof gsap === "undefined") {
      console.warn("[featured] GSAP is not loaded");
      return;
    }
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    document.querySelectorAll(SELECTOR.scope).forEach(initScope);
  }

  onReady(init);
})();
