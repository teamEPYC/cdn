import * as THREE from "three";
document.addEventListener("DOMContentLoaded", function () {
    class e {
        constructor(e) {
            (this.scene = new THREE.Scene()), (this.container = e.dom);
            const t = getComputedStyle(this.container).position;
            "relative" !== t && "absolute" !== t && "fixed" !== t && "sticky" !== t && (this.container.style.position = "relative"),
                (this.width = this.container.offsetWidth),
                (this.height = this.container.offsetHeight),
                (this.renderer = new THREE.WebGLRenderer()),
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)),
                this.renderer.setSize(this.width, this.height),
                this.renderer.setClearColor(15658734, 1);
            const i = this.container.getAttribute("tlg-fluted-glass-mode");
            this.mode = ["static", "mouse", "scroll"].includes(i) ? i : "static";
            const n = this.container.getAttribute("tlg-fluted-glass-motion");
            (this.motionFactor = -50 * parseFloat(n) || -50), this.container.appendChild(this.renderer.domElement);
            (this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1e3, 1e3)),
                this.camera.position.set(0, 0, 2),
                (this.isPlaying = !0),
                this.addObjects(),
                this.resize(),
                this.render(),
                this.setupResize(),
                "mouse" === this.mode && this.mouseEvents(),
                "scroll" === this.mode && this.setupScroll();
        }
        mouseEvents() {
            this.container.addEventListener("mousemove", (e) => {
                this.onMouseMove(e);
            });
        }
        setupScroll() {
            window.addEventListener("scroll", this.handleScroll.bind(this));
        }
        handleScroll() {
            const e = this.container.getBoundingClientRect(),
                t = e.top,
                i = e.bottom;
            if (t < window.innerHeight && i >= 0) {
                const e = window.innerHeight + this.container.offsetHeight,
                    i = (window.innerHeight - t) / e,
                    n = 0.2;
                this.material && (this.material.uniforms.uMotionValue.value = i * n * this.motionFactor);
            }
        }
        onMouseMove(e) {
            (this.mouse.x = e.clientX / window.innerWidth), (this.mouse.y = 1 - e.clientY / window.innerHeight), this.material && (this.material.uniforms.uMotionValue.value = 0.5 + this.mouse.x * this.motionFactor * 0.1);
        }
        setupResize() {
            window.addEventListener("resize", this.resize.bind(this));
        }
        resize() {
            (this.width = this.container.offsetWidth),
                (this.height = this.container.offsetHeight),
                this.renderer.setSize(this.width, this.height),
                (this.camera.aspect = this.width / this.height),
                this.material && ((this.material.uniforms.resolution.value.x = this.width), (this.material.uniforms.resolution.value.y = this.height)),
                this.camera.updateProjectionMatrix();
        }
        addObjects() {
            const e = this.container.querySelectorAll("[tlg-fluted-glass-image]"),
                t = e[Math.floor(Math.random() * e.length)],
                i = this.container.getAttribute("tlg-fluted-glass-rotation");
            this.rotationAngle = parseFloat(i, 10) || 0;
            const n = this.container.getAttribute("tlg-fluted-glass-segments");
            this.segments = parseInt(n, 10) || 80;
            const a = this.container.getAttribute("tlg-fluted-glass-overlay");
            this.overlayOpacity = Math.max(0, Math.min(100, parseFloat(a, 10) || 0));
            const s = new Image();
            (s.onload = () => {
                (this.imageAspect = s.naturalWidth / s.naturalHeight), this.setupMaterialAndGeometry(t.src);
            }),
                (s.src = t.src);
        }
        setupMaterialAndGeometry(e) {
            const t = this.renderer.domElement;
            (t.style.position = "absolute"), (t.style.top = "0"), (t.style.left = "0"), this.container.appendChild(t);
            let i = new THREE.TextureLoader().load(e);
            (i.minFilter = THREE.LinearFilter),
                (this.mouse = new THREE.Vector2(0.5, 0.5)),
                (this.material = new THREE.ShaderMaterial({
                    extensions: { derivatives: "#extension GL_OES_standard_derivatives : enable" },
                    side: THREE.DoubleSide,
                    uniforms: {
                        resolution: { value: new THREE.Vector4() },
                        uTexture: { value: i },
                        uMotionValue: { value: 0.5 },
                        uRotation: { value: this.rotationAngle },
                        uSegments: { value: this.segments },
                        uOverlayColor: { value: new THREE.Vector3(0, 0, 0) },
                        uOverlayColorWhite: { value: new THREE.Vector3(1, 1, 1) },
                        uImageAspect: { value: this.imageAspect },
                        uOverlayOpacity: { value: this.overlayOpacity },
                    },
                    vertexShader: "\nvarying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
                    fragmentShader:
                        "\nprecision mediump float;\nuniform sampler2D uTexture;\nuniform vec4 resolution;\nvarying vec2 vUv;\nuniform float uImageAspect;\nuniform vec3 uOverlayColor;\nuniform vec3 uOverlayColorWhite;\nuniform float uMotionValue;\nuniform float uRotation;\nuniform float uSegments;\nuniform float uOverlayOpacity;\n\nvoid main() {\n    float canvasAspect = resolution.x / resolution.y;\n    float numSlices = uSegments;\n    float rotationRadians = uRotation * (3.14159265 / 180.0); // Convert rotation to radians\n\n    // Adjust the UV coordinates for aspect ratio\n    vec2 scaledUV = vUv;\n    if (uImageAspect > canvasAspect) {\n        float scale = canvasAspect / uImageAspect;\n        scaledUV.x = (vUv.x - 0.5) * scale + 0.5;\n    } else {\n        float scale = uImageAspect / canvasAspect;\n        scaledUV.y = (vUv.y - 0.5) * scale + 0.5;\n    }\n\n    // Rotate the texture to align it with the warping axis\n    vec2 rotatedUV = vec2(\n        cos(rotationRadians) * (scaledUV.x - 0.5) - sin(rotationRadians) * (scaledUV.y - 0.5) + 0.5,\n        sin(rotationRadians) * (scaledUV.x - 0.5) + cos(rotationRadians) * (scaledUV.y - 0.5) + 0.5\n    );\n\n    // Apply the warping effect along the aligned axis (now horizontal after rotation)\n    float sliceProgress = fract(rotatedUV.x * numSlices + uMotionValue);\n    float amplitude = 0.015; // The amplitude of the sine wave\n    rotatedUV.x += amplitude * sin(sliceProgress * 3.14159265 * 2.0) * (1.0 - 0.5 * abs(sliceProgress - 0.5));\n\n    // Rotate the UVs back to the original orientation\n    vec2 finalUV = vec2(\n        cos(-rotationRadians) * (rotatedUV.x - 0.5) - sin(-rotationRadians) * (rotatedUV.y - 0.5) + 0.5,\n        sin(-rotationRadians) * (rotatedUV.x - 0.5) + cos(-rotationRadians) * (rotatedUV.y - 0.5) + 0.5\n    );\n\n    // Tile texture on edges using the final UVs\n    vec2 tileIndex = floor(finalUV);\n    vec2 oddTile = mod(tileIndex, 2.0);\n    vec2 mirroredUV = mix(fract(finalUV), 1.0 - fract(finalUV), oddTile);\n    vec4 color = texture2D(uTexture, mirroredUV);\n\n    if (uOverlayOpacity > 0.0) {\n        // Apply overlays with the specified opacity\n        float blackOverlayAlpha = 0.05 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.5 + 1.57))) * (uOverlayOpacity / 100.0);\n        color.rgb *= (1.0 - blackOverlayAlpha);\n\n        float whiteOverlayAlpha = 0.15 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.7 - 0.7))) * (uOverlayOpacity / 100.0);\n        color.rgb = mix(color.rgb, uOverlayColorWhite, whiteOverlayAlpha);\n    }\n\n    gl_FragColor = color;\n}\n",
                })),
                (this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)),
                (this.plane = new THREE.Mesh(this.geometry, this.material)),
                this.scene.add(this.plane),
                this.resize(),
                this.handleScroll();
        }
        render(e = 0) {
            this.isPlaying && (requestAnimationFrame(this.render.bind(this)), this.renderer.render(this.scene, this.camera));
        }
    }
    document.querySelectorAll("[tlg-fluted-glass-canvas]").forEach((t) => {
        t.querySelector("[tlg-fluted-glass-image]") ? new e({ dom: t }) : console.error("No [tlg-fluted-glass-image] child found within [tlg-fluted-glass-canvas] element.");
    });
});
