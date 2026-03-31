import { gridResize, toggleSound, navigation, initializeLenis, visualUtility } from "https://teamepyc.github.io/cdn/kaviraj/v2/utility/global.js";
import { prologueAnimationDesktop, prologueAnimationMobile } from "https://teamepyc.github.io/cdn/kaviraj/v2/main/home/prologue.js"; 

// Tablet-blocker: show overlay + prevent this file from running.
(function () {
  function isTabletDevice() {
    const userAgent = navigator.userAgent.toLowerCase();

    const isIPad =
      /ipad/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);

    const isOtherTablet = /tablet|playbook|silk/.test(userAgent);

    return isIPad || isAndroidTablet || isOtherTablet;
  }

  function showTabletOverlayAndBlockJs() {
    const overlay = document.getElementById("tablet-message-overlay");
    const shouldBlock = !!overlay && isTabletDevice();

    if (!shouldBlock) {
      window.__STOP_ALL_OTHER_JS__ = false;
      return;
    }

    overlay.classList.add("is-visible");
    window.__STOP_ALL_OTHER_JS__ = true;
  }

  const isTablet = isTabletDevice();
  if (isTablet) {
    window.__STOP_ALL_OTHER_JS__ = true;
  } else if (typeof window.__STOP_ALL_OTHER_JS__ !== "boolean") {
    window.__STOP_ALL_OTHER_JS__ = false;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showTabletOverlayAndBlockJs);
  } else {
    showTabletOverlayAndBlockJs();
  }
})();

