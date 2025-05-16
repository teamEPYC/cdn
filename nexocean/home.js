("use strict");

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

$(".span-wrapper").each(function (index) {
  let relatedEl = $(".span-element").eq(index);
  relatedEl.appendTo($(this));
});

/**
 * Integrates a blur text animation into a GSAP timeline
 * First and last words blur first, then middle words, then all unblur
 *
//  * @param {gsap.core.Timeline} timeline - The GSAP timeline to add the animation to
//  * @param {string} textSelector - CSS selector for the text element to animate
//  * @param {Object} options - Animation options
//  * @param {number} options.blurAmount - Amount of blur in pixels (default: 10)
//  * @param {number} options.blurDuration - Duration of the blur animation (default: 0.5)
//  * @param {number} options.stagger - Stagger value for words (default: 0.1)
//  * @param {number} options.overlap - Overlap between animations (default: 0.25)
//  * @param {number} options.unblurDelay - Delay before unblurring (default: 0.5)
//  * @param {string} options.position - Position in the timeline (default: "<")
//  * @returns {gsap.core.Timeline} - Returns the timeline for chaining
//  */

// function integrateBlurTextAnimation(timeline, textSelector, options = {}) {
//   // Set default options
//   const config = {
//     duration: 0.5,
//     blurAmount: options.blurAmount || 10,
//     blurDuration: options.blurDuration || 0.5,
//     stagger: options.stagger || 0.1,
//     overlap: options.overlap || 0.25,
//     unblurDelay: options.unblurDelay || 0.5,
//     position: options.position || "<", // Default to run at the same time as previous animation
//   };

//   // Create the SplitText instance
//   const split = new SplitText(textSelector, { type: "words" });
//   const words = split.words;

//   // Make sure we have at least one word
//   if (words.length === 0) return timeline;

//   // Calculate indexes for the first and last words
//   const firstWord = words[0];
//   const lastWord = words[words.length - 1];

//   // For single word case
//   if (words.length === 1) {
//     timeline
//       .to(
//         firstWord,
//         {
//           filter: `blur(${config.blurAmount}px)`,
//           duration: config.blurDuration,
//         },
//         config.position
//       )
//       .to(firstWord, {
//         filter: "blur(0px)",
//         duration: config.blurDuration,
//         delay: config.unblurDelay,
//       });
//     return timeline;
//   }

//   // For multiple words case
//   const middleWords = words.slice(1, -1); // Exclude first and last words

//   // Start a nested timeline to keep organization clean
//   const textTl = gsap.timeline();

//   // Blur first and last words first
//   textTl.to([firstWord, lastWord], {
//     filter: `blur(${config.blurAmount}px)`,
//     duration: config.blurDuration,
//   });

//   // Then blur the remaining middle words if there are any
//   if (middleWords.length > 0) {
//     textTl.to(
//       middleWords,
//       {
//         filter: `blur(${config.blurAmount}px)`,
//         duration: config.blurDuration,
//         stagger: config.stagger,
//       },
//       `-=${config.overlap}`
//     );
//   }

//   // Unblur all words
//   textTl.to(words, {
//     filter: "blur(0px)",
//     duration: config.blurDuration,
//     stagger: config.stagger,
//     delay: config.unblurDelay,
//   });

//   // Add the text timeline to the main timeline
//   timeline.add(textTl, config.position);

//   // Return the timeline for chaining
//   return timeline;
// }

