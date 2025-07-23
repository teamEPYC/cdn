// "use strict"; // fix lenis in safari

const lenis = new Lenis({
  lerp: 0.04,
  wheelMultiplier: 1.35,
  gestureOrientation: "vertical",
  smoothWheel: true,
  smoothTouch: false,
  syncTouchLerp: 0.03,
  touchMultiplier: 2,
  autoResize: true,
});

function connectLenis() {
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on("scroll", ScrollTrigger.update);
  // Removed the gsap.ticker.add update to avoid double-calling lenis.raf
}

connectLenis();

var animSrcs = [];

animSrcs[0] =
  "https://cdn.prod.website-files.com/67bd5b8d3bc1bc87e30ac626/67efd5d87bb0fda8ed6be286_Lottie5%20-%20Kaleidoscope1.json";

if (window.matchMedia("(min-width: 1024px)").matches) {
  document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll(".section-h-auto").forEach((section) => {
      const rawColor = section.getAttribute("data-color"); // e.g., "ffffff"
      const color = `#${rawColor}`; // prepend '#'

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onEnter: () =>
          gsap.to("body", { backgroundColor: color, duration: 0.5 }),
        onEnterBack: () =>
          gsap.to("body", { backgroundColor: color, duration: 0.5 }),
        // optional for debug:
        // markers: true
      });
    });
  });

  animSrcs[0] = lottie.loadAnimation({
    container: document.querySelector("#ab-header-lottie"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: animSrcs[0],
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".ab-animating-element",
      pin: ".ab-scrolling-div",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onEnter: () => {
        gsap.to("body", { backgroundColor: "#7679D0", duration: 1 });
      },
      onEnterBack: () => {
        gsap.to("body", { backgroundColor: "#7679D0", duration: 1 });
      },
      onLeave: () => {
        gsap.to("body", { backgroundColor: "white", duration: 1 });
      },
      onLeaveBack: () => {
        gsap.to("body", { backgroundColor: "white", duration: 1 });
      },
    },
  });

  gsap.set("#ab-exist-heading, .ab-team-content-wrapper", {
    autoAlpha: 0,
  });

  tl.to("#about-right-tem-heading", {
    autoAlpha: 1,
    duration: 6,
  })
    .to("#about-right-tem-heading", {
      autoAlpha: 0,
      duration: 3,
    })
    .to("#ab-exist-heading", {
      autoAlpha: 1,
      duration: 3,
    })
    .to("#ab-exist-heading", {
      autoAlpha: 0,
      duration: 3,
    })
    .to(".ab-team-content-wrapper", {
      autoAlpha: 1,
      duration: 3,
    });

  gsap.utils.toArray(".ab-team-circle-image").forEach((el, i) => {
    gsap.fromTo(
      el,
      { scale: 1, opacity: 1 },
      {
        scale: 1.5,
        opacity: 0,
        duration: 3,
        repeat: -1,
        ease: "power1.out",
        delay: i * 0.5,
      }
    );
  });
}

if (window.matchMedia("(max-width: 1023px)").matches) {
  animSrcs[0] = lottie.loadAnimation({
    container: document.querySelector("#ab-header-lottie"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: animSrcs[0],
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  });
}
