// This Code make page load only from the start,
// Remove this if the page need to load from anyplace other than start
// Function to scroll to top when page loads

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

function scrollToTop() {
  window.scrollTo(0, 0);
}

// Execute when DOM is fully loaded
document.addEventListener("DOMContentLoaded", scrollToTop);

// Alternative: Execute as soon as possible
//window.onload = scrollToTop;

// For single page applications, you can call this function
// whenever you navigate to a new "page"
function navigateToNewPage() {
  // Your navigation logic here

  // Then scroll to top
  scrollToTop();
}

document.addEventListener("DOMContentLoaded", () => {
  toggleScrolling("pause");

  const themeMarquee = (direction, delay = 0) => {
    const marquees = document.querySelectorAll(`[marquee='${direction}']`);
    if (!marquees.length) return;

    marquees.forEach((marquee) => {
      const marqueeContent = marquee.firstElementChild;
      if (!marqueeContent) return;

      // Clone and append the content
      const marqueeContentClone = marqueeContent.cloneNode(true);
      marquee.append(marqueeContentClone);

      // Get computed styles safely
      const computedStyles = getComputedStyle(marqueeContent);
      const width = parseFloat(computedStyles.getPropertyValue("width")) || 0;
      const gap =
        parseFloat(computedStyles.getPropertyValue("column-gap")) || 0;
      const distanceToTranslate =
        (direction === "front" ? 1 : -1) * 0.4 * (width + gap);
      gsap.to(marquee.children, {
        x: distanceToTranslate,
        duration: 30,
        ease: "none",
        repeat: -1,
        //delay: delay,
      });
    });
  };

  const handleMarquee = (direction, delay = 0) => {
    const marquees = document.querySelectorAll(`[marquee='${direction}']`);
    if (!marquees.length) return;

    marquees.forEach((marquee) => {
      const marqueeContent = marquee.firstElementChild;
      if (!marqueeContent) return;

      // Clone and append the content
      const marqueeContentClone = marqueeContent.cloneNode(true);
      marquee.append(marqueeContentClone);

      // Get computed styles safely
      const computedStyles = getComputedStyle(marqueeContent);
      const computedStylesParent = getComputedStyle(marquee);
      const width = parseFloat(computedStyles.getPropertyValue("width")) || 0;
      const gap = parseFloat(computedStylesParent.getPropertyValue("gap")) || 0;
      const distanceToTranslate =
        (direction === "front" ? 1 : -1) * 0.4 * (width + gap);
      gsap.to(marquee.children, {
        x: distanceToTranslate,
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    });
  };

  const marqueesBack = () => handleMarquee("back");
  const marqueesFront = () => handleMarquee("front");
  const marqueesCentral = () => handleMarquee("central", 1);

  marqueesBack();
  marqueesFront();

  let counter = {
    value: 1.0,
  };

  function updatePreloaderText() {
    let progress = counter.value.toFixed(1); // Round to 1 decimal place
    $("#counter-num").text(progress);
  }

  let heroTl = gsap.timeline();

  heroTl.fromTo(
    ".pl-text-wrapper",
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.4,
    }
  );

  //heroTl.pause();
  heroTl.to(counter, {
    onUpdate: updatePreloaderText,
    value: 2.5,
    duration: 2, //original duration
    ease: "power1.out",
  });

  heroTl.to(".pre-loader-text", {
    duration: 0.2,
    webkitTextStroke: "1px rgba(23, 30, 31, 0.1)",
    ease: "power2.out",
    color: "transparent",
  });

  heroTl.to(".pl-panel-2", {
    width: "100%",
    duration: 1,
    ease: "power1.out",
  });

  heroTl.to(".preloader", {
    visibility: "hidden",
    //duration: 1,
  });

  heroTl.from(
    ".pl-marquee-wrapper:not(:first-child)",
    {
      opacity: 0,
      stagger: {
        amount: 0.4,
        from: "center",
      },
    },
    "-=0.7"
  );

  heroTl.set(".pl-marquee-wrapper.is-central", {
    onComplete: marqueesCentral,
    //This fix is unexpected, but it's also solving another bug where the central line jumps back when initializing.
  });
  heroTl.call(() => {
    toggleScrolling("play");
    marqueesCentral();
    gsap.delayedCall(0.2, () => {}); // Ensure a function is passed
  });

  //new blossom animation
  heroTl.add("blossombox");
  heroTl.fromTo(
    ".hero-heading-text-wrapper.is-1st",
    { clipPath: "inset(0% 100% 0% 100%)" }, // Start fully collapsed from center
    {
      clipPath: "inset(0% 0% 0% 0%)", // Expand outward
      // ease: "power2.out",
      ease: "cubic - bezier(0.90, 0.00, 0.80, 1.00)",
      duration: 0.96,
    },
    "blossombox"
  );

  heroTl.fromTo(
    ".hero-heading-text-wrapper.is-2nd",
    { clipPath: "inset(0% 50% 0% 50%)" }, // Start fully collapsed from center
    {
      clipPath: "inset(0% 0% 0% 0%)", // Expand outward
      ease: "cubic-bezier(0.90, 0.00, 0.80, 1.00)",
      duration: 0.96,
    },
    "<+0.18"
  );

  heroTl.fromTo(
    [".hero-heading-text-wrapper.is-3rd"],
    { clipPath: "inset(0% 100% 0% 0%)" }, // Start fully collapsed from center
    {
      clipPath: "inset(0% 0% 0% 0%)", // Expand outward
      ease: "cubic - bezier(0.90, 0.00, 0.80, 1.00)",
      duration: 0.96,
    },
    "<+0.18"
  );

  heroTl.fromTo(
    ".hero-heading-text-wrapper.is-4th",
    { clipPath: "inset(0% 100% 0% 0%)" }, // Start fully collapsed from center
    {
      clipPath: "inset(0% 0% 0% 0%)", // Expand outward
      ease: "cubic - bezier(0.90, 0.00, 0.80, 1.00)",
      duration: 0.96,
    },
    "<+0.18" // Corrected position parameter
  );

  heroTl.fromTo(
    [".hero-heading-text-wrapper.is-5th"],
    { clipPath: "inset(0% 100% 0% 0%)" }, // Start fully collapsed from center
    {
      clipPath: "inset(0% 0% 0% 0%)", // Expand outward
      ease: "cubic - bezier(0.90, 0.00, 0.80, 1.00)",
      duration: 0.48,
    },
    "<+0.09"
  );

  heroTl.fromTo(
    ".hero-heading-text-wrapper.is-6th",
    { clipPath: "inset(0% 100% 0% 0%)" }, // Start fully collapsed from center
    {
      stagger: 0.5,
      clipPath: "inset(0% 0% 0% 0%)", // Expand outward
      ease: "cubic - bezier(0.90, 0.00, 0.80, 1.00)",
      duration: 0.48,
    },
    "<+0.09" // Corrected position parameter
  );

  heroTl.from(
    ["[hero-text='1']"],
    {
      y: "110%",
      opacity: 0,

      ease: "power1.inOut",
      stagger: 0.15,
    },
    "blossombox"
  );

  heroTl.from(
    ["[hero-text='2']"],
    {
      y: "110%",
      opacity: 0,
      ease: "power1.inOut",
      stagger: 0.15,
    },
    "<"
  );

  heroTl.from(
    [".logo", ".nav-link"],
    {
      scale: 0.5,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    },
    ">=-0.5"
  );

  heroTl.from(
    ["[hero-text='3']"],
    {
      y: "110%",
      opacity: 0,
      ease: "power1.inOut",
      stagger: 0.15,
    },
    "<0.2"
  );

  heroTl.add("imageStarts");

  heroTl.from(
    ["[hero-text='4']"],
    {
      y: "110%",
      opacity: 0,
      ease: "power1.inOut",
      stagger: 0.15,
    },
    "<0.5"
  );

  heroTl.from(
    "[hero-text='5']",
    {
      y: "110%",
      opacity: 0,
      duration: 0.5,
      ease: "power1.inOut",
      stagger: 0.15,
    },
    "<"
  );

  heroTl.from(
    "[hero-text='6']",
    {
      y: "110%",
      opacity: 0,
      duration: 0.5,
      ease: "power1.inOut",
      stagger: 0.15,
    },
    "<0.1"
  );

  heroTl.fromTo(
    ".hero-subheading-text-wrapper",
    { clipPath: "inset(0% 100% 0% 0%)" }, // Start fully collapsed from right
    {
      clipPath: "inset(0% 0% 0% 0%)", // Expand to full visibility
      stagger: 0.5,
      ease: "cubic - bezier(0.69, -0.01, 0.05, 0.99)",
      duration: 1, // Added a duration (you need this)
    },
    "<0.5" // Start at the same time as the previous animation
  );

  heroTl.fromTo(
    ".btn-hero-primary",
    {
      scale: 0,
    },
    {
      scale: 1,
      ease: "cubic-bezier(0.93, 0.00, 0.58, 1.00)",
      duration: 0.4,
    },
    "<0.6"
  );

  heroTl.fromTo(
    ".btn-hero-secondary",
    {
      scale: 0,
    },
    {
      scale: 1,
      ease: "cubic-bezier(0.69, -0.01, 0.05, 0.99)",
      duration: 0.4,
    },
    "<0.2"
  );

  heroTl.fromTo(
    ".hero-image-left",
    {
      scale: 0,
    },
    {
      scale: 1,
      duration: 0.5, // 1 second animation
      ease: "cubic - bezier(0.24, 0.00, 0.11, 1.00)", // Smooth deceleration
    },
    "imageStarts"
  );
  heroTl.fromTo(
    ".hero-image-right",
    { scale: 0 },
    { scale: 1, duration: 0.5, ease: "cubic - bezier(0.24, 0.00, 0.11, 1.00)" },
    "imageStarts+=0.24"
  ); //blossom 2

  function toggleScrolling(action) {
    if (action === "play") {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }
  }

  // Section 2 Animation
  gsap.to(".navigation", {
    duration: 0.2,
    scrollTrigger: {
      trigger: ".overlaping-sections",
      start: "top 20%", // Fixed incorrect syntax (was `start:top "20%"`)
      end: "top top",
      scrub: true,
      toggleActions: "play pause reverse none",
    },
  });

  gsap.to([".logo", ".nav-link"], {
    duration: 0.2,
    color: "#000000",
    borderColor: "#000000", // Use `borderColor` instead of `border`
    scrollTrigger: {
      trigger: ".ch-content-container", // Fixed trigger selector
      start: "top 10%",
      end: "top top",
      scrub: true,
      toggleActions: "play pause reverse none",
    },
  });

  if (window.innerWidth > 991) {
    gsap.matchMedia().add("(min-width: 992px)", () => {
      const container = document.querySelector(".tx-floating-text");
      const nodes = Array.from(container.childNodes);
      let newHTML = "";

      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/(\s+)/); // split by spaces, keep them
          words.forEach((word) => {
            if (word.trim() === "") {
              newHTML += word; // preserve spaces
            } else {
              const chars = [...word]
                .map((char) =>
                  char === " "
                    ? `<span class="char">&nbsp;</span>`
                    : `<span class="char">${char}</span>`
                )
                .join("");
              newHTML += `<span class="word">${chars}</span>`;
            }
          });
        } else if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.classList.contains("theme-text")
        ) {
          const words = node.textContent.split(/(\s+)/);
          const extraClasses = [...node.classList].join(" ");
          let spanHTML = "";

          words.forEach((word) => {
            if (word.trim() === "") {
              spanHTML += word;
            } else {
              const chars = [...word]
                .map((char) =>
                  char === " "
                    ? `<span class="char">&nbsp;</span>`
                    : `<span class="char">${char}</span>`
                )
                .join("");
              spanHTML += `<span class="word">${chars}</span>`;
            }
          });

          newHTML += `<span class="fill-bg-block ${extraClasses}">${spanHTML}</span>`;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          newHTML += node.outerHTML;
        }
      });

      container.innerHTML = `<div class="chunk-block">${newHTML}</div>`;

      const block = container.querySelector(".chunk-block");
      const chars = block.querySelectorAll(".char");
      const allChars = Array.from(chars);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: block,
          start: "top 70%",
          end: "bottom top",
          scrub: true,
        },
      });

      // Animate background size for highlighted spans
      block.querySelectorAll(".fill-bg-block").forEach((span) => {
        const spanChars = Array.from(span.querySelectorAll(".char"));
        const firstChar = spanChars[0];
        const index = allChars.indexOf(firstChar);
        const delay = index * 0.03;

        tl.fromTo(
          span,
          { backgroundSize: "0% 100%" },
          {
            backgroundSize: "100% 100%",
            duration: 1,
            ease: "none",
            onUpdate: function () {
              if (span.classList.contains("neon")) {
                const progress = this.progress(); // 'this' refers to the tween
                span.style.color = progress > 0.5 ? "#171e1f" : "#e2e2e0"; // dark gray or light gray
              }
            },
          },
          delay
        );
      });

      // Animate character opacity
      tl.to(
        chars,
        {
          opacity: 1,
          duration: 1,
          stagger: 0.03,
          ease: "none",
        },
        0
      );

      gsap.fromTo(
        ".domain-split-section",
        { clipPath: "inset(0% 50% 0% 50%)" }, // Start fully collapsed from center
        {
          clipPath: "inset(0% 0% 0% 0%)", // Expand outward
          ease: "power2.out",
          duration: 1,
          scrollTrigger: {
            trigger: ".overlaping-sticky-container",
            start: "top -85%", // When the sticky section reaches the top
            toggleActions: "play none none reverse",
          },
        }
      );
      // Section 3 Animation
      let dsTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".overlaping-sticky-container",
          start: "top -100%", // When the sticky section reaches the top
          end: "+=1000px",
          toggleActions: "play pause reverse none",
          scrub: 1, // Optional: smooth animation while scrolling
        },
      });
      dsTl.to(
        [".logo"],
        {
          duration: 0.2,
          color: "#000000",
          borderColor: "#000000", // Use `borderColor` instead of `border`
        },
        "<"
      );

      dsTl.fromTo(
        "#fin_ser-heading",
        { clipPath: "inset(0% 50% 0% 50%)" }, // Start fully collapsed from center
        {
          clipPath: "inset(0% 0% 0% 0%)", // Expand outward
          ease: "power2.out",
          stagger: 1.8, // Corrected stagger syntax
          duration: 1,
        }
      );

      // Split text into lines
      let finserPara = new SplitText("#finser-para", {
        type: "chars, words, lines",
        reduceWhiteSpace: false,
      });

      dsTl.from(
        finserPara.lines,
        {
          y: "110%",
          opacity: 0,
          rotationZ: 2,
          duration: 2,
          ease: "power1.out",
          stagger: 0.1,
        },
        "<0.5"
      );

      dsTl.from(
        "#fin_ser-logo",
        {
          y: -4,
          opacity: 0,
          stagger: 1,
          ease: "power2.out",
          duration: 1,
        },
        ">-0.2"
      );

      dsTl.fromTo(
        "#fintech-heading",
        { clipPath: "inset(0% 50% 0% 50%)" }, // Start fully collapsed from center
        {
          clipPath: "inset(0% 0% 0% 0%)", // Expand outward
          ease: "power2.out",
          delay: 1,
          duration: 1,
        }
      );

      // Split text into lines
      let fintechPara = new SplitText("#fintech-para", {
        type: "chars, words, lines",
        reduceWhiteSpace: false,
      });
      dsTl.from(
        fintechPara.lines,
        {
          y: "110%",
          opacity: 0,
          rotationZ: 2,
          duration: 0.5,
          ease: "power1.out",
          stagger: 0.1,
          duration: 2,
        },
        "<0.5"
      );

      dsTl.from(
        "#fintech-logo",
        {
          y: -4,
          opacity: 0,
          stagger: 1,
          ease: "power2.out",
          duration: 1,
        },
        ">-0.2"
      );

      // Function to update the footer year
      function updateFooterYear() {
        // Get the current year
        const currentYear = new Date().getFullYear();

        // Find the element with the ID "footer-year"
        const footerYearElement = document.getElementById("footer-year");
        // Update the element's content with the current year
        if (footerYearElement) {
          footerYearElement.textContent = currentYear;
        }
      }

      // Card Animation
      updateFooterYear();
      // Cards Section Animation
      const section = document.querySelector(".future-theme-scroll_container");
      const futureThemeCard = document.querySelector(
        ".future-theme-card-wrapper"
      );
      const ftCard = document.querySelectorAll(".ft-card");

      let futureBgTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".ft-bg-black", // Ensure this matches an element in your HTML
          start: "top -60%",
          end: "+=2900px", // add this in final version
          scrub: 1, // Using numeric value for scrub for smoother syncing with the scroll
        },
      });

      futureBgTl.fromTo(
        ".ft-bg-black",
        { clipPath: "inset(0% 50% 0% 50%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5 }
      );

      futureBgTl.to([".logo", ".nav-link"], {
        duration: 0.2,
        color: "#ffffff",
        borderColor: "#ffffff", // Use `borderColor` instead of `border`
      });
      // futureBgTl.to(
      //   ".nav-cta",
      //   {
      //     backgroundColor: "pink", // Corrected property name
      //   },
      //   "<"
      // );

      futureBgTl.fromTo(
        ".ft-bg-blue",
        { clipPath: "inset(50% 0% 50% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }
      );

      futureBgTl.fromTo(".ft-card", { scale: 0 }, { scale: 1 }, "<-0.1");
      futureBgTl.add("CardsUnfold", "<0.3");

      futureBgTl.to(
        ".ft-card.is-1st",
        { left: "5%", duration: 1.2 },
        "CardsUnfold"
      );
      futureBgTl.to(
        ".ft-card.is-2nd",
        { left: "15%", duration: 1.2 },
        "CardsUnfold"
      );
      futureBgTl.to(
        ".ft-card.is-3rd",
        { left: "25%", duration: 1.2 },
        "CardsUnfold"
      );
      futureBgTl.to(
        ".ft-card.is-4th",
        { left: "35%", duration: 1.2 },
        "CardsUnfold"
      );
      futureBgTl.to(
        ".ft-card.is-5th",
        { left: "45%", duration: 1.2 },
        "CardsUnfold"
      );
      futureBgTl.to(
        ".ft-card.is-6th",
        { left: "55%", duration: 1.2 },
        "CardsUnfold"
      );
      futureBgTl.to(
        ".ft-card.is-7th",
        { left: "65%", duration: 1.2 },
        "CardsUnfold"
      );
      futureBgTl.to(
        ".ft-card.is-8th",
        { left: "75%", duration: 1.2 },
        "CardsUnfold"
      );
      futureBgTl.to(
        ".ft-card.is-9th",
        { left: "85%", duration: 1.2 },
        "CardsUnfold"
      );
      futureBgTl.to(
        ".ft-card.is-10th",
        { left: "95%", duration: 1.2 },
        "CardsUnfold"
      );

      futureBgTl.fromTo(
        "[ft-text-container='left']",
        { clipPath: "inset(0% 0% 0% 100%)" },
        { clipPath: "inset(0% 0% 0% 0%)", stagger: 0.1 },
        "<0.3"
      );

      futureBgTl.fromTo(
        "[ft-animate-arrow]",
        { opacity: 0 },
        { opacity: 1 },
        "<"
      );

      futureBgTl.fromTo(
        "[ft-text-container='right']",
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", stagger: 0.1 },
        "<0.1"
      );

      futureBgTl.from(
        "[ft-animation]",
        {
          y: "110%",
          opacity: 0,
          duration: 0.5,
          ease: "power1.inOut",
          stagger: 0.15,
        },
        "<-0.3"
      );

      futureBgTl.set(".ft-bg-black", { backgroundColor: "#eaeaea" });

      futureBgTl.add("CardsFolding", "+=1.5");

      futureBgTl.to(
        ".ft-card.is-1st",
        { left: "75%", duration: 0.8 },
        "CardsFolding"
      );

      futureBgTl.to(
        ".ft-card.is-2nd",
        { left: "75%", duration: 0.8 },
        "CardsFolding"
      );

      futureBgTl.to(
        ".ft-card.is-3rd",
        { left: "75%", duration: 0.8 },
        "CardsFolding"
      );

      futureBgTl.to(
        ".ft-card.is-4th",
        { left: "75%", duration: 0.8 },
        "CardsFolding"
      );

      futureBgTl.to(
        ".ft-card.is-5th",
        { left: "75%", duration: 0.8 },
        "CardsFolding"
      );
      futureBgTl.to(
        ".ft-card.is-6th",
        { left: "75%", duration: 0.8 },
        "CardsFolding"
      );
      futureBgTl.to(
        ".ft-card.is-7th",
        { left: "75%", duration: 0.8 },
        "CardsFolding"
      );
      futureBgTl.to(
        ".ft-card.is-8th",
        { left: "75%", duration: 0.8 },
        "CardsFolding"
      );
      futureBgTl.to(
        ".ft-card.is-9th",
        { left: "75%", duration: 0.8 },
        "CardsFolding"
      );
      futureBgTl.to(
        ".ft-card.is-10th",
        { left: "75%", duration: 0.8 },
        "CardsFolding"
      );

      futureBgTl.to(
        ".future-theme-heading-wrapper",
        {
          opacity: 0,

          ease: "power2.out", // Corrected easing syntax
        },
        "CardsFolding"
      );

      futureBgTl.to(
        ".ft-bg-blue",
        {
          width: "50%",
          border: "10px solid #eaeaea",
          marginLeft: "Auto",
          duration: 0.8, // Adding duration for a smooth transition
          ease: "power2.out",
        },
        "-=0.5"
      );

      gsap.fromTo(
        ".story-timeline",
        {
          autoAlpha: 0, // Ensures both opacity & visibility are handled
        },
        {
          autoAlpha: 1, // Ensures both opacity & visibility are handled
          ease: "none",
          duration: 0.001,
          scrollTrigger: {
            trigger: ".story-timeline",
            start: "top top",
            end: "top top",
            toggleActions: "play none none reset",
            scrub: true,
          },
        }
      );

      // Function to handle enter animation
      function showScrollBtn() {
        gsap.fromTo(
          "#scroll-btn-content-hub",
          {
            opacity: 0,
            y: "100%",
          },
          {
            opacity: 1,
            y: 0,
            ease: "power2.inOut",
            duration: 0.6,
          }
        );
      }

      // Function to handle leave animation
      function hideScrollBtn() {
        gsap.to("#scroll-btn-content-hub", {
          opacity: 0,
          y: 0, // Use a numeric value for smoother animation
          ease: "power2.inOut",
          duration: 0.2,
        });
      }

      // ScrollTrigger setup
      ScrollTrigger.create({
        trigger: ".story-timeline",
        start: "top -50%",

        end: "bottom bottom",
        toggleActions: "play none none reverse",
        onEnter: showScrollBtn,
        onLeave: hideScrollBtn,
        onEnterBack: showScrollBtn,
        onLeaveBack: hideScrollBtn,
      });

      gsap.fromTo(
        "#scroll-btn-thesis",
        { opacity: 0, y: 0 },
        {
          opacity: 1,

          duration: 0.3, // Ensures smooth animation
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".content-hub",
            start: "top 10%", // Adjusted for better visibility
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".timeline-right-col",
        { backgroundColor: "#29AABE" },
        {
          backgroundColor: "#D4D4D4",
          duration: 0.001,
          scrollTrigger: {
            trigger: '[segment="1"]', // Ensure this exists
            start: "top 70%",
            end: "end 30%",
            toggleActions: "play none none reverse",
          },
        }
      );

      ScrollTrigger.create({
        trigger: '[segment="1"]', // Ensure this exists
        start: "top bottom",
        end: "end 30%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".timeline-right-col", {
            backgroundColor: "#D4D4D4",
            duration: 0.001,
          });
          gsap.to([".storyline-card-text", ".logo", ".nav-link"], {
            duration: 0.2,
            color: "#000000",
            borderColor: "#000000", // Use `borderColor` instead of `border`
          });
        },

        onLeaveBack: () => {
          gsap.to(".timeline-right-col", {
            backgroundColor: "#29AABE",
            duration: 0.001,
          });
          gsap.to([".storyline-card-text", ".logo", ".nav-link"], {
            duration: 0.2,
            color: "#ffffff",
            borderColor: "#ffffff", // Use `borderColor` instead of `border`
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="2"]', // Ensure this exists
        start: "top 60%",
        end: "end 30%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-1st", {
            autoAlpha: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#013C6D",
            duration: 0.001,
          });
          gsap.to([".storyline-card-text", ".nav-link"], {
            duration: 0.2,
            color: "#ffffff",
            borderColor: "#ffffff", // Use `borderColor` instead of `border`
          });
        },

        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-1st", {
            autoAlpha: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#D4D4D4",
            duration: 0.001,
          });
          gsap.to([".storyline-card-text", ".nav-link"], {
            duration: 0.2,
            color: "#000000",
            borderColor: "#000000", // Use `borderColor` instead of `border`
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="3"]', // Ensure this exists
        start: "top 60%",
        end: "end 30%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-2nd", {
            autoAlpha: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#CEE553",
            duration: 0.001,
          });
          gsap.to([".storyline-card-text", ".nav-link"], {
            duration: 0.2,
            color: "#000000",
            borderColor: "#000000", // Use `borderColor` instead of `border`
          });
        },

        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-2nd", {
            autoAlpha: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#013C6D",
            duration: 0.001,
          });
          gsap.to([".storyline-card-text", ".nav-link"], {
            duration: 0.2,
            color: "#ffffff",
            borderColor: "#ffffff", // Use `borderColor` instead of `border`
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="4"]', // Ensure this exists
        start: "top 70%",
        end: "end 30%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-3rd", {
            autoAlpha: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#000000",
            duration: 0.001,
          });
          gsap.to([".storyline-card-text", ".nav-link"], {
            duration: 0.2,
            color: "#ffffff",
            borderColor: "#ffffff", // Use `borderColor` instead of `border`
          });
        },
        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-3rd", {
            autoAlpha: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#CEE553",
            duration: 0.001,
          });
          gsap.to([".storyline-card-text", ".nav-link"], {
            duration: 0.2,
            color: "#000000",
            borderColor: "#000000", // Use `borderColor` instead of `border`
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="5"]', // Ensure this exists
        start: "top 70%",
        end: "end 30%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-4th", {
            autoAlpha: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#D4D4D4",
            duration: 0.001,
          });
          gsap.to([".storyline-card-text", ".nav-link"], {
            duration: 0.2,
            color: "#000000",
            borderColor: "#000000", // Use `borderColor` instead of `border`
          });
        },
        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-4th", {
            autoAlpha: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#000000",
            duration: 0.001,
          });
          gsap.to([".storyline-card-text", ".nav-link"], {
            duration: 0.2,
            color: "#ffffff",
            borderColor: "#ffffff", // Use `borderColor` instead of `border`
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="6"]', // Ensure this exists
        start: "top 70%",
        end: "end 30%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-5th", {
            autoAlpha: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#CEE553",
            duration: 0.001,
          });
        },
        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-5th", {
            autoAlpha: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#D4D4D4",
            duration: 0.001,
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="7"]', // Ensure this exists
        start: "top 70%",
        end: "end 30%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-6th", {
            autoAlpha: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#013C6D",
            duration: 0.001,
          });
          gsap.to([".storyline-card-text", ".nav-link"], {
            duration: 0.2,
            color: "#ffffff",
            borderColor: "#ffffff", // Use `borderColor` instead of `border`
          });
        },
        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-6th", {
            autoAlpha: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#CEE553",
            duration: 0.001,
          });
          gsap.to([".storyline-card-text", ".nav-link"], {
            duration: 0.2,
            color: "#000000",
            borderColor: "#000000", // Use `borderColor` instead of `border`
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="8"]', // Ensure this exists
        start: "top 70%",
        end: "end 30%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          toggleReportText();
          gsap.to(".story-card-wrapper.is-7th", {
            autoAlpha: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#000000",
            duration: 0.001,
          });
          gsap.to([".nav-link"], {
            duration: 0.2,
            color: "#ffffff",
            borderColor: "#ffffff", // Use `borderColor` instead of `border`
          });
        },
        onLeaveBack: () => {
          toggleReportText();
          gsap.to(".story-card-wrapper.is-7th", {
            autoAlpha: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#013C6D",
            duration: 0.001,
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="9"]', // Ensure this exists
        start: "top 70%",
        end: "end 30%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          toggleReportText();
          gsap.to(".story-card-wrapper.is-8th", {
            autoAlpha: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#29AABE",
            duration: 0.001,
          });
        },
        onLeaveBack: () => {
          toggleReportText();
          gsap.to(".story-card-wrapper.is-8th", {
            autoAlpha: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#000000",
            duration: 0.001,
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="10"]', // Ensure this exists
        start: "top 70%",
        end: "end 30%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          toggleReportText();
          gsap.to(".story-card-wrapper.is-9th", {
            autoAlpha: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#013C6D",
            duration: 0.001,
          });
        },

        onLeaveBack: () => {
          toggleReportText();
          gsap.to(".story-card-wrapper.is-9th", {
            autoAlpha: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#29AABE",
            duration: 0.001,
          });
        },
      });

      gsap.to([".nav-link"], {
        duration: 0.2,
        color: "#000000",
        scrollTrigger: {
          trigger: "#sec-content-hub",
          start: "top 10%",
          toggleActions: "play none none reverse", // Added smooth play/reverse behavior
        },
      });

      gsap.fromTo(
        ".story-card-image",
        { scale: 0.5 },
        {
          scale: 1,
          duration: 0.8, // Ensures smooth animation
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".story-timeline",
            start: "top top",
            end: "+=500px",
            toggleActions: "play none none reverse",
            scrub: true,
          },
        }
      );

      // Select all paragraphs to be split
      document.querySelectorAll(".storyline-segment-text").forEach((el) => {
        let wrappedHTML = el.innerHTML.replace(
          /(<span class="theme-text.*?<\/span>)/g,
          "%%$1%%"
        );

        el.innerHTML = wrappedHTML
          .split("%%")
          .map(
            (segment) =>
              segment.includes('<span class="theme-text')
                ? segment // Keep theme-text spans unchanged
                : `<span class="split-wrapper">${segment}</span>` // Wrap only other text
          )
          .join("");

        // Apply SplitText only to the wrapped text, leaving theme-text spans untouched
        let storySplit = new SplitText(el.querySelectorAll(".split-wrapper"), {
          type: "chars, words",
        });

        // Re-merge SplitText lines to prevent breaking spans into new lines
        storySplit.lines.forEach((line) => {
          let spanContainer = document.createElement("span");
          spanContainer.classList.add("split-line");
          line.childNodes.forEach((child) => spanContainer.appendChild(child));
          line.replaceWith(spanContainer);
        });
      });

      const storyElements = document.querySelectorAll(
        ".storyline-segment-text, .storyline-spine"
      );

      // Create the animation for each element
      gsap.utils.toArray(storyElements).forEach((element) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            clipPath: "inset(0% 100% 0% 0%)", // Initially clipped from right
          },
          {
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%", // Start animation when element is 70% into viewport
              end: "top 20%", // End animation when element is 35% into viewport
              toggleActions: "play none none reverse", // Play on enter, reverse on leave back
              onEnter: () =>
                gsap.fromTo(
                  element,
                  {
                    clipPath: "inset(0% 100% 0% 0%)",
                    opacity: 0,
                  },
                  {
                    clipPath: "inset(0% 0% 0% 0%)",
                    opacity: 1,
                    duration: 0.2,
                  }
                ),
              onLeave: () =>
                gsap.to(element, {
                  opacity: 0,
                  duration: 0.2,
                }),
              onEnterBack: () =>
                gsap.fromTo(
                  element,
                  {
                    clipPath: "inset(0% 100% 0% 0%)",
                    opacity: 0,
                  },
                  {
                    clipPath: "inset(0% 0% 0% 0%)",
                    opacity: 1,
                    duration: 0.2,
                  }
                ),
              onLeaveBack: () =>
                gsap.to(element, {
                  opacity: 0,
                  duration: 0.2,
                }),
            },
          }
        );
      });
    });
  } else if (window.innerWidth < 991) {
    // Your code here
    const storyElements = document.querySelectorAll(
      ".storyline-segment-text, .storyline-spine"
    );

    gsap.matchMedia().add("(max-width: 992px)", () => {
      gsap.utils.toArray(storyElements).forEach((element) => {
        gsap.fromTo(
          element,
          {
            opacity: 1,
            clipPath: "inset(0% 100% 0% 0%)",
          },
          {
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top bottom", // Start animation when element is 70% into viewport
              end: "end top", // End animation when element is 35% into viewport
              toggleActions: "play none none reverse", // Play on enter, reverse on leave back
              onEnter: () =>
                gsap.to(element, {
                  clipPath: "inset(0% 0% 0% 0%)",
                  opacity: 1,
                  duration: 0.2,
                }),
              onLeave: () =>
                gsap.to(element, {
                  opacity: 0,
                  duration: 0.2,
                }),
              onEnterBack: () =>
                gsap.to(element, {
                  clipPath: "inset(0% 0% 0% 0%)",
                  opacity: 1,
                  duration: 0.2,
                }),
              onLeaveBack: () =>
                gsap.to(element, {
                  opacity: 0,
                  duration: 0.2,
                }),
            },
          }
        );
      });

      ScrollTrigger.create({
        trigger: '[segment="1"]', // Ensure this exists
        start: "top top",
        end: "end 60%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".timeline-right-col", {
            backgroundColor: "#D4D4D4",
            duration: 0.001,
          });
        },
        onLeaveBack: () => {
          gsap.to(".timeline-right-col", {
            backgroundColor: "#29AABE",
            duration: 0.001,
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="2"]', // Ensure this exists
        start: "center 75%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-1st", {
            opacity: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#013C6D",
            duration: 0.001,
          });
        },
        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-1st", {
            opacity: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#D4D4D4",
            duration: 0.001,
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="3"]', // Ensure this exists
        start: "center 75%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-2nd", {
            opacity: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#CEE553",
            duration: 0.001,
          });
        },
        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-2nd", {
            opacity: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#013C6D",
            duration: 0.001,
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="4"]', // Ensure this exists
        start: "center 75%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-3rd", {
            opacity: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#000000",
            duration: 0.001,
          });
        },
        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-3rd", {
            opacity: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#CEE553",
            duration: 0.001,
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="5"]', // Ensure this exists
        start: "center 75%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-4th", {
            opacity: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#D4D4D4",
            duration: 0.001,
          });
        },
        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-4th", {
            opacity: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#000000",
            duration: 0.001,
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="6"]', // Ensure this exists
        start: "center 75%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-5th", {
            opacity: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#CEE553",
            duration: 0.001,
          });
        },
        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-5th", {
            opacity: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#D4D4D4",
            duration: 0.001,
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="7"]', // Ensure this exists
        start: "center 75%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-6th", {
            opacity: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#013C6D",
            duration: 0.001,
          });
        },
        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-6th", {
            opacity: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#CEE553",
            duration: 0.001,
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="8"]', // Ensure this exists
        start: "center 75%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-7th", {
            opacity: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#000000",
            duration: 0.001,
          });
        },
        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-7th", {
            opacity: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#013C6D",
            duration: 0.001,
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="9"]', // Ensure this exists
        start: "center 75%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-8th", {
            opacity: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#29AABE",
            duration: 0.001,
          });
        },
        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-8th", {
            opacity: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#000000",
            duration: 0.001,
          });
        },
      });

      ScrollTrigger.create({
        trigger: '[segment="10"]', // Ensure this exists
        start: "center 75%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(".story-card-wrapper.is-9th", {
            opacity: 0,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#013C6D",
            duration: 0.001,
          });
        },
        onLeaveBack: () => {
          gsap.to(".story-card-wrapper.is-9th", {
            opacity: 1,
            duration: 0.001,
          });
          gsap.to(".timeline-right-col", {
            backgroundColor: "#29AABE",
            duration: 0.001,
          });
        },
      });
    });
  }

  // Run on window resize
  // window.addEventListener("resize", checkScreenSize);

  // Remove card animation
  // Get all elements with the class "story-card-wrapper"
  const storyCards = document.querySelectorAll(".story-card-wrapper");

  // Function to update z-index based on opacity
  function updateZIndex() {
    storyCards.forEach((card) => {
      // Get the computed style to check the current opacity
      const cardStyle = window.getComputedStyle(card);
      const opacity = parseFloat(cardStyle.opacity);

      // Set z-index to -1 if opacity is not 1
      if (opacity !== 1) {
        card.style.zIndex = "-1";
      } else {
        // Optional: reset z-index for cards with opacity 1
        card.style.zIndex = "auto";
      }
    });
  }

  // Run initially
  updateZIndex();

  // Optional: Add a MutationObserver to watch for opacity changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        (mutation.attributeName === "style" ||
          mutation.attributeName === "class")
      ) {
        updateZIndex();
      }
    });
  });

  // Start observing each card for changes
  storyCards.forEach((card) => {
    observer.observe(card, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  });

  document.querySelectorAll(".timeline-stamp").forEach((element) => {
    element.addEventListener("click", function (event) {
      event.preventDefault(); // Stops the default link behavior
    });
  });

  // All scrollTo Links
  // Function to convert offset value from px, vh, or rem to pixels
  function convertOffsetToPixels(offset) {
    if (!offset) return 0; // Default offset

    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );

    if (offset.includes("vh")) {
      return (parseFloat(offset) / 100) * window.innerHeight;
    } else if (offset.includes("rem")) {
      return parseFloat(offset) * rootFontSize;
    } else if (offset.includes("px")) {
      return parseFloat(offset); // Allow decimal px values
    } else {
      console.warn(`Unsupported offset unit: ${offset}`);
      return 0; // Fallback to 0 if an unknown unit is passed
    }
  }

  // Function to smoothly scroll to a target element with an offset
  function smoothScroll(targetId, offsetTop = 0) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      console.warn(`smoothScroll: Target element #${targetId} not found.`);
      return;
    }

    const targetPosition =
      targetElement.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: targetPosition - offsetTop,
      behavior: "smooth",
    });
  }

  // Function to initialize scrolling for all elements with [scrollTo] attribute
  function initializeScrollToAttributes() {
    document.querySelectorAll("[scroll-to]").forEach((element) => {
      element.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default anchor behavior (if inside an <a> tag)
        const targetId = this.getAttribute("scroll-to");
        const offsetValue = this.getAttribute("scroll-offset") || "0px"; // Default offset to "0px"
        const offsetTop = convertOffsetToPixels(offsetValue); // Convert offset to pixels

        smoothScroll(targetId, offsetTop);
      });
    });
  }

  initializeScrollToAttributes();

  function toggleReportText() {
    const element = document.querySelector(".storyline-card-text");

    if (!element) {
      console.warn("Element not found");
      return;
    }
    const currentText = element.innerText.trim().toUpperCase();

    if (currentText === "CLICK TO VIEW FULL REPORT") {
      element.innerText = "COMING SOON";
    } else if (currentText === "COMING SOON") {
      element.innerText = "CLICK TO VIEW FULL REPORT";
    } else {
      console.warn("Unexpected text content:", currentText);
    }
  }

  gsap.to(".scroll-down-lottie", {
    opacity: 0,
    duration: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#sec-content-hub",
      start: "top top",
      toggleActions: "play none none reset",
    },
  });
});
