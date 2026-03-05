gsap.matchMedia().add("(min-width: 768px)", () => {
  document.querySelectorAll(".sec.is-blue").forEach((section) => {
    const st = {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none none",
    };

    // Grid items
    gsap.utils
      .toArray(section.querySelectorAll(".u-bg-grid"))
      .slice(0, 3)
      .forEach((row, i) => {
        gsap.fromTo(
          row.querySelectorAll(".bg-grid-item.bg-black"),
          { yPercent: -100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            delay: i * 0.15,
            scrollTrigger: st,
          }
        );
      });

    // Eyebrow
    gsap.fromTo(
      section.querySelector(".h-eyebrow-container"),
      { yPercent: -100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.5,
        scrollTrigger: st,
      }
    );
  });
});
// Resize handler
let arrowResizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(arrowResizeTimeout);
  arrowResizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 200);
});
