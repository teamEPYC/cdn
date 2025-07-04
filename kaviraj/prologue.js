
// setting all prologue-content to be fixed in one place
const prologueContents = document.querySelectorAll(".prologue .prologue-content");
prologueContents.forEach((el, index) => {
  const offsetY = -(index + 1) * 100;

  gsap.set(el, {
    y: `${offsetY}vh`
  });

  ScrollTrigger.create({
    trigger: ".prologue",
    start: "0% 100%",
    end: "100% 100%",
    pin: el
  });
});


//adding will-change for GPU Accelration
document.querySelectorAll(".prologue-content, .prologue-content .prologue-text, .prologue-content .prologue-text-small, .prologue-grandfathers-name, .prologue-gi, .prologue-grandfathers-name").forEach(el => {
  el.style.willChange = "transform, opacity, filter";
});

//change this value to progressively slow down the timeleine scroll speed, min value is 0vh
gsap.set(".prologue-speed-controller", {height: "300vh"});

// initializing elements before timeline
const prologue1text1 = new SplitText(prologueContents[0].querySelectorAll(".prologue-content-block:nth-child(1) .prologue-text"), { type: "chars" });
const prologue1text2 = new SplitText(prologueContents[0].querySelectorAll(".prologue-content-block:nth-child(2) .prologue-text"), { type: "chars" });
const prologue2text1 = new SplitText(prologueContents[1].querySelectorAll(".prologue-content-block:nth-child(1) .prologue-text"), { type: "chars" });
const prologue2text2 = new SplitText(prologueContents[1].querySelectorAll(".prologue-content-block:nth-child(2) .prologue-text"), { type: "chars" });
const prologue3text1 = new SplitText(prologueContents[2].querySelectorAll(".prologue-content-block:nth-child(1) .prologue-text-small"), { type: "chars" });
const prologue3text2 = new SplitText(prologueContents[2].querySelector(".prologue-grandfather-container .prologue-grandfathers-name:nth-of-type(1)"), { type: "chars" });
const prologue3text3 = new SplitText(prologueContents[2].querySelector(".prologue-gi .prologue-grandfathers-name"), { type: "chars" }); // splitting internal text so that it aligns with the external
const prologue3image = prologueContents[2].querySelector(".prologue-gi-mask .noise");
const prologue3text4 = new SplitText(prologueContents[2].querySelectorAll(".prologue-content-block:nth-child(2) .prologue-text-small"), { type: "chars" });

//Prologue Timline Initialization with  scrollTrigger
const prologueTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".prologue",
      start: "0% 20%",
      end: "100% 100%",
      scrub: true,
    }
});

//Prologue Timeline Animation Sequence
prologueTimeline.fromTo(prologue1text1.chars,
    {filter: "blur(10px)", scale: 1.5, opacity: 0},
    {filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.2, duration: 4, ease: "power1.out"}
).fromTo(prologue1text2.chars, 
    {filter: "blur(10px)", scale: 1.5, opacity: 0},
    {filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.2, duration: 4, ease: "power1.out"}, "+=2"
).to([prologue1text1.chars, prologue1text2.chars], 
    {filter: "blur(10px)", scale: 1, opacity: 0, duration: 3, stagger: 0.1}, "+=4"
).fromTo(prologue2text1.chars, 
    {filter: "blur(10px)", scale: 1.5, opacity: 0},
    {filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.2, duration: 4, ease: "power1.out"}
).fromTo(prologue2text2.chars, 
    {filter: "blur(10px)", scale: 1.5, opacity: 0},
    {filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.2, duration: 4, ease: "power1.out"}, "+=2"
).to([prologue2text1.chars, prologue2text2.chars], 
    {filter: "blur(10px)", scale: 1, opacity: 0, duration: 3, stagger: 0.1}, "+=4"
).fromTo(prologue3text1.chars, 
    {opacity: 0},
    {opacity: 1, stagger: 0.07, duration: 3, ease: "power1.out"}
).fromTo(prologue3text2.chars, 
    {filter: "blur(10px)", y: -60, scale: 1.5, opacity: 0},
    {filter: "blur(0px)", y: 0, scale: 1, opacity: 1, stagger: 0.3, duration: 4, ease: "sine.inOut"}
).fromTo(prologue3text3.chars, 
    {filter: "blur(10px)", y: -60, scale: 1.5, opacity: 0},
    {filter: "blur(0px)", y: 0, scale: 1, opacity: 1, stagger: 0.3, duration: 4, ease: "sine.inOut"}, "<"
).fromTo(prologue3image, 
    {r: "0%"},
    {r: "100%", duration: 15, ease: "sine.inOut"}, "-=5"
).fromTo(prologue3text4.chars, 
    {opacity: 0},
    {opacity: 1, stagger: 0.07, duration: 3, ease: "power1.out"}, "-=3"
).fromTo(prologueContents[2].querySelector(".prologue-content-wrapper"), 
    {filter: "blur(0px), brightness(100)", scale: 1, opacity: 1, },
    {filter: "blur(20px), brightness(50)", scale: 0.95, opacity: 0, duration: 5, ease: "sine.inOut"}, "+=3"
).fromTo(".prologue-gi", 
    {height: "90%"},
    {height: "75%", duration: 5, ease: "sine.inOut"}, "<-=1"
);/*.to(prologue3image, 
    {r: "50%", duration: 5, ease: "sine.inOut"}, "<-=2"
);*/