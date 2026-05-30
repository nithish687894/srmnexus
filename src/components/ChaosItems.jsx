import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Text } from '@react-three/drei';
import * as THREE from 'three';

const ChaosItems = () => {
  const scroll = useScroll();
  const groupRef = useRef();

  // Create details for 6 unique chaotic items
  const items = useMemo(() => [
    {
      id: 'whatsapp',
      title: 'TIMETABLE (WhatsApp)',
      color: '#25D366',
      initialPos: [3, 2, -6],
      chaosPos: [1.8, 1.2, 1.5],
      exitPos: [5, 4, -10],
      rotSpeed: [0.3, 0.5, 0.2],
      size: [1.6, 1.0, 0.05],
      type: 'chat',
    },
    {
      id: 'attendance_sc',
      title: 'ATTENDANCE FAILING',
      color: '#EF4444',
      initialPos: [-3, -2, -6],
      chaosPos: [-1.9, -1.0, 1.2],
      exitPos: [-6, -4, -8],
      rotSpeed: [-0.4, 0.2, -0.3],
      size: [1.4, 1.2, 0.05],
      type: 'alert',
    },
    {
      id: 'pdf_marks',
      title: 'RESULTS_V1.pdf',
      color: '#F59E0B',
      initialPos: [3, -2, -6],
      chaosPos: [1.5, -1.5, 1.0],
      exitPos: [6, -5, -8],
      rotSpeed: [0.2, -0.3, 0.4],
      size: [1.2, 1.5, 0.05],
      type: 'sheet',
    },
    {
      id: 'exam_warning',
      title: 'EXAM WARNING!',
      color: '#DC2626',
      initialPos: [-4, 2, -6],
      chaosPos: [-1.6, 1.5, 0.8],
      exitPos: [-5, 5, -8],
      rotSpeed: [-0.2, -0.4, 0.3],
      size: [1.5, 0.9, 0.05],
      type: 'urgent',
    },
    {
      id: 'sticky_note1',
      title: 'Submit Assignment ASAP',
      color: '#EC4899',
      initialPos: [0, 3, -8],
      chaosPos: [-0.2, 2.0, 0.5],
      exitPos: [0, 6, -10],
      rotSpeed: [0.5, 0.1, -0.5],
      size: [0.8, 0.8, 0.03],
      type: 'sticky',
    },
    {
      id: 'sticky_note2',
      title: 'Pay Portal Fees Today!',
      color: '#EAB308',
      initialPos: [1, -3, -8],
      chaosPos: [0.3, -2.2, 0.4],
      exitPos: [1, -6, -10],
      rotSpeed: [-0.3, 0.5, 0.1],
      size: [0.7, 0.7, 0.03],
      type: 'sticky',
    }
  ], []);

  // Store individual mesh refs
  const meshRefs = useRef([]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const r = scroll.offset; // global scroll offset: 0 to 1
    const time = state.clock.elapsedTime;

    // SCENE 2 transition range: r from 0.16 to 0.33
    // SCENE 3 transition range: r from 0.33 to 0.50
    items.forEach((item, index) => {
      const mesh = meshRefs.current[index];
      if (!mesh) return;

      let targetPos = new THREE.Vector3(...item.initialPos);
      let targetRot = new THREE.Vector3(0, 0, 0);
      let targetScale = new THREE.Vector3(0, 0, 0);
      let targetOpacity = 0;

      if (r < 0.16) {
        // Completely hidden before Scene 2
        targetPos.set(...item.initialPos);
        targetScale.set(0, 0, 0);
        targetOpacity = 0;
      } else if (r >= 0.16 && r < 0.33) {
        // Scene 2: Scatter and Zoom In
        const t = (r - 0.16) / 0.17; // 0 to 1
        const easeT = t * t * (3 - 2 * t); // smoothstep

        // Interpolate between initialPos and chaosPos
        targetPos.lerpVectors(
          new THREE.Vector3(...item.initialPos),
          new THREE.Vector3(...item.chaosPos),
          easeT
        );

        // Add floating idle animation
        const floatOffset = Math.sin(time * 1.5 + index * 10) * 0.15;
        targetPos.y += floatOffset;
        targetPos.x += Math.cos(time * 0.8 + index * 10) * 0.1;

        // Apply tumbling rotation
        targetRot.set(
          item.rotSpeed[0] * time * 0.5,
          item.rotSpeed[1] * time * 0.5,
          item.rotSpeed[2] * time * 0.3 + (index * 0.2)
        );

        targetScale.set(1, 1, 1);
        targetOpacity = 0.85;
      } else if (r >= 0.33 && r < 0.50) {
        // Scene 3: Nexus Solution - Dissolve & Fly away to exitPos
        const t = (r - 0.33) / 0.17; // 0 to 1
        const easeT = t * t * (3 - 2 * t);

        targetPos.lerpVectors(
          new THREE.Vector3(item.chaosPos[0], item.chaosPos[1] + Math.sin(time * 1.5 + index * 10) * 0.15, item.chaosPos[2]),
          new THREE.Vector3(...item.exitPos),
          easeT
        );

        targetRot.set(
          item.rotSpeed[0] * time * 0.5 + t * 4,
          item.rotSpeed[1] * time * 0.5 + t * 4,
          item.rotSpeed[2] * time * 0.3
        );

        // Scale down to zero as it flies away
        const scaleVal = 1 - easeT;
        targetScale.set(scaleVal, scaleVal, scaleVal);
        targetOpacity = 0.85 * (1 - easeT);
      } else {
        // Completely gone after Scene 3
        targetScale.set(0, 0, 0);
        targetOpacity = 0;
      }

      // Smoothly lerp towards our computed targets
      mesh.position.lerp(targetPos, delta * 8);
      
      // Rotations
      const currentRot = new THREE.Euler().setFromQuaternion(mesh.quaternion);
      const lerpedRotX = THREE.MathUtils.lerp(currentRot.x, targetRot.x, delta * 8);
      const lerpedRotY = THREE.MathUtils.lerp(currentRot.y, targetRot.y, delta * 8);
      const lerpedRotZ = THREE.MathUtils.lerp(currentRot.z, targetRot.z, delta * 8);
      mesh.rotation.set(lerpedRotX, lerpedRotY, lerpedRotZ);

      mesh.scale.lerp(targetScale, delta * 8);

      mesh.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => {
            if (mat) {
              mat.transparent = true;
              mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 8);
            }
          });
        }
      });
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, idx) => (
        <group key={item.id} ref={(el) => (meshRefs.current[idx] = el)}>
          {/* Card Body */}
          <mesh>
            <boxGeometry args={item.size} />
            <meshPhysicalMaterial
              color={item.color}
              emissive={item.color}
              emissiveIntensity={0.15}
              roughness={0.15}
              metalness={0.1}
              transparent
              opacity={0}
              transmission={0.4}
              thickness={0.5}
            />
          </mesh>

          {/* Glowing Outline */}
          <mesh>
            <boxGeometry args={[item.size[0] + 0.04, item.size[1] + 0.04, item.size[2] + 0.01]} />
            <meshBasicMaterial
              color={item.color}
              wireframe
              transparent
              opacity={0}
            />
          </mesh>

          {/* Title Text */}
          <Text
            position={[0, item.size[1] * 0.35, item.size[2] * 0.52]}
            fontSize={0.08}
            font="https://fonts.gstatic.com/s/outfit/v11/q5uUd1ypQ7YQDhk2WD.woff2"
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {item.title}
          </Text>

          {/* Subtext based on type */}
          {item.type === 'chat' && (
            <>
              <Text
                position={[-0.5, 0, item.size[2] * 0.52]}
                fontSize={0.055}
                color="#A1A1AA"
                maxWidth={item.size[0] * 0.8}
                anchorX="left"
              >
                Rahul: Send photo of time table today classes change??
              </Text>
              <Text
                position={[-0.5, -0.22, item.size[2] * 0.52]}
                fontSize={0.045}
                color="#EF4444"
                anchorX="left"
              >
                11:42 AM • WhatsApp
              </Text>
            </>
          )}

          {item.type === 'alert' && (
            <>
              <Text
                position={[-0.5, 0, item.size[2] * 0.52]}
                fontSize={0.06}
                color="#FFFFFF"
                maxWidth={item.size[0] * 0.85}
                anchorX="left"
              >
                Attendance: 68.4%
              </Text>
              <Text
                position={[-0.5, -0.2, item.size[2] * 0.52]}
                fontSize={0.05}
                color="#FDA4AF"
                maxWidth={item.size[0] * 0.85}
                anchorX="left"
              >
                DEBARRED WARNING: Must stay above 75%
              </Text>
            </>
          )}

          {item.type === 'sheet' && (
            <>
              <Text
                position={[-0.45, 0.1, item.size[2] * 0.52]}
                fontSize={0.055}
                color="#F3F4F6"
                anchorX="left"
              >
                SGPA: 5.8 (Target: 8.5)
              </Text>
              {/* Fake grid lines */}
              <mesh position={[0, -0.15, item.size[2] * 0.51]}>
                <planeGeometry args={[item.size[0] * 0.8, 0.3]} />
                <meshBasicMaterial color="#3F3F46" transparent opacity={0.3} />
              </mesh>
              <Text
                position={[-0.45, -0.15, item.size[2] * 0.52]}
                fontSize={0.045}
                color="#FBBF24"
                anchorX="left"
              >
                Sub 1: D | Sub 2: C | Sub 3: F
              </Text>
            </>
          )}

          {item.type === 'urgent' && (
            <>
              <Text
                position={[0, 0, item.size[2] * 0.52]}
                fontSize={0.065}
                color="#FECACA"
                maxWidth={item.size[0] * 0.85}
                anchorX="center"
              >
                EXAMS IN 3 DAYS!
              </Text>
              <Text
                position={[0, -0.2, item.size[2] * 0.52]}
                fontSize={0.05}
                color="#EF4444"
                anchorX="center"
              >
                Portals closed for registration
              </Text>
            </>
          )}

          {item.type === 'sticky' && (
            <Text
              position={[0, -0.05, item.size[2] * 0.52]}
              fontSize={0.06}
              color="#111827"
              maxWidth={item.size[0] * 0.8}
              anchorX="center"
              fontWeight="bold"
            >
              {item.id === 'sticky_note1' ? 'DO CS ASSIGNMENT!' : 'PAY FEES PORTAL'}
            </Text>
          )}
        </group>
      ))}
    </group>
  );
};

export default ChaosItems;
