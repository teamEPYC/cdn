// --- CONFIG ---
const VIDEO_URL = "https://teamepyc.github.io/cdn/kaviraj/v2/videos/balcony.mp4";

// --- IMPORT DECODER MODULE ---
import { FrameDecoder } from "./decoder.js";

// --- CANVAS SETUP ---
const canvas = document.getElementById("wc-canvas");
const ctx = canvas.getContext("2d", { alpha: true });

function sizeCanvas() {
  const w = window.innerWidth;
  const h = Math.round(w * 9 / 16);
  canvas.width = w;
  canvas.height = h;
}
sizeCanvas();

// --- MAIN ---
(async () => {
  const decoder = new FrameDecoder();
  await decoder.init(VIDEO_URL);

  let running = true;

  // Render loop
  const loop = () => {
    if (!running) return;
    decoder.drawFrame(ctx, canvas.width, canvas.height);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  // Scroll-driven video frame
  gsap.to({}, {
    scrollTrigger: {
      trigger: ".spacer",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        let f = self.progress;
        if (f >= 1) f = 0.999999; // Prevent tail freeze
        decoder.seek(f);
      }
    }
  });

  // Resize handler
  window.addEventListener("resize", sizeCanvas);

  // Cleanup
  window.addEventListener("beforeunload", () => {
    running = false;
    decoder.destroy();
  });

})();
