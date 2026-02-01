import { gridResize, navigation, initializeLenis, visualUtility } from "https://teamepyc.github.io/cdn/kaviraj/v2/utility/global.js";


function mainCode() {  
if (window.innerWidth >= 803) {

// Background Windows Moving Animation
document.querySelector(".ka-background-frame-container").style.willChange = "transform";

document.querySelectorAll(".ka-chapter-transition").forEach((section, i) => {
  const prev = "-" + ((i) * 100) + "vw";
  const next = "-" + ((i+1) * 100) + "vw";

  gsap.fromTo(".ka-background-frame-container", 
    {x: `${prev}`},
    {x: `${next}`,
    ease: "sine.inOut",
    scrollTrigger: {
      trigger: section,
      start: "40% bottom",
      end: "160% bottom",
      scrub: true,
    }
  });

  gsap.set(".ka-background-frame-container", {x: "0vw"});
});




// All Timeline Will-Change
document.querySelectorAll(".k-chapter-body, .k-chapter-lable").forEach(el => {
      el.style.willChange = "transform, opacity, filter";
});

document.querySelectorAll(".k-chapter-family-member-frame-parent, .k-chapter-family-member-frame").forEach(el => {
      el.style.willChange = "transform";
});


// Text Animation
document.querySelectorAll(".k-chapter-body, .k-chapter-lable, .k-chapter-qoute-text-bold, .k-chapter-qoute-text, .k-chapter-name").forEach((el) => {
  const aboutChapterBody = new SplitText(el, { type: "lines, chars" });

  gsap.fromTo(aboutChapterBody.chars,
    {filter: "blur(4px)", opacity: 0},
    {filter: "blur(0px)", opacity: 1, stagger: 0.02, duration: 0.5, ease: "none",
      scrollTrigger: {trigger: el, start: "top 80%", end: "top 67%", scrub: true}
    }
  );

  gsap.to(aboutChapterBody.lines,
    {opacity: 0, stagger: 0.15, duration: 0.5, ease: "none",
      scrollTrigger: {trigger: el, start: "top 20%", end: "top 10%", scrub: true}
    }
  );

});


// Text Animation
document.querySelectorAll(".k-chapter-qoute-line").forEach((el) => {
  gsap.fromTo(el,
    {scaleY: 0, transformOrigin: "top center"},
    {scaleY: 1, duration: 0.5, ease: "none",
      scrollTrigger: {trigger: el, start: "top 80%", end: "top 67%", scrub: true}
    }
  );
});

document.querySelectorAll(".ka-chapter .k-chapter-qoute-line").forEach((el) => {
  gsap.to(el,
    {opacity: 0, duration: 0.5, ease: "none",
      scrollTrigger: {trigger: el, start: "top 20%", end: "top 10%", scrub: true}
    }
  );
});


/*
document.querySelectorAll(".k-chapter-family-member-frame").forEach((el) => {
  gsap.fromTo(el,
    {rotationX: 90, transformOrigin: "top center", transformPerspective: 1000},
    {rotateX: 0, duration: 0.5, ease: "none",
      scrollTrigger: {trigger: el, start: "top 80%", end: "top 67%", scrub: true}
    }
  );
});

document.querySelectorAll(".k-chapter-family-member-frame-parent").forEach((el) => {
  gsap.fromTo(el,
    {rotationX: 0, transformOrigin: "bottom center", transformPerspective: 1000},
    {rotationX: 90, duration: 0.5, ease: "none",
      scrollTrigger: {trigger: el, start: "top 10%", end: "top 0%", scrub: true}
    }
  );
});
*/


document.querySelectorAll(".k-chapter-family-member-frame").forEach((el) => {
  gsap.fromTo(el,
    {x: 0, opacity: 0, filter: "blur(10px)"},
    {x: 0, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "none",
      scrollTrigger: {trigger: el, start: "top 80%", end: "top 67%", scrub: true}
    }
  );
});

document.querySelectorAll(".k-chapter-family-member-frame-parent").forEach((el) => {
  gsap.fromTo(el,
    {y: 0, opacity: 1, filter: "blur(0px)"},
    {y: 0, opacity: 0, filter: "blur(10px)", duration: 0.5, ease: "none",
      scrollTrigger: {trigger: el, start: "top 20%", end: "top 10%", scrub: true}
    }
  );
});


// Tribute horizontal scroll
document.querySelector(".ka-tribute-container").style.willChange = "transform";
gsap.set(".ka-chapter-tribute", { marginTop: "-140vh" });
gsap.fromTo(
  ".ka-tribute-container",
  { x: "100vw" },
  { x: "-80vw", ease: "none",
    scrollTrigger: {
      trigger: ".ka-tribute-scroller",
      start: "top bottom", 
      end: "bottom bottom", 
      scrub: true
    }
  }
);

document.querySelector(".ka-teams-container").style.willChange = "transform";
gsap.set(".ka-teams", { marginTop: "-100vh" });
gsap.fromTo(
  ".ka-teams-container",
  { x: "100vw" },
  { x: "-270vw", ease: "none",
    scrollTrigger: {
      trigger: ".ka-team-scroller",
      start: "top bottom", 
      end: "bottom bottom", 
      scrub: true
    }
  }
);

document.querySelector(".ka-tribute").style.willChange = "transform";
gsap.to(
  ".ka-tribute",
  { x: "-80vw", ease: "none",
    scrollTrigger: {
      trigger: ".ka-team-scroller",
      start: "top 100%", 
      end: "top 0%", 
      scrub: true
    }
  }
);

/*
document.querySelectorAll(".ka-chapter.last, .ka-background").forEach(el => {
      el.style.willChange = "transform";
});

gsap.to(
  ".ka-chapter.last, .ka-background",
  { x: "-50vw", ease: "none",
    scrollTrigger: {
      trigger: ".ka-tribute-scroller",
      start: "top 100%", 
      end: "top 0%", 
      scrub: true
    }
  }
);
*/




}

if (window.innerWidth < 803) {

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
      document.querySelector('.k-background').setAttribute('data-sprite-url', 'https://cdn.prod.website-files.com/6904a418739bb0c76ab91cce/6915dd814981776bd91c2471_spritesheet_mobile.png'); 
    }

    visualUtility();
    
    if (window.spriteMasksReady) {
      await window.spriteMasksReady;
    }
    
    mainCode();
    navigation();

});


