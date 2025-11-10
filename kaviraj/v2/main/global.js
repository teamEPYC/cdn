// Remove Webflow Badge
window.onload = function() {
  setTimeout(function() {
    try {
      const badge = document.querySelector(".w-webflow-badge");
      if (badge) {
        badge.remove();
        console.log("Element removed successfully.");
      } else {
        console.log("Element not found.");
      }
    } catch (error) {
      console.error("Error removing element:", error);
    }
  }, 3000); // 3000 milliseconds = 3 seconds
};

// Import lenis on desktop
if (window.innerWidth >= 992) {
    const lenis = new Lenis({
      useStrict: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {lenis.raf(time * 1500);});
    gsap.ticker.lagSmoothing(0);
}

async function importUtility() {
    const { svgCutouts } = await import('http://127.0.0.1:5500/js/utility/svgCutoutsV2.js'); 
    const { spriteNoiseMask } = await import('http://127.0.0.1:5500/js/utility/spriteNoiseMask.js'); 
}

importUtility();


//Nav open and collapse
  const tlLogo = gsap.timeline({ paused: true, reversed: true });
  const tlMenu = gsap.timeline({ paused: true, reversed: true });

  tlLogo.fromTo(".k-logo", { width: "2.5rem" }, {
    width: "1rem",
    duration: 0.8,
    ease: "quart.inOut"
  });

  tlMenu.fromTo(".k-nav-cta-button, .k-nav-menu-button", 
    { x: "0rem" }, 
    { x: "2.7rem", duration: 0.8, ease: "quart.inOut" }, 0
  ).fromTo(".k-nav-menu-button", 
    {"--nav-border-radius": "0.6rem" }, 
    {"--nav-border-radius": "0rem", duration: 0.5, ease: "quart.inOut"}, 0.3
  );

  // 🟡 State tracking
  let isCollapsed = false;
  let lastScroll = window.scrollY;

  // 🟡 Scroll-triggered nav collapse/expand
  ScrollTrigger.create({
    start: 0,
    onUpdate: self => {
      const currentScroll = self.scroll();
      const scrollingDown = currentScroll > lastScroll;
      if (scrollingDown && !isCollapsed) {
        // Collapse nav (scroll down)
        tlLogo.play();
        tlMenu.play();
        isCollapsed = true;
      } else if (!scrollingDown && isCollapsed) {
        // Expand nav (scroll up)
        tlLogo.reverse();
        tlMenu.reverse();
        isCollapsed = false;
      }
      lastScroll = currentScroll;
    }
  });

  // 🟡 Hover effect on .nav-logo (only when collapsed)
  const navLogo = document.querySelector(".k-logo");

  navLogo.addEventListener("mouseenter", () => {
    if (isCollapsed) tlLogo.reverse();
  });

  navLogo.addEventListener("mouseleave", () => {
    if (isCollapsed) tlLogo.play();
  });


  const circle = document.querySelector('.scroll-indicator__circle');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

// setup dash
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference; // start empty

gsap.to(circle, {
  strokeDashoffset: 0,
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});