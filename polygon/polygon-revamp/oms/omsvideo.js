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
      "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/OMS_Hero_V2-HEVC.mp4";
    source.type = "video/mp4";
  } else {
    source.src =
      "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp//OMS_Hero_V2-WebM.webm";
    source.type = "video/webm";
  }

  video.appendChild(source);
  container.appendChild(video);
});

if (isOMSSafari) {
  const video = document.getElementById("entrance-video");
  video.src =
    "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/OMS_new_expand-HEVC.mp4";
}

if (isOMSSafari) {
  const video = document.getElementById("loop-video");
  video.src =
    "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/OMS_new_loop-HEVC.mp4";
}

if (isOMSSafari) {
  const safariSrcs = [
    "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/OMS_Mobile_Video_loop_mobile_A_CHAIN-HEVC.mp4",
    "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/OMS_Mobile_Video_loop_mobile_B_TRAILS-HEVC.mp4",
    "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/OMS_Mobile_Video_loop_mobile_C_WALLET-HEVC.mp4",
    "https://teamepyc.github.io/cdn/polygon/videos/polygon-revamp/OMS_Mobile_Video_loop_mobile_D_BPN-HEVC.mp4",
  ];

  document.querySelectorAll(".oms-mobile-video").forEach((video, i) => {
    if (safariSrcs[i]) {
      video.src = safariSrcs[i];
      video.load();
    }
  });
}
