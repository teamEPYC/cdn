
document.querySelectorAll(".num-text, .num-block .num-num, .num-content-block").forEach(el => {
  el.style.willChange = "transform, opacity, width";
});


gsap.set(".num-accordion-scroller", { height: "400vh" });

ScrollTrigger.create({
  trigger: ".numbers",
  start: "top top",
  end: "bottom bottom",
  pin: ".num-accordion-container",
  pinSpacing: false,
});

const num1text = new SplitText(".num-content-block._1 .num-text", { type: "words" });
const num2text = new SplitText(".num-content-block._2 .num-text", { type: "words" });
const num3text = new SplitText(".num-content-block._3 .num-text", { type: "words" });
const num4text = new SplitText(".num-content-block._4 .num-text", { type: "words" });
const num5text = new SplitText(".num-content-block._5 .num-text", { type: "words" });



if (window.innerWidth >= 992) {

// 1️⃣ Set Initial State (State 0)
gsap.set(".num-block._1", { width: "54.54%" });
gsap.set(".num-block._2", { width: "18.18%" });
gsap.set(".num-block._3", { width: "13.64%" });
gsap.set(".num-block._4", { width: "9.09%" });
gsap.set(".num-block._5", { width: "4.55%" });
gsap.set(".num-block._6", { width: "0%" });
gsap.set(".num-block._7", { width: "0%" });
gsap.set(".num-block._8", { width: "0%" });
gsap.set(".num-block._9", { width: "0%" });

gsap.set(".num-content-block._1", { height: "100%" });
gsap.set(".num-content-block._2", { height: "90%" });
gsap.set(".num-content-block._3", { height: "80%" });
gsap.set(".num-content-block._4", { height: "70%" });
gsap.set(".num-content-block._5", { height: "60%" });
gsap.set(".num-content-block._6", { height: "50%" });
gsap.set(".num-content-block._7", { height: "40%" });
gsap.set(".num-content-block._8", { height: "30%" });
gsap.set(".num-content-block._9", { height: "20%" });

gsap.set(".num-num._1", { scale: 1 });
gsap.set(".num-num._2", { scale: 0.5 });
gsap.set(".num-num._3", { scale: 0.25 });
gsap.set(".num-num._4", { scale: 0.125 });
gsap.set(".num-num._5", { scale: 0.0625 });
gsap.set(".num-num._6", { scale: 0.03125 });
gsap.set(".num-num._7", { scale: 0.015625 });
gsap.set(".num-num._8", { scale: 0.0078125 });
gsap.set(".num-num._9", { scale: 0.00390625 });


const tl = gsap.timeline({ 
    defaults: { duration: 2, ease: "power2.inOut" },
    scrollTrigger: {
        trigger: ".numbers",
        start: "5% 0%",
        end: "95% 100%",
        scrub: 0.5,
        markers: false
    }
});

// ---- STATE 1 ----
tl.to(".num-block._1", { width: "0%" })
  .to(".num-block._2", { width: "54.54%" }, "<")
  .to(".num-block._3", { width: "18.18%" }, "<")
  .to(".num-block._4", { width: "13.64%" }, "<")
  .to(".num-block._5", { width: "9.09%" }, "<")
  .to(".num-block._6", { width: "4.55%" }, "<")
  .to(".num-block._7", { width: "0%" }, "<")
  .to(".num-block._8", { width: "0%" }, "<")
  .to(".num-block._9", { width: "0%" }, "<")

  .to(".num-content-block._1", { height: "100%" }, "<")
  .to(".num-content-block._2", { height: "100%" }, "<")
  .to(".num-content-block._3", { height: "90%" }, "<")
  .to(".num-content-block._4", { height: "80%" }, "<")
  .to(".num-content-block._5", { height: "70%" }, "<")
  .to(".num-content-block._6", { height: "60%" }, "<")
  .to(".num-content-block._7", { height: "50%" }, "<")
  .to(".num-content-block._8", { height: "40%" }, "<")
  .to(".num-content-block._9", { height: "30%" }, "<")

  .to(".num-num._1", { scale: 0 }, "<")
  .to(".num-num._2", { scale: 1 }, "<")
  .to(".num-num._3", { scale: 0.5 }, "<")
  .to(".num-num._4", { scale: 0.25 }, "<")
  .to(".num-num._5", { scale: 0.125 }, "<")
  .to(".num-num._6", { scale: 0.0625 }, "<")
  .to(".num-num._7", { scale: 0.03125 }, "<")
  .to(".num-num._8", { scale: 0.015625 }, "<")
  .to(".num-num._9", { scale: 0.0078125 }, "<")

  .fromTo(num2text.words,
    {y: 10, opacity: 0},
    {y: 0, opacity: 1, stagger: 0.08, duration: 0.6}, "<+=0.6"
  )
  .to(".num-content-block._1 .num-text", { opacity: 0, duration: 0.5 }, "<-=0.5");


// ---- STATE 2 ----
tl.to(".num-block._1", { width: "0%" }, "+=0")
  .to(".num-block._2", { width: "0%" }, "<")
  .to(".num-block._3", { width: "54.54%" }, "<")
  .to(".num-block._4", { width: "18.18%" }, "<")
  .to(".num-block._5", { width: "13.64%" }, "<")
  .to(".num-block._6", { width: "9.09%" }, "<")
  .to(".num-block._7", { width: "4.55%" }, "<")
  .to(".num-block._8", { width: "0%" }, "<")
  .to(".num-block._9", { width: "0%" }, "<")

  .to(".num-content-block._1", { height: "100%" }, "<")
  .to(".num-content-block._2", { height: "100%" }, "<")
  .to(".num-content-block._3", { height: "100%" }, "<")
  .to(".num-content-block._4", { height: "90%" }, "<")
  .to(".num-content-block._5", { height: "80%" }, "<")
  .to(".num-content-block._6", { height: "70%" }, "<")
  .to(".num-content-block._7", { height: "60%" }, "<")
  .to(".num-content-block._8", { height: "50%" }, "<")
  .to(".num-content-block._9", { height: "40%" }, "<")

  .to(".num-num._1", { scale: 0 }, "<")
  .to(".num-num._2", { scale: 0 }, "<")
  .to(".num-num._3", { scale: 1 }, "<")
  .to(".num-num._4", { scale: 0.5 }, "<")
  .to(".num-num._5", { scale: 0.25 }, "<")
  .to(".num-num._6", { scale: 0.125 }, "<")
  .to(".num-num._7", { scale: 0.0625 }, "<")
  .to(".num-num._8", { scale: 0.03125 }, "<")
  .to(".num-num._9", { scale: 0.015625 }, "<")

  .fromTo(num3text.words,
    {y: 10, opacity: 0},
    {y: 0, opacity: 1, stagger: 0.08, duration: 0.6}, "<+=0.6"
  )
  .to(".num-content-block._2 .num-text", { opacity: 0, duration: 0.5 }, "<-=0.5");


// ---- STATE 3 ----
tl.to(".num-block._1", { width: "0%" }, "+=0")
  .to(".num-block._2", { width: "0%" }, "<")
  .to(".num-block._3", { width: "0%" }, "<")
  .to(".num-block._4", { width: "54.54%" }, "<")
  .to(".num-block._5", { width: "18.18%" }, "<")
  .to(".num-block._6", { width: "13.64%" }, "<")
  .to(".num-block._7", { width: "9.09%" }, "<")
  .to(".num-block._8", { width: "4.55%" }, "<")
  .to(".num-block._9", { width: "0%" }, "<")

  .to(".num-content-block._1", { height: "100%" }, "<")
  .to(".num-content-block._2", { height: "100%" }, "<")
  .to(".num-content-block._3", { height: "100%" }, "<")
  .to(".num-content-block._4", { height: "100%" }, "<")
  .to(".num-content-block._5", { height: "90%" }, "<")
  .to(".num-content-block._6", { height: "80%" }, "<")
  .to(".num-content-block._7", { height: "70%" }, "<")
  .to(".num-content-block._8", { height: "60%" }, "<")
  .to(".num-content-block._9", { height: "50%" }, "<")

  .to(".num-num._1", { scale: 0 }, "<")
  .to(".num-num._2", { scale: 0 }, "<")
  .to(".num-num._3", { scale: 0 }, "<")
  .to(".num-num._4", { scale: 1 }, "<")
  .to(".num-num._5", { scale: 0.5 }, "<")
  .to(".num-num._6", { scale: 0.25 }, "<")
  .to(".num-num._7", { scale: 0.125 }, "<")
  .to(".num-num._8", { scale: 0.0625 }, "<")
  .to(".num-num._9", { scale: 0.03125 }, "<")

  .fromTo(num4text.words,
    {y: 10, opacity: 0},
    {y: 0, opacity: 1, stagger: 0.08, duration: 0.6}, "<+=0.6"
  )
  .to(".num-content-block._3 .num-text", { opacity: 0, duration: 0.5 }, "<-=0.5");

// ---- STATE 4 ----
tl.to(".num-block._1", { width: "0%" }, "+=0")
  .to(".num-block._2", { width: "0%" }, "<")
  .to(".num-block._3", { width: "0%" }, "<")
  .to(".num-block._4", { width: "0%" }, "<")
  .to(".num-block._5", { width: "54.54%" }, "<")
  .to(".num-block._6", { width: "18.18%" }, "<")
  .to(".num-block._7", { width: "13.64%" }, "<")
  .to(".num-block._8", { width: "9.09%" }, "<")
  .to(".num-block._9", { width: "4.55%" }, "<")

  .to(".num-content-block._1", { height: "100%" }, "<")
  .to(".num-content-block._2", { height: "100%" }, "<")
  .to(".num-content-block._3", { height: "100%" }, "<")
  .to(".num-content-block._4", { height: "100%" }, "<")
  .to(".num-content-block._5", { height: "100%" }, "<") // per your data
  .to(".num-content-block._6", { height: "90%" }, "<")
  .to(".num-content-block._7", { height: "80%" }, "<")
  .to(".num-content-block._8", { height: "70%" }, "<")
  .to(".num-content-block._9", { height: "60%" }, "<")

  .to(".num-num._1", { scale: 0 }, "<")
  .to(".num-num._2", { scale: 0 }, "<")
  .to(".num-num._3", { scale: 0 }, "<")
  .to(".num-num._4", { scale: 0 }, "<")
  .to(".num-num._5", { scale: 1 }, "<")
  .to(".num-num._6", { scale: 0.5 }, "<")
  .to(".num-num._7", { scale: 0.25 }, "<")
  .to(".num-num._8", { scale: 0.125 }, "<")
  .to(".num-num._9", { scale: 0.0625 }, "<")

  .fromTo(num5text.words,
    {y: 10, opacity: 0},
    {y: 0, opacity: 1, stagger: 0.08, duration: 0.6}, "<+=0.6"
  )
  .to(".num-content-block._4 .num-text", { opacity: 0, duration: 0.5 }, "<-=0.5");

}





