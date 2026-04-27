import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function DeveloperCore({ scrollRef }) {
  const pointsRef = useRef(null);
  const cursorRef = useRef(null);
  const { mouse, camera } = useThree();

  const count = 3500;
  
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    
    // Golden ratio spiral for even spherical distribution
    const phi = Math.PI * (3 - Math.sqrt(5));
    
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const r = 2.4;
      const randomOffset = (Math.random() - 0.5) * 0.12;
      const finalR = r + randomOffset;

      pos[i * 3] = finalR * Math.cos(theta) * radiusAtY;
      pos[i * 3 + 1] = finalR * y;
      pos[i * 3 + 2] = finalR * Math.sin(theta) * radiusAtY;
      
      sz[i] = Math.random() * 1.5 + 0.5;
    }
    return [pos, sz];
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const progress = scrollRef?.current || 0;
    
    // Smooth globe rotation and parallax
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.12;
      pointsRef.current.rotation.x = Math.sin(t * 0.25) * 0.08;
      pointsRef.current.rotation.z = Math.cos(t * 0.15) * 0.06;
      
      pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, mouse.x * 0.4, 0.05);
      pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, mouse.y * 0.4 + progress * 0.5, 0.05);
    }
    
    // Dynamic circular cursor element moving and reacting to mouse
    if (cursorRef.current) {
      const targetX = mouse.x * 2.5;
      const targetY = mouse.y * 2.5 + progress * 0.5;
      
      cursorRef.current.position.x = THREE.MathUtils.lerp(cursorRef.current.position.x, targetX, 0.08);
      cursorRef.current.position.y = THREE.MathUtils.lerp(cursorRef.current.position.y, targetY, 0.08);
      
      cursorRef.current.lookAt(camera.position);
    }
    
    // Camera parallax
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7.2 - progress * 2.5, 0.035);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.9, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.5 + progress * 0.6, 0.035);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.03} 
          color="#e0ff00"
          transparent 
          opacity={0.7} 
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>

      <group ref={cursorRef} position={[0, 0, 2.8]}>
        <mesh>
          <ringGeometry args={[0.22, 0.25, 32]} />
          <meshBasicMaterial color="#e0ff00" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      </group>
    </group>
  );
}
