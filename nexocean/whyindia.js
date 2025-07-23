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

if (window.matchMedia("(min-width: 1024px)").matches) {
  gsap.set(".wi-global-capability-container", {
    autoAlpha: 0,
  });

  const path = document.getElementById("animated-curve");
  const pathLength = path.getTotalLength();

  const wiTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".wi-track",
      pin: ".wi-camera",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });

  wiTl.to(".wi-frame", {
    x: "-85vw",
    duration: 2,
  });

  wiTl.to(".wi-timeline-content.is-1", {
    opacity: 1,
  });

  wiTl.to(
    ".wi-timeline-content.is-1 .wi-circle",
    {
      backgroundColor: "#2B399E",
    },
    "<"
  );

  wiTl.to(".wi-frame", {
    x: "-100vw",
    duration: 2,
  });

  wiTl.to(".wi-timeline-content.is-2", {
    opacity: 1,
  });

  wiTl.to(
    ".wi-timeline-content.is-2 .wi-circle",
    {
      backgroundColor: "#2B399E",
    },
    "<"
  );

  wiTl.to(".wi-frame", {
    x: "-115vw",
    duration: 2,
  });

  wiTl.to(".wi-timeline-content.is-3", {
    opacity: 1,
  });

  wiTl.to(
    ".wi-timeline-content.is-3 .wi-circle",
    {
      backgroundColor: "#2B399E",
    },
    "<"
  );

  wiTl.to(
    ".wi-bg-image",
    {
      autoAlpha: 0,
      duration: 1,
    },
    "<"
  );

  wiTl.to(".wi-frame", {
    x: "-200vw",
    duration: 2,
  });

  wiTl.to(
    ".wi-camera",
    {
      backgroundColor: "#FF6347",
    },
    "<"
  );
  wiTl.to(
    ".wi-progress-line",
    {
      backgroundColor: "#fff9ab2e",
    },
    "<"
  );

  wiTl.to(
    ".wi-progress-fill, .wi-circle.is-active",
    {
      backgroundColor: "#FFF9AB",
    },
    "<"
  );

  wiTl.to(".wi-progress-line", {
    autoAlpha: 0,
    duration: 0.2,
  });

  wiTl.to(".wi-frame", {
    x: "-320vw",
    duration: 2,
  });

  wiTl.to(
    ".wi-globe-wrapper",
    {
      x: "-30vw",
      duration: 2,
    },
    "<"
  );

  wiTl.to(".wi-frame", {
    x: "-400vw",
    duration: 2,
  });

  wiTl.to(
    ".wi-globe-wrapper",
    {
      x: "0vw",
      duration: 2,
    },
    "<"
  );

  wiTl.to(".wi-percent-text-container.is-2", {
    autoAlpha: 1,
    duration: 3,
  });
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength / 2; // Start with half

  wiTl.to(
    path,
    {
      strokeDashoffset: 0, // Reveal full path
      duration: 2,
      ease: "power2.inOut",
    },
    "<"
  );

  wiTl.to(".wi-percent-text-container.is-2", {
    x: "-30vw",
    duration: 3,
  });

  wiTl.to(
    ".wi-globe-wrapper",
    {
      x: "-30vw",
      duration: 3,
    },
    "<"
  );

  wiTl.to(
    ".wi-global-capability-container",
    {
      autoAlpha: 1,
      duration: 3,
    },
    "<"
  );

  gsap.set(".wi-playbook-content-container , #wi-indian-stats-section", {
    autoAlpha: 0,
  });

  const vTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".wi-vertical-wrapper",
      pin: ".wi-scrolling-div",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });

  vTl.to(".wi-scrolling-div", {
    backgroundColor: "#2B399E",
  });

  vTl.to("#playbook-first", {
    autoAlpha: 1,
    duration: 3,
  });

  vTl.to(".wi-pattern", {
    scale: 1.5,
    duration: 2,
  });

  vTl.to(
    "#playbook-first",
    {
      autoAlpha: 0,
    },
    "<"
  );

  vTl.to("#playbook-second", {
    autoAlpha: 1,
    duration: 3,
  });

  vTl.to(".wi-pattern", {
    scale: 2,
    duration: 2,
  });

  vTl.to(
    "#playbook-second",
    {
      autoAlpha: 0,
    },
    "<"
  );

  vTl.to("#playbook-third", {
    autoAlpha: 1,
    duration: 3,
  });

  vTl.to("#wi-playbook-section", {
    scale: 3,
    autoAlpha: 0,
    duration: 3,
  });

  vTl.from("#wi-circle-section", {
    autoAlpha: 0,
  });

  vTl.to("#wi-tradational-heading-container", {
    autoAlpha: 1,
    duration: 3,
  });

  vTl.to("#wi-tradational-heading-container", {
    autoAlpha: 0,
  });

  vTl.addLabel("play-circle-animation");

  vTl.to("#wi-traditional-para-container", {
    autoAlpha: 1,
    duration: 3,
  });

  vTl.to("#wi-circle-section", {
    autoAlpha: 0,
  });

  vTl.to("#wi-indian-stats-section", {
    autoAlpha: 1,
    duration: 3,
  });

  vTl.to("#wi-indian-stats-section", {
    autoAlpha: 0,
  });

  vTl.from("#wi-smart-money-section", {
    autoAlpha: 0,
    duration: 3,
  });

  vTl.to(
    ".wi-scrolling-div",
    {
      backgroundColor: "#ffffff",
    },
    "<"
  );

  vTl.to("#wi-smart-money-section", {
    autoAlpha: 0,
  });

  vTl.from("#wi-talent-section", {
    autoAlpha: 0,
    duration: 3,
  });

  vTl.to("#wi-talent-content", {
    autoAlpha: 0,
  });

  vTl.to(
    ".wi-mountain",
    {
      autoAlpha: 0,
    },
    "<"
  );

  vTl.to(
    ".wi-scrolling-div",
    {
      backgroundColor: "#3B48A8",
    },
    "<"
  );

  vTl.from("#wi-mountain-content", {
    autoAlpha: 0,
    duration: 3,
  });

  vTl.to(
    ".wi-mountain.is-2",
    {
      autoAlpha: 1,
      yPercent: -100,
      duration: 2,
    },
    "<"
  );

  vTl.to("#wi-talent-section", {
    autoAlpha: 0,
  });

  vTl.from("#wi-gcc-stats", {
    autoAlpha: 0,
    duration: 3,
  });

  vTl.to(
    ".wi-scrolling-div",
    {
      backgroundColor: "#2B399E",
    },
    "<"
  );

  vTl.fromTo(
    "#wi-it-service-image",
    {
      autoAlpha: 0,
      y: "100",
    },
    {
      autoAlpha: 1,
      y: "0",
    }
  );

  vTl.fromTo(
    "#wi-bussiness-image",
    {
      autoAlpha: 0,
      y: "100",
    },
    {
      autoAlpha: 1,
      duration: 3,

      y: "0",
    }
  );

  vTl.fromTo(
    "#wi-kpo-image",
    {
      autoAlpha: 0,
      y: "100",
    },
    {
      autoAlpha: 1,
      duration: 3,

      y: "0",
    }
  );

  vTl.fromTo(
    "#wi-rnd-image",
    {
      autoAlpha: 0,
      y: "100",
    },
    {
      autoAlpha: 1,
      duration: 3,
      y: "0",
    }
  );

  const traditionalCircles = document.querySelectorAll(
    ".wi-traditional-circle"
  );
  const totalCircles = traditionalCircles.length;

  // Split precisely in half for equal distribution
  const halfPoint = Math.ceil(totalCircles / 2);

  // Convert NodeList to Array for easier manipulation
  const circlesArray = Array.from(traditionalCircles);

  // Split them into right and left groups with equal distribution
  const rightCircles = circlesArray.slice(0, halfPoint);
  const leftCircles = circlesArray.slice(halfPoint);

  // Create a separate timeline for left and right movements to ensure they happen simultaneously
  const circleMovementTl = gsap.timeline();

  // Add both animations to this timeline simultaneously with the same position parameter
  rightCircles.forEach((circle, index) => {
    const movePercent = 10 * (index + 1);

    circleMovementTl.to(
      circle,
      {
        xPercent: movePercent, // Move right side circles
        ease: "power2.inOut",
        duration: 1.5,
        yPercent: -50,
      },
      0 // All start at position 0 to ensure simultaneous animation
    );
  });

  leftCircles.forEach((circle, index) => {
    const movePercent = -20 * (index + 1); // Correct the movement logic for left-side circles

    circleMovementTl.to(
      circle,
      {
        xPercent: movePercent, // Use xPercent to ensure smooth proportional movement for left side
        ease: "power2.inOut",
        duration: 1.5,
        yPercent: -50,
      },
      0 // All start at position 0 to ensure simultaneous animation
    );
  });

  // Add this combined timeline to the main timeline
  vTl.add(circleMovementTl, "play-circle-animation");
}
