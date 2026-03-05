function initMosaicEffect() {
  const isTabletUp = window.innerWidth >= 768;

  document.querySelectorAll(".h-uc-card-container").forEach((card) => {
    const detailCard = card.querySelector(".uc-detail-card-desktop");
    const headingWrap = card.querySelector(".uc-heading-wrap");
    const heading = card.querySelector("h2");
    const pixelContainer = card.querySelector(".uc-grandient-bg");
    const buttonWrap = card.querySelector(".uc-button-wrap");

    // Cleanup existing
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
      gsap.to(heading, {
        duration: 0.3,
        color: "var(--swatch--grey-200-dark)",
        ease: "power1.out",
      });
      gsap.to(shuffled, {
        opacity: 1,
        duration: 0.05,
        stagger: 0.01,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(detailCard, {
        duration: 0.3,
        opacity: 0,
        visibility: "hidden",
        ease: "power1.in",
      });
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
        color: "var(--color--primary)",
        ease: "power1.in",
      });
      gsap.to(shuffled, {
        opacity: 0,
        duration: 0.05,
        stagger: 0.01,
        ease: "power2.in",
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

    card._mosaicCleanup = () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("mousemove", onMove);
      pixels.forEach((p) => p.remove());
      pixelContainer.style.cssText = "";
    };
  });
}

// Init and re-init on resize
initMosaicEffect();
window.addEventListener("resize", initMosaicEffect);
