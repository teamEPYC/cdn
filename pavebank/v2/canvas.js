// =========================================================================
// ANIMATIONS.JS
// =========================================================================

window.addEventListener('load', () => {

  // ── Typewriter ────────────────────────────────────────────────────────────

  function startTypewriter() {
    const el = document.querySelector('.heading_rotate');
    if (!el) return;
    const words = ['Institutional', 'Corporate', 'Agentic', 'Infrastructure'];
    let current = 0;
    const typeDelay   = 80;
    const deleteDelay = 50;
    const pauseDelay  = 2000;

    function deleteText(cb) {
      const text = el.textContent;
      if (!text.length) { cb(); return; }
      el.textContent = text.slice(0, -1);
      setTimeout(() => deleteText(cb), deleteDelay);
    }

    function typeText(word, cb) {
      el.textContent = '';
      let i = 0;
      function next() {
        if (i >= word.length) { cb(); return; }
        el.textContent += word[i++];
        setTimeout(next, typeDelay);
      }
      next();
    }

    function loop() {
      setTimeout(() => {
        deleteText(() => {
          current = (current + 1) % words.length;
          typeText(words[current], loop);
        });
      }, pauseDelay);
    }

    loop();
  }

  startTypewriter();

  // ── Globe scroll animation ────────────────────────────────────────────────
  // Trigger: bottom of .pn-hero hits 100% viewport → 0% viewport
  // Effect: globe moves from bottom-crop to canvas centre, shrinks to 9.4rem diameter
  // Also: scroll velocity increases rotation speed

  const BASE_SPEED = 0.005;

  // Set initial state for overlays
  gsap.set('.cr-blocks.top, .cr-blocks.bottom', { scaleY: 0 });
  gsap.set('.cr-blocks.left, .cr-blocks.right', { scaleX: 0 });

  ScrollTrigger.create({
    trigger: '.pn-hero',
    start:   'bottom 100%',
    end:     'bottom 0%',
    scrub:   true,
    onUpdate: (self) => {
      grid1.globeScrollProgress = self.progress;
      grid1.GLOBE_SPEED = BASE_SPEED + Math.abs(self.getVelocity()) / 1000 * 0.06;

      const p = self.progress;
      gsap.set('.cr-blocks.top, .cr-blocks.bottom', { scaleY: p });
      gsap.set('.cr-blocks.left, .cr-blocks.right', { scaleX: p });
    },
    onLeave:     () => { grid1.GLOBE_SPEED = BASE_SPEED; },
    onLeaveBack: () => { grid1.GLOBE_SPEED = BASE_SPEED; },
  });

  // ── Trust & operations — cr-blocks resize ──────────────────────────────────
  // Scrubbed on .pn-trust-operations: left/right blocks widen to 1.4rem and the
  // bottom block grows to 6.2rem in height.
  if (document.querySelector('.pn-trust-operations')) {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.pn-trust-operations',
        start:   'top 30%',
        end:     'top -30%',
        scrub:   true,
      }
    })
    .to('.cr-blocks.left', {
      width: '11rem',
      ease:  'power1.inOut',
    }, 0)
    .to('.cr-blocks.right', {
      width: '1.4rem',
      ease:   'power1.inOut',
    }, 0)
    .to('.cr-blocks.top', {
      height: '3.2rem',
      ease:   'power1.inOut',
    }, 0)
    .to('.cr-blocks.bottom', {
      height: '9rem',
      ease:   'power1.inOut',
    }, 0);
  }

  // ── Hero content exit ──────────────────────────────────────────────────────
  // Slide .pn-hero-content down as the hero scrolls away.

  if (document.querySelector('.pn-hero-content')) {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.pn-hero',
        start:   'bottom 100%',
        end:     'bottom 0%',
        scrub:   true,
      }
    })
    .to('.pn-hero-content', {
      y:    '20vh',
      ease: 'none',
    });
  }

  // ── Phase 1: Globe outro — disintegration ─────────────────────────────────
  // Trigger: top of .globe-outro hits 100% viewport → 50% viewport
  // Effect: globe pixels scatter / disintegrate and fade out (scrubbed).
  // Scrubbing back up reassembles the globe automatically.

  ScrollTrigger.create({
    trigger: '.globe-outro',
    start:   'top 100%',
    end:     'top 50%',
    scrub:   true,
    onUpdate: (self) => {
      grid1.outroProgress = self.progress;
    },
    onLeave:     () => { grid1.outroProgress = 1; },
    onLeaveBack: () => { grid1.outroProgress = 0; },
  });

  // ── Product graphic sequence factory ──────────────────────────────────────
  // Reusable for every .pn-product-scroll graphic. The canvas renders a shared
  // state object; here we own the scroll choreography. Three fixed anchors:
  //
  //   REVEAL : top+=revealStartVh bottom → top+=revealEndVh bottom   (fixed vh)
  //   MIDDLE : everything between reveal-end and exit-start           (stretches)
  //   EXIT   : bottom-=exitStartVh bottom → bottom-=exitEndVh bottom  (fixed vh)
  //
  // Reveal & exit are always the same physical scroll distance (vh-anchored).
  // In the MIDDLE, holds are a FIXED vh each; the flips stretch to fill whatever
  // space is left. So to slow/speed the flips, just change the section's height.
  //
  // config = {
  //   trigger,                       // selector / element
  //   state,                         // object the canvas renders
  //   revealStartVh, revealEndVh,    // reveal window (vh of scroll)
  //   exitStartVh,   exitEndVh,      // exit window   (vh of scroll, from bottom)
  //   holdVh,                        // hold length between middle steps (fixed vh)
  //   revealEase, exitEase,          // GSAP ease names for reveal/exit (optional)
  //   onReveal(state, p),            // 0→1 scrub for reveal (p already eased)
  //   onExit(state, p),              // 0→1 scrub for exit   (p already eased)
  //   steps: [ fn(state, tl, holdDur, flipDur), ... ]  // middle builders
  // }
  function buildProductSequence(cfg) {
    const vh = (f) => window.innerHeight * f;
    // Pre-parse eases once; default to linear if omitted.
    const revealEase = gsap.parseEase(cfg.revealEase || 'none');
    const exitEase   = gsap.parseEase(cfg.exitEase   || 'none');

    // REVEAL — fixed vh window
    ScrollTrigger.create({
      trigger: cfg.trigger,
      start: () => `top+=${vh(cfg.revealStartVh)} bottom`,
      end:   () => `top+=${vh(cfg.revealEndVh)} bottom`,
      scrub: true,
      onUpdate: (self) => cfg.onReveal(cfg.state, revealEase(self.progress)),
    });

    // EXIT — fixed vh window (anchored to the section bottom)
    ScrollTrigger.create({
      trigger: cfg.trigger,
      start: () => `bottom-=${vh(cfg.exitStartVh)} bottom`,
      end:   () => `bottom-=${vh(cfg.exitEndVh)} bottom`,
      scrub: true,
      onUpdate: (self) => cfg.onExit(cfg.state, exitEase(self.progress)),
    });

    // MIDDLE — spans from reveal-end anchor down to exit-start anchor.
    // Holds are fixed vh; flips stretch to fill the rest. We build the timeline
    // with durations as fractions of the middle span, recomputed on refresh.
    const steps = cfg.steps || [];
    if (steps.length) {
      const midTL = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: cfg.trigger,
          // middle window: top+=revealEndVh  →  bottom-=exitStartVh
          start: () => `top+=${vh(cfg.revealEndVh)} bottom`,
          end:   () => `bottom-=${vh(cfg.exitStartVh)} bottom`,
          scrub: true,
        },
      });

      // Compute durations from the live middle span so holds stay a fixed vh.
      // middleSpanPx = (section bottom - exitStartVh) - (section top + revealEndVh)
      const buildSteps = () => {
        const el = typeof cfg.trigger === 'string'
          ? document.querySelector(cfg.trigger) : cfg.trigger;
        const h = el ? el.offsetHeight : window.innerHeight;
        const midSpanPx = (h - vh(cfg.exitStartVh)) - (vh(cfg.revealEndVh));
        const span = Math.max(1, midSpanPx);

        // Fixed-vh hold as a fraction of the middle span.
        const holdFrac = vh(cfg.holdVh) / span;
        // There's one hold before each step. Remaining time splits across flips.
        const nFlips = steps.length;
        const totalHold = holdFrac * nFlips;
        const flipFrac = Math.max(0.0001, (1 - totalHold) / nFlips);

        midTL.clear();
        steps.forEach((stepFn) => {
          stepFn(cfg.state, midTL, holdFrac, flipFrac);
        });
      };

      buildSteps();
      // Recompute on refresh (resize / layout change) so holds stay fixed vh.
      ScrollTrigger.addEventListener('refreshInit', buildSteps);
    }
  }

  // ── Bank accounts — 3D currency sequence ($ → € → ¥) ───────────────────────
  const C  = ['$', '\u20AC', '\u00A5'];   // Dollar, Euro, Yen
  const cs = grid1.curState;              // the object the canvas renders

  // One flip step: proxy a 0→1 → 0→π rotation; symbol swaps at the 90° slab.
  // `holdDur` is prepended as a delay so each flip waits a fixed hold first.
  function flipStep(from, to) {
    return (state, tl, holdDur, flipDur) => {
      const proxy = { a: 0 };
      tl.to(proxy, {
        a: 1, duration: flipDur, ease: 'power2.inOut', delay: holdDur,
        onUpdate() {
          const local = proxy.a * Math.PI;
          state.symbol    = proxy.a < 0.5 ? from : to;
          state.flipAngle = -(local < Math.PI/2 ? local : local - Math.PI);
        },
      });
    };
  }

  buildProductSequence({
    trigger: '.pn-product-scroll.bankaccount',
    state:   cs,
    revealStartVh: 0.0,
    revealEndVh:   0.30,
    exitStartVh:   0.30,
    exitEndVh:     0.0,
    holdVh:        0.10,
    revealEase: 'circ.out',
    exitEase:   'none',
    onReveal: (s, p) => {
      // p is already eased by the factory
      s.symbol   = C[0];
      s.scale    = p;
      s.dissolve = 0;
    },
    onExit: (s, p) => {
      s.dissolve = p;     // p already eased
    },
    steps: [
      flipStep(C[0], C[1]),   // $ → €
      flipStep(C[1], C[2]),   // € → ¥
    ],
  });

  // ── Digital Asset Management — isometric cube (.pn-product-scroll.dam) ──────
  // reveal (6 minis scale up) → merge (fly in, centre cube grows) → spin ×2 →
  // dissolve. Drives grid1.damState; the canvas renders it. Same factory, same
  // fixed-vh reveal/exit + stretchy middle as bank accounts.
  const damState = grid1.damState;

  // Middle step builders — each gets (state, tl, holdDur, flipDur).
  const mergeStep = (state, tl, holdDur, flipDur) =>
    tl.to(state, { merge: 1, duration: flipDur, ease: 'none', delay: holdDur });
  // A single 90° spin; `target` is the absolute rotation in radians.
  const spinStep = (target) => (state, tl, holdDur, flipDur) =>
    tl.to(state, { rot: target, duration: flipDur, ease: 'power2.inOut', delay: holdDur });

  buildProductSequence({
    trigger: '.pn-product-scroll.dam',
    state:   damState,
    revealStartVh: 0.0,
    revealEndVh:   0.30,
    exitStartVh:   0.30,
    exitEndVh:     0.0,
    holdVh:        0.10,
    revealEase: 'power3.out',
    exitEase:   'none',
    onReveal: (s, p) => {
      s.reveal   = p;     // 6 minis scale up (staggered inside the canvas)
      s.merge    = 0;
      s.dissolve = 0;
    },
    onExit: (s, p) => {
      s.dissolve = p;     // grid-quantized hop dissolve
    },
    steps: [
      mergeStep,                 // minis fly in, centre cube accumulates
      spinStep(-Math.PI/2),      // rotate 1
      spinStep(-Math.PI),        // rotate 2
    ],
  });

  // ── PaveNet — concentric rings (.pn-product-scroll.pnet) ───────────────────
  // reveal (4 rings scale up, staggered) → spin Y 360° (staggered) → spin X 360°
  // (staggered) → dissolve. Rings are static between phases (aligned holds).
  // Drives grid1.pnetState; the canvas renders it. Same factory as the others.
  const pnetState = grid1.pnetState;

  // Each 360° rotation step drives a state field 0→1; the canvas maps that to a
  // full turn per ring with its own stagger. Hold precedes each via holdDur.
  const ringSpin = (field) => (state, tl, holdDur, flipDur) =>
    tl.to(state, { [field]: 1, duration: flipDur, ease: 'power2.inOut', delay: holdDur });

  buildProductSequence({
    trigger: '.pn-product-scroll.pnet',
    state:   pnetState,
    revealStartVh: 0.0,
    revealEndVh:   0.30,
    exitStartVh:   0.30,
    exitEndVh:     0.0,
    holdVh:        0.10,
    revealEase: 'circ.out',
    exitEase:   'none',
    onReveal: (s, p) => {
      s.reveal   = p;     // rings scale up (staggered inside the canvas)
      s.spinY    = 0;
      s.spinX    = 0;
      s.dissolve = 0;
    },
    onExit: (s, p) => {
      s.dissolve = p;     // grid-quantized hop dissolve
    },
    steps: [
      ringSpin('spinY'),   // 360° about vertical axis (staggered)
      ringSpin('spinX'),   // 360° about horizontal axis (staggered)
    ],
  });

  // ── Trading & Markets — scrolling market chart (.pn-product-scroll.trade) ───
  // reveal (3 bars rise, staggered) → scroll (strip slides right→left through the
  // chart, then the tail exits left → empty canvas). No separate dissolve: the
  // scroll-off IS the exit, so the middle step carries scroll 0→1 to completion.
  // Drives grid1.tradeState; the canvas renders it.
  const tradeState = grid1.tradeState;

  const scrollStep = (state, tl, holdDur, flipDur) =>
    tl.to(state, { scroll: 1, duration: flipDur, ease: 'none', delay: holdDur });

  buildProductSequence({
    trigger: '.pn-product-scroll.trade',
    state:   tradeState,
    revealStartVh: 0.0,
    revealEndVh:   0.30,
    exitStartVh:   0.0,        // no separate exit — the scroll carries it off
    exitEndVh:     0.0,
    holdVh:        0.10,
    revealEase: 'power3.out',
    onReveal: (s, p) => {
      s.reveal = p;            // 3 bars rise (staggered inside the canvas)
      s.scroll = 0;
    },
    onExit: () => {},          // unused
    steps: [
      scrollStep,              // strip scrolls through the chart and off the left
    ],
  });

  // ── Treasury Management — segmented ring (.pn-product-scroll.treasury) ──────
  // reveal (slices scale in, staggered anti-cw) → middle (flip wave through the
  // slices WHILE the ring spins 180°, in parallel) → exit (slices scale out).
  // Drives grid1.treasuryState; the canvas renders it.
  const treasuryState = grid1.treasuryState;

  // One middle step that drives flip + spin together (parallel, same duration).
  const treMiddleStep = (state, tl, holdDur, flipDur) => {
    const lbl = 'treMid' + tl.totalDuration();
    tl.addLabel(lbl, `+=${holdDur}`);
    tl.to(state, { flip: 1, duration: flipDur, ease: 'none' }, lbl);
    tl.to(state, { spin: 1, duration: flipDur, ease: 'power1.inOut' }, lbl);
  };

  buildProductSequence({
    trigger: '.pn-product-scroll.treasury',
    state:   treasuryState,
    revealStartVh: 0.0,
    revealEndVh:   0.30,
    exitStartVh:   0.30,
    exitEndVh:     0.0,
    holdVh:        0.10,
    revealEase: 'power2.out',
    exitEase:   'power2.in',
    onReveal: (s, p) => {
      s.reveal = p;            // slices scale in (staggered inside the canvas)
      s.flip   = 0;
      s.spin   = 0;
      s.exit   = 0;
    },
    onExit: (s, p) => {
      s.exit = p;              // slices scale out (staggered)
    },
    steps: [
      treMiddleStep,           // flip wave + ring spin (parallel)
    ],
  });

  // ── Programmable Infrastructure — node network (.pn-product-scroll.infra) ───
  // reveal (nodes scale in staggered, struts grow alongside) → middle (the whole
  // network rotates) → exit (struts retract, nodes scale out). Drives
  // grid1.infraState; the canvas renders it.
  const infraState = grid1.infraState;

  const infRotateStep = (state, tl, holdDur, flipDur) =>
    tl.to(state, { rot: 1, duration: flipDur, ease: 'power1.inOut', delay: holdDur });

  buildProductSequence({
    trigger: '.pn-product-scroll.infra',
    state:   infraState,
    revealStartVh: 0.0,
    revealEndVh:   0.30,
    exitStartVh:   0.30,
    exitEndVh:     0.0,
    holdVh:        0.10,
    revealEase: 'power2.out',
    exitEase:   'power2.in',
    onReveal: (s, p) => {
      s.reveal = p;
      s.strut  = Math.max(0, (p - 0.4) / 0.6);   // struts grow over the last 60% of reveal
      s.rot    = 0;
      s.exit   = 0;
    },
    onExit: (s, p) => {
      s.exit  = p;            // nodes scale out (staggered)
      s.strut = 1 - p;        // struts retract
    },
    steps: [
      infRotateStep,          // whole network rotates
    ],
  });

  // ── Product scroller — heading words + nav items ──────────────────────────

  const heading2 = document.querySelector('.pn-heading-2');
  const navItems = gsap.utils.toArray('.pn-nav-wrapper .pn-product-nav-text');
  const graphicDot = gsap.utils.toArray('.pn-graphics .pn-graphics-dot');

  if (heading2) {
    const split = SplitText.create(heading2, { type: 'words' });
    gsap.set(split.words, { opacity: 0, y: '10%' });
    gsap.set(navItems, { opacity: 0 });
    gsap.set(graphicDot, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.product-intro',
        start:   'top bottom',
        end:     'top 50%',
        scrub:   true,
      }
    });

    // First 50% of scroll: heading words stagger in
    tl.to(graphicDot, {
      opacity: 0,
      ease:    'none',
    }, 0)
    .to(split.words, {
      opacity: 1,
      y:       '0%',
      stagger: 0.1,
      ease:    'circ.out',
    }, "<")
    .to(navItems, {
      opacity: 1,
      stagger: 0.1,
      ease:    'none',
    }, '<+=50%');

    // ── Product outro — mirror of the intro, exiting on .pn-product-outro ──────
    // Same stagger + overlap as the intro, reversed: nav items fade out first,
    // then the heading words stagger out (opacity 1→0, words drop y 0%→10%).
    const tlOut = gsap.timeline({
      scrollTrigger: {
        trigger: '.pn-product-outro',
        start:   'top bottom',
        end:     'top 50%',
        scrub:   true,
      }
    });

    tlOut.to(navItems, {
      opacity: 0,
      stagger: 0.1,
      ease:    'none',
    }, 0)
    .to(split.words, {
      opacity: 0,
      y:       '-10%',
      stagger: 0.1,
      ease:    'circ.in',
    }, '<+=10%');

  }

  // ── Trust & operations — heading + subitems reveal ─────────────────────────
  // Scrubbed on .pn-trust-scroller (top bottom → bottom bottom). The heading
  // words stagger in, then each .tap-subitem's .subhead and .body-text follow.
  // Heading is scoped INSIDE .pn-trust-operations so it doesn't clash with the
  // product section's own .pn-heading-2.
  const trustHeading = document.querySelector('.pn-trust-operations .pn-heading-2');
  const tapSubitems  = gsap.utils.toArray('.pn-trust-operations .tap-items .tap-subitem');

  if (trustHeading) {
    const trustSplit = SplitText.create(trustHeading, { type: 'words' });
    gsap.set(trustSplit.words, { opacity: 0, y: '10%' });

    // collect each subitem's subhead + body
    const trustLines = [];
    tapSubitems.forEach((el) => {
      const sh = el.querySelector('.subhead');
      const bt = el.querySelector('.body-text');
      if (sh) trustLines.push(sh);
      if (bt) trustLines.push(bt);
    });
    gsap.set(trustLines, { opacity: 0, y: '10%' });

    const tlTrust = gsap.timeline({
      scrollTrigger: {
        trigger: '.pn-trust-scroller',
        start:   'top bottom',
        end:     'bottom bottom',
        scrub:   true,
      }
    });

    tlTrust.to(trustSplit.words, {
      opacity: 1,
      y:       '0%',
      stagger: 0.2,
      ease:    'circ.out',
    }, 0)
    .to(trustLines, {
      opacity: 1,
      y:       '0%',
      stagger: 0.1,
      ease:    'circ.out',
    }, '<+=50%');
  }

  // ── Product nav active-state sync ──────────────────────────────────────────
  // Each .pn-product-scroll maps by index to a .pn-product-nav-wrapper.
  // When a section is the one in view, its nav wrapper gets .active (others lose it).

  const productScrolls = gsap.utils.toArray('.pn-product-scroll');
  const navWrappers    = gsap.utils.toArray('.pn-product-nav');
  const productContents = gsap.utils.toArray('.product-content');
  const navDot         = document.querySelector('.pn-product-nav-dot');
  let   activeNavIndex = 0;
  let   dotIntroDone   = false;   // dot scales in on its first appearance

  // ── Nav click → scroll to the matching product section ─────────────────────
  // Clicking .pn-product-nav[i] scrolls so the top of .pn-product-scroll[i]
  // lands at 70% of the viewport height. Prefers Lenis (window.lenis) so the
  // smooth-scroll loop drives it and doesn't fight the tween; falls back to GSAP
  // ScrollToPlugin if Lenis isn't present.
  //   Lenis offset sign is opposite GSAP's: -70vh puts the section top 70% down.
  if (window.ScrollToPlugin) gsap.registerPlugin(window.ScrollToPlugin);

  const scrollToSection = (section) => {
    const offset = window.innerHeight * 0.6;

    // Dynamic duration: scale with how far we're jumping. Target scroll position
    // = section top minus the 60vh offset; distance from the current scroll maps
    // (as a fraction of a full viewport) into a clamped duration range so short
    // hops stay snappy and long jumps get a little more glide.
    const targetY   = section.getBoundingClientRect().top + window.scrollY - offset;
    const distance  = Math.abs(targetY - window.scrollY);
    const viewports = distance / window.innerHeight;      // jump length in screens
    const MIN_DUR = 1.5, MAX_DUR = 6, PER_VIEWPORT = 1;
    const duration = Math.max(MIN_DUR, Math.min(MAX_DUR, MIN_DUR + viewports * PER_VIEWPORT));

    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(section, {
        offset: -offset,            // negative = stop point sits lower (60% down)
        duration,
        easing: (t) => 1 - Math.pow(1 - t, 4),   // quart ease-out (≈ expo.out)
      });
    } else {
      gsap.to(window, {
        duration,
        ease: 'expo.out',
        scrollTo: { y: section, offsetY: offset },
      });
    }
  };

  navWrappers.forEach((nav, i) => {
    const section = productScrolls[i];
    if (!nav || !section) return;
    nav.style.cursor = 'pointer';
    nav.addEventListener('click', () => scrollToSection(section));
  });

  // All product content starts hidden (they render visible in the DOM on load).
  gsap.set(productContents, { y: '0.6rem', opacity: 0 });

  // Dot starts hidden (scaled out) — it scales in the first time a nav activates.
  if (navDot) gsap.set(navDot, { scale: 0 });

  // Move the green dot to sit centred under the active nav item.
  // Items have variable widths, so we measure live positions each time.
  function moveDotTo(index, animateScale = false) {
    if (!navDot || !navWrappers[index]) return;
    const item   = navWrappers[index];
    const itemCenter = item.offsetLeft + item.offsetWidth / 2;   // centre relative to wrapper
    const x = itemCenter - navDot.offsetWidth / 2;               // align dot's own centre

    if (animateScale && !dotIntroDone) {
      // First appearance — snap to position, then scale 0 → 1 (seamless intro)
      dotIntroDone = true;
      gsap.set(navDot, { x });
      gsap.to(navDot, { scale: 1, duration: 0.45, ease: 'back.out(2)' });
    } else {
      gsap.to(navDot, { x, duration: 0.8, ease: 'expo.out' });
    }
  }

  // Clear nav active classes everywhere (used on enter before re-activating one).
  function clearAllActive() {
    navWrappers.forEach(n => n.classList.remove('active'));
  }

  // Activate a section's nav + move the dot. Plain function (no timeline
  // callbacks) so it fires identically on enter and enterBack — reliable reverse.
  function activateSection(index) {
    clearAllActive();
    activeNavIndex = index;
    if (navWrappers[index]) navWrappers[index].classList.add('active');
    moveDotTo(index, true);
  }

  const lastIndex = productScrolls.length - 1;

  productScrolls.forEach((section, i) => {
    ScrollTrigger.create({
      trigger: section,
      start:   '0% bottom',
      end:     '100% bottom',
      onEnter:     () => activateSection(i),
      onEnterBack: () => activateSection(i),
      onLeave: () => {
        // Scrolled down past this section's end. For the LAST item, mirror the
        // first item's intro: deactivate its nav and scale the dot away.
        if (i === lastIndex) {
          if (navWrappers[i]) navWrappers[i].classList.remove('active');
          if (navDot) {
            dotIntroDone = false;
            gsap.to(navDot, { scale: 0, duration: 0.8, ease: 'expo.out' });
          }
        }
      },
      onLeaveBack: () => {
        // Scrolled back up above this section — remove its active class.
        if (navWrappers[i]) navWrappers[i].classList.remove('active');
        // First item leaving back → scale the dot away and allow re-intro.
        if (i === 0 && navDot) {
          dotIntroDone = false;
          gsap.to(navDot, { scale: 0, duration: 0.8, ease: 'expo.out' });
        }
      },
     
    });
  });

  // ── Product content reveal + exit — two scrubbed triggers per section ──────
  // ENTER: y 0.6rem / opacity 0 → y 0 / opacity 1
  //        starts when 10% of the section has passed the viewport bottom,
  //        ends at 30%.
  // EXIT:  y 0 / opacity 1 → y -0.6rem / opacity 0
  //        starts at 80% of the section past bottom, ends at 100%.
  // "X% past bottom" = the point X% down the section's own height crossing
  // the viewport bottom → ScrollTrigger 'top bottom-=X%'.

  productScrolls.forEach((section, i) => {
    const content = productContents[i];
    if (!content) return;

    // Enter — fromTo owns the initial hidden state (immediateRender on load)
    gsap.fromTo(content,
      { y: '0.6rem', opacity: 0, zIndex: -1},
      {
        y: '0rem', opacity: 1, zIndex: 9, ease: 'circ.out',
        immediateRender: true,   // apply the `from` state on load
        scrollTrigger: {
          trigger: section,
          start: () => `top+=${window.innerHeight * 0.20} bottom`,
          end:   () => `top+=${window.innerHeight * 0.40} bottom`,
          scrub: true
        },
      }
    );

    // Exit — plain .to from the live state; immediateRender off so it doesn't
    // stamp a visible state on load and override the enter's hidden start.
    gsap.to(content,
      {
        y: '-0.6rem', opacity: 0, zIndex: -1, ease: 'circ.in', 
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: () => `bottom-=${window.innerHeight * 0.30} bottom`,
          end: () => `bottom-=${window.innerHeight * 0.10} bottom`,
          scrub: true
        },
      }
    );
  });

  // Item widths change on resize — reposition the dot under the active item.
  window.addEventListener('resize', () => moveDotTo(activeNavIndex));

  // ── Trust & operations — isometric cube field reveal ──────────────────────
  // Scrubbed on .pn-trust-graphic-scroll: top hits viewport bottom → bottom hits
  // viewport bottom. Drives grid1.trustState.reveal 0→1; cubes scale up staggered
  // from the centre outward (the canvas renders it).
  if (document.querySelector('.pn-trust-graphic-scroll')) {
    ScrollTrigger.create({
      trigger: '.pn-trust-graphic-scroll',
      start:   'top bottom',
      end:     'bottom bottom',
      scrub:   true,
      onUpdate: (self) => { grid1.trustState.reveal = self.progress; },
    });
  }

  // ── Footer content block — y 10% → -10% on .footer scroll (scrub) ──────────
  if (document.querySelector('.footer') && document.querySelector('.footer-content-block')) {
    gsap.fromTo('.footer-content-block',
      { y: '10%' },
      {
        y: '-10%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.footer',
          start:   'top bottom',
          end:     'bottom bottom',
          scrub:   true,
        },
      }
    );
  }

  // ── Footer — move .pn-canvas-block down 10% on .footer scroll (scrub) ──────
  if (document.querySelector('.footer') && document.querySelector('.pn-canvas-block')) {
    gsap.fromTo('.pn-canvas-block',
      { y: '0%' },
      {
        y: '10%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.footer',
          start:   'top bottom',
          end:     'bottom bottom',
          scrub:   true,
        },
      }
    );
  }

  // ── Scroll progress tracker ───────────────────────────────────────────────

  gsap.set('.scroll-progress-thumb', { scaleX: 0 });

  ScrollTrigger.create({
    trigger:  document.body,
    start:    'top top',
    end:      'bottom bottom',
    onUpdate: (self) => {
      const p = self.progress;
      gsap.set('.scroll-progress-thumb', { scaleX: p });
      document.querySelector('.scroll-percentage').textContent = Math.round(p * 100) + '%';
    },
  });

  /*
  // ── Nav hide on scroll-down, show on scroll-up ─────────────────────────────
  
  const pnNav = document.querySelector('.pn-nav');
  const pn2Heading = document.querySelector('.pn-product-heading');

  if (pnNav) {
    ScrollTrigger.create({
      start: 0,
      end:   'max',
      onUpdate: (self) => {
        // direction: 1 = scrolling down, -1 = scrolling up
        if (self.direction === 1) pnNav.classList.add('hide');
        else                      pnNav.classList.remove('hide');
        if (self.direction === 1) pn2Heading.classList.remove('down');
        else                      pn2Heading.classList.add('down');
      },
    });
  }

  */
});
