const tl = gsap.timeline({ repeat: -1 });

const headings = ["chain", "wallet", "token"];

// Get images by class, then filter
const lightImages = gsap.utils.toArray(".trails-hero-ui-image.light-image");
const darkImages = gsap.utils.toArray(".trails-hero-ui-image.dark-image");

gsap.set(".animated-stroke", {
  strokeDasharray: 108,
  strokeDashoffset: 108,
});

gsap.set(".trails-card-logo-container", { yPercent: 0 });

// Set initial states for all UI images
gsap.set(".trails-hero-ui-image", {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  opacity: 0,
  yPercent: 0,
});

// Show first image of each set (with correct position)
gsap.set([lightImages[0], darkImages[0]], { opacity: 1, yPercent: 0 });

document.querySelector(".trails-hexagon-wrap .u-h2").textContent = headings[0];

// Cycle 1 (first image already visible, no animation needed for it)
tl.to(".animated-stroke", {
  strokeDashoffset: 0,
  duration: 6,
  ease: "none",
})
  .to(".trails-card-logo-container", {
    yPercent: "-=33.33",
    duration: 0.5,
    ease: "power2.out",
  })
  .to(
    ".trails-hexagon-wrap .u-h2",
    {
      scrambleText: {
        text: headings[1],
        chars: "original",
        speed: 0.6,
      },
      duration: 0.5,
    },
    "<"
  )
  .to(
    [lightImages[0], darkImages[0]],
    {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    },
    "<"
  )
  .fromTo(
    [lightImages[1], darkImages[1]],
    { opacity: 0, yPercent: 20 },
    { opacity: 1, yPercent: 0, duration: 0.5, ease: "power2.out" },
    "<"
  )
  // Reset first image position for next loop (hidden, ready to animate in)
  .set([lightImages[0], darkImages[0]], { yPercent: 20 })
  .set(".animated-stroke", { strokeDashoffset: 108 })

  // Cycle 2
  .to(".animated-stroke", {
    strokeDashoffset: 0,
    duration: 6,
    ease: "none",
  })
  .to(".trails-card-logo-container", {
    yPercent: "-=33.33",
    duration: 0.5,
    ease: "power2.out",
  })
  .to(
    ".trails-hexagon-wrap .u-h2",
    {
      scrambleText: {
        text: headings[2],
        chars: "original",
        speed: 0.6,
      },
      duration: 0.5,
    },
    "<"
  )
  .to(
    [lightImages[1], darkImages[1]],
    {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    },
    "<"
  )
  .fromTo(
    [lightImages[2], darkImages[2]],
    { opacity: 0, yPercent: 20 },
    { opacity: 1, yPercent: 0, duration: 0.5, ease: "power2.out" },
    "<"
  )
  .set(".animated-stroke", { strokeDashoffset: 108 })

  // Cycle 3
  .to(".animated-stroke", {
    strokeDashoffset: 0,
    duration: 6,
    ease: "none",
  })
  .to(".trails-card-logo-container", {
    yPercent: "-=33.33",
    duration: 0.5,
    ease: "power2.out",
  })
  .to(
    ".trails-hexagon-wrap .u-h2",
    {
      scrambleText: {
        text: headings[0],
        chars: "original",
        speed: 0.6,
      },
      duration: 0.5,
    },
    "<"
  )
  .to(
    [lightImages[2], darkImages[2]],
    {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    },
    "<"
  )
  // Animate first image in (now it has yPercent: 20 from earlier set)
  .to(
    [lightImages[0], darkImages[0]],
    {
      opacity: 1,
      yPercent: 0,
      duration: 0.5,
      ease: "power2.out",
    },
    "<"
  )
  .set(".trails-card-logo-container", { yPercent: 0 })
  .set([lightImages[1], darkImages[1], lightImages[2], darkImages[2]], {
    opacity: 0,
    yPercent: 0,
  })
  .set(".animated-stroke", { strokeDashoffset: 108 });

document.addEventListener("DOMContentLoaded", () => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari) {
    const video = document.querySelector("#hero-video");
    video.src =
      "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/Asset_Trails_icon_SAFARI.mp4";
  }
});
