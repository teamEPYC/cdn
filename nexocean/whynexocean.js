const lenis = new Lenis({
  lerp: 0.05, // Lower value for smoother interpolation
  wheelMultiplier: 1.2, // Lower sensitivity for wheel scrolling
  gestureOrientation: "vertical",
  smoothWheel: true,
  smoothTouch: true, // Enable smooth touch scrolling
  syncTouchLerp: 0.02, // Adjust for smoother touch response
  touchMultiplier: 1.5, // Lower multiplier for touch events
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

if (window.matchMedia("(min-width: 1023px)").matches) {
  const wnTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".wn-animating-element",
      pin: ".wn-scrolling-div",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });

  wnTl.to(".wn-header-container", {
    autoAlpha: 0,
  });

  wnTl.to(
    ".wn-header-image.is-1",
    {
      width: "1000%",
      duration: 2,
    },
    "<"
  );

  wnTl.to(
    ".wn-header-image.is-2",
    {
      width: "1000%",
      duration: 2,
    },
    "<"
  );

  wnTl.to(
    ".wn-header-image.is-3",
    {
      width: "500%",
      duration: 2,
    },
    "<"
  );

  wnTl.to(
    ".wn-header-image.is-4",
    {
      width: "300%",
      duration: 2,
    },
    "<"
  );

  wnTl.to(
    ".wn-header-image.is-5",
    {
      width: "300%",
      duration: 2,
    },
    "<"
  );

  wnTl.to(
    ".wn-header-image.is-6",
    {
      width: "300%",
      duration: 2,
    },
    "<"
  );

  wnTl.to(
    ".wn-header-container",
    {
      autoAlpha: 0,
      duration: 2,
    },
    "<-=0.5"
  );

  wnTl.to(
    ".wn-hero-gradient",
    {
      autoAlpha: 0,
      duration: 2,
    },
    "<-=0.5"
  );

  wnTl.from(".wn-header-para-container", {
    autoAlpha: 0,
    duration: 2,
  });

  wnTl.to(".wn-header-para-container", {
    autoAlpha: 0,
    duration: 2,
  });

  wnTl.fromTo(
    ".wn-legacy-wrapper",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 2,
    }
  );

  wnTl.to(".wn-legacy-content-wrapper", {
    autoAlpha: 0,
  });

  wnTl.from(".wn-commitment-content", {
    autoAlpha: 0,
    duration: 2,
  });

  wnTl.to(".wn-commitment-content", {
    autoAlpha: 0,
  });

  wnTl.from(".wn-blur-layer", {
    autoAlpha: 0,
    duration: 2,
  });

  wnTl.from(
    ".wn-lc-heading-container.is-1",
    {
      autoAlpha: 0,
      duration: 2,
    },
    "<"
  );

  wnTl.from(
    ".wn-lc-heading-bg.is-1",
    {
      autoAlpha: 0,
      duration: 2,
    },
    "<"
  );

  wnTl.to(".wn-lc-heading-container.is-1", {
    autoAlpha: 0,
    duration: 2,
  });

  wnTl.to(
    ".wn-lc-heading-bg.is-1",
    {
      autoAlpha: 0,
      duration: 2,
    },
    "<"
  );

  wnTl.from(".wn-lc-heading-container.is-2", {
    autoAlpha: 0,
    duration: 2,
  });

  wnTl.from(
    ".wn-lc-heading-bg.is-2",
    {
      autoAlpha: 0,
      duration: 2,
    },
    "<"
  );

  wnTl.to(".wn-lc-heading-container.is-2", {
    autoAlpha: 0,
    duration: 2,
  });

  wnTl.to(
    ".wn-lc-heading-bg.is-2",
    {
      autoAlpha: 0,
      duration: 2,
    },
    "<"
  );

  wnTl.from(".wn-lc-heading-container.is-3", {
    autoAlpha: 0,
    duration: 2,
  });

  wnTl.from(
    ".wn-lc-heading-bg.is-3",
    {
      autoAlpha: 0,
      duration: 2,
    },
    "<"
  );

  wnTl.to(".wn-lc-heading-container.is-3", {
    autoAlpha: 0,
    duration: 2,
  });

  wnTl.to(
    ".wn-lc-heading-bg.is-3",
    {
      autoAlpha: 0,
      duration: 2,
    },
    "<"
  );

  wnTl.from(".wn-lc-heading-container.is-4", {
    autoAlpha: 0,
    duration: 2,
  });

  wnTl.from(
    ".wn-lc-heading-bg.is-4",
    {
      autoAlpha: 0,
      duration: 2,
    },
    "<"
  );

  wnTl.to(".wn-lc-heading-container.is-4", {
    autoAlpha: 0,
    duration: 2,
  });

  wnTl.to(
    ".wn-lc-heading-bg.is-4",
    {
      autoAlpha: 0,
      duration: 2,
    },
    "<"
  );

  wnTl.from(".wn-lc-heading-container.is-5", {
    autoAlpha: 0,
    duration: 2,
  });

  wnTl.from(
    ".wn-lc-heading-bg.is-5",
    {
      autoAlpha: 0,
      duration: 2,
    },
    "<"
  );

  ScrollTrigger.create({
    trigger: ".pre-footer",
    start: "top-=500 top", // 500px before the top of trigger when it reaches top of viewport
    // endTrigger: '#otherID',
    end: "bottom bottom",
    //   markers: true,
    onEnter: () => {
      gsap.to(".wn-legacy-wrapper, .pre-footer.is-wn, .wn-blur-layer", {
        backgroundColor: "#7679D0",
        duration: 0.5, // Add a duration for smooth transition
      });
    },
    onLeaveBack: () => {
      gsap.to(".wn-legacy-wrapper, .pre-footer.is-wn, .wn-blur-layer", {
        backgroundColor: "#FEF7AB",
        duration: 0.5, // Add a duration for smooth transition
      });
    },
  });
}
