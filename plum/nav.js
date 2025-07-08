// ========================
// NAV COLOR BASED ON SECTION
// ========================

// Select all sections with [data-nav]
const sections = document.querySelectorAll("[data-nav]");

// Set initial nav color based on the first section
if (sections.length > 0) {
  const firstNavType = sections[0].getAttribute("data-nav");
  if (firstNavType === "0") {
    updateVars("#fff1e5", "#1d0716");
  } else if (firstNavType === "1") {
    updateVars("#1d0716", "#fff1e5");
  }
}

// Change nav color when a section is in view
sections.forEach((section) => {
  const navType = section.getAttribute("data-nav");

  let navLight, navDark;

  if (navType === "0") {
    navLight = "#fff1e5";
    navDark = "#1d0716";
  } else if (navType === "1") {
    navLight = "#1d0716";
    navDark = "#fff1e5";
  } else {
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom top",
    onEnter: () => updateVars(navLight, navDark),
    onEnterBack: () => updateVars(navLight, navDark),
  });
});

// Utility: update CSS custom properties
function updateVars(light, dark) {
  document.documentElement.style.setProperty("--_colors---nav--nav-white", light);
  document.documentElement.style.setProperty("--_colors---nav--nav-dark", dark);
}

// ========================
// NAV SUBITEM LINK HOVER LINE & ARROW ANIMATION
// ========================

document.querySelectorAll(".nav-subitem-link").forEach((link) => {
  const hoverline = link.querySelector(".nav-subitem-link-hoverline");
  const arrow = link.querySelector(".nav-subitem-link-arrow");

  gsap.set(hoverline, { scaleX: 0, xPercent: 0, transformOrigin: "left center" });
  gsap.set(arrow, { xPercent: -100, yPercent: 100 });

  link.addEventListener("mouseenter", () => {
    gsap.fromTo(hoverline, 
      { scaleX: 0, xPercent: 0 }, 
      { scaleX: 1, xPercent: 0, duration: 1, ease: "expo.out" }
    );

    gsap.fromTo(arrow,
      { xPercent: -100, yPercent: 100 },
      { xPercent: 0, yPercent: 0, duration: 0.8, ease: "expo.out" }
    );
  });

  link.addEventListener("mouseleave", () => {
    gsap.fromTo(hoverline, 
      { scaleX: 1, xPercent: 0 },
      { scaleX: 1, xPercent: 100, duration: 1, ease: "expo.out" }
    );

    gsap.fromTo(arrow,
      { xPercent: 0, yPercent: 0 },
      { xPercent: 100, yPercent: -100, duration: 0.8, ease: "expo.out" }
    );
  });
});

// ========================
// DESKTOP NAV INTERACTIONS
// ========================

if (window.innerWidth > 991) {
  // Subitem slide-in and plus icon rotation
  document.querySelectorAll(".nav-item").forEach((link) => {
    const subitem = link.querySelectorAll(".nav-subitem");
    const plusIcon = link.querySelector(".nav-item-link-icon-line.animate");

    link.addEventListener("mouseenter", () => {
      gsap.fromTo(subitem,
        { xPercent: -10, opacity: 0 },
        { xPercent: 0, opacity: 1, stagger: 0.05, duration: 1, ease: "expo.out" }
      );

      gsap.fromTo(plusIcon,
        { rotation: 90 },
        { rotation: 0, duration: 0 }
      );
    });

    link.addEventListener("mouseleave", () => {
      gsap.fromTo(plusIcon,
        { rotation: 0 },
        { rotation: 90, duration: 0 }
      );
    });
  });

  // Show/hide nav background on hover
  document.querySelectorAll(".nav-item").forEach(link => {
    const bg = document.querySelector(".nav-bg");
    link.onmouseenter = () => bg.style.opacity = "1";
    link.onmouseleave = () => bg.style.opacity = "0";
  });

  // Subitem content replacement animation on hover
  document.querySelectorAll('.nav-subitem-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      const mobileDetails = link.parentElement.querySelector('.nav-subitem-link-details.mobile');
      const desktopDetails = link.closest('.nav-container')?.querySelector('.nav-subitem-link-details.desktop');

      if (!mobileDetails || !desktopDetails) return;

      const mobileImage = mobileDetails.querySelector('.nav-subitem-link-image');
      const mobileDesc = mobileDetails.querySelector('.nav-subitem-link-description');

      const desktopImage = desktopDetails.querySelector('.nav-subitem-link-image');
      const desktopDesc = desktopDetails.querySelector('.nav-subitem-link-description');

      const newSrc = mobileImage?.getAttribute('src');
      const newText = mobileDesc?.textContent?.trim();

      const tl = gsap.timeline();
      tl.to(desktopDetails, {
        y: 10,
        opacity: 0,
        duration: 0,
        onComplete: () => {
          if (desktopImage && newSrc) desktopImage.setAttribute('src', newSrc);
          if (desktopDesc && newText) desktopDesc.textContent = newText;
        }
      }).fromTo(desktopDetails,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "expo.out" }
      );
    });
  });
}

