const lenis = new Lenis({
  useStrict: true,
  prevent: (node) =>
    node.classList.contains("r-form-wrapper") ||
    node.closest(".r-form-wrapper"),
});

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);

document
  .querySelectorAll(".num-text, .num-block .num-num, .num-content-block")
  .forEach((el) => {
    el.style.willChange = "transform, opacity, width";
  });

gsap.set(".num-accordion-scroller", { height: "400vh" });

gsap.set(".num-accordion-container", { height: "100vh" });

ScrollTrigger.create({
  trigger: ".numbers",
  start: "top top",
  end: "bottom bottom",
  pin: ".num-accordion-container",
  pinSpacing: false,
  // markers: true,
  // anticipatePin: 1,
  // invalidateOnRefresh: true,
});

const num1text = new SplitText(".num-content-block._1 .num-text", {
  type: "words",
});
const num2text = new SplitText(".num-content-block._2 .num-text", {
  type: "words",
});
const num3text = new SplitText(".num-content-block._3 .num-text", {
  type: "words",
});
const num4text = new SplitText(".num-content-block._4 .num-text", {
  type: "words",
});
const num5text = new SplitText(".num-content-block._5 .num-text", {
  type: "words",
});

if (window.innerWidth >= 992) {
  // 1️⃣ Set Initial State (State 0)
  gsap.set(".num-block._1", { width: "54.54%" });
  gsap.set(".num-block._2", { width: "18.18%" });
  gsap.set(".num-block._3", { width: "13.64%" });
  gsap.set(".num-block._4", { width: "9.09%" });
  gsap.set(".num-block._5", { width: "4.55%" });
  gsap.set(".num-block._6", { width: "0%" });
  gsap.set(".num-block._7", { width: "0%" });
  gsap.set(".num-block._8", { width: "0%" });
  gsap.set(".num-block._9", { width: "0%" });

  gsap.set(".num-content-block._1", { height: "100%" });
  gsap.set(".num-content-block._2", { height: "90%" });
  gsap.set(".num-content-block._3", { height: "80%" });
  gsap.set(".num-content-block._4", { height: "70%" });
  gsap.set(".num-content-block._5", { height: "60%" });
  gsap.set(".num-content-block._6", { height: "50%" });
  gsap.set(".num-content-block._7", { height: "40%" });
  gsap.set(".num-content-block._8", { height: "30%" });
  gsap.set(".num-content-block._9", { height: "20%" });

  gsap.set(".num-num._1", { scale: 1 });
  gsap.set(".num-num._2", { scale: 0.5 });
  gsap.set(".num-num._3", { scale: 0.25 });
  gsap.set(".num-num._4", { scale: 0.125 });
  gsap.set(".num-num._5", { scale: 0.0625 });
  gsap.set(".num-num._6", { scale: 0.03125 });
  gsap.set(".num-num._7", { scale: 0.015625 });
  gsap.set(".num-num._8", { scale: 0.0078125 });
  gsap.set(".num-num._9", { scale: 0.00390625 });

  const tl = gsap.timeline({
    defaults: { duration: 2, ease: "power2.inOut" },
    scrollTrigger: {
      trigger: ".numbers",
      start: "5% 0%",
      end: "95% 100%",
      scrub: 0.5,
      markers: false,
    },
  });

  // ---- STATE 1 ----
  tl.to(".num-block._1", { width: "0%" })
    .to(".num-block._2", { width: "54.54%" }, "<")
    .to(".num-block._3", { width: "18.18%" }, "<")
    .to(".num-block._4", { width: "13.64%" }, "<")
    .to(".num-block._5", { width: "9.09%" }, "<")
    .to(".num-block._6", { width: "4.55%" }, "<")
    .to(".num-block._7", { width: "0%" }, "<")
    .to(".num-block._8", { width: "0%" }, "<")
    .to(".num-block._9", { width: "0%" }, "<")

    .to(".num-content-block._1", { height: "100%" }, "<")
    .to(".num-content-block._2", { height: "100%" }, "<")
    .to(".num-content-block._3", { height: "90%" }, "<")
    .to(".num-content-block._4", { height: "80%" }, "<")
    .to(".num-content-block._5", { height: "70%" }, "<")
    .to(".num-content-block._6", { height: "60%" }, "<")
    .to(".num-content-block._7", { height: "50%" }, "<")
    .to(".num-content-block._8", { height: "40%" }, "<")
    .to(".num-content-block._9", { height: "30%" }, "<")

    .to(".num-num._1", { scale: 0 }, "<")
    .to(".num-num._2", { scale: 1 }, "<")
    .to(".num-num._3", { scale: 0.5 }, "<")
    .to(".num-num._4", { scale: 0.25 }, "<")
    .to(".num-num._5", { scale: 0.125 }, "<")
    .to(".num-num._6", { scale: 0.0625 }, "<")
    .to(".num-num._7", { scale: 0.03125 }, "<")
    .to(".num-num._8", { scale: 0.015625 }, "<")
    .to(".num-num._9", { scale: 0.0078125 }, "<")

    .fromTo(
      num2text.words,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 },
      "<+=0.6"
    )
    .to(
      ".num-content-block._1 .num-text",
      { opacity: 0, duration: 0.5 },
      "<-=0.5"
    );

  // ---- STATE 2 ----
  tl.to(".num-block._1", { width: "0%" }, "+=0")
    .to(".num-block._2", { width: "0%" }, "<")
    .to(".num-block._3", { width: "54.54%" }, "<")
    .to(".num-block._4", { width: "18.18%" }, "<")
    .to(".num-block._5", { width: "13.64%" }, "<")
    .to(".num-block._6", { width: "9.09%" }, "<")
    .to(".num-block._7", { width: "4.55%" }, "<")
    .to(".num-block._8", { width: "0%" }, "<")
    .to(".num-block._9", { width: "0%" }, "<")

    .to(".num-content-block._1", { height: "100%" }, "<")
    .to(".num-content-block._2", { height: "100%" }, "<")
    .to(".num-content-block._3", { height: "100%" }, "<")
    .to(".num-content-block._4", { height: "90%" }, "<")
    .to(".num-content-block._5", { height: "80%" }, "<")
    .to(".num-content-block._6", { height: "70%" }, "<")
    .to(".num-content-block._7", { height: "60%" }, "<")
    .to(".num-content-block._8", { height: "50%" }, "<")
    .to(".num-content-block._9", { height: "40%" }, "<")

    .to(".num-num._1", { scale: 0 }, "<")
    .to(".num-num._2", { scale: 0 }, "<")
    .to(".num-num._3", { scale: 1 }, "<")
    .to(".num-num._4", { scale: 0.5 }, "<")
    .to(".num-num._5", { scale: 0.25 }, "<")
    .to(".num-num._6", { scale: 0.125 }, "<")
    .to(".num-num._7", { scale: 0.0625 }, "<")
    .to(".num-num._8", { scale: 0.03125 }, "<")
    .to(".num-num._9", { scale: 0.015625 }, "<")

    .fromTo(
      num3text.words,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 },
      "<+=0.6"
    )
    .to(
      ".num-content-block._2 .num-text",
      { opacity: 0, duration: 0.5 },
      "<-=0.5"
    );

  // ---- STATE 3 ----
  tl.to(".num-block._1", { width: "0%" }, "+=0")
    .to(".num-block._2", { width: "0%" }, "<")
    .to(".num-block._3", { width: "0%" }, "<")
    .to(".num-block._4", { width: "54.54%" }, "<")
    .to(".num-block._5", { width: "18.18%" }, "<")
    .to(".num-block._6", { width: "13.64%" }, "<")
    .to(".num-block._7", { width: "9.09%" }, "<")
    .to(".num-block._8", { width: "4.55%" }, "<")
    .to(".num-block._9", { width: "0%" }, "<")

    .to(".num-content-block._1", { height: "100%" }, "<")
    .to(".num-content-block._2", { height: "100%" }, "<")
    .to(".num-content-block._3", { height: "100%" }, "<")
    .to(".num-content-block._4", { height: "100%" }, "<")
    .to(".num-content-block._5", { height: "90%" }, "<")
    .to(".num-content-block._6", { height: "80%" }, "<")
    .to(".num-content-block._7", { height: "70%" }, "<")
    .to(".num-content-block._8", { height: "60%" }, "<")
    .to(".num-content-block._9", { height: "50%" }, "<")

    .to(".num-num._1", { scale: 0 }, "<")
    .to(".num-num._2", { scale: 0 }, "<")
    .to(".num-num._3", { scale: 0 }, "<")
    .to(".num-num._4", { scale: 1 }, "<")
    .to(".num-num._5", { scale: 0.5 }, "<")
    .to(".num-num._6", { scale: 0.25 }, "<")
    .to(".num-num._7", { scale: 0.125 }, "<")
    .to(".num-num._8", { scale: 0.0625 }, "<")
    .to(".num-num._9", { scale: 0.03125 }, "<")

    .fromTo(
      num4text.words,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 },
      "<+=0.6"
    )
    .to(
      ".num-content-block._3 .num-text",
      { opacity: 0, duration: 0.5 },
      "<-=0.5"
    );

  // ---- STATE 4 ----
  tl.to(".num-block._1", { width: "0%" }, "+=0")
    .to(".num-block._2", { width: "0%" }, "<")
    .to(".num-block._3", { width: "0%" }, "<")
    .to(".num-block._4", { width: "0%" }, "<")
    .to(".num-block._5", { width: "54.54%" }, "<")
    .to(".num-block._6", { width: "18.18%" }, "<")
    .to(".num-block._7", { width: "13.64%" }, "<")
    .to(".num-block._8", { width: "9.09%" }, "<")
    .to(".num-block._9", { width: "4.55%" }, "<")

    .to(".num-content-block._1", { height: "100%" }, "<")
    .to(".num-content-block._2", { height: "100%" }, "<")
    .to(".num-content-block._3", { height: "100%" }, "<")
    .to(".num-content-block._4", { height: "100%" }, "<")
    .to(".num-content-block._5", { height: "100%" }, "<") // per your data
    .to(".num-content-block._6", { height: "90%" }, "<")
    .to(".num-content-block._7", { height: "80%" }, "<")
    .to(".num-content-block._8", { height: "70%" }, "<")
    .to(".num-content-block._9", { height: "60%" }, "<")

    .to(".num-num._1", { scale: 0 }, "<")
    .to(".num-num._2", { scale: 0 }, "<")
    .to(".num-num._3", { scale: 0 }, "<")
    .to(".num-num._4", { scale: 0 }, "<")
    .to(".num-num._5", { scale: 1 }, "<")
    .to(".num-num._6", { scale: 0.5 }, "<")
    .to(".num-num._7", { scale: 0.25 }, "<")
    .to(".num-num._8", { scale: 0.125 }, "<")
    .to(".num-num._9", { scale: 0.0625 }, "<")

    .fromTo(
      num5text.words,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 },
      "<+=0.6"
    )
    .to(
      ".num-content-block._4 .num-text",
      { opacity: 0, duration: 0.5 },
      "<-=0.5"
    );
}