if (!window.__STOP_ALL_OTHER_JS__) {

function mainCode() {  

  // --- DESKTOP ---//
  if (window.innerWidth >= 803) {
    window.lenis?.stop();

    //[START] LOAD SEQUENCE [START]//
    document.querySelectorAll(".k-hero, .k-hero-heading, .k-hero-subtext, .k-hero-cta").forEach(el => {
      el.style.willChange = "transform, opacity, filter";
    });

    const loaderPrelude = new SplitText(
      ".k-preloader-prelude .k-preloader-prelude-text",
      { type: "words, chars" },
    );

    const heroHeadings = document.querySelectorAll(".k-hero-heading");
    const Lheading1 = new SplitText(heroHeadings[0], { type: "chars" });
    const Lheading2 = new SplitText(heroHeadings[1], { type: "chars" });
    const Lheading3 = new SplitText(heroHeadings[2], { type: "chars" });
    const Lsubtext = new SplitText(".k-hero-subtext", { type: "words, chars" });

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
    ).call(() => 
      {window.lenis?.start(); window.lenis.scrollTo(0, { immediate: true });}
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
      {y: "0rem", opacity: 1, duration: 0.5, onComplete: () => {console.log("loadDone"); heroOutro.scrollTrigger.enable(); ScrollTrigger.refresh();}}, "<+=0.5"
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
        scrub: 1
      }
    });

    heroOutro
    .to(".k-hero-content-wrapper .k-solid-button:nth-child(6)", {scale: 0.9, filter: "blur(10px)", opacity: 0, duration: 0.5})
    .to(subtextChars, {opacity: 0, stagger: 0.01, duration: 1}, "<")
    .to(".k-hero-content-wrapper .k-solid-button:nth-child(4)", {scale: 0.9, filter: "blur(10px)", opacity: 0, duration: 0.5}, "-=1")
    .to(heading3Chars, {scale: 0.9, filter: "blur(10px)", scale: 1, opacity: 0, duration: 1, stagger: 0.12}, "-=1")
    .to(heading2Chars, {scale: 0.9, filter: "blur(10px)", scale: 1, opacity: 0, duration: 1, stagger: 0.12}, "-=1.35")
    .to(heading1Chars, {scale: 0.9, filter: "blur(10px)", scale: 1, opacity: 0, duration: 1, stagger: 0.12}, "-=1.35");
    
    heroOutro.scrollTrigger.disable();
    //[END] HERO OUTRO [END]//



    //[START] PROLOGUE [START]//
    prologueAnimationDesktop();    
    //[END] PROLOGUE [END]//
    


    //[START] VALUES [START]//
    document
      .querySelectorAll(
        ".k-value-intro-text, .k-value-intro-text, .k-cta-headline div, .k-cta-subtext div"
      )
      .forEach((el) => {
        el.style.willChange = "transform, opacity, filter";
      });
    
    document.querySelector(".k-background").style.willChange = "transform";

    const VIDEO_URL = 'https://teamepyc.github.io/cdn/kaviraj/v2/videos/hallway1440p.mp4';
    const loaderFill = document.getElementById('loader-bar-fill');
    const loaderText = document.getElementById('loader-text');

    // Fetching Video
    async function loadVideo(url) {
        try {
            const response = await fetch(url);
            const reader = response.body.getReader();
            const contentLength = +response.headers.get('Content-Length');
            let receivedLength = 0;
            let chunks = []; 
            while(true) {
                const {done, value} = await reader.read();
                if (done) break;
                chunks.push(value);
                receivedLength += value.length;
                
                // Update Loader UI
                const progress = (receivedLength / contentLength) * 100;
                loaderFill.style.width = `${progress}%`;
                loaderText.innerText = `${Math.round(progress)}%`;
            }
            const blob = new Blob(chunks, { type: 'video/mp4' });
            const blobUrl = URL.createObjectURL(blob);
            initExperience(blobUrl);
        } catch (error) {
            console.error("Video load failed:", error);
            // Fallback: hide loader anyway if something goes wrong
            //loaderOverlay.style.display = 'none';
            //lenis.start();
        }
    }
    
    //initialising after successful fetch
    function initExperience(videoSource) {
      const scrollyVideo = new ScrollyVideo({
          scrollyVideoContainer: 'scrolly-video-container',
          src: videoSource,
          trackScroll: false, 
          cover: false,
          sticky: false,
          full: false,
          frameThreshold: 0.005
      });

      const valuesTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".k-values",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true
        }
      });
    
      const kValueIntroText = new SplitText(document.querySelector(".k-value-intro-text"), { type: "chars" });
      const kValueOutroText = new SplitText(document.querySelector(".k-value-outro-text"), { type: "chars" });
    
      valuesTimeline
      .to(".image-sequence[data-sprite]",
        {
          ease: "none",
          duration: 2,
          onUpdate() {
            const el = this.targets()[0];
            el._spriteSetProgress?.(this.progress());
          }
        }
      )
      .fromTo(
        kValueIntroText.chars,
        { filter: "blur(10px)", scale: 1.5, opacity: 0 },
        { filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.02, duration: 0.5, ease: "power1.out" },
        "<+=0.5"
      )
      .to(
        [kValueIntroText.chars],
        { filter: "blur(10px)", scale: 1, opacity: 0, duration: 0.5, stagger: 0.02 }
      )
      .fromTo(
        ".image-sequence",
        { filter: "contrast(80%)" },
        { filter: "contrast(100%)", duration: 0.5 },
        "<"
      )
      .fromTo(
        kValueOutroText.chars,
        { filter: "blur(10px)", scale: 1.5, opacity: 0 },
        { filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.01, duration: 0.5, ease: "power1.out" },
        "8.9"
      )
      .fromTo(
        ".image-sequence",
        { filter: "contrast(100%)" },
        { filter: "contrast(80%)", duration: 0.5 },
        "<-=1"
      )
      .to(
        [kValueOutroText.chars],
        { filter: "blur(10px)", scale: 1, opacity: 0, duration: 0.4, stagger: 0.01 },
        "+=0.2"
      )
      .fromTo(
        ".image-sequence",
        { filter: "contrast(80%)" },
        { filter: "contrast(100%)", duration: 0.5 },
        "<"
      )
      .to({},
        { duration: 10.35, ease: "none", 
          onUpdate(){ {
            const f = this.progress();
            scrollyVideo.setTargetTimePercent(f);
          }},
          onComplete: () => {scrollyVideo.setTargetTimePercent(1);}
        },
        "2"
      )
      .to(
        ".k-background",
        { duration: 2.23, scale: 1.2, y: "-10%", ease: "none" },
        "-=2.23"
      )
      .to(".lake", { opacity: 1, duration: 0.1 })
      .fromTo(
        ".k-cta-content-block",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.5"
      );

      setTimeout(() => {
        document.querySelector('.k-preloader-progress-track').classList.add('hide');
      }, 250);
      setTimeout(() => {
        document.querySelector('.k-preloader .k-stroke-button').classList.remove('hide');
      }, 1000);
      
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
    loadVideo(VIDEO_URL);
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

    
    const loaderButton = document.querySelector('.k-stroke-button.loader');
    loaderButton.addEventListener('click', () => {
      toggleSound();
    });

  }
  // --- [END] DESKTOP [END] ---//


  // --- MOBILE ---//
  if (window.innerWidth < 803) {
  if (window.__STOP_ALL_OTHER_JS__) {
    return;
  }



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
          {opacity: 0},
          {opacity: 1, stagger: 0.02, duration: 0.5, ease: "power1.out"}, "<+=2.3")
      .to([kValueIntroText.chars], 
          {opacity: 0, duration: 0.5, stagger: 0.02}, "+=1")
      .fromTo(".k-background", 
          {y: 0},
          {y: 0, duration: 0.5}, "<")
      .fromTo(kValueOutroText.chars, 
          {opacity: 0},
          {opacity: 1, stagger: 0.01, duration: 0.5, ease: "power1.out"}, "+=14")
      .fromTo(".k-background", 
          {y: 0},
          {y: 0, duration: 0.5}, "<-=1")
      .to([kValueOutroText.chars], 
          {scale: 1, opacity: 0, duration: 0.4, stagger: 0.01}, "+=1")
      .fromTo(".k-background", 
          {y:0 },
          {y: 0, duration: 0.5}, "<")
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
        if (window.__STOP_ALL_OTHER_JS__) {
          return;
        }

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
});

const soundToggleButton = document.querySelector('.k-nav-sound');
soundToggleButton?.addEventListener('click', toggleSound);

}
