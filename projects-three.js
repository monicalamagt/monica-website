// Three.js skills visualization

const projects = [
    {
        title: "Machine Learning",
        description: "PyTorch · TensorFlow · Scikit-learn · XGBoost · LSTM · Transformers · CNNs · Model Evaluation · Backtesting · Hyperparameter Tuning",
        size: "xlarge",
        shape: "blob"
    },
    {
        title: "LLMs & NLP",
        description: "LLM Fine-tuning · Retrieval-Augmented Generation (RAG) · Vision-Language Models (VLM) · LangGraph · Qdrant · Chain-of-Thought · Multi-Agent Systems",
        size: "large",
        shape: "double-circle"
    },
    {
        title: "Quantitative Finance",
        description: "Time-Series Forecasting · Monte Carlo Simulation · Backtesting · Regression & Classification · Risk Modeling · Financial Data Pipelines · Kafka",
        size: "large",
        shape: "blob"
    },
    {
        title: "Software Engineering",
        description: "Python · FastAPI · Docker · GCP · GitHub Actions · CI/CD · SQL · Bash · C++ · Java · Git · Django · REST API Development",
        size: "medium",
        shape: "rectangular"
    },
    {
        title: "Data Science",
        description: "Pandas · NumPy · Matplotlib · Seaborn · Statistical Analysis · Feature Engineering · Regression · Classification · Data Annotation Pipelines",
        size: "medium",
        shape: "rectangular"
    }
];

class ThreeBubbleSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.blobs = [];
        this.smallBubbles = [];
        this.container = document.getElementById('bubblesContainer');
        this.modal = document.getElementById('projectModal');
        this.modalBody = document.getElementById('modalBody');
        this.modalClose = document.getElementById('modalClose');
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMobile = window.innerWidth <= 768;
        this.tappedBlob = null;
        this.hoveredBlob = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hasAnimated = false;
        this.page3 = null;
        
        this.init();
        
        // Setup scroll detection after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.setupScrollDetection();
        }, 100);
    }
    
    init() {
        this.setupScene();
        this.createEnvironment();
        this.createSmallBubbles();
        this.createBlobs();
        this.setupEventListeners();
        this.ensureCursorVisible();
        this.animate();
    }
    
    setupScrollDetection() {
        if (!this.page3) {
            this.page3 = document.querySelector('.page-3');
        }
        
        if (!this.page3) {
            // Fallback: trigger after delay
            setTimeout(() => this.triggerAnimation(), 1000);
            return;
        }
        
        // Simple IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.triggerAnimation();
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(this.page3);
        
        // Also check immediately if already visible
        const rect = this.page3.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0 && !this.hasAnimated) {
            setTimeout(() => this.triggerAnimation(), 500);
        }
    }
    
    triggerAnimation() {
        // Show small bubbles first
        this.showSmallBubbles();
        
        // Then fade in project blobs after delay
        setTimeout(() => {
            this.fadeInBlobs();
        }, 800);
    }
    
    createSmallBubbles() {
        // Create 20 small bubbles matching project blob style
        const bubbleCount = 20;
        const bubbleGeometry = new THREE.SphereGeometry(20, 16, 16);
        
        for (let i = 0; i < bubbleCount; i++) {
            // Use same material style as project blobs
            const bubbleMaterial = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color().setHSL(0.75, 0.8, 0.35), // Same purple/blue iridescent base
                metalness: 0.98, // Very high metalness for true metal look
                roughness: 0.05, // Very low roughness for sharp, reflective surface
                envMap: this.envMap,
                envMapIntensity: 1.5,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05, // Very smooth clearcoat
                ior: 1.5,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0, // Start invisible
                emissive: new THREE.Color().setHSL(0.75, 0.6, 0.1),
                emissiveIntensity: 0.1
            });
            
            const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
            
            // Random positions across the screen
            bubble.position.x = (Math.random() - 0.5) * window.innerWidth * 0.7;
            bubble.position.y = (Math.random() - 0.5) * window.innerHeight * 0.7;
            bubble.position.z = (Math.random() - 0.5) * 150;
            
            // Random scale variation
            const scale = 0.6 + Math.random() * 0.6;
            bubble.scale.set(scale, scale, scale);
            
            // Random rotation for variety
            bubble.rotation.x = Math.random() * Math.PI;
            bubble.rotation.y = Math.random() * Math.PI;
            bubble.rotation.z = Math.random() * Math.PI;
            
            bubble.userData.initialOpacity = 0.8 + Math.random() * 0.2;
            bubble.userData.targetOpacity = 0;
            
            this.scene.add(bubble);
            this.smallBubbles.push(bubble);
        }
    }
    
    showSmallBubbles() {
        this.smallBubbles.forEach((bubble, index) => {
            setTimeout(() => {
                bubble.userData.targetOpacity = bubble.userData.initialOpacity;
            }, index * 30);
            
            // Fade out after 3 seconds (3000ms) from when they appear
            setTimeout(() => {
                bubble.userData.targetOpacity = 0;
            }, index * 30 + 3000);
        });
    }
    
    fadeInBlobs() {
        this.blobs.forEach((blob, index) => {
            setTimeout(() => {
                blob.userData.targetOpacity = 1;
            }, index * 100);
        });
    }
    
    ensureCursorVisible() {
        // Just ensure cursor is in body - don't mess with position or styles
        const customCursor = document.querySelector('.custom-cursor');
        if (customCursor && customCursor.parentElement !== document.body) {
            document.body.appendChild(customCursor);
        }
    }
    
    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xE8E3D8);
        
        // Camera
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 500;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // Ensure canvas doesn't interfere with custom cursor
        this.renderer.domElement.style.cursor = 'none';
        this.renderer.domElement.style.pointerEvents = 'auto';
        this.renderer.domElement.style.zIndex = '1';
        
        this.container.appendChild(this.renderer.domElement);
        
        // Just ensure cursor is in body - don't mess with position or styles
        const customCursor = document.querySelector('.custom-cursor');
        if (customCursor && customCursor.parentElement !== document.body) {
            document.body.appendChild(customCursor);
        }
        
        // Handle resize
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }
    
    createEnvironment() {
        // Create a simple environment map using a cube texture
        const envMap = this.createSimpleEnvMap();
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
        
        // Main directional light (simulating key light)
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(100, 100, 50);
        mainLight.castShadow = true;
        this.scene.add(mainLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(-50, 50, -50);
        this.scene.add(fillLight);
        
        // Rim light for edge definition
        const rimLight = new THREE.DirectionalLight(0x8a2be2, 0.3);
        rimLight.position.set(0, 0, -100);
        this.scene.add(rimLight);
        
        this.envMap = envMap;
    }
    
    createSimpleEnvMap() {
        // Create a simple environment map using a cube camera
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
            format: THREE.RGBAFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter
        });
        
        const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
        
        // Create a simple scene for the environment
        const envScene = new THREE.Scene();
        envScene.background = new THREE.Color(0xE8E3D8);
        
        // Add some gradient spheres for environment
        for (let i = 0; i < 6; i++) {
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(50, 32, 32),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setHSL(0.7 + i * 0.05, 0.6, 0.5 + i * 0.05)
                })
            );
            sphere.position.set(
                Math.cos(i * Math.PI / 3) * 100,
                Math.sin(i * Math.PI / 3) * 100,
                Math.cos(i * Math.PI / 3) * 100
            );
            envScene.add(sphere);
        }
        
        cubeCamera.update(this.renderer, envScene);
        return cubeRenderTarget.texture;
    }
    
    createBlobGeometry(size, shape) {
        let geometry;
        
        // Use high segment count for smooth surfaces
        const segments = 64;
        
        switch(shape) {
            case 'rectangular':
                // Smooth organic rectangular blob - use sphere as base and deform
                geometry = new THREE.SphereGeometry(size * 0.5, segments, segments);
                const positions = geometry.attributes.position;
                for (let i = 0; i < positions.count; i++) {
                    const x = positions.getX(i);
                    const y = positions.getY(i);
                    const z = positions.getZ(i);
                    // Smooth organic deformation - no sharp edges
                    const scaleX = 1.3 + Math.sin(y * 0.05) * 0.2;
                    const scaleY = 0.9 + Math.cos(x * 0.05) * 0.15;
                    const scaleZ = 0.7 + Math.sin(x * 0.05 + y * 0.05) * 0.1;
                    positions.setXYZ(i, x * scaleX, y * scaleY, z * scaleZ);
                }
                geometry.computeVertexNormals();
                break;
                
            case 'double-circle':
                // Smooth double-circle blob - two merged organic spheres
                geometry = new THREE.SphereGeometry(size * 0.5, segments, segments);
                const positions2 = geometry.attributes.position;
                for (let i = 0; i < positions2.count; i++) {
                    const x = positions2.getX(i);
                    const y = positions2.getY(i);
                    const z = positions2.getZ(i);
                    // Create smooth double-bubble effect
                    const dist = Math.sqrt(x*x + y*y + z*z);
                    const offsetX = size * 0.25;
                    const dist2 = Math.sqrt((x - offsetX)*(x - offsetX) + y*y + z*z);
                    // Smooth blend between two centers
                    const blend = Math.exp(-dist * 0.02);
                    const blend2 = Math.exp(-dist2 * 0.02);
                    const combined = blend + blend2 * 0.8;
                    const scale = 0.5 + combined * 0.5;
                    positions2.setXYZ(i, x * scale, y * scale, z * scale);
                }
                geometry.computeVertexNormals();
                break;
                
            default: // blob
                // Smooth organic blob - sphere with smooth organic deformation
                geometry = new THREE.SphereGeometry(size * 0.5, segments, segments);
                const positions3 = geometry.attributes.position;
                for (let i = 0; i < positions3.count; i++) {
                    const x = positions3.getX(i);
                    const y = positions3.getY(i);
                    const z = positions3.getZ(i);
                    // Smooth organic deformation using sine waves - no sharp edges
                    const noiseX = Math.sin(x * 0.08 + y * 0.05) * Math.cos(z * 0.06) * size * 0.12;
                    const noiseY = Math.cos(x * 0.07) * Math.sin(y * 0.08 + z * 0.05) * size * 0.1;
                    const noiseZ = Math.sin(x * 0.06 + z * 0.08) * Math.cos(y * 0.07) * size * 0.08;
                    positions3.setXYZ(i, x + noiseX, y + noiseY, z + noiseZ);
                }
                geometry.computeVertexNormals();
        }
        
        return geometry;
    }
    
    createBlobs() {
        projects.forEach((project, index) => {
            const size = this.getBlobSize(project.size);
            const geometry = this.createBlobGeometry(size, project.shape);
            
            const material = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color().setHSL(0.75, 0.8, 0.35), // Unified purple/blue iridescent base
                metalness: 0.98, // Very high metalness for true metal look
                roughness: 0.05, // Very low roughness for sharp, reflective surface
                envMap: this.envMap,
                envMapIntensity: 1.5,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05, // Very smooth clearcoat
                ior: 1.5,
                side: THREE.DoubleSide,
                transparent: true, // Enable transparency for fade-in
                opacity: 0, // Start invisible
                // Softer highlights with tint
                emissive: new THREE.Color().setHSL(0.75, 0.6, 0.1),
                emissiveIntensity: 0.1
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Better vertical distribution - spread across screen height
            const horizontalRange = window.innerWidth * 0.6; // Use 60% of width
            const verticalRange = window.innerHeight * 0.8; // Use 80% of height for better spread
            
            // Distribute more evenly vertically
            const verticalSpacing = verticalRange / (projects.length + 1);
            const baseY = -verticalRange / 2 + verticalSpacing;
            
            mesh.position.x = (Math.random() - 0.5) * horizontalRange;
            mesh.position.y = baseY + (index * verticalSpacing) + (Math.random() - 0.5) * verticalSpacing * 0.3;
            mesh.position.z = (Math.random() - 0.5) * 80;
            
            // Static rotation - no movement
            mesh.rotation.x = Math.random() * Math.PI * 0.5;
            mesh.rotation.y = Math.random() * Math.PI * 0.5;
            mesh.rotation.z = Math.random() * Math.PI * 0.5;
            
            mesh.userData.project = project;
            mesh.userData.index = index;
            mesh.userData.basePosition = mesh.position.clone();
            
            // Create label element - integrated into surface
            const labelDiv = document.createElement('div');
            labelDiv.className = 'blob-label';
            labelDiv.textContent = project.title;
            labelDiv.style.position = 'absolute';
            labelDiv.style.pointerEvents = 'none';
            labelDiv.style.zIndex = '1000';
            labelDiv.style.opacity = '0.5';
            labelDiv.style.fontSize = '0.6rem';
            labelDiv.style.fontWeight = '300';
            labelDiv.style.transition = 'opacity 0.4s ease, font-size 0.4s ease, font-weight 0.4s ease, transform 0.4s ease';
            // No shadow or gradient - clean text
            labelDiv.style.textShadow = 'none';
            labelDiv.style.filter = 'none';
            this.container.appendChild(labelDiv);
            
            mesh.userData.labelElement = labelDiv;
            mesh.userData.baseScale = 1;
            mesh.userData.targetScale = 1;
            mesh.userData.targetOpacity = 0; // Start invisible
            mesh.userData.currentOpacity = 0;
            
            this.scene.add(mesh);
            this.blobs.push(mesh);
        });
    }
    
    getBlobSize(size) {
        const sizes = {
            small: 80,
            medium: 120,
            large: 160,
            xlarge: 200
        };
        return sizes[size] || 120;
    }
    
    setupEventListeners() {
        // Mouse movement for parallax
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Mouse move for hover detection
        this.renderer.domElement.addEventListener('mousemove', (e) => {
            this.handleHover(e);
        });
        
        // Click/tap handling
        this.renderer.domElement.addEventListener('click', (e) => {
            this.handleClick(e);
        });
        
        // Mouse leave to reset hover
        this.renderer.domElement.addEventListener('mouseleave', () => {
            this.resetHover();
        });
        
        // Modal close
        this.modalClose.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeModal();
        });
        
        // Modal backdrop click closes modal
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                if (e.target === this.modalClose || e.target.closest('.modal-close')) {
                    this.closeModal();
                }
            });
        }
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    handleHover(e) {
        if (this.isMobile) return; // Skip hover on mobile
        
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.blobs);
        
        if (intersects.length > 0) {
            const blob = intersects[0].object;
            
            if (this.hoveredBlob !== blob) {
                // Reset previous hover
                this.resetHover();
                
                // Set new hover
                this.hoveredBlob = blob;
                this.applyHover(blob);
            }
        } else {
            // No intersection - reset hover
            this.resetHover();
        }
    }
    
    applyHover(blob) {
        if (!blob) return;
        
        // Expand blob smoothly (slight enlargement)
        blob.userData.targetScale = 1.12;
        
        // Brighten and enhance label
        const label = blob.userData.labelElement;
        if (label) {
            label.style.opacity = '0.9';
            label.style.fontSize = '0.75rem';
            label.style.fontWeight = '400';
            label.style.filter = 'none';
            label.style.textShadow = 'none';
        }
        
        // Shift highlight reflections
        blob.material.emissiveIntensity = 0.25;
    }
    
    resetHover() {
        if (this.hoveredBlob) {
            // Reset blob scale smoothly
            this.hoveredBlob.userData.targetScale = 1;
            
            // Reset label to default state
            const label = this.hoveredBlob.userData.labelElement;
            if (label && this.tappedBlob !== this.hoveredBlob) {
                label.style.opacity = '0.5';
                label.style.fontSize = '0.6rem';
                label.style.fontWeight = '300';
                label.style.filter = 'none';
                label.style.textShadow = 'none';
            }
            
            // Reset emissive
            this.hoveredBlob.material.emissiveIntensity = 0.1;
            
            this.hoveredBlob = null;
        }
    }
    
    handleClick(e) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.blobs);
        
        if (intersects.length > 0) {
            const blob = intersects[0].object;
            
            if (this.isMobile) {
                // Mobile: tap once to highlight, tap again to open
                if (this.tappedBlob === blob) {
                    this.openModal(blob.userData.project);
                    this.tappedBlob = null;
                    // Reset label
                    if (blob.userData.labelElement) {
                        blob.userData.labelElement.style.opacity = '0.6';
                        blob.userData.labelElement.style.fontSize = '0.65rem';
                        blob.userData.labelElement.style.fontWeight = '300';
                    }
                } else {
                    // Clear previous tapped blob
                    if (this.tappedBlob) {
                        this.tappedBlob.userData.targetScale = 1;
                        if (this.tappedBlob.userData.labelElement) {
                            this.tappedBlob.userData.labelElement.style.opacity = '0.5';
                            this.tappedBlob.userData.labelElement.style.fontSize = '0.6rem';
                            this.tappedBlob.userData.labelElement.style.fontWeight = '300';
                            this.tappedBlob.userData.labelElement.style.filter = 'none';
                            this.tappedBlob.userData.labelElement.style.textShadow = 'none';
                        }
                        
                        // Force cursor z-index when closing modal
                        const customCursor = document.querySelector('.custom-cursor');
                        if (customCursor) {
                            customCursor.style.setProperty('z-index', '999999', 'important');
                        }
                    }
                    this.tappedBlob = blob;
                    // Expand and highlight smoothly
                    blob.userData.targetScale = 1.12;
                    if (blob.userData.labelElement) {
                        blob.userData.labelElement.style.opacity = '0.9';
                        blob.userData.labelElement.style.fontSize = '0.75rem';
                        blob.userData.labelElement.style.fontWeight = '400';
                        blob.userData.labelElement.style.filter = 'none';
                        blob.userData.labelElement.style.textShadow = 'none';
                    }
                    setTimeout(() => {
                        if (this.tappedBlob === blob) {
                            this.tappedBlob = null;
                            blob.userData.targetScale = 1;
                            if (blob.userData.labelElement) {
                                blob.userData.labelElement.style.opacity = '0.5';
                                blob.userData.labelElement.style.fontSize = '0.6rem';
                                blob.userData.labelElement.style.fontWeight = '300';
                                blob.userData.labelElement.style.filter = 'none';
                                blob.userData.labelElement.style.textShadow = 'none';
                            }
                        }
                    }, 3000);
                }
            } else {
                // Desktop: click to open modal
                this.openModal(blob.userData.project);
            }
        }
    }
    
    openModal(project) {
        this.modalBody.innerHTML = `
            <h2>${project.title}</h2>
            <p>${project.description}</p>
        `;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        const customCursor = document.querySelector('.custom-cursor');
        if (customCursor) {
            customCursor.style.setProperty('z-index', '10001', 'important');
            if (customCursor.parentElement !== document.body) {
                document.body.appendChild(customCursor);
            }
        }
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.tappedBlob = null;

        const customCursor = document.querySelector('.custom-cursor');
        if (customCursor) {
            customCursor.style.setProperty('z-index', '999999', 'important');
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update small bubbles opacity and color (matching project blob style)
        const time = Date.now() * 0.0002;
        const hue = 0.75 + Math.sin(time) * 0.05; // Same unified shift as project blobs
        const saturation = 0.8;
        const lightness = 0.35;
        
        this.smallBubbles.forEach((bubble) => {
            const targetOpacity = bubble.userData.targetOpacity || 0;
            const currentOpacity = bubble.material.opacity;
            if (Math.abs(targetOpacity - currentOpacity) > 0.01) {
                const newOpacity = currentOpacity + (targetOpacity - currentOpacity) * 0.1;
                bubble.material.opacity = Math.max(0, Math.min(1, newOpacity));
            }
            
            // Apply same iridescent color shift as project blobs
            if (bubble.material.opacity > 0.01) {
                bubble.material.color.setHSL(hue, saturation, lightness);
                bubble.material.emissive.setHSL(0.75, 0.6, 0.1);
                bubble.material.emissiveIntensity = 0.1;
            }
        });
        
        // Update blobs (static - no movement)
        this.blobs.forEach((blob) => {
            // Smooth opacity interpolation for fade-in
            const targetOpacity = blob.userData.targetOpacity !== undefined ? blob.userData.targetOpacity : 0;
            const currentOpacity = blob.material.opacity;
            if (Math.abs(targetOpacity - currentOpacity) > 0.01) {
                const newOpacity = currentOpacity + (targetOpacity - currentOpacity) * 0.1;
                blob.material.opacity = Math.max(0, Math.min(1, newOpacity));
            }
            
            // Smooth scale interpolation for hover effect
            const targetScale = blob.userData.targetScale || 1;
            const currentScale = blob.scale.x;
            const newScale = currentScale + (targetScale - currentScale) * 0.1;
            blob.scale.set(newScale, newScale, newScale);
            
            // Unified iridescent color shift - all blobs share same palette
            const time = Date.now() * 0.0002;
            // All blobs shift together in purple/blue range (0.7-0.8 hue)
            const hue = 0.75 + Math.sin(time) * 0.05; // Unified shift
            const saturation = 0.8;
            const lightness = 0.35;
            blob.material.color.setHSL(hue, saturation, lightness);
            
            // Shift highlight reflections on hover
            if (this.hoveredBlob === blob) {
                const highlightHue = hue + 0.05;
                blob.material.emissive.setHSL(highlightHue, 0.6, 0.15);
                blob.material.emissiveIntensity = 0.2;
            } else {
                blob.material.emissive.setHSL(0.75, 0.6, 0.1);
                blob.material.emissiveIntensity = 0.1;
            }
            
            // Update label position (only if blob is in front and visible)
            if (blob.position.z > -400 && blob.material.opacity > 0.1) {
                const vector = new THREE.Vector3();
                blob.getWorldPosition(vector);
                vector.project(this.camera);
                
                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
                
                const label = blob.userData.labelElement;
                if (label) {
                    label.style.left = `${x + 30}px`;
                    label.style.top = `${y - 30}px`;
                    label.style.display = 'block';
                    const isActive = this.hoveredBlob === blob || this.tappedBlob === blob;
                    label.style.opacity = blob.material.opacity * (isActive ? 0.9 : 0.5);
                }
            } else {
                // Hide label if blob is behind camera or invisible
                if (blob.userData.labelElement) {
                    blob.userData.labelElement.style.display = 'none';
                }
            }
        });
        
        // Camera stays static - no movement
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Three.js to be available
    if (typeof THREE !== 'undefined') {
        // Small delay to ensure DOM is fully ready
        setTimeout(() => {
            new ThreeBubbleSystem();
        }, 100);
    } else {
        console.error('Three.js not loaded');
    }
});

