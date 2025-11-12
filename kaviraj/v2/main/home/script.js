import { gridResize, navigation, initializeLenis, visualUtility } from "https://teamepyc.github.io/cdn/kaviraj/v2/utility/global.js";
import { FrameDecoder } from "https://teamepyc.github.io/cdn/kaviraj/v2/utility/decoder.js";
import { heroAnimation } from "https://teamepyc.github.io/cdn/kaviraj/v2/main/home/hero.js"; 
import { prologueAnimationDesktop, prologueAnimationMobile } from "https://teamepyc.github.io/cdn/kaviraj/v2/main/home/prologue.js"; 

function mainCode() {  

  // --- DESKTOP ---//
  if (window.innerWidth >= 992) {
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
      .fromTo(".k-background-frame", 
          {filter: "contrast(80%)"},
          {filter: "contrast(100%)", duration: 0.5}, "<")
      .fromTo(kValueOutroText.chars, 
          {filter: "blur(10px)", scale: 1.5, opacity: 0},
          {filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.01, duration: 0.5, ease: "power1.out"}, "8.9")
      .fromTo(".k-background-frame", 
          {filter: "contrast(100%)"},
          {filter: "contrast(80%)", duration: 0.5}, "<-=1")
      .to([kValueOutroText.chars], 
          {filter: "blur(10px)", scale: 1, opacity: 0, duration: 0.4, stagger: 0.01}, "+=0.2")
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
    ).fromTo(".k-cta .k-solid-button", 
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
      }, ease: "expo.out", duration: 1.5
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

    const strokeButtons = document.querySelectorAll('.k-stroke-button');

    strokeButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, { color: "var(--saffron-3)", duration: 0.3});
      gsap.to(button.querySelectorAll('.k-stroke-cta-content'), { y: '-100%', duration: 0.7, ease: "expo.out"});
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, { color: "", duration: 0.3});
      gsap.to(button.querySelectorAll('.k-stroke-cta-content'), { y: '0%', duration: 0.7,  ease: "expo.out" });
    });
    });

    const solidButtons = document.querySelectorAll('.k-solid-button');

    solidButtons.forEach(button => {
      const icons = button.querySelectorAll('.k-solid-button-icon');
      const text = button.querySelector('.k-solid-button-text');
    
      button.addEventListener('mouseenter', () => {
        gsap.to(icons[0], { scale: 1, duration: 0.5,  ease: "expo.out" });
        gsap.to(icons[1], { scale: 0, duration: 0.5,  ease: "expo.out" });
        gsap.to(text, { x: "0.6rem", duration: 0.5,  ease: "expo.out" });
      });
    
      button.addEventListener('mouseleave', () => {
        gsap.to(icons[0], { scale: 0, duration: 0.5,  ease: "expo.out" });
        gsap.to(icons[1], { scale: 1, duration: 0.5,  ease: "expo.out" });
        gsap.to(text, { x: "0rem", duration: 0.5,  ease: "expo.out" });
      });
    });

  }

  // --- MOBILE ---//
  if (window.innerWidth < 992) {
    prologueAnimationMobile();

    document.querySelectorAll('.k-value-frame').forEach(el => {
      el.removeAttribute('data-cutout-inset');
      el.removeAttribute('data-inset-width');
      el.removeAttribute('data-inset-padding');
    });
    document.querySelector('.k-nav-menu-button').addEventListener('click', () => {
      const menu = document.querySelector('.k-menu');
      const hamIcon = document.querySelector('.k-menu-ham-icon');
      const hamText = document.querySelector('.k-menu-ham-text');

      menu.classList.toggle('on');
      hamIcon.classList.toggle('hide');

      hamText.textContent = hamText.textContent.trim() === "Menu" ? "Close" : "Menu";
    });

  }

}


window.addEventListener('load', async () => {
    gridResize();
    if (window.innerWidth < 992) {
      document.querySelectorAll('.k-menu, .k-background .image-sequence').forEach(el => el.removeAttribute('data-sprite'));
    }
    visualUtility();
    if (window.spriteMasksReady) {
      await window.spriteMasksReady;
    }
    mainCode();
    navigation();

    if(navigator.userAgentData?.platform == "macOS"){initializeLenis();}
    
});




