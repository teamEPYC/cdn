document.querySelectorAll(".k-hero, .k-hero-heading, .k-hero-subtext, .k-hero-cta").forEach(el => {
  el.style.willChange = "transform, opacity, filter, border-radius, width";
});


if (window.innerWidth >= 992) {
ScrollTrigger.create({trigger: ".k-hero", start: "0%", end: "100%", pin: true, pinSpacing: false});
const heading1 = new SplitText(".k-hero-heading:nth-child(1)", { type: "chars" });
const heading2 = new SplitText(".k-hero-heading:nth-child(2)", { type: "chars" });
const heading3 = new SplitText(".k-hero-heading:nth-child(3)", { type: "chars" });
const subtext = SplitText.create(".k-hero-subtext", { type: "chars" });

heading1.chars.reverse();
heading2.chars.reverse();
heading3.chars.reverse();
subtext.chars.reverse()

const heroOutro = gsap.timeline({
  scrollTrigger: {
    trigger: ".k-services",
    start: "0% 100%",
    end: "0% 20%",
    scrub: true,
    markers: false
  }
});

heroOutro
.to(".k-hero-cta:nth-child(6)", {scale: 0.9, filter: "blur(10px)", opacity: 0, duration: 0.5})
.to(subtext.chars, {scale: 0.9, opacity: 0, stagger: 0.01, duration: 1}, "-=1")
.to(".k-hero-cta:nth-child(4)", {scale: 0.9, filter: "blur(10px)", opacity: 0, duration: 0.5}, "-=1")
.to(heading3.chars, {scale: 0.9, filter: "blur(10px)", scale: 1, opacity: 0, duration: 1, stagger: 0.12}, "-=1")
.to(heading2.chars, {scale: 0.9, filter: "blur(10px)", scale: 1, opacity: 0, duration: 1, stagger: 0.12}, "-=1.35")
.to(heading1.chars, {scale: 0.9, filter: "blur(10px)", scale: 1, opacity: 0, duration: 1, stagger: 0.12}, "-=1.35");
}

