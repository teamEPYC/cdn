
(() => {
  const lotties = new Map();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const init = () => {
    document.querySelectorAll('[data-lottie]').forEach((el) => {
      if (lotties.has(el)) return;

      const path = el.dataset.path;
      if (!path) return;

      const speed = Number(el.dataset.speed || 1);

      const anim = lottie.loadAnimation({
        container: el,
        renderer: el.dataset.renderer || 'svg',
        loop: true,
        autoplay: false,
        path,
        rendererSettings: { progressiveLoad: true }
      });

      anim.addEventListener('DOMLoaded', () => anim.setSpeed(speed));

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 95%',
        end: 'bottom 5%',
        onEnter: () => { if (!prefersReduced) anim.play(); },
        onEnterBack: () => { if (!prefersReduced) anim.play(); },
        onLeave: () => anim.pause(),
        onLeaveBack: () => anim.pause(),
        invalidateOnRefresh: true
      });

      lotties.set(el, { anim, st });
    });
  };

  // visibility: pause all when hidden; resume only active ones
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      lotties.forEach(({ anim }) => anim.pause());
    } else {
      lotties.forEach(({ anim, st }) => (st.isActive ? anim.play() : anim.pause()));
    }
  });

  // resize / refresh (debounced)
  let rAF;
  const onResize = () => {
    if (rAF) cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      lotties.forEach(({ anim }) => anim.resize && anim.resize());
      //ScrollTrigger.refresh();
    });
  };
  window.addEventListener('resize', onResize);

  // optional: expose a minimal API for runtime tweaks
  window.lottieGSAP = {
    setSpeed(el, speed) {
      const entry = lotties.get(el);
      if (entry) entry.anim.setSpeed(Number(speed) || 1);
    },
    pause(el) {
      const entry = lotties.get(el);
      if (entry) entry.anim.pause();
    },
    play(el) {
      const entry = lotties.get(el);
      if (entry) entry.anim.play();
    },
    destroy(el) {
      const entry = lotties.get(el);
      if (!entry) return;
      entry.anim.destroy && entry.anim.destroy();
      entry.st.kill();
      lotties.delete(el);
    }
  };

  // boot
  init();

  // if content is injected later, call init() again.
  // Example: new elements added dynamically → window.lottieGSAP && init();

  // cleanup on unload
  window.addEventListener('beforeunload', () => {
    lotties.forEach(({ anim, st }) => { anim.destroy && anim.destroy(); st.kill(); });
    lotties.clear();
  });
})();
