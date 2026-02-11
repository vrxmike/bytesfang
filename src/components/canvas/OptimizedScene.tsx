'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface OptimizedSceneProps {
  activeSection: string;
}

// --- HELPER: Sample evenly distributed points from a geometry ---
function sampleGeometryPositions(geometry: THREE.BufferGeometry, count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const posAttr = geometry.getAttribute('position');
  const totalVertices = posAttr.count;

  for (let i = 0; i < count; i++) {
    // Cycle through geometry vertices, adding slight jitter for visual variety
    const srcIndex = i % totalVertices;
    positions[i * 3] = posAttr.getX(srcIndex) + (Math.random() - 0.5) * 0.05;
    positions[i * 3 + 1] = posAttr.getY(srcIndex) + (Math.random() - 0.5) * 0.05;
    positions[i * 3 + 2] = posAttr.getZ(srcIndex) + (Math.random() - 0.5) * 0.05;
  }

  return positions;
}

// --- HELPER: Generate a flat grid of positions ---
function generateGridPositions(count: number, size: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const side = Math.ceil(Math.sqrt(count));
  const spacing = size / side;

  for (let i = 0; i < count; i++) {
    const col = i % side;
    const row = Math.floor(i / side);
    positions[i * 3] = (col - side / 2) * spacing + (Math.random() - 0.5) * 0.1;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3; // Slight Y variation
    positions[i * 3 + 2] = (row - side / 2) * spacing + (Math.random() - 0.5) * 0.1;
  }

  return positions;
}

