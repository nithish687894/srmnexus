import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import StudentCommandCenter from './StudentCommandCenter';
import ChaosItems from './ChaosItems';

const Scene = () => {
  const scroll = useScroll();
  
  // Custom look-at target reference to interpolate lookAt smoothly
  const lookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  
  // Define our 6-scene camera keyframes:
  // pos: [x, y, z] camera coordinate
  // target: [x, y, z] camera focus look-at coordinate
  const keyframes = useMemo(() => [
    { r: 0.00, pos: [0.0, 0.0, 7.5], target: [0.0, 0.0, 0.0] },  // Scene 1: Hero
    { r: 0.25, pos: [0.0, 0.0, 4.8], target: [0.0, 0.0, -1.2] }, // Scene 2: Student Chaos (Zoom in closer, scatter items)
    { r: 0.42, pos: [0.6, 0.5, 7.2], target: [0.0, 0.0, 0.0] },  // Scene 3: Solution Re-aligns
    { r: 0.58, pos: [3.8, 1.2, 4.6], target: [0.0, 0.0, 0.0] },  // Scene 4: Features Orbit sweep
    { r: 0.75, pos: [-1.2, 0.25, 2.5], target: [-1.8, 0.2, 0.8] }, // Scene 5: Deep zoom on AI Core
    { r: 1.00, pos: [0.0, 1.3, 8.4], target: [0.0, 0.0, 0.0] }   // Scene 6: Full Wide Cinematic Command Center
  ], []);

  // Procedural neon orbit rings references
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame((state, delta) => {
    const r = scroll.offset; // Unified scroll progress from 0.0 to 1.0
    const time = state.clock.elapsedTime;
    
    // 1. Calculate camera spline targets by locating active interval
    let activeKeyframe = keyframes[0];
    let nextKeyframe = keyframes[1];
    
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (r >= keyframes[i].r && r <= keyframes[i + 1].r) {
        activeKeyframe = keyframes[i];
        nextKeyframe = keyframes[i + 1];
        break;
      }
    }
    
    // Interval delta local progress t from 0 to 1
    const tRange = nextKeyframe.r - activeKeyframe.r;
    const t = tRange > 0 ? (r - activeKeyframe.r) / tRange : 0;
    
    // Apply elegant smoothstep ease for keyframe translation
    const easeT = t * t * (3 - 2 * t);
    
    // Interpolated values
    const targetCameraPos = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...activeKeyframe.pos),
      new THREE.Vector3(...nextKeyframe.pos),
      easeT
    );
    
    const targetLookAt = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...activeKeyframe.target),
      new THREE.Vector3(...nextKeyframe.target),
      easeT
    );

    // 2. Add high-end mouse parallax shift to position
    const parallaxX = state.mouse.x * 0.45;
    const parallaxY = state.mouse.y * 0.35;
    
    targetCameraPos.x += parallaxX;
    targetCameraPos.y += parallaxY;
    
    // 3. Smoothly lerp active camera vector and target
    state.camera.position.lerp(targetCameraPos, delta * 5);
    lookAtRef.current.lerp(targetLookAt, delta * 5);
    
    // Face the target
    state.camera.lookAt(lookAtRef.current);

    // 4. Animate the procedural glowing orbits
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = time * 0.2;
      ring1Ref.current.rotation.x = Math.PI / 3;
      
      // Scale down or fade ring based on scroll (in Scene 5 AI Zoom we fade orbits)
      const scale = r >= 0.66 && r < 0.83 ? (1 - (r - 0.66)/0.17 * 0.7) : 1;
      ring1Ref.current.scale.set(scale, scale, scale);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.15;
      ring2Ref.current.rotation.z = Math.PI / 4;
      
      const scale = r >= 0.66 && r < 0.83 ? (1 - (r - 0.66)/0.17 * 0.7) : 1;
      ring2Ref.current.scale.set(scale * 1.3, scale * 1.3, scale * 1.3);
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = time * 0.25;
      ring3Ref.current.rotation.y = -Math.PI / 6;
      
      const scale = r >= 0.66 && r < 0.83 ? (1 - (r - 0.66)/0.17 * 0.7) : 1;
      ring3Ref.current.scale.set(scale * 1.6, scale * 1.6, scale * 1.6);
    }
  });

  return (
    <group>
      {/* 3D Directional Lighting and Shadows */}
      <ambientLight intensity={0.4} />
      
      <pointLight 
        position={[8, 5, 5]} 
        intensity={2.0} 
        color="#00f3ff" 
        distance={25}
      />
      <pointLight 
        position={[-8, -5, 5]} 
        intensity={1.5} 
        color="#bd00ff" 
        distance={25}
      />
      <pointLight 
        position={[0, 0, 8]} 
        intensity={0.8} 
        color="#ffffff" 
        distance={15}
      />

      {/* Neon Hologram Orbit Rings encircling the main dashboard */}
      <group position={[0, 0, -0.2]}>
        <mesh ref={ring1Ref}>
          <torusGeometry args={[3.8, 0.02, 8, 80]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.25} />
        </mesh>
        <mesh ref={ring2Ref}>
          <torusGeometry args={[3.8, 0.015, 8, 80]} />
          <meshBasicMaterial color="#bd00ff" transparent opacity={0.2} />
        </mesh>
        <mesh ref={ring3Ref}>
          <torusGeometry args={[3.8, 0.01, 8, 80]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
        </mesh>
      </group>

      {/* 1. Renders clean dashboard structure (Scene 1, 3, 4, 5, 6) */}
      <StudentCommandCenter />

      {/* 2. Renders scattered chaotic elements (Scene 2, 3) */}
      <ChaosItems />
    </group>
  );
};

export default Scene;
