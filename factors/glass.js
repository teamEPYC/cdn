import * as THREE from "three";

// Run the script when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    
    class FlutedGlassEffect {
        constructor(config) {
            this.scene = new THREE.Scene();
            this.container = config.dom;

            // Ensure the container has a valid position for absolute positioning
            const containerStyle = getComputedStyle(this.container).position;
            if (!["relative", "absolute", "fixed", "sticky"].includes(containerStyle)) {
                this.container.style.position = "relative";
            }

            // Set up renderer
            this.width = this.container.offsetWidth;
            this.height = this.container.offsetHeight;
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setSize(this.width, this.height);
            this.renderer.setClearColor(0xeeeeee, 1); // Light gray background

            // Determine motion mode (static, mouse, or scroll)
            this.mode = this.container.getAttribute("tlg-fluted-glass-mode");
            this.mode = ["static", "mouse", "scroll"].includes(this.mode) ? this.mode : "static";

            // Motion factor (how much it moves with interaction)
            this.motionFactor = parseFloat(this.container.getAttribute("tlg-fluted-glass-motion")) * -50 || -50;

            // Append the WebGL canvas to the container
            this.container.appendChild(this.renderer.domElement);

            // Set up camera
            this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1000, 1000);
            this.camera.position.set(0, 0, 2);

            this.isPlaying = true;

            // Initialize objects
            this.addObjects();
            this.resize();
            this.render();
            this.setupResize();

            // Add event listeners based on mode
            if (this.mode === "mouse") {
                this.setupMouseEvents();
            } else if (this.mode === "scroll") {
                this.setupScrollEvents();
            }
        }

        // Handle mouse movement
        setupMouseEvents() {
            this.container.addEventListener("mousemove", (event) => this.onMouseMove(event));
        }

        // Handle scrolling
        setupScrollEvents() {
            window.addEventListener("scroll", this.onScroll.bind(this));
        }

        // Adjust effect based on scroll position
        onScroll() {
            const bounds = this.container.getBoundingClientRect();
            const isVisible = bounds.top < window.innerHeight && bounds.bottom >= 0;

            if (isVisible) {
                const effectFactor = (window.innerHeight - bounds.top) / (window.innerHeight + this.container.offsetHeight);
                const motionStrength = 0.2; // Controls how strong the scroll effect is
                if (this.material) {
                    this.material.uniforms.uMotionValue.value = effectFactor * motionStrength * this.motionFactor;
                }
            }
        }

        // Adjust effect based on mouse movement
        onMouseMove(event) {
            this.mouse.x = event.clientX / window.innerWidth;
            this.mouse.y = 1 - event.clientY / window.innerHeight;

            if (this.material) {
                this.material.uniforms.uMotionValue.value = 0.5 + this.mouse.x * this.motionFactor * 0.1;
            }
        }

        // Handle window resize
        setupResize() {
            window.addEventListener("resize", this.resize.bind(this));
        }

        // Resize renderer and camera when window size changes
        resize() {
            this.width = this.container.offsetWidth;
            this.height = this.container.offsetHeight;
            this.renderer.setSize(this.width, this.height);
            this.camera.aspect = this.width / this.height;

            if (this.material) {
                this.material.uniforms.resolution.value.x = this.width;
                this.material.uniforms.resolution.value.y = this.height;
            }

            this.camera.updateProjectionMatrix();
        }

        // Create and apply the fluted glass effect
        addObjects() {
            const images = this.container.querySelectorAll("[tlg-fluted-glass-image]");
            const selectedImage = images[Math.floor(Math.random() * images.length)]; // Pick a random image

            // Read attributes for rotation, segments, and overlay
            this.rotationAngle = parseFloat(this.container.getAttribute("tlg-fluted-glass-rotation")) || 0;
            this.segments = parseInt(this.container.getAttribute("tlg-fluted-glass-segments"), 10) || 80;
            this.overlayOpacity = Math.max(0, Math.min(100, parseFloat(this.container.getAttribute("tlg-fluted-glass-overlay")) || 0));

            // Load the selected image
            const img = new Image();
            img.onload = () => {
                this.imageAspect = img.naturalWidth / img.naturalHeight;
                this.setupMaterialAndGeometry(selectedImage.src);
            };
            img.src = selectedImage.src;
        }

        // Set up shaders and material
        setupMaterialAndGeometry(imageSrc) {
            const canvasElement = this.renderer.domElement;
            canvasElement.style.position = "absolute";
            canvasElement.style.top = "0";
            canvasElement.style.left = "0";
            this.container.appendChild(canvasElement);

            // Load texture
            let texture = new THREE.TextureLoader().load(imageSrc);
            texture.minFilter = THREE.LinearFilter;
            this.mouse = new THREE.Vector2(0.5, 0.5);

            // Create shader material
            this.material = new THREE.ShaderMaterial({
                extensions: { derivatives: "#extension GL_OES_standard_derivatives : enable" },
                side: THREE.DoubleSide,
                uniforms: {
                    resolution: { value: new THREE.Vector4() },
                    uTexture: { value: texture },
                    uMotionValue: { value: 0.5 },
                    uRotation: { value: this.rotationAngle },
                    uSegments: { value: this.segments },
                    uOverlayColor: { value: new THREE.Vector3(0, 0, 0) },
                    uOverlayColorWhite: { value: new THREE.Vector3(1, 1, 1) },
                    uImageAspect: { value: this.imageAspect },
                    uOverlayOpacity: { value: this.overlayOpacity },
                },
                vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
                fragmentShader: `precision mediump float;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;
uniform float uImageAspect;
uniform vec3 uOverlayColor;
uniform vec3 uOverlayColorWhite;
uniform float uMotionValue;
uniform float uRotation;
uniform float uSegments;
uniform float uOverlayOpacity;

void main() {
    float canvasAspect = resolution.x / resolution.y;
    float numSlices = uSegments;
    float rotationRadians = uRotation * (3.14159265 / 180.0); 

    // Adjust the UV coordinates for aspect ratio
    vec2 scaledUV = vUv;
    if (uImageAspect > canvasAspect) {
        float scale = canvasAspect / uImageAspect;
        scaledUV.x = (vUv.x - 0.5) * scale + 0.5;
    } else {
        float scale = uImageAspect / canvasAspect;
        scaledUV.y = (vUv.y - 0.5) * scale + 0.5;
    }

    // Rotate the texture
    vec2 rotatedUV = vec2(
        cos(rotationRadians) * (scaledUV.x - 0.5) - sin(rotationRadians) * (scaledUV.y - 0.5) + 0.5,
        sin(rotationRadians) * (scaledUV.x - 0.5) + cos(rotationRadians) * (scaledUV.y - 0.5) + 0.5
    );

    // Just slice the image into sections without warping
    float sliceProgress = fract(rotatedUV.x * numSlices + uMotionValue);

    // Rotate the UVs back
    vec2 finalUV = vec2(
        cos(-rotationRadians) * (rotatedUV.x - 0.5) - sin(-rotationRadians) * (rotatedUV.y - 0.5) + 0.5,
        sin(-rotationRadians) * (rotatedUV.x - 0.5) + cos(-rotationRadians) * (rotatedUV.y - 0.5) + 0.5
    );

    // Tile texture on edges
    vec2 tileIndex = floor(finalUV);
    vec2 oddTile = mod(tileIndex, 2.0);
    vec2 mirroredUV = mix(fract(finalUV), 1.0 - fract(finalUV), oddTile);
    vec4 color = texture2D(uTexture, mirroredUV);

    // Apply overlays
    if (uOverlayOpacity > 0.0) {
        float blackOverlayAlpha = 0.05 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.5 + 1.57))) * (uOverlayOpacity / 100.0);
        color.rgb *= (1.0 - blackOverlayAlpha);

        float whiteOverlayAlpha = 0.15 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.7 - 0.7))) * (uOverlayOpacity / 100.0);
        color.rgb = mix(color.rgb, uOverlayColorWhite, whiteOverlayAlpha);
    }

    gl_FragColor = color;
}
`,
            });

            // Create plane and add to scene
            this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
            this.plane = new THREE.Mesh(this.geometry, this.material);
            this.scene.add(this.plane);

            // Apply initial transformations
            this.resize();
            this.onScroll();
        }

        // Render loop
        render() {
            if (this.isPlaying) {
                requestAnimationFrame(this.render.bind(this));
                this.renderer.render(this.scene, this.camera);
            }
        }
    }

    // Initialize effect for all matching elements
    document.querySelectorAll("[tlg-fluted-glass-canvas]").forEach((canvasElement) => {
        if (canvasElement.querySelector("[tlg-fluted-glass-image]")) {
            new FlutedGlassEffect({ dom: canvasElement });
        } else {
            console.error("No [tlg-fluted-glass-image] child found within [tlg-fluted-glass-canvas] element.");
        }
    });
});
