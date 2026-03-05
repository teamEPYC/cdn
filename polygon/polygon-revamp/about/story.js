gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".about-story-card").forEach((card) => {
  gsap.from(card, {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
      end: "top 50%",
      toggleActions: "play none none none",
    },
  });
});

// Split all target elements
function initColorReveal() {
  const isDark = document.querySelector('[tr-color-mode="dark"].is-active');

  const greyColor = isDark ? "#a0a1a6" : "#888a91";
  const primaryColor = isDark ? "#f2f1f5" : "#07060d";

  document.querySelectorAll(".u-h4.text-indent").forEach((el) => {
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === el) st.kill();
    });

    const split = new SplitText(el, { type: "chars,words,lines" });

    gsap.set(split.chars, { color: greyColor });

    gsap.to(split.chars, {
      color: primaryColor,
      stagger: 0.05,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "80% 20%",
        scrub: 1,
      },
    });
  });
}

// Initial run
initColorReveal();

// Refresh on color mode toggle
document
  .querySelectorAll('[tr-color-mode="dark"], [tr-color-mode="light"]')
  .forEach((toggle) => {
    toggle.addEventListener("click", () => {
      setTimeout(initColorReveal, 50);
    });
  });
// Refresh on color mode toggle
document
  .querySelectorAll('[tr-color-mode="dark"], [tr-color-mode="light"]')
  .forEach((toggle) => {
    toggle.addEventListener("click", () => {
      // Small delay to let CSS variables update
      setTimeout(initColorReveal, 50);
    });
  });

//video check
if (isSafari) {
  const video = document.querySelector(".about-hero-bg-video video");
  video.src =
    "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/about us hero safari.mp4";
}

document.querySelectorAll(".h-hero-video.is-about video").forEach((video) => {
  if (isSafari) {
    video.src =
      "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/about icon chain.mp4";
  } else {
    video.src =
      "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/about icon chain.webm";
  }
  video.load(); // Reload the video with new source
});
