(function () {
  const swipers = [];

  function initSlider(selector, wrapperSelector) {
    const container = document.querySelector(selector);
    const wrapper = wrapperSelector
      ? document.querySelector(wrapperSelector)
      : container.parentElement;
    if (!container) return;

    function updateProgressBar(index) {
      if (!wrapper) return;
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

    const swiper = new Swiper(selector, {
      effect: "fade",
      loop: true,
      fadeEffect: { crossFade: true },
      navigation: {
        nextEl: wrapper?.querySelector(".swiper-next"),
        prevEl: wrapper?.querySelector(".swiper-prev"),
      },
      pagination: {
        el: wrapper?.querySelector(".swiper-pagination"),
      },
      keyboard: true,
      autoplay: {
        delay: 8000,
        disableOnInteraction: false,
      },
      on: {
        init: function () {
          const current = wrapper?.querySelector(".h-slide-current");
          const total = wrapper?.querySelector(".h-slide-total");
          if (current) current.textContent = this.realIndex + 1;
          if (total) total.textContent = this.slides.length;
          updateProgressBar(this.realIndex);
        },
        slideChange: function () {
          const current = wrapper?.querySelector(".h-slide-current");
          if (current) current.textContent = this.realIndex + 1;
          updateProgressBar(this.realIndex);

          // Sync all other swipers
          swipers.forEach((s) => {
            if (s !== this && s.realIndex !== this.realIndex) {
              s.slideToLoop(this.realIndex);
            }
          });
        },
      },
    });

    swipers.push(swiper);
  }

  function initSimpleSlider(selector) {
    const container = document.querySelector(selector);
    if (!container) return;

    const swiper = new Swiper(selector, {
      loop: true,
      spaceBetween: 16,
      on: {
        slideChange: function () {
          swipers.forEach((s) => {
            if (s !== this && s.realIndex !== this.realIndex) {
              s.slideToLoop(this.realIndex);
            }
          });
        },
      },
    });

    swipers.push(swiper);
  }

  initSlider(".h-video-element", ".section.is-slider-desktop");
  initSlider(".h-video-element-mobile", ".section.is-slider-mobile");
  initSimpleSlider(".blog-header-slider.swiper");
})();

const params = new URLSearchParams(window.location.search);
const filter = params.get("filter");

if (filter) {
  setTimeout(() => {
    const radio = document.querySelector(
      `.blog-radio input[data-value="${filter}"]`
    );
    if (radio) radio.click();
  }, 1000);
}