if (window.matchMedia("(min-width: 1024px)").matches) {
  gsap.registerPlugin(ScrollToPlugin);
  // const { transform } = require("typescript");

  // fix lenis in safari

  var animSrcs = [];

  animSrcs[0] =
    "https://cdn.prod.website-files.com/67bd5b8d3bc1bc87e30ac626/67c95dcddc432e8abbf959cc_Lottie1%20-%20block%20animation%20UPDATED2.json";

  animSrcs[1] =
    "https://cdn.prod.website-files.com/67bd5b8d3bc1bc87e30ac626/67c968b63ae8d4f607518d9f_Lottie-Block.json";

  animSrcs[2] =
    "https://cdn.prod.website-files.com/67bd5b8d3bc1bc87e30ac626/67d27b6dc887c02ae3998916_webp.json";

  animSrcs[3] =
    "https://cdn.prod.website-files.com/67bd5b8d3bc1bc87e30ac626/680ca4758d4fd6f40d5963c4_kal%20lottie.json";

  gsap.to(".hero-bg", {
    scale: 2.5,
    rotation: "0deg",
    duration: 2,
    ease: "power2.out",
  });

  // GSAP Animation Timeline
  const homeTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".main-animating-element",
      start: "top top",
      end: "bottom bottom",
      scrub: 3,
      pin: ".scrolling-div",
      // markers: true,
      pinSpacing: true,
    },
  });

  // integrateBlurTextAnimation(homeTl, "#hero-section-heading");

  homeTl.to(
    "#hero-section",
    {
      scale: 1.5,
      autoAlpha: 0,
      ease: "none",
      duration: 0.5,
    },
    "start"
  );

  // integrateBlurTextAnimation(homeTl, "#hero-section-heading");

  homeTl.fromTo(
    "#for-founders-content-div",
    { autoAlpha: 0, scale: 0 },
    { scale: 1, autoAlpha: 1, ease: "power1.out" },
    "start+=0.8"
  );

  homeTl.fromTo(
    ".star-image:nth-child(1)",
    { height: "0%", opacity: 0 },
    { height: "200%", opacity: 1, ease: "power2.out" },
    "start+=0.8"
  );

  homeTl.fromTo(
    ".star-image:nth-child(2)",
    { height: "0%", opacity: 0 },
    { height: "160%", opacity: 1, ease: "power2.out" },
    "start+=1.2" // 0.2 seconds after "start"
  );

  homeTl.fromTo(
    ".star-image:nth-child(3)",
    { height: "0%", opacity: 0 },
    { height: "120%", opacity: 1, ease: "power2.out" },
    "start+=1.6" // 0.4 seconds after "start"
  );

  // Step 3: Zoom-In Effect for `#for-founders-content-div`
  homeTl.to(
    "#for-founders-content-div",
    {
      scale: 1.5,
      autoAlpha: 0,
      ease: "power1.out",
    },
    ">"
  );

  homeTl.to(
    ".star-image:nth-child(1)",

    { height: "300%", opacity: 0, ease: "power2.out", duration: 1.4 },
    ">"
  );

  homeTl.to(
    ".star-image:nth-child(2)",

    { height: "300%", opacity: 1, ease: "power2.out", duration: 1.4 },
    "<"
  );
  homeTl.to(
    ".star-image:nth-child(3)",

    { height: "280%", opacity: 1, ease: "power2.out", duration: 1.4 },
    "<"
  );

  homeTl.to(
    "#ship-content-container",

    { opacity: 1, ease: "power2.out", duration: 1.4, zIndex: 100 },
    "<"
  );

  // Step 5:
  homeTl.fromTo(
    ".hp-bg-circle-image",
    { scale: 0, rotation: 360 },
    { scale: 1, rotation: 0 }
  );

  const stars = document.querySelectorAll(".stars-image");
  // Step 6: Improved section color transition
  homeTl.to("#ship-content-container", { opacity: 0, zIndex: 0 }, "<");
  stars.forEach((star, index) => {
    let heights = ["450%", "430%"];
    homeTl.to(
      star,
      {
        height: heights[index] || "100%",
        ease: "power2.out",
        delay: index * 0.1,
      },
      "<"
    );
  });

  // Step 7: Improved section color transition
  homeTl.to(".color-change-div", { opacity: 1 }, "<");

  document.documentElement.style.setProperty(
    "--nav-color",
    "black",
    "important"
  );
  document.documentElement.style.setProperty(
    "--brand-color",
    "var(--egyptian-blue)",
    "important"
  );

  homeTl
    .to([".nav-link", ".nav-dd-toggle"], { color: "var(--nav-color)" }, "<")
    .to(".brand-logo", { color: "var(--brand-color)" }, "<");

  //Step 8: Change bg image circle from white to black
  homeTl.to(
    ".hp-bg-circle-image",
    {
      color: "black", // Change SVG color via currentColor property
      ease: "power2.out",
    },
    "<"
  );

  // Step 10: Improved section color transition
  homeTl.fromTo(
    ".blur-image",
    {
      autoAlpha: 0,
      ease: "power2.out",
      display: "none",
    },
    {
      autoAlpha: 1,
      ease: "power2.out",
      display: "block",
    }
  );

  // Step 11: Improved section color transition
  homeTl.fromTo(
    "#elite-roadmap-container",
    {
      autoAlpha: 0,
      ease: "power2.out",
      zIndex: 0,
    },
    {
      autoAlpha: 1,
      // duration: 3,
      ease: "power2.out",
      zIndex: 80,
    }
  );

  // integrateBlurTextAnimation(homeTl, "#elite-heading");
  // Step 12: Improved section color transition
  homeTl.fromTo(
    "#elite-roadmap-container",
    {
      opacity: 1,
      ease: "power2.out",
    },
    {
      opacity: 0,
      ease: "power2.out",
    }
  ),
    "+=2";

  // Step 13: Improved section color transition
  homeTl.fromTo(
    ".blur-image",
    {
      opacity: 1,
      ease: "power2.out",
    },
    {
      opacity: 0,
      ease: "power2.out",
    },
    "<"
  );

  // Step 14: Improved section color transition
  homeTl.fromTo(
    ".hp-bg-circle-image",
    { scale: 1, opacity: 1 },
    { scale: 50, opacity: 0, duration: 3 }
  );

  homeTl.addLabel("play-lottie", "-=2");
  // Add an explicit label before playing Lottie
  homeTl.fromTo(
    "#steps-lottie",
    { opacity: 0 },
    { opacity: 1, duration: 0.5 },
    "-=2"
  );

  // Fade in Lottie
  // homeTl.addLabel("play-lottie"); // Label where Lottie animation starts

  homeTl.fromTo(
    "#steps-lottie",
    { opacity: 1 },
    { opacity: 0, duration: 0.5 },
    "+=7"
  );

  animSrcs[0] = lottie.loadAnimation({
    container: document.querySelector("#steps-lottie"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: animSrcs[0],
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  });

  const stepsElements = document.querySelectorAll(".is-steps-absolute");
  const progressFill = document.querySelector(".progress-fill-header-right");

  animSrcs[0].addEventListener("DOMLoaded", function () {
    console.log("Intro Loaded");

    let totalFrames = 271;
    let segmentFrames = totalFrames / 3; // 300 frames per part
    let playhead = { frame: 20 };

    let animation = gsap.timeline();

    function updateStepsOpacity() {
      let currentSegment = Math.floor(playhead.frame / segmentFrames); // Determine current segment (0,1,2)
      stepsElements.forEach((el, index) => {
        el.style.opacity = index === currentSegment ? 1 : 0;
      });
    }

    function updateWidth() {
      if (progressFill) {
        let currentSegment = Math.floor(playhead.frame / segmentFrames);
        if (currentSegment === 0) {
          progressFill.style.width = "33%";
        } else if (currentSegment === 1) {
          progressFill.style.width = "66%";
        } else if (currentSegment >= 2) {
          progressFill.style.width = "100%";
        }
      }
    }

    function updateCurrentProgressText() {
      // Determine the current segment from playhead and segmentFrames
      let currentSegment = Math.floor(playhead.frame / segmentFrames);
      // Select the element that displays the current progress text
      const progressTextElement = document.querySelector(
        ".current-progress-text"
      );
      if (progressTextElement) {
        // Format the slide number as two digits (e.g., "01")
        let slideNumber = currentSegment + 1;
        progressTextElement.textContent =
          slideNumber < 10 ? "0" + slideNumber : slideNumber;
      }
    }

    // Play 4 segments of 300 frames each
    animation
      .to(playhead, {
        frame: segmentFrames, // 0 → 300
        ease: "none",
        duration: 3,
        onUpdate: () => {
          animSrcs[0].goToAndStop(playhead.frame, true);
          updateStepsOpacity();
          updateWidth();
          updateCurrentProgressText();
        },
      })
      .to(playhead, {
        frame: segmentFrames * 2, // 300 → 600
        ease: "none",
        duration: 3,
        onUpdate: () => {
          animSrcs[0].goToAndStop(playhead.frame, true);
          updateStepsOpacity();
          updateWidth();
          updateCurrentProgressText();
        },
      })
      .to(playhead, {
        frame: totalFrames - 1, // 600 → 900
        ease: "none",
        duration: 3,
        onUpdate: () => {
          animSrcs[0].goToAndStop(playhead.frame, true);
          updateStepsOpacity();
          updateWidth();
          updateCurrentProgressText();
        },
      });

    // Add Lottie animation to homeTl at the "play-lottie" label
    homeTl.add(animation, "play-lottie");

    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });

  // Cards stacking animation from left and right -----

  gsap.utils.toArray(".solutions-card.is-below").forEach((card, index) => {
    let isLeft = index % 2 === 0; // Even index (0-based) means it's on the left
    let offset = (index + 1) * 20; // Increasing offset for each subsequent element

    gsap.fromTo(
      card,
      { x: isLeft ? -offset : offset }, // Apply increasing offset
      {
        x: 0, // Back to original position
        scrollTrigger: {
          trigger: card,
          start: "bottom bottom", // Adjust as per requirement
          end: "40% 80%",
          scrub: 2,
        },
      }
    );
  });

  gsap.to("#solution-cards-section", {
    scrollTrigger: {
      trigger: "#solution-cards-section",
      start: "60% 70%",
      end: "+=300",
      scrub: true,
      // markers: true,
    },
    duration: 0.5,
    backgroundColor: "#ffffff",
    ease: "none",
  });

  // Define the GSAP timeline with ScrollTrigger integration.
  const thirdHomeTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".second-scrolling-div",
      start: "top top",
      end: "bottom bottom",
      scrub: 3,
      // markers: true,
      pin: ".second-pinner",
    },
  });

  // Select all your steps (e.g. 3 steps total)

  // Ensure animSrcs is defined and path is correct before this script.
  animSrcs[1] = lottie.loadAnimation({
    container: document.querySelector("#block-lottie"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: animSrcs[1], // Ensure this is the correct path to the animation JSON.
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  });

  // Wait for the DOM to load the animation.

  animSrcs[1].addEventListener("DOMLoaded", function () {
    console.log("Intro Loaded");

    let totalFrames = 300;
    let segmentFrames = totalFrames / 3;
    let playhead = { frame: 0 };

    // If you have exactly 3 steps and you want them to jump to frames 50, 150, and 280:
    const targetFrames = [50, 120, 220];

    // Select steps
    const steps = document.querySelectorAll(".h_blocks-bar .h_block-steps");

    function updateBlocksBar() {
      // Determine the current segment (0, 1, or 2)
      let currentSegment = Math.floor(playhead.frame / segmentFrames);
      currentSegment = Math.max(0, Math.min(currentSegment, steps.length - 1));

      // Toggle active step
      steps.forEach((step, i) => {
        step.classList.toggle("is-active", i === currentSegment);
      });

      // Toggle visibility of link blocks
      document.querySelectorAll(".lottie-link-block").forEach((link) => {
        link.style.display = "none";
      });

      const activeLink = document.querySelector(
        `.lottie-link-block.is-${currentSegment + 1}`
      );
      if (activeLink) {
        activeLink.style.display = "block";
      }
    }

    // Build the GSAP timeline for scroll-based Lottie animation
    let animation2 = gsap.timeline();

    // Segment 1
    animation2.to(playhead, {
      frame: segmentFrames,
      ease: "none",
      duration: 3,
      onUpdate: () => {
        animSrcs[1].goToAndStop(Math.floor(playhead.frame), true);
        updateBlocksBar();
      },
    });

    // Segment 2
    animation2.to(playhead, {
      frame: segmentFrames * 2,
      ease: "none",
      duration: 3,
      onUpdate: () => {
        animSrcs[1].goToAndStop(Math.floor(playhead.frame), true);
        updateBlocksBar();
      },
    });

    // Segment 3
    animation2.to(playhead, {
      frame: totalFrames - 1,
      ease: "none",
      duration: 3,
      onUpdate: () => {
        animSrcs[1].goToAndStop(Math.floor(playhead.frame), true);
        updateBlocksBar();
      },
    });

    // Add to the main timeline
    thirdHomeTl.add(animation2, "play-lottie-2");

    // --- Handle clicks to jump to custom frames ---
    // steps.forEach((step, i) => {
    //   step.addEventListener("click", () => {
    //     let targetFrame = targetFrames[i] || 0; // fallback if no frame is defined
    //     // Smoothly tween the playhead to the desired frame
    //     gsap.to(playhead, {
    //       frame: targetFrame,
    //       duration: 1,
    //       ease: "power1.inOut",
    //       onUpdate: () => {
    //         animSrcs[1].goToAndStop(Math.floor(playhead.frame), true);
    //         updateBlocksBar();
    //       },
    //     });
    //   });
    // });
  });

  thirdHomeTl.to("#stage-growth-section", {
    autoAlpha: 0,
    duration: 1,
    delay: 2,
  });
  // integrateBlurTextAnimation(thirdHomeTl, "#stage-growth-heading");

  // Add the animation timeline at the defined label.
  thirdHomeTl.addLabel("play-lottie-2");

  thirdHomeTl.to("#block-lottie-section", {
    // scale: 1.5,
    autoAlpha: 0,
    ease: "power1.out",
    duration: 1.5,
    delay: 9,
  });

  // integrateBlurTextAnimation(thirdHomeTl, "#playbook-heading");

  thirdHomeTl.to(
    "#playbook-content-container",
    {
      opacity: 0,
      ease: "power2.out",
    },
    "=+1"
  );

  thirdHomeTl.to(
    ".left-arrow",
    {
      top: "50%", // Adjust according to the desired final position
      left: "50%", // Adjust according to the desired final position
      x: "-50%", // Using GSAP's x percent to shift back 50% of its own width
      y: "-50%", // Using GSAP's y percent to shift back 50% of its own height
      ease: "power1.out",
      duration: 1.5,
    },
    "<"
  );

  thirdHomeTl.to(
    ".right-arrow",
    {
      top: "45%", // Align vertically in the middle
      right: "45%", // Moves the right edge to the middle of the container
      x: "50%", // Since right is at 50%, x translation needs to be 0 to center based on width
      y: "-50%", // Center based on its height
      ease: "power1.out",
      duration: 1.5,
    },
    "<" // Start at the same time as the previous animation in the timeline
  );

  thirdHomeTl.to(
    [".left-arrow", ".right-arrow"], // Select both elements
    {
      scale: 10,
      ease: "power1.out",
      duration: 5,
    }
    // Optionally synchronize this animation with the previous ones
  );

  thirdHomeTl.fromTo(
    "#lifafa-section",
    { autoAlpha: 0 }, // Initial state: fully transparent and not interacting
    {
      autoAlpha: 1, // Final state: fully visible
      duration: 1, // Duration of the transition, in seconds
      ease: "power1.inOut", // Optional: easing function for a smooth transition
    }
  ),
    "<-=5";

  thirdHomeTl
    .to([".nav-link", ".nav-dd-toggle"], { color: "white" }, "<-=1") // Change nav links to white
    .to(".brand-logo", { color: "var(--vanilla)" }, "<-=1");

  thirdHomeTl.fromTo(
    ".envelop-card-container.is-first",
    {
      bottom: "-100%",
    },
    {
      bottom: "-10%",
      duration: 2, // Corrected 'durtation' to 'duration'
    }
  ),
    "=+1";

  thirdHomeTl.fromTo(
    ".envelop-card-container.is-second",
    {
      bottom: "-200%",
    },
    {
      bottom: "-10%",
      duration: 2, // Assuming you want the same duration here; it's a good practice to specify it.
    }
  );

  thirdHomeTl.to(
    ".envelop-card-container.is-first",
    {
      rotate: "-3deg",
      // bottom: "-8%", // Specifying unit 'deg' for rotation
    }
    // This assumes you want this animation to start at the same time as the previous one
  );

  thirdHomeTl.fromTo(
    ".envelop-card-container.is-third",
    {
      bottom: "-300%",
    },
    {
      bottom: "-10%",
      duration: 2, // Assuming you want the same duration here; it's a good practice to specify it.
    }
  );

  thirdHomeTl.to(
    ".envelop-card-container.is-first",
    {
      rotate: "-3deg",
      // bottom: "-6%", // Specifying unit 'deg' for rotation
    }
    // This assumes you want this animation to start at the same time as the previous one
  );
  thirdHomeTl.to(
    ".envelop-card-container.is-second",
    {
      rotate: "3deg",
      // bottom: "-8%", // Specifying unit 'deg' for rotation
    },
    "<" // This assumes you want this animation to start at the same time as the previous one
  );

  thirdHomeTl.fromTo(
    ".envelop-card-container.is-fourth",
    {
      bottom: "-400%",
    },
    {
      bottom: "-10%",
      duration: 2, // Assuming you want the same duration here; it's a good practice to specify it.
    }
  );

  thirdHomeTl.to(
    ".envelop-card-container.is-first",
    {
      rotate: "-6deg",
      // bottom: "-4%", // Specifying unit 'deg' for rotation
    }
    // This assumes you want this animation to start at the same time as the previous one
  );
  thirdHomeTl.to(
    ".envelop-card-container.is-second",
    {
      rotate: "4deg",
      // bottom: "-6%", // Specifying unit 'deg' for rotation
    },
    "<" // This assumes you want this animation to start at the same time as the previous one
  );
  thirdHomeTl.to(
    ".envelop-card-container.is-third",
    {
      rotate: "-3deg",
      // bottom: "-8%", // Specifying unit 'deg' for rotation
    },
    "<" // This assumes you want this animation to start at the same time as the previous one
  );

  thirdHomeTl.to(
    "#lifafa-section",
    {
      autoAlpha: 0,
    },
    "=+2"
  );

  thirdHomeTl.fromTo(
    "#logo-section",
    {
      autoAlpha: 0,
      // opacity: 0,
    },
    {
      autoAlpha: 1,
      // opacity: 1,
    }
  );

  // First, integrate the blur text animation on the heading.
  // integrateBlurTextAnimation(thirdHomeTl, "#why-nexocean-heading");

  // Then, fade out the heading after a delay.
  thirdHomeTl.to("#why-nexocean-heading", {
    autoAlpha: 0,
    delay: 1,
  });

  // integrateBlurTextAnimation(thirdHomeTl, "#why-nexocean-heading");

  // Finally, fade in the next content.
  thirdHomeTl.fromTo(
    ".nexocean-content-container",
    { autoAlpha: 0 },
    { autoAlpha: 1 }
  );

  thirdHomeTl.addLabel("play-lottie-3");

  // Initialize a counter
  var currentStep = "01";

  // Update function to change the content of the counter element
  function updateCounter() {
    const counterEl = document.getElementById("update-count-nex-ocean");
    const progressEl = document.querySelector(".progress-fill");
    // Update counter text
    if (counterEl) counterEl.textContent = currentStep;
    // Calculate progress based on 7 steps
    if (progressEl) {
      const stepNum = parseInt(currentStep, 10) || 0;
      const progressPercent = (stepNum / 7) * 100;
      progressEl.style.width = progressPercent + "%";
    }
  }

  animSrcs[2] = lottie.loadAnimation({
    container: document.querySelector("#logo-lottie"),
    renderer: "canvas",
    loop: false,
    autoplay: false,
    path: animSrcs[2], // Ensure this is the correct path to the animation JSON.
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  });

  animSrcs[2].addEventListener("DOMLoaded", function () {
    console.log("Intro Loaded");

    const totalFrames = 312;
    const segments = 9; // 9 segments for better UX
    const segmentFrames = totalFrames / segments;
    const playhead = { frame: 0 };

    // Get all the containers (assumed to be 7 in total)
    const containers = document.querySelectorAll(".nex-ocean-para-container");

    // Initialize: show the first container and set currentStep to "01"
    if (containers.length > 0) {
      containers.forEach((el, idx) => {
        el.style.opacity = idx === 0 ? 1 : 0;
      });
    }
    currentStep = "01";
    updateCounter();

    const animation3 = gsap.timeline();

    // Loop over segments using index from 0 to segments - 1
    for (let i = 0; i < segments; i++) {
      let targetFrame = (i + 1) * segmentFrames;
      // Ensure the last segment ends at totalFrames - 1
      if (i === segments - 1) {
        targetFrame = totalFrames - 1;
      }
      // Animate to the next segment
      animation3.to(playhead, {
        frame: targetFrame,
        ease: "none",
        duration: 3,
        onUpdate: () =>
          animSrcs[2].goToAndStop(Math.floor(playhead.frame), true),
      });
      // After each segment, update counter and show the corresponding container
      animation3.call(() => {
        const stepNum = i + 1;
        if (stepNum > 7) {
          // If we've passed step 7, fix counter at "07" and show the last container (index 6)
          currentStep = "07";
          updateCounter();
          containers.forEach((el, idx) => {
            el.style.opacity = idx === 6 ? 1 : 0;
          });
        } else {
          // Otherwise, update normally using a two-digit format
          currentStep = stepNum < 10 ? "0" + stepNum : "" + stepNum;
          updateCounter();
          // Show the container corresponding to this step (index i) and hide others
          containers.forEach((el, idx) => {
            el.style.opacity = idx === i ? 1 : 0;
          });
        }
      });
    }

    thirdHomeTl.add(animation3, "play-lottie-3");

    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });

  thirdHomeTl.to(
    "#logo-section",
    {
      autoAlpha: 0,
    },
    "+=23"
  );

  thirdHomeTl.fromTo(
    ".section-100vh.is-eight",
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 2, ease: "power1.out" }
  );

  thirdHomeTl
    .to([".nav-link", ".nav-dd-toggle"], { color: "var(--nav-color)" }, "<")
    .to(".brand-logo", { color: "var(--brand-color)" }, "<");

  // let animPath = document.querySelectorAll(".h_wi-svg .anim-path");

  // thirdHomeTl.to(, {
  //   rotation: 90,
  //   ease: "none",
  //   transformOrigin: "center center",
  //   duration: 1, // Adjust duration as needed
  // });

  animSrcs[3] = lottie.loadAnimation({
    container: document.querySelector("#kal-lottie"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: animSrcs[3], // Ensure this is the correct path to the animation JSON.
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  });

  animSrcs[3].addEventListener("DOMLoaded", function () {
    console.log("Fourth Lottie Loaded");

    const totalFrames = 301;
    const segmentFrames = totalFrames / 4; // 4 segments for 4 divs
    const playhead = { frame: 0 };

    // Force last frame = same as 0 frame
    const frameMap = [0, 75, 150, 225, 0]; // Approx 0, 75, 150, 225, back to 0

    const hwWrappers = document.querySelectorAll(".h_wi-content-wrapper");

    // Hide all except first initially
    hwWrappers.forEach((el, idx) => {
      el.style.opacity = idx === 0 ? 1 : 0;
    });

    const lottieTimeline = gsap.timeline();

    // Loop through 4 cards
    for (let i = 0; i < 4; i++) {
      lottieTimeline.to(playhead, {
        frame: frameMap[i + 1],
        ease: "none",
        duration: 10, // Adjust scroll duration
        onUpdate: () => {
          animSrcs[3].goToAndStop(Math.floor(playhead.frame), true);
        },
        onStart: () => {
          // Update which wrapper is visible
          hwWrappers.forEach((el, idx) => {
            el.style.opacity = idx === i ? 1 : 0;
          });
        },
      });
    }

    // Add to your existing `thirdHomeTl`
    thirdHomeTl.add(lottieTimeline, "card1+=0.2");

    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });

  thirdHomeTl.to("#home-why-india-content-wrapper", {
    autoAlpha: 0,
  });

  thirdHomeTl.fromTo(
    ".h_why-india-data-container",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 2,
    }
  );

  thirdHomeTl.fromTo(
    ".h_wi-content-wrapper.is-first",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 6,
    }
  );
  thirdHomeTl.fromTo(
    ".h_wi-bar-container.is-first",
    {
      color: "#9a54116b",
    },
    {
      color: "#ff6347",
    },
    "<"
  );
  thirdHomeTl.addLabel("card1");

  thirdHomeTl.fromTo(
    ".h_wi-content-wrapper.is-first",
    {
      autoAlpha: 1,
    },
    {
      autoAlpha: 0,
    }
  );

  // thirdHomeTl.addLabel("card1");

  thirdHomeTl.fromTo(
    ".h_wi-content-wrapper.is-second",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 6,
    }
  );

  thirdHomeTl.fromTo(
    ".h_wi-bar-container.is-second",
    {
      color: "#9a54116b",
    },
    {
      color: "#ff6347",
    },
    "<"
  );

  thirdHomeTl.to(
    ".h_wi-bar-container.is-first",
    {
      color: "#9a54116b",
    },

    "<"
  );
  thirdHomeTl.addLabel("card2");

  thirdHomeTl.fromTo(
    ".h_wi-content-wrapper.is-second",
    {
      autoAlpha: 1,
    },
    {
      autoAlpha: 0,
    }
  );

  // thirdHomeTl.addLabel("card2");

  thirdHomeTl.fromTo(
    ".h_wi-content-wrapper.is-third",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 6,
    }
  );
  thirdHomeTl.fromTo(
    ".h_wi-bar-container.is-third",
    {
      color: "#9a54116b",
    },
    {
      color: "#ff6347",
    },
    "<"
  );

  thirdHomeTl.to(
    ".h_wi-bar-container.is-second",
    {
      color: "#9a54116b",
    },

    "<"
  );

  thirdHomeTl.addLabel("card3");

  thirdHomeTl.fromTo(
    ".h_wi-content-wrapper.is-third",
    {
      autoAlpha: 1,
    },
    {
      autoAlpha: 0,
    }
  );
  // thirdHomeTl.addLabel("card3");

  thirdHomeTl.fromTo(
    ".h_wi-content-wrapper.is-fourth",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 6,
    }
  );
  thirdHomeTl.fromTo(
    ".h_wi-bar-container.is-fourth",
    {
      color: "#9a54116b",
    },
    {
      color: "#ff6347",
    },
    "<"
  );

  thirdHomeTl.to(
    ".h_wi-bar-container.is-third",

    {
      color: "#9a54116b",
    },
    "<"
  );

  thirdHomeTl.addLabel("card4");

  // thirdHomeTl.addLabel("card4");

  thirdHomeTl.to(".h_why-india-data-container", {
    opacity: 0,
  });

  thirdHomeTl.to("#kal-lottie", {
    scale: 2.5,
  });

  thirdHomeTl.fromTo(
    "#home-report-content-wrapper",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
    }
  ),
    "<";
}

