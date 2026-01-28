import { gridResize, navigation, initializeLenis, visualUtility } from "https://teamepyc.github.io/cdn/kaviraj/v2/utility/global.js";
import { prologueAnimationDesktop, prologueAnimationMobile } from "https://teamepyc.github.io/cdn/kaviraj/v2/main/home/prologue.js"; 

function mainCode() {  

  // --- DESKTOP ---//
  if (window.innerWidth >= 803) {

    //[START] LOAD SEQUENCE [START]//
    document.querySelectorAll(".k-hero, .k-hero-heading, .k-hero-subtext, .k-hero-cta").forEach(el => {
      el.style.willChange = "transform, opacity, filter";
    });

    const loaderPrelude = new SplitText(".k-preloader-prelude .k-preloader-prelude-text", { type: "chars" });

    const heroHeadings = document.querySelectorAll(".k-hero-heading");
    const Lheading1 = new SplitText(heroHeadings[0], { type: "chars" });
    const Lheading2 = new SplitText(heroHeadings[1], { type: "chars" });
    const Lheading3 = new SplitText(heroHeadings[2], { type: "chars" });
    const Lsubtext = new SplitText(".k-hero-subtext", { type: "chars" });

    const loadSequence = gsap.timeline({
      paused: true
    });

    loadSequence.fromTo(".k-preloader-content", 
      {opacity: 1},
      {opacity: 0, duration: 0.5, ease: "none", onComplete: () => {document.querySelector(".k-preloader-content")?.remove();}}
    ).fromTo(".k-preloader-prelude", 
      { opacity: 0},
      { opacity: 1, duration: 0}
    ).fromTo(loaderPrelude.chars, 
      { opacity: 0, filter: "blur(10px)" },
      { opacity: 1, filter: "blur(0px)", duration: 1, ease: "power1.out", stagger: 0.1}
    ).fromTo(".k-preloader-prelude", 
      {opacity: 1}, 
      {opacity: 0, duration: 1}, "+=0.5"
    ).fromTo(".k-preloader", 
      {opacity: 1}, 
      {opacity: 0, duration: 1}, "-=0.5"
    ).to(".k-background[data-sprite]", 
      {ease: "none", duration: 2, 
        onUpdate() {const el = this.targets()[0]; el._spriteSetProgress?.(this.progress());},
        onComplete: () => {document.querySelector(".k-preloader")?.remove();}
      }, "<"
    ).fromTo(Lheading1.chars,
      { opacity: 0, scale: 1.5, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out", stagger: 0.1}, "-=1.4"
    ).fromTo(Lheading2.chars,
      { opacity: 0, scale: 1.5, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out", stagger: 0.1}, "-=0.7"
    ).fromTo(Lheading3.chars, 
      { opacity: 0, scale: 1.5, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out", stagger: 0.1}, "-=0.7"
    ).fromTo(Lsubtext.chars,
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: "power1.out", stagger: 0.01}, "-=1.4"
    ).fromTo(".k-hero-content-wrapper .k-solid-button:nth-child(4)",
      {y: "0.1rem", opacity: 0},
      {y: "0rem", opacity: 1, duration: 0.5}, "-=1.5"
    ).fromTo(".k-hero-content-wrapper .k-solid-button:nth-child(6)",
      {y: "0.1rem", opacity: 0},
      {y: "0rem", opacity: 1, duration: 0.5, onComplete: () => {console.log("loadDone")}}, "<+=0.5"
    )

    document.querySelector(".k-preloader .k-stroke-button")?.addEventListener("click", () => {
      gsap.set(window, { scrollTo: 0 });
      loadSequence.play();
    });
    //[END] LOAD SEQUENCE [END]//



    //[START] HERO OUTRO [START]//
    ScrollTrigger.create({trigger: ".k-hero", start: "0%", end: "100%", pin: true, pinSpacing: false});

    const heading1Chars = [...Lheading1.chars].reverse();
    const heading2Chars = [...Lheading2.chars].reverse();
    const heading3Chars = [...Lheading3.chars].reverse();
    const subtextChars  = [...Lsubtext.chars].reverse();
    
    const heroOutro = gsap.timeline({
      scrollTrigger: {
        trigger: ".k-services",
        start: "0% 100%",
        end: "0% 20%",
        scrub: 1,
      }
    });

    heroOutro
    .to(".k-hero-content-wrapper .k-solid-button:nth-child(6)", {scale: 0.9, filter: "blur(10px)", opacity: 0, duration: 0.5})
    .to(subtextChars, {opacity: 0, stagger: 0.01, duration: 1}, "<")
    .to(".k-hero-content-wrapper .k-solid-button:nth-child(4)", {scale: 0.9, filter: "blur(10px)", opacity: 0, duration: 0.5}, "-=1")
    .to(heading3Chars, {scale: 0.9, filter: "blur(10px)", scale: 1, opacity: 0, duration: 1, stagger: 0.12}, "-=1")
    .to(heading2Chars, {scale: 0.9, filter: "blur(10px)", scale: 1, opacity: 0, duration: 1, stagger: 0.12}, "-=1.35")
    .to(heading1Chars, {scale: 0.9, filter: "blur(10px)", scale: 1, opacity: 0, duration: 1, stagger: 0.12}, "-=1.35");
    //[END] HERO OUTRO [END]//



    //[START] PROLOGUE [START]//
    prologueAnimationDesktop();    
    //[END] PROLOGUE [END]//
    


    //[START] VALUES [START]//
    document.querySelectorAll(".k-value-intro-text, .k-value-intro-text, .k-cta-headline div, .k-cta-subtext div").forEach(el => {
      el.style.willChange = "transform, opacity, filter";
    });

    document.querySelector(".k-background").style.willChange = "transform";

    const valuesTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".k-values",
        start: "top bottom",
        end: "bottom bottom",
        scrub: true
      }
    });

    const video = document.querySelector("#v0");
    const kValueIntroText = new SplitText(document.querySelector(".k-value-intro-text"), { type: "chars" });
    const kValueOutroText = new SplitText(document.querySelector(".k-value-outro-text"), { type: "chars" });
    valuesTimeline
    .to(".image-sequence[data-sprite]", 
        {ease: "none", duration: 2, onUpdate() {const el = this.targets()[0]; el._spriteSetProgress?.(this.progress());}})
    .fromTo(kValueIntroText.chars, 
        {filter: "blur(10px)", scale: 1.5, opacity: 0},
        {filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.02, duration: 0.5, ease: "power1.out"}, "<+=0.5")
    .to([kValueIntroText.chars], 
        {filter: "blur(10px)", scale: 1, opacity: 0, duration: 0.5, stagger: 0.02})
    .fromTo(".image-sequence", 
        {filter: "contrast(80%)"},
        {filter: "contrast(100%)", duration: 0.5}, "<")
    .fromTo(kValueOutroText.chars, 
        {filter: "blur(10px)", scale: 1.5, opacity: 0},
        {filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.01, duration: 0.5, ease: "power1.out"}, "8.9")
    .fromTo(".image-sequence", 
        {filter: "contrast(100%)"},
        {filter: "contrast(80%)", duration: 0.5}, "<-=1")
    .to([kValueOutroText.chars], 
        {filter: "blur(10px)", scale: 1, opacity: 0, duration: 0.4, stagger: 0.01}, "+=0.2")
    .fromTo(".image-sequence", 
        {filter: "contrast(80%)"},
        {filter: "contrast(100%)", duration: 0.5}, "<")
    .to(video, 
        {duration: 10.35, ease: "none", currentTime: video.duration}, "2")
    .to(".k-background",
       {duration: 2.23, scale: 1.2, y: "-10%", ease: "none"}, "-=2.23")
    .to(".lake",
       {opacity: 1, duration: 0.1})
    .fromTo(".k-cta-content-block",
      {opacity: 0}, {opacity: 1, duration: 0.5}, "-=0.5");
    //[END] VALUES [END]//



    //[START] CTA [START]//
    const kCtaHeadline = new SplitText(document.querySelector(".k-cta-headline"), { type: "chars" });
    const kCtaSubtext = new SplitText(document.querySelector(".k-cta-subtext"), { type: "chars" });
    const kCTA = gsap.timeline({
      scrollTrigger: {
        trigger: ".k-values",
        start: "95% 80%",
        end: "100% 90%",
        scrub: true
      }
    });

    kCTA.fromTo(".k-cta", 
      {pointerEvents: "none"},
      {pointerEvents: "auto"}
    ).fromTo(".k-logo-icon.cta", 
      {opacity: 0},
      {opacity: 1, duration: 2}
    ).fromTo(kCtaHeadline.chars, 
      {filter: "blur(4px)", opacity: 0},
      {filter: "blur(0px)", opacity: 1, stagger: 0.1, duration: 2, ease: "power1.out"}, "<+=1"
    ).fromTo(kCtaSubtext.chars, 
      {filter: "blur(1px)", opacity: 0},
      {filter: "blur(0px)", opacity: 1, stagger: 0.01, duration: 2, ease: "power1.out"}, "<+=3"
    ).fromTo(".k-cta .k-solid-button", 
      {filter: "blur(2px)", scale: 0.9, opacity: 0},
      {filter: "blur(0px)", scale: 1, opacity: 1, duration: 2}, "<+=1"
    );
    //[END] CTA [END]//


    //[START] AUDIO [START]//
    const audio = new Audio('https://teamepyc.github.io/cdn/kaviraj/v2/sound.mp3');
    audio.preload = 'auto'; 
    audio.loop = true;
    let isPlaying = false;

    function toggleSound() {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        soundToggleButton.classList.add('paused');
      } else {
        audio.play();
        isPlaying = true;
        soundToggleButton.classList.remove('paused');
      }
    }
    const soundToggleButton = document.querySelector('.k-nav-sound');
    soundToggleButton.addEventListener('click', () => {
      toggleSound();
    });

    const loaderButton = document.querySelector('.k-stroke-button.loader');
    loaderButton.addEventListener('click', () => {
      toggleSound();
    });
    //[END] AUDIO [END]//

  }
  // --- [END] DESKTOP [END] ---//


  // --- MOBILE ---//
  if (window.innerWidth < 803) {
    prologueAnimationMobile();

    document.querySelectorAll('.k-value-frame').forEach(el => {
      el.removeAttribute('data-cutout-inset');
      el.removeAttribute('data-inset-width');
      el.removeAttribute('data-inset-padding');
    });

    const scrollyVideo = new ScrollyVideo({
        scrollyVideoContainer: "scrolly-video",
        src: "https://teamepyc.github.io/cdn/kaviraj/v2/videos/hallway_mobile.mp4",
		    trackScroll: false, 
        sticky: false,
        useWebCodecs: false,
    });

    const mobileImageSequence = gsap.timeline({
      scrollTrigger: {
            trigger: ".k-values",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true
      }
    });

    const kValueIntroText = new SplitText(document.querySelector(".k-value-intro-text"), { type: "chars" });
    const kValueOutroText = new SplitText(document.querySelector(".k-value-outro-text"), { type: "chars" });

    mobileImageSequence
      .to(".k-background[data-sprite]", 
          {ease: "none", duration: 4, onUpdate() {const el = this.targets()[0]; el._spriteSetProgress?.(this.progress());}})
      .fromTo(kValueIntroText.chars, 
          {filter: "blur(5px)", scale: 1.5, opacity: 0},
          {filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.02, duration: 0.5, ease: "power1.out"}, "<+=2.3")
      .to([kValueIntroText.chars], 
          {filter: "blur(5px)", scale: 1, opacity: 0, duration: 0.5, stagger: 0.02}, "+=1")
      .fromTo(".k-background", 
          {filter: "contrast(80%)"},
          {filter: "contrast(100%)", duration: 0.5}, "<")
      .fromTo(kValueOutroText.chars, 
          {filter: "blur(5px)", scale: 1.5, opacity: 0},
          {filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.01, duration: 0.5, ease: "power1.out"}, "+=14")
      .fromTo(".k-background", 
          {filter: "contrast(100%)"},
          {filter: "contrast(80%)", duration: 0.5}, "<-=1")
      .to([kValueOutroText.chars], 
          {filter: "blur(5px)", scale: 1, opacity: 0, duration: 0.4, stagger: 0.01}, "+=1")
      .fromTo(".k-background", 
          {filter: "contrast(80%)"},
          {filter: "contrast(100%)", duration: 0.5}, "<")
      .to({}, {
          duration: 5,
          onUpdate(){ {
            const f = this.progress();
            scrollyVideo.setVideoPercentage(f, {transitionSpeed: 12});
          }},
          })
      .fromTo(".k-cta-content-block",
        {opacity: 0}, {opacity: 1, duration: 0.5}, "-=0.5");

  }

}


window.addEventListener('load', async () => {
    gridResize();
    
    if (window.innerWidth > 803) {
      initializeLenis();
    }

    if (window.innerWidth < 803) {
      document.querySelector('.k-menu').removeAttribute('data-sprite');
      document.querySelector('.image-sequence').removeAttribute('data-sprite');
    }

    visualUtility();

    if (window.spriteMasksReady) {
      await window.spriteMasksReady;
    }
    mainCode();
    navigation();

});



