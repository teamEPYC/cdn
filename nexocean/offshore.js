gsap.registerPlugin(ScrollToPlugin, SplitText, ScrollTrigger);

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
  // Define section background colors and gradients
  const sectionColorMap = [
    {
      index: 0,
      bgColor: "#FFF9AB", // Vanilla for first section
      color: "#2C3960",
      gradient: "linear-gradient(#2b399e00, #ffffff 16%)", // Default gradient
    },
    {
      index: 1,
      bgColor: "#FCFCFC", // White for second section
      color: "#2C3960",
      gradient: "linear-gradient(#2b399e00, #ffffff 16%)", // Default gradient
    },
    {
      index: 2,
      bgColor: "#2B399E", // Blue for third section
      color: "#FCFCFC",
      gradient: "linear-gradient(#2b399e00, #2b399e 16%)", // Blue gradient
    },
    {
      index: 3,
      bgColor: "#FCFCFC", // White for fourth section
      color: "#2C3960",
      gradient: "linear-gradient(#2b399e00, #ffffff 16%)", // Default gradient
    },
  ];

  function setupCardMovements(timeline) {
    // Target the right-side cards individually, skipping the first one
    const rightCards = gsap.utils.toArray(
      ".wingman-detail-container.bg-filled"
    );
    const rightCardsToAnimate = rightCards.slice(1); // Skip the first card

    // Target the left-side cards individually, skipping the first one
    const leftCards = gsap.utils.toArray(".wingman-detail-container.is-left");
    const leftCardsToAnimate = leftCards.slice(1); // Skip the first card

    // Set initial positions and opacity for right cards
    rightCardsToAnimate.forEach((card, index) => {
      const distance = 50 * (index + 2);
      gsap.set(card, {
        x: distance,
        autoAlpha: 0, // Start with opacity 0 and visibility hidden
      });
    });

    // Set initial positions and opacity for left cards
    leftCardsToAnimate.forEach((card, index) => {
      const distance = -50 * (index + 2);
      gsap.set(card, {
        x: distance,
        autoAlpha: 0, // Start with opacity 0 and visibility hidden
      });
    });

    // Animate all cards simultaneously
    timeline.to(
      rightCardsToAnimate,
      {
        x: 0,
        autoAlpha: 1, // Animate to fully visible
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      },
      "cards-animate"
    );

    // Animate left cards at the same time
    timeline.to(
      leftCardsToAnimate,
      {
        x: 0,
        autoAlpha: 1, // Animate to fully visible
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      },
      "cards-animate"
    );

    return timeline;
  }

  // Get all sections
  const sections = document.querySelectorAll(".section-h-auto");

  // Apply initial background color and gradient
  document.body.style.backgroundColor = "#FFF9AB"; // First bg color

  // Get the gradient element
  const gradientElement = document.querySelector(".wm-para-container-gradient");
  if (gradientElement) {
    gradientElement.style.background =
      "linear-gradient(#2b399e00, #ffffff 16%)";
  }

  // Apply initial color to all text elements in the first section
  const firstSection = sections[0];
  if (firstSection) {
    firstSection.style.color = sectionColorMap[0].color;
  }

  // Add transition for smoother color changes
  const style = document.createElement("style");
  style.textContent = `
  body {
    transition: background-color 0.8s ease;
  }
  
  .wm-para-container-gradient {
    transition: background 0.8s ease;
  }
  
  .section-h-auto {
    transition: color 0.8s ease;
  }
`;
  document.head.appendChild(style);

  // Create ScrollTrigger only for sections that need color changes
  sectionColorMap.forEach((mapping) => {
    const section = sections[mapping.index];
    if (!section) {
      console.warn(`Section at index ${mapping.index} not found`);
      return; // Skip if section doesn't exist
    }

    ScrollTrigger.create({
      trigger: section,
      start: "top 50%", // When the top of the section reaches the middle of the viewport
      end: "bottom 50%", // When the bottom of the section passes the middle of the viewport
      onEnter: () => {
        // Animate background color
        gsap.to("body", {
          backgroundColor: mapping.bgColor,
          duration: 0.8,
          ease: "power2.out",
        });

        // Animate text color for the current section
        gsap.to(section, {
          color: mapping.color,
          duration: 0.8,
          ease: "power2.out",
        });

        // Animate gradient if element exists
        if (gradientElement) {
          gsap.to(".wm-para-container-gradient", {
            background: mapping.gradient,
            duration: 0.8,
            ease: "power2.out",
          });
        }
      },
      onEnterBack: () => {
        // Same animation when scrolling back up
        gsap.to("body", {
          backgroundColor: mapping.bgColor,
          duration: 0.8,
          ease: "power2.out",
        });

        // Animate text color for the current section when scrolling back
        gsap.to(section, {
          color: mapping.color,
          duration: 0.8,
          ease: "power2.out",
        });

        // Animate gradient if element exists
        if (gradientElement) {
          gsap.to(".wm-para-container-gradient", {
            background: mapping.gradient,
            duration: 0.8,
            ease: "power2.out",
          });
        }
      },
      markers: false, // Set to true for debugging
    });
  });

  // Refresh ScrollTrigger when the page is fully loaded
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  // Also apply initial color to all sections
  sections.forEach((section, index) => {
    if (index < sectionColorMap.length) {
      section.style.color = sectionColorMap[index].color;
    }
  });

  console.log("Background, text color, and gradient transitions initialized");

  // Card animation when entering the "header" section with scrub effect
  const headerSection = document.getElementById("header");

  if (headerSection) {
    // Get all the cards
    const rightCards = gsap.utils.toArray(
      ".wingman-detail-container.bg-filled"
    );
    const rightCardsToAnimate = rightCards.slice(1); // Skip the first card

    const leftCards = gsap.utils.toArray(".wingman-detail-container.is-left");
    const leftCardsToAnimate = leftCards.slice(1); // Skip the first card

    // IMPORTANT: Make sure the initial positions are applied immediately
    // Set initial positions and opacity for right cards
    rightCardsToAnimate.forEach((card, index) => {
      const distance = 50 * (index + 2);
      gsap.set(card, {
        x: distance,
        autoAlpha: 0, // Start with opacity 0 and visibility hidden
      });
    });

    // Set initial positions and opacity for left cards
    leftCardsToAnimate.forEach((card, index) => {
      const distance = -50 * (index + 2);
      gsap.set(card, {
        x: distance,
        autoAlpha: 0, // Start with opacity 0 and visibility hidden
      });
    });

    // Debug info
    console.log("Right cards to animate:", rightCardsToAnimate.length);
    console.log("Left cards to animate:", leftCardsToAnimate.length);

    // Create a timeline for the scrub animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headerSection,
        start: "top 75%", // When the top of the header reaches 75% of the viewport
        end: "top 25%", // Animation completes when the top of the header reaches 25% of the viewport
        scrub: 1, // Smooth scrubbing, takes 1 second to catch up to the scrollbar
        // markers: true, // Enable markers for debugging
      },
    });

    // Add animations to the timeline

    // Animate right cards (coming from right)
    tl.to(
      rightCardsToAnimate,
      {
        x: 0,
        autoAlpha: 1,
        stagger: 0.05,
        ease: "power1.out",
      },
      0
    ); // Start at the same time (position 0)

    // Animate left cards (coming from left)
    tl.to(
      leftCardsToAnimate,
      {
        x: 0,
        autoAlpha: 1,
        stagger: 0.05,
        ease: "power1.out",
      },
      0
    ); // Start at the same time (position 0)

    // Hide gradient element
    if (gradientElement) {
      tl.to(
        gradientElement,
        {
          autoAlpha: 0, // Set opacity to 0 and visibility to hidden
          ease: "power1.out",
        },
        0
      ); // Start at the same time
    }

    console.log("Header section card animation with scrub initialized");
  } else {
    console.warn("Header section not found");
  }

  // Refresh ScrollTrigger when the page is fully loaded
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
}
