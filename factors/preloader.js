// Optimized Combined Video Manager + Preloader
class CombinedPreloader {
  constructor() {
    this.processedVideos = new WeakSet();
    this.video = null;
    this.fallbackImage = null;
    this.counterElement = null;
    this.isComplete = false;
    this.gsapAvailable = false;
    this.allVideos = [];
    this.videoProgress = new Map();
    this.counterStartTime = null;
    
    document.addEventListener('DOMContentLoaded', () => this.init());
  }

  init() {
    this.processAllVideos();
    setTimeout(() => this.setupPreloader(), 200);
    window.addEventListener('resize', () => this.debounce(() => this.processAllVideos(true), 300));
  }

  // ==================== VIDEO MANAGEMENT ====================
  
  processAllVideos(isResize = false) {
    document.querySelectorAll('video').forEach(video => {
      if (!isResize && this.processedVideos.has(video)) return;
      
      if (video.id === 'preloader-video') {
        this.setupPreloaderVideo(video);
      } else {
        this.setupGenericVideo(video);
      }
      this.processedVideos.add(video);
    });
  }

  setupPreloaderVideo(video) {
    video.innerHTML = '';
    const sources = this.getPreloaderSources();
    const selected = this.selectBestSource(sources);
    
    if (selected) {
      const source = document.createElement('source');
      source.src = selected.src;
      source.type = selected.type;
      video.appendChild(source);
      Object.assign(video, { playsinline: '', muted: '', preload: 'auto' });
      video.load();
    }
  }

  setupGenericVideo(video) {
    const sources = Array.from(video.querySelectorAll('source'));
    if (!sources.length) return;
    
    const best = this.selectBestSourceFromElements(sources);
    if (best && video.src !== best.src) {
      video.src = best.src;
      video.load();
    }
  }

