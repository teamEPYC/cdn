// fetch shared elements
const cards = document.querySelectorAll(".c-card");
const cardOverWrapper = document.querySelector(".c-card-over-wrapper");
const cardOverParent = document.querySelector(".c-card-over-parent");
const cardOver = document.querySelector(".c-card-over");

const closeButtons = document.querySelectorAll(".c-card-over-closer, .card-closer-button");

const cardOverFront = document.querySelector(".c-card-over-front");
const cardOverBack = document.querySelector(".c-card-over-back");

const cardOverFrontTitle = document.querySelector(".c-card-over-front .c-card-title");
const cardOverBackTitle = document.querySelector(".c-card-over-back .c-card-title");
const cardOverBackContent = document.querySelector(".c-card-over-back .c-card-over-content");

let lastCard = null;
let isOpen = false;

cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (isOpen) return;

    gsap.killTweensOf([cardOverParent, cardOver]);

    lastCard = card;
    isOpen = true;

    // background color sync
    const bgColor = window.getComputedStyle(card).backgroundColor;
    cardOverFront.style.backgroundColor = bgColor;
    cardOverBack.style.backgroundColor = bgColor;

    // copy titles
    const sourceTitle = card.querySelector(".c-card-title");
    if (sourceTitle) {
      cardOverFrontTitle.innerHTML = sourceTitle.innerHTML;
      cardOverBackTitle.innerHTML = sourceTitle.innerHTML;
    }

    // copy content (back)
    const sourceContent = card.querySelector(".c-card-over-content");
    if (sourceContent) {
      cardOverBackContent.innerHTML = sourceContent.innerHTML;
    }

    // hide clicked card instantly
    lastCard.style.opacity = "0";

    // show wrapper
    cardOverWrapper.style.display = "flex";

    // compute positions AFTER wrapper is visible
    const rectCard = card.getBoundingClientRect();
    const rectCardOverParent = cardOverParent.getBoundingClientRect();

    const offsets = {
      cCardX: rectCard.left,
      cCardY: rectCard.top,
      cCardOverX: rectCardOverParent.left,
      cCardOverY: rectCardOverParent.top
    };

    gsap.fromTo(cardOverParent,
      { x: offsets.cCardX - offsets.cCardOverX, y: offsets.cCardY - offsets.cCardOverY },
      { x: 0, y: 0, duration: 1, ease: "power2.out" }
    );

    gsap.fromTo(cardOver,
      { scaleX: 0.491, scaleY: 0.486, xPercent: -25.4, yPercent: -25.7, rotateY: 0 },
      { scaleX: 1, scaleY: 1, xPercent: 0, yPercent: 0, rotateY: 180, duration: 1, ease: "power2.out", transformPerspective: 1000 }
    );

    // reset scroll to top every open
    cardOverBack.scrollTop = 0;
    
  });
});

// shared close handler
function closeCard() {
  if (!isOpen || !lastCard) return;

  gsap.killTweensOf([cardOverParent, cardOver]);

  const rectCard = lastCard.getBoundingClientRect();
  const rectCardOverParent = cardOverParent.getBoundingClientRect();

  const offsets = {
    cCardX: rectCard.left,
    cCardY: rectCard.top,
    cCardOverX: rectCardOverParent.left,
    cCardOverY: rectCardOverParent.top
  };

  gsap.fromTo(cardOver,
    { scaleX: 1, scaleY: 1, xPercent: 0, yPercent: 0, rotateY: 180 },
    { scaleX: 0.491, scaleY: 0.486, xPercent: -25.4, yPercent: -25.7, rotateY: 0, duration: 1, ease: "power2.inOut", transformPerspective: 1000 }
  );

  gsap.fromTo(cardOverParent,
    { x: 0, y: 0 },
    {
      x: offsets.cCardX - offsets.cCardOverX,
      y: offsets.cCardY - offsets.cCardOverY,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        cardOverWrapper.style.display = "none";
        lastCard.style.opacity = "1";

        // reset transforms
        cardOverParent.style.transform = "";
        cardOver.style.transform = "";

        isOpen = false;
        lastCard = null;
      }
    }
  );
}

// bind close handler to all close buttons
closeButtons.forEach((btn) => {
  btn.addEventListener("click", closeCard);
});
