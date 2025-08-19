const cards = document.querySelectorAll(".cb25-pf-card");
const gridContainer = document.querySelector(".cb25-prefooter-wrapper");

// Image arrays for different states
const lightBlueImages = [
  "https://cdn.prod.website-files.com/669a2ac7dfc30232b6615657/6874cdfe454ba5b01c36beb9_light%20blue%20shield.svg",
  "https://cdn.prod.website-files.com/669a2ac7dfc30232b6615657/6874cdfe921141e3d7c0f864_light%20blue%20star.svg",
  "https://cdn.prod.website-files.com/669a2ac7dfc30232b6615657/6874cdfeb63c83edb3a2b37a_light%20blue%20flower.svg",
];

const greyImages = [
  "https://cdn.prod.website-files.com/669a2ac7dfc30232b6615657/6874fc8902ae6f9dddc6bf91_light%20grey%20shield.png",
  "https://cdn.prod.website-files.com/669a2ac7dfc30232b6615657/6874fc89a29d0251720b5758_light%20grey%20star.png",
  "https://cdn.prod.website-files.com/669a2ac7dfc30232b6615657/6874fc8902ae6f9dddc6bf91_light%20grey%20shield.png",
];

const darkBlueImages = [
  "https://cdn.prod.website-files.com/669a2ac7dfc30232b6615657/6874cdfe514bce745cde0545_dark%20blue%20star.svg",
  "https://cdn.prod.website-files.com/669a2ac7dfc30232b6615657/6874cdfe37bb4395e4d47f0f_dark%20blue%20shield.svg",
  "https://cdn.prod.website-files.com/669a2ac7dfc30232b6615657/68665d303306f58268c4ca91_cb25%20flower.svg",
];

// Cache for card centers and current states
const cardCache = new Map();
let lastMousePosition = { x: 0, y: 0 };
let isProcessing = false;

// Simple image counters for unique selection
let lightBlueCounter = 0;
let greyCounter = 0;
let darkBlueCounter = 0;

// Stable random selection for dark blue cards
let selectedDarkBlueCards = new Set();
let darkBlueSelectionLocked = false;
let selectionCooldown = false;

function getMousePosition(e) {
  return {
    x: e.clientX,
    y: e.clientY,
  };
}

function initializeCardCache() {
  cards.forEach((card, index) => {
    const updateCardPosition = () => {
      const rect = card.getBoundingClientRect();

      cardCache.set(card, {
        index,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        currentState: "normal",
      });
    };

    updateCardPosition();

    window.addEventListener("resize", updateCardPosition);
    window.addEventListener("scroll", updateCardPosition);
  });
}

initializeCardCache();

function getDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createImageElement(imageSrc) {
  const img = document.createElement("img");

  img.setAttribute("src", imageSrc);
  img.setAttribute("draggable", "false");
  img.classList.add("card-hover-image"); // Add class for easy identification

  img.style.width = "50%";
  img.style.height = "auto";
  img.style.objectFit = "contain";
  img.style.position = "absolute";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.transform = "translate(-50%, -50%) scale(0)";
  img.style.transformOrigin = "center";
  img.style.transition = "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  img.style.pointerEvents = "none";
  img.style.zIndex = "10";

  return img;
}

// COMPLETELY NEW APPROACH: Clear all images first, then add only what's needed
function clearAllImages() {
  // Remove all images from all cards immediately
  cards.forEach((card) => {
    const allImages = card.querySelectorAll(".card-hover-image");
    allImages.forEach((img) => {
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
    });
  });
}

function addImageToElement(element, imageSrc) {
  if (!element) return;

  // Double-check no images exist on this element
  const existingImages = element.querySelectorAll(".card-hover-image");
  existingImages.forEach((img) => {
    if (img.parentNode) {
      img.parentNode.removeChild(img);
    }
  });

  // Create and add new image
  const img = createImageElement(imageSrc);
  element.appendChild(img);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      img.style.transform = "translate(-50%, -50%) scale(1)";
    });
  });
}

