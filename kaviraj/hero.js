// making hero section sticky
ScrollTrigger.create({
    trigger: ".hero",
    start: "0%",
    end: "100%",
    pin: true,
    pinSpacing: false
});


// Hero scroll out of view
document.querySelectorAll(".heading, .hero-subtext, .primary-button-wrapper, .nav-logo, .nav-logo-text-mask, .nav-menu, .nav-menu-ham").forEach(el => {
  el.style.willChange = "transform, opacity, filter, border-radius, width";
});

const heading1 = new SplitText(".heading:nth-child(1)", { type: "chars" });
const heading2 = new SplitText(".heading:nth-child(2)", { type: "chars" });
const heading3 = new SplitText(".heading:nth-child(3)", { type: "chars" });
const subtext = SplitText.create(".hero-subtext", { type: "chars" });
const buttons = gsap.utils.toArray('.primary-button-wrapper');

heading1.chars.reverse();
heading2.chars.reverse();
heading3.chars.reverse();
subtext.chars.reverse()

const heroOutro = gsap.timeline({
  scrollTrigger: {
    trigger: ".services",
    start: "0% 100%",
    end: "0% 20%",
    scrub: true
  }
});

heroOutro.to(buttons[1].querySelector(".primary-button"),
    {scale: 0.9, filter: "blur(10px)", opacity: 0, duration: 0.5, stagger: 0.2}
).to(subtext.chars, 
    {scale: 0.9, opacity: 0, stagger: 0.01, duration: 1}, "-=1"
).to(buttons[0].querySelector(".primary-button"),
    {scale: 0.9, filter: "blur(10px)", opacity: 0, duration: 0.5, stagger: 0.2}, "-=1"
).to(heading3.chars,
    {scale: 0.9,  filter: "blur(10px)", scale: 1, opacity: 0, duration: 1, stagger: 0.12}, "-=1"
).to(heading2.chars,
    {scale: 0.9, filter: "blur(10px)", scale: 1, opacity: 0, duration: 1, stagger: 0.12}, "-=1.35"
).to(heading1.chars,
    {scale: 0.9,  filter: "blur(10px)", scale: 1, opacity: 0, duration: 1, stagger: 0.12}, "-=1.35"
)


//Nav open and collapse
const tlLogo = gsap.timeline({ paused: true, reversed: true });
const tlMenu = gsap.timeline({ paused: true, reversed: true });

tlLogo.fromTo(".nav-logo-text-mask", 
    { width: "55%" }, 
    { width: "0%", duration: 0.8, ease: "quart.inOut" }, 0
).fromTo(".nav-logo", 
    { width: "150px" }, 
    { width: "65px", duration: 0.8, ease: "quart.inOut" }, 0);

tlMenu.fromTo(".nav-menu", 
    { x: 0 }, 
    { x: 140, duration: 0.8, ease: "quart.inOut" }, 0
).fromTo(".nav-menu-ham", 
    { "--nav-border": "50%" }, 
    { "--nav-border": "0%", duration: 0.5, ease: "quart.inOut" }, 0.3);

// 🟡 State tracking
let isCollapsed = false;
let lastScroll = window.scrollY;

// 🟡 Scroll-triggered nav collapse/expand
ScrollTrigger.create({
  start: 0,
  onUpdate: self => {
    const currentScroll = self.scroll();
    const scrollingDown = currentScroll > lastScroll;

    if (scrollingDown && !isCollapsed) {
      // Collapse nav (scroll down)
      tlLogo.play();
      tlMenu.play();
      isCollapsed = true;
    } else if (!scrollingDown && isCollapsed) {
      // Expand nav (scroll up)
      tlLogo.reverse();
      tlMenu.reverse();
      isCollapsed = false;
    }

    lastScroll = currentScroll;
  }
});

// 🟡 Hover effect on .nav-logo (only when collapsed)
const navLogo = document.querySelector(".nav-logo");

navLogo.addEventListener("mouseenter", () => {
  if (isCollapsed) tlLogo.reverse();
});

navLogo.addEventListener("mouseleave", () => {
  if (isCollapsed) tlLogo.play();
});
