gsap.registerPlugin(ScrollToPlugin, SplitText);
// const { transform } = require("typescript");

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
  // Modify the setupCardMovements function to work within the main timeline
  // function setupCardMovements(timeline) {
  //   // Target the right-side cards individually, skipping the first one
  //   const rightCards = gsap.utils.toArray(
  //     ".wingman-detail-container.bg-filled"
  //   );
  //   const rightCardsToAnimate = rightCards.slice(1); // Skip the first card

  //   // Target the left-side cards individually, skipping the first one
  //   const leftCards = gsap.utils.toArray(".wingman-detail-container.is-left");
  //   const leftCardsToAnimate = leftCards.slice(1); // Skip the first card

  //   // Set initial positions and opacity for right cards
  //   rightCardsToAnimate.forEach((card, index) => {
  //     const distance = 50 * (index + 2);
  //     gsap.set(card, {
  //       x: distance,
  //       autoAlpha: 0, // Start with opacity 0 and visibility hidden
  //     });
  //   });

  //   // Set initial positions and opacity for left cards
  //   leftCardsToAnimate.forEach((card, index) => {
  //     const distance = -50 * (index + 2);
  //     gsap.set(card, {
  //       x: distance,
  //       autoAlpha: 0, // Start with opacity 0 and visibility hidden
  //     });
  //   });

  //   // Animate all cards simultaneously
  //   timeline.to(
  //     rightCardsToAnimate,
  //     {
  //       x: 0,
  //       autoAlpha: 1, // Animate to fully visible
  //       duration: 0.5,
  //       ease: "power2.out",
  //       stagger: 0.1,
  //     },
  //     "cards-animate"
  //   );

  //   // Animate left cards at the same time
  //   timeline.to(
  //     leftCardsToAnimate,
  //     {
  //       x: 0,
  //       autoAlpha: 1, // Animate to fully visible
  //       duration: 0.5,
  //       ease: "power2.out",
  //       stagger: 0.1,
  //     },
  //     "cards-animate"
  //   );

  //   return timeline;
  // }

  function setupCardMovements(timeline, position) {
    const rightCards = gsap.utils
      .toArray(".wingman-detail-container.bg-filled")
      .slice(1);
    const leftCards = gsap.utils
      .toArray(".wingman-detail-container.is-left")
      .slice(1);

    // Set initial states
    rightCards.forEach((card, i) => {
      gsap.set(card, { x: 50 * (i + 2), autoAlpha: 0 });
    });
    leftCards.forEach((card, i) => {
      gsap.set(card, { x: -50 * (i + 2), autoAlpha: 0 });
    });

    // Animate right and left cards at provided position
    timeline.to(
      rightCards,
      {
        x: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      },
      position // could be a label, number, "+=1", etc.
    );

    timeline.to(
      leftCards,
      {
        x: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      },
      position
    );

    return timeline;
  }

  const animSrcs = [];

  animSrcs[0] =
    "https://cdn.prod.website-files.com/67bd5b8d3bc1bc87e30ac626/67e10c9b2b6cd2fe33c69c72_India%20Map.json";

  animSrcs[0] = lottie.loadAnimation({
    container: document.querySelector("#indian-map-lottie"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: animSrcs[0],
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  });

  gsap.to(".paas-bg-header", {
    rotation: "360deg",
    duration: 15,
    ease: "none",
    force3D: true,
    repeat: -1,
  });

  gsap.fromTo(
    ".paas-bg-header.is-rotate",
    {
      rotation: "30deg",
    },
    {
      rotation: "390deg", // Starts at 30 and ends at 390, making a full circle back to 30
      duration: 15,
      ease: "none",
      force3D: true,
      repeat: -1,
    }
  );

  gsap.fromTo(
    ".wm-hero-heading",
    {
      rotation: "30deg",
    },
    {
      rotation: "390deg", // Starts at 30 and ends at 390, making a full circle back to 30
      duration: 50,
      ease: "none",
      force3D: true,
      repeat: -1,
    }
  );

  // Keep your existing ScrollTrigger for the blue background
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".wm-trigger-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      // toggleActions: "play reverse play reverse",
      // markers: true, // Uncomment for debugging
      pin: ".wm-scrolling-div",
    },
  });

  heroTl
    .to(".desktop-wrapper", { backgroundColor: "#2B399E", duration: 1 })

    .to(".paas-bg-header", {
      autoAlpha: 0,
    })

    .fromTo(
      ".wm-talent-cards-wrapper",
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,
        duration: 3,
      }
    )

    .fromTo(
      ".wm-talent-cards-wrapper",
      {
        yPercent: 40,
      },

      {
        yPercent: -30,
        duration: 3,
      }
    );

  // Call the modified setupCardMovements function and pass the timeline
  setupCardMovements(heroTl, "<")
    // Add label for clarity
    // .addLabel("play-cards", "<")

    .to(
      ".wingman-cards",
      {
        overflow: "visible",
      },
      "<"
    )

    .to(
      ".wm-para-container-gradient",
      {
        autoAlpha: 0,
      },
      "<"
    )

    .to(
      ".wingman-cards",
      {
        height: "auto",
        duration: 3,
      },
      "<"
    );

  heroTl.to("#header", {
    autoAlpha: 0,
  });

  heroTl.fromTo(
    "#excellence-section",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 3,
    }
  );
  heroTl.to(
    ".desktop-wrapper",
    {
      backgroundColor: "#FCFCFC",
    },
    "<"
  );
  heroTl.fromTo(
    "#excellence-cards-wrapper",
    {
      y: 200,
    },
    {
      y: -100,
      duration: 3,
    }
  );

  // First, set the initial state for all excellence grid cards
  const excellenceCards = gsap.utils.toArray(".wm-excellence-grid-card");
  gsap.set(excellenceCards, {
    y: 50, // Start position below their final position
    autoAlpha: 0, // Start with opacity 0 and visibility hidden
  });

  heroTl.addLabel("excellence-cards", ">");

  heroTl.to(
    excellenceCards,
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1,
    },
    "excellence-cards"
  );

  heroTl.to("#excellence-section", {
    autoAlpha: 0,
  });

  heroTl.fromTo(
    "#lottie-section",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 3,
    }
  );

  heroTl.to("#lottie-heading-container", {
    autoAlpha: 0,
  });

  heroTl.fromTo(
    ".indian-map-lottie",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
    }
  );

  heroTl.addLabel("indian-map");

  heroTl.to(
    ".indian-map-lottie",
    {
      opacity: 0,
    },
    "+=32"
  );

  heroTl.fromTo(
    "#circle-section",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 2,
    }
  );

  // heroTl.to({});

  // First, make sure these polarToCartesian and describeArc functions
  // are defined at the top level of your script
  function polarToCartesian(cx, cy, r, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  }

  function describeArc(cx, cy, r, endAngle) {
    const start = polarToCartesian(cx, cy, r, 0);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const largeArcFlag = endAngle > 180 ? 1 : 0;

    return [
      `M${cx},${cy}`,
      `L${start.x},${start.y}`,
      `A${r},${r} 0 ${largeArcFlag} 1 ${end.x},${end.y}`,
      `Z`,
    ].join(" ");
  }

  // Create a function to update the mask in the timeline
  function setupMaskReveal(timeline) {
    // Create an object to track the angle
    const angleObj = { angle: 0 };

    // Get the mask element - make sure this exists in your HTML
    const arc = document.getElementById("mask-arc");

    if (!arc) {
      console.error(
        "mask-arc SVG path not found! Make sure it exists in your HTML."
      );
      return timeline;
    }

    // Set initial state (0 degrees = no reveal)
    gsap.set(arc, {
      attr: { d: describeArc(210, 210, 210, 0) },
    });

    // Add animations to the timeline at specific points

    // First heading - animate to 90 degrees (1/4 reveal)
    timeline.to(
      angleObj,
      {
        angle: 90,
        duration: 1,
        onUpdate: function () {
          arc.setAttribute("d", describeArc(210, 210, 210, angleObj.angle));
        },
        onUpdateParams: [angleObj],
      },
      "feature-1"
    );

    // Second heading - animate to 180 degrees (2/4 reveal)
    timeline.to(
      angleObj,
      {
        angle: 180,
        duration: 1,
        onUpdate: function () {
          arc.setAttribute("d", describeArc(210, 210, 210, angleObj.angle));
        },
        onUpdateParams: [angleObj],
      },
      "feature-2"
    );

    // Third heading - animate to 270 degrees (3/4 reveal)
    timeline.to(
      angleObj,
      {
        angle: 270,
        duration: 1,
        onUpdate: function () {
          arc.setAttribute("d", describeArc(210, 210, 210, angleObj.angle));
        },
        onUpdateParams: [angleObj],
      },
      "feature-3"
    );

    // Fourth heading - animate to 360 degrees (full reveal)
    timeline.to(
      angleObj,
      {
        angle: 360,
        duration: 1,
        onUpdate: function () {
          arc.setAttribute("d", describeArc(210, 210, 210, angleObj.angle));
        },
        onUpdateParams: [angleObj],
      },
      "feature-4"
    );

    return timeline;
  }
  // integrateBlurTextAnimation(heroTl, "#why-india-heading");

  gsap.set(".wm-key-features-heading-container", {
    autoAlpha: 0,
  });

  gsap.set(".wm-key-features-heading-container.is-first", {
    autoAlpha: 1,
  });

  heroTl.to(".wm-key-features-heading-container.is-first", {
    autoAlpha: 1,
    duration: 2.2,
  });

  heroTl.to(".wm-key-features-heading-container.is-first", {
    autoAlpha: 0,
  });

  heroTl.to(
    ".wm-key-features-bg-1",
    {
      scale: 3,
    },
    "<"
  );

  heroTl.to(
    ".wm-key-features-bg-2",
    {
      scale: 3,
    },
    "<"
  );

  gsap.set(
    ".wm-key-feature-content.is-first, .wm-key-feature-content.is-second, .wm-key-feature-content.is-third, .wm-key-feature-content.is-fourth",
    {
      autoAlpha: 0, // Start with all content hidden
    }
  );

  heroTl.addLabel("feature-1");

  // First feature transition
  heroTl.to(".wm-key-features-heading-container.is-first", {
    autoAlpha: 0,
  });

  heroTl.to(".wm-key-features-heading-container.is-second", {
    autoAlpha: 1,
    duration: 2.2,
  });

  heroTl.to(
    ".wm-key-feature-content.is-first",
    {
      autoAlpha: 1,
      duration: 2.2,
    },
    "<"
  );

  heroTl.addLabel("feature-2");

  // Second feature transition
  heroTl.to(".wm-key-features-heading-container.is-second", {
    autoAlpha: 0,
  });

  heroTl.to(
    ".wm-key-feature-content.is-first",
    {
      autoAlpha: 0,
    },
    "<"
  );

  heroTl.to(".wm-key-features-heading-container.is-third", {
    autoAlpha: 1,
    duration: 2.2,
  });

  heroTl.to(
    ".wm-key-feature-content.is-second",
    {
      autoAlpha: 1,
      duration: 2.2,
    },
    "<"
  );

  heroTl.to(
    ".wm-key-features-circle-svg",
    {
      scale: 1.2,
      duration: 2.2,
    },
    "<"
  );

  heroTl.addLabel("feature-3");

  // Third feature transition
  heroTl.to(".wm-key-features-heading-container.is-third", {
    autoAlpha: 0,
  });

  heroTl.to(
    ".wm-key-feature-content.is-second",
    {
      autoAlpha: 0,
    },
    "<"
  );

  heroTl.to(".wm-key-features-heading-container.is-fourth", {
    autoAlpha: 1,
    duration: 2.2,
  });

  heroTl.to(
    ".wm-key-feature-content.is-third",
    {
      autoAlpha: 1,
      duration: 2.2,
    },
    "<"
  );

  heroTl.to(
    ".wm-key-features-circle-svg",
    {
      scale: 1.4,
      duration: 2.2,
    },
    "<"
  );

  heroTl.addLabel("feature-4");

  // Third feature transition
  heroTl.to(".wm-key-features-heading-container.is-fourth", {
    autoAlpha: 0,
  });

  heroTl.to(
    ".wm-key-feature-content.is-third",
    {
      autoAlpha: 0,
    },
    "<"
  );

  heroTl.to(".wm-key-features-heading-container.is-fifth", {
    autoAlpha: 1,
    duration: 2.2,
  });

  heroTl.to(
    ".wm-key-feature-content.is-fourth",
    {
      autoAlpha: 1,
      duration: 2.2,
    },
    "<"
  );

  heroTl.to(
    ".wm-key-features-circle-svg",
    {
      scale: 1.6,
      duration: 2.2,
    },
    "<"
  );

  heroTl.addLabel("feature-5");

  // heroTl.fromTo(
  //   ".wm-orange-circle",
  //   {
  //     autoAlpha: 0,
  //     // duration: 5,
  //   },
  //   {
  //     autoAlpha: 1,
  //   }
  // );

  heroTl.fromTo(
    ".wm-orange-circle",
    {
      scale: 0,
    },
    {
      scale: 10,
      duration: 5,
    }
  );

  heroTl.to(
    ".wm-key-features-left",
    {
      autoAlpha: 0,
    },
    "<"
  );
  heroTl.to(
    ".wm-key-features-right",
    {
      autoAlpha: 0,
    },
    "<"
  );

  heroTl.fromTo(
    ".wm-opportunity-text-wrapper",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
    },
    "<"
  );

  heroTl.addLabel("vanilla-section-start");

  heroTl.to(
    ".wm-orange-circle",
    {
      backgroundColor: "#FFF9AB",
    },
    "vanilla-section-start"
  );

  heroTl.to(
    ".wm-opportunity-text-wrapper",
    {
      autoAlpha: 0,
    },
    "vanilla-section-start"
  );

  heroTl.to(
    ".desktop-wrapper",
    {
      backgroundColor: "#FFF9AB",
    },
    "vanilla-section-start"
  );

  ScrollTrigger.create({
    trigger: "[data-color=white]",
    start: "top 80%",
    onEnter: () => {
      gsap.to(".desktop-wrapper", {
        backgroundColor: "#FFFFFF",
        duration: 2,
      });
    },
    onLeaveBack: () => {
      // Revert to previous color when scrolling back up
      gsap.to(".desktop-wrapper", {
        backgroundColor: "#FFF9AB",
        duration: 2,
      });
    },
  });

  // Call the function to add mask animations to the timeline
  setupMaskReveal(heroTl);

  animSrcs[0].addEventListener("DOMLoaded", function () {
    console.log("Intro Loaded");

    // Get all grid elements
    const gridElements = document.querySelectorAll(".indian-map-grid");

    // Initially hide all grid elements
    gsap.set(gridElements, { autoAlpha: 0 });

    let totalFrames = 1350;
    let segmentFrames = totalFrames / 6;
    let playhead = { frame: 0 };
    let lastActiveIndex = -1; // Track the last active index to avoid redundant animations

    // Function to update the visible grid element based on the current frame
    function updateVisibleGridElement(currentFrame) {
      // Calculate which segment we're in (0-5)
      const segmentIndex = Math.min(
        5,
        Math.floor(currentFrame / segmentFrames)
      );

      // If we're already showing the correct element, do nothing
      if (segmentIndex === lastActiveIndex) return;

      // Hide all grid elements with a fast transition
      gridElements.forEach((el, i) => {
        if (i !== segmentIndex) {
          gsap.to(el, { autoAlpha: 0, duration: 0.2 });
        }
      });

      // Show the current segment's element
      if (gridElements[segmentIndex]) {
        gsap.to(gridElements[segmentIndex], { autoAlpha: 1, duration: 0.3 });
      }

      // Update our tracking variable
      lastActiveIndex = segmentIndex;
    }

    // Build the GSAP timeline for scroll-based Lottie animation
    let animation2 = gsap.timeline();

    // Segment 1
    animation2.to(playhead, {
      frame: segmentFrames,
      ease: "none",
      duration: 5,
      onUpdate: () => {
        const frameValue = Math.floor(playhead.frame);
        animSrcs[0].goToAndStop(frameValue, true);
        updateVisibleGridElement(frameValue);
      },
    });

    // Segment 2
    animation2.to(playhead, {
      frame: segmentFrames * 2,
      ease: "none",
      duration: 5,
      onUpdate: () => {
        const frameValue = Math.floor(playhead.frame);
        animSrcs[0].goToAndStop(frameValue, true);
        updateVisibleGridElement(frameValue);
      },
    });

    // Segment 3
    animation2.to(playhead, {
      frame: segmentFrames * 3,
      ease: "none",
      duration: 5,
      onUpdate: () => {
        const frameValue = Math.floor(playhead.frame);
        animSrcs[0].goToAndStop(frameValue, true);
        updateVisibleGridElement(frameValue);
      },
    });

    // Segment 4
    animation2.to(playhead, {
      frame: segmentFrames * 4,
      ease: "none",
      duration: 5,
      onUpdate: () => {
        const frameValue = Math.floor(playhead.frame);
        animSrcs[0].goToAndStop(frameValue, true);
        updateVisibleGridElement(frameValue);
      },
    });

    // Segment 5
    animation2.to(playhead, {
      frame: segmentFrames * 5,
      ease: "none",
      duration: 5,
      onUpdate: () => {
        const frameValue = Math.floor(playhead.frame);
        animSrcs[0].goToAndStop(frameValue, true);
        updateVisibleGridElement(frameValue);
      },
    });

    // Segment 6
    animation2.to(playhead, {
      frame: totalFrames - 1,
      ease: "none",
      duration: 5,
      onUpdate: () => {
        const frameValue = Math.floor(playhead.frame);
        animSrcs[0].goToAndStop(frameValue, true);
        updateVisibleGridElement(frameValue);
      },
    });

    // Add to the main timeline
    heroTl.add(animation2, "indian-map");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.querySelector(".report-form-pop-up");
  const reportForm = document.querySelector("#wf-form-Report-Form");
  const reportLinks = document.querySelectorAll(".open-report-form");
  const reportCross = document.querySelector(".report-cross");
  const reportCloseContainer = document.querySelector(
    ".report-form-close-container"
  );

  let pendingHref = null;
  const COOKIE_NAME = "reportFormSubmitted";
  const FADE_DURATION = 400;

  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  const getCookie = (name) => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  };

  const formSubmitted = getCookie(COOKIE_NAME) === "true";

  const hidePopup = () => {
    if (!popup) return;
    popup.classList.remove("show");
    setTimeout(() => (popup.style.display = "none"), FADE_DURATION);
  };

  const showPopup = () => {
    if (!popup) return;
    popup.style.display = "flex";
    void popup.offsetWidth; // Force reflow
    popup.classList.add("show");
  };

  // Init: Hide popup if already submitted
  if (formSubmitted && popup) {
    popup.style.display = "none";
    popup.classList.remove("show");
  }

  // Link intercept
  reportLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (formSubmitted) return;
      e.preventDefault();
      pendingHref = link.getAttribute("href");
      showPopup();
    });
  });

  // Close actions
  [reportCross, reportCloseContainer].forEach((el) => {
    if (el) el.addEventListener("click", hidePopup);
  });

  // Listen for Webflow's form success event
  if (reportForm) {
    // Remove the submit event listener
    // Instead, listen for the Webflow form success event
    $(document).on("submit", "#wf-form-Report-Form", function (e) {
      // Do not handle redirection here - wait for success
    });

    // Listen for the success event
    const formBlock = reportForm.closest(".w-form");
    if (formBlock) {
      const successMessage = formBlock.querySelector(".w-form-done");
      if (successMessage) {
        // Use MutationObserver to detect when success message becomes visible
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.attributeName === "style" &&
              window.getComputedStyle(successMessage).display !== "none"
            ) {
              // Form submission was successful
              setCookie(COOKIE_NAME, "true", 30);
              hidePopup();

              if (pendingHref) {
                setTimeout(() => {
                  window.open(pendingHref, "_blank");
                }, 100);
              } else {
                setTimeout(() => window.location.reload(), 100);
              }

              // Disconnect the observer once we've handled the success
              observer.disconnect();
            }
          });
        });

        // Start observing the success message for style changes
        observer.observe(successMessage, { attributes: true });
      }
    }
  }
});

console.log("hello prod");
