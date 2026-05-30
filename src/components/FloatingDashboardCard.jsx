import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Text } from '@react-three/drei';
import * as THREE from 'three';

const FloatingDashboardCard = ({ id, title, subtitle, color, gridPos, scatterPos, children, index }) => {
  const scroll = useScroll();
  const cardRef = useRef();

  useFrame((state, delta) => {
    if (!cardRef.current) return;

    const r = scroll.offset; // 0.0 to 1.0
    const time = state.clock.elapsedTime;

    // Define targets
    let targetPos = new THREE.Vector3(...gridPos);
    let targetRot = new THREE.Vector3(0, 0, 0);
    let targetScale = new THREE.Vector3(1, 1, 1);
    let targetOpacity = 1.0;
    let emissiveIntensity = 0.15;

    // Phase 1: Intro (0 to 0.16)
    if (r < 0.16) {
      targetPos.set(...gridPos);
      targetScale.set(1, 1, 1);
      targetOpacity = 0.95;
    }
    // Phase 2: Student Chaos (0.16 to 0.33)
    // Clean cards scatter away, scale down, and dim out, while chaos items take over
    else if (r >= 0.16 && r < 0.33) {
      const t = (r - 0.16) / 0.17; // 0 to 1
      const easeT = t * t * (3 - 2 * t);
      
      targetPos.lerpVectors(
        new THREE.Vector3(...gridPos),
        new THREE.Vector3(...scatterPos),
        easeT
      );
      
      targetRot.set(
        Math.sin(time * 0.5 + index) * 0.1,
        Math.cos(time * 0.5 + index) * 0.1,
        Math.sin(time * 0.3 + index) * 0.05
      );
      
      const sVal = 1 - t * 0.4; // shrink to 60% size
      targetScale.set(sVal, sVal, sVal);
      targetOpacity = 0.95 - t * 0.6; // dim to 35% opacity
      emissiveIntensity = 0.05;
    }
    // Phase 3: SRM Nexus Solution (0.33 to 0.50)
    // Clean cards smoothly fly back and snap to their grid positions, glowing brightly
    else if (r >= 0.33 && r < 0.50) {
      const t = (r - 0.33) / 0.17;
      const easeT = t * t * (3 - 2 * t);

      targetPos.lerpVectors(
        new THREE.Vector3(...scatterPos),
        new THREE.Vector3(...gridPos),
        easeT
      );

      const sVal = 0.6 + easeT * 0.4;
      targetScale.set(sVal, sVal, sVal);
      targetOpacity = 0.35 + easeT * 0.65;
      emissiveIntensity = 0.05 + easeT * 0.2;
    }
    // Phase 4: Feature Orbit (0.50 to 0.66)
    // In this scene, camera orbits, and each card is highlighted one by one in sequence
    else if (r >= 0.50 && r < 0.66) {
      const activeIdx = Math.floor((r - 0.50) / (0.16 / 6)); // which of the 6 cards is currently active
      const isCardActive = activeIdx === index;

      targetPos.set(...gridPos);

      if (isCardActive) {
        // Bring card closer to camera, scale it up, and make it glow!
        targetPos.z += 0.8;
        targetScale.set(1.15, 1.15, 1.15);
        targetOpacity = 1.0;
        emissiveIntensity = 0.6;
      } else {
        // Dim and recede other cards
        targetScale.set(0.9, 0.9, 0.9);
        targetOpacity = 0.45;
        emissiveIntensity = 0.05;
      }
    }
    // Phase 5: AI Zoom (0.66 to 0.83)
    // Zooming deep on AI Card. If index is AI card (index === 5), bring it forward.
    else if (r >= 0.66 && r < 0.83) {
      targetPos.set(...gridPos);
      if (id === 'ai') {
        // Bring AI card to the foreground, scale it, make it extra bright
        targetPos.set(-1.8, 0.2, 0.8);
        targetRot.set(0, 0.4, 0); // rotate slightly towards camera
        targetScale.set(1.2, 1.2, 1.2);
        targetOpacity = 1.0;
        emissiveIntensity = 0.7;
      } else {
        // Move other cards away or dim them out completely
        targetPos.z -= 1.5;
        targetScale.set(0.7, 0.7, 0.7);
        targetOpacity = 0.2;
        emissiveIntensity = 0.02;
      }
    }
    // Phase 6: Final OS (0.83 to 1.0)
    // Pull back camera, all cards lock into place beautifully.
    else if (r >= 0.83) {
      const t = (r - 0.83) / 0.17;
      const easeT = t * t * (3 - 2 * t);

      if (id === 'ai') {
        // Animate from AI-Zoom position back to its gridPos
        targetPos.lerpVectors(
          new THREE.Vector3(-1.8, 0.2, 0.8),
          new THREE.Vector3(...gridPos),
          easeT
        );
        targetRot.lerpVectors(
          new THREE.Vector3(0, 0.4, 0),
          new THREE.Vector3(0, 0, 0),
          easeT
        );
      } else {
        // Restore other cards
        targetPos.lerpVectors(
          new THREE.Vector3(gridPos[0], gridPos[1], gridPos[2] - 1.5),
          new THREE.Vector3(...gridPos),
          easeT
        );
      }

      const sVal = id === 'ai' ? (1.2 - easeT * 0.2) : (0.7 + easeT * 0.3);
      targetScale.set(sVal, sVal, sVal);
      
      const opacityVal = id === 'ai' ? 1.0 : (0.2 + easeT * 0.8);
      targetOpacity = opacityVal;
      emissiveIntensity = 0.2;
    }

    // Add idle float animation (only when not in zoom / transition and scroll is not too fast)
    // Gently add a sine offset to the Y coordinate
    if (r < 0.66 || r > 0.83) {
      const floatOffset = Math.sin(time * 1.2 + index * 4) * 0.08;
      targetPos.y += floatOffset;
    }

    // Smoothly apply lerps
    cardRef.current.position.lerp(targetPos, delta * 6);
    
    // Smooth Euler Rotation
    const currentRot = new THREE.Euler().setFromQuaternion(cardRef.current.quaternion);
    const lerpedRotX = THREE.MathUtils.lerp(currentRot.x, targetRot.x, delta * 6);
    const lerpedRotY = THREE.MathUtils.lerp(currentRot.y, targetRot.y, delta * 6);
    const lerpedRotZ = THREE.MathUtils.lerp(currentRot.z, targetRot.z, delta * 6);
    cardRef.current.rotation.set(lerpedRotX, lerpedRotY, lerpedRotZ);

    cardRef.current.scale.lerp(targetScale, delta * 6);

    // Update material properties recursively and safely (handling multi-materials)
    cardRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          if (!mat) return;
          mat.transparent = true;
          
          // Compute target opacity for this specific mesh
          const targetOp = child.name === 'chassis' ? targetOpacity * 0.7 : targetOpacity;
          mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOp, delta * 6);
          
          if (mat.emissive) {
            const intensityMult = child.name === 'outline' ? 1.5 : 1.0;
            mat.emissiveIntensity = THREE.MathUtils.lerp(
              mat.emissiveIntensity, 
              emissiveIntensity * intensityMult, 
              delta * 6
            );
          }
        });
      }
    });
  });

  return (
    <group ref={cardRef}>
      {/* 1. Main Frosted Glass Chassis */}
      <mesh name="chassis">
        <boxGeometry args={[1.8, 1.3, 0.08]} />
        <meshPhysicalMaterial
          color="#0f172a"
          emissive={color}
          emissiveIntensity={0.01} // minimal cyber emission
          roughness={0.08}
          metalness={0.08}
          transmission={0.9} // high frosted physical glass
          thickness={0.6}
          clearcoat={1.0} // glossy surface
          clearcoatRoughness={0.04}
          transparent
        />
      </mesh>

      {/* 2. Cyber Neon Border Outline */}
      <mesh name="outline">
        <boxGeometry args={[1.82, 1.32, 0.09]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.12} // subtle glow line
        />
      </mesh>

      {/* 3. Small futuristic corner brackets */}
      <group>
        {/* Top-Left */}
        <mesh position={[-0.9, 0.65, 0.05]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshBasicMaterial color={color} transparent />
        </mesh>
        <mesh position={[-0.95, 0.6, 0.05]}>
          <boxGeometry args={[0.02, 0.1, 0.02]} />
          <meshBasicMaterial color={color} transparent />
        </mesh>
        {/* Bottom-Right */}
        <mesh position={[0.9, -0.65, 0.05]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshBasicMaterial color={color} transparent />
        </mesh>
        <mesh position={[0.95, -0.6, 0.05]}>
          <boxGeometry args={[0.02, 0.1, 0.02]} />
          <meshBasicMaterial color={color} transparent />
        </mesh>
      </group>

      {/* 4. Glass Label Headers */}
      <Text
        position={[-0.8, 0.48, 0.06]}
        fontSize={0.075}
        color="#FFFFFF"
        anchorX="left"
        anchorY="top"
        fontWeight="bold"
      >
        {title}
      </Text>
      
      <Text
        position={[-0.8, 0.38, 0.06]}
        fontSize={0.045}
        color="#94A3B8"
        anchorX="left"
        anchorY="top"
      >
        {subtitle}
      </Text>

      {/* Divider Line */}
      <mesh position={[0, 0.32, 0.05]}>
        <planeGeometry args={[1.6, 0.008]} />
        <meshBasicMaterial color="#334155" transparent />
      </mesh>

      {/* 5. Custom Procedural Inner Child Mesh Content */}
      <group position={[0, -0.15, 0.05]}>
        {children}
      </group>
    </group>
  );
};

export default FloatingDashboardCard;
