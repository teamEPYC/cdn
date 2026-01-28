import { gridResize, navigation, initializeLenis, visualUtility } from "https://teamepyc.github.io/cdn/kaviraj/v2/utility/global.js";


function mainCode() {  

const items = document.querySelectorAll(".kib-faq-item")

items.forEach((item, i) => {
  const q = item.querySelector(".kib-faq-question")
  const a = item.querySelector(".kib-faq-answer")
  const line = item.querySelector(".kib-faq-line.alt")

  gsap.set(a, { height: 0, overflow: "hidden" })
  gsap.set(line, { rotateZ: 90 })

  if (i === 2) {
    item.classList.add("active")
    gsap.set(a, { height: "auto" })
    gsap.set(line, { rotateZ: 0 })
  }

  q.addEventListener("click", () => {
    const open = item.classList.toggle("active")

    gsap.to(a, {
      height: open ? a.scrollHeight : 0,
      duration: 0.35,
      ease: "power2.out",
      onComplete: open ? () => gsap.set(a, { height: "auto" }) : null
    })

    gsap.to(line, {
      rotateZ: open ? 0 : 90,
      duration: 0.25,
      ease: "power2.out"
    })
  })
})


}


window.addEventListener('load', async () => {
    gridResize();
    if (window.innerWidth < 803) {
      document.querySelector('.k-menu').removeAttribute('data-sprite');
    }
    visualUtility();
    if (window.spriteMasksReady) {
      await window.spriteMasksReady;
    }
    mainCode();
    navigation();

    if(navigator.userAgentData?.platform == "macOS"){initializeLenis();}
    
});
