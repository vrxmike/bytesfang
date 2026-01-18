'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface LightsProps {
    activeSection: string;
}

export default function Lights({ activeSection }: LightsProps) {
    const spotRef = useRef<THREE.SpotLight>(null);
    const pointRef = useRef<THREE.PointLight>(null);

    // Dynamic color based on section
    const targetColor = useRef(new THREE.Color('#3b82f6'));

    useFrame((state, delta) => {
        let colorHex = '#3b82f6';
        if (activeSection === 'projects') colorHex = '#8b5cf6';
        if (activeSection === 'about') colorHex = '#10b981';
        if (activeSection === 'contact') colorHex = '#f59e0b';

        targetColor.current.set(colorHex);

        if (spotRef.current) {
            spotRef.current.color.lerp(targetColor.current, delta * 2);
        }
        if (pointRef.current) {
            pointRef.current.color.lerp(targetColor.current, delta * 2);
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <spotLight
                ref={spotRef}
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={1}
                castShadow
            />
            <pointLight
                ref={pointRef}
                position={[-10, -10, -10]}
                intensity={1}
            />
            {/* Rim Light for the Glass effect */}
            <pointLight position={[0, 5, -5]} intensity={2} color="#ffffff" />
        </>
    );
}
