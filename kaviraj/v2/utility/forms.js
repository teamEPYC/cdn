
// ---------- FORM OPEN ---------- //
let activeForm = null;
let isAnimating = false;


document.querySelectorAll('[data-form="true"]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    if (isAnimating) return;

    const formType = trigger.getAttribute('data-form-type');

    let targetForm = '.k-contact-form-grandparent.contact';

    if (formType === 'institutional-broking') {
      targetForm = '.k-contact-form-grandparent.institutional-broking';
    } else if (formType === 'wealth-management') {
      targetForm = '.k-contact-form-grandparent.wealth-management';
    } else if (formType === 'mutual-fund') {
      targetForm = '.k-contact-form-grandparent.mututal-fund';
    } else if (formType === 'kaviraj-reserve') {
      targetForm = '.k-contact-form-grandparent.kaviraj-reserve';
    }

    activeForm = targetForm;
    isAnimating = true;

    const inputs = document.querySelectorAll(
      `${targetForm} input:not([type="submit"]), 
       ${targetForm} textarea, 
       ${targetForm} select`
    );

    const checkbox = document.querySelector(
      `${targetForm} .k-form-checkbox`
    );

    const submit = document.querySelector(
      `${targetForm} input[type="submit"]`
    );

    const tl = gsap.timeline({
      onComplete: () => (isAnimating = false)
    });

    tl.set('.k-form-wrapper', { display: 'flex' })
      .set(targetForm, { display: 'block' })
      .fromTo(
        targetForm,
        { opacity: 0, y: '0.2rem' },
        { opacity: 1, y: '0rem', duration: 0.7, ease: 'power3.out' }
      )
      // Inputs first
      .fromTo(
        inputs,
        { opacity: 0, y: '0.3rem' },
        {
          opacity: 1,
          y: '0rem',
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.05
        },
        '-=0.4'
      );

    // Checkbox at the "right moment"
    if (checkbox) {
      tl.fromTo(
        checkbox,
        { opacity: 0, y: '0.3rem' },
        { opacity: 1, y: '0rem', duration: 0.35, ease: 'power2.out' },
        '-=0.15'
      );
    }

    // Submit LAST
    if (submit) {
      tl.fromTo(
        submit,
        { opacity: 0, y: '0.3rem' },
        { opacity: 1, y: '0rem', duration: 0.35, ease: 'power2.out' },
        '-=0.1'
      );
    }
  });
});


// ---------- FORM CLOSE ---------- //
function closeForm() {
  if (!activeForm || isAnimating) return;

  isAnimating = true;

  gsap.timeline({
    onComplete: () => {
      activeForm = null;
      isAnimating = false;
    }
  })
    .to(activeForm, {
      opacity: 0,
      y: '0.2rem',
      duration: 0.4,
      ease: 'power2.in'
    })
    .set(activeForm, { display: 'none' })
    .set('.k-form-wrapper', { display: 'none' })
    .set('.k-contact-form-grandparent', { opacity: 0, y: '0rem' });
}


// ---------- CLOSE BUTTONS ----------
document.querySelectorAll('.k-form-close, .k-contact-form-closer, .k-form-close-button-mobile').forEach(btn => {
  btn.addEventListener('click', closeForm);
});


// ---------- ESC KEY SUPPORT ----------
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeForm();
  }
});
