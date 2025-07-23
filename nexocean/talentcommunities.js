const lenis = new Lenis({
  lerp: 0.05, // Lower value for smoother interpolation
  wheelMultiplier: 1.2, // Lower sensitivity for wheel scrolling
  gestureOrientation: "vertical",
  smoothWheel: true,
  smoothTouch: true, // Enable smooth touch scrolling
  syncTouchLerp: 0.02, // Adjust for smoother touch response
  touchMultiplier: 1.5, // Lower multiplier for touch events
  autoResize: true,

  // Exclude your popup from Lenis
  prevent: (node) =>
    node.classList.contains("tc-pu-form") || node.closest(".tc-pu-form"),
});

function connectLenis() {
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on("scroll", ScrollTrigger.update);
  // Removed the gsap.ticker.add update to avoid double-calling lenis.raf
}

connectLenis();

if (window.matchMedia("(min-width: 1024px)").matches) {
  document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll("[color-data]").forEach((section) => {
      console.log(section);
      const rawColor = section.getAttribute("color-data"); // e.g., "ffffff"
      // console.log({ color: rawColor });
      const color = `#${rawColor}`; // prepend '#'

      ScrollTrigger.create({
        trigger: section,
        start: "top center", // Try different percentages
        end: "bottom center", // Adjust end position too
        onEnter: () =>
          gsap.to("body", { backgroundColor: color, duration: 0.5 }),
        onEnterBack: () =>
          gsap.to("body", { backgroundColor: color, duration: 0.5 }),
        // markers: true,
      });
    });
  });
}
// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get the dropdown container element
  const dropdown = document.querySelector(".tc-tabs-dropdown");

  // Get all the tabs
  const tabs = document.querySelectorAll(".tc-tab");

  // Check if the elements exist
  if (!dropdown || tabs.length === 0) {
    console.error("Could not find dropdown or tabs elements");
    return;
  }

  // Get all anchor links inside the dropdown
  const dropdownLinks = dropdown.querySelectorAll("a");

  if (dropdownLinks.length === 0) {
    console.error("No anchor tags found in the dropdown");
    return;
  }

  // Check for duplicate text in dropdown links and handle appropriately
  const textMap = {};
  dropdownLinks.forEach((link) => {
    const text = link.innerText.trim();
    if (!textMap[text]) {
      textMap[text] = [];
    }
    textMap[text].push(link);
  });

  // Function to handle dropdown link click
  function handleDropdownLinkClick(event) {
    // Prevent default link behavior
    event.preventDefault();

    // Get the link's text content
    const selectedText = event.target.innerText.trim();

    // Find the matching tab
    let matchFound = false;
    tabs.forEach((tab) => {
      // Compare the tab's inner text with the selected dropdown link
      if (tab.innerText.trim() === selectedText) {
        // Simulate a click on the matching tab
        tab.click();
        matchFound = true;
      }
    });

    if (!matchFound) {
      console.log("No matching tab found for: " + selectedText);
    }

    // Update active state in dropdown - handle all links with the same text
    dropdownLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Set active class on all links with the same text
    if (textMap[selectedText]) {
      textMap[selectedText].forEach((link) => {
        link.classList.add("active");
      });
    }

    // Update the text in the tc-tabs-toggle element
    const tabsToggle = document.querySelector(".tc-tabs-toggle");
    if (tabsToggle) {
      // If the toggle has a div child that contains the text
      const toggleTextDiv = tabsToggle.querySelector("div");
      if (toggleTextDiv) {
        toggleTextDiv.innerText = selectedText;
      } else {
        // If the text is directly in the toggle element
        tabsToggle.innerText = selectedText;
      }
    }
  }

  // Add click event listeners to all dropdown links
  dropdownLinks.forEach((link) => {
    link.addEventListener("click", handleDropdownLinkClick);
  });

  // Optional: Initialize the tabs based on the initial dropdown selection
  // This will set the correct tab on page load if there's an active link
  const initialActiveLink = dropdown.querySelector("a.active, a.selected");
  if (initialActiveLink) {
    // Trigger a click on the active link to ensure content is updated
    initialActiveLink.click();
  } else {
    // If no active link is found, set the LAST link as active by default
    const lastLink = dropdownLinks[dropdownLinks.length - 1];
    if (lastLink) {
      // Remove active class from all links
      dropdownLinks.forEach((link) => {
        link.classList.remove("active");
      });

      const lastLinkText = lastLink.innerText.trim();

      // Add active class to all links with the same text as the last link
      if (textMap[lastLinkText]) {
        textMap[lastLinkText].forEach((link) => {
          link.classList.add("active");
        });
      }

      // Trigger a click on the last link to ensure content is updated
      lastLink.click();
    }
  }
});

const wrapper = document.querySelector(".tc-impact-card-wrapper");

if (wrapper) {
  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // mouse X inside wrapper
    const percent = mouseX / rect.width; // 0 (left) to 1 (right)
    const scrollWidth = wrapper.scrollWidth - wrapper.clientWidth;

    wrapper.scrollLeft = scrollWidth * percent;
  });

  wrapper.addEventListener("mouseleave", () => {
    // Optional: Snap back to center or left when leaving
    // wrapper.scrollLeft = 0; // To snap to left
    // or do nothing to leave at last position
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  const socialField = document.querySelector("#LinkedIn-or-Github-URL");
  const socialError = socialField.nextElementSibling;

  const emailField = document.querySelector("#Your-Business-Email");
  const emailError = emailField.nextElementSibling;

  // Normalize URL by adding https:// if not present
  function normalizeUrl(url) {
    if (!/^https?:\/\//i.test(url)) {
      return "https://" + url;
    }
    return url;
  }

  // Updated regex for better coverage
  const linkedInRegex =
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_%]+\/?$/i;
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-_%]+\/?$/i;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", function (e) {
    let hasError = false;

    const rawUrl = socialField.value.trim();
    const url = normalizeUrl(rawUrl);
    const email = emailField.value.trim();

    const isSocialValid = linkedInRegex.test(url) || githubRegex.test(url);
    if (!isSocialValid) {
      socialError.style.display = "block";
      socialError.textContent = "Please enter a valid LinkedIn or GitHub URL.";
      hasError = true;
    } else {
      socialError.style.display = "none";
      socialError.textContent = "";
    }

    const isEmailValid = emailRegex.test(email);
    if (!isEmailValid) {
      emailError.style.display = "block";
      emailError.textContent = "Please enter a valid email address.";
      hasError = true;
    } else {
      emailError.style.display = "none";
      emailError.textContent = "";
    }

    if (hasError) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  });
});
