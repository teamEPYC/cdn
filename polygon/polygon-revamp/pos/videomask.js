const trailsVideos = document.querySelectorAll(".trails-video-embed video");

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

trailsVideos.forEach((video) => {
  video.src = isSafari
    ? "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/Asset_Trails_Breakdown_SAFARI.mp4"
    : "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/Asset_Trails_Breakdown_CHROME.webm";
});

if (isSafari) {
  const video = document.getElementById("pos-hero-video");
  video.src =
    "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/POS hero safari.mp4";
}
