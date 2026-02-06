function colorModeToggle() {
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }

  const htmlElement = document.documentElement;
  const computed = getComputedStyle(htmlElement);

  const scriptTag = document.querySelector("[tr-color-vars]");
  if (!scriptTag) {
    console.warn("Script tag with tr-color-vars attribute not found");
    return;
  }

  let colorModeDuration = attr(0.5, scriptTag.getAttribute("duration"));
  let colorModeEase = attr("power1.out", scriptTag.getAttribute("ease"));

  const cssVariables = scriptTag.getAttribute("tr-color-vars");
  if (!cssVariables.length) {
    console.warn("Value of tr-color-vars attribute not found");
    return;
  }

  let darkColors = {};
  cssVariables.split(",").forEach(function (item) {
    let lightValue = computed.getPropertyValue(`--color--${item}`);
    let darkValue = computed.getPropertyValue(`--dark--${item}`);
    if (lightValue.length) {
      if (!darkValue.length) darkValue = lightValue;
      darkColors[`--color--${item}`] = darkValue;
    }
  });

  if (!Object.keys(darkColors).length) {
    console.warn("No variables found matching tr-color-vars attribute value");
    return;
  }

  function setColors(colorObject, animate) {
    if (typeof gsap !== "undefined" && animate) {
      gsap.to(htmlElement, {
        ...colorObject,
        duration: colorModeDuration,
        ease: colorModeEase,
      });
    } else {
      Object.keys(colorObject).forEach(function (key) {
        htmlElement.style.setProperty(key, colorObject[key]);
      });
    }
  }

  function forceDarkMode() {
    localStorage.setItem("dark-mode", "true");
    htmlElement.classList.add("dark-mode");
    setColors(darkColors, false);
  }

  // Force dark mode immediately - ignore user preferences
  forceDarkMode();

  // Also ensure dark mode is set after DOM is fully loaded
  window.addEventListener("DOMContentLoaded", (event) => {
    forceDarkMode();
  });
}

colorModeToggle();
