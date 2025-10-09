console.log("Buttons.js loaded")

/* =============================================
            Global buttons
================================================*/

/*
// For Changeing the Width of the buttons


document.querySelectorAll('[data-width]').forEach(el => {
  let w = el.getAttribute('data-width').trim();
  // if it's just a number (no px/rem/%) append "px"
  if (/^-?\d+(\.\d+)?$/.test(w)) {
    w += 'px';
  }
  // apply if non-empty
  if (w) {
    el.style.width = w;
  }
});

*/

// For changing the color of the buttons according to the color propertity in the component

/*================================================
                Primary Button
=================================================*/

// for changing the color of the button according to the property of the component
const buttons = document.querySelectorAll('[button-color]');

buttons.forEach(button => {
  const color = button.getAttribute('button-color');
  if (!color) return;

  const primaryButton = button.querySelector('.button-link');
  const arrow = button.querySelector('.button-icon-container.cc-hover');
  const content = button.querySelector('#button-content-hover')

  if (primaryButton) {
    primaryButton.style.backgroundColor = color;
    primaryButton.style.borderColor = color;

  }

  if (arrow) {
    arrow.style.color = color;
    arrow.style.fill = color; // handles SVGs if any inside
  }

});

// Icon Animation 

document.querySelectorAll('.button-link').forEach(link => {
  const iconIn = link.querySelector('.button-icon-container[data-hover="in"]');
  const iconOut = link.querySelector('.button-icon-container[data-hover="out"]');
  const text = link.querySelector('.button-text--primary');

  const displacement = iconIn.offsetWidth / 2;

  // Set initial states
  gsap.set(iconIn, { scale: 0 });
  gsap.set(iconOut, { scale: 1 });
  gsap.set(text, { x: -(displacement) });

  let hoverInTween, hoverOutTween;

  link.addEventListener('mouseenter', () => {
    if (hoverOutTween) hoverOutTween.kill();
    hoverInTween = gsap.timeline()
      .to(iconIn, { scale: 1, duration: 0.6, ease: 'expo.out' }, 0)
      .to(iconOut, { scale: 0, duration: 0.6, ease: 'expo.out' }, 0)
      .to(text, { x: displacement, duration: 0.6, ease: 'expo.out' }, 0);
  });

  link.addEventListener('mouseleave', () => {
    if (hoverInTween) hoverInTween.kill();
    hoverOutTween = gsap.timeline()
      .to(iconIn, { scale: 0, duration: 0.3, ease: 'expo.out' }, 0)
      .to(iconOut, { scale: 1, duration: 0.3, ease: 'expo.out' }, 0)
      .to(text, { x: -(displacement), duration: 0.3, ease: 'expo.out' }, 0);
  });
});

// gsap.utils.toArray(".button-link").forEach(button => {
//   const defArrow = button.querySelector(".button-icon-container:not(.cc-hover)");
//   const hovArrow = button.querySelector(".button-icon-container.cc-hover");

//   // set your initial sizes
//   gsap.set(defArrow, { width: 38, height: 38 });
//   gsap.set(hovArrow, { width: 0, height: 0 });

//   button.addEventListener("mouseenter", () => {
//     // cc-hover-in: shrink the default, grow the hover container
//     gsap.to(defArrow, { width: 0, height: 0, duration: 0.6, ease: "expo.out" });
//     gsap.to(hovArrow, { width: 38, height: 38, duration: 0.6, ease: "expo.out" });
//   });

//   button.addEventListener("mouseleave", () => {
//     // hover-out: reverse sizes, still using expo.out
//     gsap.to(defArrow, { width: 38, height: 38, duration: 0.4, ease: "expo.out" });
//     gsap.to(hovArrow, { width: 0, height: 0, duration: 0.4, ease: "expo.out" });
//   });
// });

/*================================================
                Secondary Button
=================================================*/

gsap.utils.toArray('[data-scale="true"]').forEach(button => {
  const buttonContent = button.querySelectorAll(".button-content");

  // Set initial position
  gsap.set(buttonContent, { y: 0 });

  // hover in
  button.addEventListener("mouseenter", () => {
    gsap.to(buttonContent, {
      y: "-100%",
      duration: 0.8,
      ease: "expo.out"
    });
  });

  // hover out
  button.addEventListener("mouseleave", () => {
    gsap.to(buttonContent, {
      y: "0%",
      duration: 0.5,
      ease: "expo.out"
    });
  });
});

// for changing the color of the button according to the property of the component
const secondaryButtonColor = document.querySelectorAll('.button-link--secondary');

buttons.forEach(button => {
  const color = button.getAttribute('button-color');
  if (!color) return;

  const content = button.querySelector('.button-content.cc-hover')

  if (content) {
    content.style.color = color;
    // arrow.style.fill = color; // handles SVGs if any inside

  }
});

/*================================================
                Teritory Button
=================================================*/

// Change button background based on a data attribute
document
  .querySelectorAll('.button-link--tertiary')
  .forEach(button => {
    // use the HTML5 data-* API
    const color = button.dataset.buttonColor; // reads data-button-color
    if (!color) return;
    button.style.backgroundColor = color;
  });
