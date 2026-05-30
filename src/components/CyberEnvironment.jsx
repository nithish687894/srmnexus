import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Grid } from '@react-three/drei';
import * as THREE from 'three';

// 1. Glowing Attendance Pulse Line
const PulseLine = ({ color = '#00f3ff' }) => {
  const lineRef = useRef();
  
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.5, 0, 0),
      new THREE.Vector3(-0.25, 0.25, 0),
      new THREE.Vector3(0, -0.25, 0),
      new THREE.Vector3(0.25, 0.35, 0),
      new THREE.Vector3(0.5, 0, 0)
    ]);
  }, []);

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={lineRef}>
      <mesh>
        <tubeGeometry args={[curve, 20, 0.02, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

// 2. Glowing AI Neural Nodes
const NeuralNodes = ({ color = '#bd00ff' }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Node */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
      
      {/* Outer Nodes & Connectors */}
      {[0, 1, 2].map((i) => {
        const angle = (i * Math.PI * 2) / 3;
        const x = Math.cos(angle) * 0.4;
        const y = Math.sin(angle) * 0.4;
        
        // Connector Tube
        const path = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(x, y, 0)
        ]);
        
        return (
          <group key={i}>
            <mesh position={[x, y, 0]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshBasicMaterial color="#00f3ff" transparent opacity={0.2} />
            </mesh>
            <mesh>
              <tubeGeometry args={[path, 4, 0.012, 6, false]} />
              <meshBasicMaterial color={color} transparent opacity={0.12} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const CyberEnvironment = () => {
  const scroll = useScroll();
  
  // Refs for scene components to animate parallax and transformations
  const dataStreamsRef = useRef();
  const ringsGroupRef = useRef();
  const symbolsGroupRef = useRef();
  const floorRef = useRef();

  const glowCyanRef = useRef();
  const glowVioletRef = useRef();
  
  // Holographic Rings Configuration
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const ring4Ref = useRef();

  // Structured data stream particles variables
  const count = 400;
  const [positions, speeds, streams] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    const str = [];
    
    // Create 12 structured vertical columns (data streams)
    for (let s = 0; s < 12; s++) {
      str.push({
        x: (Math.random() - 0.5) * 14,
        z: -3.5 - Math.random() * 4.5
      });
    }

    for (let i = 0; i < count; i++) {
      const streamIdx = i % 12;
      pos[i * 3] = str[streamIdx].x + (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12; // spread along Y
      pos[i * 3 + 2] = str[streamIdx].z + (Math.random() - 0.5) * 0.3;
      sp[i] = 0.6 + Math.random() * 1.4; // random vertical speed
    }
    return [pos, sp, str];
  }, []);

  // Symbol coordinates
  const symbolConfigs = useMemo(() => [
    { id: 'cal', type: 'calendar', pos: [-4.2, 1.8, -4.5], speed: 0.4 },
    { id: 'exam', type: 'exam', pos: [4.2, 1.5, -4.0], speed: 0.5 },
    { id: 'pulse', type: 'pulse', pos: [-3.8, -1.8, -3.5], speed: 0.3 },
    { id: 'marks', type: 'marks', pos: [3.8, -1.8, -3.8], speed: 0.45 },
    { id: 'ai', type: 'nodes', pos: [0, 2.5, -5.0], speed: 0.35 }
  ], []);

  const symbolRefs = useRef([]);

  useFrame((state, delta) => {
    const r = scroll.offset;
    const time = state.clock.elapsedTime;

    // ==========================================
    // 1. ROTATE BACKGROUND RINGS ON Skewed Axes
    // ==========================================
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

    // ==========================================
    // 2. COMPUTE STRUCTURED DATA packet STREAMS
    // ==========================================
    if (dataStreamsRef.current) {
      const posAttr = dataStreamsRef.current.geometry.attributes.position;
      
      for (let i = 0; i < count; i++) {
        let y = posAttr.array[i * 3 + 1];
        let speedMult = 1.0;
        let jitter = 0.0;
        
        // Scene 2 (Chaos): speeds up and jitters the background data flow
        if (r >= 0.16 && r < 0.33) {
          const t = (r - 0.16) / 0.17;
          speedMult = 1.0 + t * 2.0; // speed up data streams
          jitter = t * 0.03;         // add static noise jitter
        }
        // Scene 3 (Solution): stream starts aligning cleanly again
        else if (r >= 0.33 && r < 0.50) {
          const t = (r - 0.33) / 0.17;
          speedMult = 3.0 - t * 2.0;
        }

        y += delta * speeds[i] * 0.9 * speedMult;
        
        // Reset when passing ceiling
        if (y > 6) {
          y = -6;
          // Return to column alignment
          const streamIdx = i % 12;
          posAttr.array[i * 3] = streams[streamIdx].x + (Math.random() - 0.5) * 0.3;
        }
        
        // Apply Y and minor noise
        posAttr.array[i * 3 + 1] = y;
        if (jitter > 0) {
          posAttr.array[i * 3] += (Math.random() - 0.5) * jitter;
        }
      }
      posAttr.needsUpdate = true;
    }

    // ==========================================
    // 3. CINEMATIC DIGITAL TUNNEL PARALLAX SCROLL
    // ==========================================
    // Near items scale/translate faster, far items sways slowly
    
    // Animate rings group
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
        const t = (r - 0.83) / 0.17;
        const easeT = t * t * (3 - 2 * t);
        ringsGroupRef.current.position.x = THREE.MathUtils.lerp(-1.8, 0, easeT);
        ringsGroupRef.current.position.y = THREE.MathUtils.lerp(0.2, 0, easeT);
        targetZ = THREE.MathUtils.lerp(0.6, -2.5, easeT); // pull back wide
        targetScale = 0.5 + easeT * 0.6;
      } else {
        // Default scroll parallax
        ringsGroupRef.current.position.x = 0;
        ringsGroupRef.current.position.y = 0;
        targetZ = -2.0 - r * 2.5; // slowly recedes
        targetScale = 1.0;
      }

      ringsGroupRef.current.position.z = THREE.MathUtils.lerp(ringsGroupRef.current.position.z, targetZ, delta * 6);
      ringsGroupRef.current.scale.set(targetScale, targetScale, targetScale);
    }

    // Animate perspective grid floor
    if (floorRef.current) {
      // Pull floor upward slightly on final scene (Scene 6) to create command center platform
      let targetFloorY = -2.8;
      if (r >= 0.83) {
        const t = (r - 0.83) / 0.17;
        targetFloorY = -2.8 + t * 0.4; // rise slightly
      }
      floorRef.current.position.y = THREE.MathUtils.lerp(floorRef.current.position.y, targetFloorY, delta * 5);
    }

    // Animate volumetric glow blobs opacities
    if (glowCyanRef.current && glowVioletRef.current) {
      let cyanOp = 0.05;
      let violetOp = 0.05;

      if (r >= 0.50 && r < 0.66) {
        // Scene 4 (Features Orbit): make background lights brighter cyan
        cyanOp = 0.12;
      } else if (r >= 0.66 && r < 0.83) {
        // Scene 5 (AI Zoom): bright neon violet glow
        violetOp = 0.15;
      }

      glowCyanRef.current.material.opacity = THREE.MathUtils.lerp(glowCyanRef.current.material.opacity, cyanOp, delta * 6);
      glowVioletRef.current.material.opacity = THREE.MathUtils.lerp(glowVioletRef.current.material.opacity, violetOp, delta * 6);
    }

    // ==========================================
    // 4. ANIMATE FLOATING ACADEMIC SYMBOLS
    // ==========================================
    symbolConfigs.forEach((config, idx) => {
      const sym = symbolRefs.current[idx];
      if (!sym) return;

      let targetPos = new THREE.Vector3(...config.pos);
      let targetRot = new THREE.Vector3(0, 0, 0);
      let targetScale = new THREE.Vector3(1, 1, 1);
      let opacity = 0.15;

      // Gentle floating sine motion
      targetPos.y += Math.sin(time * 0.8 + idx * 4) * 0.15;
      targetPos.x += Math.cos(time * 0.5 + idx * 4) * 0.1;

      // Scroll logic for symbols
      if (r < 0.16) {
        // Scene 1: calm
        opacity = 0.15;
      } 
      else if (r >= 0.16 && r < 0.33) {
        // Scene 2: Chaos - symbols rotate quickly and fly outwards
        const t = (r - 0.16) / 0.17;
        targetRot.set(time * config.speed * 2, time * 0.3, time * 0.4);
        targetPos.x += (config.pos[0] > 0 ? 1.5 : -1.5) * t; // push wider
        opacity = 0.08;
      } 
      else if (r >= 0.33 && r < 0.50) {
        // Scene 3: Solution - symbols re-align and draw closer to center
        const t = (r - 0.33) / 0.17;
        targetPos.x += (config.pos[0] > 0 ? 1.5 : -1.5) * (1 - t);
        opacity = 0.08 + t * 0.12;
      } 
      else if (r >= 0.50 && r < 0.66) {
        // Scene 4: feature highlights
        opacity = 0.2;
        targetScale.set(1.1, 1.1, 1.1);
      } 
      else if (r >= 0.66 && r < 0.83) {
        // Scene 5: AI Zoom
        if (config.id === 'ai') {
          // Focus the AI circuit nodes! Make it highly visible
          targetPos.set(-1.8, 1.3, 0.4); // float above AI Card
          opacity = 0.45;
          targetScale.set(1.4, 1.4, 1.4);
        } else {
          // dim others
          opacity = 0.04;
          targetScale.set(0.7, 0.7, 0.7);
        }
      } 
      else if (r >= 0.83) {
        // Scene 6: locked OS
        opacity = 0.25;
      }

      // Apply smooth lerps
      sym.position.lerp(targetPos, delta * 6);
      sym.scale.lerp(targetScale, delta * 6);

      // Smooth Euler rotations
      const curRot = new THREE.Euler().setFromQuaternion(sym.quaternion);
      const lerpRotX = THREE.MathUtils.lerp(curRot.x, targetRot.x, delta * 6);
      const lerpRotY = THREE.MathUtils.lerp(curRot.y, targetRot.y, delta * 6);
      const lerpRotZ = THREE.MathUtils.lerp(curRot.z, targetRot.z, delta * 6);
      sym.rotation.set(lerpRotX, lerpRotY, lerpRotZ);

      // Safe child materials fade
      sym.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach(mat => {
            if (mat) {
              mat.transparent = true;
              mat.opacity = THREE.MathUtils.lerp(mat.opacity, opacity, delta * 6);
            }
          });
        }
      });
    });
  });

  return (
    <group>
      {/* ==========================================
          1. VOLUMETRIC GLOW DEPTH LAYERS
          ========================================== */}
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

      {/* ==========================================
          2. DEEP PERSPECTIVE CYBER GRID FLOOR (Drei Grid)
          ========================================== */}
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

      {/* ==========================================
          3. LAYERED HOLOGRAPHIC SPINNING NEON RINGS
          ========================================== */}
      <group ref={ringsGroupRef} position={[0, 0, -2.0]}>
        {/* Large Subtle Cyan Orbit */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[4.5, 0.015, 8, 80]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.16} />
        </mesh>
        
        {/* Large Skewed Violet Orbit */}
        <mesh ref={ring2Ref} rotation={[0.4, 0.2, 0.5]}>
          <torusGeometry args={[5.2, 0.012, 8, 80]} />
          <meshBasicMaterial color="#bd00ff" transparent opacity={0.12} />
        </mesh>

        {/* Medium Blue Active Ring */}
        <mesh ref={ring3Ref} rotation={[Math.PI / 2, 0.1, 0.2]}>
          <torusGeometry args={[3.8, 0.018, 8, 80]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.18} />
        </mesh>

        {/* Outer Deep Border Ring */}
        <mesh ref={ring4Ref}>
          <torusGeometry args={[7.2, 0.02, 6, 60]} />
          <meshBasicMaterial color="#bd00ff" transparent opacity={0.06} />
        </mesh>
      </group>

      {/* ==========================================
          4. METRICS / DATA STREAM VERTICAL PACKETS
          ========================================== */}
      <points ref={dataStreamsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          color="#00f3ff"
          transparent
          opacity={0.6}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>

      {/* ==========================================
          5. FAINT ACADEMIC SYMBOLS FLOATING IN THE BACK
          ========================================== */}
      <group ref={symbolsGroupRef}>
        {symbolConfigs.map((config, idx) => (
          <group 
            key={config.id} 
            position={config.pos}
            ref={(el) => (symbolRefs.current[idx] = el)}
          >
            {/* Widget Calendar Shape */}
            {config.type === 'calendar' && (
              <group scale={[0.8, 0.8, 0.8]}>
                <mesh>
                  <boxGeometry args={[0.5, 0.5, 0.05]} />
                  <meshBasicMaterial color="#3f3f46" transparent opacity={0.15} />
                </mesh>
                <mesh position={[0, 0.22, 0.01]}>
                  <boxGeometry args={[0.5, 0.08, 0.06]} />
                  <meshBasicMaterial color="#00f3ff" transparent opacity={0.2} />
                </mesh>
              </group>
            )}

            {/* Widget Exam Alert Exclamation Notice shape */}
            {config.type === 'exam' && (
              <group scale={[0.8, 0.8, 0.8]}>
                {/* Warning Triangle */}
                <mesh rotation={[0, 0, Math.PI]}>
                  <coneGeometry args={[0.3, 0.5, 3]} />
                  <meshBasicMaterial color="#ef4444" transparent opacity={0.15} />
                </mesh>
              </group>
            )}

            {/* Widget Attendance Pulse zig-zag tube */}
            {config.type === 'pulse' && (
              <group scale={[0.9, 0.9, 0.9]}>
                <PulseLine color="#00f3ff" />
              </group>
            )}

            {/* Widget Marks Stacked Columns */}
            {config.type === 'marks' && (
              <group scale={[0.8, 0.8, 0.8]}>
                <mesh position={[-0.15, -0.1, 0]}>
                  <boxGeometry args={[0.08, 0.2, 0.04]} />
                  <meshBasicMaterial color="#00f3ff" transparent opacity={0.2} />
                </mesh>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.08, 0.35, 0.04]} />
                  <meshBasicMaterial color="#bd00ff" transparent opacity={0.2} />
                </mesh>
                <mesh position={[0.15, -0.05, 0]}>
                  <boxGeometry args={[0.08, 0.28, 0.04]} />
                  <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
                </mesh>
              </group>
            )}

            {/* Widget Neural Core connections */}
            {config.type === 'nodes' && (
              <group scale={[0.8, 0.8, 0.8]}>
                <NeuralNodes color="#bd00ff" />
              </group>
            )}
          </group>
        ))}
      </group>
    </group>
  );
};

export default CyberEnvironment;
