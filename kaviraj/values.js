
document.querySelectorAll(".values-content").forEach(el => {
  el.style.willChange = "transform, opacity, filter";
});

const panels = gsap.utils.toArray('.values-content');

// Scroll Snapping
ScrollTrigger.create({
  trigger: ".values",
  start: "top top",
  end: "+=" + window.innerHeight * (panels.length - 1), // better: in px
  snap: {
    snapTo: (progress) => {
      return Math.round(progress * (panels.length - 1)) / (panels.length - 1);
    },
    duration: 0.5,
    ease: "sine.out"
  },
  scrub: true
});


/*
panels.forEach((panel, i) => {
  const prev = panels[i - 1];
  if (!prev) return;

  // 🔒 Pin previous panel when current panel enters
  ScrollTrigger.create({
    trigger: panel,
    start: "top bottom",
    pin: prev,
    pinSpacing: false,
    scrub: true
  });

  // 🎞 Fade out previous panel
  gsap.fromTo(prev,
    {filter: "blur(0px)", scale: 1, opacity: 1},
    {
      filter: "blur(20px)",
      scale: 0.9, 
      opacity: 0,
      scrollTrigger: {
        trigger: panel,
        start: "0% 80%",
        end: "0% 60%",
        scrub: true,
        markers: true
      }
    }
  );
}); */