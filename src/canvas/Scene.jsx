import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DeveloperCore from './DeveloperCore';

function ScrollBridge({ scrollRef }) {
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      scrub: true,
      onUpdate: (self) => {
        scrollRef.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, [scrollRef]);

  return null;
}

export default function Scene() {
  const scrollRef = useRef(0);

  return (
    <div className="canvas-shell" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 7.2], fov: 42 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <color attach="background" args={['#05070f']} />
          <fog attach="fog" args={['#05070f', 7, 17]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 6, 5]} intensity={1.3} color="#eafcff" />
          <pointLight position={[-3, 2.2, 2]} intensity={2.7} color="#8b5cf6" />
          <pointLight position={[3, -1.2, 3]} intensity={2.2} color="#2dd4ff" />
          <DeveloperCore scrollRef={scrollRef} />
          <ScrollBridge scrollRef={scrollRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
