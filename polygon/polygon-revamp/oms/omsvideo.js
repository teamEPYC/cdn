document.querySelectorAll(".oms-entrace-video-embed").forEach((container) => {
  const video = container.querySelector("video");
  if (!video) return;

  const loopVideo = document.querySelector(".oms-loop-video-embed");

  video.addEventListener("ended", () => {
    container.style.opacity = "0";
    if (loopVideo) {
      loopVideo.style.opacity = "1";
      const loopVid = loopVideo.querySelector("video");
      if (loopVid) loopVid.play();
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(container);
});

const video = document.createElement("video");
video.id = "omsHeroVideo";
video.autoplay = true;
video.muted = true;
video.loop = true;
video.playsInline = true;

const isOMSSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

document.querySelectorAll(".oms-hero-video").forEach((container) => {
  const video = document.createElement("video");
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  const source = document.createElement("source");

  if (isOMSSafari) {
    source.src =
      "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/Asset_OMS-Hero_SAFARI (1).mp4";
    source.type = "video/mp4";
  } else {
    source.src =
      "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/Asset_OMS-Hero_CHROME (2).webm";
    source.type = "video/webm";
  }

  video.appendChild(source);
  container.appendChild(video);
});

if (isOMSSafari) {
  const video = document.getElementById("entrance-video");
  video.src =
    "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/Asset_OMS-Open_Part1_SAFARI (1).mp4";
}

if (isOMSSafari) {
  const video = document.getElementById("loop-video");
  video.src =
    "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/Asset_OMS-Open_Part2_Loop_SAFARI.mp4";
}
