import * as THREE from "three";
document.addEventListener("DOMContentLoaded", function() {
    class FlutedGlassEffect {
        constructor(options) {
            this.scene = new THREE.Scene();
            this.container = options.dom;
            this.width = this.container.offsetWidth;
            this.height = this.container.offsetHeight;
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setSize(this.width, this.height);
            this.container.appendChild(this.renderer.domElement);
            this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1000, 1000);
            this.camera.position.set(0, 0, 2);
            this.isPlaying = true;
            this.addObjects();
            this.resize();
            this.render();
            this.setupResize();
        }
        setupResize() {
            window.addEventListener("resize", this.resize.bind(this));
        }
        resize() {
            this.width = this.container.offsetWidth;
            this.height = this.container.offsetHeight;
            this.renderer.setSize(this.width, this.height);
            this.camera.updateProjectionMatrix();
        }
        addObjects() {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load("path/to/your/image.jpg");
            this.material = new THREE.ShaderMaterial({
                vertexShader:"\nvarying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
                fragmentShader:"\nprecision mediump float;\nuniform sampler2D uTexture;\nuniform vec4 resolution;\nvarying vec2 vUv;\nuniform float uImageAspect;\nuniform vec3 uOverlayColor;\nuniform vec3 uOverlayColorWhite;\nuniform float uMotionValue;\nuniform float uRotation;\nuniform float uSegments;\nuniform float uOverlayOpacity;\n\nvoid main() {\n    float canvasAspect = resolution.x / resolution.y;\n    float numSlices = uSegments;\n    float rotationRadians = uRotation * (3.14159265 / 180.0); // Convert rotation to radians\n\n    // Adjust the UV coordinates for aspect ratio\n    vec2 scaledUV = vUv;\n    if (uImageAspect > canvasAspect) {\n        float scale = canvasAspect / uImageAspect;\n        scaledUV.x = (vUv.x - 0.5) * scale + 0.5;\n    } else {\n        float scale = uImageAspect / canvasAspect;\n        scaledUV.y = (vUv.y - 0.5) * scale + 0.5;\n    }\n\n    // Rotate the texture to align it with the warping axis\n    vec2 rotatedUV = vec2(\n        cos(rotationRadians) * (scaledUV.x - 0.5) - sin(rotationRadians) * (scaledUV.y - 0.5) + 0.5,\n        sin(rotationRadians) * (scaledUV.x - 0.5) + cos(rotationRadians) * (scaledUV.y - 0.5) + 0.5\n    );\n\n    // Apply the warping effect along the aligned axis (now horizontal after rotation)\n    float sliceProgress = fract(rotatedUV.x * numSlices + uMotionValue);\n    float amplitude = 0.015; // The amplitude of the sine wave\n    rotatedUV.x += amplitude * sin(sliceProgress * 3.14159265 * 2.0) * (1.0 - 0.5 * abs(sliceProgress - 0.5));\n\n    // Rotate the UVs back to the original orientation\n    vec2 finalUV = vec2(\n        cos(-rotationRadians) * (rotatedUV.x - 0.5) - sin(-rotationRadians) * (rotatedUV.y - 0.5) + 0.5,\n        sin(-rotationRadians) * (rotatedUV.x - 0.5) + cos(-rotationRadians) * (rotatedUV.y - 0.5) + 0.5\n    );\n\n    // Tile texture on edges using the final UVs\n    vec2 tileIndex = floor(finalUV);\n    vec2 oddTile = mod(tileIndex, 2.0);\n    vec2 mirroredUV = mix(fract(finalUV), 1.0 - fract(finalUV), oddTile);\n    vec4 color = texture2D(uTexture, mirroredUV);\n\n    if (uOverlayOpacity > 0.0) {\n        // Apply overlays with the specified opacity\n        float blackOverlayAlpha = 0.05 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.5 + 1.57))) * (uOverlayOpacity / 100.0);\n        color.rgb *= (1.0 - blackOverlayAlpha);\n\n        float whiteOverlayAlpha = 0.15 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.7 - 0.7))) * (uOverlayOpacity / 100.0);\n        color.rgb = mix(color.rgb, uOverlayColorWhite, whiteOverlayAlpha);\n    }\n\n    gl_FragColor = color;\n}\n"
            });
            this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
            this.plane = new THREE.Mesh(this.geometry, this.material);
            this.scene.add(this.plane);
            this.resize();
        }
        render() {
            if (this.isPlaying) {
                requestAnimationFrame(this.render.bind(this));
                this.renderer.render(this.scene, this.camera);
            }
        }
    }
    document.querySelectorAll("[tlg-fluted-glass-canvas]").forEach(container => {
        new FlutedGlassEffect({ dom: container });
    });
});
