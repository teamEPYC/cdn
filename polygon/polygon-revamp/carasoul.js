
gsap.registerPlugin(Draggable, InertiaPlugin, Observer, ScrollTrigger);

function init3dImageCarousel() {
  let radius;
  let draggableInstances = [];
  let observerInstance;
  let spins = [];
  let intro;
  let lastWidth = window.innerWidth;

  const wraps = document.querySelectorAll("[data-3d-carousel-wrap]");
  if (!wraps.length) return;

  // Calculate radius based on actual panel width and count (proper geometry)
  const calcRadius = (panels) => {
    const panelWidth = panels[0].offsetWidth;
    const count = panels.length;
    const gap = window.innerWidth < 768 ? 1.4 : 1.15; // spacing multiplier
    // Formula: radius = (panelWidth / 2) / tan(π / count)
    radius = (panelWidth / 2) / Math.tan(Math.PI / count) * gap;
  };

  const destroy = () => {
    draggableInstances.forEach((d) => d && d.kill());
    draggableInstances = [];
    observerInstance && observerInstance.kill();
    spins.forEach((s) => s && s.kill());
    spins = [];
    intro && intro.kill();
    ScrollTrigger.getAll().forEach((st) => st.kill());
    wraps.forEach((wrap) => {
      const panels = wrap.querySelectorAll("[data-3d-carousel-panel]");
      gsap.set(panels, { clearProps: "transform" });
    });
  };

  const create = () => {
    const allPanels = [];
    const allContent = [];
    const proxy = document.createElement("div");
    const wrapProgress = gsap.utils.wrap(0, 1);
    const dragDistance = window.innerWidth * 3;
    let startProg;

    // Update visibility with fade for both carousels
    const updateVisibility = () => {
      const fadeRange = 10;

      wraps.forEach((wrap) => {
        const panels = wrap.querySelectorAll("[data-3d-carousel-panel]");
        const isBack = wrap.getAttribute("data-carousel") === "back";

        panels.forEach((panel) => {
          const rotation = gsap.getProperty(panel, "rotationY");
          const normalizedRotation = ((rotation % 360) + 360) % 360;

          let shouldShow;
          let opacity = 0;

          if (isBack) {
            // Back carousel: show only 90-270° (back-facing panels)
            shouldShow = normalizedRotation > 90 && normalizedRotation < 270;

            if (shouldShow) {
              if (normalizedRotation < 90 + fadeRange) {
                opacity = (normalizedRotation - 90) / fadeRange;
              } else if (normalizedRotation > 270 - fadeRange) {
                opacity = (270 - normalizedRotation) / fadeRange;
              } else {
                opacity = 1;
              }
            }
          } else {
            // Front carousel
            shouldShow = normalizedRotation < 90 || normalizedRotation > 270;

            if (shouldShow) {
              if (
                normalizedRotation > 270 &&
                normalizedRotation < 270 + fadeRange
              ) {
                opacity = (normalizedRotation - 270) / fadeRange;
              } else if (
                normalizedRotation > 0 &&
                normalizedRotation < 90 &&
                normalizedRotation > 90 - fadeRange
              ) {
                opacity = (90 - normalizedRotation) / fadeRange;
              } else {
                opacity = 1;
              }
            }
          }

          opacity = Math.max(0, Math.min(1, opacity));
          gsap.set(panel, { autoAlpha: opacity });
        });
      });
    };

    wraps.forEach((wrap, wrapIndex) => {
      const panels = wrap.querySelectorAll("[data-3d-carousel-panel]");
      const content = wrap.querySelectorAll("[data-3d-carousel-content]");
      const isBack = wrap.getAttribute("data-carousel") === "back";

      allPanels.push(...panels);
      allContent.push(...content);

      // Calculate radius based on this wrap's actual panels
      calcRadius(panels);

      // Position panels in 3D space
      panels.forEach((p) => (p.style.transformOrigin = `50% 50% ${-radius}px`));

      // Create rotation - offset back carousel by 180°
      const initialRotation = isBack ? 180 : 0;
      const spin = gsap.fromTo(
        panels,
        { rotationY: (i) => initialRotation + (i * 360) / panels.length },
        {
          rotationY: `-=360`,
          duration: 30,
          ease: "none",
          repeat: -1,
          onUpdate: updateVisibility,
        }
      );

      spin.progress(1000);
      spins.push(spin);
    });

    // Initial visibility update
    updateVisibility();

    // Sync both carousels with single drag
    draggableInstances[0] = Draggable.create(proxy, {
      trigger: wraps[0].parentElement,
      type: "x",
      inertia: true,
      allowNativeTouchScrolling: true,
      onPress() {
        gsap.to(allContent, {
          clipPath: "inset(5%)",
          duration: 0.3,
          ease: "power4.out",
          overwrite: "auto",
        });
        spins.forEach((spin) => {
          gsap.killTweensOf(spin);
          spin.timeScale(0);
        });
        startProg = spins[0].progress();
      },
      onDrag() {
        const p = startProg + (this.startX - this.x) / dragDistance;
        spins.forEach((spin) => spin.progress(wrapProgress(p)));
        updateVisibility();
      },
      onThrowUpdate() {
        const p = startProg + (this.startX - this.x) / dragDistance;
        spins.forEach((spin) => spin.progress(wrapProgress(p)));
        updateVisibility();
      },
      onRelease() {
        if (!this.tween || !this.tween.isActive()) {
          spins.forEach((spin) =>
            gsap.to(spin, { timeScale: 1, duration: 0.1 })
          );
        }
        gsap.to(allContent, {
          clipPath: "inset(0%)",
          duration: 0.5,
          ease: "power4.out",
          overwrite: "auto",
        });
      },
      onThrowComplete() {
        spins.forEach((spin) => gsap.to(spin, { timeScale: 1, duration: 0.1 }));
      },
    })[0];

    // Scroll-into-view animation
    intro = gsap.timeline({
      scrollTrigger: {
        trigger: wraps[0].parentElement,
        start: "top 80%",
        end: "bottom top",
        scrub: false,
        toggleActions: "play resume play play",
      },
      defaults: { ease: "expo.inOut" },
    });

    intro
      .fromTo(spins, { timeScale: 15 }, { timeScale: 1, duration: 2 })
      .fromTo(
        wraps,
        { scale: 0.5, rotationX: 7 },
        { scale: 1, rotationX: 0, duration: 1.2 },
        "<"
      )
      .fromTo(
        allContent,
        { autoAlpha: 0 },
        { autoAlpha: 1, stagger: { amount: 0.8, from: "random" } },
        "<"
      );

    // While-scrolling feedback
    observerInstance = Observer.create({
      target: window,
      type: "wheel,scroll,touch",
      onChangeY: (self) => {
        let v = gsap.utils.clamp(-60, 60, self.velocityY * 0.005);
        spins.forEach((spin) => spin.timeScale(v));
        const resting = v < 0 ? -1 : 1;

        gsap.fromTo(
          { value: v },
          { value: v },
          {
            value: resting,
            duration: 1.2,
            onUpdate() {
              spins.forEach((spin) => spin.timeScale(this.targets()[0].value));
            },
          }
        );
      },
    });
  };

  create();

  const debounce = (fn, ms) => {
    let t;
    return () => {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  };

  window.addEventListener(
    "resize",
    debounce(() => {
      const newWidth = window.innerWidth;
      if (newWidth !== lastWidth) {
        lastWidth = newWidth;
        destroy();
        create();
        ScrollTrigger.refresh();
      }
    }, 200)
  );
}

// Use window load to ensure panel images/widths are measured correctly
window.addEventListener("load", () => {
  init3dImageCarousel();
});