function selectStableDarkBlueCards(
  cardDistances,
  startIndex,
  endIndex,
  count = 3
) {
  if (darkBlueSelectionLocked && selectedDarkBlueCards.size === count) {
    const rangeCards = cardDistances.slice(startIndex, endIndex);
    const currentRangeCardSet = new Set(rangeCards.map((item) => item.card));

    const stillValid = Array.from(selectedDarkBlueCards).every((card) =>
      currentRangeCardSet.has(card)
    );

    if (stillValid) {
      return Array.from(selectedDarkBlueCards);
    }
  }

  if (!selectionCooldown) {
    const rangeCards = cardDistances.slice(startIndex, endIndex);
    selectedDarkBlueCards.clear();

    const shuffled = shuffleArray(rangeCards);
    const selectedItems = shuffled.slice(0, Math.min(count, shuffled.length));

    selectedItems.forEach((item) => selectedDarkBlueCards.add(item.card));
    darkBlueSelectionLocked = true;

    selectionCooldown = true;
    setTimeout(() => {
      selectionCooldown = false;
    }, 500);
  }

  return Array.from(selectedDarkBlueCards);
}

function applyCardEffects(mouseX, mouseY) {
  if (isProcessing) return;

  const mouseDelta =
    Math.abs(mouseX - lastMousePosition.x) +
    Math.abs(mouseY - lastMousePosition.y);
  if (mouseDelta < 3) return;

  lastMousePosition = { x: mouseX, y: mouseY };
  isProcessing = true;

  // Calculate distances for all cards
  const cardDistances = [];
  cards.forEach((card) => {
    const cardData = cardCache.get(card);
    if (cardData) {
      const distance = getDistance(
        mouseX,
        mouseY,
        cardData.centerX,
        cardData.centerY
      );
      cardDistances.push({ card, distance, cardData });
    }
  });

  // Sort by distance
  cardDistances.sort((a, b) => a.distance - b.distance);

  // STEP 1: Clear ALL images from ALL cards first
  clearAllImages();

  // STEP 2: Reset counters for fresh selection
  lightBlueCounter = 0;
  greyCounter = 0;
  darkBlueCounter = 0;

  // STEP 3: Get dark blue cards for this frame
  const darkBlueCardsList = selectStableDarkBlueCards(cardDistances, 24, 36, 3);
  const darkBlueCardSet = new Set(darkBlueCardsList);

  // STEP 4: Apply states and add ONLY the images that should be there
  cardDistances.forEach(({ card, cardData }, index) => {
    const frontElement = card.querySelector(".cb25-pf-front");
    const backElement = card.querySelector(".cb25-pf-back");

    if (index < 12) {
      // Closest 12 cards: flip
      card.classList.add("flipped");
      cardData.currentState = "flipped";

      // Clear front element background
      if (frontElement) {
        frontElement.style.background = "";
      }

      // Add light blue images ONLY to first 3 flipped cards on back element
      if (index < 3 && backElement) {
        const imageSrc =
          lightBlueImages[lightBlueCounter % lightBlueImages.length];
        addImageToElement(backElement, imageSrc);
        lightBlueCounter++;
      }
    } else if (index >= 12 && index < 24) {
      // Next 12 cards: gradient background (NO IMAGES)
      card.classList.remove("flipped");
      cardData.currentState = "gradient";

      if (frontElement) {
        frontElement.style.background =
          "linear-gradient(225deg, #DFE9FA 23.28%, #A0B9E6 95.35%), linear-gradient(90deg, #F6F6F6 0%, #D0CDCD 100%), #D9D9D9";
      }
      // No images added to gradient cards
    } else if (darkBlueCardSet.has(card)) {
      // Selected cards for dark blue images
      card.classList.remove("flipped");
      cardData.currentState = "darkBlue";

      if (frontElement) {
        frontElement.style.background = "";
        // Add dark blue image to front element
        const imageSrc =
          darkBlueImages[darkBlueCounter % darkBlueImages.length];
        addImageToElement(frontElement, imageSrc);
        darkBlueCounter++;
      }
    } else if (index >= cardDistances.length - 3) {
      // Farthest 3 cards: grey images
      card.classList.remove("flipped");
      cardData.currentState = "grey";

      if (frontElement) {
        frontElement.style.background = "";
        // Add grey image to front element
        const imageSrc = greyImages[greyCounter % greyImages.length];
        addImageToElement(frontElement, imageSrc);
        greyCounter++;
      }
    } else {
      // Reset all other cards (NO IMAGES)
      card.classList.remove("flipped");
      cardData.currentState = "normal";

      if (frontElement) {
        frontElement.style.background = "";
      }
      // No images added to normal cards
    }
  });

  isProcessing = false;
}

// Event handling
let animationFrameId = null;

function handleMouseMove(e) {
  if (animationFrameId) return;

  animationFrameId = requestAnimationFrame(() => {
    const mousePos = getMousePosition(e);
    applyCardEffects(mousePos.x, mousePos.y);
    animationFrameId = null;
  });
}