// ========================
// MOBILE NAV INTERACTIONS
// ========================

if (window.innerWidth <= 991) {
  // Hamburger menu toggle
  const hamburger = document.querySelector(".nav-hamburger");
  const menu = document.querySelector(".nav-menu");
  const bg = document.querySelector(".nav-bg");
  const line1 = document.querySelector(".nav-hamburger-line._1");
  const line2 = document.querySelector(".nav-hamburger-line._2");
  const line3 = document.querySelector(".nav-hamburger-line._3");

  let isOpen = false;

  hamburger.addEventListener("click", () => {
    isOpen = !isOpen;
    menu.style.display = isOpen ? "flex" : "none";
    bg.style.opacity = isOpen ? "1" : "0";

    // Animate hamburger icon
    if (isOpen) {
      gsap.set(line1, { y: 6, rotate: 45 });
      gsap.set(line2, { scaleX: 0 });
      gsap.set(line3, { y: -6, rotate: -45 });

      // Animate menu items
      gsap.fromTo(
        ".nav-menu .nav-item, .nav-menu .button-wrapper",
        { yPercent: 10, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.05, duration: 1.5, ease: "expo.out" }
      );
    } else {
      gsap.set(line1, { y: 0, rotate: 0 });
      gsap.set(line2, { scaleX: 1 });
      gsap.set(line3, { y: 0, rotate: 0 });
    }
  });

  // Toggle dropdown on nav item click
  document.querySelectorAll(".nav-item").forEach((item) => {
    const link = item.querySelector(".nav-item-link");
    const subitem = item.querySelectorAll(".nav-subitem");
    const dropdown = item.querySelector(".nav-item-dropdown");
    const plusIcon = item.querySelector(".nav-item-link-icon-line.animate");

    link.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = dropdown.style.display === "block";
      dropdown.style.display = isOpen ? "none" : "block";

      gsap.set(plusIcon, {
        rotate: isOpen ? 90 : 0
      });

      gsap.fromTo(subitem,
        { yPercent: 5, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0, ease: "expo.out" }
      );
    });
  });

  // Scroll clicked element to top inside nav menu
  /*document.querySelectorAll('.nav-menu .nav-item, .nav-menu .button-wrapper').forEach(el => {
    el.addEventListener('click', () => {
      const parent = el.closest('.nav-menu');
      if (!parent) return;

      const offsetTop = el.offsetTop - parent.offsetTop;
      parent.scrollTo(0, offsetTop); // instant scroll
    });
  });*/
}

// ========================
// OPTIONAL: NAV HIDE/SHOW ON SCROLL (COMMENTED OUT)
// ========================

/*
let lastScroll = window.pageYOffset;
const nav = document.querySelector(".nav");

ScrollTrigger.create({
  onUpdate: () => {
    const currentScroll = window.pageYOffset;
    const goingDown = currentScroll > lastScroll;

    gsap.to(nav, {
      y: goingDown ? "-100%" : "0%",
      duration: 1,
      ease: "expo.out",
    });

    lastScroll = currentScroll;
  },
});
*/
