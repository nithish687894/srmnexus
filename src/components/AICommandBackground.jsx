import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import CyberGridFloor from './CyberGridFloor';
import DataStreams from './DataStreams';
import NeuralNetwork from './NeuralNetwork';

const AICommandBackground = () => {
  const scroll = useScroll();
  
  const ringsGroupRef = useRef();
  const glowCyanRef = useRef();
  const glowVioletRef = useRef();

  // Orbits references
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const ring4Ref = useRef();

  useFrame((state, delta) => {
    const r = scroll.offset;
    const time = state.clock.elapsedTime;

    // 1. Rotate holographic orbit rings slowly on skewed axes
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = time * 0.18;
      ring1Ref.current.rotation.x = Math.sin(time * 0.1) * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -time * 0.12;
      ring2Ref.current.rotation.z = Math.cos(time * 0.1) * 0.2;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time * 0.15;
      ring3Ref.current.rotation.y = Math.sin(time * 0.15) * 0.1;
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.y = -time * 0.08;
      ring4Ref.current.rotation.x = Math.PI / 4;
    }

    // 2. Animate entire background rings group (Scene 5 AI Zoom Focus)
    if (ringsGroupRef.current) {
      let targetZ = -2.0;
      let targetScale = 1.0;

      if (r >= 0.66 && r < 0.83) {
        // Scene 5 (AI Zoom): Rings converge and focus around AI Core [-1.8, 0.2, 0.8]
        const t = (r - 0.66) / 0.17;
        const easeT = t * t * (3 - 2 * t);
        
        ringsGroupRef.current.position.x = THREE.MathUtils.lerp(0, -1.8, easeT);
        ringsGroupRef.current.position.y = THREE.MathUtils.lerp(0, 0.2, easeT);
        targetZ = THREE.MathUtils.lerp(-2.0, 0.6, easeT);
        targetScale = 1.0 - easeT * 0.5; // shrink and focus
      } else if (r >= 0.83) {
        // Scene 6: wide pull-back command vista
        const t = (r - 0.83) / 0.17;
        const easeT = t * t * (3 - 2 * t);
        ringsGroupRef.current.position.x = THREE.MathUtils.lerp(-1.8, 0, easeT);
        ringsGroupRef.current.position.y = THREE.MathUtils.lerp(0.2, 0, easeT);
        targetZ = THREE.MathUtils.lerp(0.6, -2.5, easeT); 
        targetScale = 0.5 + easeT * 0.6;
      } else {
        // Default scroll parallax
        ringsGroupRef.current.position.x = 0;
        ringsGroupRef.current.position.y = 0;
        targetZ = -2.0 - r * 2.5; 
        targetScale = 1.0;
      }

      ringsGroupRef.current.position.z = THREE.MathUtils.lerp(ringsGroupRef.current.position.z, targetZ, delta * 6);
      ringsGroupRef.current.scale.set(targetScale, targetScale, targetScale);
    }

    // 3. Volumetric Glow Blobs Opacities (Moody Scroll Updates)
    if (glowCyanRef.current && glowVioletRef.current) {
      let cyanOp = 0.05;
      let violetOp = 0.05;

      if (r >= 0.50 && r < 0.66) {
        cyanOp = 0.12; // Cyan boost in Feature Orbit
      } else if (r >= 0.66 && r < 0.83) {
        violetOp = 0.15; // Violet peak in AI Zoom
      }

      glowCyanRef.current.material.opacity = THREE.MathUtils.lerp(glowCyanRef.current.material.opacity, cyanOp, delta * 6);
      glowVioletRef.current.material.opacity = THREE.MathUtils.lerp(glowVioletRef.current.material.opacity, violetOp, delta * 6);
    }
  });

  return (
    <group>
      {/* 1. Cyber Grid Floor */}
      <CyberGridFloor />

      {/* 2. Vertically flowing data stream columns */}
      <DataStreams />

      {/* 3. AI Neural nodes, links, and floating background widgets */}
      <NeuralNetwork />

      {/* 4. Volumetric Glow depth blobs */}
      <mesh ref={glowCyanRef} position={[-5, 2, -6]}>
        <sphereGeometry args={[4.5, 32, 16]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.05} depthWrite={false} />
      </mesh>
      
      <mesh ref={glowVioletRef} position={[5, -2, -6]}>
        <sphereGeometry args={[5.0, 32, 16]} />
        <meshBasicMaterial color="#bd00ff" transparent opacity={0.05} depthWrite={false} />
      </mesh>
      
      <mesh position={[0, 4, -8]}>
        <sphereGeometry args={[6.0, 32, 16]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.03} depthWrite={false} />
      </mesh>

      {/* 5. Concentric Glowing Orbits */}
      <group ref={ringsGroupRef} position={[0, 0, -2.0]}>
        <mesh ref={ring1Ref}>
          <torusGeometry args={[4.5, 0.015, 8, 80]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.16} />
        </mesh>
        
        <mesh ref={ring2Ref} rotation={[0.4, 0.2, 0.5]}>
          <torusGeometry args={[5.2, 0.012, 8, 80]} />
          <meshBasicMaterial color="#bd00ff" transparent opacity={0.12} />
        </mesh>

        <mesh ref={ring3Ref} rotation={[Math.PI / 2, 0.1, 0.2]}>
          <torusGeometry args={[3.8, 0.018, 8, 80]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.18} />
        </mesh>

        <mesh ref={ring4Ref}>
          <torusGeometry args={[7.2, 0.02, 6, 60]} />
          <meshBasicMaterial color="#bd00ff" transparent opacity={0.06} />
        </mesh>
      </group>
    </group>
  );
};

export default AICommandBackground;
