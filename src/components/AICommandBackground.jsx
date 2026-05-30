import React, { useRef, useMemo } from 'react';
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
  const glassWallRef = useRef();

  // Orbits references
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  // Glass Wall Panel Configurations (Semi-circular curve in 3D space)
  const glassPanels = useMemo(() => [
    { id: 'left2', pos: [-4.6, 0.8, -2.4], rot: [0, Math.PI / 6, 0], size: [2.0, 5.0, 0.06] },
    { id: 'left1', pos: [-2.4, 0.8, -2.9], rot: [0, Math.PI / 12, 0], size: [2.0, 5.0, 0.06] },
    { id: 'center', pos: [0.0, 0.8, -3.1], rot: [0, 0, 0], size: [2.2, 5.0, 0.06] },
    { id: 'right1', pos: [2.4, 0.8, -2.9], rot: [0, -Math.PI / 12, 0], size: [2.0, 5.0, 0.06] },
    { id: 'right2', pos: [4.6, 0.8, -2.4], rot: [0, -Math.PI / 6, 0], size: [2.0, 5.0, 0.06] }
  ], []);

  useFrame((state, delta) => {
    const r = scroll.offset;
    const time = state.clock.elapsedTime;

    // 1. Rotate holographic orbit rings slowly
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = time * 0.12;
      ring1Ref.current.rotation.x = Math.sin(time * 0.08) * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -time * 0.08;
      ring2Ref.current.rotation.z = Math.cos(time * 0.08) * 0.15;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time * 0.1;
      ring3Ref.current.rotation.y = Math.sin(time * 0.1) * 0.08;
    }

    // 2. Animate entire background rings and glass wall group (Parallax Scroll)
    if (ringsGroupRef.current) {
      let targetZ = -2.5;
      let targetScale = 1.0;

      if (r >= 0.66 && r < 0.83) {
        // Scene 5 (AI Zoom): Rings converge around AI Core [-1.8, 0.2, 0.8]
        const t = (r - 0.66) / 0.17;
        const easeT = t * t * (3 - 2 * t);
        
        ringsGroupRef.current.position.x = THREE.MathUtils.lerp(0, -1.8, easeT);
        ringsGroupRef.current.position.y = THREE.MathUtils.lerp(0, 0.2, easeT);
        targetZ = THREE.MathUtils.lerp(-2.5, 0.4, easeT);
        targetScale = 1.0 - easeT * 0.55; 
      } else if (r >= 0.83) {
        // Scene 6: wide pull-back command vista
        const t = (r - 0.83) / 0.17;
        const easeT = t * t * (3 - 2 * t);
        ringsGroupRef.current.position.x = THREE.MathUtils.lerp(-1.8, 0, easeT);
        ringsGroupRef.current.position.y = THREE.MathUtils.lerp(0.2, 0, easeT);
        targetZ = THREE.MathUtils.lerp(0.4, -3.0, easeT); 
        targetScale = 0.45 + easeT * 0.55;
      } else {
        // Default scroll parallax
        ringsGroupRef.current.position.x = 0;
        ringsGroupRef.current.position.y = 0;
        targetZ = -2.5 - r * 2.0; 
        targetScale = 1.0;
      }

      ringsGroupRef.current.position.z = THREE.MathUtils.lerp(ringsGroupRef.current.position.z, targetZ, delta * 5);
      ringsGroupRef.current.scale.set(targetScale, targetScale, targetScale);
    }

    // Animate glass wall parallax slightly slower than rings for layered depth
    if (glassWallRef.current) {
      const targetZ = -2.8 - r * 1.5;
      glassWallRef.current.position.z = THREE.MathUtils.lerp(glassWallRef.current.position.z, targetZ, delta * 4);
    }

    // 3. Volumetric Glow Blobs Opacities (Moody Scroll Updates)
    if (glowCyanRef.current && glowVioletRef.current) {
      let cyanOp = 0.04;
      let violetOp = 0.04;

      if (r >= 0.50 && r < 0.66) {
        cyanOp = 0.1;
      } else if (r >= 0.66 && r < 0.83) {
        violetOp = 0.12;
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

      {/* 4. PREMIUM CURVED GLASS COMMAND CHAMBER WALL ENCLOSURE */}
      <group ref={glassWallRef} position={[0, -0.4, 0]}>
        {glassPanels.map((panel) => (
          <group key={panel.id} position={panel.pos} rotation={panel.rot}>
            {/* Glossy Translucent Glass Panel */}
            <mesh>
              <boxGeometry args={panel.size} />
              <meshPhysicalMaterial
                color="#0f172a"
                emissive="#00f3ff"
                emissiveIntensity={0.01}
                roughness={0.08}
                metalness={0.1}
                transmission={0.92} // frosted physical glass
                thickness={0.5}
                clearcoat={1.0} // reflective gloss
                clearcoatRoughness={0.05}
                transparent
                opacity={0.3}
              />
            </mesh>
            
            {/* Fine Glowing Cyber Outline Border */}
            <mesh>
              <boxGeometry args={[panel.size[0] + 0.02, panel.size[1] + 0.02, panel.size[2] + 0.01]} />
              <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.12} />
            </mesh>

            {/* Neural Circuit Lines (Procedural line markers on glass seams) */}
            <mesh position={[panel.size[0] * 0.48, 0, panel.size[2] * 0.52]}>
              <planeGeometry args={[0.012, panel.size[1]]} />
              <meshBasicMaterial color="#bd00ff" transparent opacity={0.25} />
            </mesh>
            <mesh position={[-panel.size[0] * 0.48, 0, panel.size[2] * 0.52]}>
              <planeGeometry args={[0.012, panel.size[1]]} />
              <meshBasicMaterial color="#00f3ff" transparent opacity={0.25} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. Volumetric Glow depth blobs */}
      <mesh ref={glowCyanRef} position={[-5, 2, -6]}>
        <sphereGeometry args={[4.5, 32, 16]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.04} depthWrite={false} />
      </mesh>
      
      <mesh ref={glowVioletRef} position={[5, -2, -6]}>
        <sphereGeometry args={[5.0, 32, 16]} />
        <meshBasicMaterial color="#bd00ff" transparent opacity={0.04} depthWrite={false} />
      </mesh>
      
      <mesh position={[0, 4, -8]}>
        <sphereGeometry args={[6.0, 32, 16]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.02} depthWrite={false} />
      </mesh>

      {/* 6. High-End holographic rings inside the chamber */}
      <group ref={ringsGroupRef} position={[0, 0, -2.5]}>
        <mesh ref={ring1Ref}>
          <torusGeometry args={[4.4, 0.012, 8, 80]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.14} />
        </mesh>
        
        <mesh ref={ring2Ref} rotation={[0.4, 0.2, 0.5]}>
          <torusGeometry args={[5.0, 0.01, 8, 80]} />
          <meshBasicMaterial color="#bd00ff" transparent opacity={0.1} />
        </mesh>

        <mesh ref={ring3Ref} rotation={[Math.PI / 2, 0.1, 0.2]}>
          <torusGeometry args={[3.6, 0.015, 8, 80]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
        </mesh>
      </group>
    </group>
  );
};

export default AICommandBackground;
