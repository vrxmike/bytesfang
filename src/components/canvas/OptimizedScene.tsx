'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface OptimizedSceneProps {
  activeSection: string;
}

export default function OptimizedScene({ activeSection }: OptimizedSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(activeSection);
  const mousePos = useRef({ x: 0, y: 0 });

  // Update ref when prop changes so the animation loop can access the latest value
  useEffect(() => {
    sectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    // Mouse interaction handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };

    // Touch interaction handler
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

    // --- SETUP ---
    const scene = new THREE.Scene();
    // Slight fog for depth
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- OBJECTS ---

    // 1. Crystal Core
    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.2, // Low transmission is cheap
      thickness: 1,
      clearcoat: 1,
    });
    const core = new THREE.Mesh(geometry, material);
    scene.add(core);

    // Wireframe overlay for "Tech" feel
    const wireGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.05
    });
    const wireframe = new THREE.Mesh(wireGeo, wireMat);
    wireframe.scale.set(1.02, 1.02, 1.02);
    scene.add(wireframe);

    // 2. Orbiters
    const orbitersGroup = new THREE.Group();
    scene.add(orbitersGroup);

    const orbiterGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const orbiterMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });

    const orbitersData: { mesh: THREE.Mesh, radius: number, speed: number, phase: number, yOffset: number }[] = [];

    for (let i = 0; i < 5; i++) {
        const mesh = new THREE.Mesh(orbiterGeo, orbiterMat.clone()); // Clone material for individual coloring
        orbitersGroup.add(mesh);
        orbitersData.push({
            mesh,
            radius: 2.5 + (i * 0.3),
            speed: 0.5 + (i * 0.1),
            phase: (i / 5) * Math.PI * 2,
            yOffset: Math.sin(i) * 1
        });
    }

    // 3. Stars / Particles
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1500;
    const posArray = new Float32Array(starCount * 3);
    for(let i = 0; i < starCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 40;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMat = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 2, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const rimLight = new THREE.PointLight(0xffffff, 2, 10);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
      const currentSection = sectionRef.current;

      // Determine Target Color & Config based on Section
      let targetHex = 0x3b82f6; // Hero: Blue
      let targetScale = 1;
      let rotSpeed = 0.5;

      if (currentSection === 'projects') {
        targetHex = 0x8b5cf6; // Purple
        targetScale = 0.9;
        rotSpeed = 1.0;
      } else if (currentSection === 'about') {
        targetHex = 0x10b981; // Emerald
        targetScale = 1.2;
        rotSpeed = 0.2;
      } else if (currentSection === 'contact') {
        targetHex = 0xf59e0b; // Amber
        targetScale = 0.8;
        rotSpeed = 1.5;
      }

      const targetColor = new THREE.Color(targetHex);

      // Lerp Core Color
      material.color.lerp(targetColor, 0.05);
      pointLight.color.lerp(targetColor, 0.05);

      // Lerp Core Scale
      const pulse = 1 + Math.sin(time * 2) * 0.02;
      const finalScale = targetScale * pulse;
      core.scale.lerp(new THREE.Vector3(finalScale, finalScale, finalScale), 0.05);
      wireframe.scale.lerp(new THREE.Vector3(finalScale * 1.02, finalScale * 1.02, finalScale * 1.02), 0.05);

      // Rotation (Auto + Mouse)
      const targetRotX = mousePos.current.y * 0.5;
      const targetRotY = mousePos.current.x * 0.5;

      core.rotation.x += (targetRotX - core.rotation.x) * 0.05 + 0.002;
      core.rotation.y += (targetRotY - core.rotation.y) * 0.05 + 0.005;
      wireframe.rotation.copy(core.rotation);

      // Animate Orbiters
      orbitersGroup.rotation.z = Math.sin(time * 0.1) * 0.2;
      orbitersGroup.rotation.y += 0.001;

      orbitersData.forEach((data) => {
          const angle = time * data.speed + data.phase;
          data.mesh.position.x = Math.cos(angle) * data.radius;
          data.mesh.position.z = Math.sin(angle) * data.radius;
          data.mesh.position.y = Math.sin(time * 0.5 + data.phase) + data.yOffset;

          // Update Orbiter Color
          (data.mesh.material as THREE.MeshBasicMaterial).color.lerp(targetColor, 0.05);
      });

      // Animate Stars
      stars.rotation.y -= 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose Geometries
      geometry.dispose();
      wireGeo.dispose();
      orbiterGeo.dispose();
      starsGeo.dispose();

      // Dispose Materials
      material.dispose();
      wireMat.dispose();
      orbiterMat.dispose();
      starsMat.dispose();

      renderer.dispose();
    };

  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
