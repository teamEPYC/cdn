
let resizeFrameId;
  function updateBaseValue() {
    const columnBlock = document.querySelector('.column-block');
    const columnWidth = columnBlock.offsetWidth;
    document.documentElement.style.setProperty('--base', columnWidth);
    console.log('Updated --base to:', columnWidth);
  }
  function handleResize() {
    if (resizeFrameId) {
      cancelAnimationFrame(resizeFrameId);
    }
    resizeFrameId = requestAnimationFrame(updateBaseValue);
  }
  window.addEventListener('resize', () => {
    handleResize();
  });
  document.addEventListener("keydown", function (event) {
    if (event.shiftKey && event.key.toLowerCase() === "g") {
      const el = document.querySelector(".grid");
      if (el) {
        el.classList.toggle("off");
      }
    }
  });
updateBaseValue();
console.log('Press [Shift + G] for Grids.');
  history.scrollRestoration = 'manual';
	window.lenis = new Lenis({
      useStrict: true,
    });
window.lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => { window.lenis.raf(time * 1500); });
gsap.ticker.lagSmoothing(0);
setTimeout(() => ScrollTrigger.refresh(), 100);
