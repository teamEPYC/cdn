function initMosaicEffect() {
  const isTabletUp = window.innerWidth >= 768;

  document.querySelectorAll(".h-uc-card-container").forEach((card) => {
    const detailCard = card.querySelector(".uc-detail-card-desktop");
    const headingWrap = card.querySelector(".uc-heading-wrap");
    const heading = card.querySelector("h2");
    const pixelContainer = card.querySelector(".uc-grandient-bg");
    const buttonWrap = card.querySelector(".uc-button-wrap");

    if (card._mosaicCleanup) {
      card._mosaicCleanup();
      card._mosaicCleanup = null;
    }

    if (!pixelContainer || !isTabletUp) return;

    const gridSize = 10;
    const pixels = [];
    const gradient = getComputedStyle(pixelContainer).background;

    pixelContainer.style.display = "grid";
    pixelContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    pixelContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    pixelContainer.style.gap = "0";
    pixelContainer.style.background = "none";
    pixelContainer.style.overflow = "hidden";

    for (let i = 0; i < gridSize * gridSize; i++) {
      const pixel = document.createElement("div");
      const col = i % gridSize;
      const row = Math.floor(i / gridSize);

      pixel.style.background = gradient;
      pixel.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
      pixel.style.backgroundPosition = `${(col / (gridSize - 1)) * 100}% ${
        (row / (gridSize - 1)) * 100
      }%`;
      pixel.style.margin = "-0.5px";
      pixel.style.padding = "0.5px";
      pixel.style.opacity = "0";

      pixelContainer.appendChild(pixel);
      pixels.push(pixel);
    }

    const shuffled = [...pixels].sort(() => Math.random() - 0.5);

    const onEnter = () => {
      const isDark = document.documentElement.classList.contains("dark-mode");
      const greyColor = isDark ? "#a0a1a6" : "#888a91";

      gsap.killTweensOf(detailCard);
      gsap.to(detailCard, {
        duration: 0.3,
        opacity: 1,
        visibility: "visible",
        ease: "power1.out",
      });
      gsap.to(headingWrap, { duration: 0.3, gap: "3vw", ease: "power1.out" });
      gsap.to(buttonWrap, {
        duration: 0.3,
        marginLeft: "auto",
        ease: "power1.out",
      });
      gsap.to(heading, { duration: 0.3, color: greyColor, ease: "power1.out" });
      gsap.to(shuffled, {
        opacity: 1,
        duration: 0.05,
        stagger: 0.01,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      const isDark = document.documentElement.classList.contains("dark-mode");
      const headingColor = isDark ? "white" : "#07060d";

      gsap.killTweensOf(detailCard);
      gsap.killTweensOf(shuffled);
      gsap.set(detailCard, { opacity: 0, visibility: "hidden" });
      gsap.set(shuffled, { opacity: 0 });
      gsap.to(headingWrap, {
        duration: 0.3,
        gap: "0.556vw",
        ease: "power1.in",
      });
      gsap.to(buttonWrap, {
        duration: 0.3,
        marginLeft: "0",
        ease: "power1.in",
      });
      gsap.to(heading, {
        duration: 0.3,
        color: headingColor,
        ease: "power1.in",
      });
    };

    const onMove = (e) => {
      const cardRect = card.getBoundingClientRect();
      gsap.to(detailCard, {
        duration: 0.1,
        x: e.clientX - cardRect.left - detailCard.offsetWidth / 2,
        y: e.clientY - cardRect.top - detailCard.offsetHeight / 2,
        ease: "power1.out",
      });
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("mousemove", onMove);

    // On theme change, update heading color instantly to match new mode
    const isDark = document.documentElement.classList.contains("dark-mode");
    if (card.matches(":hover")) {
      gsap.set(heading, { color: isDark ? "#a0a1a6" : "#888a91" });
    } else {
      gsap.set(heading, { color: isDark ? "white" : "#07060d" });
    }

    card._mosaicCleanup = () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("mousemove", onMove);
      gsap.killTweensOf([
        ...pixels,
        detailCard,
        headingWrap,
        buttonWrap,
        heading,
      ]);
      pixels.forEach((p) => p.remove());
      pixelContainer.style.cssText = "";
    };
  });
}

initMosaicEffect();

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(initMosaicEffect, 200);
});

const textNewObserver = new MutationObserver(() => {
  initMosaicEffect();
});

textNewObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["class"],
});
