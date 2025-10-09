document.addEventListener("DOMContentLoaded", () => {
  console.log("home-prologue-test loaded");

  // Check if required libraries are loaded
  if (!window.THREE || !window.gsap || !window.ScrollTrigger || !window.SplitText) {
    console.error("Required libraries not loaded: THREE, GSAP, ScrollTrigger, or SplitText");
    return;
  }

  // Register ScrollTrigger if not already registered
  if (!gsap.core.globals().ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (window.innerWidth > 991) {
    try {
      //–– Three.js setup ––
      const canvas = document.getElementById("canvas_prologue");
      if (!canvas) {
        console.error("Canvas element 'canvas_prologue' not found");
        return;
      }

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    //–– Load texture ––
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      "https://cdn.prod.website-files.com/683424d3c1de3b2630c7c44a/68407308f41544816614f101_grandfather.avif",
      onResize
    );

    //–– Noise-circle shader ––
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        u_image: { value: texture },
        u_resolution: { value: new THREE.Vector2() },
        u_radius: { value: 0.5 }, // try 0.5 to start
      },
      vertexShader: `
    void main(){
      gl_Position = vec4(position, 1.0);
    }
  `,
      fragmentShader: `
    // — noise / fbm functions unchanged —
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p), u = f*f*(3.0-2.0*f);
      return mix(hash(i),hash(i+vec2(1,0)),u.x)
           + (hash(i+vec2(0,1))-hash(i))*u.y*(1.0-u.x)
           + (hash(i+vec2(1,1))-hash(i+vec2(1,0)))*u.x*u.y;
    }
    float fbm(vec2 p){
      float v=0., amp=0.5, freq=1.;
      for(int i=0; i<6; i++){
        v   += amp * noise(p*freq);
        freq*= 2.;
        amp  *= 0.5;
      }
      return clamp(v, 0.0, 1.0);
    }

    uniform sampler2D u_image;
    uniform vec2      u_resolution;
    uniform float     u_radius;

    void main(){
      // 1) compute standard UV for sampling
      vec2 uv = gl_FragCoord.xy / u_resolution;

      // 2) make a centered, aspect-corrected UV for mask math
      vec2 m = uv - 0.5;
      m.x *= u_resolution.x / u_resolution.y;

      // 3) true circle distance
      float d = length(m);

      // 4) add noise‐jitter on edge
      float n    = fbm(uv * -10.0);
      float edge = d + n * 0.1;

      // 5) smoothstep for soft edge
      float mask = smoothstep(u_radius, u_radius - 0.001, edge);

      // 6) sample original image and apply alpha mask
      vec4 col = texture(u_image, uv);
      gl_FragColor = vec4(col.rgb, col.a * mask);
    }
  `,
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    function onResize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      material.uniforms.u_resolution.value.set(w, h);
    }
    window.addEventListener("resize", onResize);
    onResize();

    function render() {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    /*
    
    🛠️ Tunable Parameters You Can Play With Variable	Effect
    
    u_radius	    Radius of the circular mask
    uv *          5.0	Frequency of noise – higher = more fine detail
    smoothstep    0.1	Strength of noise effect on edge (scale factor)
    amp           0.5, freq in fbm() Controls how fast noise fades out or zooms in
    
    */

    console.log("Home-prologue-test")

    // setting all prologue-content to be fixed in one place
    const prologueContents = document.querySelectorAll(".prologue .prologue-content");
    if (prologueContents.length === 0) {
      console.error("No prologue content elements found");
      return;
    }

    prologueContents.forEach((el, index) => {
      const offsetY = -(index + 1) * 100;

      gsap.set(el, {
        y: `${offsetY}vh`
      });

      ScrollTrigger.create({
        trigger: ".prologue",
        start: "0% 100%",
        end: "100% 100%",
        pin: el
      });
    });

    //adding will-change for GPU Accelration
    document.querySelectorAll(
      ".prologue-content, .prologue-content .prologue-text, .prologue-content .prologue-text-small, .prologue-grandfathers-name, .prologue-gi, .prologue-grandfathers-name"
    ).forEach(el => {
      el.style.willChange = "transform, opacity, filter";
    });

    //change this value to progressively slow down the timeleine scroll speed, min value is 0vh
    gsap.set(".prologue-speed-controller", { height: "300vh" });

    // initializing elements before timeline
    let prologue1text1, prologue1text2, prologue2text1, prologue2text2, prologue3text1, prologue3text2, prologue3text3, prologue3text4, prologue3image;

    try {
      // Check if we have enough prologue content elements
      if (prologueContents.length < 3) {
        console.error("Not enough prologue content elements found. Expected at least 3, found:", prologueContents.length);
        return;
      }

      // Initialize SplitText for prologue 1
      const prologue1Block1 = prologueContents[0].querySelectorAll(".prologue-content-block:nth-child(1) .prologue-text");
      const prologue1Block2 = prologueContents[0].querySelectorAll(".prologue-content-block:nth-child(2) .prologue-text");
      
      if (prologue1Block1.length > 0) prologue1text1 = new SplitText(prologue1Block1, { type: "chars" });
      if (prologue1Block2.length > 0) prologue1text2 = new SplitText(prologue1Block2, { type: "chars" });

      // Initialize SplitText for prologue 2
      const prologue2Block1 = prologueContents[1].querySelectorAll(".prologue-content-block:nth-child(1) .prologue-text");
      const prologue2Block2 = prologueContents[1].querySelectorAll(".prologue-content-block:nth-child(2) .prologue-text");
      
      if (prologue2Block1.length > 0) prologue2text1 = new SplitText(prologue2Block1, { type: "chars" });
      if (prologue2Block2.length > 0) prologue2text2 = new SplitText(prologue2Block2, { type: "chars" });

      // Initialize SplitText for prologue 3
      const prologue3Block1 = prologueContents[2].querySelectorAll(".prologue-content-block:nth-child(1) .prologue-text-small");
      const prologue3Grandfather1 = prologueContents[2].querySelector(".prologue-grandfather-container .prologue-grandfathers-name:nth-of-type(1)");
      const prologue3Grandfather2 = prologueContents[2].querySelector(".prologue-gi-test .prologue-grandfathers-name");
      const prologue3Block2 = prologueContents[2].querySelectorAll(".prologue-content-block:nth-child(2) .prologue-text-small");
      
      if (prologue3Block1.length > 0) prologue3text1 = new SplitText(prologue3Block1, { type: "chars" });
      if (prologue3Grandfather1) prologue3text2 = new SplitText(prologue3Grandfather1, { type: "chars" });
      if (prologue3Grandfather2) prologue3text3 = new SplitText(prologue3Grandfather2, { type: "chars" });
      if (prologue3Block2.length > 0) prologue3text4 = new SplitText(prologue3Block2, { type: "chars" });

      prologue3image = prologueContents[2].querySelector(".prologue-gi-mask .noise");
    } catch (error) {
      console.error("Error initializing SplitText elements:", error);
      return;
    }

    //Prologue Timline Initialization with  scrollTrigger
    const prologueTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".prologue",
        start: "0% 20%",
        end: "100% 100%",
        scrub: true,
      }
    });

    //Prologue Timeline Animation Sequence
    try {
      // Only animate elements that were successfully created
      if (prologue1text1 && prologue1text1.chars) {
        prologueTimeline.fromTo(prologue1text1.chars, {
      filter: "blur(10px)",
      scale: 1.5,
      opacity: 0
    }, {
      filter: "blur(0px)",
      scale: 1,
      opacity: 1,
      stagger: 0.2,
      duration: 4,
      ease: "power1.out"
    });
      }

      if (prologue1text2 && prologue1text2.chars) {
        prologueTimeline.fromTo(prologue1text2.chars, {
      filter: "blur(10px)",
      scale: 1.5,
      opacity: 0
    }, {
      filter: "blur(0px)",
      scale: 1,
      opacity: 1,
      stagger: 0.2,
      duration: 4,
      ease: "power1.out"
    }, "+=2");
      }

      // Fade out prologue 1 texts
      const prologue1Chars = [];
      if (prologue1text1 && prologue1text1.chars) prologue1Chars.push(...prologue1text1.chars);
      if (prologue1text2 && prologue1text2.chars) prologue1Chars.push(...prologue1text2.chars);
      
      if (prologue1Chars.length > 0) {
        prologueTimeline.to(prologue1Chars, { 
          filter: "blur(10px)", 
          scale: 1, 
          opacity: 0, 
          duration: 3, 
          stagger: 0.1 
        }, "+=4");
      }

      if (prologue2text1 && prologue2text1.chars) {
        prologueTimeline.fromTo(prologue2text1.chars, { filter: "blur(10px)", scale: 1.5, opacity: 0 }, {
        filter: "blur(0px)",
        scale: 1,
        opacity: 1,
        stagger: 0.2,
        duration: 4,
        ease: "power1.out"
      });
      }

      if (prologue2text2 && prologue2text2.chars) {
        prologueTimeline.fromTo(prologue2text2.chars, {
          filter: "blur(10px)",
          scale: 1.5,
          opacity: 0
        }, {
          filter: "blur(0px)",
          scale: 1,
          opacity: 1,
          stagger: 0.2,
          duration: 4,
          ease: "power1.out"
        }, "+=2");
      }

      // Fade out prologue 2 texts
      const prologue2Chars = [];
      if (prologue2text1 && prologue2text1.chars) prologue2Chars.push(...prologue2text1.chars);
      if (prologue2text2 && prologue2text2.chars) prologue2Chars.push(...prologue2text2.chars);
      
      if (prologue2Chars.length > 0) {
        prologueTimeline.to(prologue2Chars, { 
          filter: "blur(10px)", 
          scale: 1, 
          opacity: 0, 
          duration: 3, 
          stagger: 0.1 
        }, "+=4");
      }

      if (prologue3text1 && prologue3text1.chars) {
        prologueTimeline.fromTo(prologue3text1.chars, { opacity: 0 }, {
          opacity: 1,
          stagger: 0.07,
          duration: 3,
          ease: "power1.out"
        });
      }

      if (prologue3text2 && prologue3text2.chars) {
        prologueTimeline.fromTo(prologue3text2.chars, {
          filter: "blur(10px)",
          y: -60,
          scale: 1.5,
          opacity: 0
        }, {
          filter: "blur(0px)",
          y: 0,
          scale: 1,
          opacity: 1,
          stagger: 0.3,
          duration: 4,
          ease: "sine.inOut"
        });
      }

      if (prologue3text3 && prologue3text3.chars) {
        prologueTimeline.fromTo(prologue3text3.chars, {
          filter: "blur(10px)",
          y: -60,
          scale: 1.5,
          opacity: 0
        }, {
          filter: "blur(0px)",
          y: 0,
          scale: 1,
          opacity: 1,
          stagger: 0.3,
          duration: 4,
          ease: "sine.inOut"
        }, "<");
      }

      // Animate the shader radius
      prologueTimeline.fromTo(material.uniforms.u_radius, { value: 0 }, {
        value: 1,
        ease: "sine.inOut",
        duration: 20,
      }, "-=6");

      // Animate other elements
      prologueTimeline.fromTo(
        ["#inner-grandfather-name", ".prologue-gi-frame", ".prologue-gi-cta"], 
        { opacity: 0 }, 
        {
          opacity: 1,
          ease: "sine.inOut",
          duration: 3,
        },
        "-=10"
      );

      if (prologue3text4 && prologue3text4.chars) {
        prologueTimeline.fromTo(prologue3text4.chars, { opacity: 0 }, {
          opacity: 1,
          stagger: 0.07,
          duration: 3,
          ease: "power1.out"
        }, "-=3");
      }

      // Animate end content wrapper
      const endContentWrapper = prologueContents[2].querySelector(".prologue-end-content-wrapper");
      if (endContentWrapper) {
        prologueTimeline.fromTo(endContentWrapper, {
          filter: "blur(0px), brightness(100)",
          scale: 1,
          opacity: 1,
        }, {
          filter: "blur(20px), brightness(50)",
          scale: 0.95,
          opacity: 0,
          duration: 5,
          ease: "sine.inOut"
        }, "+=3");
      }

      // Animate prologue-gi-test height
      prologueTimeline.fromTo(".prologue-gi-test", { height: "90%" }, {
        height: "75%",
        duration: 5,
        ease: "sine.inOut"
      }, "<-=1");

    } catch (error) {
      console.error("Error creating timeline animations:", error);
    }
    } catch (error) {
      console.error("Error in prologue initialization:", error);
    }
  }
});
