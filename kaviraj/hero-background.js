if (window.innerWidth > 991) {
  // Optional: crisper on HiDPI - increase for better quality
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  // TOP OF FILE (before DOMContentLoaded and before any use)
  let driver; // <-- hoist
  let seqTexture; // <-- hoist so both blocks share the SAME texture

  /* ========= Sequence Driver (GSAP-friendly, transparent + cover) ========= */
  function initSequenceDriver({
    container,
    canvas,
    total = 1,
    firstFile = 1,
    maxConnectionLimit = 100,
    urlFor,
  } = {}) {
    const containerEl =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    const canvasEl =
      typeof canvas === "string" ? document.querySelector(canvas) : canvas;

    if (!containerEl) {
      console.error("[seq] container not found");
      return null;
    }
    if (!canvasEl) {
      console.error("[seq] canvas not found");
      return null;
    }

    // Use WebGL only. Drive frames via a THREE.Texture (updated per frame).
    seqTexture = seqTexture || null; // no-op but makes intent clear

    // ---- Config ----
    const TOTAL = total;
    const FIRST_FILE_NUM = firstFile;
    const FRAME_STRIDE = 1; // change image every 2 ticks (halve unique requests)
    const SKIP_FRAME_NUM =
      typeof window.sequenceSkipFrameNumber === "number"
        ? window.sequenceSkipFrameNumber | 0
        : NaN; // optional absolute frame number to skip

    // Function to get canonical index for a logical index
    function canonicalIndex(i) {
      const abs = FIRST_FILE_NUM + i;
      let canon =
        FIRST_FILE_NUM +
        Math.floor((abs - FIRST_FILE_NUM) / FRAME_STRIDE) * FRAME_STRIDE;
      if (!Number.isNaN(SKIP_FRAME_NUM) && canon === SKIP_FRAME_NUM) canon++;
      return canon;
    }

    // URL function for canonical indices
    function URL_FOR_CANON(canon) {
      const fileNum = String(canon).padStart(4, "0");
      return `https://test-kaviraj.epyc.in/Hallway-WEBP-75/${fileNum}.webp`;
    }

    const URL_FOR =
      urlFor ||
      ((i) => {
        // Map logical index to a physical frame by stride, optionally skipping one frame
        const absolute = FIRST_FILE_NUM + i; // absolute frame number (1-based or start)
        let mapped =
          FIRST_FILE_NUM +
          Math.floor((absolute - FIRST_FILE_NUM) / FRAME_STRIDE) * FRAME_STRIDE;
        if (!Number.isNaN(SKIP_FRAME_NUM) && mapped === SKIP_FRAME_NUM) {
          mapped = mapped + 1; // skip exactly one image in the whole sequence
        }
        const fileNum = String(mapped).padStart(4, "0");
        return `https://test-kaviraj.epyc.in/Hallway-WEBP-75/${fileNum}.webp`;
      });

    // ---- Performance knobs ----
    const settings = window.mobileOptimizedSettings || {};
    const DPR_CAP = settings.DPR_CAP ?? 2;
    const MAX_CACHE = settings.MAX_CACHE ?? 200;
    const PREFETCH_AHEAD = settings.PREFETCH_AHEAD ?? 100;
    const PREFETCH_BEHIND = settings.PREFETCH_BEHIND ?? 50;
    const isSafari =
      /safari/i.test(navigator.userAgent) &&
      !/chrome|crios|fxios/i.test(navigator.userAgent);

    // ---- State ----
    const DPR = Math.min(window.devicePixelRatio || 2, DPR_CAP);

    // Cache by canonical index (URL-level key) instead of logical index
    const bmpCache = new Map(); // canonicalIndex → ImageBitmap
    const blobCache = new Map(); // canonicalIndex → Blob (optional)
    const inflight = new Map(); // canonicalIndex → Promise

    let currentIndex = 0;
    let isVisible = true;

    // ADD THESE NEW LINES:
    let activeConnections = 0;
    const pendingQueue = [];

    // ADD THIS ENTIRE FUNCTION:
    async function fetchWithLimit(url, options = {}) {
      return new Promise((resolve, reject) => {
        const executeRequest = async () => {
          if (activeConnections >= maxConnectionLimit) {
            pendingQueue.push(executeRequest);
            return;
          }

          activeConnections++;

          try {
            const response = await fetch(url, {
              cache: "force-cache",
              ...options,
            });
            resolve(response);
          } catch (error) {
            reject(error);
          } finally {
            activeConnections--;

            if (pendingQueue.length > 0) {
              const nextRequest = pendingQueue.shift();
              setTimeout(nextRequest, 0);
            }
          }
        };

        executeRequest();
      });
    }

    // Load canonical frame with deduplication
    async function loadCanonical(canon) {
      if (bmpCache.has(canon)) return bmpCache.get(canon);
      if (inflight.has(canon)) return inflight.get(canon);

      const p = (async () => {
        try {
          const res = await fetchWithLimit(URL_FOR_CANON(canon), {
            cache: "force-cache",
          });
          const blob = await res.blob();
          blobCache.set(canon, blob);

          const bmp =
            "createImageBitmap" in window && !isSafari
              ? await createImageBitmap(blob)
              : await new Promise((resolve, reject) => {
                  const img = new Image();
                  img.onload = () => resolve(img);
                  img.onerror = reject;
                  img.src = URL.createObjectURL(blob);
                });

          bmpCache.set(canon, bmp);
          return bmp;
        } catch (e) {
          console.warn("[seq] load error", canon, e);
          return null;
        } finally {
          inflight.delete(canon);
        }
      })();

      inflight.set(canon, p);
      return p;
    }

    async function loadFrame(i) {
      if (i < 0 || i >= TOTAL) return null;
      return loadCanonical(canonicalIndex(i));
    }

    // Ensure the first frame is loaded initially
    loadFrame(0).then(() => {
      if (window.sequenceDriver) {
        // Start the sequence from the first image
        window.sequenceDriver.setFrame(0); // Set the first frame explicitly
      }
    });

    function pruneCache(center) {
      if (bmpCache.size <= MAX_CACHE) return;
      const keys = Array.from(bmpCache.keys()).sort(
        (a, b) => Math.abs(a - center) - Math.abs(b - center)
      );
      const keep = new Set(keys.slice(0, MAX_CACHE));
      for (const [k, v] of bmpCache) {
        if (!keep.has(k)) {
          if (v && "close" in v) {
            try {
              v.close();
            } catch {}
          }
          bmpCache.delete(k);
          blobCache.delete(k); // Also clean up blob cache
        }
      }
    }

    function nearestLoaded(i) {
      const canon = canonicalIndex(i);
      if (bmpCache.has(canon)) return i;
      const span = Math.max(i, TOTAL - 1 - i);
      for (let d = 1; d <= span; d++) {
        const L = i - d,
          R = i + d;
        if (L >= 0 && bmpCache.has(canonicalIndex(L))) return L;
        if (R < TOTAL && bmpCache.has(canonicalIndex(R))) return R;
      }
      return null;
    }

    function render(i) {
      const canon = canonicalIndex(i);
      const img = bmpCache.get(canon);
      if (!img || !seqTexture) return;

      // Assign the image to the texture; Three.js will manage texture size.
      // Avoid overriding image dimensions to prevent exceeding max texture size (Safari/Three clamps at 16384).
      seqTexture.image = img;
      seqTexture.needsUpdate = true;
    }

    function prefetchAround(center) {
      if (!isVisible) return;
      const targets = [];
      for (let d = 0; d <= Math.max(PREFETCH_AHEAD, PREFETCH_BEHIND); d++) {
        const steps = d === 0 ? [0] : [1, -1];
        for (const s of steps) {
          const idx = center + d * s;
          const within = s >= 0 ? d <= PREFETCH_AHEAD : d <= PREFETCH_BEHIND;
          if (
            within &&
            idx >= 0 &&
            idx < TOTAL &&
            !bmpCache.has(canonicalIndex(idx))
          )
            targets.push(idx);
        }
      }

      function scheduleIdle(cb, delay = 0) {
        if ("requestIdleCallback" in window) {
          return window.requestIdleCallback(
            cb,
            delay ? { timeout: delay } : undefined
          );
        }
        return setTimeout(cb, delay);
      }

      const step = async () => {
        const idx = targets.shift();
        if (idx === undefined) return;
        try {
          await loadFrame(idx);
        } catch {}
        if (targets.length) scheduleIdle(step, 50);
      };
      step();
    }

    // Visibility guard
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = !!entries[0]?.isIntersecting;
        if (isVisible) prefetchAround(currentIndex);
      },
      { threshold: 0 }
    );
    io.observe(containerEl);

    // Public API for GSAP
    driver = {
      // Warm the decode cache for all canonical frames
      // Updates progressCallback(percentage0to100) as it goes.
      async preloadAll(progressCallback) {
        const canons = [
          ...new Set(
            Array.from({ length: TOTAL }, (_, i) => canonicalIndex(i))
          ),
        ];
        let done = 0;
        const limit = isSafari ? 2 : maxConnectionLimit;

        const update = () => {
          if (typeof progressCallback === "function") {
            const pct = Math.floor((done / canons.length) * 100);
            progressCallback(Math.min(100, pct));
          }
        };

        return new Promise((resolve) => {
          let running = 0;
          let index = 0;
          const targetLoad = Math.ceil(canons.length * 0.5); // Load only 50% of assets

          const pump = () => {
            while (running < limit && index < canons.length) {
              const canon = canons[index++];
              running++;
              loadCanonical(canon)
                .catch(() => {})
                .finally(() => {
                  done++;
                  running--;
                  update();
                  if (done >= targetLoad)
                    resolve(); // Resolve at 50% completion
                  else pump();
                });
            }
          };
          update();
          pump();
        });
      },
      setProgress(from, to, t) {
        const span = to - from;
        const raw = from + span * t;
        // Advance logical index as normal, but URL_FOR will collapse to stride frames
        const idx = span >= 0 ? Math.floor(raw) : Math.ceil(raw);
        const clamped = Math.max(0, Math.min(TOTAL - 1, idx));
        const drawIdx = bmpCache.has(canonicalIndex(clamped))
          ? clamped
          : nearestLoaded(clamped) ?? currentIndex;
        render(drawIdx);
        prefetchAround(clamped);
      },
      setFrame(i) {
        const clamped = Math.max(0, Math.min(TOTAL - 1, i | 0));
        const drawIdx = bmpCache.has(canonicalIndex(clamped))
          ? clamped
          : nearestLoaded(clamped) ?? currentIndex;
        render(drawIdx);
        prefetchAround(clamped);
      },
      segment({
        from = 0,
        to = TOTAL - 1,
        duration = 1,
        ease = "none",
        onStartFrame,
      } = {}) {
        const proxy = { t: 0 };
        // warm endpoints (URL_FOR already respects stride/skip)
        loadFrame(Math.max(0, Math.min(TOTAL - 1, from)));
        loadFrame(Math.max(0, Math.min(TOTAL - 1, to)));
        return gsap.to(proxy, {
          t: 1,
          duration,
          ease,
          onStart: () => {
            if (onStartFrame != null) driver.setFrame(onStartFrame);
            else driver.setProgress(from, to, 0);
          },
          onUpdate: () => driver.setProgress(from, to, proxy.t),
        });
      },
      destroy() {
        io.disconnect();
        pendingQueue.length = 0;
        for (const v of bmpCache.values())
          if (v && "close" in v) {
            try {
              v.close();
            } catch {}
          }
        bmpCache.clear();
        blobCache.clear();
        inflight.clear();
      },
    };

    return driver;
  }

  // PATCH 1: Mobile Detection and Performance Settings
  // Replace the existing performance knobs section with this:

  function getMobileOptimizedSettings() {
    const isMobile = window.innerWidth <= 768;
    const isLowEnd =
      navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;

    return {
      DPR_CAP: isMobile ? 1 : 2,
      MAX_CACHE: isMobile ? (isLowEnd ? 0 : 1) : 100,
      PREFETCH_AHEAD: isMobile ? 0 : 100,
      PREFETCH_BEHIND: 50,
      ANIMATION_QUALITY: isMobile ? "low" : "high",
    };
  }

  // PATCH 2: WebGL Context Loss Handler
  // Add this function and integrate it into your renderer setup:

  function addWebGLContextHandlers(renderer, material, onContextRestore) {
    const canvas = renderer.domElement;

    canvas.addEventListener("webglcontextlost", (event) => {
      console.warn("WebGL context lost");
      event.preventDefault();
    });

    canvas.addEventListener("webglcontextrestored", () => {
      console.log("WebGL context restored");
      // Recreate textures and materials
      if (material && material.uniforms.u_image.value) {
        material.uniforms.u_image.value.needsUpdate = true;
      }
      if (onContextRestore) onContextRestore();
    });
  }

  // PATCH 4: Library Loading Guards
  // Replace the library checks with this comprehensive version:

  function checkRequiredLibraries() {
    const required = {
      gsap: window.gsap,
      ScrollTrigger: window.ScrollTrigger,
      THREE: window.THREE,
      SplitText: window.SplitText,
    };

    const missing = Object.entries(required)
      .filter(([name, lib]) => !lib)
      .map(([name]) => name);

    if (missing.length > 0) {
      console.error(`Missing required libraries: ${missing.join(", ")}`);
      return false;
    }

    // Register ScrollTrigger if available
    try {
      if (!gsap.core.globals().ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }
    } catch (e) {
      console.error("Failed to register ScrollTrigger:", e);
      return false;
    }

    return true;
  }

  // PATCH 5: Memory Pressure Handler
  // Add this to your cache management:

  function addMemoryPressureHandler(cache, driver) {
    let memoryWarningCount = 0;

    // Listen for memory pressure events
    if ("memory" in performance) {
      setInterval(() => {
        const memInfo = performance.memory;
        const usedRatio = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;

        if (usedRatio > 0.8) {
          memoryWarningCount++;
          console.warn(`High memory usage: ${Math.round(usedRatio * 100)}%`);

          // Aggressive cache clearing on mobile
          if (window.innerWidth <= 768 && memoryWarningCount > 2) {
            cache.clear();
            if (driver && driver.pruneCache) {
              driver.pruneCache(0); // Clear everything except current frame
            }
          }
        } else {
          memoryWarningCount = Math.max(0, memoryWarningCount - 1);
        }
      }, 5000);
    }

    // Page visibility change handler
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && window.innerWidth <= 768) {
        // Clear cache when page becomes hidden on mobile
        setTimeout(() => {
          if (document.hidden) {
            cache.clear();
            console.log("Cache cleared due to page visibility change");
          }
        }, 30000); // 30 second delay
      }
    });
  }

  // PATCH 6: Enhanced Error Handling for Critical Operations
  // Wrap your main initialization with this:

  function safeInitialization(initFunction, fallbackFunction) {
    try {
      return initFunction();
    } catch (error) {
      console.error("Initialization failed:", error);

      // Try fallback or show error message
      if (fallbackFunction) {
        try {
          return fallbackFunction();
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      }

      // Show user-friendly error message
      const errorElement = document.createElement("div");
      errorElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 10000;
      text-align: center;
    `;
      errorElement.innerHTML = `
      <p>Animation temporarily unavailable</p>
      <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 15px;">Continue</button>
    `;
      document.body.appendChild(errorElement);

      return null;
    }
  }

  // PATCH 7: localStorage Safe Access
  // Replace localStorage calls with this wrapper:

  const SafeStorage = {
    getItem(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        try {
          return sessionStorage.getItem(key);
        } catch (e2) {
          return null;
        }
      }
    },

    setItem(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        try {
          sessionStorage.setItem(key, value);
          return true;
        } catch (e2) {
          return false;
        }
      }
    },
  };

  // PATCH 8: Mobile-Specific Renderer Configuration
  // Replace your THREE.js renderer setup with this:

  function createMobileOptimizedRenderer(canvas) {
    const settings = getMobileOptimizedSettings();

    const rendererConfig = {
      canvas,
      alpha: true,
      antialias: settings.ANIMATION_QUALITY === "high",
      powerPreference:
        window.innerWidth <= 768 ? "low-power" : "high-performance",
      stencil: false,
      depth: false,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: window.innerWidth <= 768,
      precision: window.innerWidth <= 768 ? "mediump" : "highp",
    };

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer(rendererConfig);
    } catch (error) {
      console.error("WebGL failed, trying fallback configuration");

      // Fallback configuration
      rendererConfig.antialias = false;
      rendererConfig.powerPreference = "low-power";
      rendererConfig.failIfMajorPerformanceCaveat = false;

      try {
        renderer = new THREE.WebGLRenderer(rendererConfig);
      } catch (fallbackError) {
        console.error("WebGL completely failed");
        return null;
      }
    }

    // Set conservative pixel ratio for mobile
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(1);

    return renderer;
  }

  // PATCH 9: Debounced Resize Handler
  // Replace your resize handlers with this:

  function createDebouncedResizeHandler(callback, delay = 250) {
    let timeoutId;
    let isResizing = false;

    return function (...args) {
      const executeCallback = () => {
        timeoutId = null;
        isResizing = false;
        callback.apply(this, args);
      };

      if (!isResizing) {
        isResizing = true;
        // Execute immediately on first call
        callback.apply(this, args);
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(executeCallback, delay);
    };
  }

  // PATCH 10: Integration Helper
  // Add this to integrate all patches into your existing code:

  function integratePatches() {
    // Check if we can proceed
    if (!checkRequiredLibraries()) {
      return false;
    }

    // Get optimized settings
    const settings = getMobileOptimizedSettings();

    // Apply settings globally
    window.mobileOptimizedSettings = settings;

    // Replace localStorage with SafeStorage
    window.SafeStorage = SafeStorage;

    // console.log("Mobile patches integrated successfully", settings);
    return true;
  }

  /* ========= Initialize AFTER DOM is ready ========= */
  document.addEventListener("DOMContentLoaded", () => {
    if (!integratePatches()) {
      console.log("integratedPatches not found");
      return; // Stop if patches failed to integrate
    }
    if (
      window.gsap &&
      window.ScrollTrigger &&
      !gsap.core.globals().ScrollTrigger
    ) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Ensure these elements exist in the DOM:
    // <div class="sequence-wrapper">...<canvas id="canvas"></canvas>...</div>

    driver = initSequenceDriver({
      container: ".background-test",
      canvas: "#loaderCanvas",
      total: 1150,
      firstFile: 1,
      maxConnectionLimit: 4,
    });

    if (!driver) {
      return; // hard stop if elements missing
    }

    // GSAP + ScrollTrigger must be loaded and registered
    if (!window.gsap || !gsap.core) {
      console.error("[seq] GSAP not loaded");
      return;
    }
    if (ScrollTrigger && !gsap.core.globals().ScrollTrigger)
      gsap.registerPlugin(ScrollTrigger);

    // Expose for debugging if needed
    window.sequenceDriver = driver;

    console.log("Home-lader-sequence-test.js loaded");

    // Start preloading all frames on page load with console progress
    try {
      driver
        .preloadAll((pct) => {
          console.log(`[sequence] preload ${pct}%`);
        })
        .then(() => {
          console.log("[sequence] preload complete");
        });
    } catch (e) {
      console.warn("[sequence] preloadAll failed", e);
    }

    if (window.innerWidth > 991) {
      // === CONFIG ===

      // === Renderer + scene + ortho camera ===
      const canvas = document.getElementById("loaderCanvas");
      const renderer = createMobileOptimizedRenderer(canvas);
      if (!renderer) {
        console.error(
          "Failed to create WebGL renderer, skipping 3D animations"
        );
        return; // Exit early if renderer creation failed
      }
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      // Add context loss/restore handlers right after renderer creation
      addWebGLContextHandlers(renderer, null, () => {
        console.log("WebGL context restored, reinitializing...");
        // Re-setup everything that depends on WebGL context
        onResize();
        if (seqTexture) {
          seqTexture.needsUpdate = true;
        }
      });

      // === ShaderMaterial using fbm-based circle + noise mask ===
      const material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          u_image: { value: null },
          u_resolution: { value: new THREE.Vector2() },
          u_radius: { value: 0.5 }, // Controls circle radius (0…0.5)
          u_uvScale: { value: new THREE.Vector2(1, 1) },
          u_uvOffset: { value: new THREE.Vector2(0, 0) },
        },
        vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
        fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_radius;
    uniform vec2 u_uvScale;
    uniform vec2 u_uvOffset;

    // --- noise/fbm funcs omitted for brevity (include yours here) ---
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);
      float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
      return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
    }
    float fbm(vec2 p){
      float v=0.0, amp=0.5, freq=12.0;
      for(int i=0; i<10; i++){
        v += amp * noise(p * freq);
        freq *= 1.0;
        amp   *= 0.05;
      }
      return clamp(v,0.0,1.0);
    }

    void main(){
      // 1) apply UV scaling/offset; correct mirror by flipping Y only
      vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
      uv = (uv - 0.5) * u_uvScale + 0.5 + u_uvOffset;
      

      // 2) compute circular mask with aspect correction
      vec2 uv_screen = gl_FragCoord.xy / u_resolution;
      vec2 diff      = uv_screen - vec2(0.5);
      diff.x       *= u_resolution.x / u_resolution.y;
      float d       = length(diff);

      // 3) add FBM jitter to edge
      float n    = fbm(uv * -2.5);
      float edge = d + (n * 0.1);

      // 4) smoothstep mask
      float m = smoothstep(u_radius, u_radius - 0.01, edge);

      // 5) sample and discard out-of-bounds UV
      vec4 c = texture2D(u_image, uv);
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        c.a = 0.0;
      }

      // 6) output with circular alpha
      gl_FragColor = vec4(c.rgb, c.a * m);
    }
  `,
      });

      // Create a texture to receive sequence frames
      seqTexture = new THREE.Texture();
      // Flip behavior: Safari = no flip, others = flip
      const isSafari =
        /safari/i.test(navigator.userAgent) &&
        !/chrome|crios|fxios/i.test(navigator.userAgent);
      seqTexture.flipY = !isSafari;
      seqTexture.minFilter = THREE.LinearFilter;
      seqTexture.magFilter = THREE.LinearFilter;
      seqTexture.generateMipmaps = false;

      // Point the shader to this live texture
      material.uniforms.u_image.value = seqTexture;
      material.uniforms.u_uvScale.value.set(1, 1); // Scaling the texture by 1.5

      // === Plane mesh ===
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

      // === Handle resize ===
      function onResize() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        console.log(w, h);
        material.uniforms.u_resolution.value.set(w, h);
      }

      window.addEventListener("resize", onResize);
      onResize();

      // === Render loop ===
      (function animate() {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      })();

      console.log("Button-loader-sequence");

      // Always gate by preload finishing; no hasVisited branches

      // Common setup
      function setupElements() {
        document
          .querySelectorAll(
            ".heading, .hero-subtext, .loader-prelude .primary-button-wrapper"
          )
          .forEach(
            (el) => (el.style.willChange = "transform, opacity, filter, width")
          );
      }

      // Create text splits
      function createTextSplits() {
        return {
          heading1: new SplitText(".heading:nth-child(1)", { type: "chars" }),
          heading2: new SplitText(".heading:nth-child(2)", { type: "chars" }),
          heading3: new SplitText(".heading:nth-child(3)", { type: "chars" }),
          loaderPrelude: new SplitText(".loader-prelude", { type: "chars" }),
          subtext: SplitText.create(".hero-subtext", { type: "chars" }),
        };
      }

      // Animation for headings
      function animateHeadings(timeline, splits, delay = 0) {
        const headingAnimation = {
          from: { opacity: 0, scale: 1.5, filter: "blur(10px)" },
          to: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.5,
            ease: "power3.out",
            stagger: 0.1,
          },
        };

        timeline
          .fromTo(
            splits.heading1.chars,
            headingAnimation.from,
            { ...headingAnimation.to, delay },
            "-=1.5"
          )
          .fromTo(
            splits.heading2.chars,
            headingAnimation.from,
            headingAnimation.to,
            "-=0.7"
          )
          .fromTo(
            splits.heading3.chars,
            headingAnimation.from,
            headingAnimation.to,
            "-=0.7"
          )
          .fromTo(
            splits.subtext.chars,
            { opacity: 0 },
            { opacity: 1, duration: 2, ease: "power3.out", stagger: 0.01 },
            "-=0.7"
          );
      }

      // Animation for other elements
      function animateCommonElements(timeline, splits) {
        timeline
          .fromTo(
            material.uniforms.u_radius,
            { value: 0 },
            { value: 1, duration: 3, ease: "sine.inOut" }
          )
          .add(
            driver.segment({ from: 0, to: 180, duration: 5, ease: "none" }),
            "-=1"
          )
          .fromTo(
            ".nav",
            { opacity: 0 },
            { opacity: 1, duration: 0.5, ease: "none" },
            "-=2"
          );
      }

      // Button animations
      function animateButtons(timeline) {
        const buttonWrappers = document.querySelectorAll(
          ".hero-button-wrapper"
        );
        const subtextEndTime = timeline.duration();
        const button1Start = subtextEndTime - 1.2;
        const buttonDuration = 1.2;

        buttonWrappers.forEach((wrapper, i) => {
          const button = wrapper.querySelector(".button-primary");
          const inset = button.querySelector(".button-inset");
          const text = button.querySelector(".button-text--primary");

          const buttonTimeline = gsap
            .timeline()
            .fromTo(
              wrapper,
              { scale: 0 },
              { scale: 1, duration: 0.9, ease: "quint.inOut" },
              0
            )
            .fromTo(
              inset,
              { scale: 0 },
              { scale: 1, duration: 0.9, ease: "quint.inOut" },
              0.1
            )
            .fromTo(
              button,
              { width: "65px" },
              { width: "auto", duration: 1, ease: "quint.inOut" },
              0.7
            )
            .fromTo(
              text,
              { opacity: 0 },
              { opacity: 1, duration: 0.2, ease: "ease" },
              1.3
            );

          const start =
            i === 0 ? button1Start : button1Start + i * buttonDuration;
          timeline.add(buttonTimeline, start);
        });
      }

      // Main execution
      setupElements();
      const splits = createTextSplits();
      const heroTimeline = gsap.timeline({ paused: true });

      // Always show loader until preload hits 100%
      document.querySelector(".loader")?.classList.remove("hide");

      // Prepare the loader button (hidden until preload completes)
      const loaderBtn = document.getElementById("loaderButton");
      if (loaderBtn) {
        loaderBtn.style.display = "none";
        loaderBtn.disabled = true;
        // Ensure a progress label exists in the parent of #loaderButton
        if (loaderBtn.parentElement) {
          let progressLabel = loaderBtn.parentElement.querySelector(
            "#loaderProgressText"
          );
          if (!progressLabel) {
            progressLabel = document.createElement("div");
            progressLabel.id = "loaderProgressText";
            progressLabel.style.cssText =
              "margin-bottom:8px; font-variant-numeric: tabular-nums;";
            // Center align within parent
            const parent = loaderBtn.parentElement;
            const prevDisplay = parent.style.display;
            if (!prevDisplay) parent.style.display = "flex";
            parent.style.flexDirection = "column";
            parent.style.alignItems = "center";
            parent.style.justifyContent = "center";
            parent.style.fontSize = "22px";
            loaderBtn.parentElement.insertBefore(progressLabel, loaderBtn);
          }
          progressLabel.textContent = "0%";
        }
      }

      // Kick off preloading all frames while the loader is visible,
      // then eagerly decode frames 0..180 before starting to avoid Safari hitching.
      // Finally, reveal the button to let user proceed.
      if (driver && typeof driver.preloadAll === "function") {
        driver
          .preloadAll((pct) => {
            const displayPct = Math.min(Math.round(pct * 2), 100);
            console.log(`[sequence] preload ${displayPct}%`);
            if (loaderBtn && loaderBtn.parentElement) {
              const progressLabel = loaderBtn.parentElement.querySelector(
                "#loaderProgressText"
              );
              if (progressLabel) progressLabel.textContent = `${displayPct}%`;
            }
          })
          .then(async () => {
            // preloadAll() now populates decode cache directly, no extra warmup needed

            if (loaderBtn) {
              // Hide progress text before showing the button
              if (loaderBtn.parentElement) {
                const progressLabel = loaderBtn.parentElement.querySelector(
                  "#loaderProgressText"
                );
                if (progressLabel) progressLabel.style.display = "none";
              }
              if (loaderBtn.parentElement) {
                const progressLabel = loaderBtn.parentElement.querySelector(
                  "#loaderProgressText"
                );
                if (progressLabel) progressLabel.textContent = "100%";
              }
              loaderBtn.style.display = "block";
              loaderBtn.disabled = false;
              loaderBtn.addEventListener(
                "click",
                () => {
                  loaderBtn.disabled = true;
                  gsap.set(".loader-prelude", { opacity: 1 });
                  gsap.set(window, { scrollTo: 0 });
                  heroTimeline.play();
                },
                { once: true }
              );
            } else {
              // Fallback: auto-continue if button not present
              gsap.set(".loader-prelude", { opacity: 1 });
              gsap.set(window, { scrollTo: 0 });
              heroTimeline.play();
            }
          });
      }

      // Loader animations
      heroTimeline
        .fromTo(
          ".loader-content",
          { opacity: 1 },
          {
            opacity: 0,
            duration: 1,
            ease: "none",
            onComplete: () =>
              document.querySelector(".loader-content")?.remove(),
          }
        )
        .fromTo(
          splits.loaderPrelude.chars,
          { opacity: 0, filter: "blur(10px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power1.out",
            stagger: 0.1,
          }
        )
        .fromTo(
          ".loader",
          { opacity: 1 },
          {
            opacity: 0,
            duration: 1,
            ease: "none",
            onComplete: () => document.querySelector(".loader")?.remove(),
          }
        );

      animateCommonElements(heroTimeline, splits);
      animateHeadings(heroTimeline, splits, 1);

      animateButtons(heroTimeline);

      // Auto-play is now triggered only after preload completes above
    }

    // Rotate gradient angle based on pointer X across the viewport (only > 991px)
    (() => {
      const root = document.documentElement;
      const mql = window.matchMedia("(min-width: 992px)");
      let onMove = null;

      function setAngle(x) {
        const width = Math.max(window.innerWidth, 1);
        const t = Math.min(Math.max(x / width, 0), 1);
        const angle = Math.round(t * 360); // 0–360deg
        gsap.to(root, {
          duration: 1.5,
          "--services-gradient-angle": `${angle}deg`,
        });
      }

      function enable() {
        if (onMove) return; // already enabled
        onMove = (e) => setAngle(e.clientX || 0);
        window.addEventListener("pointermove", onMove, { passive: true });
        // Initialize from center so it doesn't jump on first move
        setAngle(window.innerWidth / 2);
      }

      function disable() {
        if (!onMove) return;
        window.removeEventListener("pointermove", onMove);
        onMove = null;
      }

      function apply() {
        mql.matches ? enable() : disable();
      }

      // Initial apply + respond to viewport changes
      apply();
      // Modern + legacy listeners for matchMedia
      mql.addEventListener
        ? mql.addEventListener("change", apply)
        : mql.addListener(apply);
    })();

    // Ensure GSAP and ScrollTrigger are loaded
    if (!window.gsap || !gsap.core) {
      console.error("[seq] GSAP not loaded");
      return;
    }

    // Function to initialize GSAP logic for screen sizes > 991px
    function initGsap() {
      // Check if the screen size is larger than 991px
      if (window.innerWidth > 991) {
        // Create timeline with ScrollTrigger for #values-content-1
        const valuesFirstTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: "#values-content-1",
            start: "top 10%",
            end: "+=10%",
            scrub: true,
            anticipatePin: 1,
          },
        });

        valuesFirstTimeline.fromTo(
          "#values-content-1",
          {
            opacity: 0,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 5,
            ease: "power4.out",
          }
        );

        // Create timeline with ScrollTrigger for #values-content-4
        const valuesLastTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: "#values-content-4",
            start: "top -10%",
            end: "+=50%",
            scrub: true,
            anticipatePin: 1,
          },
        });

        valuesLastTimeline.fromTo(
          "#values-content-4",
          {
            opacity: 1,
            filter: "blur(0px)",
          },
          {
            opacity: 0,
            filter: "blur(10px)",
            duration: 5,
            ease: "power4.out",
          }
        );
      }
    }

    // Initialize GSAP logic on page load
    initGsap();

    // Re-initialize on window resize if screen size changes
    window.addEventListener("resize", function () {
      // Clear existing ScrollTriggers but keep the one with the name "initGsap"
      ScrollTrigger.getAll().forEach((trigger) => {
        if (
          trigger.vars.animation &&
          trigger.vars.animation.vars.name !== "initGsap"
        ) {
          trigger.kill(); // Kill all except the "initGsap" animation
        }
      });
      // Reinitialize GSAP logic, including "initGsap" animation if necessary
      initGsap();
    });

    // Initialize SplitText for all .values-content elements
    const valuesContent = document.querySelectorAll(".values-content");

    valuesContent.forEach((element) => {
      // Split text into characters
      const split = new SplitText(element, { type: "chars" });

      // Set initial blur and opacity
      gsap.set(split.chars, { filter: "blur(10px)", opacity: 0 });

      // Create timeline animation
      const blurRevealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 50%",
          end: "bottom top",
          toggleActions: "play none none none",
        },
      });

      // Animate blur and opacity
      blurRevealTimeline.to(split.chars, {
        filter: "blur(0px)",
        opacity: 1,
        duration: 0.5,
        stagger: 0.01,
        ease: "power2.out",
      });
    });

    // ScrollTrigger animation
    const valuetl = gsap.timeline({
      scrollTrigger: {
        trigger: ".prologue-speed-controller", // Element that triggers the animation
        start: "30% top", // Start the animation when the top of the container hits the top of the viewport
        end: () => `bottom+=${(window.innerHeight * 6000) / 911}`, // Convert 6000px to vh dynamically (60vh)
        scrub: true, // Synchronize scroll with animation
        pin: true, // Pin the container during the animation
      },
    });
    // Add the image sequence animation to the timeline
    valuetl
      .to(driver, {
        duration: 3.5,
        onUpdate: () => {
          // You can add additional logic if needed, like handling custom animation parameters
          driver.setProgress(180, 1150, valuetl.progress());
        },
        ease: "power1.in",
      })
      .to(driver, {
        duration: 2,
        onUpdate: () => {
          // You can add additional logic if needed, like handling custom animation parameters
          driver.setProgress(180, 1150, valuetl.progress());
        },
        ease: "power1.in",
      });

    //========================= CTA Section Animations =======================

    console.log("CTA Section animations started");

    // Create video element
    const video = document.createElement("video");
    video.src = "https://teamepyc.github.io/cdn/kaviraj/assets/home_cta_bg.mp4";
    video.loop = true;
    video.muted = true; // required for autoplay
    video.setAttribute("muted", ""); // iOS/WebKit quirk
    video.playsInline = true; // iOS inline playback
    video.crossOrigin = "anonymous";

    // Try to start playback (may still require a user gesture on some browsers)
    video.play().catch(() => {
      // Fallback: start after first user interaction
      const resume = () => {
        video.play().finally(() => window.removeEventListener("click", resume));
      };
      window.addEventListener("click", resume, { once: true });
    });

    // Use video as texture
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture.wrapT = THREE.ClampToEdgeWrapping;
    videoTexture.generateMipmaps = false;
    videoTexture.flipY = true;

    // three r152+:
    if ("SRGBColorSpace" in THREE)
      videoTexture.colorSpace = THREE.SRGBColorSpace;
    // older three versions:
    // else videoTexture.encoding = THREE.sRGBEncoding;

    // Three.js setup
    const actionCanvas = document.getElementById("action-bg");
    const actionRenderer = new THREE.WebGLRenderer({
      canvas: actionCanvas,
      alpha: true,
      antialias: true,
    });

    actionRenderer.setPixelRatio(2);

    const actionScene = new THREE.Scene();
    const actionCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Simplified shader material with only video texture
    const actionMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        u_video: { value: videoTexture },
        u_resolution: { value: new THREE.Vector2(1, 1) },
        u_radius: { value: 0.5 },
        u_center: { value: new THREE.Vector2(0.5, 0.4) }, // x: 0-1, y: 0-1 (0.4 = slightly lower than center)
        u_ellipse: { value: new THREE.Vector2(1.0, 0.7) }, // x-scale, y-scale (0.7 makes it flatter top/bottom)
      },
      vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
      fragmentShader: `
    float hash(vec2 p){
      return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453);
    }
  
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p), u = f*f*(3.0-2.0*f);
      return mix(hash(i),hash(i+vec2(1,0)),u.x) + 
             (hash(i+vec2(0,1))-hash(i))*u.y*(1.0-u.x) + 
             (hash(i+vec2(1,1))-hash(i+vec2(1,0)))*u.x*u.y;
    }
  
    float fbm(vec2 p){
      float v=0., amp=0.5, freq=1.;
      for(int i=0; i<6; i++){
        v += amp * noise(p*freq);
        freq*= 2.;
        amp *= 0.5;
      }
      return clamp(v, 0.0, 1.0);
    }
  
    uniform sampler2D u_video;
    uniform vec2 u_resolution;
    uniform float u_radius;
    uniform vec2 u_center;
    uniform vec2 u_ellipse;
    varying vec2 vUv;
  
    void main(){
      vec2 uv = vUv;
      
      // Oval mask calculation - flattened from top and bottom
      vec2 center = (uv - u_center);
      
      // Apply ellipse scaling - compress Y to make it oval (flat top/bottom)
      center.x *= u_ellipse.x;
      center.y *= u_ellipse.y; // 0.7 makes it flatter
      
      // Convert to pixel coordinates for consistent shape
      vec2 pixelCoords = center * u_resolution;
      float minDimension = min(u_resolution.x, u_resolution.y);
      float d = length(pixelCoords) / minDimension;
      
      float n = fbm(uv * -8.0);
      float edge = d + n * 0.05;
      
      float mask = smoothstep(u_radius + 0.002, u_radius - 0.002, edge);
      
      // Sample video texture
      vec4 videoCol = texture2D(u_video, uv);
      
      // Slight contrast boost for clarity
      videoCol.rgb = pow(videoCol.rgb, vec3(0.9));
      videoCol.rgb = mix(videoCol.rgb, videoCol.rgb * 1.1, 0.3);
      
      gl_FragColor = vec4(videoCol.rgb, videoCol.a * mask);
    }
  `,
    });

    actionScene.add(
      new THREE.Mesh(new THREE.PlaneGeometry(2, 2), actionMaterial)
    );

    function onResize() {
      // Ensure container has non-zero size
      const rect = actionCanvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      actionRenderer.setSize(w, h, false);

      // Pass device-pixel resolution to the shader
      actionMaterial.uniforms.u_resolution.value.set(w * dpr, h * dpr);
    }

    window.addEventListener("resize", onResize);
    onResize();

    function render() {
      actionRenderer.render(actionScene, actionCamera);
      requestAnimationFrame(render);
    }
    render();

    // GSAP timeline (ensure gsap + ScrollTrigger loaded/registered and .action exists)
    if (window.innerWidth > 991) {
      const actionTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".action",
          start: "-50% -50%",
          end: "+=200%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      actionTimeline
        .fromTo(
          actionMaterial.uniforms.u_radius,
          { value: 0 },
          { value: 2, ease: "sine.inOut", duration: 5 }
        )
        .fromTo(
          ".action-wrap",
          {
            opacity: 0,
            scale: 0.6,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 2,
            ease: "power2.out",
          }
        )

        .addLabel("visible");
    }
    // Set CSS var --prologue-gi-cta-margin-bottom to 0 when viewport < 991px
  });
}