if (window.innerWidth <= 991) {
  // 1️⃣ Set Initial State (State 0)
  gsap.set(".num-block._1", { width: "100%" });
  gsap.set(".num-block._2", { width: "0%" });
  gsap.set(".num-block._3", { width: "0%" });
  gsap.set(".num-block._4", { width: "0%" });
  gsap.set(".num-block._5", { width: "0%" });
  gsap.set(".num-block._6", { width: "0%" });
  gsap.set(".num-block._7", { width: "0%" });
  gsap.set(".num-block._8", { width: "0%" });
  gsap.set(".num-block._9", { width: "0%" });

  gsap.set(".num-num._1", { scale: 1 });
  gsap.set(".num-num._2", { scale: 0.1 });
  gsap.set(".num-num._3", { scale: 0 });
  gsap.set(".num-num._4", { scale: 0 });
  gsap.set(".num-num._5", { scale: 0 });
  gsap.set(".num-num._6", { scale: 0 });
  gsap.set(".num-num._7", { scale: 0 });
  gsap.set(".num-num._8", { scale: 0 });
  gsap.set(".num-num._9", { scale: 0 });

  gsap.set(".num-accordion", { x: 40 }, "<");

  const tl = gsap.timeline({
    defaults: { duration: 2, ease: "power2.inOut" },
    scrollTrigger: {
      trigger: ".numbers",
      start: "5% 0%",
      end: "95% 100%",
      scrub: 0.5,
      markers: false,
    },
  });

  // ---- STATE 1 ----
  tl.to(".num-block._1", { width: "0%" })
    .to(".num-block._2", { width: "100%" }, "<")
    .to(".num-block._3", { width: "0%" }, "<")
    .to(".num-block._4", { width: "0%" }, "<")
    .to(".num-block._5", { width: "0%" }, "<")
    .to(".num-block._6", { width: "0%" }, "<")
    .to(".num-block._7", { width: "0%" }, "<")
    .to(".num-block._8", { width: "0%" }, "<")
    .to(".num-block._9", { width: "0%" }, "<")

    .to(".num-num._1", { scale: 0 }, "<")
    .to(".num-num._2", { scale: 1 }, "<")
    .to(".num-num._3", { scale: 0.1 }, "<")
    .to(".num-num._4", { scale: 0 }, "<")
    .to(".num-num._5", { scale: 0 }, "<")
    .to(".num-num._6", { scale: 0 }, "<")
    .to(".num-num._7", { scale: 0 }, "<")
    .to(".num-num._8", { scale: 0 }, "<")
    .to(".num-num._9", { scale: 0 }, "<")

    .to(".num-accordion", { x: 20 }, "<")

    .fromTo(
      num2text.words,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 },
      "<+=0.6"
    )
    .to(
      ".num-content-block._1 .num-text",
      { opacity: 0, duration: 0.5 },
      "<-=0.5"
    );

  // ---- STATE 2 ----
  tl.to(".num-block._1", { width: "0%" }, "+=0")
    .to(".num-block._2", { width: "0%" }, "<")
    .to(".num-block._3", { width: "100%" }, "<")
    .to(".num-block._4", { width: "0%" }, "<")
    .to(".num-block._5", { width: "0%" }, "<")
    .to(".num-block._6", { width: "0%" }, "<")
    .to(".num-block._7", { width: "0%" }, "<")
    .to(".num-block._8", { width: "0%" }, "<")
    .to(".num-block._9", { width: "0%" }, "<")

    .to(".num-num._1", { scale: 0 }, "<")
    .to(".num-num._2", { scale: 0 }, "<")
    .to(".num-num._3", { scale: 1 }, "<")
    .to(".num-num._4", { scale: 0.1 }, "<")
    .to(".num-num._5", { scale: 0 }, "<")
    .to(".num-num._6", { scale: 0 }, "<")
    .to(".num-num._7", { scale: 0 }, "<")
    .to(".num-num._8", { scale: 0 }, "<")
    .to(".num-num._9", { scale: 0 }, "<")

    .to(".num-accordion", { x: 0 }, "<")

    .fromTo(
      num3text.words,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 },
      "<+=0.6"
    )
    .to(
      ".num-content-block._2 .num-text",
      { opacity: 0, duration: 0.5 },
      "<-=0.5"
    );

  // ---- STATE 3 ----
  tl.to(".num-block._1", { width: "0%" }, "+=0")
    .to(".num-block._2", { width: "0%" }, "<")
    .to(".num-block._3", { width: "0%" }, "<")
    .to(".num-block._4", { width: "100%" }, "<")
    .to(".num-block._5", { width: "0%" }, "<")
    .to(".num-block._6", { width: "0%" }, "<")
    .to(".num-block._7", { width: "0%" }, "<")
    .to(".num-block._8", { width: "0%" }, "<")
    .to(".num-block._9", { width: "0%" }, "<")

    .to(".num-num._1", { scale: 0 }, "<")
    .to(".num-num._2", { scale: 0 }, "<")
    .to(".num-num._3", { scale: 0 }, "<")
    .to(".num-num._4", { scale: 1 }, "<")
    .to(".num-num._5", { scale: 0.1 }, "<")
    .to(".num-num._6", { scale: 0 }, "<")
    .to(".num-num._7", { scale: 0 }, "<")
    .to(".num-num._8", { scale: 0 }, "<")
    .to(".num-num._9", { scale: 0 }, "<")

    .to(".num-accordion", { x: -20 }, "<")

    .fromTo(
      num4text.words,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 },
      "<+=0.6"
    )
    .to(
      ".num-content-block._3 .num-text",
      { opacity: 0, duration: 0.5 },
      "<-=0.5"
    );

  // ---- STATE 4 ----
  tl.to(".num-block._1", { width: "0%" }, "+=0")
    .to(".num-block._2", { width: "0%" }, "<")
    .to(".num-block._3", { width: "0%" }, "<")
    .to(".num-block._4", { width: "0%" }, "<")
    .to(".num-block._5", { width: "100%" }, "<")
    .to(".num-block._6", { width: "0%" }, "<")
    .to(".num-block._7", { width: "0%" }, "<")
    .to(".num-block._8", { width: "0%" }, "<")
    .to(".num-block._9", { width: "0%" }, "<")

    .to(".num-num._1", { scale: 0 }, "<")
    .to(".num-num._2", { scale: 0 }, "<")
    .to(".num-num._3", { scale: 0 }, "<")
    .to(".num-num._4", { scale: 0 }, "<")
    .to(".num-num._5", { scale: 1 }, "<")
    .to(".num-num._6", { scale: 0.1 }, "<")
    .to(".num-num._7", { scale: 0 }, "<")
    .to(".num-num._8", { scale: 0 }, "<")
    .to(".num-num._9", { scale: 0 }, "<")

    .to(".num-accordion", { x: -40 }, "<")

    .fromTo(
      num5text.words,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 },
      "<+=0.6"
    )
    .to(
      ".num-content-block._4 .num-text",
      { opacity: 0, duration: 0.5 },
      "<-=0.5"
    );
}




