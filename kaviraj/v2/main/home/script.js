import { gridResize, navigation, initializeLenis, visualUtility } from "https://teamepyc.github.io/cdn/kaviraj/v2/utility/global.js";
import { FrameDecoder } from "https://teamepyc.github.io/cdn/kaviraj/v2/utility/decoder.js";
import { heroAnimation } from "https://teamepyc.github.io/cdn/kaviraj/v2/main/home/hero.js"; 
import { prologueAnimationDesktop, prologueAnimationMobile } from "https://teamepyc.github.io/cdn/kaviraj/v2/main/home/prologue.js"; 

function mainCode() {  

  // --- DESKTOP ---//
  if (window.innerWidth >= 803) {
    heroAnimation();
    prologueAnimationDesktop();

    document.querySelectorAll(".k-value-intro-text, .k-value-intro-text, .k-cta-headline div, .k-cta-subtext div").forEach(el => {
      el.style.willChange = "transform, opacity, filter";
    });

    //START OF SCROLLSYNC & VALUES + CTA ANIMATION
    const VIDEO_URL = "https://teamepyc.github.io/cdn/kaviraj/v2/videos/hallway1440p.mp4";
    const canvas = document.getElementById("wc-canvas");
    const ctx = canvas.getContext("2d", { alpha: true });
    function sizeCanvas() {
      const w = window.innerWidth;
      const h = Math.round(w * 9 / 16);
      canvas.width = w;
      canvas.height = h;
    }
    sizeCanvas();

    (async () => {
      const decoder = new FrameDecoder();
      await decoder.init(VIDEO_URL);
      let running = true;

      //render loop for scrollsync decoder
      const loop = () => {
        if (!running) return;
        decoder.drawFrame(ctx, canvas.width, canvas.height);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);

      //scroll-driven video frame for scrollcync decoder
      const valuesTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".k-values",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true
        }
      });

      //animation timeline for values & cta
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
      .to({}, {
          duration: 10.35, onUpdate() { const f = this.progress();  decoder.seek(f); }}, "2")
      .to(".k-background",
         {duration: 2.23, scale: 1.2, y: "-10%"}, "-=2.23")
      .to(".lake",
         {opacity: 1, duration: 0.1})
      .fromTo(".k-cta-content-block",
        {opacity: 0}, {opacity: 1, duration: 0.5}, "-=0.5");

      //resize handler for scrollsync decoder
      window.addEventListener("resize", sizeCanvas);
      window.addEventListener("beforeunload", () => {
        running = false;
        decoder.destroy();
      });

    })();
    //END OF SCROLLSYNC & VALUES + CTA ANIMATION

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

   

    const loaderPrelude = new SplitText(".k-preloader-prelude .k-preloader-prelude-text", { type: "chars" });
    const Lheading1 = new SplitText(".k-hero-heading:nth-child(1)", { type: "chars" });
    const Lheading2 = new SplitText(".k-hero-heading:nth-child(2)", { type: "chars" });
    const Lheading3 = new SplitText(".k-hero-heading:nth-child(3)", { type: "chars" });
    const Lsubtext = SplitText.create(".k-hero-subtext", { type: "chars" });

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
      {y: "0rem", opacity: 1, duration: 0.5}, "<+=0.5"
    )

    document.querySelector(".k-preloader .k-stroke-button")?.addEventListener("click", () => {
      gsap.set(window, { scrollTo: 0 });
      loadSequence.play();
    });

  }

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
    if (window.innerWidth < 803) {
      //document.querySelector('.k-background').removeAttribute('data-sprite');
      document.querySelector('.k-menu').removeAttribute('data-sprite');
      document.querySelector('.image-sequence').removeAttribute('data-sprite');
      document.querySelector('.k-background').setAttribute('data-sprite-url', 'https://cdn.prod.website-files.com/6904a418739bb0c76ab91cce/6915dd814981776bd91c2471_spritesheet_mobile.png'); 
    }
    visualUtility();
    if (window.spriteMasksReady) {
      await window.spriteMasksReady;
    }
    mainCode();
    navigation();

    if(navigator.userAgentData?.platform == "macOS"){initializeLenis();}
    
});




const audio = new Audio('https://teamepyc.github.io/cdn/kaviraj/v2/sound.mp3');
audio.preload = 'auto'; 
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