// --- HELPER: Generate scattered "explosion" positions for transitions ---
function generateScatterPositions(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * (0.5 + Math.random() * 0.5);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

// --- Simple 3D Noise (value noise) for organic motion ---
function noise3D(x: number, y: number, z: number): number {
  const p = x * 127.1 + y * 311.7 + z * 74.7;
  return Math.sin(p) * 0.5 + 0.5;
}

export default function OptimizedScene({ activeSection }: OptimizedSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(activeSection);
  const mousePos = useRef({ x: 0, y: 0 });
  const transitionProgress = useRef(0);
  const prevSectionRef = useRef(activeSection);

  useEffect(() => {
    if (prevSectionRef.current !== activeSection) {
      transitionProgress.current = 0; // Reset transition on section change
      prevSectionRef.current = sectionRef.current;
    }
    sectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mousePos.current = {
          x: (touch.clientX / window.innerWidth) * 2 - 1,
          y: -(touch.clientY / window.innerHeight) * 2 + 1
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // =============================================
    // CONFIGURATION
    // =============================================
    const PARTICLE_COUNT = 3000;
    const MORPH_SPEED = 0.012;       // How fast particles morph between shapes
    const FLOAT_AMPLITUDE = 0.002;   // Gentle floating motion amplitude
    const MOUSE_INFLUENCE = 0.2;     // How much mouse affects particles
    const ROTATION_SPEED = 0.0008;   // Base rotation speed

    // =============================================
    // SCENE SETUP
    // =============================================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // =============================================
    // PRE-COMPUTE TARGET SHAPES
    // =============================================

    // Shape 1: Hero — Icosahedron (crystal)
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 4);
    const heroPositions = sampleGeometryPositions(icoGeo, PARTICLE_COUNT);
    icoGeo.dispose();

    // Shape 2: Projects — Torus Knot
    const torusGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32);
    const projectsPositions = sampleGeometryPositions(torusGeo, PARTICLE_COUNT);
    torusGeo.dispose();

    // Shape 3: About — Sphere
    const sphereGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const aboutPositions = sampleGeometryPositions(sphereGeo, PARTICLE_COUNT);
    sphereGeo.dispose();

    // Shape 4: Contact — Flat Grid
    const contactPositions = generateGridPositions(PARTICLE_COUNT, 4);

    // Scatter positions (used during transitions for organic mid-morph)
    const scatterPositions = generateScatterPositions(PARTICLE_COUNT, 3);

    // Shape map
    const shapeMap: Record<string, Float32Array> = {
      hero: heroPositions,
      projects: projectsPositions,
      about: aboutPositions,
      contact: contactPositions,
    };

    // Color map
    const colorMap: Record<string, THREE.Color> = {
      hero: new THREE.Color(0x3b82f6),     // Blue
      projects: new THREE.Color(0x8b5cf6), // Purple
      about: new THREE.Color(0x10b981),    // Emerald
      contact: new THREE.Color(0xf59e0b),  // Amber
    };

    // =============================================
    // PARTICLES
    // =============================================
    const particleGeometry = new THREE.BufferGeometry();

    // Current positions (what we render)
    const currentPositions = new Float32Array(PARTICLE_COUNT * 3);
    currentPositions.set(heroPositions); // Start at hero shape

    // Target positions (what we're morphing toward)
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    targetPositions.set(heroPositions);

    // Velocities for organic motion
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    // Per-particle random seeds (for unique floating motion)
    const seeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      seeds[i] = Math.random() * Math.PI * 2;
    }

    // Per-particle sizes
    const sizes = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      sizes[i] = 0.4 + Math.random() * 0.8;
    }

    // Per-particle colors
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const baseColor = colorMap.hero;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const brightness = 0.6 + Math.random() * 0.4;
      colors[i * 3] = baseColor.r * brightness;
      colors[i * 3 + 1] = baseColor.g * brightness;
      colors[i * 3 + 2] = baseColor.b * brightness;
    }

    // Per-particle alpha
    const alphas = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      alphas[i] = 0.15 + Math.random() * 0.45;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    particleGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

    // Custom shader material for premium particle rendering
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aAlpha;
        varying vec3 vColor;
        varying float vAlpha;

        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vColor = color;
          vAlpha = aAlpha;

          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;

          gl_Position = projectedPosition;

          // Size attenuation — particles shrink with distance
          gl_PointSize = aSize * uPixelRatio * (50.0 / -viewPosition.z);
          gl_PointSize = max(gl_PointSize, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          // Circular soft particle with glow
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);

          // Discard pixels outside circle
          if (dist > 0.5) discard;

          // Soft glow falloff
          float strength = 1.0 - (dist * 2.0);
          strength = pow(strength, 1.5);

          // Core glow
          float core = 1.0 - smoothstep(0.0, 0.15, dist);

          vec3 finalColor = vColor * strength + vColor * core * 0.5;
          float finalAlpha = vAlpha * strength;

          gl_FragColor = vec4(finalColor, finalAlpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // =============================================
    // AMBIENT STARS (background)
    // =============================================
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 50;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      size: 0.015,
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // =============================================
    // STATE
    // =============================================
    let currentSection = 'hero';
    let morphProgress = 1.0; // 1.0 = fully morphed to target
    let animationFrameId: number;
    const currentColor = new THREE.Color(0x3b82f6);
    const targetColor = new THREE.Color(0x3b82f6);

    // =============================================
    // ANIMATION LOOP
    // =============================================
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
      const section = sectionRef.current;

      // Detect section change → trigger morph
      if (section !== currentSection) {
        currentSection = section;
        morphProgress = 0;

        // Set new target positions
        const newTarget = shapeMap[section] || heroPositions;
        targetPositions.set(newTarget);

        // Set new target color
        targetColor.copy(colorMap[section] || colorMap.hero);
      }

      // Update time uniform
      particleMaterial.uniforms.uTime.value = time;

      // ---- MORPH PARTICLES ----
      if (morphProgress < 1.0) {
        morphProgress = Math.min(morphProgress + MORPH_SPEED, 1.0);
      }

      // Easing function (ease-in-out cubic)
      const t = morphProgress;
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Lerp color
      currentColor.lerp(targetColor, 0.03);

      const posAttr = particleGeometry.getAttribute('position') as THREE.BufferAttribute;
      const colAttr = particleGeometry.getAttribute('color') as THREE.BufferAttribute;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        // Target position
        const tx = targetPositions[i3];
        const ty = targetPositions[i3 + 1];
        const tz = targetPositions[i3 + 2];

        // Current rendered position
        let cx = currentPositions[i3];
        let cy = currentPositions[i3 + 1];
        let cz = currentPositions[i3 + 2];

        // During transition: add scatter/noise for organic feel
        if (morphProgress < 1.0) {
          const scatterInfluence = Math.sin(morphProgress * Math.PI); // Peaks at 0.5
          const sx = scatterPositions[i3] * scatterInfluence * 0.3;
          const sy = scatterPositions[i3 + 1] * scatterInfluence * 0.3;
          const sz = scatterPositions[i3 + 2] * scatterInfluence * 0.3;

          cx = cx + (tx + sx - cx) * eased * 0.08;
          cy = cy + (ty + sy - cy) * eased * 0.08;
          cz = cz + (tz + sz - cz) * eased * 0.08;
        } else {
          // Settled: gently converge + float
          cx = cx + (tx - cx) * 0.05;
          cy = cy + (ty - cy) * 0.05;
          cz = cz + (tz - cz) * 0.05;
        }

        // Organic floating motion
        const seed = seeds[i];
        const floatX = Math.sin(time * 0.5 + seed) * FLOAT_AMPLITUDE;
        const floatY = Math.cos(time * 0.7 + seed * 1.3) * FLOAT_AMPLITUDE;
        const floatZ = Math.sin(time * 0.3 + seed * 0.7) * FLOAT_AMPLITUDE;

        cx += floatX;
        cy += floatY;
        cz += floatZ;

        // Mouse influence — push particles gently
        const dx = cx - mousePos.current.x * 3;
        const dy = cy - mousePos.current.y * 3;
        const mouseDist = Math.sqrt(dx * dx + dy * dy);
        if (mouseDist < 2.0) {
          const force = (1.0 - mouseDist / 2.0) * MOUSE_INFLUENCE;
          cx += dx * force * 0.01;
          cy += dy * force * 0.01;
        }

        // Write back
        currentPositions[i3] = cx;
        currentPositions[i3 + 1] = cy;
        currentPositions[i3 + 2] = cz;

        // Update color (lerp per-particle toward target with brightness variation)
        const brightness = 0.6 + Math.sin(time * 0.5 + seed) * 0.2 + 0.2;
        colors[i3] += (currentColor.r * brightness - colors[i3]) * 0.03;
        colors[i3 + 1] += (currentColor.g * brightness - colors[i3 + 1]) * 0.03;
        colors[i3 + 2] += (currentColor.b * brightness - colors[i3 + 2]) * 0.03;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Slow rotation of entire particle system
      particles.rotation.y += ROTATION_SPEED;
      particles.rotation.x = mousePos.current.y * 0.15;

      // Background stars rotation
      stars.rotation.y -= 0.0003;

      renderer.render(scene, camera);
    };
    animate();

    // =============================================
    // RESIZE HANDLER
    // =============================================
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    window.addEventListener('resize', handleResize);

    // =============================================
    // CLEANUP
    // =============================================
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }

      particleGeometry.dispose();
      particleMaterial.dispose();
      starsGeo.dispose();
      starsMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none touch-action-none opacity-70 dark:opacity-100" />;
}
