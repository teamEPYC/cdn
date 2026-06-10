window.addEventListener('load', () => {
  
function splitLines(target) {
  const split = SplitText.create(target, { type: 'lines', linesClass: 'line-wrap' });
  split.lines.forEach(line => {
    line.style.overflow      = 'hidden';
    line.style.paddingBottom = '0.15em';
    line.style.marginBottom  = '-0.15em';
    const inner = document.createElement('div');
    inner.innerHTML = line.innerHTML;
    line.innerHTML  = '';
    line.appendChild(inner);
    gsap.set(inner, { y: '100%' });
  });
  return split.lines.map(line => line.firstChild);
}

function startTypewriter() {
  const el = document.querySelector('.heading_rotate');
  const words = ['Institutional', 'Corporate'];
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

const lineInners       = splitLines('.heading');
const paginationInners = splitLines('.product-pagination-item');

gsap.set('.hero-content', { scaleY: 0, transformOrigin: 'center left', willChange: 'transform' });

const globetl = gsap.timeline({
  delay: 0.3,
  onStart:    () => ScrollTrigger.refresh(),
  onComplete: () => { ScrollTrigger.refresh(); startTypewriter(); }
});

globetl
  .to(grid1, { globeRevealScale: 1, duration: 0.8, ease: 'power2.out' })
  .to(grid1, { globeRevealX:     1, duration: 0.9, ease: 'power2.inOut' }, "+=0.2")
  .fromTo('.hero-content', { scaleY: 0 }, { scaleY: 1, duration: 1, ease: 'power2.out' }, "<+=0.5")
  .to(grid1, { plinthReveal:     1, duration: 1,   ease: 'power3.out' })
  .to(grid1, { arcReveal:        1, duration: 2.5, ease: 'power3.out' }, "<")
  .to(lineInners, { y: '0%', duration: 0.7, stagger: 0.15, ease: 'power3.out' }, "-=3")
  .fromTo('.hero-content .button', { rotateX: 90 }, { rotateX: 1, duration: 0.8, ease: 'power2.out' }, "<+=0.5")
  .fromTo('.nav', { y: '-100%' }, { y: '0%', duration: 0.7, ease: 'power2.out' }, "<+=1");

// heading-2 reveals
document.querySelectorAll('.heading-2').forEach(el => {
  const inners = splitLines(el);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    once: true,
    onEnter: () => gsap.to(inners, { y: '0%', duration: 0.7, stagger: 0.15, ease: 'power3.out' })
  });
});

// Pagination reveal
ScrollTrigger.create({
  trigger: '.product-pagination',
  start: 'top 70%',
  once: true,
  onEnter: () => gsap.to(paginationInners, { y: '0%', duration: 0.7, stagger: 0.1, ease: 'power3.out' })
});

// Globe Spin
const BASE_SPEED = 0.005;
ScrollTrigger.create({
  trigger: '.hero',
  start:   'bottom bottom',
  end:     'bottom top',
  onUpdate:    (self) => { grid1.GLOBE_SPEED = BASE_SPEED + Math.abs(self.getVelocity()) / 1000 * 0.06; },
  onLeave:     () => { grid1.GLOBE_SPEED = BASE_SPEED; },
  onLeaveBack: () => { grid1.GLOBE_SPEED = BASE_SPEED; },
});
    
// Product Tabs
const productInfos    = gsap.utils.toArray('.product-info');
const paginationItems = gsap.utils.toArray('.product-pagination-item');

productInfos.forEach((panel, i) => {
  ScrollTrigger.create({
    trigger: panel,
    start: 'top 60%',
    end: 'bottom 60%',
    onEnter: () => {
      paginationItems.forEach(item => item.classList.remove('active'));
      paginationItems[i].classList.add('active');
    },
    onEnterBack: () => {
      paginationItems.forEach(item => item.classList.remove('active'));
      paginationItems[i].classList.add('active');
    },
  });
});

// Gyro Reveal
const gyroTl = gsap.timeline({ paused: true });
gyroTl.to(grid2, { gyroScale: 1, duration: 0.8, ease: 'power2.out' })
      .to(grid2, { gyroReveal: 1, duration: 1.2, ease: 'power2.inOut' });

ScrollTrigger.create({
  trigger: '.product-info',
  start:   'top 50%',
  once:    true,
  onEnter: () => gyroTl.play()
});

// Rhombus Reveal
ScrollTrigger.create({
  trigger: '.trust-and-operations',
  start:   'top 50%',
  once:    true,
  onEnter: () => gsap.to(grid3, { revealProgress: 1, duration: 1.2, ease: 'power2.out' })
});

// Tap subitem reveal
document.querySelectorAll('.tap-subitem').forEach((item, i) => {
  const subhead  = item.querySelector('.subhead');
  const bodyText = item.querySelector('.body-text');
  const targets  = [
    ...(subhead  ? splitLines(subhead)  : []),
    ...(bodyText ? splitLines(bodyText) : [])
  ];
  if (!targets.length) return;
  ScrollTrigger.create({
    trigger: item,
    start: 'top 90%',
    once: true,
    onEnter: () => gsap.to(targets, { y: '0%', duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: i * 0.25 })
  });
});

// Footer left top nav
const footerNavItems = splitLines('.footer-left-top .nav-link');
ScrollTrigger.create({
  trigger: '.footer-left-top',
  start: 'top 70%',
  once: true,
  onEnter: () => gsap.to(footerNavItems, { y: '0%', duration: 0.7, stagger: 0.1, ease: 'power3.out' })
});

// Footer left bottom nav
const footerBottomNavItems = splitLines('.footer-left-bottom .nav-link');
ScrollTrigger.create({
  trigger: '.footer-left-bottom',
  start: 'top 90%',
  once: true,
  onEnter: () => gsap.to(footerBottomNavItems, { y: '0%', duration: 0.7, stagger: 0.1, ease: 'power3.out' })
});

// Footer content reveal
document.querySelectorAll('.footer-content-block').forEach(block => {
  const heading = block.querySelector('.heading-3');
  const button  = block.querySelector('.button');
  const inners  = heading ? splitLines(heading) : [];
  if (button) gsap.set(button, { opacity: 0 });
  ScrollTrigger.create({
    trigger: block,
    start: 'top 70%',
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      if (inners.length) tl.to(inners, { y: '0%', duration: 0.7, stagger: 0.15, ease: 'power3.out' });
      if (button) tl.fromTo(button, { opacity: 1, rotateX: 90 }, { opacity: 1, rotateX: 0, duration: 0.8, ease: 'power2.out' }, "-=0.3");
    }
  });
});

// Footer HR fade
gsap.to('.footer-wrapper .full-hr.topmain', {
  opacity: 0,
  scrollTrigger: {
    trigger: '.footer',
    start: 'top 10%',
    end: 'bottom 100%',
    scrub: true,
  }
});

});
