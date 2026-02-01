if (window.innerWidth >= 803) {
(() => {
  const target = document.querySelector(".image-about-sequence");
  if (!target) return;

  if (document.getElementById("v0")) return;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <video id="v0" muted playsinline preload="auto">
      <source src="https://teamepyc.github.io/cdn/kaviraj/v2/videos/ffmpeg.mp4" type="video/mp4">
    </video>
  `;

  target.appendChild(wrapper.firstElementChild);
})();

(() => {
  const video = document.querySelector("#v0");
  if (!video) return;

  const init = () => {

    // code comes here
    console.log("code comes here");
    const heroText = new SplitText(document.querySelector(".ka-hero-heading"), { type: "chars" });
    const heroTextChars = [...heroText.chars].reverse();
    const introText1 = new SplitText(document.querySelector(".ka-timeline-intro-txt:nth-child(1)"), { type: "words, chars" });
    const introText2 = new SplitText(document.querySelector(".ka-timeline-intro-txt:nth-child(2)"), { type: "words, chars" });
    const introText3 = new SplitText(document.querySelector(".ka-timeline-intro-txt:nth-child(3)"), { type: "words, chars" });

    const Timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".ka-timeline",
        start: "top 100%",
        end: "top 0%",
        scrub: true
      }
    });

    Timeline
    .to(".k-solid-button.about-hero", 
      {scale: 0.9, filter: "blur(10px)", opacity: 0, duration: 0.5})
    .to(heroTextChars, 
      {scale: 0.9, filter: "blur(10px)", scale: 1, opacity: 0, duration: 4, stagger: 0.2}, "<")
    .fromTo([introText1.chars, introText2.chars, introText3.chars], 
      {filter: "blur(10px)", scale: 1.5, opacity: 0},
      {filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.2, duration: 4, ease: "power1.out"}, "+=25")
    //.to([introText1.chars, introText2.chars, introText3.chars], 
      //{filter: "blur(10px)", scale: 1, opacity: 0, duration: 3, stagger: 0.1}, "+=4")
    
    const Timeline2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".ka-timeline",
        start: "top 100%",
        end: "top 0%",
        scrub: true
      }
    });

    Timeline2
    .to(video,
      {ease: "none", currentTime: video.duration, duration: 10 }
    ).fromTo(".image-sequence-fader", 
      {opacity: 0}, 
      {opacity: 1}, "-=0.5"
    )



    gsap.fromTo(".ka-background-video", 
    {x: "0vw"},
    {x: "-100vw",
    ease: "sine.inOut",
    scrollTrigger: {
      trigger: ".ka-chapter-transition._0",
      start: "40% bottom",
      end: "160% bottom",
      scrub: true,
    }
    });

    gsap.to([introText1.chars, introText2.chars, introText3.chars], 
    {filter: "blur(10px)", scale: 1, opacity: 0, duration: 3, stagger: 0.1, 
    scrollTrigger: {
      trigger: ".ka-chapter-transition._0",
      start: "40% bottom",
      end: "110% bottom",
      scrub: true,
    }
    });


    if (window.ScrollTrigger) ScrollTrigger.refresh();
  };

  if (video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
    init();
  } else {
    video.addEventListener("loadedmetadata", init, { once: true });
    video.load();
  }

})();

}