function handleMouseLeave() {
  // Clear all images immediately
  clearAllImages();

  // Reset all cards
  cards.forEach((card) => {
    const cardData = cardCache.get(card);
    if (cardData) {
      card.classList.remove("flipped");
      cardData.currentState = "normal";

      const frontElement = card.querySelector(".cb25-pf-front");
      if (frontElement) {
        frontElement.style.background = "";
      }
    }
  });

  // Reset selections
  selectedDarkBlueCards.clear();
  darkBlueSelectionLocked = false;
  selectionCooldown = false;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function handleTouchEvent(e) {
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    const mousePos = getMousePosition(touch);

    if (animationFrameId) return;

    animationFrameId = requestAnimationFrame(() => {
      applyCardEffects(mousePos.x, mousePos.y);
      animationFrameId = null;
    });
  }
}

// Auto-play functionality for tablets and mobile
let autoPlayInterval = null;
let autoPlayActive = false;
let autoPlayMouseX = 0;
let autoPlayMouseY = 0;
let autoPlayPositions = [];
let currentPositionIndex = 0;
let autoPlaySpeed = 0.05; // Very slow movement

function isMobileOrTablet() {
  return (
    window.innerWidth <= 1024 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    "ontouchstart" in window
  );
}

function getGridBounds() {
  if (!gridContainer) return null;
  const rect = gridContainer.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
}

function generateRandomPositions() {
  const bounds = getGridBounds();
  if (!bounds) return [];

  const positions = [];
  const padding = 60;

  // For tablet/mobile with 30 cards, create strategic positions
  // that will hit different areas and card arrangements
  const numPositions = isMobileOrTablet() ? 8 : 12;

  // Create a grid of potential positions to ensure good coverage
  const gridCols = isMobileOrTablet() ? 3 : 4;
  const gridRows = isMobileOrTablet() ? 3 : 3;

  const cellWidth = (bounds.width - 2 * padding) / gridCols;
  const cellHeight = (bounds.height - 2 * padding) / gridRows;

  // Generate positions in different cells to ensure variety
  const usedCells = new Set();

  for (let i = 0; i < numPositions; i++) {
    let cellIndex;
    let attempts = 0;

    // Find an unused cell
    do {
      cellIndex = Math.floor(Math.random() * (gridCols * gridRows));
      attempts++;
    } while (usedCells.has(cellIndex) && attempts < 20);

    usedCells.add(cellIndex);

    const cellRow = Math.floor(cellIndex / gridCols);
    const cellCol = cellIndex % gridCols;

    // Add some randomness within the cell
    const cellX = bounds.left + padding + cellCol * cellWidth;
    const cellY = bounds.top + padding + cellRow * cellHeight;

    positions.push({
      x: cellX + Math.random() * cellWidth * 0.8 + cellWidth * 0.1,
      y: cellY + Math.random() * cellHeight * 0.8 + cellHeight * 0.1,
      id: Date.now() + Math.random(), // Unique identifier for debugging
    });
  }

  // Shuffle the positions for random order
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  return positions;
}

function startAutoPlay() {
  if (autoPlayActive || !isMobileOrTablet()) return;

  autoPlayActive = true;
  const bounds = getGridBounds();

  if (!bounds) return;

  // Generate random positions to click
  autoPlayPositions = generateRandomPositions();
  currentPositionIndex = 0;

  // Start at first position
  if (autoPlayPositions.length > 0) {
    autoPlayMouseX = autoPlayPositions[0].x;
    autoPlayMouseY = autoPlayPositions[0].y;
  }

  autoPlayInterval = setInterval(() => {
    if (!autoPlayActive || autoPlayPositions.length === 0) return;

    // Get current target position
    const targetPosition = autoPlayPositions[currentPositionIndex];

    // Move very slowly towards target position
    const deltaX = targetPosition.x - autoPlayMouseX;
    const deltaY = targetPosition.y - autoPlayMouseY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < 3) {
      // We've reached the target, move to next position
      currentPositionIndex =
        (currentPositionIndex + 1) % autoPlayPositions.length;

      // If we've completed a cycle, generate completely new random positions
      if (currentPositionIndex === 0) {
        setTimeout(() => {
          autoPlayPositions = generateRandomPositions();
          console.log("Generated new positions:", autoPlayPositions.length); // Debug log
        }, 500); // Small delay before generating new positions
      }
    } else {
      // Move towards target at very slow speed
      const moveX = (deltaX / distance) * autoPlaySpeed;
      const moveY = (deltaY / distance) * autoPlaySpeed;

      autoPlayMouseX += moveX;
      autoPlayMouseY += moveY;
    }

    // Apply effects using the virtual mouse position
    if (animationFrameId) return;

    animationFrameId = requestAnimationFrame(() => {
      applyCardEffects(autoPlayMouseX, autoPlayMouseY);
      animationFrameId = null;
    });
  }, 150); // Slightly slower update rate for ultra-gentle movement
}

