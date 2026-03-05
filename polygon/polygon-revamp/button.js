// gsap.registerPlugin(ScrambleTextPlugin);

function setButtonWidths() {
  document.querySelectorAll(".btn").forEach((btn) => {
    const computedWidth = btn.getBoundingClientRect().width;
    const widthInVw = (computedWidth / window.innerWidth) * 100;
    btn.style.width = widthInVw + "vw";
  });
}

window.addEventListener("load", () => {
  document
    .querySelectorAll(".btn, .slider-button, .footer-links-wrap a")
    .forEach((btn) => {
      const textEl = btn.querySelector("div") || btn;
      const originalText = textEl.textContent;

      if (btn.classList.contains("btn")) {
        btn.style.gridRowGap = "0";
        btn.style.gridColumnGap = "0";
      }

      btn.addEventListener("mouseenter", () => {
        gsap.to(textEl, {
          duration: 0.6,
          scrambleText: {
            text: originalText,
            chars: "original",
            speed: 0.8,
          },
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.killTweensOf(textEl);
        textEl.textContent = originalText;
      });
    });

  setButtonWidths();
});

// Debounced resize handler
let buttonResizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(buttonResizeTimeout);
  buttonResizeTimeout = setTimeout(setButtonWidths, 150);
});
