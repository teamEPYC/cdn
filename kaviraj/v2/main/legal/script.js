import { gridResize, navigation, initializeLenis, visualUtility } from "https://teamepyc.github.io/cdn/kaviraj/v2/utility/global.js";


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



