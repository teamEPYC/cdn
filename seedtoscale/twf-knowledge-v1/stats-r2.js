/**
 * r2 (2026-09-19) — supersedes stats.js in this folder. Only change: the value
 * falls back to the element's authored text when data-stat is empty, so a
 * script 404 or a missing GSAP still renders the static figure.
 *
 * Stats digit reels
 *
 * Webflow custom attributes:
 *   data-stats-scope  — section that triggers the animation
 *   data-stat="20+"   — a number. Digits become reels; other chars stay as text.
 *
 * Put font-size, font-family, and color on [data-stat] in Webflow.
 * The script builds the 0–9 strips and spins them once on enter.
 */

(function () {
  const SELECTOR = {
    scope: "[data-stats-scope]",
    stat: "[data-stat]",
    reel: "[data-stat-reel]",
  };

  const CYCLES = 4;
  const START = "top 78%";
  const DURATION = 1.9;
  const STAGGER = 0.16;
  const EASE = "power4.out";

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function styleClip(clip) {
    clip.style.position = "relative";
    clip.style.display = "inline-block";
    clip.style.height = "1.2em";
    clip.style.overflow = "hidden";
  }

  function styleReel(reel) {
    reel.style.position = "absolute";
    reel.style.left = "0";
    reel.style.right = "0";
    reel.style.top = "0";
    reel.style.display = "flex";
    reel.style.flexDirection = "column";
    reel.style.alignItems = "center";
    reel.style.willChange = "transform";
  }

  function styleDigit(item) {
    item.style.display = "flex";
    item.style.height = "1.2em";
    item.style.alignItems = "center";
    item.style.justifyContent = "center";
    item.style.lineHeight = "1";
  }

  function buildReel(digit) {
    const clip = document.createElement("span");
    styleClip(clip);

    const sizer = document.createElement("span");
    sizer.textContent = digit;
    sizer.style.display = "block";
    sizer.style.visibility = "hidden";
    sizer.style.lineHeight = "1";
    clip.appendChild(sizer);

    const reel = document.createElement("span");
    reel.setAttribute("data-stat-reel", "");
    reel.setAttribute("data-digit", digit);
    styleReel(reel);

    for (let i = 0; i < CYCLES * 10; i++) {
      const item = document.createElement("span");
      item.textContent = String(i % 10);
      styleDigit(item);
      reel.appendChild(item);
    }

    clip.appendChild(reel);
    return clip;
  }

  function buildStat(stat) {
    // Value may come from the attribute, or from the number authored as text in
    // Webflow. Authoring it as text means a script 404 or a missing GSAP still
    // renders the correct static figure instead of an empty stat.
    const value = (stat.getAttribute("data-stat") || stat.textContent || "").trim();
    if (!value || stat.dataset.statBuilt === "true") return;

    stat.dataset.statBuilt = "true";
    // Clear the authored fallback before appending reels, or it renders twice.
    stat.textContent = "";
    if (!stat.getAttribute("aria-label")) stat.setAttribute("aria-label", value);

    stat.style.display = "flex";
    stat.style.alignItems = "center";
    stat.style.height = "1.2em";
    stat.style.lineHeight = "1";

    [...value].forEach((char) => {
      if (/\d/.test(char)) {
        stat.appendChild(buildReel(char));
        return;
      }

      const other = document.createElement("span");
      other.textContent = char;
      other.style.lineHeight = "1";
      stat.appendChild(other);
    });
  }

  function spinReels(reels) {
    reels.forEach((reel, index) => {
      const digit = Number(reel.getAttribute("data-digit"));
      const item = reel.firstElementChild;
      if (!item || Number.isNaN(digit)) return;

      const height = item.offsetHeight;
      const targetIndex = (CYCLES - 1) * 10 + digit;

      gsap.fromTo(
        reel,
        { y: 0 },
        {
          y: -targetIndex * height,
          duration: DURATION,
          delay: index * STAGGER,
          ease: EASE,
        }
      );
    });
  }

  function initStats(scope) {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    scope.querySelectorAll(SELECTOR.stat).forEach(buildStat);

    const reels = [...scope.querySelectorAll(SELECTOR.reel)];
    if (!reels.length) return;

    ScrollTrigger.create({
      trigger: scope,
      start: START,
      once: true,
      onEnter: () => spinReels(reels),
    });
  }

  onReady(() => {
    document.querySelectorAll(SELECTOR.scope).forEach(initStats);
  });
})();