if (window.innerWidth < 991) {
   (function () {
    const VAR = "--prologue-gi-cta-margin-bottom";
    const root = document.documentElement;
    const original = getComputedStyle(root).getPropertyValue(VAR).trim();

    const mq = window.matchMedia("(max-width: 990px)"); // strictly < 991px

    const apply = (e) => {
      if (e.matches) {
        root.style.setProperty(VAR, "0");
      } else {
        root.style.setProperty(VAR, original || "");
      }
    };

    apply(mq); // set on load
    mq.addEventListener("change", apply); // update on resize
  })();

  const prologueMobielElements = document.querySelectorAll(
    ".prologue-content-wrapper"
  );

  prologueMobielElements.forEach((element) => {
    // Create a timeline for each element
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top top", // Pin the element when its top reaches the top of the viewport
        end: "bottom 30%", // When the bottom of the element reaches the top of the viewport
        pin: true, // Pin the element when it's in view
        scrub: true, // Smooth scrubbing effect
        markers: false, // Optional: For debugging
      },
    });

    // Define the animation timeline
    tl.fromTo(
      element,
      { opacity: 0 },
      { filter: "blur(0px)", opacity: 1, duration: 1 }
    ) // Fade in to opacity 1
      .fromTo(
        element,
        { opacity: 1 },
        { filter: "blur(10px)", opacity: 0, duration: 1 }
      ); // Fade out back to opacity 0
  });

  gsap.utils.toArray(".services-card").forEach((card) => {
    gsap.from(card, {
      opacity: 0,
      y: 100,
      scrollTrigger: {
        trigger: card,
        start: "top 70%",
      },
    });
  });
}
