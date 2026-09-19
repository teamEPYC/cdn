/* twf-anim.js — motion for The Working Files (listing + article) only.
 * Paste into PAGE settings > Before </body> on those two pages. Site-wide is NOT needed
 * and would widen blast radius. Add as a NEW block; do not reorder existing blocks.
 *
 * Depends on gsap + ScrollTrigger, which this site already loads on every page.
 * Pulls SplitText from Webflow's own CDN on demand (the file PitchCraft loads, 7.7KB).
 * Degrades to "everything visible, no motion" if anything is missing.
 *
 * STRUCTURE — one SCENE per section: a single ScrollTrigger driving a single timeline,
 * with each step placed at an explicit `at` position. This is how the reference pages
 * are built (PitchCraft's Latest Episodes is one timeline with steps at 0, .1 and .25),
 * and it is what lets a card and the things inside it move in a considered sequence.
 * Independent triggers per element cannot express that — each just fires when it
 * happens to cross the line.
 *
 * Every selector resolves INSIDE its scene's host, so generic names like .twf_eyebrow
 * only ever match the ones in that section. No ids. Nothing outside our page wrapper.
 *
 * All of this lives in this file: changing what animates or how needs no Webflow edit
 * and no re-publish.
 */
(function () {
  'use strict';

  // Run SYNCHRONOUSLY — this block sits at the end of <body>, so start states land
  // before first paint. Deferring to DOMContentLoaded caused a visible flash: the page
  // painted the final state, then snapped back. The listener below is only a fallback
  // in case this block is ever moved above the content it targets.
  if (!init() && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }

  function init() {
    var root = document.querySelector('.page-wrapper.is-twf-page, .page-wrapper.is-twfa-page');
    if (!root) return false;
    if (root.dataset.twfAnimReady) return true;
    root.dataset.twfAnimReady = '1';

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ok = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    // Start states live in JS, never CSS, so bailing here leaves the page fully visible.
    if (!ok || reduced) return true;

    var g = window.gsap;
    var ST = window.ScrollTrigger;
    g.registerPlugin(ST);

    // How far in before a section fires. Lower % = later. 85% finished the motion while
    // the section was still entering from the bottom.
    var START = 'top 75%';

    // Overall pace. 1 = the values written in SCENES below. Raise to slow everything
    // down proportionally: duration, position and stagger all scale together, so the
    // relationships between steps are preserved. This is the dial to reach for first.
    var SPEED = 1.15;

    // Spread — stagger only, on top of SPEED. Separated from SPEED deliberately: how
    // long each element takes and how far apart they start are different decisions.
    // Raise this to make a group cascade rather than arrive together; it does not make
    // any individual movement slower.
    var SPREAD = 1.40;
    var SPLIT_URL = 'https://cdn.prod.website-files.com/gsap/3.15.0/SplitText.min.js';

    var RISE   = { yPercent: 40, opacity: 0 };
    var NUDGE  = { y: 24, opacity: 0 };
    var ZOOM   = { scale: 1.05, opacity: 0 };
    // Scale the INNER image, never the media box. The box is the thing sized to
    // the 1296 column and it is what the side rules line up against; scaling it
    // pushed it ~15px past the column edge mid-entrance, unclipped by any
    // ancestor. The box already has overflow:hidden, so zooming the image inside
    // it gives the identical effect with nothing escaping the column.
    var ZOOMI  = { scale: 1.05 };
    var FADE   = { opacity: 0 };

    var SCENES = [
      /* ============ listing page ============ */
      { host: '.twf_hero-grid', onLoad: true, steps: [
        // The outline rides the heading, pinned to y:0 rather than its designed
        // -7.5px, so its 0.61px stroke sits on the glyph edge and cannot be seen...
        { sel: '.twf_hero-title, .twf_hero-title-ghost', at: 0, dur: 0.7, from: RISE, ease: 'power3.out', pinY: true },
        // ...then it separates by exactly the offset the CSS gives it, read at runtime
        // so the value is never duplicated here.
        { sel: '.twf_hero-title-ghost', at: 0.62, dur: 1.2, separate: true, ease: 'sine.out' },
        { sel: '.twf_hero-lede',    at: 0.20, dur: 0.9, split: true, ease: 'power3.out', lineSpread: 0.35 },
        { sel: '.twf_hero-kicker',  at: 0.40, dur: 0.8, split: true, ease: 'power3.out', lineSpread: 0.25 },
        // The whole button travels, then its label slides up inside its own mask -
        // the two-layer move Decoding Manufacturing uses (block at .7, mask at .9).
        { sel: '.twf_cta',          at: 0.58, dur: 1.0, from: { yPercent: 100, opacity: 0 }, ease: 'power3.out' },
        { sel: '.twf_cta',          at: 0.74, dur: 0.8, split: true, also: true, ease: 'power3.out', lineSpread: 0.15 }
      ]},
      { host: '.twf_strip', steps: [
        { sel: '.twf_strip-img',    at: 0,    dur: 0.9, from: ZOOM,  ease: 'power2.out' }
      ]},
      { host: '.twf_featured-grid', steps: [
        { sel: '.twf_featured-media', at: 0,    dur: 0.9, from: FADE,  ease: 'power2.out' },
        { sel: '.twf_featured-img',   at: 0,    dur: 0.9, from: ZOOMI, ease: 'power2.out' },
        { sel: '.twf_eyebrow',        at: 0.12, dur: 0.5, from: FADE,  ease: 'power2.out', stagger: 0.16 },
        { sel: '.twf_featured-title', at: 0.18, dur: 0.7, from: RISE,  ease: 'power3.out' },
        { sel: '.twf_featured-para',  at: 0.30, dur: 0.8, split: true, ease: 'power3.out', lineSpread: 0.45 },
        { sel: '.twf_cta',            at: 0.52, dur: 1.0, from: { yPercent: 100, opacity: 0 }, ease: 'power3.out' },
        { sel: '.twf_cta',            at: 0.68, dur: 0.8, split: true, also: true, ease: 'power3.out', lineSpread: 0.15 }
      ]},
      { host: '.twf_cards', steps: [
        { sel: '.twf_card',        at: 0,    dur: 0.6, from: NUDGE, ease: 'power2.out', stagger: 0.2 },
        { sel: '.twf_card-media',  at: 0.10, dur: 0.7, from: FADE,  ease: 'power2.out', stagger: 0.2 },
        { sel: '.twf_card-img',    at: 0.10, dur: 0.7, from: ZOOMI, ease: 'power2.out', stagger: 0.2 },
        { sel: '.twf_eyebrow',     at: 0.22, dur: 0.5, from: FADE,  ease: 'power2.out', stagger: 0.16 },
        { sel: '.twf_card-title',  at: 0.26, dur: 0.6, from: RISE,  ease: 'power3.out', stagger: 0.16 },
        { sel: '.twf_card-desc',   at: 0.34, dur: 0.6, from: NUDGE, ease: 'power3.out', stagger: 0.16 }
      ]},
      { host: '.twf_stats', steps: [
        { sel: '.twf_library-title', at: 0,    dur: 0.7, from: RISE,  ease: 'power3.out' },
        { sel: '.twf_stat',          at: 0.20, dur: 0.6, from: NUDGE, ease: 'power2.out', stagger: 0.2 },
        // Counts up to whatever the copy already says. The number is never written
        // here - it is parsed from the element, so editing "20+" in Webflow just works.
        { sel: '.twf_stat-num',      at: 0.30, dur: 1.4, count: true, ease: 'power2.out' },
        { sel: '.twf_stats-big',     at: 0.28, dur: 0.8, from: RISE,  ease: 'power3.out' },
        { sel: '.twf_stats-big-label', at: 0.42, dur: 0.6, from: FADE, ease: 'power2.out' }
      ]},
      { host: '.twf_about', steps: [
        { sel: '.twf_eyebrow',     at: 0,    dur: 0.5, from: FADE,  ease: 'power2.out' },
        { sel: '.twf_about-body',  at: 0.10, dur: 0.8, split: true, ease: 'power3.out', lineSpread: 0.50 },
        // Right column waits for the left. '>' rather than a number, because the left
        // copy is split text: its length depends on how many lines it wraps to and on
        // SPREAD, so no fixed position would stay correct.
        { sel: '.twf_about-intro', at: '>-=0.85', dur: 0.55, from: RISE,  ease: 'power3.out' },
        { sel: '.twf_about-item',  at: '>-=1.00', dur: 0.5, from: NUDGE, ease: 'power2.out', stagger: 0.10 }
      ]},
      { host: '.twf_framework', steps: [
        { sel: '.twf_library-head .twf_eyebrow', at: 0, dur: 0.5, from: FADE, ease: 'power2.out' },
        { sel: '.twf_library-title',    at: 0.08, dur: 0.7, from: RISE,  ease: 'power3.out' },
        { sel: '.twf_framework-col',    at: 0.24, dur: 0.6, from: NUDGE, ease: 'power2.out', stagger: 0.30 },
        { sel: '.twf_framework-col .twf_eyebrow', at: 0.32, dur: 0.5, from: FADE, ease: 'power2.out', stagger: 0.30 },
        { sel: '.twf_framework-body',   at: 0.38, dur: 0.8, split: true, ease: 'power3.out', lineSpread: 0.35, each: 0.30 }
      ]},
      { host: '.twf_faq', steps: [
        { sel: '.twf_library-head .twf_eyebrow', at: 0,  dur: 0.5, from: FADE, ease: 'power2.out' },
        { sel: '.twf_library-title', at: 0.08, dur: 0.7, from: RISE,  ease: 'power3.out' },
        // perItem: this list is taller than the viewport, so one trigger for the whole
        // group finishes the lower rows before they are ever on screen. Each row gets
        // its own trigger and reveals as you reach it.
        { sel: '.twf_faq-item',      at: 0.24, dur: 0.6, from: NUDGE, ease: 'power2.out', perItem: true }
      ]},

      // Runs after the section scenes above, so they claim their own heads first and
      // this picks up whichever head is left over (the library one).
      { host: '.twf_library-head', steps: [
        { sel: '.twf_eyebrow',        at: 0,    dur: 0.5, from: FADE,  ease: 'power2.out' },
        { sel: '.twf_library-title',  at: 0.08, dur: 0.7, from: RISE,  ease: 'power3.out' }
      ]},

      /* ============ article page ============ */
      // NOTE: this page reuses the listing page's shared classes (.twf_eyebrow,
      // .twf_library-title, .twf_framework-body, .twf_cta) alongside its own twfa_
      // ones. Steps below name both, or that copy never moves.
      { host: '.twfa_hero-grid', onLoad: true, steps: [
        { sel: '.twf_eyebrow',      at: 0,    dur: 0.5, from: FADE,  ease: 'power2.out' },
        { sel: '.twfa_hero-title',  at: 0.06, dur: 0.8, from: RISE,  ease: 'power3.out' },
        { sel: '.twfa_hero-media',  at: 0.12, dur: 0.9, from: FADE,  ease: 'power2.out' },
        { sel: '.twfa_hero-img',    at: 0.12, dur: 0.9, from: ZOOMI, ease: 'power2.out' },
        { sel: '.twfa_hero-body',   at: 0.22, dur: 0.7, from: RISE,  ease: 'power3.out' },
        { sel: '.twfa_hero-byline', at: 0.34, dur: 0.6, from: FADE,  ease: 'power2.out' },
        { sel: '.twfa_hero-bar',    at: 0.46, dur: 0.6, from: NUDGE, ease: 'power2.out' }
      ]},
      { host: '.twfa_two-col', steps: [
        { sel: '.twf_eyebrow',     at: 0,    dur: 0.5, from: FADE,  ease: 'power2.out' },
        { sel: '.twf_library-title', at: 0.12, dur: 0.7, from: RISE, ease: 'power3.out' },
        { sel: '.twf_framework-body', at: 0.22, dur: 0.8, split: true, ease: 'power3.out', lineSpread: 0.45 },
        { sel: '.twfa_cta-label',  at: 0.18, dur: 0.5, from: FADE,  ease: 'power2.out' },
        { sel: '.twfa_list-title', at: 0.22, dur: 0.6, from: NUDGE, ease: 'power2.out', stagger: 0.24 },
        { sel: '.twfa_list-item',  at: 0.30, dur: 0.6, from: NUDGE, ease: 'power2.out', stagger: 0.12 }
      ]},
      { host: '.twfa_split', steps: [
        { sel: '.twfa_num-item',    at: 0,    dur: 0.6, from: NUDGE, ease: 'power2.out', stagger: 0.24 },
        { sel: '.twfa_stat-num',    at: 0.28, dur: 1.4, count: true, ease: 'power2.out' },
        { sel: '.twfa_stat-label',  at: 0.42, dur: 0.6, from: FADE,  ease: 'power2.out' },
        { sel: '.twfa_quote-media', at: 0.08, dur: 0.9, from: FADE,  ease: 'power2.out' },
        { sel: '.twfa_quote-img',   at: 0.08, dur: 0.9, from: ZOOMI, ease: 'power2.out' },
        { sel: '.twfa_quote-text',  at: 0,    dur: 0.8, split: true, ease: 'power3.out', lineSpread: 0.45 },
        { sel: '.twfa_quote-name',  at: 0.34, dur: 0.6, from: FADE,  ease: 'power2.out' },
        { sel: '.twfa_cta-label',   at: 0.44, dur: 0.5, from: FADE,  ease: 'power2.out' }
      ]},
      { host: '.twfa_built-grid', steps: [
        { sel: '.twf_eyebrow',      at: 0,    dur: 0.5, from: FADE,  ease: 'power2.out' },
        { sel: '.twfa_built-title', at: 0.06, dur: 0.7, from: RISE,  ease: 'power3.out' },
        { sel: '.twf_framework-body', at: 0.18, dur: 0.8, split: true, ease: 'power3.out', lineSpread: 0.45 },
        { sel: '.twfa_stage',       at: 0.22, dur: 0.6, from: NUDGE, ease: 'power2.out', stagger: 0.24 },
        { sel: '.twfa_cta-label',   at: 0.46, dur: 0.5, from: FADE,  ease: 'power2.out' }
      ]},
      { host: '.twfa_fw-pair', steps: [
        { sel: '.twf_eyebrow',        at: 0,    dur: 0.5, from: FADE,  ease: 'power2.out' },
        { sel: '.twf_library-title',  at: 0.12, dur: 0.7, from: RISE,  ease: 'power3.out' },
        { sel: '.twfa_th',            at: 0.14, dur: 0.5, from: FADE,  ease: 'power2.out', stagger: 0.16 },
        { sel: '.twfa_trows .twfa_trow', at: 0.20, dur: 0.6, from: NUDGE, ease: 'power2.out', perItem: true },
        { sel: '.twfa_fw-note',       at: 0.52, dur: 0.5, from: FADE,  ease: 'power2.out' }
      ]},
      { host: '.twfa_dl-grid', steps: [
        { sel: '.twf_eyebrow',     at: 0,    dur: 0.5, from: FADE,  ease: 'power2.out' },
        { sel: '.twfa_dl-title',   at: 0.06, dur: 0.7, from: RISE,  ease: 'power3.out' },
        { sel: '.twf_cta',         at: 0.20, dur: 1.0, from: { yPercent: 100, opacity: 0 }, ease: 'power3.out' },
        { sel: '.twfa_dl-media',   at: 0.10, dur: 0.9, from: FADE,  ease: 'power2.out' },
        { sel: '.twfa_dl-img',     at: 0.10, dur: 0.9, from: ZOOMI, ease: 'power2.out' },
        { sel: '.twfa_cta-label',  at: 0.28, dur: 0.5, from: FADE,  ease: 'power2.out' }
      ]},
      { host: '.twfa_rel-pair', steps: [
        { sel: '.twf_eyebrow',     at: 0,    dur: 0.5, from: FADE,  ease: 'power2.out' },
        { sel: '.twfa_fw-head',    at: 0.06, dur: 0.7, from: RISE,  ease: 'power3.out' },
        { sel: '.twf_library-title', at: 0.12, dur: 0.7, from: RISE, ease: 'power3.out' },
        { sel: '.twfa_rel-card',   at: 0.24, dur: 0.7, from: NUDGE, ease: 'power2.out', stagger: 0.28 }
      ]}
    ];

    // Resolve hosts and steps once, and record every element so nothing is animated
    // twice and everything can be revealed again if setup fails.
    var work = [];
    var touched = [];
    SCENES.forEach(function (sc) {
      Array.prototype.forEach.call(root.querySelectorAll(sc.host), function (host) {
        var steps = [];
        sc.steps.forEach(function (st) {
          var els;
          try { els = Array.prototype.slice.call(host.querySelectorAll(st.sel)); }
          catch (e) { return; }                    // a bad selector must not kill the rest
          // `also` lets a step deliberately re-target an element an earlier step in the
          // same scene already claimed - the CTA moves as a block AND its label slides
          // inside it, which is two steps on one element.
          if (!st.separate && !st.also) {
            els = els.filter(function (el) { return touched.indexOf(el) === -1; });
          }
          if (!els.length) return;
          els.forEach(function (el) {
            if (touched.indexOf(el) === -1) touched.push(el);
            // Read the CSS translateY now, before any start state overwrites it.
            if (st.separate && el.__twfDy === undefined) {
              var t = window.getComputedStyle(el).transform, dy = 0;
              if (t && t !== 'none') { try { dy = new DOMMatrixReadOnly(t).f; } catch (e) { dy = 0; } }
              el.__twfDy = dy;
            }
          });
          steps.push({ cfg: st, els: els });
        });
        if (steps.length) work.push({ scene: sc, host: host, steps: steps });
      });
    });
    if (!work.length) return true;

    // PHASE 1, synchronous: hide before first paint. Split targets hide at the element
    // level; their lines are created later, once the plugin lands.
    try {
      work.forEach(function (w) {
        w.steps.forEach(function (s) {
          if (s.cfg.count) {
            s.els.forEach(function (el) {
              var m = parseCount(el);
              if (!m) return;
              el.__twfText = el.textContent;
              el.textContent = m.pre + '0' + m.post;
            });
            return;
          }
          if (s.cfg.separate) return;                       // handled by its pair step
          // A split step normally owns its element's opacity. But an `also` split shares
          // the element with a block step that already fades it - if this branch touched
          // opacity too, it would overwrite that fade and the element would just appear.
          if (s.cfg.split) { if (!s.cfg.also) g.set(s.els, { opacity: 0 }); return; }
          g.set(s.els, s.cfg.from);
          if (s.cfg.pinY) g.set(s.els, { y: 0 });
        });
      });
    } catch (e) { revealAll(); return true; }

    // PHASE 2: build the timelines. Deferred only so SplitText can arrive; the start
    // states above are already applied, so nothing flashes while we wait.
    var settled = false;
    var timer = setTimeout(function () { build(false); }, 3000);
    if (typeof window.SplitText !== 'undefined') {
      clearTimeout(timer); build(true);
    } else {
      var sc = document.createElement('script');
      sc.async = true;
      sc.src = SPLIT_URL;
      sc.onload  = function () { clearTimeout(timer); build(typeof window.SplitText !== 'undefined'); };
      sc.onerror = function () { clearTimeout(timer); build(false); };
      document.head.appendChild(sc);
    }
    return true;

    function build(hasSplit) {
      if (settled) return;
      settled = true;
      try {
        if (hasSplit) { try { g.registerPlugin(window.SplitText); } catch (e) {} }
        work.forEach(function (w) {
          var tl = g.timeline(
            w.scene.onLoad ? { delay: 0.15 }
                           : { scrollTrigger: { trigger: w.host, start: START, once: true } });

          w.steps.forEach(function (s) {
            var st = s.cfg, els = s.els;

            if (st.count) {
              els.forEach(function (el) {
                var m = parseCount(el, el.__twfText);
                if (!m) return;
                var box = { v: 0 };
                tl.to(box, {
                  v: m.value, duration: st.dur * SPEED, ease: st.ease,
                  onUpdate: function () {
                    el.textContent = m.pre + format(Math.round(box.v), m.grouped) + m.post;
                  },
                  // Restore the authored string exactly, so any punctuation or spacing
                  // the copy carries survives the animation.
                  onComplete: function () { el.textContent = el.__twfText; }
                }, pos(st));
              });
              return;
            }

            if (st.perItem) {
              els.forEach(function (el) {
                var end = restOf(st.from);
                end.duration = st.dur * SPEED;
                end.ease = st.ease;
                end.onComplete = clearOf([el]);
                end.scrollTrigger = { trigger: el, start: START, once: true };
                g.fromTo(el, st.from, end);
              });
              return;
            }

            if (st.separate) {
              els.forEach(function (el) {
                if (!el.__twfDy) return;
                tl.to(el, {
                  y: el.__twfDy, duration: st.dur * SPEED, ease: st.ease,
                  onComplete: function () { g.set(el, { clearProps: 'transform' }); }
                }, pos(st));
              });
              return;
            }

            if (st.split) {
              if (hasSplit) {
                // `stagger` spaces the LINES inside one element. `each` spaces the ELEMENTS
                // from one another - without it every column's copy began at the same instant
                // and the column stagger read as nothing at all.
                var each = (st.each !== undefined ? st.each : 0.24);
                els.forEach(function (el, i) {
                  // The CTA arrow is a flex SIBLING of the label, and the button's
                  // column-gap is the only thing separating them. SplitText re-parents
                  // every child into one line wrapper, so the pair becomes a single flex
                  // item: the gap then has nothing to sit between and renders as 0, and
                  // the arrow additionally inherits the line mask's overflow:clip.
                  // Lift any trailing icon out, split the copy, put it back as a direct
                  // child - two flex items again, so the authored gap applies as designed.
                  var lifted = [];
                  while (el.lastElementChild &&
                         /^(img|svg)$/i.test(el.lastElementChild.tagName)) {
                    lifted.unshift(el.removeChild(el.lastElementChild));
                  }
                  var sp = new window.SplitText(el, {
                    type: 'lines', mask: 'lines', linesClass: 'twf_split-line'
                  });
                  lifted.forEach(function (n) { el.appendChild(n); });
                  if (!st.also) g.set(el, { opacity: 1 });   // block step owns opacity when `also`
                  tl.fromTo(sp.lines,
                    { yPercent: 100 },
                    { yPercent: 0, duration: st.dur * SPEED, ease: st.ease,
                      // Per-line stagger made long copy crawl - the cost grew with the line
                      // count. {amount} spreads a FIXED total across however many lines exist, so a
                      // long paragraph and a short one take the same time. SPREAD is deliberately
                      // not applied: it spaces ELEMENTS apart, not lines within one paragraph.
                      stagger: { amount: (st.lineSpread || 0.4) * SPEED } },
                    pos(st, i * each * SPEED * SPREAD));
                });
              } else {
                // no plugin: the copy still arrives, just as a block
                tl.fromTo(els,
                  { yPercent: 20, opacity: 0 },
                  { yPercent: 0, opacity: 1, duration: st.dur * SPEED, ease: st.ease,
                    onComplete: clearOf(els) }, pos(st));
              }
              return;
            }

            var to = restOf(st.from);
            to.duration = st.dur * SPEED;
            to.ease = st.ease;
            to.stagger = st.stagger ? st.stagger * SPEED * SPREAD : undefined;
            // A leftover transform, even an identity one, creates a containing block
            // and silently breaks position:sticky descendants. The article page has one.
            // Never clear an element that a later `separate` step still has to move:
            // clearProps would drop it straight onto its CSS offset, and the separation
            // would then be an instant snap instead of a movement.
            to.onComplete = clearOf(els.filter(function (el) { return el.__twfDy === undefined; }));
            if (st.pinY) to.y = 0;
            tl.fromTo(els, st.pinY ? Object.assign({}, st.from, { y: 0 }) : st.from, to, st.at);
          });
        });

        ST.refresh();
        window.addEventListener('load', function () { ST.refresh(); }, { once: true });
      } catch (e) {
        if (window.console && console.warn) console.warn('[twf-anim]', e);
        revealAll();
      }
    }

    // from() records an element's CURRENT value as the tween's destination. Phase 1
    // already set that value to the hidden state, so from() would animate 0 -> 0 and
    // nothing would ever appear. Every tween therefore states its end explicitly.
    // A step's position. A number is an absolute point on the scene timeline and
    // scales with SPEED. A string is passed to GSAP untouched, so '>' (after everything
    // so far) or '>-=0.3' (slight overlap) can express "follow whatever came before"
    // without anyone predicting how long that turned out to be.
    function pos(st, extra) {
      if (typeof st.at === 'string') return st.at;
      return st.at * SPEED + (extra || 0);
    }

    function restOf(from) {
      var to = {};
      if ('opacity'  in from) to.opacity  = 1;
      if ('y'        in from) to.y        = 0;
      if ('yPercent' in from) to.yPercent = 0;
      if ('scale'    in from) to.scale    = 1;
      return to;
    }

    // Pulls the first run of digits out of the element's own copy, keeping whatever
    // sits either side of it ("20+" -> 20 with a "+" suffix, "$1,200" -> 1200).
    function parseCount(el, override) {
      var txt = override !== undefined ? override : el.textContent;
      var m = String(txt).match(/^([^\d]*)(\d[\d,]*)([\s\S]*)$/);
      if (!m) return null;
      return {
        pre: m[1], post: m[3],
        grouped: m[2].indexOf(',') !== -1,
        value: parseFloat(m[2].replace(/,/g, ''))
      };
    }

    function format(n, grouped) {
      return grouped ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : String(n);
    }

    function clearOf(els) {
      return function () { g.set(els, { clearProps: 'transform' }); };
    }

    function revealAll() {
      try {
        g.set(touched, { clearProps: 'all' });
        touched.forEach(function (el) {
          if (el.__twfText !== undefined) el.textContent = el.__twfText;
        });
      } catch (e) {}
    }
  }

  // ---- CTA hover -------------------------------------------------------
  // Webflow has no way to express `.twf_cta:hover .arrow` as a class, so the
  // hover lives here. It animates the ARROW only and never the <a>, so it can
  // never fight the entrance tween that already owns the button. Bound once,
  // scoped to our own wrapper, and it degrades to a plain transform if GSAP
  // is missing.
  (function ctaHover() {
    // Both pages must match: the listing wrapper is is-twf-page, the article
    // wrapper is is-twfa-page. Matching only the first silently skipped every
    // CTA on the article page - the module returned before binding anything.
    var root = document.querySelector('.page-wrapper.is-twf-page, .page-wrapper.is-twfa-page');
    if (!root) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ctaHover, { once: true });
      }
      return;
    }
    if (root.__twfHoverBound) return;
    root.__twfHoverBound = true;

    var g = window.gsap;
    Array.prototype.forEach.call(
      root.querySelectorAll('.twf_cta, .twfa_hero-bar-cta'),
      function (cta) {
        var arrow = cta.querySelector('img, svg');
        if (!arrow) return;
        // A download arrow points down; every other arrow on these pages
        // points up-right, so each one moves the way it is already aiming.
        var down = /download/i.test(cta.textContent || '');
        var dx = down ? 0 : 4;
        var dy = down ? 5 : -4;
        var move = function (x, y) {
          if (g) {
            g.to(arrow, { x: x, y: y, duration: 0.34, ease: 'power2.out',
                          overwrite: 'auto' });
          } else {
            arrow.style.transform = 'translate(' + x + 'px,' + y + 'px)';
          }
        };
        var on  = function () { move(dx, dy); };
        var off = function () { move(0, 0); };
        cta.addEventListener('mouseenter', on);
        cta.addEventListener('mouseleave', off);
        cta.addEventListener('focus', on);
        cta.addEventListener('blur', off);
      }
    );
  })();

})();

