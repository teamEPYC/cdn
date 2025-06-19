gsap.registerPlugin(ScrollToPlugin);
// const { transform } = require("typescript");

/**
 * Integrates a blur text animation into a GSAP timeline
 * First and last words blur first, then middle words, then all unblur
 *
 * @param {gsap.core.Timeline} timeline - The GSAP timeline to add the animation to
 * @param {string} textSelector - CSS selector for the text element to animate
 * @param {Object} options - Animation options
 * @param {number} options.blurAmount - Amount of blur in pixels (default: 10)
 * @param {number} options.blurDuration - Duration of the blur animation (default: 0.5)
 * @param {number} options.stagger - Stagger value for words (default: 0.1)
 * @param {number} options.overlap - Overlap between animations (default: 0.25)
 * @param {number} options.unblurDelay - Delay before unblurring (default: 0.5)
 * @param {string} options.position - Position in the timeline (default: "<")
 * @returns {gsap.core.Timeline} - Returns the timeline for chaining
 */
// fix lenis in safari

function integrateBlurTextAnimation(timeline, textSelector, options = {}) {
  // Set default options
  const config = {
    blurAmount: options.blurAmount || 10,
    blurDuration: options.blurDuration || 0.5,
    stagger: options.stagger || 0.1,
    overlap: options.overlap || 0.25,
    unblurDelay: options.unblurDelay || 0.5,
    position: options.position || "<", // Default to run at the same time as previous animation
  };

  // Create the SplitText instance
  const split = new SplitText(textSelector, { type: "chars" });
  const words = split.words;

  // Make sure we have at least one word
  if (words.length === 0) return timeline;

  // Calculate indexes for the first and last words
  const firstWord = words[0];
  const lastWord = words[words.length - 1];

  // For single word case
  if (words.length === 1) {
    timeline
      .to(
        firstWord,
        {
          filter: `blur(${config.blurAmount}px)`,
          duration: config.blurDuration,
        },
        config.position
      )
      .to(firstWord, {
        filter: "blur(0px)",
        duration: config.blurDuration,
        delay: config.unblurDelay,
      });
    return timeline;
  }

  // For multiple words case
  const middleWords = words.slice(1, -1); // Exclude first and last words

  // Start a nested timeline to keep organization clean
  const textTl = gsap.timeline();

  // Blur first and last words first
  textTl.to([firstWord, lastWord], {
    filter: `blur(${config.blurAmount}px)`,
    duration: config.blurDuration,
  });

  // Then blur the remaining middle words if there are any
  if (middleWords.length > 0) {
    textTl.to(
      middleWords,
      {
        filter: `blur(${config.blurAmount}px)`,
        duration: config.blurDuration,
        stagger: config.stagger,
      },
      `-=${config.overlap}`
    );
  }

  // Unblur all words
  textTl.to(words, {
    filter: "blur(0px)",
    duration: config.blurDuration,
    stagger: config.stagger,
    delay: config.unblurDelay,
  });

  // Add the text timeline to the main timeline
  timeline.add(textTl, config.position);

  // Return the timeline for chaining
  return timeline;
}

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
  let animSrcs = [];

  animSrcs[0] =
    "https://cdn.prod.website-files.com/67bd5b8d3bc1bc87e30ac626/67dd038caddb4bcdcc6ece91_Lottie2-%20pathflow1.json";

  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section-h-auto.paas-header",
      start: "top center", // or any value that suits your design
      end: "bottom center",
      scrub: 0.5,
      // toggleActions: "play reverse play reverse",
      // markers: true,
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

  const paasTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".path-animating-element",
      start: "top top",
      end: "bottom bottom",
      scrub: 3,
      // markers: true,
      pin: ".path-scrolling-div",
      // pinSpacing: false,
    },
  });

  paasTl.to(".paas-bg-header", {
    autoAlpha: 0,
  });

  paasTl.fromTo(
    ".section.paas-1",
    {
      backgroundColor: "white",
      color: "2C3960",
    },
    {
      backgroundColor: "#2B399E",
      color: "white",
    }
  );

  paasTl.addLabel("play-lottie");

  paasTl.fromTo(
    "#paas-lottie-heading-container",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
    }
  );

  paasTl.fromTo(
    ".path-flow-div",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
    }
  ),
    "<";

  // integrateBlurTextAnimation(paasTl, "#paas-lottie-heading");

  paasTl.to(
    "#paas-lottie-section",
    {
      autoAlpha: 0,
    },
    "+=20"
  );

  paasTl.fromTo(
    "#paas-journey-section",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
    }
  );

  paasTl.fromTo(
    ".pass-middle-section-image",
    {
      scale: 0,
    },
    {
      scale: 1,
      duration: 5,
    },
    ">+=4"
  );

  paasTl.to("#paas-ship-content-wrapper", {
    autoAlpha: 0,
  });

  paasTl.fromTo(
    ".pass-middle-section-image",
    {
      scale: 1,
    },
    {
      scale: 5,
      duration: 10,
    }
  );

  paasTl.fromTo(
    ".paas-support-section",
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 1 },
    "-=8"
  );

  paasTl.addLabel("play-steps", "-=6");

  // integrateBlurTextAnimation(paasTl, "#paas-ship-heading");

  // Define the helper function
  function updateProgressFill(percent) {
    document.getElementById("paas-progress-fill").style.width = percent + "%";
  }

  // (Optional) Set an initial progress value if needed. For example, if step-1 is already visible:
  updateProgressFill(25);

  function updateProgressFill(percent) {
    document.getElementById("paas-progress-fill").style.width = percent + "%";
  }

  // Set initial progress value
  updateProgressFill(25);

  // Create a sub-timeline for the steps to ensure proper spacing
  const stepsTl = gsap.timeline();

  // Add steps to the sub-timeline with proper spacing
  stepsTl
    // STEP 1 is already visible, fade out
    .to(".step-1", { autoAlpha: 0, duration: 1.5 })

    // STEP 2: Fade in & out with proper spacing
    .fromTo(
      ".step-2",
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 1.5,
        onStart: () => {
          document.getElementById("update-paas-count").textContent = "02";
          updateProgressFill(50);
        },
        onReverseComplete: () => {
          document.getElementById("update-paas-count").textContent = "01";
          updateProgressFill(25);
        },
      }
    )
    .addLabel("step2Visible")
    .to(".step-2", { autoAlpha: 0, duration: 0.5 }, "+=0.5")

    // STEP 3: Fade in & out with proper spacing
    .fromTo(
      ".step-3",
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 1.5,
        onStart: () => {
          document.getElementById("update-paas-count").textContent = "03";
          updateProgressFill(75);
        },
        onReverseComplete: () => {
          document.getElementById("update-paas-count").textContent = "02";
          updateProgressFill(50);
        },
      }
    )
    .addLabel("step3Visible")
    .to(".step-3", { autoAlpha: 0, duration: 0.5 }, "+=0.5")

    // STEP 4: Fade in with proper spacing
    .fromTo(
      ".step-4",
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 1.5,
        onStart: () => {
          document.getElementById("update-paas-count").textContent = "04";
          updateProgressFill(100);
        },
        onReverseComplete: () => {
          document.getElementById("update-paas-count").textContent = "03";
          updateProgressFill(75);
        },
      }
    )
    .addLabel("step4Visible")
    // Keep step 4 visible for a while before moving on
    .to(".step-4", { autoAlpha: 1, duration: 0.5 }, "+=1");

  // Add the steps sub-timeline to the main timeline
  paasTl.add(stepsTl, "play-steps");

  paasTl.to("#paas-journey-section", {
    autoAlpha: 0,
    duration: 2,
  });

  paasTl.fromTo(
    "#paas-economics",
    {
      autoAlpha: 0,
    },
    { autoAlpha: 1 }
  );

  animSrcs[0] = lottie.loadAnimation({
    container: document.querySelector("#path-flow"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: animSrcs[0],
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  });

  animSrcs[0].addEventListener("DOMLoaded", function () {
    //console.log("Intro Loaded");

    let playhead = { frame: 0 };
    let animation = gsap.timeline().to(playhead, {
      frame: animSrcs[0].totalFrames - 1,
      ease: "none",
      duration: 20,
      onUpdate: () => animSrcs[0].goToAndStop(playhead.frame, true),
    });

    paasTl.add(animation, "play-lottie");
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });

  paasTl.to(
    "#paas-eco-heading-wrapper",
    {
      autoAlpha: 0,
    },

    "+=2"
  );

  paasTl.fromTo(
    ".bar-content-container",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
    },
    ">+=0.5"
  );

  paasTl.fromTo(
    ".h_wi-content-wrapper.is-first",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 2,
    }
  );

  paasTl.fromTo(
    ".h_wi-bar-container.is-first",
    {
      color: "#9a54116b",
    },
    {
      color: "#ff6347",
    },
    "<"
  );

  paasTl.fromTo(
    ".h_wi-content-wrapper.is-first",
    {
      autoAlpha: 1,
    },
    {
      autoAlpha: 0,
      duration: 2,
    }
  );

  paasTl.fromTo(
    ".h_wi-content-wrapper.is-second",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 2,
    }
  );

  paasTl.fromTo(
    ".h_wi-bar-container.is-second",
    {
      color: "#9a54116b",
    },
    {
      color: "#ff6347",
    },
    "<"
  );

  paasTl.to(
    ".h_wi-bar-container.is-first",
    {
      color: "#9a54116b",
    },

    "<"
  );
  // paasTl.addLabel("card2");

  paasTl.fromTo(
    ".h_wi-content-wrapper.is-second",
    {
      autoAlpha: 1,
    },
    {
      autoAlpha: 0,
      duration: 2,
    }
  );

  paasTl.fromTo(
    ".h_wi-content-wrapper.is-third",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 2,
    }
  );
  paasTl.fromTo(
    ".h_wi-bar-container.is-third",
    {
      color: "#9a54116b",
    },
    {
      color: "#ff6347",
    },
    "<"
  );

  paasTl.to(
    ".h_wi-bar-container.is-second",
    {
      color: "#9a54116b",
    },
    "<"
  );
  // paasTl.addLabel("card3");

  const faqs = document.querySelector("[data-color='egyptian-blue']");

  // Keep your existing ScrollTrigger for the blue background
  const bgTl = gsap.timeline({
    scrollTrigger: {
      trigger: faqs,
      start: "top 80%",
      end: "bottom bottom",
      scrub: 0.5,
      toggleActions: "play reverse play reverse",
      // markers: true, // Uncomment for debugging
    },
  });

  bgTl.to(document.body, { backgroundColor: "#2B399E", duration: 1 });
}

if (window.matchMedia("(max-width: 1023px)").matches) {
  gsap.to(".paas-bg-header", {
    rotation: "360deg",
    duration: 15,
    ease: "none",
    force3D: true,
    repeat: -1,
  });
}
