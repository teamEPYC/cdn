/**
 * Global setup for Webflow
 * - Registers GSAP ScrollTrigger
 * - Starts Lenis smooth scroll and keeps ScrollTrigger in sync
 *
 * Turn Lenis off: set ENABLE_LENIS to false
 */

(function () {
  const ENABLE_LENIS = true;

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function startLenis() {
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.5,
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 0.9,
      syncTouch:true,
      easing: (progress) => Math.min(1, 1.001 - Math.pow(2, -10 * progress)),
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update();
    });
    gsap.ticker.lagSmoothing(0);

    return lenis;
  }

  function init() {
    window.site = window.site || {};
    window.site.lenis = null;

    if (typeof gsap === "undefined") {
      console.warn("[global] GSAP is not loaded");
      return;
    }

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (ENABLE_LENIS && typeof Lenis !== "undefined") {
      window.site.lenis = startLenis();
    }
  }

  onReady(init);
})();
