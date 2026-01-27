        const config = {
            simRes: 1024,         // Resolution of the fluid simulation
            dyeSize: 0.014,      // Brush size
            dissipation: 0.99,  // Drying speed
            imageAspect: 2292 / 1800, // Target aspect ratio of the loaded images (~1.27)
            cameraZ: 2.5,        // Fixed camera Z position
            cameraFOV: 45        // Fixed camera field of view
        };

        // --- MOVEMENT DETECTION CONFIG ---
        const DRAWING_DELAY_MS = 50; // Time (ms) after the last mouse event to stop drawing
        let drawingTimeout;

        let renderer, scene, camera;
        let mainPlane;
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2(10000, 10000); 
        let targetMouse = new THREE.Vector2(10000, 10000);
        
        let simScene, simCamera, simMesh;
        let rtA, rtB; // Ping-pong buffers
        let sketchTexture, realTexture;

        // Image URLs provided by the user
        const SKETCH_URL = 'https://cdn.prod.website-files.com/6904a418739bb0c76ab91cce/6928889baf0cbced54d35014_hero_final_3.jpg';
        const REAL_URL = 'https://cdn.prod.website-files.com/6904a418739bb0c76ab91cce/690e0541542954f4a934a22d_image.jpg';


        // --- 2. ASSETS LOADING ---
        function loadTexturesAndInit() {
            const textureLoader = new THREE.TextureLoader();
            let texturesLoaded = 0;
            const totalTextures = 2;

            const onTextureLoad = () => {
                texturesLoaded++;
                if (texturesLoaded === totalTextures) {
                    // Once both textures are loaded, set up the scene and start the loop
                    setupScene();
                    animate();
                }
            };
            
            // Function to handle image loading and fallbacks
            const loadTexture = (url, isReal) => {
                return textureLoader.load(
                    url,
                    (texture) => {
                        console.log(`Texture loaded: ${url}`);
                        // Set texture wrap mode to repeat for better behavior on scaled plane
                        texture.wrapS = THREE.ClampToEdgeWrapping;
                        texture.wrapT = THREE.ClampToEdgeWrapping;
                        if (isReal) {
                            realTexture = texture;
                        } else {
                            sketchTexture = texture;
                        }
                        onTextureLoad();
                    },
                    undefined,
                    (err) => { 
                        console.error(`Error loading texture (${url}). Using fallback solid color.`, err); 
                        // Create a fallback texture (1x1 white pixel)
                        const fallbackCanvas = document.createElement('canvas');
                        fallbackCanvas.width = 1;
                        fallbackCanvas.height = 1;
                        const ctx = fallbackCanvas.getContext('2d');
                        ctx.fillStyle = isReal ? '#FFD700' : '#E0E0E0'; // Gold/Grey fallback
                        ctx.fillRect(0, 0, 1, 1);
                        const fallbackTexture = new THREE.CanvasTexture(fallbackCanvas);
                        if (isReal) {
                            realTexture = fallbackTexture;
                        } else {
                            sketchTexture = fallbackTexture;
                        }
                        onTextureLoad();
                    }
                );
            };

            // Load Sketch/Background Texture (tSketch)
            loadTexture(SKETCH_URL, false); 
            
            // Load Real/Foreground Texture (tReal)
            loadTexture(REAL_URL, true);
        }
        
        // --- 3. SHADERS (Unchanged from previous versions) ---

        const vShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const simFragmentShader = `
            uniform sampler2D tOld;
            uniform vec2 uMouse;
            uniform float uAspect;
            uniform bool uIsDrawing;
            uniform float uDissipation;
            uniform float uSize;
            uniform float uTime;

            varying vec2 vUv;

            // Hash function for Perlin Noise (Generates random unit vectors/gradients)
            vec2 hash22(vec2 p) {
                p = vec2(dot(p, vec2(127.1, 311.7)),
                         dot(p, vec2(269.5, 183.3)));
                return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
            }

            // Perlin Noise (Gradient Noise) - Smooth, rounded gradients
            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                
                // Quintic interpolation curve (6*f^5 - 15*f^4 + 10*f^3) for smoother results
                vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

                // Calculate dot products between gradient vectors and position vectors
                float a = dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
                float b = dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
                float c = dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
                float d = dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));

                // Bilinear interpolation
                return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
            }


            // Fractal Brownian Motion: Layers noise to create "cloud" or "water" texture
            #define OCTAVES 5
            float fbm(vec2 st) {
                float value = 0.4;
                float amplitude = 1.5; // Increased amplitude for more organic influence
                // Note: current scale (0.5) creates very large, low-frequency movement.
                st *= 5.0; 
                for (int i = 0; i < OCTAVES; i++) {
                    value += amplitude * noise(st);
                    st *= 2.5;
                    amplitude *= 0.5;
                }
                return value;
            }

            void main() {
                vec4 oldColor = texture2D(tOld, vUv);
                float newAlpha = oldColor.r * uDissipation;

                if(uIsDrawing) {
                    vec2 aspectUV = vUv;
                    aspectUV.x *= uAspect;
                    vec2 aspectMouse = uMouse;
                    aspectMouse.x *= uAspect;

                    // 1. Calculate distance to mouse
                    float dist = distance(aspectUV, aspectMouse);

                    // 2. Generate organic noise based on position and time
                    float noiseVal = fbm(vUv * 0.5 + uTime * 0.1); 
                    
                    // 3. Distort the brush shape
                    // Use abs() here to ensure the distortion only ever pulls the brush in,
                    // guaranteeing paint is applied where the mouse is, while retaining roughness.
                    float distortion = abs(noiseVal) * uSize * 7.0; 
                    float brushShape = dist - distortion;
                    
                    // 4. Soft brush edge
                    float intensity = 1.0 - smoothstep(uSize * 0.2, uSize * 1.5, brushShape);
                    
                    intensity = max(0.0, intensity);
                    
                    // Add to existing paint
                    newAlpha = max(newAlpha, intensity);
                }

                gl_FragColor = vec4(newAlpha, 0.0, 0.0, 1.0);
            }
        `;

        const displayFragmentShader = `
            uniform sampler2D tSketch;
            uniform sampler2D tReal;
            uniform sampler2D tMask;

            varying vec2 vUv;

            // Hash function for Perlin Noise (Generates random unit vectors/gradients)
            vec2 hash22(vec2 p) {
                p = vec2(dot(p, vec2(127.1, 311.7)),
                         dot(p, vec2(269.5, 183.3)));
                return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
            }

            // Perlin Noise (Gradient Noise) - Smooth, rounded gradients
            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                
                // Quintic interpolation curve
                vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

                // Calculate dot products
                float a = dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
                float b = dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
                float c = dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
                float d = dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));

                return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
            }
            

            void main() {
                vec4 sketchCol = texture2D(tSketch, vUv);
                vec4 realCol = texture2D(tReal, vUv);
                
                // Get the fluid mask
                float mask = texture2D(tMask, vUv).r;

                // 1. Paper Grain Simulation (Using Perlin Noise for smoother, cluster-like grain)
                float grain = noise(vUv * 80.0); 
                
                // 2. "Bleed" the mask into the grain
                // Subtracting grain from the mask breaks up the edge
                float organicMask = mask - (grain * 0.2);
                
                // 3. Create a feathered blend factor for a multi-layer look
                // Clamp the organic mask to 0..1 range
                float blendFactor = clamp(organicMask, 0.0, 1.0);
                
                // Apply a power function to make the center fully opaque sooner,
                // and the edges much softer and more transparent, simulating watercolor layers.
                float featheredBlend = pow(blendFactor, 1.8);

                // Mix colors: sketch is background, real is foreground
                vec4 finalColor = mix(sketchCol, realCol, featheredBlend);

                gl_FragColor = finalColor;
            }
        `;

        // --- 4. INITIALIZATION ---

        function setupScene() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            const container = document.getElementById('canvas-container');
            if (container) {
                container.appendChild(renderer.domElement);
            }

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(config.cameraFOV, width / height, 0.1, 100);
            camera.position.z = config.cameraZ; 

            // Simulation Setup (unchanged)
            simScene = new THREE.Scene();
            simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            
            const rtParams = {
                // Changing interpolation to NearestFilter to try and prevent the shearing artifact
                minFilter: THREE.NearestFilter, 
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat,
                type: THREE.FloatType, 
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping
            };
            rtA = new THREE.WebGLRenderTarget(config.simRes, config.simRes, rtParams);
            rtB = new THREE.WebGLRenderTarget(config.simRes, config.simRes, rtParams);

            const simGeo = new THREE.PlaneGeometry(2, 2);
            const simMat = new THREE.ShaderMaterial({
                uniforms: {
                    tOld: { value: null },
                    uMouse: { value: new THREE.Vector2(-10, -10) },
                    uAspect: { value: 1.0 },
                    uIsDrawing: { value: false },
                    uDissipation: { value: config.dissipation },
                    uSize: { value: config.dyeSize },
                    uTime: { value: 0.0 }
                },
                vertexShader: vShader,
                fragmentShader: simFragmentShader
            });
            simMesh = new THREE.Mesh(simGeo, simMat);
            simScene.add(simMesh);

            // Display Setup
            // Changed plane geometry to 1x1 for easier scaling with the 'cover' function
            const geometry = new THREE.PlaneGeometry(1, 1); 
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    tSketch: { value: sketchTexture },
                    tReal: { value: realTexture },
                    tMask: { value: rtA.texture }
                },
                vertexShader: vShader,
                fragmentShader: displayFragmentShader
            });

            mainPlane = new THREE.Mesh(geometry, material);
            scene.add(mainPlane);
            
            // Initial call to set the aspect-locked scale
            updatePlaneSizing();

            window.addEventListener('resize', onWindowResize);
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('touchmove', onTouchMove, { passive: false });
        }

        /**
         * Scales the main plane mesh to maintain the image's aspect ratio (1375/1080)
         * while ensuring it always fills the full width of the camera's view frustum.
         * This locks the aspect ratio, preventing stretching, but may result in vertical cropping
         * if the screen aspect ratio is wider than the image's aspect ratio.
         */
        function updatePlaneSizing() {
            if (!mainPlane || !camera) return;

            const width = window.innerWidth;
            const height = window.innerHeight;
            const screenAspect = width / height;
            const imageAspect = config.imageAspect;

            // 1. Calculate the visible dimensions of the camera frustum at Z = config.cameraZ
            const frustumHalfHeight = config.cameraZ * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            const frustumHeight = frustumHalfHeight * 2;
            const frustumWidth = frustumHeight * screenAspect;

            // 2. Set dimensions: always fill the width, calculate height based on image aspect.
            // This ensures the image aspect is maintained and the full width is used.
            const targetWidth = frustumWidth;
            const targetHeight = frustumWidth / imageAspect;

            // Apply the final scale to the 1x1 plane geometry
            mainPlane.scale.set(targetWidth, targetHeight, 1);
        }

        // --- 5. EVENTS ---
        
        function updateMouseCoords(x, y) {
            // Get the current dimensions of the renderer's DOM element
            const rect = renderer.domElement.getBoundingClientRect();
            
            // Calculate Normalized Device Coordinates (NDC) relative to the canvas
            const ndc = new THREE.Vector2(
                ((x - rect.left) / rect.width) * 2 - 1,
                -((y - rect.top) / rect.height) * 2 + 1
            );
            
            raycaster.setFromCamera(ndc, camera);
            const intersects = raycaster.intersectObject(mainPlane);

            if (intersects.length > 0) {
                // UV coordinates are used directly as simulation coordinates (0 to 1)
                // Note: The UV coordinates here automatically account for the plane's scaling.
                targetMouse.copy(intersects[0].uv); 

                // 1. We are currently moving/hovering over the plane, so drawing should be active now
                simMesh.material.uniforms.uIsDrawing.value = true;

                // 2. Clear any pending "stop drawing" command
                clearTimeout(drawingTimeout);

                // 3. Set a new timeout: if the mouse stops moving, drawing stops after DRAWING_DELAY_MS.
                drawingTimeout = setTimeout(() => {
                    simMesh.material.uniforms.uIsDrawing.value = false;
                }, DRAWING_DELAY_MS);

            } else {
                // If we move off the plane, stop drawing immediately and clear the timeout
                simMesh.material.uniforms.uIsDrawing.value = false;
                clearTimeout(drawingTimeout);
            }
        }

        function onMouseMove(e) {
            updateMouseCoords(e.clientX, e.clientY);
        }

        function onTouchMove(e) {
            if(e.touches.length > 0) {
                e.preventDefault();
                updateMouseCoords(e.touches[0].clientX, e.touches[0].clientY);
            }
        }

        function onWindowResize() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            
            // Update the plane scale to maintain aspect ratio while filling width
            updatePlaneSizing();
            
            simMesh.material.uniforms.uAspect.value = 1.0; 
        }

        // --- 6. LOOP ---
        function animate() {
            requestAnimationFrame(animate);

            // Smooth mouse movement for continuity
            // Using 0.15 lerp factor from the provided file
            mouse.lerp(targetMouse, 0.15);

            // Update Time for noise
            simMesh.material.uniforms.uTime.value += 0.01;

            // 1. Sim Pass (Render B to A)
            simMesh.material.uniforms.tOld.value = rtB.texture;
            simMesh.material.uniforms.uMouse.value = mouse;
            
            renderer.setRenderTarget(rtA);
            renderer.render(simScene, simCamera);

            // 2. Display Pass (Render A to screen)
            mainPlane.material.uniforms.tMask.value = rtA.texture;
            
            renderer.setRenderTarget(null);
            renderer.render(scene, camera);

            // 3. Swap (A becomes B for the next iteration)
            let temp = rtA;
            rtA = rtB;
            rtB = temp;
        }

        // Start the loading process
        window.onload = loadTexturesAndInit;
