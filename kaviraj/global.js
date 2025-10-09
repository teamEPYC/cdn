console.log("Global.js is loaded");

// Swiper on mobile/tablet only (< 991px). Destroy on desktop.
let footerSwiper = null;
const mq = window.matchMedia("(max-width: 990px)");

function on() {
  // Only init if Swiper + element exist and not already initialized
  if (footerSwiper) return;
  if (typeof Swiper !== "function") return;
  if (!document.querySelector(".footer-swiper")) return;

  footerSwiper = new Swiper(".footer-swiper", {
    slidesPerView: "auto",
    spaceBetween: 24, // default; overridden by breakpoints
    breakpoints: {
      0: { spaceBetween: 24 }, // phones
      768: { spaceBetween: 32 }, // tablets
      992: { spaceBetween: 48 }, // ≥992px (won't be used if not initialized on desktop)
    },
    // watchOverflow: true
  });
}

function off() {
  if (!footerSwiper) return;
  footerSwiper.destroy(true, true);
  footerSwiper = null;
}

function handle(e) {
  (e.matches ? on : off)();
}

// init + respond to viewport changes
handle(mq);
if (typeof mq.addEventListener === "function") {
  mq.addEventListener("change", handle);
} else if (typeof mq.addListener === "function") {
  mq.addListener(handle); // older browsers
}

// Menu animation
const hamButton = document.querySelector(".nav-menu-ham");
const mobileMenuButton = document.querySelector(".menu-mobile");
const menu = document.querySelector(".menu");
let isMenuOpen = false;

function openMenu() {
  if (!menu || isMenuOpen) return;

  menu.style.display = "flex";
  document.body.style.overflow = "hidden";

  if (window.gsap) {
    gsap.fromTo(
      menu, { opacity: 0, filter: "blur(10px)" }, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.3,
        ease: "power2.out"
      }
    );
  } else {
    menu.style.opacity = "1";
    menu.style.filter = "none";
  }

  isMenuOpen = true;
}

function closeMenu() {
  if (!menu || !isMenuOpen) return;

  if (window.gsap) {
    gsap.to(menu, {
      opacity: 0,
      filter: "blur(10px)",
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        menu.style.display = "none";
        menu.style.filter = "";
      },
    });
  } else {
    menu.style.display = "none";
  }

  document.body.style.overflow = "auto";
  isMenuOpen = false;
}

function toggleMenu() {
  isMenuOpen ? closeMenu() : openMenu();
}

// Add event listeners safely
if (hamButton) hamButton.addEventListener("click", toggleMenu);
if (mobileMenuButton) mobileMenuButton.addEventListener("click", toggleMenu);

// Optional: close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});