function stopAutoPlay() {
  autoPlayActive = false;
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
  autoPlayPositions = [];
  currentPositionIndex = 0;
  handleMouseLeave();
}

function pauseAutoPlay() {
  autoPlayActive = false;
}

function resumeAutoPlay() {
  if (isMobileOrTablet() && autoPlayInterval) {
    autoPlayActive = true;
  }
}

// Enhanced mouse/touch handlers that work with auto-play
function handleMouseMove(e) {
  // Stop auto-play when user interacts
  if (autoPlayActive) {
    stopAutoPlay();
  }

  if (animationFrameId) return;

  animationFrameId = requestAnimationFrame(() => {
    const mousePos = getMousePosition(e);
    applyCardEffects(mousePos.x, mousePos.y);
    animationFrameId = null;
  });
}

function handleMouseLeave() {
  // Clear all images immediately
  clearAllImages();

  // Reset all cards
  cards.forEach((card) => {
    const cardData = cardCache.get(card);
    if (cardData) {
      card.classList.remove("flipped");
      cardData.currentState = "normal";

      const frontElement = card.querySelector(".cb25-pf-front");
      if (frontElement) {
        frontElement.style.background = "";
      }
    }
  });

  // Reset selections
  selectedDarkBlueCards.clear();
  darkBlueSelectionLocked = false;
  selectionCooldown = false;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  // Restart auto-play after a short delay if on mobile
  if (isMobileOrTablet()) {
    setTimeout(() => {
      startAutoPlay();
    }, 2000); // 2 second delay before auto-play resumes
  }
}

function handleTouchEvent(e) {
  // Stop auto-play when user touches
  if (autoPlayActive) {
    pauseAutoPlay();
  }

  if (e.touches.length === 1) {
    const touch = e.touches[0];
    const mousePos = getMousePosition(touch);

    if (animationFrameId) return;

    animationFrameId = requestAnimationFrame(() => {
      applyCardEffects(mousePos.x, mousePos.y);
      animationFrameId = null;
    });
  }
}

function handleTouchEnd() {
  // Resume auto-play after touch ends (with delay)
  setTimeout(() => {
    if (isMobileOrTablet()) {
      resumeAutoPlay();
    }
  }, 3000); // 3 second delay before resuming auto-play
}

// Intersection Observer to start/stop auto-play when grid is visible
function setupVisibilityObserver() {
  if (!gridContainer || !("IntersectionObserver" in window)) {
    // Fallback: start immediately if no intersection observer
    if (isMobileOrTablet()) {
      setTimeout(startAutoPlay, 1000);
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Grid is visible, start auto-play for mobile
          if (isMobileOrTablet()) {
            setTimeout(startAutoPlay, 1000);
          }
        } else {
          // Grid is not visible, stop auto-play
          stopAutoPlay();
        }
      });
    },
    {
      threshold: 0.3, // Start when 30% of grid is visible
    }
  );

  observer.observe(gridContainer);
}

// Add event listeners
if (gridContainer) {
  gridContainer.addEventListener("mousemove", handleMouseMove, {
    passive: true,
  });
  gridContainer.addEventListener("mouseleave", handleMouseLeave, {
    passive: true,
  });
  gridContainer.addEventListener("touchstart", handleTouchEvent, {
    passive: true,
  });
  gridContainer.addEventListener("touchmove", handleTouchEvent, {
    passive: true,
  });
  gridContainer.addEventListener("touchend", handleTouchEnd, { passive: true });

  // Setup visibility observer for auto-play
  setupVisibilityObserver();

  // Handle page visibility changes
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoPlay();
    } else if (isMobileOrTablet()) {
      setTimeout(startAutoPlay, 1000);
    }
  });

  // Handle resize events
  window.addEventListener("resize", () => {
    if (autoPlayActive) {
      stopAutoPlay();
      if (isMobileOrTablet()) {
        setTimeout(startAutoPlay, 500);
      }
    }
  });
}
