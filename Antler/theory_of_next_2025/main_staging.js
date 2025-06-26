if (window.location.hostname !== "www.theoryofnext.com") {
  document.addEventListener("DOMContentLoaded", () => {
    function init() {
      initializeOrbitAnimations();
      initShareThoughtsInteractions();
      initCopyURLHandler();
    }
    init();

    //===================================== Lenis Js ==========================================

    if (window.innerWidth > 991) {
      window.lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 0.7,
        gestureOrientation: "vertical",
        normalizeWheel: false,
        smoothTouch: false,
      });

      function raf(time) {
        window.lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      $("[data-lenis-start]").on("click", function () {
        window.lenis.start();
      });

      $("[data-lenis-stop]").on("click", function () {
        window.lenis.stop();
      });

      $("[data-lenis-toggle]").on("click", function () {
        $(this).toggleClass("stop-scroll");
        if ($(this).hasClass("stop-scroll")) {
          window.lenis.stop();
        } else {
          window.lenis.start();
        }
      });
    } else {
      // Ensure window.lenis is defined (even as dummy) for scripts that reference it
      window.lenis = {
        start: () => {},
        stop: () => {},
        raf: () => {},
      };
    }

    //============================================ Footer Submit Button ================================================

    const newSubmitButtons = document.querySelectorAll("[ms-code-submit-new]");
    newSubmitButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const submitId = this.getAttribute("ms-code-submit-new");
        const oldSubmitButton = document.querySelector(
          `[ms-code-submit-old="${submitId}"]`
        );

        if (oldSubmitButton) {
          oldSubmitButton.click();
        } else {
          console.error(
            `No matching old submit button found for ID: ${submitId}`
          );
        }
      });
    });

    // ========================================= Final CTA BG Animation ================================================
  });

  function initializeOrbitAnimations() {
    const selectors = [
      "#orbit-1",
      "#orbit-2",
      "#orbit-3",
      "#orbit-4",
      ".planet",
    ];

    const missing = selectors.filter(
      (selector) => !document.querySelector(selector)
    );

    if (missing.length) {
      return; // Abort animation setup
    }

    gsap.to("#orbit-1", {
      rotation: 360,
      duration: 16,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });

    gsap.to("#orbit-2", {
      rotation: -360,
      duration: 24,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });

    gsap.to("#orbit-3", {
      rotation: 360,
      duration: 32,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });

    gsap.to("#orbit-4", {
      rotation: 360,
      duration: 32,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });

    gsap.to(".planet", {
      rotation: 360,
      duration: 12,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });

    function positionPlanets(planets, radius) {
      planets.forEach((planet, i, arr) => {
        const angle = (i / arr.length) * 360;
        gsap.set(planet, {
          x: radius * Math.cos(angle * (Math.PI / 180)),
          y: radius * Math.sin(angle * (Math.PI / 180)),
        });
      });
    }
    const planetsOrbit1 = gsap.utils.toArray("#orbit-1 .planet");
    const planetsOrbit2 = gsap.utils.toArray("#orbit-2 .planet");
    const planetsOrbit3 = gsap.utils.toArray("#orbit-3 .planet");

    if (window.innerWidth > 991) {
      positionPlanets(planetsOrbit1, 250);
      positionPlanets(planetsOrbit2, 375);
      positionPlanets(planetsOrbit3, 500);
    }

    if (window.innerWidth < 991) {
      // Position planets dynamically
      positionPlanets(planetsOrbit1, 150);
      positionPlanets(planetsOrbit2, 225);
      positionPlanets(planetsOrbit3, 300);
    }
  }

  // ===================================== Whole Site Functions BG Animation ==================================

  /* ------------------------------------------- share‑thoughts popup --------------------------------------- */
  function initShareThoughtsInteractions() {
    const wrapper = document.querySelector(".share-hover-wrapper");
    const showIcon = document.querySelector(".share-show-icon");
    const hideIcon = document.querySelector(".hide-show-icon");
    const trigger = document.querySelector(".share-thoughts");
    const hoverTarget = document.querySelector(".share-btn-hover");

    if (!wrapper || !trigger || !hoverTarget) return;

    // Sync icons based on popup state
    const syncIcons = () => {
      const isOpen = wrapper.classList.contains("is-open");
      showIcon?.classList.toggle("is-hidden", isOpen);
      hideIcon?.classList.toggle("is-hidden", !isOpen);
    };
    ``;
    // Toggle popup on click
    document.addEventListener("click", (e) => {
      if (e.target.closest("[share-thoughts-popup]")) {
        wrapper.classList.toggle("is-open");
        hoverTarget.classList.toggle("is-open");
        syncIcons();
      }
    });

    // Initial state
    syncIcons();
  }

  // setupHoverToggle(".share-thoughts", ".share-btn-hover");

  function initCopyURLHandler() {
    document.addEventListener("click", function (e) {
      const target = e.target.closest("[copy-url]");
      if (!target) return;

      const url = window.location.href;
      navigator.clipboard
        .writeText(url)
        .then(() => {
          console.log("URL copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy URL:", err);
        });
    });
  }

  //========================================== Resources Code =================================================

  // original toggle behaviour
  let isOpen = false;

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".popup-category");
    if (!trigger) return;

    const popup = document.querySelector(".category-popup-wrapper");
    const icon = document.querySelector("#category-icon");

    isOpen = !isOpen;

    // Toggle popup visibility
    gsap.to(popup, {
      height: isOpen ? "auto" : 0,
      opacity: isOpen ? 1 : 0,
      duration: 0.3,
      ease: "power2.out",
      onStart: () => (popup.style.display = "block"),
      onComplete: () => {
        if (!isOpen) popup.style.display = "none";
      },
    });

    // Animate icon rotation
    gsap.to(icon, {
      rotate: isOpen ? -180 : 0,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  gsap.fromTo(
    ["#hero-hover-btn", "#themes-hover-btn", ".share-thoughts"],
    {
      opacity: 1,
    },
    {
      opacity: 0,
      scrollTrigger: {
        trigger: "#footer",
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    }
  );
  gsap.fromTo(
    ["#themes-hover-btn-m"],
    {
      opacity: 1,
    },
    {
      opacity: 0,
      scrollTrigger: {
        trigger: "#themes-section-m",
        start: "top top",
        toggleActions: "play none none reverse",
      },
    }
  );

  gsap.fromTo(
    [".scroll-down-block"],
    {
      opacity: 1,
    },
    {
      opacity: 0,
      scrollTrigger: {
        trigger: "#hero-section-m",
        start: "bottom 120%",
        toggleActions: "play none none reverse",
      },
    }
  );
}