  getPreloaderSources() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    return [
      { src: 'https://teamepyc.github.io/cdn/NonZero/Factors/preloader-logo-hevc-safari-transparent.mp4', type: 'video/mp4; codecs="hvc1"', priority: isSafari ? 10 : 0 },
      { src: 'https://teamepyc.github.io/cdn/factors/preloader-logo-vp9-chrome.webm', type: 'video/webm', priority: !isSafari ? 10 : 0 },
      { src: 'https://teamepyc.github.io/cdn/factors/preloader-logo-h264.mp4', type: 'video/mp4', priority: 5 }
    ];
  }

  selectBestSource(sources) {
    const supported = sources.filter(s => !s.browser || (s.browser === 'safari') === /safari/i.test(navigator.userAgent));
    return supported.sort((a, b) => b.priority - a.priority)[0] || null;
  }

  selectBestSourceFromElements(sources) {
    return sources.find(s => !s.getAttribute('media') || window.matchMedia(s.getAttribute('media')).matches) || sources[0];
  }

  // ==================== PRELOADER SEQUENCE ====================

  setupPreloader() {
    const preloader = document.getElementById("preloader");
    const shown = this.getStorage("homepagePreloaderShown");
    const visitedNon = this.getStorage("visitedNonHomepage");

    if (!preloader) return this.enableScroll();
    if (!this.isHomepage()) {
      preloader.style.display = 'none';
      this.setStorage("visitedNonHomepage", "true");
      return this.enableScroll();
    }
    if (shown && !visitedNon) {
      preloader.remove();
      return this.enableScroll();
    }

    this.duplicateElement("loader-bar-mask", 50);
    this.startPreloaderSequence();
  }

  startPreloaderSequence() {
    this.disableScroll();
    
    this.video = document.getElementById("preloader-video");
    this.fallbackImage = document.getElementById("video-fallback-image");
    this.counterElement = document.querySelector(".preloader-counter-wrapper .preloader-text");
    
    if (!this.counterElement) return this.forceClose();

    this.setupInitialState();
    this.setupVideoPlayback();
    this.startLoadingCounter();
    this.checkGSAP();
  }

  setupInitialState() {
    // Hide elements using only opacity
    const hideElements = [".preloader-line", ".preloader-center-text-wrapper", ".preloader-india-icon", ".preloader-name", ".pre-loader-close"];
    hideElements.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.style.opacity = '0');
    });
    document.querySelectorAll('[class*="preloader-line"]').forEach(el => el.style.opacity = '0');
    
    // Show counter
    const counterWrapper = document.querySelector(".preloader-counter-wrapper");
    if (counterWrapper) counterWrapper.style.opacity = '1';
    if (this.counterElement) {
      this.counterElement.style.opacity = '1';
      this.counterElement.textContent = '0';
    }

    // Video/image display
    if (this.video) this.video.style.display = 'none';
    if (this.fallbackImage) this.fallbackImage.style.display = 'block';
  }

  setupVideoPlayback() {
    if (!this.video || !this.fallbackImage) return;

    this.video.addEventListener('loadeddata', () => this.tryPlayVideo());
    this.video.addEventListener('error', () => {
      this.video.style.display = 'none';
      this.fallbackImage.style.display = 'block';
    });

    if (this.video.readyState >= 2) this.tryPlayVideo();
  }

  tryPlayVideo() {
    const playPromise = this.video.play();
    if (playPromise) {
      playPromise.then(() => {
        this.video.style.display = 'block';
        this.fallbackImage.style.display = 'none';
      }).catch(() => {
        this.video.style.display = 'none';
        this.fallbackImage.style.display = 'block';
        document.addEventListener('click', () => this.video.play().then(() => {
          this.video.style.display = 'block';
          this.fallbackImage.style.display = 'none';
        }).catch(() => {}), { once: true });
      });
    }
  }

  // ==================== LOADING COUNTER ====================

  startLoadingCounter() {
    this.counterStartTime = Date.now();
    this.allVideos = Array.from(document.querySelectorAll('video'));
    this.videoProgress = new Map();
    
    if (!this.allVideos.length) return this.startFallbackCounter();
    
    this.allVideos.forEach((video, i) => {
      this.videoProgress.set(video, 0);
      this.setupVideoTracking(video, i);
    });
    this.monitorProgress();
  }

  setupVideoTracking(video, index) {
    const events = {
      loadstart: 5, progress: () => this.getBufferProgress(video),
      loadedmetadata: 30, loadeddata: 60, canplay: 85, canplaythrough: 100, error: 100
    };
    
    Object.entries(events).forEach(([event, progress]) => {
      video.addEventListener(event, () => {
        const prog = typeof progress === 'function' ? progress() : progress;
        this.updateVideoProgress(video, Math.max(this.videoProgress.get(video), prog));
      });
    });
    
    setTimeout(() => this.updateVideoProgress(video, 100), 15000); // Timeout
  }

  getBufferProgress(video) {
    if (video.buffered.length > 0) {
      const buffered = video.buffered.end(0);
      const duration = video.duration || 10;
      return Math.min((buffered / duration) * 80, 80);
    }
    return this.videoProgress.get(video);
  }

  updateVideoProgress(video, progress) {
    const current = this.videoProgress.get(video);
    if (progress > current) {
      this.videoProgress.set(video, progress);
      this.calculateProgress();
    }
  }

  calculateProgress() {
    const total = Array.from(this.videoProgress.values()).reduce((sum, p) => sum + p, 0);
    const overall = Math.floor(total / this.allVideos.length);
    this.animateCounterTo(Math.min(overall, 100));
    
    if (Array.from(this.videoProgress.values()).every(p => p >= 100) && !this.isComplete) {
      const elapsed = Date.now() - this.counterStartTime;
      const delay = Math.max(0, 2000 - elapsed);
      setTimeout(() => this.completeLoading(), delay);
    }
  }

  monitorProgress() {
    const check = () => {
      if (this.isComplete) return;
      this.allVideos.forEach(video => {
        const state = video.readyState;
        if (state >= 4) this.updateVideoProgress(video, 100);
        else if (state >= 3) this.updateVideoProgress(video, Math.max(this.videoProgress.get(video), 85));
        else if (state >= 2) this.updateVideoProgress(video, Math.max(this.videoProgress.get(video), 60));
      });
      setTimeout(check, 500);
    };
    setTimeout(check, 1000);
  }

  animateCounterTo(target) {
    if (!this.counterElement) return;
    
    const current = parseInt(this.counterElement.textContent) || 0;
    if (target <= current) return;
    
    const duration = Math.min((target - current) * 30, 1000);
    const start = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // power2.out
      const value = Math.floor(current + (target - current) * eased);
      
      this.counterElement.textContent = value.toString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.counterElement.textContent = target.toString();
        if (target >= 100) this.fadeOutCounter();
      }
    };
    requestAnimationFrame(animate);
  }

  fadeOutCounter() {
    if (this.gsapAvailable && typeof gsap !== 'undefined') {
      gsap.to(this.counterElement, { opacity: 0, duration: 0.6, ease: "power2.out" });
    } else {
      this.counterElement.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      this.counterElement.style.opacity = '0';
    }
  }

  startFallbackCounter() {
    let current = 0;
    const update = () => {
      if (current < 100 && !this.isComplete) {
        current = Math.min(current + (Math.random() * 3 + 1), 100);
        this.animateCounterTo(Math.floor(current));
        setTimeout(update, 150);
      } else {
        this.animateCounterTo(100);
        setTimeout(() => this.completeLoading(), 500);
      }
    };
    setTimeout(update, 300);
  }

  completeLoading() {
    if (this.isComplete) return;
    this.isComplete = true;
    setTimeout(() => this.startFadeSequence(), 300);
  }

  // ==================== FADE ANIMATIONS ====================

  startFadeSequence() {
    const elements = [".preloader-line", ".preloader-center-text-wrapper", ".preloader-india-icon", ".preloader-name"]; // Changed from .preloader-name .preloader-text to .preloader-name
    
    // Set all to opacity 0
    [...elements, '.preloader-line'].forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.style.opacity = '0');
    });
    
    // Fade in
    if (this.gsapAvailable && typeof gsap !== 'undefined') {
      gsap.to([...elements, '.preloader-line'], {
        opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1,
        onComplete: () => setTimeout(() => this.fadeOutElements(elements), 500)
      });
    } else {
      this.cssFadeIn(elements);
    }
  }

  cssFadeIn(elements) {
    let delay = 0;
    [...elements, '.preloader-line'].forEach(selector => {
      setTimeout(() => {
        document.querySelectorAll(selector).forEach(el => {
          el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          el.style.opacity = '1';
        });
      }, delay * 100);
      delay++;
    });
    setTimeout(() => this.fadeOutElements(elements), 1100);
  }

  fadeOutElements(elements) {
    if (this.gsapAvailable && typeof gsap !== 'undefined') {
      gsap.to(elements, { opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.5, onComplete: () => this.showClickToEnter() });
    } else {
      elements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          el.style.transitionDelay = '0.5s';
          el.style.opacity = '0';
        });
      });
      setTimeout(() => this.showClickToEnter(), 1300);
    }
  }

  showClickToEnter() {
    const closeButton = document.querySelector(".pre-loader-close");
    const clickText = document.querySelector("#clicktoenter");
    
    if (!closeButton) return this.forceClose();

    closeButton.style.display = 'block';
    closeButton.style.opacity = '0';

    if (this.gsapAvailable && typeof gsap !== 'undefined' && clickText) {
      const tl = gsap.timeline();
      tl.to(clickText, { duration: 1.5, scrambleText: { text: "CLICK TO ENTER", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", speed: 0.5 } })
        .to(closeButton, { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.5");
    } else {
      if (clickText) clickText.textContent = "CLICK TO ENTER";
      closeButton.style.transition = 'opacity 1s ease';
      closeButton.style.opacity = '1';
    }

    closeButton.addEventListener('click', () => this.handleClose());
  }

  handleClose() {
    this.enableScroll();
    
    if (this.gsapAvailable && typeof gsap !== 'undefined') {
      const tl = gsap.timeline({ onComplete: () => this.cleanup() });
      tl.to([".preloader-center", ".preloader-name"], { opacity: 0, duration: 0.5 }) // Added .preloader-name
        .to(".loader-bar", { x: "100%", stagger: 0.02, duration: 0.5 })
        .call(() => { this.removePreloader(); this.startIntros(); });
    } else {
      // CSS fallback - fade out both center and name
      const center = document.querySelector(".preloader-center");
      const name = document.querySelector(".preloader-name");
      
      if (center) {
        center.style.transition = 'opacity 0.5s ease';
        center.style.opacity = '0';
      }
      if (name) {
        name.style.transition = 'opacity 0.5s ease';
        name.style.opacity = '0';
      }
      
      setTimeout(() => { this.removePreloader(); this.startIntros(); this.cleanup(); }, 500);
    }

    this.toggleMusic();
    this.clickCanvas();
  }

  // ==================== UTILITIES ====================

  checkGSAP() {
    const check = setInterval(() => {
      if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        this.gsapAvailable = true;
        clearInterval(check);
      }
    }, 100);
    setTimeout(() => clearInterval(check), 15000);
  }

  duplicateElement(className, count) {
    const el = document.querySelector(`.${className}`);
    if (el && count > 0) {
      const parent = el.parentElement;
      for (let i = 0; i < count; i++) parent.appendChild(el.cloneNode(true));
    }
  }

  removePreloader() {
    const preloader = document.getElementById("preloader");
    if (preloader) preloader.remove();
    this.enableScroll();
    this.setStorage("homepagePreloaderShown", "true");
  }

  startIntros() {
    try {
      if (this.gsapAvailable && typeof gsap !== 'undefined') {
        gsap.to("#intro-scramble-1", { duration: 1.5, scrambleText: { text: "BY NONZERO", chars: "upperCase" } });
        gsap.to("#intro-scramble-2", { duration: 1.5, scrambleText: { text: "NOT FOR THE FAINT HEARTED", chars: "upperCase" }, delay: 0.5 });
      } else {
        const el1 = document.querySelector("#intro-scramble-1");
        const el2 = document.querySelector("#intro-scramble-2");
        if (el1) el1.textContent = "BY NONZERO";
        if (el2) setTimeout(() => el2.textContent = "NOT FOR THE FAINT HEARTED", 500);
      }
    } catch (e) { console.warn('Intro animations failed:', e); }
  }

  toggleMusic() {
    const music = document.getElementById("backgroundMusic");
    if (music) music.play().catch(() => {});
  }

  clickCanvas() {
    const canvas = document.getElementById("waveCanvas");
    if (canvas && canvas.click) canvas.click();
  }

  forceClose() {
    this.removePreloader();
    this.startIntros();
  }

  cleanup() {
    this.enableScroll();
  }

  debounce(func, wait) {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(func, wait);
  }

  disableScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  enableScroll() {
    document.body.style.overflow = 'visible';
    document.documentElement.style.overflow = 'visible';
  }

  isHomepage() {
    return location.pathname === "/" || location.pathname.includes("index") || location.pathname === "";
  }

  getStorage(key) {
    try { return sessionStorage.getItem(key); } catch { return null; }
  }

  setStorage(key, value) {
    try { sessionStorage.setItem(key, value); } catch {}
  }
}

// Initialize
const combinedPreloader = new CombinedPreloader();
window.combinedPreloader = combinedPreloader;

// Emergency cleanup
['beforeunload', 'error'].forEach(event => {
  window.addEventListener(event, () => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('preloader')) {
    combinedPreloader.forceClose();
  }
});
