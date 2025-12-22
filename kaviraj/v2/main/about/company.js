let clickedCard = null;
let startLeftBack  = null;
let startTopBack  = null;
let targetHeightBack = null;
let targetWidthBack = null;

gsap.set(".company-card-overlay", {opacity: 0, pointerEvents: "none"});
document.querySelector(".company-card-lay-front-content").style.width = (document.querySelector(".company-card-lay").offsetWidth / 50 + "rem");

document.querySelectorAll(".company-card").forEach(card => {
  card.addEventListener("click", () => {

    let targetHeight = document.querySelector(".company-card-lay").offsetHeight / 50 + "rem";
    let targetWidth = ((parseFloat(targetHeight) / 7) * 6) + "rem";
    let startElement = card.getBoundingClientRect();
    let startLeft = parseInt(startElement.left);
    let startTop = parseInt(startElement.top);
    let endLeft = window.innerWidth / 2 - parseInt(getComputedStyle(document.querySelector('.company-card-lay')).width) / 2;
    let cardName = card.querySelector(".company-card-text").innerHTML;
    let cardContent = card.querySelector(".company-card-content").innerHTML;
    let cardContentColor =  getComputedStyle(card.querySelector(".company-card-content")).color;

    clickedCard = card;
    startLeftBack = startLeft;
    startTopBack = startTop;
    targetHeightBack = targetHeight;
    targetWidthBack = targetWidth;
    document.querySelector(".company-card-lay-back .company-card-text").innerHTML = cardName;
    document.querySelector(".card-front-name").innerHTML = cardName;
    document.querySelector(".card-front-content").innerHTML = cardContent;
    document.querySelector(".company-card-lay-front").style.color = cardContentColor;

    let cardBgColor = window.getComputedStyle(card).backgroundColor;
    gsap.set(".company-card-lay", { left: 0, top: 0});
    gsap.set(".company-card-lay-front, .company-card-lay-back", {backgroundColor: cardBgColor});

    window.lenis.stop();

    document.querySelector(".company-card-lay").style.willChange = "left, width, height, top, transform";
    document.querySelector(".company-lay-closer").style.willChange = "opacity, filter";

    gsap.timeline().to(card, 
        {opacity: 0, duration: 0}
    ).fromTo(".company-card-overlay", 
        {opacity: 1}, 
        {pointerEvents: "auto", duration: 0}
    ).fromTo(".company-card-lay", 
        {width: "5.8rem", height: "7rem", left: startLeft, top: startTop, rotateY: "180deg"}, 
        {width: targetWidth, height: targetHeight, left: endLeft, top: "1.4rem", rotateY: "0deg", duration: 1.2, ease: "back.inOut"}
    ).fromTo(".company-lay-closer", {opacity: 0}, {opacity: 1, duration: 0.5,}, "<");
  });
});

document.querySelectorAll(".card-closer-button, .company-lay-closer").forEach(el => {
  el.addEventListener("click", () => {
    if (!clickedCard) return;

    gsap.timeline()
    .to(".company-card-lay", {
      width: "5.8rem",
      height: "7rem",
      left: startLeftBack,
      top: startTopBack,
      rotateY: "180deg",
      duration: 1,
      ease: "back.inOut",

      onComplete: () => {
        gsap.set(".company-card-overlay", {opacity: 0, pointerEvents: "none"});
        gsap.set(clickedCard, { opacity: 1, display: "flex" });
        gsap.set(".company-card-lay", {
            width: targetWidthBack,
            height: targetHeightBack,
            top: 0,
            left: 0, 
        });
        window.lenis.start();
        document.querySelector(".company-card-lay-front-content").scrollTop = 0;
      }

    })
    .to(".company-lay-closer", {opacity: 0, duration: 0.5}, "<");

  })
});



const btn = document.querySelector(".k-solid-button.about-timeline")
const overlay = document.querySelector(".ka-timeline-overlay")
const panel = document.querySelector(".ka-timeline-parent")
const closers = document.querySelectorAll(
  ".ka-timeline-overlay-closer, .ka-timeline-close-button"
)

gsap.set(overlay, { opacity: 0, pointerEvents: "none" })

const open = () => {
  window.lenis.stop();
  gsap.set(overlay, { pointerEvents: "auto" })
  gsap.to(overlay, { opacity: 1, duration: 0.25 })
  gsap.fromTo(panel, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35 })
}

const close = () => {
  gsap.to(overlay, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      gsap.set(overlay, { pointerEvents: "none" })
      window.lenis.start();
    }
  })
}

btn?.addEventListener("click", open)
closers.forEach(el => el.addEventListener("click", close))



