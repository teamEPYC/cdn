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
    //–– Three.js setup ––
    const canvas = document.getElementById("canvas_prologue");
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
    const prologue1text1 = new SplitText(prologueContents[0].querySelectorAll(
      ".prologue-content-block:nth-child(1) .prologue-text"), { type: "chars" });
    const prologue1text2 = new SplitText(prologueContents[0].querySelectorAll(
      ".prologue-content-block:nth-child(2) .prologue-text"), { type: "chars" });
    const prologue2text1 = new SplitText(prologueContents[1].querySelectorAll(
      ".prologue-content-block:nth-child(1) .prologue-text"), { type: "chars" });
    const prologue2text2 = new SplitText(prologueContents[1].querySelectorAll(
      ".prologue-content-block:nth-child(2) .prologue-text"), { type: "chars" });
    const prologue3text1 = new SplitText(prologueContents[2].querySelectorAll(
      ".prologue-content-block:nth-child(1) .prologue-text-small"), { type: "chars" });
    const prologue3text2 = new SplitText(prologueContents[2].querySelector(
      ".prologue-grandfather-container .prologue-grandfathers-name:nth-of-type(1)"
    ), { type: "chars" });
    const prologue3text3 = new SplitText(prologueContents[2].querySelector(
      ".prologue-gi-test .prologue-grandfathers-name"
    ), { type: "chars" }); // splitting internal text so that it aligns with the external
    const prologue3image = prologueContents[2].querySelector(".prologue-gi-mask .noise");
    const prologue3text4 = new SplitText(prologueContents[2].querySelectorAll(
      ".prologue-content-block:nth-child(2) .prologue-text-small"), { type: "chars" });

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
    }).fromTo(prologue1text2.chars, {
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
    }, "+=2").to([prologue1text1.chars, prologue1text2
      .chars
    ], { filter: "blur(10px)", scale: 1, opacity: 0, duration: 3, stagger: 0.1 }, "+=4").fromTo(
      prologue2text1.chars, { filter: "blur(10px)", scale: 1.5, opacity: 0 }, {
        filter: "blur(0px)",
        scale: 1,
        opacity: 1,
        stagger: 0.2,
        duration: 4,
        ease: "power1.out"
      }
    ).fromTo(prologue2text2.chars, {
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
    }, "+=2").to([prologue2text1.chars, prologue2text2
      .chars
    ], { filter: "blur(10px)", scale: 1, opacity: 0, duration: 3, stagger: 0.1 }, "+=4").fromTo(
      prologue3text1.chars, { opacity: 0 }, {
        opacity: 1,
        stagger: 0.07,
        duration: 3,
        ease: "power1.out"
      }
    ).fromTo(prologue3text2.chars, {
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
    }).fromTo(prologue3text3.chars, {
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
    }, "<").fromTo(
      material.uniforms.u_radius, // target the actual float
      { value: 0 },
      {
        value: 1,
        ease: "sine.inOut",
        duration: 20,
      }, "-=6").fromTo(
      ["#inner-grandfather-name", ".prologue-gi-frame",
        ".prologue-gi-cta"
      ], { opacity: 0 }, // fully hidden from all sides
      {
        opacity: 1, // full rectangle visible
        ease: "sine.inOut",
        duration: 3,
      },
      "-=10"
    ).fromTo(prologue3text4.chars, { opacity: 0 }, {
      opacity: 1,
      stagger: 0.07,
      duration: 3,
      ease: "power1.out"
    }, "-=3").fromTo(prologueContents[2]
      .querySelector(".prologue-end-content-wrapper"), {
        filter: "blur(0px), brightness(100)",
        scale: 1,
        opacity: 1,
      }, {
        filter: "blur(20px), brightness(50)",
        scale: 0.95,
        opacity: 0,
        duration: 5,
        ease: "sine.inOut"
      }, "+=3"
    ).fromTo(".prologue-gi-test", { height: "90%" }, {
        height: "75%",
        duration: 5,
        ease: "sine.inOut"
      },
      "<-=1"
    );
    /*.to(prologue3image, 
        {r: "50%", duration: 5, ease: "sine.inOut"}, "<-=2"
    );*/

  }
});
