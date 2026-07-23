const trailsVideos = document.querySelectorAll(".trails-video-embed video");

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

trailsVideos.forEach((video) => {
  video.src = isSafari
    ? "https://polytech-assets.polygon.technology/videos/polygon-revamp/Asset_Trails_Breakdown_SAFARI.mp4"
    : "https://polytech-assets.polygon.technology/videos/polygon-revamp/Asset_Trails_Breakdown_CHROME.webm";
});

if (isSafari) {
  const video = document.getElementById("pos-hero-video");
  video.src =
    "https://polytech-assets.polygon.technology/videos/polygon-revamp/POS hero safari.mp4";
}
