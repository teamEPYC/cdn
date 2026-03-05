// gsap.registerPlugin(ScrambleTextPlugin);

function setButtonWidths() {
  // Only run on desktop/tablet
  if (window.innerWidth <= 767) return;

  document.querySelectorAll(".btn").forEach((btn) => {
    const computedWidth = btn.getBoundingClientRect().width;
    const widthInVw = (computedWidth / window.innerWidth) * 100;
    btn.style.width = widthInVw + "vw";
  });
}

function initScrambleEffect() {
  // Only run on desktop/tablet
  if (window.innerWidth <= 767) return;

  document
    .querySelectorAll(".btn, .slider-button, .footer-links-wrap a")
    .forEach((btn) => {
      const textEl = btn.querySelector("div") || btn;
      const originalText = textEl.textContent;

      if (btn.classList.contains("btn")) {
        btn.style.gridRowGap = "0";
        btn.style.gridColumnGap = "0";
      }

      // Store handlers so we can remove them later if needed
      const handleMouseEnter = () => {
        gsap.to(textEl, {
          duration: 0.6,
          scrambleText: {
            text: originalText,
            chars: "original",
            speed: 0.8,
          },
        });
      };

      const handleMouseLeave = () => {
        gsap.killTweensOf(textEl);
        textEl.textContent = originalText;
      };

      btn.addEventListener("mouseenter", handleMouseEnter);
      btn.addEventListener("mouseleave", handleMouseLeave);
    });
}

window.addEventListener("load", () => {
  initScrambleEffect();
  setButtonWidths();
});

// Debounced resize handler
let buttonResizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(buttonResizeTimeout);
  buttonResizeTimeout = setTimeout(setButtonWidths, 150);
});
