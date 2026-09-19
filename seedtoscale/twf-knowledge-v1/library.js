/**
 * Library row
 *
 * Webflow custom attributes:
 *   data-library-row      — the row that holds the cards (scroll trigger)
 *   data-library-book     — wrapper around each 3D book (flies in on scroll)
 *   data-library-card     — optional. One card. Drives the hover overlay.
 *   data-library-overlay  — optional. Fades in while the card is hovered.
 *   data-book             — the canvas (mounted by book.js)
 *
 * Outer cards slide in from the sides, the middle one drops in.
 * Layout, borders, copy, meta pills, and the overlay's look live in Webflow.
 */

(function () {
  const SELECTOR = {
    row: "[data-library-row]",
    book: "[data-library-book]",
    card: "[data-library-card]",
    overlay: "[data-library-overlay]",
  };

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function startFrom(index, count) {
    const mid = (count - 1) / 2;
    if (index < mid) return { xPercent: 110, yPercent: 0, rotateY: -18 };
    if (index > mid) return { xPercent: -110, yPercent: 0, rotateY: 18 };
    return { xPercent: 0, yPercent: -100, rotateY: 0 };
  }

  function flyIn(row, books) {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: row,
        start: "top 72%",
        end: "top 18%",
        scrub: 1.15,
      },
    });

    books.forEach((book, index) => {
      tl.fromTo(
        book,
        {
          ...startFrom(index, books.length),
          scale: 0.88,
          autoAlpha: 0.4,
          transformPerspective: 1100,
          transformOrigin: "50% 50%",
        },
        {
          xPercent: 0,
          yPercent: 0,
          rotateY: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 1,
          immediateRender: true,
        },
        index * 0.1
      );
    });
  }

  // Webflow cannot style a child on the parent's hover without an interaction.
  function bindHover(card) {
    const overlay = card.querySelector(SELECTOR.overlay);
    if (!overlay) return;

    overlay.style.pointerEvents = "none";
    gsap.set(overlay, { autoAlpha: 0 });

    const fade = (value) =>
      gsap.to(overlay, { autoAlpha: value, duration: 0.3, overwrite: "auto" });

    card.addEventListener("pointerenter", () => fade(1));
    card.addEventListener("pointerleave", () => fade(0));
  }

  function initRow(row) {
    const books = Array.from(row.querySelectorAll(SELECTOR.book));
    if (books.length) flyIn(row, books);
    row.querySelectorAll(SELECTOR.card).forEach(bindHover);
  }

  function init() {
    if (typeof gsap === "undefined") {
      console.warn("[library] GSAP is not loaded");
      return;
    }
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    document.querySelectorAll(SELECTOR.row).forEach(initRow);
  }

  onReady(init);
})();
