if (window.location.hostname !== "www.theoryofnext.com") {
  //things to laod on page load
  window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger, Flip, SplitText);
  });

  if (window.innerWidth > 1200) {
    window.addEventListener("resize", () => {
      window.location.replace(window.location.href);
    });
  }

  function reloadOnTabletOrientationChange() {
    const isTablet = () => {
      return (
        navigator.userAgent.match(/iPad|Android/) &&
        window.innerWidth >= 600 &&
        window.innerWidth <= 1200
      );
    };

    let lastOrientation =
      window.innerWidth > window.innerHeight ? "landscape" : "portrait";

    window.addEventListener("resize", () => {
      const currentOrientation =
        window.innerWidth > window.innerHeight ? "landscape" : "portrait";

      if (isTablet() && currentOrientation !== lastOrientation) {
        lastOrientation = currentOrientation;
        window.location.replace(window.location.href);
      }
    });
  }

  reloadOnTabletOrientationChange();

  window.addEventListener("load", () => {
    reloadOnTabletOrientationChange();
    initHoveringBtnAnimation();
    homeLottieAnimation();
    shrinkSectionOnScroll("#h-image-wrapper");
    initializethemesAnimation();
    initializethinkersAnimation();
    initThemePopupHandler();
    runMarquee();
    setupThinkerHover();
    insertEmptyDivs(
      "#thinkers-left-col",
      [3, 5, 12, 14, 20, 21, 27, 29, 36, 38, 44, 45, 51, 53, 60, 62, 65, 67]
    );
    insertEmptyDivs(
      "#thinkers-right-col",
      [2, 8, 9, 15, 17, 24, 26, 32, 33, 39, 41, 48, 50, 56, 57, 63, 65, 67],
      true
    );
  });

  //________________________________________Lottie Animation __________________________________________________________________

  //========================== Hero Section Animation [Start] ===============================================================================================================
  // const lottieURL =
  //   "https://teamepyc.github.io/cdn/Antler/antler-hero-lottie.json";
  function homeLottieAnimation() {
    /*** Element References ***/
    const elements = {
      heroSection: document.querySelector("#hero-section"),
      lottieContainer: document.querySelector("#hero-section .h-lottie"),
      heroBtn: document.querySelector("#hero-section .hero-btn"),
      shimmer: document.querySelector(".clipped-shape"),
    };

    // const animationData = await preloadJSON(
    //   "https://teamepyc.github.io/cdn/Antler/antler-hero-lottie.json"
    // );
    // const animationData = await preloadJSON(lottieURL);

    // Hero Section Nav bg remove
    gsap.fromTo(
      "#nav-bg",
      { opacity: 0 },
      {
        opacity: 1,
        ease: "power2.inOut",
        duration: 0.4,
        scrollTrigger: {
          trigger: "#themes-section",
          start: "top top",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Hero Section Timelines & Tweens
    gsap.to(["#hero-btn", "shimmer-element"], {
      opacity: 1,
      duration: 0.1,
    });

    gsap.fromTo(
      ".scroll-down-container",
      {
        opacity: 1,
      },
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#hero-section",
          start: "bottom 90%",
          toggleActions: "play none none reverse",
        },
      }
    );

    if (window.innerWidth > 991) {
      gsap.to(".scroll-down-arrow", {
        y: 8,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    if (window.innerWidth < 991) {
      gsap.to(".down-animating-arrow", {
        y: 8,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    /*** Lottie Animation Initialization ***/
    const lottieAnim = lottie.loadAnimation({
      container: elements.lottieContainer,
      renderer: "svg",
      loop: false,
      autoplay: false,
      // animationData,
      path: "https://teamepyc.github.io/cdn/Antler/antler-hero-lottie.json",
    });

    /*** GSAP Animation Functions ***/
    const initializeHeroAnimation = () => {
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: elements.heroSection,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: true,
          pinSpacing: false,
          toggleActions: "play none none none",
        },
      });

      heroTl.to(
        {},
        {
          duration: 1,
          onUpdate: () => {
            const progress = heroTl.progress();
            const easedProgress = gsap.utils.interpolate(
              0,
              1,
              gsap.parseEase("power2.out")(progress)
            );
            lottieAnim.goToAndStop(
              Math.round(easedProgress * lottieAnim.totalFrames),
              true
            );
            if (elements.heroBtn) {
              gsap.to(elements.shimmer, {
                opacity: easedProgress >= 0.3 ? 0 : 1,
                duration: 0.3,
              });
              gsap.to(elements.heroBtn, {
                scale: easedProgress >= 0.3 ? 0 : 1,
                duration: 0.3,
              });
            }
          },
        }
      );
    };

    /*** Lottie Event Listener ***/
    lottieAnim.addEventListener("data_ready", () => {
      initializeHeroAnimation();
    });

    // 1. Add 'active' class at bottom 85%
    ScrollTrigger.create({
      trigger: elements.heroSection,
      start: "bottom 65%",
      toggleActions: "play none none reverse",
      onEnter: () => {
        document.querySelector("#bg-color").classList.add("active");
      },
      onLeaveBack: () => {
        document.querySelector("#bg-color").classList.remove("active");
      },
    });

    if (window.innerWidth > 991) {
      // 2. Opacity animation at bottom 65%
      gsap.fromTo(
        "#bg-color",
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: elements.heroSection,
            start: "bottom 50%",
            toggleActions: "play none none reverse",
          },
          duration: 0.5,
        }
      );
    }
    if (window.innerWidth < 991) {
      // 2. Opacity animation at bottom 65%
      gsap.fromTo(
        "#bg-color",
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: elements.heroSection,
            start: "80% 95%",
            toggleActions: "play none none reverse",
          },
          duration: 0.001,
        }
      );
    }
  }

  // Home page mobile animatino

  function shrinkSectionOnScroll(sectionSelector) {
    if (window.innerWidth < 991) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionSelector, // Use the passed selector here for flexibility
          start: "bottom bottom", // When bottom of section hits bottom of viewport
          end: "bottom top", // Until bottom hits top
          scrub: true,
        },
      });
      tl.from(".lottie-hide-gradiant", {
        opacity: 0,
        duration: 0.1,
      });
      tl.fromTo(
        [sectionSelector, ".h-lottie-wrapper"],
        { minHeight: "100vh", zIndex: 50 },
        {
          minHeight: "0vh",
          zIndex: 50,
          ease: "none",
          duration: 1,
        },
        ">0.1" // slight offset to start after opacity
      );
    }
  }

  // This is Central Hover Btn Animation
  function initHoveringBtnAnimation() {
    if (window.innerWidth > 991) {
      const heroHoverBtntl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero-section",
          start: "top 10%",
          end: "bottom 90%",
          // markers: true,
          toggleActions: "play reverse play reverse",
        },
      });

      heroHoverBtntl.addLabel("btnOpen");

      heroHoverBtntl.fromTo(
        "#hero-hover-btn",
        {
          scale: 0,
          width: "0rem",
          height: "0rem",
          borderRadius: "50px",
        },
        {
          scale: 1,
          width: "3.3rem",
          height: "3.3rem",
          duration: 1,
          ease: "power2.out",
          borderRadius: "50px",
        },
        "btnOpen"
      );

      heroHoverBtntl.fromTo(
        "#hero-hover-btn .al-icon-wrapper",
        {
          scale: 0,
        },
        {
          scale: 1,
          duration: 1,
          ease: "power2.inOut",
        },
        "btnOpen+=0.3"
      );

      heroHoverBtntl.to("#hero-hover-btn", {
        borderRadius: "18px",
        width: "15rem",
        duration: 0.6,
      });

      heroHoverBtntl.to(
        "#hero-hover-btn .al-icon-wrapper",
        {
          right: "-5px",
        },
        {
          right: "5px",
          duration: 1,
          ease: "power2.out",
        },
        "<"
      );

      heroHoverBtntl.to(
        "#hero-hover-btn .al-icon-wrapper",
        {
          rotateZ: 360,
          duration: 1,
          delay: 0.8,
          ease: "power4.out",
        },
        ">"
      );

      heroHoverBtntl.fromTo(
        "#hero-hover-btn .at-arrow-icon",
        {
          // clipPath: "circle(0% at 50% 50%)", // starting as a tiny circle
          borderRadius: "50px",
        },
        {
          // clipPath: "circle(100% at 50% 50%)", // expands to full size
          borderRadius: "8px",
          ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
          duration: 0.8,
          delay: 1.25,
        },
        "btnOpen"
      );

      heroHoverBtntl.from(
        [
          "#hero-hover-btn .all-theme-btn-text",
          "#hero-hover-btn .themes-icon-wrapper",
        ],
        {
          scale: 0,
          ease: "back.out(0.5)",
          duration: 0.6,
        },
        "<0.3"
      );

      const themesHoverBtnTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#themes-section",
          start: "18% top",
          end: "bottom top",
          // markers: true,
          toggleActions: "play reverse play reverse",
        },
      });

      themesHoverBtnTl.addLabel("btnOpen");

      themesHoverBtnTl.fromTo(
        "#themes-hover-btn",
        {
          scale: 0,
          width: "0rem",
          height: "0rem",
          borderRadius: "50px",
        },
        {
          scale: 1,
          width: "3.3rem",
          height: "3.3rem",
          duration: 1,
          ease: "power2.out",
          borderRadius: "50px",
        },
        "btnOpen"
      );

      themesHoverBtnTl.fromTo(
        "#themes-hover-btn .al-icon-wrapper",
        {
          scale: 0,
        },
        {
          scale: 1,
          duration: 1,
          ease: "power2.inOut",
        },
        "btnOpen+=0.3"
      );

      themesHoverBtnTl.to("#themes-hover-btn", {
        borderRadius: "18px",
        width: "18rem",
        duration: 1,
      });

      themesHoverBtnTl.to(
        "#themes-hover-btn .al-icon-wrapper",
        {
          right: "-5px",
        },
        {
          right: "5px",
          duration: 1,
          ease: "power2.out",
        },
        "<"
      );

      themesHoverBtnTl.to(
        "#themes-hover-btn .al-icon-wrapper",
        {
          rotateZ: 360,
          duration: 1,
          delay: 0.8,
          ease: "power4.out",
        },
        ">"
      );

      themesHoverBtnTl.fromTo(
        "#themes-hover-btn .at-arrow-icon",
        {
          // clipPath: "circle(0% at 50% 50%)", // starting as a tiny circle
          borderRadius: "50px",
        },
        {
          // clipPath: "circle(100% at 50% 50%)", // expands to full size
          borderRadius: "8px",
          ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
          duration: 0.8,
          delay: 1.25,
        },
        "btnOpen"
      );

      themesHoverBtnTl.from(
        [
          "#themes-hover-btn .all-theme-btn-text",
          "#themes-hover-btn .themes-icon-wrapper",
        ],
        {
          scale: 0,
          ease: "back.out(0.5)",
          duration: 0.6,
        },
        "<0.3"
      );

      const finalCtaHoverBtnTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".section-final-cta",
          start: "top 40%",
          end: "bottom -200%",
          // markers: true,
          toggleActions: "play reverse play reverse",
        },
      });

      finalCtaHoverBtnTl.addLabel("btnOpen");

      finalCtaHoverBtnTl.fromTo(
        "#final-cta-2025-btn",
        {
          scale: 0,
          width: "0rem",
          height: "0rem",
          borderRadius: "50px",
        },
        {
          scale: 1,
          width: "3.3rem",
          height: "3.3rem",
          duration: 1,
          ease: "power2.out",
          borderRadius: "50px",
        },
        "btnOpen"
      );

      finalCtaHoverBtnTl.fromTo(
        "#final-cta-2025-btn .al-icon-wrapper",
        {
          scale: 0,
        },
        {
          scale: 1,
          duration: 1,
          ease: "power2.out",
        },
        "btnOpen+=0.3"
      );

      finalCtaHoverBtnTl.to("#final-cta-2025-btn", {
        borderRadius: "18px",
        width: "18rem",
        duration: 1,
      });

      finalCtaHoverBtnTl.to(
        "#final-cta-2025-btn .al-icon-wrapper",
        {
          right: "-5px",
        },
        {
          right: "5px",
          duration: 1,
          ease: "power2.out",
        },
        "<"
      );

      finalCtaHoverBtnTl.to(
        "#final-cta-2025-btn .al-icon-wrapper",
        {
          rotateZ: 360,
          duration: 1,
          delay: 0.8,
          ease: "power4.out",
        },
        ">"
      );

      finalCtaHoverBtnTl.fromTo(
        "#final-cta-2025-btn .at-arrow-icon",
        {
          // clipPath: "circle(0% at 50% 50%)", // starting as a tiny circle
          borderRadius: "50px",
        },
        {
          // clipPath: "circle(100% at 50% 50%)", // expands to full size
          borderRadius: "8px",
          ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
          duration: 0.8,
          delay: 1.25,
        },
        "btnOpen"
      );

      finalCtaHoverBtnTl.from(
        [
          "#final-cta-2025-btn .all-theme-btn-text",
          "#final-cta-2025-btn .themes-icon-wrapper",
        ],
        {
          scale: 0,
          ease: "back.out(0.5)",
          duration: 0.6,
        },
        "<0.3"
      );
    }
    if (window.innerWidth < 991) {
      gsap.to("#hero-hover-btn", {
        opacity: 0,
        display: "none",
        duration: 0.2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "bottom 95%",
          toggleActions: "play none none reset",
        },
      });
      gsap.from("#themes-hover-btn", {
        opacity: 0,
        display: "none",
        duration: 0.2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "bottom 95%",
          endTrigger: "#themes-section-m",
          end: "top 50%",
          toggleActions: "play none none reset",
        },
      });
    }
  }

  //================================================ Themes Section Animation [Start] ===============================================

  const initializethemesAnimation = () => {
    // Create the timeline and attach a reverse callback to remove hover interaction

    if (window.innerWidth > 991) {
      const vhToPx = window.innerHeight * (100 / 100);
      const themesTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".themes-intro-container",
          start: "top top",
          //end: "+=2000", // or some scrollable distance
          end: `+=${vhToPx}`,
          toggleActions: "play none none reverse",
          scrub: true,
          pin: true,
        },
      });

      themesTl.to(".themes-into_line-wrapper", {
        opacity: 1,
      });
      // Animate intro text
      themesTl.from(".themes-intro_line-container .word", {
        y: "110%",
        opacity: 0,
        rotationZ: 10,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      });

      // Animate the cards window coming in
      themesTl.from(
        ".themes-cards-window",
        {
          y: "20%",
          opacity: 0,
          rotationZ: 10,
          duration: 0.5,
          ease: "power2.out",
        },
        "<0.5"
      );

      // Fade out the intro container
      themesTl.to(".themes-intro_line-container", {
        autoAlpha: 0,
        duration: 0.1,
        ease: "power1.out",
      });

      // Animate each card growing in (for open effect)
      themesTl.from(
        ".themes-theme-card",
        {
          width: "5.4rem",
          duration: 1,
          ease: "power2.out",
        },
        "CardsUnfold"
      );

      themesTl.to(
        ".dont-click-here",
        {
          width: "0px",
          duration: 0.00001,
        },
        "CardsUnfold+=0.8"
      );

      themesTl.addLabel("CardsUnfold");

      // Animate the paragraph container
      themesTl.from(".themes-para-container", {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
      });

      // Animate cards into their final positions (cards opening fully)
      const positions = [12.5, 25, 37.5, 50, 62.5, 75, 87.5];
      positions.forEach((left, index) => {
        themesTl.to(
          `.themes-theme-card:nth-child(${index + 1})`,
          {
            left: `${left}%`,
            duration: 1,
          },
          "CardsUnfold"
        );
      });

      // Once all card animations are complete, enable the hover interaction.
      // This ensures hover setup happens only when the cards are fully open.
      themesTl.call(() => {
        setupHoverScrollAnimation({
          windowSelector: ".themes-cards-window",
          wrapperSelector: ".themes-cards-wrapper",
        });
      });
    }

    function setupHoverScrollAnimation({ windowSelector, wrapperSelector }) {
      const windowEl = document.querySelector(windowSelector);
      const wrapperEl = document.querySelector(wrapperSelector);

      if (!windowEl || !wrapperEl) return;

      let tween = null;

      windowEl.addEventListener("mousemove", (e) => {
        const bounds = windowEl.getBoundingClientRect();
        const cursorX = e.clientX - bounds.left;
        const windowWidth = bounds.width;
        const percentage = cursorX / windowWidth;

        const wrapperWidth = wrapperEl.offsetWidth;
        const minX = (wrapperWidth - windowWidth) / 2;
        const maxX = -(wrapperWidth - windowWidth) / 2;

        const targetX = gsap.utils.interpolate(minX, maxX, percentage);

        if (tween) tween.kill();
        tween = gsap.to(wrapperEl, {
          x: targetX,
          duration: 0.5,
          ease: "power4.out",
        });
      });

      windowEl.addEventListener("mouseleave", () => {
        if (tween) tween.kill();
        tween = gsap.to(wrapperEl, {
          x: 0,
          duration: 0.4,
          ease: "power4.out",
        });
      });
    }
  };

  //================================================ Themes Section Animation [End] ===================================================

  //================================================== Thinkers Section Animation =====================================================

  const initializethinkersAnimation = () => {
    applyThemeColorsFromDataAttribute();
    applyRandomGradientToThinkers();

    // const words = gsap.utils.toArray(".thinkers-intro-container .word");

    if (window.innerWidth > 991) {
      const thinkerTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".thinkers-section",
          start: "top top",
          end: "+=1500",
          scrub: true,
          toggleActions: "play none none reset",
        },
      });

      thinkerTl.from(".thinkers-intro-container .word", {
        y: "110%",
        opacity: 0,
        rotationZ: 10,
        duration: 1.5,
        ease: "power2.out",
        stagger: 0.1,
      });

      thinkerTl.from(
        ".thinkers-hovering-card",
        {
          y: "110%",
          opacity: "0",
          rotationZ: 10,
          ease: "power2.out",
        },
        "<0.5"
      );

      thinkerTl.to(".thinkers-intro-container .word", {
        opacity: 0,
        ease: "power2.out",
      });

      thinkerTl.to([".thinker-intor-window", ".thinkers-intro-container"], {
        width: 0,
      });

      thinkerTl.addLabel("cardGrowthStarts");

      if (window.innerWidth > 991) {
        thinkerTl.add(
          gsap.from(".thinkers-image-wrapper", {
            scale: 0,

            stagger: {
              // each: 0.1,
              amount: 1,
              from: "random",
              axis: "x",
            },
            ease: "power2.out",
          }),
          "cardGrowthStarts"
        );
      }

      thinkerTl.fromTo(
        ".thinkers-hovering-card",
        {
          width: "5rem",
          height: "5rem",
          padding: "3px",
          position: "absolute",
          top: "50%",
          left: "38.2%",
          xPercent: -50,
          yPercent: 0,
          overflow: "hidden",
        },
        {
          width: "20rem",
          height: "20rem",
          padding: "5px",
          position: "absolute",
          top: "0%",
          left: "50%",
          maxHeight: "auto",
          duration: 0.4,
          ease: "power2.out",
        },
        "cardGrowthStarts"
      );

      thinkerTl.to(
        ".thinkers-hovering-card",
        {
          height: "auto",
          duration: 0.6,
        },
        "cardGrowthStarts+=0.4"
      );
    }
  };

  // Assume GSAP and SplitText plugin are already loaded
  const elementsAnimate = document.querySelectorAll("[animate]");

  elementsAnimate.forEach((el) => {
    const split = new SplitText(el, {
      type: "lines, words, chars",
    });

    // Optional: add class to each split part like Splthinkersype does
    split.chars.forEach((char) => char.classList.add("char"));
    split.words.forEach((word) => word.classList.add("word"));
    split.lines.forEach((line) => line.classList.add("line"));
  });

  function insertEmptyDivs(containerId, positions, applyStyles = false) {
    const collectionList = document.querySelector(containerId);
    if (!collectionList) {
      console.warn(`${containerId} not found`);
      return;
    }

    positions.forEach((position) => {
      const targetElement = collectionList.children[position - 1];
      if (targetElement) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty-div");

        if (applyStyles) {
          emptyDiv.style.width = getComputedStyle(targetElement).width;
          emptyDiv.style.height = getComputedStyle(targetElement).height;
          emptyDiv.style.display = "inline-block";
          emptyDiv.style.visibility = "hidden";
        }

        collectionList.insertBefore(emptyDiv, targetElement);
      }
    });
  }

  function applyThemeColorsFromDataAttribute() {
    document.querySelectorAll("[data-theme-color]").forEach(function (el) {
      const color = el.getAttribute("data-theme-color");
      if (color) {
        el.style.setProperty("--founder-theme-bg", color);
      }
    });
  }

  function applyRandomGradientToThinkers() {
    const gradientPresets = {
      "morning-haze": "linear-gradient(to bottom, #F9F9F1 0%, #DEDEAB 100%)",
      "sky-drift": "linear-gradient(to bottom, #DEF6FC 0%, #97CFF2 100%)",
      "golden-glow": "linear-gradient(to bottom, #F8DA68 0%, #F6AB38 100%)",
      "crimson-fade": "linear-gradient(to bottom, #F18486 0%, #C91830 100%)",
      "ocean-calm": "linear-gradient(to bottom, #9DCDD2 0%, #4097A0 100%)",
    };

    const gradients = Object.values(gradientPresets);

    document.querySelectorAll(".thinkers-image-wrapper").forEach((el) => {
      const randomGradient =
        gradients[Math.floor(Math.random() * gradients.length)];
      el.style.background = randomGradient;
    });
  }

  function setupThinkerHover() {
    const items = document.querySelectorAll(".thinkers-image");

    items.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        const parentWrapper = item.closest(".thinkers-image-wrapper");
        const readBtn = document.querySelector("#read-btn");

        if (parentWrapper) {
          const parentBg = parentWrapper.style.background;

          if (window.innerWidth > 991) {
            const hoveringWrapper = document.querySelector(
              "#intro-image-wrapper"
            );
            if (hoveringWrapper) {
              hoveringWrapper.style.background = parentBg;
            }
          }
          if (window.innerWidth < 991) {
            const hoveringWrapper = document.querySelector(
              "#intro-image-wrapper-m"
            );
            if (hoveringWrapper) {
              hoveringWrapper.style.background = parentBg;
            }
          }

          const slug = item.getAttribute("idea-slug");
          if (slug) {
            parentWrapper.setAttribute("href", `/next100#${slug}`);
            if (readBtn) readBtn.setAttribute("href", `/next100#${slug}`);
          }
        }

        if (window.innerWidth > 991) {
          const imageSrc = item.getAttribute("src");
          const name = item.getAttribute("thinker-name");
          const idea = item.getAttribute("thinker-idea");
          const firstName = item.getAttribute("thinker-fn");
          const designation = item.getAttribute("thinker-des");
          const comName = item.getAttribute("com-name");

          const imageEl = document.querySelector("#thinker-image");
          const nameEl = document.querySelector("#thinker-name");
          const fnEl = document.querySelector("#thinker-fn");
          const ideaEl = document.querySelector("#thinker-idea");
          const desEl = document.querySelector("#thinker-des");
          const comNameEl = document.querySelector("#company-name");

          if (imageEl) imageEl.src = imageSrc;
          if (nameEl) nameEl.textContent = name;
          if (fnEl) fnEl.textContent = firstName;
          if (ideaEl) ideaEl.textContent = idea;
          if (desEl) desEl.textContent = designation;
          if (comName) comNameEl.textContent = comName;
        }
        if (window.innerWidth < 991) {
          const imageSrc = item.getAttribute("src");
          const name = item.getAttribute("thinker-name");
          const idea = item.getAttribute("thinker-idea");
          const firstName = item.getAttribute("thinker-fn");
          const designation = item.getAttribute("thinker-des");
          const comName = item.getAttribute("com-name");

          const imageEl = document.querySelector("#thinker-image-m");
          const nameEl = document.querySelector("#thinker-name-m");
          const fnEl = document.querySelector("#thinker-fn-m");
          const ideaEl = document.querySelector("#thinker-idea-m");
          const desEl = document.querySelector("#thinker-des-m");
          const comNameEl = document.querySelector("#company-name-m");

          if (imageEl) imageEl.src = imageSrc;
          if (nameEl) nameEl.textContent = name;
          if (fnEl) fnEl.textContent = firstName;
          if (ideaEl) ideaEl.textContent = idea;
          if (desEl) desEl.textContent = designation;
          if (comName) comNameEl.textContent = comName;
        }
      });
    });
  }

  function runMarquee() {
    document.querySelectorAll("[marquee]").forEach((el) => {
      const direction = el.getAttribute("marquee"); // "front" or "back"
      const parent = el.parentNode;
      const totalWidth = el.offsetWidth;
      const distance =
        direction === "front" ? `-=${totalWidth}` : `+=${totalWidth}`;

      gsap.timeline({ repeat: -1, ease: "none" }).to([el], {
        x: distance,
        duration: 80,
        ease: "none",
      });
    });
  }

  //======================== Thinkers Section Animation [End] =====================================================================================================================

  // ===================================== End finall CTA BG Animation ==========================================================================

  //====================================== General Page Functions [Starts] ======================================================================
  function initThemePopupHandler() {
    document.addEventListener("click", (e) => {
      const openTrigger = e.target.closest('[theme-popup="open"]');
      const closeTrigger = e.target.closest('[theme-popup="close"]');
      const popup = document.querySelector(".theme-popup-wrapper");
      if (!popup) return;

      if (openTrigger) {
        const state = Flip.getState(popup);

        popup.classList.add("is-open");

        Flip.from(state, {
          duration: 0.5,
          ease: "power2.out",
          absolute: true,
        });

        gsap.from;
      }

      if (closeTrigger) {
        const state = Flip.getState(popup);

        popup.classList.remove("is-open");

        Flip.from(state, {
          duration: 0.5,
          ease: "power2.inOut",
          absolute: true,
        });
      }
    });

    function setupHoverScrollAnimation() {
      if (window.innerWidth > 991) {
        const windowEl = document.querySelector(".hover-cards-window");
        const wrapperEl = document.querySelector(".hover-cards-wrapper");

        if (!windowEl || !wrapperEl) return;

        let tween = null;

        windowEl.addEventListener("mousemove", (e) => {
          const bounds = windowEl.getBoundingClientRect();
          const cursorX = e.clientX - bounds.left;
          const windowWidth = bounds.width;
          const percentage = cursorX / windowWidth;

          const wrapperWidth = wrapperEl.offsetWidth;
          const minX = (wrapperWidth - windowWidth) / 1.5;
          const maxX = -(wrapperWidth - windowWidth) / 1.5;

          const targetX = gsap.utils.interpolate(minX, maxX, percentage);

          if (tween) tween.kill();
          tween = gsap.to(wrapperEl, {
            x: targetX,
            duration: 0.5,
            ease: "power4.out",
          });
        });

        windowEl.addEventListener("mouseleave", () => {
          if (tween) tween.kill();
          tween = gsap.to(wrapperEl, {
            x: 0,
            duration: 0.4,
            ease: "power4.out",
          });
        });
      }
    }
    setupHoverScrollAnimation();
  }

  //=========================================== General Page Functions [Ends] =================================================================
}