document.addEventListener("DOMContentLoaded", () => {
  console.log("hero hello");
  // gsap.config({ force3D: false });

  gsap.set(".r-si-cards-wrapper", { height: "100vh" });

  gsap.set(".r-si-cards-height", { height: "300vh" });

  const heroTl = gsap.timeline();

  const splitText = new SplitText(".split-text", {
    type: "lines",
  });

  // SplitText for lines inside each div of .r-para-container
  const splitText2 = new SplitText(".r-para-container div", {
    type: "lines",
  });

  // Iterate over each div and animate lines independently
  document.querySelectorAll(".r-para-container div").forEach((div, index) => {
    const splitText = new SplitText(div, { type: "lines" });

    gsap.fromTo(
      splitText.lines,
      { y: 10, opacity: 0 }, // Initial state (lines will start from bottom, and be invisible)
      {
        y: 0,
        opacity: 1, // Final state (lines will be at normal position and visible)
        stagger: 0.1, // Stagger the animation for each line
        duration: 0.6,
        scrollTrigger: {
          trigger: div, // Trigger animation for this specific div
          start: "top bottom", // Animation starts when the top of the div hits the center of the viewport
          once: true, // Optional: Ensures the animation happens only once
        },
      }
    );
  });

  heroTl
    .to(".r-pre-loader", {
      delay: 2,
      duration: 0.5,
      autoAlpha: 0,
      ease: "power2.out",
    })

    // .fromTo(".r-navbar", { y: -100 }, { y: 0 })
    .fromTo(".r-nav-link", { y: -100 }, { y: 0, stagger: 0.09 }, "<")
    .fromTo("#nav-button", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "<")
    .fromTo(".r-nav-logo-embed", { y: -100 }, { y: 0, duration: 0.4 }, "<=+0.2")
    .fromTo(
      ".r-hero-left",
      { y: 50, opacity: 0.8 },
      { y: 0, opacity: 1 },
      "<=-0.2"
    )
    .fromTo(
      splitText.lines,
      { y: 10, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.3,
        duration: 0.8,
        scrollTrigger: {
          trigger: splitText.lines,
          start: "top center",
        },
      },
      "<"
    )
    .to(
      "#report-hero-first-scramble",
      {
        duration: 2,
        scrambleText: "REPORT 25",
      },
      "<"
    )
    .fromTo(
      [
        ".hero-right-graphic-div-alt",
        ".hero-right-graphic-div",
        ".hero-right-graphic-img",
      ],
      { opacity: 0, scale: 0.7 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.02,
      },
      "<=+0.5"
    )

    .fromTo(
      ".r-hero-left-bottom",
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      "<=+0.5"
    )

    .to(
      "#report-hero-second-scramble",
      {
        duration: 2,
        scrambleText: "Build What Matters.",
      },
      "<"
    )
    .to(
      "#report-hero-third-scramble",
      {
        duration: 2,
        scrambleText: "Build from India.",
      },
      "<"
    );

  ScrollTrigger.refresh();

  gsap.utils.toArray(".r-heading-wrapper").forEach((wrapper) => {
    const first = wrapper.querySelector(".r-first-animate");
    const second = wrapper.querySelector(".r-second-animate");
    const secondTarget =
      wrapper.querySelector(".r-second-animate .r-display1") || second;
    if (!first || !second) return;

    const getOffset = () => first.offsetHeight / 2;
    const setMargin = () => (wrapper.style.marginBottom = `-${getOffset()}px`);
    setMargin();

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: first,
        start: "bottom bottom",
        endTrigger: second,
        end: () => `bottom-=${getOffset()} bottom`,
        scrub: 0.7,
        markers: false,
        invalidateOnRefresh: true,
        onRefresh: setMargin,
      },
    });

    tl.fromTo(wrapper, { y: 0 }, { y: () => -getOffset(), ease: "none" }, 0)
      .fromTo(first, { scale: 1 }, { scale: 0.5, ease: "none" }, 0)
      .fromTo(secondTarget, { scale: 0.5 }, { scale: 1, ease: "none" }, 0);
  });

  const chOneTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#sec-ch1",
      start: "top 60%",
      end: "bottom bottom",
      // scrub: true, // tie animation to scroll
    },
  });

  chOneTl
    .fromTo(
      ".r-man-heading-wrapper",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 }
    )
    .fromTo(
      ".r-man-para-wrapper",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 }
    )
    .fromTo(
      ".r-mm-card",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 0.6 }
    );

  ScrollTrigger.refresh();
  gsap.matchMedia().add("(min-width: 1024px)", () => {
    gsap.set(".r-folder-height-element", { height: "400vh" });
    gsap.set(".r-folder-scroller", { height: "100vh" });

    let folderTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".section.r-section.is-folder",
        start: "top top",
        end: "bottom bottom",
        pin: ".r-folder-scroller",
        pinSpacing: false,
        // markers: true,
        scrub: true,
      },
    });

    folderTl.fromTo(".r-fw-folder-wrapper", { x: "0vw" }, { x: "-20vw" });
    folderTl.to(".r-fw-folder-front", { skewX: "5deg" });
    folderTl.fromTo(".r-fw-folder-card.is-first", { x: "0vw" }, { x: "51vw" });
    folderTl.fromTo(".r-fw-folder-card.is-second", { x: "0vw" }, { x: "51vw" });
    folderTl.fromTo(
      ".r-fw-folder-card.is-first",
      { rotateZ: "0deg" },
      { rotateZ: "5deg" },
      "<"
    );
    folderTl.fromTo(".r-fw-folder-card.is-third", { x: "0vw" }, { x: "51vw" });
    folderTl.fromTo(
      ".r-fw-folder-card.is-second",
      { rotateZ: "0deg" },
      { rotateZ: "5deg" },
      "<"
    );
    folderTl.to(
      ".r-fw-folder-card.is-first",
      { rotateZ: "10deg" },

      "<"
    );
  });

  const elements = document.querySelectorAll(".r-si-image");
  let lottieAnimations = [];
  let animationsLoaded = 0;

  elements.forEach((element, index) => {
    const lottieUrl = element.getAttribute("data-lottie");

    const animation = lottie.loadAnimation({
      container: element,
      renderer: "canvas",
      loop: false,
      autoplay: false,
      path: lottieUrl,
    });

    animation.addEventListener("DOMLoaded", () => {
      lottieAnimations[index] = animation;
      animationsLoaded++;

      if (animationsLoaded === elements.length) {
        initScrollTrigger();
      }
    });
  });

  function initScrollTrigger() {
    gsap.set(".r-si-image", { opacity: 0 });

    let siCardsTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".r-si-cards-trigger",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: ".r-si-cards-wrapper",
        pinSpacing: false,
        // markers: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Control visibility and Lottie frames together
          if (progress >= 0 && progress < 0.33) {
            // First section
            gsap.set(".r-si-image.is-first", { opacity: 1 });
            gsap.set(".r-si-image.is-second", { opacity: 0 });
            gsap.set(".r-si-image.is-third", { opacity: 0 });

            const localProgress = progress / 0.33;
            if (lottieAnimations[0]) {
              const totalFrames = lottieAnimations[0].totalFrames;
              const targetFrame = Math.floor(localProgress * (totalFrames - 1));
              lottieAnimations[0].goToAndStop(targetFrame, true);
            }
          } else if (progress >= 0.33 && progress < 0.66) {
            // Second section
            gsap.set(".r-si-image.is-first", { opacity: 0 });
            gsap.set(".r-si-image.is-second", { opacity: 1 });
            gsap.set(".r-si-image.is-third", { opacity: 0 });

            const localProgress = (progress - 0.33) / 0.33;
            if (lottieAnimations[1]) {
              const totalFrames = lottieAnimations[1].totalFrames;
              const targetFrame = Math.floor(localProgress * (totalFrames - 1));
              lottieAnimations[1].goToAndStop(targetFrame, true);
            }
          } else if (progress >= 0.66) {
            // Third section
            gsap.set(".r-si-image.is-first", { opacity: 0 });
            gsap.set(".r-si-image.is-second", { opacity: 0 });
            gsap.set(".r-si-image.is-third", { opacity: 1 });

            const localProgress = (progress - 0.66) / 0.34;
            if (lottieAnimations[2]) {
              const totalFrames = lottieAnimations[2].totalFrames;
              const targetFrame = Math.floor(localProgress * (totalFrames - 1));
              lottieAnimations[2].goToAndStop(targetFrame, true);
            }
          }
        },
      },
    });

    // Only animate the paragraph wrapper, remove opacity animations
    siCardsTl.to(".r-si-para-wrapper", { xPercent: 0 });
    siCardsTl.to(".r-si-para-wrapper", { xPercent: -100 });
    siCardsTl.to(".r-si-para-wrapper", { xPercent: -200 });
  }

  ScrollTrigger.refresh();

  gsap.from(".r-author-card", {
    y: 20,
    opacity: 0,
    stagger: 0.5, // Stagger the animation for each .r-author-card
    duration: 1, // Adjust duration as needed
    scrollTrigger: {
      trigger: ".r-author-grid", // ScrollTrigger will fire when .r-author-grid comes into view
      start: "top bottom", // Start the animation when the top of .r-author-grid reaches the bottom of the viewport
      end: "bottom top", // End the animation when the bottom of .r-author-grid reaches the top of the viewport (optional, depending on how long you want the animation to last)
      once: true, // Ensures the animation runs only once
      toggleActions: "play none none none", // Play the animation when the trigger comes into view (optional)
    },
  });
});

