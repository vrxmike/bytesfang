'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface CoreObjectProps {
  activeSection: string;
}

export default function CoreObject({ activeSection }: CoreObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);

  // Configuration based on active section
  const config = useMemo(() => {
    switch (activeSection) {
      case 'projects':
        return { color: '#8b5cf6', scale: 0.9, speed: 2 }; // Purple
      case 'about':
        return { color: '#10b981', scale: 1.2, speed: 0.5 }; // Emerald
      case 'contact':
        return { color: '#f59e0b', scale: 0.8, speed: 3 }; // Amber
      case 'hero':
      default:
        return { color: '#3b82f6', scale: 1, speed: 1 }; // Blue
    }
  }, [activeSection]);

  // Orbiters Data
  const orbiters = useMemo(() => {
    // Seeded-like random for consistency or just static random initialized once
    const items = [];
    for (let i = 0; i < 5; i++) {
        items.push({
            radius: 2.5 + (i * 0.3), // Deterministic spread
            speed: 0.01 + (i * 0.005),
            phase: (i / 5) * Math.PI * 2,
            yOffset: Math.sin(i) * 1
        });
    }
    return items;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2 * config.speed;
      meshRef.current.rotation.y += delta * 0.3 * config.speed;

      // Lerp scale
      meshRef.current.scale.lerp(new THREE.Vector3(config.scale, config.scale, config.scale), delta * 2);
    }

    if (orbitRef.current) {
        orbitRef.current.rotation.z += delta * 0.05;
        // Update individual orbiters
        orbitRef.current.children.forEach((child, i) => {
            const data = orbiters[i];
            const time = state.clock.getElapsedTime();
            const angle = time * data.speed * (i % 2 === 0 ? 1 : -1) + data.phase;

            child.position.x = Math.cos(angle) * data.radius;
            child.position.z = Math.sin(angle) * data.radius;
            child.position.y = Math.sin(time * 0.5 + data.phase) + data.yOffset;
        });
    }
  });

  return (
    <group ref={groupRef}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            {/* Main Crystal Core */}
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1.5, 0]} />
                {/* Glassmorphism Material */}
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={0.5}
                    roughness={0}
                    chromaticAberration={0.05}
                    anisotropy={0.1}
                    distortion={0.1}
                    distortionScale={0.3}
                    temporalDistortion={0.5}
                    clearcoat={1}
                    attenuationDistance={0.5}
                    attenuationColor="#ffffff"
                    color={config.color}
                    resolution={1024}
                />
            </mesh>

            {/* Inner Wireframe for Tech Feel */}
            <mesh scale={[1.01, 1.01, 1.01]}>
                <icosahedronGeometry args={[1.5, 1]} />
                <meshBasicMaterial wireframe color="white" transparent opacity={0.05} />
            </mesh>
        </Float>

        {/* Orbiters */}
        <group ref={orbitRef}>
            {orbiters.map((_, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial
                        color={config.color}
                        emissive={config.color}
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </group>

        {/* Background Stars/Particles */}
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}
