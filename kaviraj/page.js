

// setting global page scroll smoothning
ScrollSmoother.create({
    content: ".smooth",
    smooth: 1.5, 
    effects: true
});

// making hero section sticky
ScrollTrigger.create({
    trigger: ".hero",
    start: "0%",
    end: "100%",
    pin: true,
    pinSpacing: false
});


// function to dynamically set the font size to fit the width of parent
function fitTextToWidthByAttribute(attr = "data-fitText", minFontSize = 10, maxFontSize = 300) {
  const elements = document.querySelectorAll(`[${attr}="true"]`);

  const resizeText = (el) => {
    const parent = document.querySelector("[data-fitText-parent");
    let fontSize = maxFontSize;
    el.style.fontSize = fontSize + "px";
    el.style.whiteSpace = "nowrap"; // force single line

    while (
      fontSize > minFontSize &&
      el.scrollWidth > parent.clientWidth
    ) {
      fontSize--;
      el.style.fontSize = fontSize + "px";
    }
  };

  const handleResize = () => {
    elements.forEach(resizeText);
  };

  handleResize();
  window.addEventListener("resize", handleResize);
}

document.addEventListener("DOMContentLoaded", () => {
  fitTextToWidthByAttribute();
});



