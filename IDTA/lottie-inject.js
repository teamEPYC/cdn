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
        renderer: el.dataset.renderer || "canvas", // 👈 switched to canvas
        loop: true,
        autoplay: false,
        path,
        rendererSettings: {
          progressiveLoad: true,              // stream frames in
          preserveAspectRatio: "xMidYMid meet" // optional, keeps aspect nice
        }
      });

      anim.addEventListener("DOMLoaded", () => {
        anim.setSpeed(speed);
        // force an initial size pass, esp. if container had flex % sizing
        anim.resize && anim.resize();
      });

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 95%",
        end: "bottom 5%",
        onEnter: () => { if (!prefersReduced) anim.play(); },
        onEnterBack: () => { if (!prefersReduced) anim.play(); },
        onLeave: () => anim.pause(),
        onLeaveBack: () => anim.pause(),
        invalidateOnRefresh: true
      });

      lotties.set(el, { anim, st });
    });
  };

  // pause everything if tab not visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      lotties.forEach(({ anim }) => anim.pause());
    } else {
      lotties.forEach(({ anim, st }) => (st.isActive ? anim.play() : anim.pause()));
    }
  });

  // handle resize / DPR changes
  let rAF;
  const onResize = () => {
    if (rAF) cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      lotties.forEach(({ anim }) => anim.resize && anim.resize());
      ScrollTrigger.refresh();
    });
  };
  window.addEventListener("resize", onResize);

  // expose tiny API
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

  // boot once
  init();

  // call init() again yourself if you inject new [data-lottie] later

  // cleanup
  window.addEventListener("beforeunload", () => {
    lotties.forEach(({ anim, st }) => {
      anim.destroy && anim.destroy();
      st.kill();
    });
    lotties.clear();
  });
})();
