'use client';

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { Suspense } from 'react';
import CoreObject from './CoreObject';
import Lights from './Lights';

interface SceneProps {
  activeSection: string;
}

export default function Scene({ activeSection }: SceneProps) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Lights activeSection={activeSection} />
          <CoreObject activeSection={activeSection} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
