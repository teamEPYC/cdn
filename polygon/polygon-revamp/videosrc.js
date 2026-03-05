const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const videoUrl = isSafari
  ? "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/Asset_wireChain_SAFARI (1).mp4"
  : "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/Asset_wireChain_CHROME (1).webm";

// Preload the video
const link = document.createElement("link");
link.rel = "preload";
link.as = "video";
link.href = videoUrl;
link.type = isSafari ? "video/mp4" : "video/webm";
document.head.appendChild(link);

// Then set source
const videoElement = document.querySelector(".h-hero-video video");
const sourceId = isSafari ? "video-mp4" : "video-webm";
document.getElementById(sourceId).src = videoUrl;
videoElement.load();

// coin video
// Video src toggle based on dark mode
// Coin video dark mode toggle
(function () {
  let currentSrc = "";

  const coinObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === "class") {
        const isDark = document.documentElement.classList.contains("dark-mode");
        const video = document.querySelector(".h-coin-video-container video");
        const newSrc = isDark
          ? "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/Asset_Coin_Dark (1).webm"
          : "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/Asset_Coin_Light (1).webm";

        if (video && newSrc !== currentSrc) {
          currentSrc = newSrc;
          video.src = newSrc;
          video.load();
        }
      }
    });
  });
  coinObserver.observe(document.documentElement, { attributes: true });
})();

// const video = document.querySelector(".h-hero-video video");
// const placeholder = document.querySelector(".hero-video-placeholder");

// video.addEventListener("timeupdate", () => {
//   if (video.currentTime > 0) {
//     placeholder.style.display = "none";
//   } else {
//     placeholder.style.display = "block";
//   }
// });

// // Initial state
// if (video.currentTime === 0) {
//   placeholder.style.display = "block";
// } else {
//   placeholder.style.display = "none";
// }