if (window.matchMedia("(max-width: 1023px)").matches) {
  // GSAP Animation Timeline
  const homeTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".main-animating-element.is-mobile",
      start: "top top",
      end: "bottom bottom",
      scrub: 3,
      pin: ".scrolling-div.is-mobile",
      // markers: true,
      pinSpacing: true,
    },
  });

  homeTl.to(
    "#hero-section",
    {
      scale: 1.5,
      autoAlpha: 0,
      ease: "power1.out",
      duration: 1.5,
    },
    "start"
  );

  // integrateBlurTextAnimation(homeTl, "#hero-section-heading");

  homeTl.fromTo(
    "#for-founders-content-div",
    { autoAlpha: 0, scale: 0 },
    { scale: 1, autoAlpha: 1, ease: "power1.out" },
    "start+=0.8"
  );

  homeTl.fromTo(
    ".star-image:nth-child(1)",
    { height: "0%", opacity: 0 },
    { height: "200%", opacity: 1, ease: "power2.out", duration: 1.4 },
    "start+=0.8"
  );

  homeTl.fromTo(
    ".star-image:nth-child(2)",
    { height: "0%", opacity: 0 },
    { height: "160%", opacity: 1, ease: "power2.out", duration: 1.2 },
    "start+=1.2" // 0.2 seconds after "start"
  );

  homeTl.fromTo(
    ".star-image:nth-child(3)",
    { height: "0%", opacity: 0 },
    { height: "120%", opacity: 1, ease: "power2.out", duration: 1 },
    "start+=1.6" // 0.4 seconds after "start"
  );

  // Step 3: Zoom-In Effect for `#for-founders-content-div`
  homeTl.to(
    "#for-founders-content-div",
    {
      scale: 1.5,
      autoAlpha: 0,
      ease: "power1.out",
    },
    ">"
  );

  homeTl.to(
    ".star-image:nth-child(1)",

    { height: "300%", opacity: 1, ease: "power2.out", duration: 1.4 },
    ">"
  );

  homeTl.to(
    ".star-image:nth-child(2)",

    { height: "280%", opacity: 1, ease: "power2.out", duration: 1.4 },
    "<"
  );
  homeTl.to(
    ".star-image:nth-child(3)",

    { height: "300%", opacity: 0, ease: "power2.out", duration: 1.4 },
    "<"
  );

  homeTl.to(
    "#ship-content-container",

    { opacity: 1, ease: "power2.out", duration: 1.4, zIndex: 100 },
    "<"
  );

  // Step 5:
  homeTl.fromTo(
    ".hp-bg-circle-image",
    { scale: 0, rotation: 360 },
    { scale: 1, rotation: 0 }
  );

  const stars = document.querySelectorAll(".stars-image");
  // Step 6: Improved section color transition
  homeTl.to("#ship-content-container", { opacity: 0 }, "<");
  stars.forEach((star, index) => {
    let heights = ["450%", "430%"];
    homeTl.to(
      star,
      {
        height: heights[index] || "100%",
        ease: "power2.out",
        delay: index * 0.1,
      },
      "<"
    );
  });

  // Step 7: Improved section color transition
  homeTl.to(".color-change-div", { opacity: 1 }, "<");

  document.documentElement.style.setProperty(
    "--nav-color",
    "black",
    "important"
  );
  document.documentElement.style.setProperty(
    "--brand-color",
    "var(--egyptian-blue)",
    "important"
  );

  homeTl
    .to([".nav-link", ".nav-dd-toggle"], { color: "var(--nav-color)" }, "<")
    .to(".brand-logo", { color: "var(--brand-color)" }, "<");

  //Step 8: Change bg image circle from white to black
  homeTl.to(
    ".hp-bg-circle-image",
    {
      color: "black", // Change SVG color via currentColor property
      ease: "power2.out",
    },
    "<"
  );

  // Step 10: Improved section color transition
  homeTl.fromTo(
    ".blur-image",
    {
      opacity: 0,
      ease: "power2.out",
      display: "none",
    },
    {
      opacity: 1,
      ease: "power2.out",
      display: "block",
    }
  );

  // Step 11: Improved section color transition
  homeTl.fromTo(
    "#elite-roadmap-container",
    {
      opacity: 0,
      ease: "power2.out",
      zIndex: 0,
    },
    {
      opacity: 1,
      ease: "power2.out",
      zIndex: 80,
    }
  );
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
