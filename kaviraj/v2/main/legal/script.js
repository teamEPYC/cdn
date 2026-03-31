import { gridResize, toggleSound, navigation, initializeLenis, visualUtility } from "https://teamepyc.github.io/cdn/kaviraj/v2/utility/global.js";

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

}


window.addEventListener('load', async () => {
    gridResize();
    initializeLenis();
    if (window.innerWidth < 803) {
      document.querySelector('.k-menu').removeAttribute('data-sprite');
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






