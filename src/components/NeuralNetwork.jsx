import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

// Glowing Attendance Pulse Line
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

// Glowing Neural Connections
const NeuralConduit = ({ color = '#bd00ff' }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
      
      {[0, 1, 2].map((i) => {
        const angle = (i * Math.PI * 2) / 3;
        const x = Math.cos(angle) * 0.4;
        const y = Math.sin(angle) * 0.4;
        
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

const NeuralNetwork = () => {
  const scroll = useScroll();
  const symbolsGroupRef = useRef();

  // Configuration for academic chips
  const symbolConfigs = useMemo(() => [
    { id: 'cal', type: 'calendar', pos: [-4.2, 1.8, -4.5], speed: 0.4 },
    { id: 'exam', type: 'exam', pos: [4.2, 1.5, -4.0], speed: 0.5 },
    { id: 'pulse', type: 'pulse', pos: [-3.8, -1.8, -3.5], speed: 0.3 },
    { id: 'marks', type: 'marks', pos: [3.8, -1.8, -3.8], speed: 0.45 },
    { id: 'ai', type: 'nodes', pos: [0, 2.5, -5.0], speed: 0.35 }
  ], []);

  const symbolRefs = useRef([]);

  // Generate 12 procedural background nodes for the general Neural Network mesh
  const nodes = useMemo(() => {
    const list = [];
    for (let i = 0; i < 12; i++) {
      list.push({
        id: i,
        pos: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 8,
          -4 - Math.random() * 4
        ],
        size: 0.05 + Math.random() * 0.06,
        color: Math.random() > 0.5 ? '#00f3ff' : '#bd00ff'
      });
    }
    return list;
  }, []);

  const nodeRefs = useRef([]);

  useFrame((state, delta) => {
    const r = scroll.offset;
    const time = state.clock.elapsedTime;

    // 1. ANIMATE GENERAL BACKGROUND NEURAL NODES
    nodes.forEach((node, idx) => {
      const mesh = nodeRefs.current[idx];
      if (!mesh) return;

      // Pulsing scale
      const pulse = 1.0 + Math.sin(time * 2 + idx) * 0.15;
      mesh.scale.set(pulse, pulse, pulse);
      
      let targetZ = node.pos[2];
      let opacity = 0.25;

      if (r >= 0.66 && r < 0.83) {
        // Scene 5 (AI Zoom): Neural nodes float closer to the AI Core [-1.8, 0.2, 0.8]
        const t = (r - 0.66) / 0.17;
        const easeT = t * t * (3 - 2 * t);
        
        // Staggered node pulls
        targetZ = THREE.MathUtils.lerp(node.pos[2], 0.2, easeT);
        opacity = 0.25 + easeT * 0.35;
      }

      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetZ, delta * 5);

      if (mesh.material) {
        mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, opacity, delta * 5);
        mesh.material.transparent = true;
      }
    });

    // 2. ANIMATE FAINT FLOATING KNOWLEDGE CHIPS / WIDGETS
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

      // Scroll reactive moods
      if (r < 0.16) {
        opacity = 0.15;
      } 
      else if (r >= 0.16 && r < 0.33) {
        // Scene 2 (Chaos): Widgets scatter outwards and rotate chaotically
        const t = (r - 0.16) / 0.17;
        targetRot.set(time * config.speed * 2, time * 0.3, time * 0.4);
        targetPos.x += (config.pos[0] > 0 ? 1.5 : -1.5) * t; 
        opacity = 0.06;
      } 
      else if (r >= 0.33 && r < 0.50) {
        // Scene 3 (Organize): Widgets align and connect closer
        const t = (r - 0.33) / 0.17;
        targetPos.x += (config.pos[0] > 0 ? 1.5 : -1.5) * (1 - t);
        opacity = 0.06 + t * 0.14;
      } 
      else if (r >= 0.50 && r < 0.66) {
        opacity = 0.22;
        targetScale.set(1.1, 1.1, 1.1);
      } 
      else if (r >= 0.66 && r < 0.83) {
        // Scene 5 (AI Zoom)
        if (config.id === 'ai') {
          // AI Nodes widget rises brightly directly above the AI Card
          targetPos.set(-1.8, 1.3, 0.4);
          opacity = 0.5;
          targetScale.set(1.4, 1.4, 1.4);
        } else {
          opacity = 0.03;
          targetScale.set(0.7, 0.7, 0.7);
        }
      } 
      else if (r >= 0.83) {
        opacity = 0.25;
      }

      // Apply lerps
      sym.position.lerp(targetPos, delta * 6);
      sym.scale.lerp(targetScale, delta * 6);

      const curRot = new THREE.Euler().setFromQuaternion(sym.quaternion);
      const lerpRotX = THREE.MathUtils.lerp(curRot.x, targetRot.x, delta * 6);
      const lerpRotY = THREE.MathUtils.lerp(curRot.y, targetRot.y, delta * 6);
      const lerpRotZ = THREE.MathUtils.lerp(curRot.z, targetRot.z, delta * 6);
      sym.rotation.set(lerpRotX, lerpRotY, lerpRotZ);

      // Safe traversal opacities updater
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
      {/* 1. Procedural Background Neural Network nodes */}
      <group>
        {nodes.map((node, idx) => (
          <mesh 
            key={node.id} 
            position={node.pos} 
            ref={(el) => (nodeRefs.current[idx] = el)}
          >
            <sphereGeometry args={[node.size, 12, 12]} />
            <meshBasicMaterial color={node.color} transparent opacity={0.25} />
          </mesh>
        ))}
      </group>

      {/* 2. Floating Knowledge Widgets */}
      <group ref={symbolsGroupRef}>
        {symbolConfigs.map((config, idx) => (
          <group 
            key={config.id} 
            position={config.pos}
            ref={(el) => (symbolRefs.current[idx] = el)}
          >
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

            {config.type === 'exam' && (
              <group scale={[0.8, 0.8, 0.8]}>
                <mesh rotation={[0, 0, Math.PI]}>
                  <coneGeometry args={[0.3, 0.5, 3]} />
                  <meshBasicMaterial color="#ef4444" transparent opacity={0.15} />
                </mesh>
              </group>
            )}

            {config.type === 'pulse' && (
              <group scale={[0.9, 0.9, 0.9]}>
                <PulseLine color="#00f3ff" />
              </group>
            )}

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

            {config.type === 'nodes' && (
              <group scale={[0.8, 0.8, 0.8]}>
                <NeuralConduit color="#bd00ff" />
              </group>
            )}
          </group>
        ))}
      </group>
    </group>
  );
};

export default NeuralNetwork;