/* ==== BEGIN twf-anim addition — session B — do not remove ==== */
/* Mosaic strip — the coloured-squares band on the listing page (.twf_strip).
 *
 * Replaces the placeholder bg-section.avif with a canvas that draws the same
 * composition and animates it. Every constant here was MEASURED off that asset, not
 * chosen: grid pitch 41px at 1296 wide (edge autocorrelation, harmonics at 81 and 119),
 * 46% cell occupancy, a saturation-weighted centroid at 34.4%/45.6%, and the hue-family
 * weights below. Nothing is a guessed value dressed up as a design decision.
 *
 * Canvas rather than DOM, for three reasons: the `develop` reveal subdivides the grid
 * mid-animation, which in DOM means building and destroying ~200 nodes while animating;
 * the overlap character needs multiply blending; and this site already has a mobile
 * performance problem, so one node beats 114 blend-mode divs.
 *
 * Additive and self-contained. Own guard key, own scope, no CSS written anywhere, no
 * ids, none of the reserved names. The placeholder <img> stays in the DOM and is hidden
 * only once a frame has actually rendered, so any failure falls back to today's artwork.
 *
 * Switchable for review:  ?twf-mosaic=cluster|develop|sweep   ?twf-hover=paint|wash|flip|off
 */
(function () {
  'use strict';

  var REVEALS = { cluster: 1, develop: 1, sweep: 1 };
  var DEFAULT_REVEAL = 'cluster';

  // Re-roll the entire composition by changing this one number. Seeded deliberately:
  // the layout must be identical on every load and every resize, because a background
  // that reshuffles itself reads as a bug rather than as art.
  var SEED = 20260901;

  var GROUND  = '#ffffff';                 // the placeholder's own ground
  var FOCAL_X = 0.344, FOCAL_Y = 0.456;    // saturation-weighted centroid of the asset
  var OCCUPANCY = 0.46;                    // 114 of 248 cells filled

  // Hue families with their measured share of the artwork.
  var PALETTE = [
    { c: [248,  56,   0], w: 46 },   // red / orange — the brand mass
    { c: [248, 192, 208], w: 30 },   // pink
    { c: [216, 192, 248], w: 11 },   // violet
    { c: [168, 184, 240], w:  9 },   // blue
    { c: [248, 216, 184], w:  3 },   // peach
    { c: [207, 224, 212], w:  1 }    // sage — a trace, but it is in there
  ];

  var START = 'top 75%';                   // matches the scenes above, so it reads as one system
  var TAU = 6.283185307179586;

  // Hover recolours the artwork. Deliberately NOT a transform, a scale or an opacity
  // lift: the squares themselves change colour as the cursor crosses them, so what
  // moves through the grid is the palette rather than the geometry.
  //   paint - a square keeps each new colour, so sweeping repaints the composition
  //   wash  - it takes the new colour under the cursor and drifts back after
  //   makeway - the block under the cursor EXPANDS and every other block slides out of
  //           its way, falling off linearly and cutting off past a set reach. Ported
  //           from Codrops' MakeWayGridEffect. Unlike `push` this is a selection, not a
  //           field: one block is chosen and the grid reorganises around it, holding
  //           that arrangement until another is chosen.
  //   push  - nothing changes colour or pattern; the blocks simply MOVE. Each is shoved
  //           away from the cursor by magnet/distance^2 and pulled home by an under-
  //           damped spring, so they scatter and wobble back into place.
  //   flip  - the block under the cursor topples onto its next side, which carries a
  //           different colour and sometimes a different pattern. Blocks are resolved
  //           by grid lookup and each turns individually - the reach is a small ring
  //           of cells, not a soft falloff, so it stays a set of discrete topples.
  var HOVERS = { off: 1, paint: 1, wash: 1, flip: 1, push: 1, makeway: 1 };

  // MAKEWAY — proportions are in CELLS, not the source's pixels, so the effect holds
  // its shape at every breakpoint. The original's z-index juggling is not needed here:
  // multiply blending is commutative, so draw order cannot change the result.
  var MW_SCALE  = 2.2;   // how far the selected block grows
  var MW_SPREAD = 1.2;   // how far a block right beside it is shouldered aside, in cells
  var MW_REACH  = 7;     // past this many cells away, nothing moves at all
  var MW_EASE   = 0.12;  // approach rate toward the arrangement
  var MW_LIFT   = 1.35;  // alpha lift on the selected block, standing in for z-index

  // PUSH — inverse-square repulsion plus a damped spring home, ported from the
  // reference pen. Movement only: nothing recolours, nothing turns over.
  // Stated as intent rather than as a magic number. With this spring a block settles at
  // 2*(SPRING_X-1) times the per-frame shove, so the strength needed to move it a given
  // distance scales with the CUBE of the cell size. Deriving it keeps the feel identical
  // at every breakpoint instead of drifting as the grid gets finer.
  var PUSH_REACH = 0.9;  // how far a block ONE CELL from the cursor travels, in cells
  var MAG_MIN  = 14;     // distance floor - without it a block under the cursor is flung
  var MAG_CAP  = 1.4;    // furthest a block may travel, in cells
  var SPRING_X = 2.10;   // damping. The x/y asymmetry is deliberate and copied from the
  var SPRING_Y = 2.20;   // reference: equal values make the settle read as a straight line.
  var DEFAULT_HOVER = 'paint';

  var FLIP_CELLS = 1.6;  // topple radius in CELLS - the block touched, plus its ring
  var FACES = 4;         // a block has four sides to land on
  var FLIP_DUR = 0.34;   // seconds to fall onto the next side
  var FLIP_EDGE = 0.55;  // extra darkening as it passes edge-on, so the turn reads as 3D

  // Patterns a side can carry. Weighted to fills, so a toppled block still belongs to
  // the composition; dots and outlines are the occasional face, not the norm.
  var FACE_KINDS = [0, 0, 2, 0, 1, 0];

  // WHITE IS A COLOUR HERE. Under multiply a white square is invisible, which is exactly
  // what an empty cell in the artwork is - so treating white as one more stop in the
  // cycle is what lets a blank square gain colour and a coloured one go blank, in both
  // hover modes, without any special-casing at the point of drawing.
  var WHITE = [255, 255, 255];
  var CYCLE = [];   // filled at load: every palette colour, then white

  // Every block gets four sides, of which exactly TWO are blank. That ratio is the point:
  // a white square can be turned over to reveal colour and a coloured one can be turned
  // back to white, while the band's density stays near the measured 46% however much it
  // is played with. Side 0 is always how the square looks at rest.
  function makeSides(ci, k0, gx, gy, startBlank) {
    var out = [startBlank ? { blank: true } : { c: PALETTE[ci].c, k: k0 }];
    var order = startBlank ? [1, 1, 0] : [1, 0, 0];    // 1 = live, 0 = blank
    // A white block must reveal colour on its FIRST turn. If it could land on another
    // blank side it would read as unresponsive to whoever just touched it - so blanks
    // are not rotated, which fixes their next two sides as live.
    var rot = startBlank ? 0 : (gx + gy + ci) % 3;     // otherwise vary, so neighbours differ
    for (var i = 0; i < 3; i++) {
      if (order[(i + rot) % 3]) {
        out.push({ c: PALETTE[weightedPick(hash01(gx, gy, i + 1))].c,
                   k: FACE_KINDS[(ci + i + gx + gy) % FACE_KINDS.length] });
      } else {
        out.push({ blank: true });
      }
    }
    return out;
  }

  function isWhite(c) { return c[0] > 254.5 && c[1] > 254.5 && c[2] > 254.5; }

  // EVERY colour choice goes through these. Stepping around the palette, or picking a
  // slot uniformly, quietly flattens the artwork to equal parts of each hue - which is
  // how a source that is 46% red and 11% violet rendered as 14% red and 25% violet
  // after one sweep. Sampling the measured weights keeps the proportions whatever
  // anyone does to it.
  var WSUM = 0;
  function weightedPick(u) {
    var t = u * WSUM, acc = 0;
    for (var i = 0; i < PALETTE.length; i++) {
      acc += PALETTE[i].w;
      if (t <= acc) return i;
    }
    return 0;
  }

  // Same, over the cycle that includes white. White carries the share of the band that
  // is empty at rest, so density stays near the measured 46% however long it is played.
  var CYCLE_W = [];
  function cyclePick(u) {
    var acc = 0;
    for (var i = 0; i < CYCLE_W.length; i++) {
      acc += CYCLE_W[i];
      if (u <= acc) return i;
    }
    return CYCLE.length - 1;
  }

  // Deterministic 0..1 from three integers, so a block's sides are stable across
  // reloads and resizes without consuming the composition's random stream.
  function hash01(a, b, c) {
    var h = (Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(c, 1274126177)) >>> 0;
    h = (h ^ (h >>> 13)) >>> 0;
    h = Math.imul(h, 1274126177) >>> 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  // INTENSITY — how loud a change is. The artwork rests very pale (mean alpha 0.37,
  // much of it 0.10-0.30), so a changed square that keeps its resting alpha barely
  // reads. These four are the dials, strongest first.
  var CHANGE_GAIN = 1.9;   // a changed square becomes this much more present
  var BLANK_FLOOR = 0.30;  // a white square is only ever seen once changed - arrive solid
  var COL_EASE = 0.16;     // approach to the new colour: higher = more decisive

  // Recolour reach, as a fraction of the band's width. 0.15 read as too small and 0.24
  // as too big; area grows with the square of this, so the gap between them is larger
  // than it looks - 0.24 touches 2.6x the squares 0.15 does, not 1.6x.
  var HOV_R = 0.18;
  var HOV_EXIT = 1.44;  // must leave 1.2x the radius before it can be re-tinted (squared)

  if (!boot() && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  }

  function boot() {
    var root = document.querySelector('.page-wrapper.is-twf-page');
    if (!root) return false;
    var strip = root.querySelector('.twf_strip');
    if (!strip) return false;
    if (strip.dataset.twfMosaic) return true;

    var g = window.gsap, ST = window.ScrollTrigger;
    if (!g || !ST || !g.ticker) return true;

    var cv, ctx2d;
    try {
      cv = document.createElement('canvas');
      ctx2d = cv.getContext && cv.getContext('2d');
    } catch (e) { ctx2d = null; }
    if (!ctx2d) return true;                 // no canvas: leave the placeholder alone

    strip.dataset.twfMosaic = '1';

    if (!CYCLE.length) {
      for (var pi = 0; pi < PALETTE.length; pi++) WSUM += PALETTE[pi].w;
      for (pi = 0; pi < PALETTE.length; pi++) {
        CYCLE.push(PALETTE[pi].c);
        CYCLE_W.push(PALETTE[pi].w / WSUM * OCCUPANCY);
      }
      CYCLE.push(WHITE);
      CYCLE_W.push(1 - OCCUPANCY);
    }

    var img = strip.querySelector('.twf_strip-img');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Hover is a pointer affordance, not a touch one. On touch the ambient drift is the
    // whole behaviour, which is why it exists rather than being decoration.
    var canHover = !reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var mode = DEFAULT_REVEAL, hover = DEFAULT_HOVER;
    try {
      var s = String(window.location.search);
      var q = (s.match(/[?&]twf-mosaic=([a-z]+)/) || [])[1];
      if (q && REVEALS[q]) mode = q;         // whitelisted: anything else falls back
      var hq = (s.match(/[?&]twf-hover=([a-z]+)/) || [])[1];
      if (hq && HOVERS[hq]) hover = hq;
    } catch (e) {}
    if (!canHover) hover = 'off';

    cv.className = 'twf_mosaic';
    cv.setAttribute('aria-hidden', 'true');  // decorative; nothing here is content
    cv.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';

    var W = 0, H = 0, DPR = 1;
    var levels = [], tl = null, resizeTimer = null;
    var running = false, onScreen = false, built = false;
    var ptrX = 0, ptrY = 0, ptrIn = false;
    var lastNow = 0, lastHit = -1, lastPX = 0, lastPY = 0, mwIdx = -1;

    try {
      strip.appendChild(cv);
      build(false);            // may legitimately fail: see measure()
      watch();
      if (!built) retry(150);
    } catch (e) { return fail(e); }
    return true;

    /* ---------------- geometry ---------------- */

    // Columns are the constant and the cell size is derived, so the mosaic scales
    // instead of transcribing 41px. Breakpoints follow the stylesheet's own.
    function colsFor() {
      var v = window.innerWidth;
      return v > 991 ? 32 : (v > 767 ? 22 : 14);
    }

    // Returns false when the strip has no layout yet. At real page load this block runs
    // before the ratio box has been sized, and an unguarded measure bakes a 1x1 canvas
    // in permanently - the band then stays blank forever. Observed, not theoretical.
    function measure() {
      var r = strip.getBoundingClientRect();
      var w = Math.round(r.width), h = Math.round(r.height);
      if (w < 2 || h < 2) return false;
      W = w; H = h;
      DPR = Math.min(window.devicePixelRatio || 1, 2);   // capped: 3x buys nothing here
      cv.width  = Math.round(W * DPR);
      cv.height = Math.round(H * DPR);
      return true;
    }

    // `preserve` keeps a finished reveal finished, so a resize re-lays-out the mosaic
    // without replaying the animation in the reader's face.
    function build(preserve) {
      if (!measure()) return false;
      compose();
      if (reduced || preserve) { killTimeline(); settle(); }
      else makeTimeline();
      paint();
      if (!built) { built = true; hideImg(); }
      return true;
    }

    // Safety net for the case where neither observer fires before layout settles.
    function retry(n) {
      if (built || n <= 0) return;
      window.requestAnimationFrame(function () {
        try { if (!build(false)) retry(n - 1); } catch (e) { fail(e); }
      });
    }

    /* ---------------- composition ---------------- */

    // mulberry32 — small, fast, and deterministic.
    function rng(seed) {
      var a = seed >>> 0;
      return function () {
        a = (a + 0x6D2B79F5) >>> 0;
        var t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    // The band is roughly 4x wider than tall, so an unsquashed radius would make the
    // falloff read as a vertical stripe. Halving dy keeps the cluster reading as a blob.
    function nearness(nx, ny) {
      var dx = nx - FOCAL_X, dy = (ny - FOCAL_Y) * 0.5;
      return Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 0.55);
    }

    // Near the focal mass the red/orange family dominates — that is what makes that
    // corner read as one block of colour rather than as confetti.
    function pick(r, near) {
      if (near > 0.55 && r() < near * 0.32) return 0;
      var t = r() * 100, acc = 0;
      for (var i = 0; i < PALETTE.length; i++) {
        acc += PALETTE[i].w;
        if (t <= acc) return i;
      }
      return 0;
    }

    function buildLevel(cols, seed) {
      var cell = W / cols;
      var rows = Math.max(1, Math.ceil(H / cell));
      var r = rng(seed), out = [];
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var nx = (x + 0.5) / cols, ny = (y + 0.5) / rows;
          var near = nearness(nx, ny);
          // Density falls off from the focal point; this is what reproduces the
          // artwork's composition instead of producing uniform noise.
          if (r() > OCCUPANCY * (0.55 + 1.10 * near)) continue;
          var base  = 0.10 + 0.20 * r();
          var boost = near * near * (0.25 + 0.65 * r());
          // Some squares span two cells. Overlap is what creates the darker patches
          // under multiply, and it is why the red mass reads as solid.
          var span = (near > 0.5 && r() < 0.35) ? 2 : 1;
          var k = r();
          // `ci` is the palette slot; `col` is the live colour and `tgt` where it is
          // heading. Keeping all three lets a square crossfade between palette entries
          // instead of jumping, which is what makes a sweep read as a wash of colour.
          var ci = pick(r, near), c0 = PALETTE[ci].c;
          var k0 = k < 0.05 ? 2 : (k < 0.07 ? 1 : 0);   // 2 halftone, 1 outline, 0 fill
          // Four sides, resolved once and deterministically. Side 0 is the composed
          // appearance, so an untouched band is exactly the measured artwork; the other
          // three are where a block can land when it is knocked over.
          var sides = makeSides(ci, k0, x, y, false);
          out.push({
            gx: x, gy: y, span: span,
            x: x * cell, y: y * cell, s: cell * span,
            ci: ci, hi: ci, hi0: ci,
            col: [c0[0], c0[1], c0[2]],
            tgt: [c0[0], c0[1], c0[2]],
            sides: sides, face: 0, flip: 0, axis: 0,
            alpha: Math.min(0.95, base + boost),
            kind: k0,
            nx: nx, near: near,
            t: 0, hot: false, amp: 0, per: 1, ph: 0,
            ox: 0, oy: 0, vx: 0, vy: 0,
            sc: 1, tx: 0, ty: 0, ts: 1, mw: 0
          });
        }
      }
      // Ambient: a small minority breathe, each on its own long period and phase, so
      // the band is quietly alive without anything ever being watchable.
      for (var i = 0; i < out.length; i++) {
        if (r() < 0.15) {
          out[i].amp = 0.06 + 0.10 * r();
          out[i].per = 8 + 12 * r();
          out[i].ph  = r() * TAU;
        }
      }
      // Grid -> cell lookup, so the pointer resolves to the ONE block it is inside.
      // A radius test is precisely what `flip` is meant not to be.
      var map = new Array(cols * rows);
      for (var j = 0; j < out.length; j++) {
        var qq = out[j];
        for (var sy = 0; sy < qq.span; sy++) {
          for (var sx = 0; sx < qq.span; sx++) {
            var ggy = qq.gy + sy, ggx = qq.gx + sx;
            if (ggx < cols && ggy < rows && map[ggy * cols + ggx] === undefined) map[ggy * cols + ggx] = j;
          }
        }
      }
      // Now give every EMPTY slot a block too, so the whole grid is playable rather than
      // only the 46% that carries colour at rest. These start white, which under multiply
      // means they draw nothing until something changes them.
      //
      // Appended AFTER the main loop and drawn from a SEPARATE random stream, which
      // matters: the composition above comes from consuming `r()` in a fixed order, so
      // taking even one extra number inside that loop would reshuffle the artwork the
      // client has already approved. This stream cannot reach it.
      var r2 = rng((seed ^ 0x5BF03635) >>> 0);
      for (var by = 0; by < rows; by++) {
        for (var bx = 0; bx < cols; bx++) {
          var slot = by * cols + bx;
          if (map[slot] !== undefined) continue;
          var bnx = (bx + 0.5) / cols, bny = (by + 0.5) / rows;
          var bnear = nearness(bnx, bny);
          var bci = weightedPick(r2());
          map[slot] = out.length;
          out.push({
            gx: bx, gy: by, span: 1,
            x: bx * cell, y: by * cell, s: cell,
            ci: bci, hi: PALETTE.length, hi0: PALETTE.length,   // starts on white
            col: [255, 255, 255], tgt: [255, 255, 255],
            sides: makeSides(bci, 0, bx, by, true),
            face: 0, flip: 0, axis: 0,
            // A higher floor than a resting square deliberately: a blank is only ever
            // seen once something has changed it, so it has to arrive loud enough to read.
            alpha: Math.min(0.95, BLANK_FLOOR + 0.28 * r2() + bnear * bnear * (0.22 + 0.50 * r2())),
            kind: 0, nx: bnx, near: bnear,
            t: 1,              // nothing to reveal - it is white until something changes it
            hot: false, amp: 0, per: 1, ph: 0,
            ox: 0, oy: 0, vx: 0, vy: 0,
            sc: 1, tx: 0, ty: 0, ts: 1, mw: 0
          });
        }
      }
      return { cells: out, a: 1, cols: cols, rows: rows, cell: cell, map: map };
    }

    function compose() {
      var cols = colsFor();
      levels = [];
      if (mode === 'develop') {
        // A low-res draft resolving: quarter, half, full. Same seed and same density
        // field at each step, so every level is recognisably an ancestor of the next.
        levels.push(buildLevel(Math.max(4, Math.round(cols / 4)), SEED));
        levels.push(buildLevel(Math.max(6, Math.round(cols / 2)), SEED));
        levels.push(buildLevel(cols, SEED));
        levels[1].a = 0; levels[2].a = 0;
        setT(levels[1], 1); setT(levels[2], 1);
      } else {
        levels.push(buildLevel(cols, SEED));
      }
    }

    function setT(lv, v) {
      for (var i = 0; i < lv.cells.length; i++) lv.cells[i].t = v;
    }

    function settle() {
      for (var i = 0; i < levels.length; i++) {
        levels[i].a = (i === levels.length - 1) ? 1 : 0;
        setT(levels[i], 1);
      }
    }

    /* ---------------- paint ---------------- */

    function paint() {
      var c = ctx2d, now = 0;
      try { now = g.ticker.time; } catch (e) {}
      var R2 = (W * HOV_R) * (W * HOV_R);
      var tint = (hover === 'paint' || hover === 'wash') && built;
      var turning = hover === 'flip' && built;
      var pushing = hover === 'push' && built;
      var making  = hover === 'makeway' && built;
      // Real elapsed time, clamped so a backgrounded tab returning does not teleport
      // every in-flight turn straight to its landing.
      var dt = lastNow ? Math.min(0.05, Math.max(0, now - lastNow)) : 0.016;
      lastNow = now;
      c.setTransform(DPR, 0, 0, DPR, 0, 0);
      c.globalCompositeOperation = 'source-over';
      c.fillStyle = GROUND;
      c.fillRect(0, 0, W, H);
      // Overlaps darken, exactly as they do in the placeholder. This one line is most
      // of the artwork's character; without it the squares just stack opaquely.
      c.globalCompositeOperation = 'multiply';
      for (var L = 0; L < levels.length; L++) {
        var lv = levels[L];
        if (lv.a <= 0.001) continue;
        var cells = lv.cells;
        var pushK = pushing ? PUSH_REACH * lv.cell * lv.cell * lv.cell / (2 * (SPRING_X - 1)) : 0;
        for (var i = 0; i < cells.length; i++) {
          var q = cells[i], t = q.t;

          // --- recolour ----------------------------------------------------------
          // A square adopts the next palette colour as the cursor reaches it, and has
          // to leave a wider ring before it can be re-tinted. Without that hysteresis a
          // cursor resting on the boundary would cycle the square every frame.
          if (tint && t > 0) {
            var cdx = (q.x + q.s / 2) - ptrX, cdy = (q.y + q.s / 2) - ptrY;
            var d2 = ptrIn ? cdx * cdx + cdy * cdy : Infinity;
            if (d2 < R2) {
              if (!q.hot) {
                q.hot = true;
                var nh = cyclePick(Math.random());
                if (nh === q.hi) nh = cyclePick(Math.random());   // make it actually change
                q.hi = nh;
                setTgt(q, CYCLE[q.hi]);
              }
            } else if (q.hot && d2 > R2 * HOV_EXIT) {
              q.hot = false;
              // `wash` returns the square to where it came from; `paint` keeps it.
              // Restore where the square started rather than stepping backwards: with a
              // sampled colour there is no arithmetic inverse to walk back along.
              if (hover === 'wash') { q.hi = q.hi0; setTgt(q, CYCLE[q.hi0]); }
            }
            var cc = q.col, tt = q.tgt;
            cc[0] += (tt[0] - cc[0]) * COL_EASE;
            cc[1] += (tt[1] - cc[1]) * COL_EASE;
            cc[2] += (tt[2] - cc[2]) * COL_EASE;
            // Snap once imperceptibly close. An exponential approach never actually
            // arrives, which would leave every washed square permanently a shade off
            // its resting colour - and `wash` is defined by returning to it exactly.
            if (Math.abs(tt[0] - cc[0]) < 0.5 && Math.abs(tt[1] - cc[1]) < 0.5 &&
                Math.abs(tt[2] - cc[2]) < 0.5) { cc[0] = tt[0]; cc[1] = tt[1]; cc[2] = tt[2]; }
          }

          // --- the turn ----------------------------------------------------------
          // Halfway through, the block is edge-on and has no width; that is the moment
          // the new side is swapped in, so the change happens hidden inside the turn
          // rather than crossfading in front of the reader.
          // --- the shove ---------------------------------------------------------
          // Repulsion is inverse-square, so a block one cell away is moved hard and one
          // across the band is barely touched. The spring is deliberately under-damped:
          // blocks overshoot home and settle, which is what reads as physical rather
          // than as an easing curve.
          if (pushing) {
            var hx = q.x + q.s / 2 + q.ox, hy = q.y + q.s / 2 + q.oy;
            var pdx = ptrX - hx, pdy = ptrY - hy;
            var pd = Math.sqrt(pdx * pdx + pdy * pdy);
            if (pd < MAG_MIN) pd = MAG_MIN;
            var shove = ptrIn ? pushK / (pd * pd) : 0;
            q.vx = (q.vx - q.ox / 2) / SPRING_X;
            q.vy = (q.vy - q.oy / 2) / SPRING_Y;
            q.ox += q.vx - (pdx / pd) * shove;
            q.oy += q.vy - (pdy / pd) * shove;
            var cap = q.s * MAG_CAP, mag = Math.sqrt(q.ox * q.ox + q.oy * q.oy);
            if (mag > cap) { q.ox = q.ox / mag * cap; q.oy = q.oy / mag * cap; }
          }

          // --- making way --------------------------------------------------------
          // Every block eases toward the arrangement chosen when a block was selected.
          // Targets are recomputed once per selection, never per frame, so this costs
          // one lerp per block regardless of how fast the cursor moves.
          if (making) {
            q.ox += (q.tx - q.ox) * MW_EASE;
            q.oy += (q.ty - q.oy) * MW_EASE;
            q.sc += (q.ts - q.sc) * MW_EASE;
            if (Math.abs(q.tx - q.ox) < 0.05 && Math.abs(q.ty - q.oy) < 0.05 &&
                Math.abs(q.ts - q.sc) < 0.002) { q.ox = q.tx; q.oy = q.ty; q.sc = q.ts; }
          }

          if (turning && q.flip > 0) {
            var was = q.flip;
            q.flip += dt / FLIP_DUR;
            if (was < 0.5 && q.flip >= 0.5) q.face = (q.face + 1) % FACES;
            if (q.flip >= 1) q.flip = 0;
          }

          if (t <= 0) continue;
          var a = q.alpha * (t > 1 ? 1 : t) * lv.a;
          if (q.amp) a *= 1 + q.amp * Math.sin(now / q.per * TAU + q.ph);
          // The single biggest lever on how much a change reads: a square that has been
          // altered stops being a pale wash and becomes present. Without this the whole
          // interaction happens at the artwork's resting opacity and is easy to miss.
          if (turning ? q.face !== 0 : q.hi !== q.hi0) a = Math.min(0.95, a * CHANGE_GAIN);
          if (a <= 0.002) continue;
          var s = q.s * (0.70 + 0.30 * t) * q.sc, bw = s, bh = s;
          if (q.mw) a = Math.min(0.95, a * MW_LIFT);
          // In `flip` the colour comes from whichever side is showing; in the recolour
          // modes it is the crossfaded value. One draw path, two sources.
          // In `flip` the square IS whichever side is showing, blank included. In the
          // recolour modes white is just a colour, so a square only skips drawing when
          // it is white and has nowhere to go - which is what an empty cell is.
          var col, kind, side;
          if (turning) { side = q.sides[q.face]; if (side.blank) continue; col = side.c; kind = side.k; }
          else {
            col = q.col; kind = q.kind;
            if (isWhite(col) && isWhite(q.tgt)) continue;
          }
          if (q.flip > 0) {
            // |cos| across half a turn: full width, edge-on at the midpoint, full again
            // on the new side. Smoothstepped so it tips and settles instead of sweeping
            // at a constant rate.
            var fp = q.flip * q.flip * (3 - 2 * q.flip);
            var sc = Math.abs(Math.cos(Math.PI * fp));
            if (q.axis) bh = s * sc; else bw = s * sc;
            a = Math.min(0.95, a * (1 + FLIP_EDGE * (1 - sc)));   // catches shadow edge-on
          }
          var ox = q.x + (q.s - bw) / 2 + q.ox, oy = q.y + (q.s - bh) / 2 + q.oy;
          var rgba = 'rgba(' + (col[0] | 0) + ',' + (col[1] | 0) + ',' + (col[2] | 0) + ',' + a + ')';
          if (kind === 1) {
            c.strokeStyle = rgba;
            c.lineWidth = 1;
            c.strokeRect(ox + 0.5, oy + 0.5, Math.max(0, bw - 1), Math.max(0, bh - 1));
          } else if (kind === 2) {
            halftone(c, ox, oy, bw, bh, rgba);
          } else {
            c.fillStyle = rgba;
            c.fillRect(ox, oy, bw, bh);
          }
        }
      }
    }

    function setTgt(q, c) { q.tgt[0] = c[0]; q.tgt[1] = c[1]; q.tgt[2] = c[2]; }

    // The dotted squares. Only ~5% of cells carry these: they are plain in the design
    // but barely survive in the 1296px asset, so the share is deliberately small.
    // fillRect rather than arc — at ~1px these are indistinguishable and far cheaper.
    function halftone(c, x, y, w, h, rgba) {
      var big = Math.max(w, h);
      var step = Math.max(3, big / 7), d = Math.max(1, step * 0.34);
      var sx = Math.max(1, step * (w / big));      // the dot grid squashes with the turn
      var sy = Math.max(1, step * (h / big));
      c.fillStyle = rgba;
      for (var dy = sy / 2; dy < h; dy += sy) {
        for (var dx = sx / 2; dx < w; dx += sx) {
          c.fillRect(x + dx - d / 2, y + dy - d / 2, d, d);
        }
      }
    }

    /* ---------------- reveal ---------------- */

    function makeTimeline() {
      killTimeline();
      tl = g.timeline({ scrollTrigger: { trigger: strip, start: START, once: true } });
      if (mode === 'develop') {
        var L0 = levels[0], L1 = levels[1], L2 = levels[2];
        tl.to(liveOnly(L0.cells), { t: 1, duration: 0.5, ease: 'power2.out',
                          stagger: { amount: 0.35, from: 'random' } }, 0)
          .to(L0, { a: 0, duration: 0.45, ease: 'none' }, 0.80)
          .to(L1, { a: 1, duration: 0.45, ease: 'none' }, 0.80)
          .to(L1, { a: 0, duration: 0.45, ease: 'none' }, 1.40)
          .to(L2, { a: 1, duration: 0.45, ease: 'none' }, 1.40);
      } else {
        // One tween per cell so the order can be ours: distance from the focal mass
        // for `cluster`, horizontal position for `sweep`. GSAP's own `from` values
        // cannot express "outward from an arbitrary point".
        var cells = liveOnly(levels[0].cells), r = rng(SEED ^ 0x9E37);
        for (var i = 0; i < cells.length; i++) {
          var q = cells[i];
          var d = (mode === 'sweep')
            ? q.nx * 0.90 + r() * 0.15
            : (1 - q.near) * 0.85 + r() * 0.14;
          tl.to(q, { t: 1, duration: 0.65, ease: 'back.out(1.7)' }, d);
        }
      }
    }

    // Blank blocks have nothing to reveal, so they stay out of the entrance timeline
    // rather than being tweened from invisible to invisible.
    function liveOnly(cells) {
      var out = [];
      for (var i = 0; i < cells.length; i++) if (!cells[i].sides[0].blank) out.push(cells[i]);
      return out;
    }

    // Choose the block under the cursor and lay the grid out around it. Only a block
    // that is visible at rest can be chosen - selecting an invisible one would part the
    // grid around nothing, which reads as a glitch. Passing over a blank therefore
    // leaves the current arrangement alone rather than collapsing it.
    function selectAt(nx, ny) {
      var lv = levels[levels.length - 1];
      if (!lv || !lv.map) return;
      var gx = Math.floor(nx / lv.cell), gy = Math.floor(ny / lv.cell);
      if (gx < 0 || gy < 0 || gx >= lv.cols || gy >= lv.rows) return;
      var idx = lv.map[gy * lv.cols + gx];
      if (idx === undefined || idx === mwIdx) return;
      if (lv.cells[idx].sides[0].blank || lv.cells[idx].t <= 0) return;
      mwIdx = idx;
      layout(lv);
    }

    function layout(lv) {
      var sel = mwIdx >= 0 ? lv.cells[mwIdx] : null;
      var reach = lv.cell * MW_REACH, spread = lv.cell * MW_SPREAD;
      for (var i = 0; i < lv.cells.length; i++) {
        var q = lv.cells[i];
        if (!sel) { q.tx = 0; q.ty = 0; q.ts = 1; q.mw = 0; continue; }
        if (q === sel) { q.tx = 0; q.ty = 0; q.ts = MW_SCALE; q.mw = 1; continue; }
        q.mw = 0;
        var dx = (q.x + q.s / 2) - (sel.x + sel.s / 2);
        var dy = (q.y + q.s / 2) - (sel.y + sel.s / 2);
        var d = Math.sqrt(dx * dx + dy * dy);
        // Linear falloff with a hard cutoff, as in the source - not the inverse-square
        // of `push`. It is what makes the grid part in a readable, structured way.
        var amt = d >= reach ? 0 : spread * (1 - d / reach);
        if (d < 0.001) { q.tx = 0; q.ty = 0; q.ts = 1; continue; }
        q.tx = (dx / d) * amt;
        q.ty = (dy / d) * amt;
        q.ts = 1;
      }
    }

    function killTimeline() {
      if (!tl) return;
      try { if (tl.scrollTrigger) tl.scrollTrigger.kill(); } catch (e) {}
      try { tl.kill(); } catch (e) {}
      tl = null;
    }

    /* ---------------- run gating ---------------- */
    // The band idles forever, so the loop must cost nothing when nobody can see it.
    // Painting continuously while the reader is 4000px further down is pure battery
    // cost. Gated on both intersection and tab visibility.

    function frame() { try { paint(); } catch (e) { fail(e); } }

    function sync() {
      var want = !reduced && built && onScreen && document.visibilityState !== 'hidden';
      if (want === running) return;
      running = want;
      if (want) g.ticker.add(frame); else g.ticker.remove(frame);
    }

    function watch() {
      if (window.IntersectionObserver) {
        new window.IntersectionObserver(function (entries) {
          onScreen = entries[0].isIntersecting;
          // Scrolling the band away does not reliably fire pointerleave, so the pointer
          // would still read as "inside" when it comes back - and the first frame would
          // recolour a ring around wherever the cursor last happened to be. Drop it.
          if (!onScreen) {
            ptrIn = false; lastHit = -1;
            if (hover === 'makeway' && mwIdx !== -1) { mwIdx = -1; layout(levels[levels.length - 1]); }
          }
          if (!built) build(false);
          sync();
        }, { rootMargin: '120px 0px' }).observe(strip);
      } else {
        onScreen = true;
      }
      document.addEventListener('visibilitychange', sync);

      // Attached even under reduced motion: a static render still has to be redrawn
      // at the right size when the box changes.
      if (window.ResizeObserver) new window.ResizeObserver(onResize).observe(strip);
      else window.addEventListener('resize', onResize);

      if (hover !== 'off') {
        // The handler only records where the pointer is. Which squares change, and to
        // what, is decided in paint() - so the effect is frame-rate bound rather than
        // event-rate bound, and a fast sweep cannot outrun it or flood it.
        strip.addEventListener('pointermove', function (e) {
          var r = strip.getBoundingClientRect();
          var nx = e.clientX - r.left, ny = e.clientY - r.top;
          var mvx = nx - lastPX, mvy = ny - lastPY;
          lastPX = nx; lastPY = ny;
          ptrX = nx; ptrY = ny; ptrIn = true;
          if (!built) return;
          if (hover === 'makeway') { selectAt(nx, ny); return; }
          if (hover !== 'flip') return;
          var lv = levels[levels.length - 1];
          if (!lv || !lv.map) return;
          var gx = Math.floor(nx / lv.cell), gy = Math.floor(ny / lv.cell);
          if (gx < 0 || gy < 0 || gx >= lv.cols || gy >= lv.rows) { lastHit = -1; return; }
          var idx = lv.map[gy * lv.cols + gx];
          if (idx === undefined) { lastHit = -1; return; }
          if (idx === lastHit) return;      // still inside the same block: one topple per entry
          lastHit = idx;
          // Topple the block entered and the ring around it. Scanning only the grid box
          // that the radius can reach keeps this cheap no matter how fast the pointer
          // moves - never a sweep over every cell in the band.
          var rad = lv.cell * FLIP_CELLS, rad2 = rad * rad;
          var x0 = Math.max(0, Math.floor((nx - rad) / lv.cell));
          var x1 = Math.min(lv.cols - 1, Math.floor((nx + rad) / lv.cell));
          var y0 = Math.max(0, Math.floor((ny - rad) / lv.cell));
          var y1 = Math.min(lv.rows - 1, Math.floor((ny + rad) / lv.cell));
          var ax = Math.abs(mvx) >= Math.abs(mvy) ? 0 : 1;
          for (var yy = y0; yy <= y1; yy++) {
            for (var xx = x0; xx <= x1; xx++) {
              var ii = lv.map[yy * lv.cols + xx];
              if (ii === undefined) continue;
              var cc = lv.cells[ii];
              if (cc.t <= 0 || cc.flip > 0) continue;        // not revealed, or already turning
              var ccx = (cc.x + cc.s / 2) - nx, ccy = (cc.y + cc.s / 2) - ny;
              if (ccx * ccx + ccy * ccy > rad2) continue;
              // They fall away from the direction of travel, so the cursor reads as
              // having pushed them over rather than each block deciding on its own.
              cc.axis = ax;
              cc.flip = 0.0001;
            }
          }
        }, { passive: true });
        strip.addEventListener('pointerleave', function () {
          ptrIn = false; lastHit = -1;
          // Leaving collapses the arrangement; the grid closes back up behind you.
          if (hover === 'makeway' && mwIdx !== -1) { mwIdx = -1; layout(levels[levels.length - 1]); }
        }, { passive: true });
      }
      sync();
    }

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        try {
          var started = built && (!tl || tl.progress() > 0);
          build(started);
          sync();
        } catch (e) { fail(e); }
      }, 150);
    }

    /* ---------------- fallback ---------------- */

    function hideImg() {
      // visibility, not opacity: the block above tweens opacity on this same img, and
      // visibility is orthogonal so the two cannot fight. Inline, so no class and no
      // stylesheet is touched. The element stays in the DOM as the fallback.
      if (img) img.style.visibility = 'hidden';
    }

    function fail(e) {
      try { running = false; g.ticker.remove(frame); } catch (e2) {}
      try { killTimeline(); } catch (e2) {}
      try { if (img) img.style.visibility = ''; } catch (e2) {}
      try { if (cv && cv.parentNode) cv.parentNode.removeChild(cv); } catch (e2) {}
      if (window.console && console.warn) console.warn('[twf-mosaic]', e);
      return true;
    }
  }
})();
/* ==== END twf-anim addition — session B ==== */
