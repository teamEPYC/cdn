gsap.registerPlugin(ScrollTrigger, ScrollToPlugin); // Ensure ScrollTrigger is registered

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
    "https://cdn.prod.website-files.com/67bd5b8d3bc1bc87e30ac626/6801091fe69934213c100d04_Nexocean%20-%20Lottie10_Pathflow4_CareersPageUpdated.json";

  // Set initial state
  gsap.set(".c-header-pattern", { autoAlpha: 0 });
  gsap.set(".c-value-image", { autoAlpha: 0, rotate: "-90deg" });
  gsap.set(".c-value-image.is-1", { autoAlpha: 1, rotate: "0" });
  gsap.set(".c-header-pattern.is-1", {
    autoAlpha: 1,
    duration: 2,
  });

  // Create the timeline with ScrollTrigger
  const carTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-animating-element",
      pin: ".career-scrolling-div",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      // markers: true, // Optional: for debugging
    },
  });

  // Animation sequence

  carTl
    // .from(".c-header-span.is-1", {
    //   autoAlpha: 0,
    //   duration: 2,
    // })

    .fromTo(
      ".c-header-span.is-1",
      {
        left: "50%",
        xPercent: -50,
      },
      {
        left: "0%",
        xPercent: 0,
      }
    )

    .to(".c-header-span.is-2, .c-header-span.is-3", {
      opacity: 1,
    })

    .to(
      ".c-header-pattern.is-2",
      {
        autoAlpha: 1,
        duration: 2,
      },
      "<"
    )

    .to(".c-heading-span.is-1, .c-heading-span,is-3", {
      opacity: 1,
    })

    .to(
      ".c-header-pattern.is-3",
      {
        autoAlpha: 1,
        duration: 2,
      },
      "<"
    )

    .to(".c-heading-span,is-2 , .c-heading-span,is-4", {
      opacity: 1,
    })

    .to(
      ".c-header-pattern.is-4",
      {
        autoAlpha: 1,
        duration: 2,
      },
      "<"
    )

    .to("#c-header", {
      scale: 5,
      autoAlpha: 0,
    })

    .from("#c-playbook-section", {
      autoAlpha: 0,
      duration: 2,
    })

    .to("#c-playbook-section", {
      autoAlpha: 0,
      duration: 2,
    })

    .from("#c-value-section", {
      autoAlpha: 0,
      duration: 2,
    })

    .to("#c-heading-text", {
      autoAlpha: 0,
      duration: 1,
    })

    .from("#c-qualities-section", {
      autoAlpha: 0,
      duration: 2,
    })

    .to(".c-value-heading-wrapper.is-1", {
      opacity: 1,
      duration: 0,
    })

    .to(
      ".c-value-heading-wrapper.is-1 .c-value-para-container",
      {
        height: "auto",
        duration: 2,
      },
      "<"
    )

    .to(".c-value-image.is-1", {
      autoAlpha: 0,
      // rotate: "0deg",
    })

    .to(
      ".c-value-heading-wrapper.is-1 .c-value-para-container",
      {
        height: "0px",
        duration: 2,
      },
      "<"
    )

    .to(".c-value-image.is-2", {
      autoAlpha: 1,
      rotate: "0deg",
      duration: 2,
    })

    .to(
      ".c-value-heading-wrapper.is-2",
      {
        opacity: 1,
        duration: 0,
      },
      "<"
    )

    .to(
      ".c-value-heading-wrapper.is-2 .c-value-para-container",
      {
        height: "auto",
        duration: 2,
      },
      "<"
    )

    .to(".c-value-image.is-2", {
      autoAlpha: 0,
      // rotate: "0deg",
    })

    .to(
      ".c-value-heading-wrapper.is-2 .c-value-para-container",
      {
        height: "0px",
        duration: 2,
      },
      "<"
    )

    .to(".c-value-image.is-3", {
      autoAlpha: 1,
      rotate: "0deg",
      duration: 2,
    })

    .to(
      ".c-value-heading-wrapper.is-3",
      {
        opacity: 1,
        duration: 0,
      },
      "<"
    )

    .to(
      ".c-value-heading-wrapper.is-3 .c-value-para-container",
      {
        height: "auto",
        duration: 2,
      },
      "<"
    )

    .to(".c-value-image.is-3", {
      autoAlpha: 0,
      // rotate: "0deg",
    })

    .to(
      ".c-value-heading-wrapper.is-3 .c-value-para-container",
      {
        height: "0px",
        duration: 2,
      },
      "<"
    )

    .to(".c-value-image.is-4", {
      autoAlpha: 1,
      rotate: "0deg",
      duration: 2,
    })

    .to(
      ".c-value-heading-wrapper.is-4",
      {
        opacity: 1,
        duration: 0,
      },
      "<"
    )

    .to(
      ".c-value-heading-wrapper.is-4 .c-value-para-container",
      {
        height: "auto",
        duration: 2,
      },
      "<"
    )

    .to("#c-qualities-section", {
      backgroundColor: "#2B399E",
    });

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

  const lottieTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".c-lottie-wrapper", // Missing dot for class selector
      pin: ".c-lottie-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      // pinSpacing: false,
    },
  });

  lottieTl.addLabel("play-lottie");

  // Make sure animSrcs[0] is properly defined earlier in your code
  animSrcs[0].addEventListener("DOMLoaded", function () {
    // Create a playhead object to control the animation frame
    let playhead = { frame: 0 };

    // Create the animation that will be controlled by scroll
    let animation = gsap.to(playhead, {
      // Changed from gsap.timeline().to to just gsap.to
      frame: animSrcs[0].totalFrames - 1,
      ease: "none",
      duration: 10, // This duration will be controlled by scroll
      onUpdate: () => animSrcs[0].goToAndStop(Math.round(playhead.frame), true),
    });

    // Add the animation to the scrollTrigger timeline
    lottieTl.add(animation, "play-lottie");

    // Refresh ScrollTrigger
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  const containers = document.querySelectorAll(".career-job-container");
  if (!containers.length) return;

  // Fetch and map job listings
  const response = await fetch(
    "https://api.oorwin.com/api/v2/careers/getCareersList?sub_domain=nexocean&json=true&page=1&limit=50"
  ).then((res) => res.json());

  const jobListings = response.data.map((res) => ({
    id: res.job_id,
    url: res.url,
    title: res.job_title,
  }));

  containers.forEach((container) => {
    container.innerHTML = ""; // Clear existing content

    // Render each job listing
    jobListings.forEach((job) => {
      const anchor = document.createElement("a");
      anchor.target = "_blank"; // opens in new tab
      anchor.rel = "noopener noreferrer"; // security best practice
      anchor.href = job.url;
      anchor.className = `c-open-content-container is-1 w-inline-block`;

      const titleDiv = document.createElement("div");
      titleDiv.className = "text-regular";
      titleDiv.textContent = job.title;

      const buttonDiv = document.createElement("div");
      buttonDiv.className = "c-open-roles-button";

      const knowMoreText = document.createElement("div");
      knowMoreText.className = "text-regular";
      knowMoreText.textContent = "Know more";

      const img = document.createElement("img");
      img.src =
        "https://cdn.prod.website-files.com/67bd5b8d3bc1bc87e30ac626/6800cee088367bdd466c97bb_button%20image.svg";
      img.loading = "lazy";
      img.alt = "";

      buttonDiv.appendChild(knowMoreText);
      buttonDiv.appendChild(img);

      anchor.appendChild(titleDiv);
      anchor.appendChild(buttonDiv);

      container.appendChild(anchor);
    });
  });
});
