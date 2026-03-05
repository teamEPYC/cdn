(function () {
  const gridSize = 10;

  function initSlider(selector, wrapperSelector) {
    const mosaicData = [];
    const container = document.querySelector(selector);
    const wrapper = wrapperSelector
      ? document.querySelector(wrapperSelector)
      : container.parentElement;
    if (!container) return;

    function setupMosaics() {
      container
        .querySelectorAll(".swiper-slide")
        .forEach((slide, slideIndex) => {
          const mosaicDiv = slide.querySelector(".slider-mosiac-div");
          if (!mosaicDiv) return;

          const pixels = [];
          const bg = getComputedStyle(mosaicDiv).background;

          mosaicDiv.style.display = "grid";
          mosaicDiv.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
          mosaicDiv.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
          mosaicDiv.style.gap = "0";
          mosaicDiv.style.background = "none";
          mosaicDiv.style.overflow = "hidden";
          mosaicDiv.style.pointerEvents = "none";

          for (let i = 0; i < gridSize * gridSize; i++) {
            const pixel = document.createElement("div");
            const col = i % gridSize;
            const row = Math.floor(i / gridSize);

            pixel.style.background = bg;
            pixel.style.backgroundSize = `${gridSize * 100}% ${
              gridSize * 100
            }%`;
            pixel.style.backgroundPosition = `${
              (col / (gridSize - 1)) * 100
            }% ${(row / (gridSize - 1)) * 100}%`;
            pixel.style.margin = "-0.5px";
            pixel.style.padding = "0.5px";
            pixel.style.opacity = "1";

            mosaicDiv.appendChild(pixel);
            pixels.push(pixel);
          }

          mosaicData[slideIndex] = { pixels, mosaicDiv };
        });
    }

    function playMosaic(index) {
      if (!mosaicData[index]) return;
      const shuffled = [...mosaicData[index].pixels].sort(
        () => Math.random() - 0.5
      );

      gsap.set(mosaicData[index].pixels, { opacity: 1 });
      gsap.to(shuffled, {
        opacity: 0,
        duration: 0.05,
        stagger: 0.01,
        ease: "power2.out",
      });
    }

    function updateProgressBar(index) {
      wrapper.querySelectorAll(".progress-bar-container").forEach((c, i) => {
        const fill = c.querySelector(".progress-bar-fill");
        fill.style.transition = "none";
        fill.style.width = "0%";
        if (i === index) {
          void fill.offsetWidth;
          fill.style.transition = "width 8s linear";
          fill.style.width = "100%";
        }
      });
    }

    setupMosaics();

    new Swiper(selector, {
      cssMode: false,
      effect: "fade",
      loop: true,
      watchOverflow: false,
      fadeEffect: { crossFade: true },
      navigation: {
        nextEl: wrapper.querySelector(".swiper-next"),
        prevEl: wrapper.querySelector(".swiper-prev"),
      },
      pagination: {
        el: wrapper.querySelector(".swiper-pagination"),
      },

      keyboard: true,
      autoplay: {
        delay: 8000,
        disableOnInteraction: false,
      },
      on: {
        init: function () {
          const current = wrapper.querySelector(".h-slide-current");
          const total = wrapper.querySelector(".h-slide-total");
          if (current) current.textContent = this.realIndex + 1;
          if (total) total.textContent = this.slides.length;
          updateProgressBar(this.realIndex);
          playMosaic(this.realIndex);
        },
        slideChange: function () {
          const current = wrapper.querySelector(".h-slide-current");
          if (current) current.textContent = this.realIndex + 1;
          updateProgressBar(this.realIndex);
          playMosaic(this.realIndex);
        },
      },
    });
  }

  // Initialize both sliders with their parent wrapper selectors
  initSlider(".h-video-element", ".section.is-slider-desktop");
  initSlider(".h-video-element-mobile", ".section.is-slider-mobile");
})();

var purposeSwiper = new Swiper(".purpose-slider.swiper", {
  loop: true,
  spaceBetween: 16,

  pagination: {
    el: ".purpose-pagination",
    clickable: true,
    bulletClass: "purpose-static-dot",
    bulletActiveClass: "purpose-active-dot",
  },

  breakpoints: {
    0: {
      slidesPerView: 1.1,
    },
  },
});
