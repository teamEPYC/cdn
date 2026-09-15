
// resets the widget on Back so a repeat attempt gets a fresh, unused token
(() => {
  'use strict';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => document.querySelector(s);
  const machine = $('.bread-machine');
  const handle = $('.bread-handle');
  const ticket = $('.bread-ticket');
  const face = $('.bread-face');
  const tkNo = $('.bread-face .bread-tk-no');
  const status = $('.bread-status');
  const tear = $('.bread-tk-tear');
  const confetti = $('.bread-confetti');
  const burst = $('.bread-burst');
  const reveal = $('.bread-reveal');
  const pass = $('.bread-pass');
  const hero = $('.bread-hero');
  const rig = $('.bread-rig');
  const callout = $('.bread-callout');
  const pTicket = pass ? pass.querySelector('.bread-tk-no') : null;
  const pNo = $('.bread-p-no');
  const rTitle = $('.bread-reveal-title');
  const acts = $('.bread-acts');

  const form = (face && face.querySelector('form')) || $('.bread-face form') || $('form');
  const pick = (names, fallbackId) => {
    if (form) {
      for (const n of names) {
        const el = form.querySelector(`input[name="${n}" i]`);
        if (el) return el;
      }
    }
    return document.getElementById(fallbackId);
  };
  const nameEl = pick(['Name'], 'name');
  const emailEl = pick(['Email', 'Email-2', 'Email Address'], 'email');
  const tgEl = pick(['Telegram', 'Field'], 'field');
  const tkNumEl = pick(['Ticket number'], 'ticket-number');
  if (!tkNumEl) console.warn('[bread] Ticket number field not found — check its name/id attribute');

  if (!machine || !handle || !ticket || !face || !tear) {
    console.warn('[bread] machine parts missing — check the .bread-* classes are intact');
    return;
  }
  if (!form) console.warn('[bread] no native form found inside .bread-face; submission will be skipped');

  // Gate the form's native submit so it only ever fires from the one
  // deliberate call inside doReveal(). Without this, tear being
  // type="submit" inside the form lets Enter-in-an-input (or any other
  // implicit submit) bypass our JS/animation flow and submit early.
  let allowSubmit = false;
  if (form) {
    form.addEventListener('submit', (e) => {
      if (!allowSubmit) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });
  }

  const rand = (a, b) => a + Math.random() * (b - a);
  const fmt = (n) => (n === null ? 'No. —' : 'No. ' + n.toLocaleString('en-US'));
  let phase = 'ready';

  let ticketAnimating = false;
  const HEIGHT_BUFFER = 40;

  // How long to wait for Webflow's .w-form-done / .w-form-fail to appear
  // before treating the submission as failed.
  const SUBMIT_VERIFY_TIMEOUT_MS = 15000;

  // ---------------------------------------------------------------------
  // Ticket counter: reflects real form submissions via a Cloudflare Worker.
  // /peek gives a read-only preview of the next ticket number for display.
  // The REAL increment happens server-to-server: Webflow's own form-submission
  // webhook calls the Worker's /webhook endpoint (secret-gated) once a
  // submission is actually stored. The browser never has permission to
  // increment — /claim is not a public route anymore.
  // ---------------------------------------------------------------------
  const WORKER_URL = 'https://wallet-waitlist-counter.dominik-a40.workers.dev';
  const LS_KEY = 'bread_last_ticket';

  const SUBMITTED_KEY = 'bread_submitted_ticket';
  function getSubmittedState() {
    try {
      const raw = localStorage.getItem(SUBMITTED_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }
  function setSubmittedState(state) {
    try {
      localStorage.setItem(SUBMITTED_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  const Counter = (() => {
    let fallback = null;
    try {
      const v = parseInt(localStorage.getItem(LS_KEY), 10);
      if (Number.isFinite(v)) fallback = v;
    } catch (_) {}

    function saveLocal(n) {
      try {
        localStorage.setItem(LS_KEY, String(n));
      } catch (_) {}
    }
    function fallbackPreview() {
      return Number.isFinite(fallback) ? fallback + 1 : null;
    }

    // Read-only: what the NEXT ticket number would be, without claiming it.
    async function peek(timeoutMs = 1200) {
      const req = fetch(`${WORKER_URL}/peek`, { cache: 'no-store' })
        .then((r) => {
          if (!r.ok) throw new Error('bad status ' + r.status);
          return r.json();
        })
        .then((d) => {
          saveLocal(d.count);
          return d.count;
        })
        .catch(() => fallbackPreview());
      const timeout = new Promise((res) => setTimeout(() => res(fallbackPreview()), timeoutMs));
      return Promise.race([req, timeout]);
    }

    return { peek };
  })();

  const existingSubmission = getSubmittedState();

  let pending = existingSubmission ? existingSubmission.ticket : null;
  if (tkNo) tkNo.textContent = 'Ticket No. ' + (pending === null ? '—' : pending);

  function refreshPending() {
    if (existingSubmission) return;
    Counter.peek().then((n) => {
      if (existingSubmission || n === null) return;
      pending = n;
      if (tkNo && (phase === 'ready' || phase === 'armed')) {
        tkNo.textContent = 'Ticket No. ' + pending;
      }
    });
  }
  refreshPending();

  const Sfx = (() => {
    let ctx = null,
      nb = null;
    const boot = () => {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        const len = ctx.sampleRate,
          b = ctx.createBuffer(1, len, ctx.sampleRate),
          c = b.getChannelData(0);
        for (let i = 0; i < len; i++) c[i] = Math.random() * 2 - 1;
        nb = b;
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    };
    const burstN = (t, dur, freq, q, gain) => {
      const s = ctx.createBufferSource();
      s.buffer = nb;
      s.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = freq;
      f.Q.value = q;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f);
      f.connect(g);
      g.connect(ctx.destination);
      s.start(t);
      s.stop(t + dur + 0.02);
    };
    const thump = (t, f0, f1, dur, gain) => {
      const o = ctx.createOscillator(),
        g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
    };
    return {
      clunk() {
        if (!boot()) return;
        const t = ctx.currentTime;
        thump(t, 150, 46, 0.16, 0.32);
        burstN(t, 0.07, 1900, 1.1, 0.13);
      },
      ratchet(n, span) {
        if (!boot()) return;
        const t = ctx.currentTime;
        for (let i = 0; i < n; i++) burstN(t + (i / n) * span + Math.random() * 0.012, 0.028, 2600 + Math.random() * 1400, 3.2, 0.05);
      },
      rip(v) {
        if (!boot()) return;
        burstN(ctx.currentTime, 0.05, 2200 + Math.random() * 2600, 1.4, Math.min(0.12, 0.03 + v * 0.11));
      },
      snap() {
        if (!boot()) return;
        const t = ctx.currentTime;
        burstN(t, 0.13, 3000, 0.9, 0.14);
        burstN(t + 0.02, 0.09, 1200, 1.6, 0.07);
      },
      chime() {
        if (!boot()) return;
        const t = ctx.currentTime;
        [784, 1046.5, 1318.5].forEach((f, i) => {
          const o = ctx.createOscillator(),
            g = ctx.createGain();
          o.type = 'triangle';
          o.frequency.value = f;
          g.gain.setValueAtTime(0.0001, t + i * 0.055);
          g.gain.exponentialRampToValueAtTime(0.1, t + i * 0.055 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.055 + 0.5);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(t + i * 0.055);
          o.stop(t + i * 0.055 + 0.55);
        });
      },
    };
  })();

  function openTicket() {
    phase = 'armed';
    refreshPending();
    document.dispatchEvent(new CustomEvent('bread:ticket-active'));

    Sfx.clunk();
    Sfx.ratchet(9, 0.62);
    if (!RM) {
      machine.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(4px)' }, { transform: 'translateY(0)' }], { duration: 380, easing: 'cubic-bezier(.22,1.4,.36,1)' });
      handle.animate([{ transform: 'rotateZ(-15Deg)' }, { transform: 'rotateZ(15Deg)' }], { duration: 600, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
    } else {
      handle.style.transform = 'translateY(18px)';
    }
    if (callout) callout.style.display = 'none';

    ticketAnimating = true;
    ticket.classList.add('bread-ticket-open');
    ticket.style.transition = RM ? 'none' : 'max-height .6s cubic-bezier(.22,.61,.36,1)';
    ticket.style.maxHeight = '0px';
    void ticket.offsetHeight;

    const setTarget = () => {
      const full = ticket.scrollHeight + HEIGHT_BUFFER;
      ticket.style.maxHeight = full + 'px';

      const rect = ticket.getBoundingClientRect();
      const ticketTop = window.scrollY + rect.top;
      const ticketBottom = ticketTop + full;
      const SCROLL_PADDING = 40;
      const targetY = ticketBottom - window.innerHeight + SCROLL_PADDING;
      window.scrollTo({ top: Math.max(0, targetY), behavior: RM ? 'auto' : 'smooth' });
    };
    if (RM) setTarget();
    else requestAnimationFrame(() => requestAnimationFrame(setTarget));

    ticket.addEventListener('transitionend', function onOpenEnd(e) {
      if (e.propertyName === 'max-height') {
        ticket.style.maxHeight = 'none';
        ticketAnimating = false;
        ticket.removeEventListener('transitionend', onOpenEnd);
        document.dispatchEvent(new CustomEvent('bread:ticket-expanded'));
      }
    });
    if (RM) {
      ticket.style.maxHeight = 'none';
      ticketAnimating = false;
      document.dispatchEvent(new CustomEvent('bread:ticket-expanded'));
    }

    say('Fill it in, then tear it across');
    setTimeout(
      () => {
        try {
          if (nameEl) nameEl.focus({ preventScroll: true });
        } catch (_) {}
      },
      RM ? 0 : 720,
    );
  }

  function dispense() {
    if (phase === 'ready') openTicket();
  }
  handle.style.cursor = 'pointer';
  handle.setAttribute('role', 'button');
  handle.setAttribute('tabindex', '0');
  handle.addEventListener('click', (e) => {
    e.preventDefault();
    dispense();
  });
  handle.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      dispense();
    }
  });

  const ro =
    'ResizeObserver' in window
      ? new ResizeObserver(() => {
          if (ticket.classList.contains('bread-ticket-open') && !ticketAnimating) ticket.style.maxHeight = ticket.scrollHeight + HEIGHT_BUFFER + 'px';
        })
      : null;
  if (ro && face) ro.observe(face);

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validate() {
    if (nameEl && !nameEl.value.trim()) {
      say('We need a name for the ticket');
      shake();
      nameEl.focus();
      return false;
    }
    if (emailEl && !EMAIL.test(emailEl.value.trim())) {
      say('Add a valid email');
      shake();
      emailEl.focus();
      return false;
    }
    return true;
  }
  function shake() {
    if (RM) return;
    face.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }], { duration: 400, easing: 'ease' });
  }

  const N = 32;
  let zig = Array.from({ length: N + 1 }, () => Math.random() * 2.4);
  const clipFor = (p, dir) => {
    if (p <= 0) return 'none';
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * 100;
      const torn = dir > 0 ? x <= p * 100 : x >= (1 - p) * 100;
      pts.push(`${x.toFixed(2)}% ${(torn ? zig[i] : 0).toFixed(2)}%`);
    }
    pts.push('100% 100%', '0% 100%');
    return `polygon(${pts.join(',')})`;
  };
  const applyTear = (p, dir) => {
    ticket.style.transformOrigin = dir > 0 ? '100% 0%' : '0% 0%';
    ticket.style.clipPath = clipFor(p, dir);
    ticket.style.transform = `rotate(${((dir > 0 ? -1 : 1) * p * 11).toFixed(2)}deg)`;
  };

  let tDrag = null;
  tear.style.cursor = 'grab';
  tear.setAttribute('role', 'button');
  tear.setAttribute('tabindex', '0');
  function setTearTouchAction() {
    tear.style.touchAction = phase === 'armed' ? 'none' : 'auto';
  }
  setTearTouchAction();
  tear.addEventListener('pointerdown', (e) => {
    if (phase !== 'armed') return;
    if (!validate()) return;
    try {
      tear.setPointerCapture(e.pointerId);
    } catch (_) {}
    tDrag = { x: e.clientX, dir: 0, p: 0, moved: false };
    phase = 'tearing';
    setTearTouchAction();
  });
  tear.addEventListener('pointermove', (e) => {
    if (!tDrag) return;
    const dx = e.clientX - tDrag.x;
    if (!tDrag.dir && Math.abs(dx) > 4) tDrag.dir = Math.sign(dx);
    if (!tDrag.dir) return;
    tDrag.moved = true;
    const span = ticket.getBoundingClientRect().width * 0.85;
    const p = Math.max(0, Math.min(1, (dx * tDrag.dir) / span));
    if (p - tDrag.p > 0.06) Sfx.rip(p);
    tDrag.p = p;
    applyTear(p, tDrag.dir);
  });
  function endTear() {
    if (!tDrag) return;
    const { p, dir, moved } = tDrag;
    tDrag = null;
    if (!moved) {
      autoTear();
      return;
    }
    if (p > 0.55) finishTear(dir, p);
    else {
      ticket.style.transition = 'clip-path .34s cubic-bezier(.22,1.4,.36,1), transform .34s cubic-bezier(.22,1.4,.36,1)';
      applyTear(0, dir || 1);
      ticket.style.clipPath = 'none';
      phase = 'armed';
      setTearTouchAction();
      setTimeout(() => {
        ticket.style.transition = '';
      }, 360);
    }
  }
  tear.addEventListener('pointerup', endTear);
  tear.addEventListener('pointercancel', endTear);
  tear.addEventListener('click', (e) => {
    // tear is type="submit" inside the form — its native click would
    // submit immediately. Block that; the one real submit happens later,
    // gated behind allowSubmit, from doReveal() once the tear animation
    // finishes.
    e.preventDefault();
    if (phase === 'armed' && validate()) autoTear();
  });
  tear.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && phase === 'armed' && validate()) {
      e.preventDefault();
      autoTear();
    }
  });
  function autoTear() {
    phase = 'tearing';
    Sfx.rip(0.6);
    const dir = 1;
    const t0 = performance.now(),
      dur = RM ? 120 : 300;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      applyTear(p, dir);
      if (p < 1) requestAnimationFrame(step);
      else finishTear(dir, 1);
    };
    requestAnimationFrame(step);
  }
  function finishTear(dir, from) {
    phase = 'flying';
    Sfx.snap();
    const t0 = performance.now(),
      dur = RM ? 90 : 160;
    const step = (now) => {
      const p = from + (1 - from) * Math.min(1, (now - t0) / dur);
      applyTear(p, dir);
      if (p < 1) requestAnimationFrame(step);
      else doReveal();
    };
    requestAnimationFrame(step);
  }

  // Locates the Webflow success/fail markers around a given form.
  // Webflow's own runtime toggles .w-form-done / .w-form-fail visibility
  // once its AJAX submission resolves — there's no JS event to await,
  // so we watch for that DOM change instead.
  function getWForm(formEl) {
    const wrapper = formEl.closest('.w-form') || formEl.parentElement;
    const scope = wrapper || document;
    const doneEl = scope.querySelector('.w-form-done');
    const failEl = scope.querySelector('.w-form-fail');
    return { wrapper, doneEl, failEl };
  }

  function doReveal() {
    if (!form) {
      completeReveal();
      return;
    }

    // populate reveal texts (incl. .bread-p-no) before submit so we can read the number from it
    updateRevealTexts(pending);

    if (tkNumEl) {
      const match = pNo ? pNo.textContent.match(/\d+/) : null;
      tkNumEl.value = match ? match[0] : (pending === null ? '' : String(pending));
    }

    const wf = getWForm(form);
    if (!wf.wrapper || (!wf.doneEl && !wf.failEl)) {
      // No Webflow success/fail markers found on this page — nothing to
      // verify against, so submit and proceed as before.
      allowSubmit = true;
      try {
        if (form.requestSubmit) form.requestSubmit();
        else form.submit();
      } catch (_) {}
      allowSubmit = false;
      completeReveal();
      return;
    }

    let settled = false;
    const isVisible = (el) => !!el && el.offsetParent !== null && getComputedStyle(el).display !== 'none';

    const observer = new MutationObserver(check);
    const timer = setTimeout(() => finish(false), SUBMIT_VERIFY_TIMEOUT_MS);

    function finish(ok) {
      if (settled) return;
      settled = true;
      observer.disconnect();
      clearTimeout(timer);
      if (ok) completeReveal();
      else failReveal();
    }

    function check() {
      if (isVisible(wf.failEl)) finish(false);
      else if (isVisible(wf.doneEl)) finish(true);
    }

    observer.observe(wf.wrapper, { attributes: true, attributeFilter: ['style', 'class'], subtree: true });

    allowSubmit = true;
    try {
      if (form.requestSubmit) form.requestSubmit();
      else form.submit();
    } catch (_) {
      allowSubmit = false;
      finish(false);
      return;
    }
    allowSubmit = false;

    // Catch the case Webflow already flipped visibility synchronously.
    check();
  }

  function completeReveal() {
    window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });

    // Optimistic display only — the real, authoritative count is incremented
    // server-to-server by Webflow's form-submission webhook hitting the
    // Worker's /webhook route. The browser has no way to increment it itself.
    updateRevealTexts(pending);
    setSubmittedState({ ticket: pending, name: ((nameEl && nameEl.value) || '').trim() });

    if (rig) {
      rig.style.transition = RM ? 'none' : 'opacity .4s ease';
      rig.style.opacity = '0';
      const collapseRig = () => {
        // Opacity alone leaves rig's box in the layout — the section stays
        // as tall as the fully-opened ticket. Take it out of flow once faded
        // so the section collapses back down, then let ScrollTrigger
        // re-measure the now-short height.
        rig.style.display = 'none';
        document.dispatchEvent(new CustomEvent('bread:ticket-done'));
      };
      if (RM) collapseRig();
      else setTimeout(collapseRig, 400);
    } else {
      document.dispatchEvent(new CustomEvent('bread:ticket-done'));
    }

    if (reveal) reveal.classList.add('bread-reveal-open');
    say('');
    phase = 'done';
    setTearTouchAction();
    setTimeout(
      () => {
        Sfx.chime();
        popBurst();
      },
      RM ? 0 : 180,
    );
  }

  function failReveal(msg) {
    // Submission didn't succeed — undo the tear visually and let the
    // person try again instead of showing a false success state.
    phase = 'armed';
    setTearTouchAction();
    ticket.style.transition = RM ? 'none' : 'clip-path .34s cubic-bezier(.22,1.4,.36,1), transform .34s cubic-bezier(.22,1.4,.36,1)';
    applyTear(0, 1);
    ticket.style.clipPath = 'none';
    setTimeout(
      () => {
        ticket.style.transition = '';
      },
      RM ? 0 : 360,
    );
    shake();
    say(msg || 'Something went wrong — pull the tab to try again');
  }

  function updateRevealTexts(n, nameOverride) {
    const source = nameOverride !== undefined ? nameOverride : (nameEl && nameEl.value) || '';
    const first = source.trim().split(/\s+/)[0];
    if (pTicket) pTicket.textContent = 'Ticket No. ' + n;
    if (pNo) pNo.textContent = fmt(n);
    if (rTitle) rTitle.textContent = first ? `You're in line, ${first}.` : "You're in line.";
  }

  function showExistingTicket(state) {
    phase = 'done';
    if (callout) callout.style.display = 'none';
    if (rig) {
      rig.style.transition = 'none';
      rig.style.opacity = '0';
      rig.style.display = 'none';
    }
    updateRevealTexts(state.ticket, state.name || '');
    if (reveal) reveal.classList.add('bread-reveal-open');
    setTearTouchAction();
  }

  function popBurst() {
    if (RM || !burst) return;
    const cols = ['#9C9284', '#DFD8D3', '#EAE5E1', '#F1A47E', '#E7743A', '#90BA89'];
    const cx = innerWidth / 2,
      cy = innerHeight / 2;
    for (let i = 0; i < 34; i++) {
      const b = document.createElement('i');
      const size = rand(7, 16),
        ang = rand(0, Math.PI * 2),
        dist = rand(140, 460);
      b.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;` + `border-radius:${Math.random() < 0.5 ? '50%' : '3px'};background:${cols[i % cols.length]};opacity:.95`;
      burst.appendChild(b);
      b.animate(
        [
          { transform: 'translate(-50%,-50%) scale(.4) rotate(0deg)', opacity: 1 },
          { transform: `translate(${Math.cos(ang) * dist - size / 2}px, ${Math.sin(ang) * dist - size / 2 + rand(60, 180)}px) scale(1) rotate(${rand(-320, 320)}deg)`, opacity: 0 },
        ],
        { duration: rand(900, 1500), easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' },
      ).onfinish = () => b.remove();
    }
  }

  function resetFormFields() {
    if (!form) return;
    form.querySelectorAll('input, textarea').forEach((el) => {
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
      else if (el.name && el.name.toLowerCase() !== 'cf-turnstile-response') el.value = '';
    });
  }

  if (acts) {
    const [, backBtn] = acts.querySelectorAll('a');
    if (backBtn)
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetFormFields();
        if (reveal) reveal.classList.remove('bread-reveal-open');
        if (hero) hero.classList.remove('bread-hero-hidden');

        if (rig) {
          rig.style.transition = 'none';
          rig.style.opacity = '';
          rig.style.display = '';
        }

        if (!RM) handle.getAnimations().forEach((a) => a.cancel());
        handle.style.transform = '';

        if (callout) callout.style.display = '';

        ticket.style.clipPath = 'none';
        ticket.style.transform = '';
        ticket.style.maxHeight = '';
        ticket.classList.remove('bread-ticket-open');
        phase = 'ready';
        document.dispatchEvent(new CustomEvent('bread:ticket-done'));
        setTearTouchAction();

        say(`You already hold <b style="color:#E7743A">${fmt(pending)}</b> — pull again to see it`);
      });
  }

  (function seed() {
    if (RM || !confetti) return;
    const coins = ['#90BA89', '#F1A47E', '#9C9284'];
    const tiles = ['#BEACD2', '#91ACC1', '#777487'];
    const chips = ['fresh batch', 'early access', 'fresh batch', 'early access'];
    let chipN = 0,
      coinN = 0,
      tileN = 0;
    const sparkPath = 'M50 0c4 27 19 42 50 50-31 8-46 23-50 50-4-27-19-42-50-50 31-8 46-23 50-50z';
    const spots = [
      [6, 18],
      [15, 64],
      [26, 86],
      [9, 46],
      [88, 20],
      [80, 62],
      [93, 78],
      [70, 12],
      [36, 10],
      [62, 88],
      [46, 94],
      [87, 28],
      [3, 74],
      [22, 32],
      [78, 36],
    ];
    spots.forEach((sp, i) => {
      const el = document.createElement('div');
      const kind = i % 4,
        sz = rand(16, 44);
      el.className = 'bread-bit';
      if (kind === 0) {
        el.classList.add('coin');
        el.style.background = coins[coinN++ % coins.length];
      } else if (kind === 1) {
        el.classList.add('tile');
        el.style.background = tiles[tileN++ % tiles.length];
        el.innerHTML = '<svg viewBox="0 0 100 100" fill="currentColor"><use href="#bread-mark"/></svg>';
      } else if (kind === 2) {
        el.classList.add('spark');
        el.innerHTML = `<svg viewBox="0 0 100 100" fill="currentColor"><path d="${sparkPath}"/></svg>`;
      } else {
        el.classList.add('chip');
        el.innerHTML = chips[chipN++ % chips.length];
      }
      if (!el.classList.contains('chip')) {
        el.style.width = sz + 'px';
        el.style.height = sz + 'px';
      }
      if (el.classList.contains('chip') && sp[0] > 50) el.style.right = 100 - sp[0] + '%';
      else el.style.left = sp[0] + '%';
      el.style.top = sp[1] + '%';
      el.style.setProperty('--dx', rand(-26, 26).toFixed(0) + 'px');
      el.style.setProperty('--dy', rand(-34, 34).toFixed(0) + 'px');
      el.style.setProperty('--r0', rand(-18, 18).toFixed(0) + 'deg');
      el.style.setProperty('--r1', rand(-30, 30).toFixed(0) + 'deg');
      el.style.animationDuration = rand(9, 17).toFixed(1) + 's';
      el.style.animationDelay = (-rand(0, 12)).toFixed(1) + 's';
      el.style.opacity = rand(0.55, 1).toFixed(2);
      confetti.appendChild(el);
    });
  })();

  if (existingSubmission) {
    showExistingTicket(existingSubmission);
  } else {
    say('Push the handle down');
  }

  function say(html) {
    if (status) status.innerHTML = html;
  }
})();

  //scroll
  (() => {
    'use strict';
  
    // Code to prevent the browser from restoring scroll position on reload,
    // which was causing ScrollTrigger to compute stale start/end offsets
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  
    const CONFIG = {
      heroSelector: '._w-hero',
      scaleTo: 0.9,
      opacityTo: 0,
      pinDistance: '+=80%',
      // Code for the breakpoint below which the stacking effect is disabled
      desktopMinWidth: '(min-width: 768px)',
    };
  
    const hero = document.querySelector(CONFIG.heroSelector);
    const nextSection = hero?.nextElementSibling;
    if (!hero || !nextSection) return;
  
    const mm = gsap.matchMedia();
  
    // Code to hold a reference to the active ScrollTrigger instance so the
    // ticket-active/ticket-done listeners outside matchMedia can pause/resume it
    let activeST = null;
  
    // Code to build the pin/scale/fade timeline only when the desktop media
    // query matches; matchMedia auto-reverts everything (kills the
    // ScrollTrigger, clears inline styles) when the query stops matching,
    // e.g. on resize/rotate across the breakpoint
    mm.add(CONFIG.desktopMinWidth, () => {
      const stackTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: '160% 160%',
          end: CONFIG.pinDistance,
          scrub: true,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });
  
      stackTimeline.to(hero, {
        scale: CONFIG.scaleTo,
        opacity: CONFIG.opacityTo,
        ease: 'none',
      });
  
      activeST = stackTimeline.scrollTrigger;
  
      // Code to re-measure the pin's start/end whenever the hero's own
      // height changes (ticket expanding/collapsing inside it), batched to
      // one ScrollTrigger.refresh() per animation frame
      let refreshQueued = false;
      const queueRefresh = () => {
        if (refreshQueued) return;
        refreshQueued = true;
        requestAnimationFrame(() => {
          refreshQueued = false;
          ScrollTrigger.refresh();
        });
      };
  
      let ro = null;
      if ('ResizeObserver' in window) {
        ro = new ResizeObserver(queueRefresh);
        ro.observe(hero);
      }
      window.addEventListener('load', queueRefresh);
  
      // Code to clean up the observer and the shared reference when matchMedia
      // reverts this context (i.e. viewport crosses back below the breakpoint)
      return () => {
        if (ro) ro.disconnect();
        activeST = null;
      };
    });
  
    // Code to disable the pin the instant the ticket opens, so the growing
    // ticket isn't fighting a pinned/scaling hero while it expands. No scroll
    // manipulation here — bread-widget.js owns scrolling the ticket into view,
    // and calling scrollTo from both scripts at once is what caused the
    // visible scroll-jump / layout shift on click.
    document.addEventListener('bread:ticket-active', () => {
      if (!activeST) return;
      activeST.disable(true);
    });
  
    // Code to recompute the pin's start/end and re-enable it only once the
    // ticket has actually finished expanding (bread-widget.js fires this after
    // its own max-height transition ends) — refreshing any earlier measures
    // the pre-expansion height and produces a second, conflicting refresh
    // moments later, which is what caused the jump.
    document.addEventListener('bread:ticket-expanded', () => {
      if (!activeST) return;
      void document.body.offsetHeight;
      ScrollTrigger.refresh();
      activeST.enable();
    });
  
    document.addEventListener('bread:ticket-done', () => {
      if (!activeST) return;
      // Code to force a reflow so the ticket's collapsed height is measured
      // correctly before refreshing trigger boundaries back to normal
      void document.body.offsetHeight;
      ScrollTrigger.refresh();
    });
  })();

// twitter


document.addEventListener('DOMContentLoaded', function () {
  const CONFIG = {
    buttonSelector: '.bread-btn.bread-btn-1',
    ticketSelector: '.bread-tk-no',
    shareTextTemplate: "Got my ticket for early access to Bread wallet on Miden mainnet🍞\n\n Self-custodial, with privacy baked in.\n\n",
    shareBaseUrl: 'https://www.miden.xyz/bread?utm_source=bread&utm_medium=x&utm_campaign=bread_brand_reveal&utm_content=share_button&ref=ticket',
    popupWidth: 550,
    popupHeight: 420
  };

  const btn = document.querySelector(CONFIG.buttonSelector);
  if (!btn) {
    console.error('Bread share button not found:', CONFIG.buttonSelector);
    return;
  }

  btn.addEventListener('click', function () {
    const ticketEl = document.querySelector(CONFIG.ticketSelector);
    if (!ticketEl) {
      console.error('Ticket number element not found:', CONFIG.ticketSelector);
      return;
    }

    const ticketNumber = ticketEl.textContent.replace(/\D/g, '').padStart(4, '0');
    const shareUrl = `${CONFIG.shareBaseUrl}${ticketNumber}`;
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(CONFIG.shareTextTemplate)}&url=${encodeURIComponent(shareUrl)}`;

    const left = (window.screen.width - CONFIG.popupWidth) / 2;
    const top = (window.screen.height - CONFIG.popupHeight) / 2;
    const features = `width=${CONFIG.popupWidth},height=${CONFIG.popupHeight},left=${left},top=${top},noopener,noreferrer`;

    window.open(intentUrl, 'bread_share_popup', features);
  });
});
