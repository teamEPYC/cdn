gsap.registerPlugin(ScrollToPlugin);
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

// document.documentElement.style.setProperty("--nav-color", "black", "important");
// document.documentElement.style.setProperty(
//   "--brand-color",
//   "var(--egyptian-blue)",
//   "important"
// );

let animSrcs = [];

animSrcs[0] =
  "https://cdn.prod.website-files.com/67bd5b8d3bc1bc87e30ac626/67dd038caddb4bcdcc6ece91_Lottie2-%20pathflow1.json";

// gsap.to([".nav-link", ".nav-dd-toggle"], { color: "var(--nav-color)" }, "<");
// gsap.to(".brand-logo", { color: "var(--brand-color)" }, "<");

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
if (window.matchMedia("(min-width: 1024px)").matches) {
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

  // paasTl
  //   .to([".nav-link", ".nav-dd-toggle"], { color: "var(--white)" }, "<")
  //   .to(".brand-logo", { color: "var(--vanilla)" }, "<");

  paasTl.fromTo(
    ".section.paas-1",
    {
      backgroundColor: "white",
    },
    {
      backgroundColor: "#2B399E",
    }
  );

  paasTl.to(
    ".section-h-auto.paas-header",
    {
      backgroundColor: "#2B399E",
    },
    "<"
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

  paasTl.to(
    "#paas-lottie-section",
    {
      autoAlpha: 0,
    },
    "+=10"
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

  // paasTl
  //   .to([".nav-link", ".nav-dd-toggle"], { color: "var(--nav-color)" }, "<")
  //   .to(".brand-logo", { color: "var(--brand-color)" }, "<");

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
      duration: 3.1,
    }
  );

  paasTl.fromTo(
    ".paas-support-section",
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 1 }
  );

  // Define the helper function
  function updateProgressFill(percent) {
    document.getElementById("paas-progress-fill").style.width = percent + "%";
  }

  // (Optional) Set an initial progress value if needed. For example, if step-1 is already visible:
  updateProgressFill(25);

  // Then, in your timeline for the steps, call the function:
  paasTl
    // STEP 1 fades out after 1 second (assumes step-1 is visible)
    .to(".step-1", { autoAlpha: 0, duration: 1 }, "+=1")

    // STEP 2: Fade in & out
    .fromTo(
      ".step-2",
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 1,
        onStart: () => {
          document.getElementById("update-paas-count").textContent = "02";
          // Update progress to 50% when step-2 starts
          updateProgressFill(50);
        },
        onReverseComplete: () => {
          document.getElementById("update-paas-count").textContent = "01";
          // When reversing from step-2, reset progress to 25%
          updateProgressFill(25);
        },
      }
    )
    .to(".step-2", { autoAlpha: 0, duration: 1 }, "+=1")

    // STEP 3: Fade in & out
    .fromTo(
      ".step-3",
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 1,
        onStart: () => {
          document.getElementById("update-paas-count").textContent = "03";
          // Update progress to 75% when step-3 starts
          updateProgressFill(75);
        },
        onReverseComplete: () => {
          document.getElementById("update-paas-count").textContent = "02";
          // When reversing from step-3, reset progress to 50%
          updateProgressFill(50);
        },
      }
    )
    .to(".step-3", { autoAlpha: 0, duration: 1 }, "+=1")

    // STEP 4: Fade in (and optionally fade out)
    .fromTo(
      ".step-4",
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 1,
        onStart: () => {
          document.getElementById("update-paas-count").textContent = "04";
          // Update progress to 100% when step-4 starts
          updateProgressFill(100);
        },
        onReverseComplete: () => {
          document.getElementById("update-paas-count").textContent = "03";
          // When reversing from step-4, reset progress to 75%
          updateProgressFill(75);
        },
      }
    );

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
      preserveAspectRatio: "xMidYMid slice",
    },
  });

  animSrcs[0].addEventListener("DOMLoaded", function () {
    //console.log("Intro Loaded");

    let playhead = { frame: 0 };
    let animation = gsap.timeline().to(playhead, {
      frame: animSrcs[0].totalFrames - 1,
      ease: "none",
      duration: 10,
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
    ">+=2"
  );

  paasTl.to(
    ".h_wi-content-wrapper.is-first",

    {
      autoAlpha: 1,
      duration: 3,
    }
  );
  // paasTl.addLabel("card1");

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
    }
  );

  paasTl.fromTo(
    ".h_wi-content-wrapper.is-second",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 3,
    }
  );
  // paasTl.addLabel("card2");

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

  paasTl.fromTo(
    ".h_wi-content-wrapper.is-second",
    {
      autoAlpha: 1,
    },
    {
      autoAlpha: 0,
    }
  );

  // paasTl.addLabel("card3");

  paasTl.fromTo(
    ".h_wi-content-wrapper.is-third",
    {
      autoAlpha: 0,
    },
    {
      autoAlpha: 1,
      duration: 3,
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
