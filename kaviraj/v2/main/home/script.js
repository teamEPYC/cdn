import { gridResize, navigation, initializeLenis, visualUtility } from "https://teamepyc.github.io/cdn/kaviraj/v2/utility/global.js";
import { FrameDecoder } from "https://teamepyc.github.io/cdn/kaviraj/v2/utility/decoder.js";
import { heroAnimation } from "https://teamepyc.github.io/cdn/kaviraj/v2/main/home/hero.js"; 
import { prologueAnimation } from "https://teamepyc.github.io/cdn/kaviraj/v2/main/home/prologue.js"; 



function mainCode() {  
  
  // --- DESKTOP ---//
  if (window.innerWidth >= 992) {
    heroAnimation();
    prologueAnimation();

    document.querySelectorAll(".k-value-intro-text, .k-value-intro-text, .k-cta-headline div, .k-cta-subtext div").forEach(el => {
      el.style.willChange = "transform, opacity, filter";
    });

    //START OF SCROLLSYNC & VALUES + CTA ANIMATION
    const VIDEO_URL = "https://teamepyc.github.io/cdn/kaviraj/v2/videos/hallway2.mp4";
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

      valuesTimeline
      .to(".image-sequence[data-sprite]", 
          {ease: "none", duration: 2, onUpdate() {const el = this.targets()[0]; el._spriteSetProgress?.(this.progress());}})
      .fromTo(kValueIntroText.chars, 
          {filter: "blur(10px)", scale: 1.5, opacity: 0},
          {filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.02, duration: 0.5, ease: "power1.out"}, "<+=0.5")
      .to([kValueIntroText.chars], 
          {filter: "blur(10px)", scale: 1, opacity: 0, duration: 0.5, stagger: 0.02})
      .fromTo(".k-background-frame", 
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

    kCTA.fromTo(".k-kv-logo-icon", 
      {opacity: 0},
      {opacity: 1, duration: 2}
    ).fromTo(kCtaHeadline.chars, 
      {filter: "blur(4px)", opacity: 0},
      {filter: "blur(0px)", opacity: 1, stagger: 0.1, duration: 2, ease: "power1.out"}, "<+=1"
    ).fromTo(kCtaSubtext.chars, 
      {filter: "blur(1px)", opacity: 0},
      {filter: "blur(0px)", opacity: 1, stagger: 0.01, duration: 2, ease: "power1.out"}, "<+=3"
    ).fromTo(".k-cta-cta", 
      {filter: "blur(2px)", scale: 0.9, opacity: 0},
      {filter: "blur(0px)", scale: 1, opacity: 1, duration: 2}, "<+=1"
    );

    // Menu Toggle
    const menuTl = gsap.timeline({ 
      paused: true,
      defaults: { ease: "expo.out", duration: 1.5 }
    });

    menuTl.to(".k-menu", {display: "block", duration: 0})
    .to(".k-menu[data-sprite]", { 
      onUpdate() {
        const el = this.targets()[0];
        el._spriteSetProgress?.(this.progress());
      }
    });

    // toggle state
    let open = false;

    document.querySelector(".k-nav-menu-button").addEventListener("click", () => {
      open = !open;
      menuTl[open ? "play" : "reverse"]();
    });

    document.querySelector(".k-menu-close").addEventListener("click", () => {
      open = !open;
      menuTl[open ? "play" : "reverse"]();
    });

  }

  // --- MOBILE ---//
  if (window.innerWidth < 992) {
    document.querySelectorAll('.k-value-frame').forEach(el => {
      el.removeAttribute('data-cutout-inset');
      el.removeAttribute('data-inset-width');
      el.removeAttribute('data-inset-padding');
    });
  }

}


window.addEventListener('load', () => {
    gridResize();
    visualUtility();
    navigation();
    mainCode();
    initializeLenis();
});

    