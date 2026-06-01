<!-- Code to handle button widths and scramble text effects -->
// gsap.registerPlugin(ScrambleTextPlugin);


function setButtonWidths() {
  if (window.innerWidth <= 767) return;
  document.querySelectorAll(".btn").forEach((btn) => {
    const computedWidth = btn.getBoundingClientRect().width;
    if (btn.classList.contains("btn-new")) {
      btn.style.width = computedWidth + "px";
    } else {
      btn.style.width = (computedWidth / window.innerWidth) * 100 + "vw";
    }
  });
}

function initScrambleEffect() {
  if (window.innerWidth <= 767) return;
  document
    .querySelectorAll(".btn, .btn-new, .slider-button, .footer-links-wrap a")
    .forEach((btn) => {
      const textEl = btn.querySelector("div") || btn;
      const originalText = textEl.textContent;
      /*if (btn.classList.contains("btn") || btn.classList.contains("btn-new")) {
        btn.style.gridRowGap = "0";
        btn.style.gridColumnGap = "0";
      }*/
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

let buttonResizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(buttonResizeTimeout);
  buttonResizeTimeout = setTimeout(setButtonWidths, 150);
});
