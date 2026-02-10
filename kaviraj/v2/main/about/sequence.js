if (window.innerWidth >= 803) {

  const VIDEO_URL = 'https://teamepyc.github.io/cdn/kaviraj/v2/videos/ffmpeg.mp4';
  const loaderFill = document.getElementById('loader-bar-fill');
  const loaderText = document.getElementById('loader-text');

  async function loadVideo(url) {
    try {
        const response = await fetch(url);
        const reader = response.body.getReader();
        const contentLength = +response.headers.get('Content-Length');
        let receivedLength = 0;
        let chunks = []; 
        while(true) {
            const {done, value} = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
            
            // Update Loader UI
            const progress = (receivedLength / contentLength) * 100;
            loaderFill.style.width = `${progress}%`;
            loaderText.innerText = `${Math.round(progress)}%`;
        }
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const blobUrl = URL.createObjectURL(blob);
        initExperience(blobUrl);
    } catch (error) {
        console.error("Video load failed:", error);
        // Fallback: hide loader anyway if something goes wrong
        //loaderOverlay.style.display = 'none';
        //lenis.start();
    }
  }

  function initExperience(videoSource) {
    const scrollyVideo = new ScrollyVideo({
        scrollyVideoContainer: 'scrolly-video-container',
        src: videoSource,
        trackScroll: false, 
        cover: true,
        sticky: false,
        full: true,
        frameThreshold: 0.005
    });
    
    // code comes here
    console.log("code comes here");
    const heroText = new SplitText(document.querySelector(".ka-hero-heading"), { type: "chars" });
    const heroTextChars = [...heroText.chars].reverse();
    const introText1 = new SplitText(document.querySelector(".ka-timeline-intro-txt:nth-child(1)"), { type: "words, chars" });
    const introText2 = new SplitText(document.querySelector(".ka-timeline-intro-txt:nth-child(2)"), { type: "words, chars" });
    const introText3 = new SplitText(document.querySelector(".ka-timeline-intro-txt:nth-child(3)"), { type: "words, chars" });

    const Timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".ka-timeline",
        start: "top 100%",
        end: "top 0%",
        scrub: true
      }
    });

    Timeline
    .to(".k-solid-button.about-hero", 
      {scale: 0.9, filter: "blur(10px)", opacity: 0, duration: 0.5})
    .to(heroTextChars, 
      {scale: 0.9, filter: "blur(10px)", scale: 1, opacity: 0, duration: 4, stagger: 0.2}, "<")
    .fromTo([introText1.chars, introText2.chars, introText3.chars], 
      {filter: "blur(10px)", scale: 1.5, opacity: 0},
      {filter: "blur(0px)", scale: 1, opacity: 1, stagger: 0.2, duration: 4, ease: "power1.out"}, "+=25")
    //.to([introText1.chars, introText2.chars, introText3.chars], 
      //{filter: "blur(10px)", scale: 1, opacity: 0, duration: 3, stagger: 0.1}, "+=4")
    
    const Timeline2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".ka-timeline",
        start: "top 100%",
        end: "top 0%",
        scrub: true
      }
    });

    Timeline2
    .to({},
      {ease: "none", duration: 10, 
        onUpdate(){ {
            const f = this.progress();
            scrollyVideo.setTargetTimePercent(f);
        }}, 
      }
    ).fromTo(".image-sequence-fader", 
      {opacity: 0}, 
      {opacity: 1}, "-=0.5"
    )



    gsap.fromTo(".ka-background-video", 
    {x: "0vw"},
    {x: "-100vw",
    ease: "sine.inOut",
    scrollTrigger: {
      trigger: ".ka-chapter-transition._0",
      start: "40% bottom",
      end: "160% bottom",
      scrub: true,
    }
    });

    gsap.to([introText1.chars, introText2.chars, introText3.chars], 
    {filter: "blur(10px)", scale: 1, opacity: 0, duration: 3, stagger: 0.1, 
    scrollTrigger: {
      trigger: ".ka-chapter-transition._0",
      start: "40% bottom",
      end: "110% bottom",
      scrub: true,
    }
    });

    setTimeout(() => {
        document.querySelector('.k-preloader-progress-track').classList.add('hide');
      }, 250);
      setTimeout(() => {
        //document.querySelector('.k-preloader .k-stroke-button').classList.remove('hide');
        gsap.to(".k-preloader[data-sprite]", 
          {ease: "none", duration: 2, 
            onUpdate() {const el = this.targets()[0]; el._spriteSetProgress?.((this.progress()));},
            onComplete: () => {document.querySelector(".k-preloader")?.remove();}
          }
        );
      }, 1000);

    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  loadVideo(VIDEO_URL);
}


