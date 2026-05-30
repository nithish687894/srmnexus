import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import FloatingDashboardCard from './FloatingDashboardCard';
import AIAssistantPanel from './AIAssistantPanel';
import { Text } from '@react-three/drei';

// Detailed 3D Column Trend Line for Grades Widget
const GradeTrendLine = () => {
  const lineRef = useRef();

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.32, -0.05 + 0.15, 0.03),
      new THREE.Vector3(0, -0.05 + 0.24, 0.03),
      new THREE.Vector3(0.32, -0.05 + 0.19, 0.03)
    ]);
  }, []);

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group ref={lineRef}>
      <mesh>
        <tubeGeometry args={[curve, 16, 0.015, 6, false]} />
        <meshBasicMaterial color="#bd00ff" />
      </mesh>
      {/* Glow peaks */}
      <mesh position={[-0.32, -0.05 + 0.15, 0.04]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#00f3ff" />
      </mesh>
      <mesh position={[0, -0.05 + 0.24, 0.04]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#bd00ff" />
      </mesh>
      <mesh position={[0.32, -0.05 + 0.19, 0.04]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color="#6366f1" />
      </mesh>
    </group>
  );
};

// Dial ticking hands for Exams widget
const ExamDial = () => {
  const handRef = useRef();
  
  useFrame((state) => {
    if (handRef.current) {
      handRef.current.rotation.z = -state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <group position={[0, 0.08, 0.02]}>
      {/* Outer red chronometer casing */}
      <mesh>
        <torusGeometry args={[0.2, 0.025, 6, 32]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      
      {/* Ticking Hand */}
      <group ref={handRef}>
        <mesh position={[0, 0.08, 0.01]}>
          <boxGeometry args={[0.012, 0.15, 0.01]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
      
      {/* Center cap */}
      <mesh position={[0, 0, 0.02]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

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
      const t = (r - 0.16) / 0.17;
      targetOpacity = 0.15 * (1 - t);
      targetScale.set(1 - t * 0.2, 1 - t * 0.2, 1 - t * 0.2);
    } else if (r >= 0.33 && r < 0.50) {
      const t = (r - 0.33) / 0.17;
      targetOpacity = 0.15 + t * 0.25;
      targetScale.set(0.8 + t * 0.2, 0.8 + t * 0.2, 0.8 + t * 0.2);
    } else if (r >= 0.50 && r < 0.83) {
      targetOpacity = 0.1;
    } else if (r >= 0.83) {
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

  const cardData = [
    {
      id: 'attendance',
      title: 'ATTENDANCE SYSTEM',
      subtitle: '80.4% SGPA SYNC',
      color: '#00f3ff',
      gridPos: [-2.1, 0.8, 0],
      scatterPos: [-5.0, 4.0, -3.0],
      content: (
        <group position={[0, -0.05, 0]}>
          {/* Dual concentric progress tracks */}
          <group position={[0, 0.05, 0]}>
            {/* 1. Primary Attendance track */}
            <mesh>
              <torusGeometry args={[0.26, 0.035, 8, 36]} />
              <meshBasicMaterial color="#1e293b" transparent opacity={0.5} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.26, 0.036, 8, 36, Math.PI * 1.6]} /> {/* 80% */}
              <meshBasicMaterial color="#00f3ff" />
            </mesh>

            {/* 2. Required 75% indicator ring */}
            <mesh>
              <torusGeometry args={[0.18, 0.015, 6, 24]} />
              <meshBasicMaterial color="#334155" transparent opacity={0.4} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.18, 0.016, 6, 24, Math.PI * 1.5]} /> {/* 75% */}
              <meshBasicMaterial color="#bd00ff" />
            </mesh>
          </group>

          <Text
            position={[0, 0.03, 0.02]}
            fontSize={0.11}
            color="#ffffff"
            fontWeight="bold"
          >
            80.4%
          </Text>
          <Text
            position={[0, -0.28, 0.02]}
            fontSize={0.045}
            color="#94a3b8"
          >
            MA-302, CS-301: Safe • 2 Classes left
          </Text>
        </group>
      )
    },
    {
      id: 'marks',
      title: 'GRADES & ANALYTICS',
      subtitle: 'SGPA TREND COGNITIVE',
      color: '#bd00ff',
      gridPos: [0, 0.8, 0],
      scatterPos: [1.2, 5.0, -4.5],
      content: (
        <group position={[0, -0.05, 0]}>
          {/* Reference Grade lines */}
          <group position={[0, 0.05, -0.02]}>
            {[-0.1, 0.1, 0.3].map((y, idx) => (
              <mesh key={idx} position={[0, y, 0]}>
                <planeGeometry args={[1.5, 0.005]} />
                <meshBasicMaterial color="#334155" transparent opacity={0.3} />
              </mesh>
            ))}
          </group>

          {/* Detailed 3D Bars */}
          <mesh position={[-0.32, -0.15 + 0.15, 0]}>
            <boxGeometry args={[0.11, 0.3, 0.04]} />
            <meshBasicMaterial color="#00f3ff" transparent opacity={0.65} />
          </mesh>
          <mesh position={[0, -0.15 + 0.24, 0]}>
            <boxGeometry args={[0.11, 0.48, 0.04]} />
            <meshBasicMaterial color="#bd00ff" transparent opacity={0.65} />
          </mesh>
          <mesh position={[0.32, -0.15 + 0.19, 0]}>
            <boxGeometry args={[0.11, 0.38, 0.04]} />
            <meshBasicMaterial color="#6366f1" transparent opacity={0.65} />
          </mesh>

          {/* Emissive trend path conduit */}
          <GradeTrendLine />

          <Text
            position={[0, -0.28, 0.02]}
            fontSize={0.052}
            color="#ffffff"
            fontWeight="bold"
          >
            CGPA: 8.75 [Target: 9.0]
          </Text>
        </group>
      )
    },
    {
      id: 'timetable',
      title: 'TIMETABLE TIMELINE',
      subtitle: 'ACTIVE SLOT SWEEPER',
      color: '#00f3ff',
      gridPos: [2.1, 0.8, 0],
      scatterPos: [5.0, 3.5, -3.0],
      content: (
        <group position={[0, 0.04, 0]}>
          {/* Vertical connection timeline rail */}
          <mesh position={[-0.6, -0.18, 0]}>
            <planeGeometry args={[0.015, 0.36]} />
            <meshBasicMaterial color="#334155" />
          </mesh>

          {[-0.05, -0.18, -0.31].map((y, idx) => (
            <group key={idx} position={[0, y, 0]}>
              <mesh position={[0.05, 0, 0]}>
                <planeGeometry args={[1.3, 0.09]} />
                <meshBasicMaterial color={idx === 0 ? "#00f3ff" : "#1e293b"} transparent opacity={idx === 0 ? 0.18 : 0.45} />
              </mesh>
              
              {/* Timeline dot */}
              <mesh position={[-0.6, 0, 0.01]}>
                <sphereGeometry args={[0.035, 12, 12]} />
                <meshBasicMaterial color={idx === 0 ? "#00f3ff" : "#475569"} />
              </mesh>

              <Text
                position={[-0.45, 0, 0.01]}
                fontSize={0.042}
                color="#ffffff"
                anchorX="left"
              >
                {idx === 0 ? "09:00 - CS-301" : idx === 1 ? "11:00 - MA-302" : "14:00 - EC-305"}
              </Text>
              <Text
                position={[0.62, 0, 0.01]}
                fontSize={0.038}
                color={idx === 0 ? "#00f3ff" : "#94a3b8"}
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
      subtitle: 'T-MINUS SYSTEM WARNING',
      color: '#bd00ff',
      gridPos: [-2.1, -0.8, 0],
      scatterPos: [-5.0, -4.5, -3.0],
      content: (
        <group position={[0, -0.05, 0]}>
          {/* Detailed dial chronometer */}
          <ExamDial />

          <Text
            position={[0, -0.18, 0.02]}
            fontSize={0.052}
            color="#fca5a5"
            fontWeight="bold"
          >
            T-MINUS 12d 04h
          </Text>
          <Text
            position={[0, -0.28, 0.02]}
            fontSize={0.038}
            color="#94a3b8"
          >
            CS-302 Theory • Room 402
          </Text>
        </group>
      )
    },
    {
      id: 'tasks',
      title: 'TASK BOARD PLANNER',
      subtitle: 'PENDING ACTION ITEMS',
      color: '#00f3ff',
      gridPos: [0, -0.8, 0],
      scatterPos: [-1.2, -5.0, -4.5],
      content: (
        <group position={[0, 0.04, 0]}>
          {[-0.05, -0.18, -0.31].map((y, idx) => (
            <group key={idx} position={[0, y, 0]}>
              {/* Progress checkbox widgets */}
              <mesh position={[-0.68, 0, 0]}>
                <sphereGeometry args={[0.038, 12, 12]} />
                <meshBasicMaterial color={idx < 2 ? "#10b981" : "#4b5563"} />
              </mesh>
              
              {/* Task name card */}
              <mesh position={[0.06, 0, -0.01]}>
                <planeGeometry args={[1.2, 0.09]} />
                <meshBasicMaterial color="#1e293b" transparent opacity={0.35} />
              </mesh>

              <Text
                position={[-0.56, 0, 0.01]}
                fontSize={0.042}
                color={idx < 2 ? "#94a3b8" : "#ffffff"}
                anchorX="left"
              >
                {idx === 0 ? "CS Lab Assignment" : idx === 1 ? "Seminar PPT slides" : "Register Exam Portal"}
              </Text>
            </group>
          ))}
        </group>
      )
    },
    {
      id: 'ai',
      title: 'NEXUS COGNITIVE CORE',
      subtitle: 'PROACTIVE NEURAL PREVIEW',
      color: '#bd00ff',
      gridPos: [2.1, -0.8, 0],
      scatterPos: [5.0, -4.0, -3.0],
      content: <AIAssistantPanel />
    }
  ];

  return (
    <group>
      {/* 3D Chassis Dashboard Shell */}
      <mesh ref={chassisRef} position={[0, 0, -0.06]}>
        <planeGeometry args={[6.4, 3.2]} />
        <meshBasicMaterial 
          color="#00f3ff" 
          transparent 
          opacity={0.15} 
          wireframe
        />
      </mesh>

      {/* Holographic Seam Connectors */}
      <group position={[0, 0, -0.05]}>
        <mesh position={[0, 0.8, 0]}>
          <planeGeometry args={[4.2, 0.008]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
        </mesh>
        <mesh position={[0, -0.8, 0]}>
          <planeGeometry args={[4.2, 0.008]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} />
        </mesh>
        <mesh position={[-2.1, 0, 0]}>
          <planeGeometry args={[0.008, 1.6]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.008, 1.6]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} />
        </mesh>
        <mesh position={[2.1, 0, 0]}>
          <planeGeometry args={[0.008, 1.6]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Render the redesigned expensive widget cards */}
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
