gsap.fromTo(
    [
      ".hero-right-graphic-div-alt",
      ".hero-right-graphic-div",
      ".hero-right-graphic-img"
    ],
    { opacity: 0, scale: 0.7 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.02
    }
  );
