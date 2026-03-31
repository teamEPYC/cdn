import { gridResize, navigation, initializeLenis, visualUtility } from "https://teamepyc.github.io/cdn/kaviraj/v2/utility/global.js";

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
      const menuEl = document.querySelector('.k-menu');
      const backgroundEl = document.querySelector(".k-background");

      if (menuEl) {
        menuEl.removeAttribute('data-sprite');
      }

      if (backgroundEl) {
        backgroundEl.setAttribute(
          "data-sprite-url",
          "https://cdn.prod.website-files.com/6904a418739bb0c76ab91cce/6915dd814981776bd91c2471_spritesheet_mobile.png",
        );
      }

    }
    visualUtility();
    if (window.spriteMasksReady) {
      await window.spriteMasksReady;
    }
    mainCode();
    navigation();

    if(navigator.userAgentData?.platform == "macOS"){initializeLenis();}
    
});

}



