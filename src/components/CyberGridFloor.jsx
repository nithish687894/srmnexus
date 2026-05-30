import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Grid } from '@react-three/drei';
import * as THREE from 'three';

const CyberGridFloor = () => {
  const scroll = useScroll();
  const floorRef = useRef();

  useFrame((state, delta) => {
    const r = scroll.offset;
    
    // Staggered Y position coordinate: floor rises in final Scene 6
    let targetFloorY = -2.8;
    if (r >= 0.83) {
      const t = (r - 0.83) / 0.17;
      targetFloorY = -2.8 + t * 0.45;
    }
    
    if (floorRef.current) {
      floorRef.current.position.y = THREE.MathUtils.lerp(floorRef.current.position.y, targetFloorY, delta * 5);
      // Parallax sliding Z translation to simulate flying forward
      floorRef.current.position.z = THREE.MathUtils.lerp(floorRef.current.position.z, -2.0 + r * 1.8, delta * 5);
    }
  });

  return (
    <group ref={floorRef} position={[0, -2.8, -2]}>
      <Grid
        args={[30, 30]}
        cellSize={0.5}
        cellThickness={1.0}
        cellColor="#00f3ff"
        sectionSize={2.5}
        sectionThickness={1.5}
        sectionColor="#bd00ff"
        fadeDistance={18}
        fadeStrength={1}
        infiniteGrid
      />
    </group>
  );
};

export default CyberGridFloor;
