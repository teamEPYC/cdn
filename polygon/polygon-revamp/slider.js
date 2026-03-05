document.querySelectorAll(".h-video-wrap").forEach((wrap) => {
  const video = wrap.querySelector("video");
  const playBtn = wrap.querySelector(".play-button");

  playBtn.addEventListener("click", () => {
    video.play();
    playBtn.style.display = "none";
  });
});

var swiper = new Swiper(".h-video-element.swiper", {
  cssMode: true,
  loop: true,
  navigation: {
    nextEl: ".swiper-next",
    prevEl: ".swiper-prev",
  },
  pagination: {
    el: ".swiper-pagination",
  },
  mousewheel: true,
  keyboard: true,
  autoplay: {
    delay: 8000,
    disableOnInteraction: false,
  },
  on: {
    init: function () {
      document.querySelector(".h-slide-current").textContent =
        this.realIndex + 1;
      document.querySelector(".h-slide-total").textContent = this.slides.length;
      updateProgressBar(this.realIndex);
    },
    slideChange: function () {
      document.querySelector(".h-slide-current").textContent =
        this.realIndex + 1;
      updateProgressBar(this.realIndex);

      // Reset autoplay timer on any slide change
      this.autoplay.stop();
      this.autoplay.start();
    },
  },
});

function updateProgressBar(index) {
  const containers = document.querySelectorAll(".progress-bar-container");

  containers.forEach((container, i) => {
    const fill = container.querySelector(".progress-bar-fill");
    fill.style.transition = "none";
    fill.style.width = "0%";

    if (i === index) {
      void fill.offsetWidth;
      fill.style.transition = "width 8s linear";
      fill.style.width = "100%";
    }
  });
}
