let typeSplit = new SplitType(".hero-heading", {
  types: "lines, words, chars",
  tagName: "span",
});

let tl = gsap.timeline();

// Scramble each line separately
tl.to(".hero-heading .line", {
  duration: 1.5,
  scrambleText: {
    text: "{original}",
    chars: "lowerCase",
    // revealDelay: 0.3,
    speed: 0.2,
    // tweenLength: false,
  },
  stagger: 0.1,
});

let mm = gsap.matchMedia();

mm.add("(max-width: 991px)", () => {
  let activeTimeline = null;

  document.querySelectorAll(".oms-lottie-hover-trigger").forEach((trigger) => {
    gsap.set(trigger.querySelector(".u-body-mono-medium"), { opacity: 0.7 });
    gsap.set(trigger.querySelector(".u-body-regular"), { opacity: 70 });
    gsap.set(trigger.querySelectorAll(".oms-button-left, .oms-button-right"), {
      borderLeftColor: "#707bb7",
      borderBottomColor: "#707bb7",
    });
    gsap.set(trigger.querySelector(".oms-button-right-embed.hide-desktop"), {
      color: "#707bb7",
    });
    gsap.set(trigger.querySelector(".oms-button-wrap"), {
      borderTopColor: "#707bb7",
    });

    let tl = gsap
      .timeline({ paused: true })
      .to(
        trigger.querySelector(".u-body-mono-medium"),
        { opacity: 1, duration: 0.5 },
        0
      )
      .to(
        trigger.querySelector(".u-body-regular"),
        { opacity: 1, duration: 0.5 },
        0
      )
      .to(
        trigger.querySelectorAll(".oms-button-left, .oms-button-right"),
        { borderLeftColor: "white", borderBottomColor: "white", duration: 0.5 },
        0
      )
      .to(
        trigger.querySelector(".oms-button-right-embed.hide-desktop"),
        { color: "white", duration: 0.5 },
        0
      )
      .to(
        trigger.querySelector(".oms-button-wrap"),
        { borderTopColor: "white", duration: 0.5 },
        0
      );

    ScrollTrigger.create({
      trigger: trigger,
      start: "top 80%",
      end: "bottom 30%",
      // markers: true,
      onEnter: () => {
        if (activeTimeline && activeTimeline !== tl) activeTimeline.reverse();
        activeTimeline = tl;
        tl.play();
      },
      onEnterBack: () => {
        if (activeTimeline && activeTimeline !== tl) activeTimeline.reverse();
        activeTimeline = tl;
        tl.play();
      },
      onLeave: () => tl.reverse(),
      onLeaveBack: () => tl.reverse(),
    });
  });
});
