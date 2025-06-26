if (window.location.hostname === "www.theoryofnext.com") {
  console.log("this is Ideas Script");

  // ======================== CONFIGURATION ============================
  const marqueeClipMap = {
    "ai-section": "clip1",
    "fintech-section": "clip2",
    "deeptech-section": "clip3",
    "nec-section": "clip4",
    "climate-section": "clip5",
    "healthcare-section": "clip6",
    "saas-section": "clip7",
  };

  const themeImageClipMap = {
    "ai-section": "fin-theme-image",
    "fintech-section": "deeptech-theme-image",
    "deeptech-section": "nec-theme-image",
    "nec-section": "climate-theme-image",
    "climate-section": "healthcare-theme-image",
    "healthcare-section": "saas-theme-image",
  };

  // ========================= UTILITIES ============================
  function createClipUpdater(sectionClipMap, clipStrategy) {
    return () => {
      document.querySelectorAll("section").forEach((section) => {
        const clipId = sectionClipMap[section.id];
        if (!clipId) return;

        const clipElement = document.getElementById(clipId);
        if (!clipElement) {
          console.warn(`Missing clip element '${clipId}' for '${section.id}'`);
          return;
        }

        const sectionRect = section.getBoundingClientRect();
        const clipRect = clipElement.getBoundingClientRect();

        clipStrategy({ section, clipElement, sectionRect, clipRect });
      });
    };
  }

  // ========================== CLIPPING STRATEGIES ===========================
  function setupMarqueeClipUpdater() {
    const strategy = ({ sectionRect, clipElement }) => {
      if (sectionRect.bottom > 0 && sectionRect.top < window.innerHeight) {
        const top = (Math.max(0, sectionRect.top) / window.innerHeight) * 100;
        const bottom = Math.min(
          100,
          (sectionRect.bottom / window.innerHeight) * 100
        );
        clipElement.style.clipPath = `polygon(0% ${top}%, 100% ${top}%, 100% ${bottom}%, 0% ${bottom}%)`;
      } else {
        clipElement.style.clipPath = `polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)`;
      }
    };
    return createClipUpdater(marqueeClipMap, strategy);
  }

  function setupThemeImageClipUpdater() {
    const strategy = ({ sectionRect, clipElement, clipRect }) => {
      if (
        sectionRect.bottom >= clipRect.top &&
        sectionRect.top < clipRect.bottom
      ) {
        const progress = Math.min(
          1,
          Math.max(0, (clipRect.bottom - sectionRect.bottom) / clipRect.height)
        );
        const clipPercent = (1 - progress) * 100;
        clipElement.style.clipPath = `polygon(0% ${clipPercent}%, 100% ${clipPercent}%, 100% 100%, 0% 100%)`;
      } else {
        clipElement.style.clipPath = `polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)`;
      }
    };
    return createClipUpdater(themeImageClipMap, strategy);
  }

  // === CLIP COMBINATION TRIGGER ===
  function setupClipListeners() {
    const updateMarqueeClip = setupMarqueeClipUpdater();
    const updateThemeClip = setupThemeImageClipUpdater();

    const updateAllClips = () => {
      updateMarqueeClip();
      updateThemeClip();
    };

    ["scroll", "resize"].forEach((event) => {
      window.addEventListener(event, updateAllClips);
    });

    updateAllClips();
  }

  // === MARQUEE ===
  function setupMarquees() {
    const handleMarquee = (direction) => {
      const marquees = document.querySelectorAll(`[marquee='${direction}']`);
      marquees.forEach((marquee) => {
        const content = marquee.firstElementChild;
        if (!content) return;

        const clone = content.cloneNode(true);
        marquee.append(clone);

        const width = parseFloat(getComputedStyle(content).width) || 0;
        gsap.to(marquee.children, {
          x: "-50%",
          duration: 25 * (width / 2472.89),
          ease: "none",
          repeat: -1,
        });
      });
    };

    handleMarquee("front");
  }

  // === CARD SCROLL ANIMATION ===
  function setupIdeaCardScrollAnimations() {
    if (window.innerWidth > 991) {
      gsap.utils.toArray(".idea-card").forEach((card) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        tl.fromTo(
          card,
          {
            /*rotationZ: 20*/
          },
          {
            /*rotationZ: 0,*/ x: 0,
            duration: 1,
            ease: "none",
          }
        ).to(card, {
          /*rotationZ: -10,*/
          duration: 1,
          ease: "none",
          // delay: 1,
        });
      });
    }
  }

  // === STATIC GSAP TWEENS ===
  function setupInitialGSAPTweens() {
    gsap.to("#ai-theme-image", {
      opacity: 0,
      duration: 0.001,
      scrollTrigger: {
        trigger: "#ai-theme-container",
        start: "start start",
        toggleActions: "play none none reset",
      },
    });
  }

  // === THEME COLOR ATTRIBUTES ===
  function setupThemeColorVariables() {
    document.querySelectorAll("[data-theme-color]").forEach((el) => {
      const color = el.getAttribute("data-theme-color");
      if (color) {
        el.style.setProperty("--founder-theme-bg", color);
      } else {
        console.log("no data-theme-color found");
      }
    });
  }

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
  window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(Flip);
    initThemePopupHandler();
  });

  // function initThemeNavigation() {
  //   // 1. The ordered list of sections
  //   const sectionIds = [
  //     "ai-section",
  //     "fintech-section",
  //     "deeptech-section",
  //     "nec-section",
  //     "climate-section",
  //     "healthcare-section",
  //     "saas-section",
  //   ];

  //   // 2. A helper to find the current active section’s index
  //   function getActiveSectionIndex() {
  //     for (let i = 0; i < sectionIds.length; i++) {
  //       const section = document.getElementById(sectionIds[i]);
  //       if (section && section.classList.contains("active")) {
  //         return i;
  //       }
  //     }
  //     return -1; // or 0 if you'd rather default to the first in the list
  //   }

  //   // 3. A function to switch active classes and optionally scroll
  //   function switchSection(oldIndex, newIndex) {
  //     // Remove 'active' from the current
  //     const oldSection = document.getElementById(sectionIds[oldIndex]);
  //     if (oldSection) {
  //       oldSection.classList.remove("active");
  //     }

  //     // Add 'active' to the new one
  //     const newSection = document.getElementById(sectionIds[newIndex]);
  //     if (newSection) {
  //       newSection.classList.add("active");
  //       // Optional: scroll into view
  //       newSection.scrollIntoView({ behavior: "smooth" });
  //     }
  //   }

  //   // 4. Next button
  //   document.getElementById("next-theme-btn").addEventListener("click", () => {
  //     const currentIndex = getActiveSectionIndex();
  //     if (currentIndex === -1) return;

  //     // Move to next, wrap around if at the last section
  //     const nextIndex = (currentIndex + 1) % sectionIds.length;
  //     switchSection(currentIndex, nextIndex);
  //   });

  //   // 5. Previous button
  //   document.getElementById("prev-theme-btn").addEventListener("click", () => {
  //     const currentIndex = getActiveSectionIndex();
  //     if (currentIndex === -1) return;

  //     // Move to previous, wrap around if at the first section
  //     const prevIndex =
  //       (currentIndex - 1 + sectionIds.length) % sectionIds.length;
  //     switchSection(currentIndex, prevIndex);
  //   });
  // }

  function initThemeNavigation() {
    // The list of sections in the order we want to navigate
    const sectionIds = [
      "ai-section",
      "fintech-section",
      "deeptech-section",
      "nec-section",
      "climate-section",
      "healthcare-section",
      "saas-section",
    ];

    /**
     * Returns the index of whichever section has the largest
     * visible area in the current viewport.
     */
    function getCurrentSectionIndex() {
      let bestIndex = 0;
      let bestIntersection = 0;

      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i]);
        if (!el) continue;

        const rect = el.getBoundingClientRect();

        // Calculate how much of this section is visible in the viewport
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, window.innerHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight > bestIntersection) {
          bestIntersection = visibleHeight;
          bestIndex = i;
        }
      }

      return bestIndex;
    }

    /**
     * Smoothly scroll to the target section by index
     */
    function scrollToSection(index) {
      const targetId = sectionIds[index];
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }

    // NEXT button
    const nextBtn = document.getElementById("next-theme-btn");
    nextBtn.addEventListener("click", () => {
      const currentIndex = getCurrentSectionIndex();
      // increment index, wrap around if needed
      const nextIndex = (currentIndex + 1) % sectionIds.length;
      scrollToSection(nextIndex);
    });

    // PREVIOUS button
    const prevBtn = document.getElementById("prev-theme-btn");
    prevBtn.addEventListener("click", () => {
      const currentIndex = getCurrentSectionIndex();
      // decrement index, wrap around if needed
      const prevIndex =
        (currentIndex - 1 + sectionIds.length) % sectionIds.length;
      scrollToSection(prevIndex);
    });
  }

  // Initialize when the DOM is ready

  // === INIT ===
  function ideasInit() {
    gsap.registerPlugin(ScrollTrigger);
    setupClipListeners();
    setupMarquees();
    setupIdeaCardScrollAnimations();
    setupInitialGSAPTweens();
    setupThemeColorVariables();
    initThemeNavigation();
  }

  document.addEventListener("DOMContentLoaded", ideasInit);

  document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const themeImageClipOpenMap = {
      "ai-section": "fin-theme-image-clip",
      "fintech-section": "deeptech-theme-image-clip",
      "deeptech-section": "nec-theme-image-clip",
      "nec-section": "climate-theme-image-clip",
      "climate-section": "healthcare-theme-image-clip",
      "healthcare-section": "saas-theme-image-clip",
    };

    Object.entries(themeImageClipOpenMap).forEach(([sectionId, imageId]) => {
      const trigger = document.getElementById(sectionId);
      const image = document.getElementById(imageId);

      if (!trigger || !image) {
        console.warn(`Missing element for ${sectionId} or ${imageId}`);
        return;
      }

      // Set initial clipPath
      gsap.set(image, { clipPath: "inset(40% 40% 40% 40%)" });

      ScrollTrigger.create({
        trigger: trigger,
        start: "bottom 80%",
        end: "bottom -5%",
        scrub: true,

        onEnter: () => {
          // Hide all other images
          Object.values(themeImageClipOpenMap).forEach((id) => {
            if (id !== imageId) {
              const other = document.getElementById(id);
              if (other) {
                gsap.set(other, { clipPath: "inset(100% 100% 100% 100%)" });
              }
            }
          });
        },
        onUpdate: (self) => {
          const easedProgress = gsap.parseEase("none")(self.progress);
          const insetValue = 30 - 40 * easedProgress; // from 10% to 0%
          // console.log(insetValue);
          gsap.set(image, {
            clipPath: `inset(${insetValue}% ${insetValue}% ${insetValue}% ${insetValue}%)`,
            boxShadow: `0 0 0 2px white inset`,
          });
        },
      });
    });

    //______________________________For Share Popup____________________________________________________

    function initSharePostPopupToggle() {
      const triggers = document.querySelectorAll("[share-post='open']");
      const sharePopups = document.querySelectorAll(".share-popup");

      if (!triggers.length || !sharePopups.length) return;

      document.addEventListener("click", function (e) {
        const clickedTrigger = e.target.closest("[share-post='open']");
        const clickedInsidePopup = e.target.closest(".share-popup");

        // Close all popups if clicked outside
        if (!clickedTrigger && !clickedInsidePopup) {
          sharePopups.forEach((popup) => popup.classList.remove("is-open"));
          return;
        }

        if (clickedTrigger) {
          const popup = clickedTrigger
            .closest(".share-btn-wrapper")
            ?.querySelector(".share-popup");
          if (popup) {
            popup.classList.toggle("is-open");
          }
        }
      });
    }
    initSharePostPopupToggle();

    // document.addEventListener("DOMContentLoaded", () => {
    //   document.body.addEventListener("click", (e) => {
    //     // find the Share button you clicked
    //     const btn = e.target.closest("[share-post='open']");
    //     if (!btn) return;

    //     // find the popup *inside the same wrapper*
    //     const wrapper = btn.closest(".share-btn-wrapper");
    //     const popup = wrapper?.querySelector(".share-popup");
    //     if (!popup) return;

    //     popup.classList.toggle("is-open");
    //   });
    // });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const popupSelector = ".lock-popup";
    const overlaySelector = ".screen-lock-popup";
    const formSelector = "#wf-form-Lock-Screen-Popup";
    const successSelector = ".w-form-done";
    const submittedCookie = "form_submitted";
    const visitedCookie = "has_visited";

    // const delayTime = 10000; // 10s on first visit
    const delayTime = 0; // 10s on first visit

    // ── Cookie helpers ─────────────────────────────────
    function getCookie(name) {
      const m = document.cookie
        .split("; ")
        .find((r) => r.startsWith(name + "="));
      return m ? m.split("=")[1] : null;
    }
    function setCookie(name, value, days) {
      const e = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${value}; expires=${e}; path=/; SameSite=Lax`;
    }

    // ── Init default state ──────────────────────────────
    if (getCookie(submittedCookie) === null)
      setCookie(submittedCookie, "false", 365);

    // ── Scroll lock ─────────────────────────────────────
    const disableScroll = () => {
      console.log("lenis is stoped");
      lenis.stop(); // pause smooth scrolling
      ScrollTrigger.getAll().forEach((trigger) => trigger.disable()); // disable without killing
      document.body.style.overflow = "hidden";
    };

    // Enable scroll (Lenis + ScrollTrigger + body overflow)
    const enableScroll = () => {
      console.log("lenis is started");
      lenis.start(); // resume smooth scrolling
      ScrollTrigger.getAll().forEach((trigger) => trigger.enable());
      document.body.style.overflow = "";
    };

    // ── Show/hide popup ─────────────────────────────────
    const showPopup = () => {
      document.querySelector(overlaySelector).style.display = "flex";
      document.querySelector(popupSelector).style.display = "flex";
      disableScroll();
    };
    const hidePopup = () => {
      document.querySelector(overlaySelector).style.display = "none";
      document.querySelector(popupSelector).style.display = "none";
      enableScroll();
    };

    // ── Core logic ──────────────────────────────────────
    (function initPopupLogic() {
      if (getCookie(submittedCookie) === "true") {
        return hidePopup(); // never show again
      }
      if (getCookie(visitedCookie) === null) {
        setCookie(visitedCookie, "true", 365);
        setTimeout(showPopup, delayTime);
      } else {
        showPopup();
      }
    })();

    // ── Handle form submission ──────────────────────────
    const form = document.querySelector(formSelector);
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const poll = setInterval(() => {
          const done = document.querySelector(successSelector);
          if (done && done.offsetParent !== null) {
            setCookie(submittedCookie, "true", 365);
            hidePopup();
            clearInterval(poll);
          }
        }, 300);
      });
    }
  });

  // ________________________________________________Audio Handling script_________________________________________________

  function autioHandling() {
    const toggle = document.getElementById("music-toggle");
    const volIcon = toggle.querySelector(".volume-icon");
    const muteIcon = toggle.querySelector(".mute-icon");
    const audio = document.getElementById("siteBGM");
    let loaded = false; // ensure .load() runs once

    const show = (on) => {
      volIcon.classList.toggle("is-show", on);
      muteIcon.classList.toggle("is-show", !on);
    };

    const fade = (target, done) => {
      const step = 0.05 * (target > audio.volume ? 1 : -1);
      const tick = () => {
        audio.volume = +(audio.volume + step).toFixed(2);
        const reached =
          step > 0 ? audio.volume >= target : audio.volume <= target;
        reached ? done && done() : requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const play = () => {
      if (!loaded) {
        audio.load();
        loaded = true;
      }
      audio.play().catch(() => {}); // ignore autoplay block
      fade(1);
      localStorage.setItem("bgMusic", "on");
      show(true);
    };

    const stop = () => {
      fade(0, () => audio.pause());
      localStorage.setItem("bgMusic", "off");
      show(false);
    };

    toggle.addEventListener("click", () => (audio.paused ? play() : stop()));

    // Restore previous choice
    localStorage.getItem("bgMusic") === "on" ? play() : show(false);
  }
  autioHandling();

  // Call this after DOM is ready
  document.addEventListener("DOMContentLoaded", initCopyURLHandler);

  gsap.fromTo(
    "#clip7",
    {
      opacity: 1,
    },
    {
      opacity: 0,
      scrollTrigger: {
        trigger: "#footer",
        start: "top 80%",
        toggleActions: "play none none reverse", // fixed typo here
      },
    }
  );

  gsap.to("#nav-bg", {
    opacity: 0,
    duration: 0.001,
  });

  // ------------------------------------------------Coode for Social Share------------------------------------------------------

  window.Webflow ||= [];
  window.Webflow.push(() => {
    setTimeout(() => {
      const baseUrl = window.location.href.split("#")[0]; // Ensure no existing hash
      const elements = document.querySelectorAll(".idea-url");

      elements.forEach((el) => {
        const slug = el.getAttribute("data-slug-value");
        if (slug) {
          const fullUrl = `${baseUrl}#${slug}`;
          el.textContent = fullUrl;
          el.setAttribute("fs-socialshare-element", "url");
        }
      });

      console.log(
        `Updated ${elements.length} .idea-url element(s) with section URLs and added fs-socialshare-element="url".`
      );
    }, 100);
  });

  document.addEventListener("click", function (e) {
    const shareBtn = e.target.closest("[fs-socialshare-element]");
    if (!shareBtn) return;

    const platform = shareBtn.getAttribute("fs-socialshare-element");
    const ideaUrlEl = shareBtn
      .closest("*:has(.idea-url)")
      ?.querySelector(".idea-url");
    if (!ideaUrlEl) return;

    const shareUrl = ideaUrlEl.textContent.trim();
    if (!shareUrl) return;

    const encodedUrl = encodeURIComponent(shareUrl);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const fallbackDelay = 500;

    let appUrl = "";
    let webUrl = "";

    switch (platform) {
      case "twitter":
        appUrl = `twitter://post?message=${encodedUrl}`;
        webUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}`;
        break;
      case "facebook":
        appUrl = `fb://facewebmodal/f?href=https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        webUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "linkedin":
        // No universal deep link for LinkedIn; always fallback
        webUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      default:
        return;
    }

    if (isMobile && appUrl) {
      // Try to open the app
      window.location.href = appUrl;

      // Fallback to web intent if app isn't installed
      setTimeout(() => {
        window.open(webUrl, "_blank");
      }, fallbackDelay);
    } else {
      // Desktop or platform without deep link
      window.open(webUrl, "_blank");
    }
  });

  function initCopyURLHandler() {
    document.addEventListener("click", function (e) {
      const target = e.target.closest("[copy-url]");
      if (!target) return;

      const ideaUrlEl = target
        .closest("*:has(.idea-url)")
        ?.querySelector(".idea-url");
      if (!ideaUrlEl) return;

      const url = ideaUrlEl.textContent.trim();
      if (!url) return;

      navigator.clipboard
        .writeText(url)
        .then(() => {
          console.log("Copied idea URL to clipboard:", url);

          const feedbackEl = target
            .closest("*:has(.share-url-copied)")
            ?.querySelector(".share-url-copied");

          if (feedbackEl) {
            feedbackEl.style.transition =
              "opacity 200ms ease-in-out, transform 200ms ease-in-out";
            feedbackEl.style.opacity = "1";
            feedbackEl.style.transform = "translateY(0)";
            setTimeout(() => {
              feedbackEl.style.opacity = "0";
              feedbackEl.style.transform = "translateY(-10px)";
            }, 2000);
          }
        })
        .catch((err) => {
          console.error("Failed to copy URL:", err);
        });
    });
  }
}
