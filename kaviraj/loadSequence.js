document.addEventListener("DOMContentLoaded", () => {

  let hasVisited = localStorage.getItem("hasVisited");

  if(hasVisited == "true"){
    document.querySelector(".loader").remove();
  }

  if(hasVisited != "true"){
    document.querySelector(".loader").classList.remove("hide");

    document.querySelectorAll(".heading, .hero-subtext, .loader-prelude .primary-button-wrapper").forEach(el => {
      el.style.willChange = "transform, opacity, filter, width";
    });

    const heroTimeline = gsap.timeline({
      paused: true
    });

    const heading1 = new SplitText(".heading:nth-child(1)", { type: "chars" });
    const heading2 = new SplitText(".heading:nth-child(2)", { type: "chars" });
    const heading3 = new SplitText(".heading:nth-child(3)", { type: "chars" });
    const loaderPrelude = new SplitText(".loader-prelude", { type: "chars" });
    const subtext = SplitText.create(".hero-subtext", { type: "chars" });


    heroTimeline.fromTo(".loader-content", 
      {opacity: 1},
      {opacity: 0, duration: 1, ease: "none", onComplete: () => {document.querySelector(".loader-content")?.remove();}}
    ).fromTo(loaderPrelude.chars, 
      { opacity: 0, filter: "blur(10px)" },
      { opacity: 1, filter: "blur(0px)", duration: 1, ease: "power1.out", stagger: 0.1}
    ).fromTo(".loader", 
      {opacity: 1},
      {opacity: 0, duration: 1, ease: "none", onComplete: () => {document.querySelector(".loader")?.remove();}}
    ).fromTo(".bgNoise", 
      {r: "0%"},
      {r: "100%", duration: 3, ease: "sine.inOut"}
    ).fromTo(heading1.chars,
      { opacity: 0, scale: 1.5, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out", stagger: 0.1}, "-=1.5"
    ).fromTo(heading2.chars,
      { opacity: 0, scale: 1.5, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out", stagger: 0.1}, "-=0.7"
    ).fromTo(heading3.chars,
      { opacity: 0, scale: 1.5, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out", stagger: 0.1}, "-=0.7"
    ).fromTo(subtext.chars,
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: "power1.out", stagger: 0.01}, "-=1.4"
    ).fromTo(".nav", 
      {opacity: 0},
      {opacity: 1, duration: 0.5, ease: "none"}, "-=2"
    );

    // 3. Animate buttons
    const buttonWrappers = document.querySelectorAll(".primary-button-wrapper");
    const subtextEndTime = heroTimeline.duration();
    const button1Start = subtextEndTime - 1.2;
    const buttonDuration = 1.2;
    buttonWrappers.forEach((wrapper, i) => {
      const button = wrapper.querySelector(".primary-button");
      const inset = button.querySelector(".primary-button-inset");
      const text = button.querySelector(".primary-button-text");

      const timeline = gsap.timeline()
        .fromTo(wrapper, { scale: 0 }, { scale: 1, duration: 0.9, ease: "quint.inOut" }, 0)
        .fromTo(inset, { scale: 0 }, { scale: 1, duration: 0.9, ease: "quint.inOut" }, 0.1)
        .fromTo(button, { width: "50px" }, { width: "170px", duration: 1, ease: "quint.inOut" }, 0.7)
        .fromTo(text, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "ease" }, 1.3);

      const start = i === 0 ? button1Start : button1Start + i * buttonDuration;
      heroTimeline.add(timeline, start);
    });


    document.querySelector(".loader-content .button-e")?.addEventListener("click", () => {
      localStorage.setItem("hasVisited", "true");
      gsap.set(".loader-prelude", {
        opacity: 1
      });
      gsap.set(window, { scrollTo: 0 });
      heroTimeline.play();
    });
  } 
});


