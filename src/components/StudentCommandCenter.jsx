import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import FloatingDashboardCard from './FloatingDashboardCard';
import AIAssistantPanel from './AIAssistantPanel';
import { Text } from '@react-three/drei';

const StudentCommandCenter = () => {
  const scroll = useScroll();
  const chassisRef = useRef();

  useFrame((state, delta) => {
    if (!chassisRef.current) return;
    const r = scroll.offset;
    
    let targetOpacity = 0.15;
    let targetScale = new THREE.Vector3(1, 1, 1);
    
    // Animate chassis background based on scroll state
    if (r < 0.16) {
      targetOpacity = 0.15;
      targetScale.set(1, 1, 1);
    } else if (r >= 0.16 && r < 0.33) {
      // Scatter state: dim the dashboard chassis
      const t = (r - 0.16) / 0.17;
      targetOpacity = 0.15 * (1 - t);
      targetScale.set(1 - t * 0.2, 1 - t * 0.2, 1 - t * 0.2);
    } else if (r >= 0.33 && r < 0.50) {
      // Snapping back state: light up bright cyan
      const t = (r - 0.33) / 0.17;
      targetOpacity = 0.15 + t * 0.25;
      targetScale.set(0.8 + t * 0.2, 0.8 + t * 0.2, 0.8 + t * 0.2);
    } else if (r >= 0.50 && r < 0.83) {
      // Orbit / AI Zoom: make it very subtle
      targetOpacity = 0.1;
    } else if (r >= 0.83) {
      // Final OS: bright and complete
      const t = (r - 0.83) / 0.17;
      targetOpacity = 0.1 + t * 0.3;
    }

    chassisRef.current.material.opacity = THREE.MathUtils.lerp(
      chassisRef.current.material.opacity, 
      targetOpacity, 
      delta * 6
    );
    chassisRef.current.scale.lerp(targetScale, delta * 6);
  });

  // Cards configurations: gridPos [x, y, z], scatterPos [x, y, z]
  const cardData = [
    {
      id: 'attendance',
      title: 'ATTENDANCE',
      subtitle: 'Required: >75%',
      color: '#00f3ff', // Cyan
      gridPos: [-2.1, 0.8, 0],
      scatterPos: [-5.0, 4.0, -3.0],
      content: (
        <group position={[0, -0.05, 0]}>
          {/* Gray background track */}
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[0.26, 0.045, 8, 36, Math.PI * 2]} />
            <meshBasicMaterial color="#1e293b" transparent opacity={0.5} />
          </mesh>
          {/* Active progress track */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.26, 0.046, 8, 36, Math.PI * 1.6]} /> {/* 80% */}
            <meshBasicMaterial color="#00f3ff" />
          </mesh>
          <Text
            position={[0, -0.02, 0.02]}
            fontSize={0.12}
            color="#ffffff"
            font="https://fonts.gstatic.com/s/outfit/v11/q5uUd1ypQ7YQDhk2WD.woff2"
            fontWeight="bold"
          >
            80%
          </Text>
          <Text
            position={[0, -0.25, 0.02]}
            fontSize={0.045}
            color="#94a3b8"
            font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2BgA.woff2"
          >
            2 safe classes left
          </Text>
        </group>
      )
    },
    {
      id: 'marks',
      title: 'GRADES & CGPA',
      subtitle: 'SGPA Analytics',
      color: '#bd00ff', // Violet
      gridPos: [0, 0.8, 0],
      scatterPos: [1.2, 5.0, -4.5],
      content: (
        <group position={[0, -0.05, 0]}>
          {/* 3D Bar columns */}
          <mesh position={[-0.32, -0.15 + 0.15, 0]}>
            <boxGeometry args={[0.13, 0.3, 0.05]} />
            <meshBasicMaterial color="#00f3ff" />
          </mesh>
          <mesh position={[0, -0.15 + 0.24, 0]}>
            <boxGeometry args={[0.13, 0.48, 0.05]} />
            <meshBasicMaterial color="#bd00ff" />
          </mesh>
          <mesh position={[0.32, -0.15 + 0.19, 0]}>
            <boxGeometry args={[0.13, 0.38, 0.05]} />
            <meshBasicMaterial color="#6366f1" />
          </mesh>
          <Text
            position={[0, -0.25, 0.02]}
            fontSize={0.06}
            color="#ffffff"
            font="https://fonts.gstatic.com/s/outfit/v11/q5uUd1ypQ7YQDhk2WD.woff2"
            fontWeight="bold"
          >
            SGPA: 8.75
          </Text>
        </group>
      )
    },
    {
      id: 'timetable',
      title: 'TIMETABLE',
      subtitle: 'Today classes schedule',
      color: '#00f3ff', // Cyan
      gridPos: [2.1, 0.8, 0],
      scatterPos: [5.0, 3.5, -3.0],
      content: (
        <group position={[0, 0.04, 0]}>
          {[-0.05, -0.18, -0.31].map((y, idx) => (
            <group key={idx} position={[0, y, 0]}>
              <mesh>
                <planeGeometry args={[1.5, 0.09]} />
                <meshBasicMaterial color={idx === 0 ? "#00f3ff" : "#1e293b"} transparent opacity={idx === 0 ? 0.18 : 0.4} />
              </mesh>
              <Text
                position={[-0.68, 0, 0.01]}
                fontSize={0.042}
                color="#ffffff"
                font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2BgA.woff2"
                anchorX="left"
              >
                {idx === 0 ? "09:00 - CS-301" : idx === 1 ? "11:00 - MA-302" : "14:00 - EC-305"}
              </Text>
              <Text
                position={[0.68, 0, 0.01]}
                fontSize={0.038}
                color={idx === 0 ? "#00f3ff" : "#94a3b8"}
                font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2BgA.woff2"
                anchorX="right"
              >
                {idx === 0 ? "Active" : "Upcoming"}
              </Text>
            </group>
          ))}
        </group>
      )
    },
    {
      id: 'exams',
      title: 'EXAMS COUNTDOWN',
      subtitle: 'T-Minus Schedule',
      color: '#bd00ff', // Violet
      gridPos: [-2.1, -0.8, 0],
      scatterPos: [-5.0, -4.5, -3.0],
      content: (
        <group position={[0, -0.05, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <torusGeometry args={[0.2, 0.025, 6, 24]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <Text
            position={[0, 0.07, 0.02]}
            fontSize={0.08}
            color="#ffffff"
            font="https://fonts.gstatic.com/s/outfit/v11/q5uUd1ypQ7YQDhk2WD.woff2"
            fontWeight="bold"
          >
            12d
          </Text>
          <Text
            position={[0, -0.16, 0.02]}
            fontSize={0.048}
            color="#fca5a5"
            font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2BgA.woff2"
            fontWeight="bold"
          >
            Math Mid-Sem
          </Text>
          <Text
            position={[0, -0.26, 0.02]}
            fontSize={0.038}
            color="#94a3b8"
            font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2BgA.woff2"
          >
            Room 402 • 09:30 AM
          </Text>
        </group>
      )
    },
    {
      id: 'tasks',
      title: 'TASK PLANNER',
      subtitle: 'Pending Assignments',
      color: '#00f3ff', // Cyan
      gridPos: [0, -0.8, 0],
      scatterPos: [-1.2, -5.0, -4.5],
      content: (
        <group position={[0, 0.04, 0]}>
          {[-0.05, -0.18, -0.31].map((y, idx) => (
            <group key={idx} position={[0, y, 0]}>
              {/* Spherical Checkbox */}
              <mesh position={[-0.68, 0, 0]}>
                <sphereGeometry args={[0.035, 12, 12]} />
                <meshBasicMaterial color={idx < 2 ? "#10b981" : "#4b5563"} />
              </mesh>
              <Text
                position={[-0.58, 0, 0.01]}
                fontSize={0.042}
                color={idx < 2 ? "#94a3b8" : "#ffffff"}
                font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2BgA.woff2"
                anchorX="left"
              >
                {idx === 0 ? "Complete CS Assignment" : idx === 1 ? "Submit Seminar Slides" : "Register Exam Portal"}
              </Text>
            </group>
          ))}
        </group>
      )
    },
    {
      id: 'ai',
      title: 'AI PORTAL CORE',
      subtitle: 'Active Proactive Guidance',
      color: '#bd00ff', // Violet
      gridPos: [2.1, -0.8, 0],
      scatterPos: [5.0, -4.0, -3.0],
      content: <AIAssistantPanel />
    }
  ];

  return (
    <group>
      {/* Dynamic 3D Chassis Dashboard Shell */}
      <mesh ref={chassisRef} position={[0, 0, -0.06]}>
        <planeGeometry args={[6.4, 3.2]} />
        <meshBasicMaterial 
          color="#00f3ff" 
          transparent 
          opacity={0.15} 
          wireframe
        />
      </mesh>

      {/* Grid Connecting Wire lines (Holographic paths between grid slots) */}
      <group position={[0, 0, -0.05]}>
        {/* Horizontal Connector */}
        <mesh position={[0, 0.8, 0]}>
          <planeGeometry args={[4.2, 0.01]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
        </mesh>
        <mesh position={[0, -0.8, 0]}>
          <planeGeometry args={[4.2, 0.01]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} />
        </mesh>
        {/* Vertical Connectors */}
        <mesh position={[-2.1, 0, 0]}>
          <planeGeometry args={[0.01, 1.6]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.01, 1.6]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} />
        </mesh>
        <mesh position={[2.1, 0, 0]}>
          <planeGeometry args={[0.01, 1.6]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Cards Mapping */}
      {cardData.map((card, idx) => (
        <FloatingDashboardCard
          key={card.id}
          id={card.id}
          index={idx}
          title={card.title}
          subtitle={card.subtitle}
          color={card.color}
          gridPos={card.gridPos}
          scatterPos={card.scatterPos}
        >
          {card.content}
        </FloatingDashboardCard>
      ))}
    </group>
  );
};

export default StudentCommandCenter;
