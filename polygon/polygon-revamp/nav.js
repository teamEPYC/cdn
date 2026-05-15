const isPolygonNav = document.querySelector('[class*="polygon-v3--"]') !== null;
const prefix = isPolygonNav ? "polygon-v3--" : "";
const isCapped =
  document.querySelector('.nav-wrapper[data-wf--navbar--variant="capped"]') !==
  null;

if (window.innerWidth >= 992) {
  const sectionEls = document.querySelectorAll(".nav-popup");
  const navLinkEls = document.querySelectorAll(".nav-link");
  const popoverEl = document.querySelector(".nav-popover-wrap");
  const contentEl = document.querySelector(".nav-content");

  const dimensions = {
    products: { widthVw: 57, widthPx: 820 },
    solutions: { widthVw: 23, widthPx: 330 },
    developers: { widthVw: 20, widthPx: 288 },
    company: { widthVw: 20, widthPx: 288 },
    "use-company": { widthVw: 20, widthPx: 288 },
  };

  let activeSection = null;
  let activeNavLink = null;
  let isOverNav = false;
  let isOverPopover = false;

  function vwToPx(vw) {
    return (vw * window.innerWidth) / 100;
  }

  function getWidth(section) {
    return isCapped
      ? dimensions[section].widthPx
      : vwToPx(dimensions[section].widthVw);
  }

  function getXPosition(navLink, section) {
    const navRect = navLink.getBoundingClientRect();
    const popoverRect = popoverEl.getBoundingClientRect();
    const dropdownWidth = getWidth(section);

    let x = navRect.left - popoverRect.left;
    if (x < 0) x = 0;

    const maxX = window.innerWidth - popoverRect.left - dropdownWidth;
    if (x > maxX) x = maxX;

    return x;
  }

  function showSection(section, navLink) {
    if (!dimensions[section]) return;

    activeSection = section;
    activeNavLink = navLink;

    navLinkEls.forEach((el) => {
      el.classList.remove("is-active");
      const icon = el.querySelector(".p-icon");
      if (icon) icon.style.display = "none";
    });

    navLink.classList.add("is-active");
    const activeIcon = navLink.querySelector(".p-icon");
    if (activeIcon) activeIcon.style.display = "block";

    popoverEl.classList.add("open");
    popoverEl.style.opacity = "1";
    popoverEl.style.pointerEvents = "auto";

    const widthPx = getWidth(section);
    const xPos = getXPosition(navLink, section);

    contentEl.style.width = widthPx + "px";
    contentEl.style.transform = `translateX(${xPos}px)`;

    requestAnimationFrame(() => {
      sectionEls.forEach((el) => {
        el.classList.remove("active");
        el.style.opacity = "";
        el.style.display = "";
      });

      const targetSection = document.querySelector(`.nav-${section}-popup`);
      if (targetSection) {
        targetSection.classList.add("active");
        targetSection.style.opacity = "1";
        targetSection.style.display = "block";
      }
    });
  }

  function hidePopover() {
    popoverEl.classList.remove("open");
    popoverEl.style.opacity = "";
    popoverEl.style.pointerEvents = "";

    sectionEls.forEach((el) => {
      el.classList.remove("active");
      el.style.opacity = "";
      el.style.display = "";
    });

    navLinkEls.forEach((el) => {
      el.classList.remove("is-active");
      const icon = el.querySelector(".p-icon");
      if (icon) icon.style.display = "none";
    });

    navLinkEls[0].classList.add("is-active");
    const firstIcon = navLinkEls[0].querySelector(".p-icon");
    if (firstIcon) firstIcon.style.display = "block";

    activeSection = null;
    activeNavLink = null;
  }

  function checkAndHide() {
    setTimeout(() => {
      if (!isOverNav && !isOverPopover) {
        hidePopover();
      }
    }, 50);
  }

  function recalculatePosition() {
    if (activeSection && activeNavLink) {
      showSection(activeSection, activeNavLink);
    }
  }

  function debounce(fn, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  navLinkEls.forEach((navLink) => {
    navLink.addEventListener("mouseenter", (event) => {
      isOverNav = true;
      showSection(
        event.currentTarget.getAttribute("data-nav"),
        event.currentTarget
      );
    });

    navLink.addEventListener("mouseleave", () => {
      isOverNav = false;
      checkAndHide();
    });
  });

  contentEl.addEventListener("mouseenter", () => {
    isOverPopover = true;
  });
  contentEl.addEventListener("mouseleave", () => {
    isOverPopover = false;
    checkAndHide();
  });

  window.addEventListener("resize", debounce(recalculatePosition, 100));
  navLinkEls[0].classList.add("is-active");
}

//tablet
if (window.innerWidth < 992) {
  const sectionEls = document.querySelectorAll(`.${prefix}nav-popup`);
  const navLinkEls = document.querySelectorAll(`.${prefix}nav-link`);
  const popoverEl = document.querySelector(`.${prefix}nav-popover-wrap`);
  const backBtns = document.querySelectorAll(`.${prefix}nav-menu-back-button`);
  const menuBtn = document.querySelector(`.${prefix}menu-button`);

  function showSection(section) {
    sectionEls.forEach((el) => el.classList.remove(`${prefix}active`));

    const targetSection = document.querySelector(
      `.${prefix}nav-${section}-popup`
    );
    if (targetSection) {
      targetSection.classList.add(`${prefix}active`);
      targetSection.style.display = "flex";
    }

    popoverEl.style.pointerEvents = "none";
    popoverEl.style.transform = "translateX(0)";

    setTimeout(() => {
      popoverEl.style.pointerEvents = "auto";
    }, 300);
  }

  function hidePopover(immediate = false) {
    popoverEl.style.pointerEvents = "none";
    popoverEl.style.transform = "translateX(100%)";

    if (immediate) {
      sectionEls.forEach((el) => {
        el.classList.remove(`${prefix}active`);
        el.style.display = "none";
      });
    } else {
      setTimeout(() => {
        sectionEls.forEach((el) => {
          el.classList.remove(`${prefix}active`);
          el.style.display = "none";
        });
      }, 300);
    }
  }

  navLinkEls.forEach((navLink) => {
    navLink.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const section = event.currentTarget.getAttribute("data-nav");
      if (section) {
        showSection(section);
      }
    });
  });

  backBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      hidePopover();
    });
  });

  if (menuBtn) {
    menuBtn.addEventListener("click", () => hidePopover(true));
  }
}

document.querySelectorAll(".polygon-v3--hide").forEach((el) => {
  el.style.display = "none";
});

document.querySelectorAll(".polygon-v3--nav.w-nav a").forEach((el) => {
  el.style.textDecoration = "none";
});
