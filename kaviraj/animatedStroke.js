document.querySelectorAll('[data-animatedStroke="true"]').forEach(targetEl => {
  const rect = targetEl.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const config = {
    strokeWidth: parseFloat(targetEl.getAttribute("data-animatedStroke-width")) || animatedStrokeConfig.strokeWidth,
    duration: parseFloat(targetEl.getAttribute("data-animatedStroke-duration")) || animatedStrokeConfig.duration,
    delay: parseFloat(targetEl.getAttribute("data-animatedStroke-delay")) || animatedStrokeConfig.delay,
    easing: targetEl.hasAttribute("data-animatedStroke-easing")
      ? targetEl.getAttribute("data-animatedStroke-easing")
      : animatedStrokeConfig.easing,
    color: targetEl.getAttribute("data-animatedStroke-color") || animatedStrokeConfig.color,
    segmentLength: parseInt(targetEl.getAttribute("data-animatedStroke-segmentLength")) || animatedStrokeConfig.segmentLength
  };

  createAnimatedStrokeCanvas(targetEl, config);
});

function createAnimatedStrokeCanvas(targetEl, config) {
  let {
    strokeWidth,
    duration,
    delay,
    easing: easingStr,
    color,
    segmentLength
  } = config;

  let easing;

  if (typeof easingStr === "function") {
    easing = easingStr;
  } else {
    try {
      const parts = easingStr.split(",").map(s => parseFloat(s.trim()));
      if (parts.length === 4 && parts.every(n => !isNaN(n))) {
        easing = createBezierEasing(...parts);
      } else {
        throw new Error("Invalid easing format");
      }
    } catch {
      console.warn("Invalid easing provided:", easingStr, "— falling back to linear.");
      easing = t => t;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.className = "animated-stroke-canvas";
  targetEl.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let path = [];
  let baseSegmentLength = segmentLength;
  let animatedLength = baseSegmentLength;
  let targetLength = baseSegmentLength;
  let animationState = "idle";
  let shouldSnapToZeroAfterExpand = false;
  let isPaused = false;
  let startTime = null;
  let cycleProgress = 0;
  let pathIndexOverride = null;

  targetEl.addEventListener("mouseenter", () => {
    targetLength = path.length;
    animationState = "expanding";
    shouldSnapToZeroAfterExpand = true;
  });

  targetEl.addEventListener("mouseleave", () => {
    pathIndexOverride = 0;
    targetLength = baseSegmentLength;
    animationState = "collapsing";
  });

function resizeAndRedrawPath() {
  const dpr = window.devicePixelRatio || 1;
  const rect = targetEl.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = 1;
  canvas.style.pointerEvents = 'none';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale rendering for HiDPI
  path = generatePillPath(rect.width, rect.height, strokeWidth);
}


  const resizeObserver = new ResizeObserver(resizeAndRedrawPath);
  resizeObserver.observe(targetEl);
  resizeAndRedrawPath();

  function generatePillPath(width, height, strokeWidth) {
    const path = [];
    const steps = 1000;
    const xOffset = strokeWidth / 2;
    const yOffset = strokeWidth / 2;
    const drawWidth = width - strokeWidth;
    const drawHeight = height - strokeWidth;
    const r = drawHeight / 2;
    const totalLength = 2 * (drawWidth - 2 * r) + 2 * Math.PI * r;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      let px, py;
      const dist = t * totalLength;

      if (dist <= drawWidth - 2 * r) {
        px = xOffset + r + dist;
        py = yOffset;
      } else if (dist <= drawWidth - 2 * r + Math.PI * r) {
        const a = (dist - (drawWidth - 2 * r)) / (Math.PI * r);
        const theta = Math.PI * 1.5 + a * Math.PI;
        px = xOffset + drawWidth - r + r * Math.cos(theta);
        py = yOffset + r + r * Math.sin(theta);
      } else if (dist <= 2 * (drawWidth - 2 * r) + Math.PI * r) {
        const d = dist - (drawWidth - 2 * r + Math.PI * r);
        px = xOffset + drawWidth - r - d;
        py = yOffset + drawHeight;
      } else {
        const a = (dist - (2 * (drawWidth - 2 * r) + Math.PI * r)) / (Math.PI * r);
        const theta = Math.PI / 2 + a * Math.PI;
        px = xOffset + r + r * Math.cos(theta);
        py = yOffset + r + r * Math.sin(theta);
      }

      path.push({ x: px, y: py });
    }

    return path;
  }

  function drawSegment(segmentPoints) {
    if (!segmentPoints.length || !segmentPoints[0] || !segmentPoints[segmentPoints.length - 1]) return;

    const start = segmentPoints[0];
    const end = segmentPoints[segmentPoints.length - 1];
    const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);

    const startAlpha = targetLength === path.length ? 1 : 0;
    const endAlpha = 1;

    gradient.addColorStop(0, hexToRgba(color, startAlpha));
    gradient.addColorStop(1, hexToRgba(color, endAlpha));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.shadowColor = hexToRgba(color, 0.4);
    ctx.shadowBlur = 10;
    ctx.beginPath();
    segmentPoints.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.strokeStyle = gradient;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawFrame(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    const diff = targetLength - animatedLength;
    animatedLength += diff * 0.1;

    if (
      animationState === "expanding" &&
      Math.abs(diff) < 1 &&
      shouldSnapToZeroAfterExpand
    ) {
      pathIndexOverride = 0;
      isPaused = true;
      shouldSnapToZeroAfterExpand = false;
    }

    if (animationState === "collapsing" && Math.abs(diff) < 1) {
      animatedLength = baseSegmentLength;
      animationState = "idle";
      isPaused = false;
      pathIndexOverride = null;
      startTime = performance.now();
      cycleProgress = 0;
    }

    if (!isPaused) {
      cycleProgress = (timestamp - startTime) % (duration + delay);
    }

    const easedT = easing(cycleProgress / duration);
    const rawPathIndex = pathIndexOverride !== null
      ? pathIndexOverride
      : Math.floor(easedT * path.length);

    const pathIndex = isFinite(rawPathIndex) && path.length > 0
      ? rawPathIndex % path.length
      : 0;

    const segmentCount = Math.max(1, Math.floor(animatedLength));
    const segmentPoints = [];

    if (path.length > 0) {
      for (let i = 0; i < segmentCount; i++) {
        segmentPoints.push(path[(pathIndex + i) % path.length]);
      }
    }

    drawSegment(segmentPoints);
    requestAnimationFrame(drawFrame);
  }

  requestAnimationFrame(drawFrame);
}

function hexToRgba(hex, alpha) {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
}

function createBezierEasing(p1x, p1y, p2x, p2y, epsilon = 0.0001) {
  function cubic(a, b, c, t) {
    return ((a * t + b) * t + c) * t;
  }

  function derivative(a, b, c, t) {
    return 3 * a * t * t + 2 * b * t + c;
  }

  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  function solve(x) {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const x2 = cubic(ax, bx, cx, t) - x;
      const d = derivative(ax, bx, cx, t);
      if (Math.abs(x2) < epsilon) return t;
      if (Math.abs(d) < 1e-6) break;
      t -= x2 / d;
    }
    let t0 = 0, t1 = 1;
    while (t0 < t1) {
      const x2 = cubic(ax, bx, cx, t);
      if (Math.abs(x2 - x) < epsilon) return t;
      if (x > x2) t0 = t;
      else t1 = t;
      t = (t0 + t1) / 2;
    }
    return t;
  }

  return function(x) {
    return cubic(ay, by, cy, solve(x));
  };
}
