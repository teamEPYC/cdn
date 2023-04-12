const storiesSliderEl = document.querySelector(".stories-slider");
//
function main() {
  storiesSliderEl.style.display = "flex";
  const storiesSlider = createStoriesSlider(storiesSliderEl, {
    Swiper,
    autoplayDuration: 5000,
    enabled: false,
    // onSlidesIndexesChange(mainIndex, subIndex) {
    //   console.log({ mainIndex, subIndex });
    // },
  });
  const storiesWrapper = $("#stories-slider-wrapper")[0];
  

  document.querySelectorAll(".demo-stories a").forEach((userEl, userIndex) => {
    userEl.addEventListener("click", (e) => {
      e.preventDefault();
      // add "in" class (used in demo for animated appearance)
      // storiesSliderEl.style.display = "";
      storiesSliderEl.classList.add("stories-slider-in");
      
      // console.log(storiesSlider);
      storiesSlider.enable();
      // slide to specific user's stories
      storiesSlider.slideTo(userIndex, 0);
    });
  });
  storiesSliderEl.addEventListener("click", (e) => {
    // if we clicked at "stories-slider-close-button"

    if (e.target.matches(".stories-slider-close-button")) {
      // disable slider as we don't need it autoplay stories while it is hidden
      storiesSlider.disable();
      
      // add "out" class (used in demo for animated disappearance)
      storiesSliderEl.classList.add("stories-slider-out");
    }
  });


  // when slider became hidden we need to remove "in" and "out" class to return it initial state
  storiesSliderEl.addEventListener("animationend", () => {
    if (storiesSliderEl.classList.contains("stories-slider-out")) {
      storiesSliderEl.classList.remove("stories-slider-in");
      storiesSliderEl.classList.remove("stories-slider-out");
    }
  });
  if (window.hasOwnProperty("storiesLoaded")) {
    window.storiesLoaded = true;
  }
}

$(document).ready(function () {
  if (!window.storiesLoaded) {
    main();

  } 
});