if (window.innerWidth <= 991) {
// 1️⃣ Set Initial State (State 0)
gsap.set(".num-block._1", { width: "100%" });
gsap.set(".num-block._2", { width: "0%" });
gsap.set(".num-block._3", { width: "0%" });
gsap.set(".num-block._4", { width: "0%" });
gsap.set(".num-block._5", { width: "0%" });
gsap.set(".num-block._6", { width: "0%" });
gsap.set(".num-block._7", { width: "0%" });
gsap.set(".num-block._8", { width: "0%" });
gsap.set(".num-block._9", { width: "0%" });

gsap.set(".num-num._1", { scale: 1 });
gsap.set(".num-num._2", { scale: 0.1 });
gsap.set(".num-num._3", { scale: 0 });
gsap.set(".num-num._4", { scale: 0 });
gsap.set(".num-num._5", { scale: 0 });
gsap.set(".num-num._6", { scale: 0 });
gsap.set(".num-num._7", { scale: 0 });
gsap.set(".num-num._8", { scale: 0 });
gsap.set(".num-num._9", { scale: 0 });

gsap.set(".num-accordion", { x: 40}, "<")

const tl = gsap.timeline({ 
    defaults: { duration: 2, ease: "power2.inOut" },
    scrollTrigger: {
        trigger: ".numbers",
        start: "5% 0%",
        end: "95% 100%",
        scrub: 0.5,
        markers: false
    }
});

// ---- STATE 1 ----
tl.to(".num-block._1", { width: "0%" })
  .to(".num-block._2", { width: "100%" }, "<")
  .to(".num-block._3", { width: "0%" }, "<")
  .to(".num-block._4", { width: "0%" }, "<")
  .to(".num-block._5", { width: "0%" }, "<")
  .to(".num-block._6", { width: "0%" }, "<")
  .to(".num-block._7", { width: "0%" }, "<")
  .to(".num-block._8", { width: "0%" }, "<")
  .to(".num-block._9", { width: "0%" }, "<")

  .to(".num-num._1", { scale: 0 }, "<")
  .to(".num-num._2", { scale: 1 }, "<")
  .to(".num-num._3", { scale: 0.1 }, "<")
  .to(".num-num._4", { scale: 0 }, "<")
  .to(".num-num._5", { scale: 0 }, "<")
  .to(".num-num._6", { scale: 0 }, "<")
  .to(".num-num._7", { scale: 0 }, "<")
  .to(".num-num._8", { scale: 0 }, "<")
  .to(".num-num._9", { scale: 0 }, "<")

  .to(".num-accordion", { x: 20}, "<")

  .fromTo(num2text.words,
    {y: 10, opacity: 0},
    {y: 0, opacity: 1, stagger: 0.08, duration: 0.6}, "<+=0.6"
  )
  .to(".num-content-block._1 .num-text", { opacity: 0, duration: 0.5 }, "<-=0.5");


// ---- STATE 2 ----
tl.to(".num-block._1", { width: "0%" }, "+=0")
  .to(".num-block._2", { width: "0%" }, "<")
  .to(".num-block._3", { width: "100%" }, "<")
  .to(".num-block._4", { width: "0%" }, "<")
  .to(".num-block._5", { width: "0%" }, "<")
  .to(".num-block._6", { width: "0%" }, "<")
  .to(".num-block._7", { width: "0%" }, "<")
  .to(".num-block._8", { width: "0%" }, "<")
  .to(".num-block._9", { width: "0%" }, "<")

  .to(".num-num._1", { scale: 0 }, "<")
  .to(".num-num._2", { scale: 0 }, "<")
  .to(".num-num._3", { scale: 1 }, "<")
  .to(".num-num._4", { scale: 0.1 }, "<")
  .to(".num-num._5", { scale: 0 }, "<")
  .to(".num-num._6", { scale: 0 }, "<")
  .to(".num-num._7", { scale: 0 }, "<")
  .to(".num-num._8", { scale: 0 }, "<")
  .to(".num-num._9", { scale: 0 }, "<")

  .to(".num-accordion", { x: 0}, "<")

  .fromTo(num3text.words,
    {y: 10, opacity: 0},
    {y: 0, opacity: 1, stagger: 0.08, duration: 0.6}, "<+=0.6"
  )
  .to(".num-content-block._2 .num-text", { opacity: 0, duration: 0.5 }, "<-=0.5");


// ---- STATE 3 ----
tl.to(".num-block._1", { width: "0%" }, "+=0")
  .to(".num-block._2", { width: "0%" }, "<")
  .to(".num-block._3", { width: "0%" }, "<")
  .to(".num-block._4", { width: "100%" }, "<")
  .to(".num-block._5", { width: "0%" }, "<")
  .to(".num-block._6", { width: "0%" }, "<")
  .to(".num-block._7", { width: "0%" }, "<")
  .to(".num-block._8", { width: "0%" }, "<")
  .to(".num-block._9", { width: "0%" }, "<")

  .to(".num-num._1", { scale: 0 }, "<")
  .to(".num-num._2", { scale: 0 }, "<")
  .to(".num-num._3", { scale: 0 }, "<")
  .to(".num-num._4", { scale: 1 }, "<")
  .to(".num-num._5", { scale: 0.1 }, "<")
  .to(".num-num._6", { scale: 0 }, "<")
  .to(".num-num._7", { scale: 0 }, "<")
  .to(".num-num._8", { scale: 0 }, "<")
  .to(".num-num._9", { scale: 0 }, "<")

  .to(".num-accordion", { x: -20}, "<")

  .fromTo(num4text.words,
    {y: 10, opacity: 0},
    {y: 0, opacity: 1, stagger: 0.08, duration: 0.6}, "<+=0.6"
  )
  .to(".num-content-block._3 .num-text", { opacity: 0, duration: 0.5 }, "<-=0.5");

// ---- STATE 4 ----
tl.to(".num-block._1", { width: "0%" }, "+=0")
  .to(".num-block._2", { width: "0%" }, "<")
  .to(".num-block._3", { width: "0%" }, "<")
  .to(".num-block._4", { width: "0%" }, "<")
  .to(".num-block._5", { width: "100%" }, "<")
  .to(".num-block._6", { width: "0%" }, "<")
  .to(".num-block._7", { width: "0%" }, "<")
  .to(".num-block._8", { width: "0%" }, "<")
  .to(".num-block._9", { width: "0%" }, "<")

  .to(".num-num._1", { scale: 0 }, "<")
  .to(".num-num._2", { scale: 0 }, "<")
  .to(".num-num._3", { scale: 0 }, "<")
  .to(".num-num._4", { scale: 0 }, "<")
  .to(".num-num._5", { scale: 1 }, "<")
  .to(".num-num._6", { scale: 0.1 }, "<")
  .to(".num-num._7", { scale: 0 }, "<")
  .to(".num-num._8", { scale: 0 }, "<")
  .to(".num-num._9", { scale: 0 }, "<")

  .to(".num-accordion", { x: -40}, "<")

  .fromTo(num5text.words,
    {y: 10, opacity: 0},
    {y: 0, opacity: 1, stagger: 0.08, duration: 0.6}, "<+=0.6"
  )
  .to(".num-content-block._4 .num-text", { opacity: 0, duration: 0.5 }, "<-=0.5");
}
