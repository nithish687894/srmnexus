import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Html } from '@react-three/drei';
import * as THREE from 'three';

const AIAssistantPanel = () => {
  const scroll = useScroll();
  const innerCoreRef = useRef();
  const outerKnotRef = useRef();
  const orbitRingRef = useRef();

  // Direct DOM Refs for chat balloons to achieve 60fps animations
  const s1Ref = useRef();
  const a1Ref = useRef();
  const s2Ref = useRef();
  const containerRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const r = scroll.offset;
    
    // 1. Rotate AI core components
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -time * 1.5;
      innerCoreRef.current.rotation.x = time * 0.8;
      
      const scale = 1.0 + Math.sin(time * 6) * 0.08;
      innerCoreRef.current.scale.set(scale, scale, scale);
    }
    
    if (outerKnotRef.current) {
      outerKnotRef.current.rotation.y = time * 2.2;
      outerKnotRef.current.rotation.x = time * 1.1;
    }
    
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z = time * 0.5;
      orbitRingRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }

    // 2. Animate DOM Chat elements directly on the style object
    let s1 = 0, a1 = 0, s2 = 0, containerOpacity = 0;

    if (r >= 0.60 && r < 0.66) {
      // approaching AI Zoom: fade-in general container
      containerOpacity = (r - 0.60) / 0.06;
    } else if (r >= 0.66 && r < 0.83) {
      // Scene 5: Zoom Active
      containerOpacity = 1.0;
      
      // Calculate local progress in active zoom range (t: 0 to 1)
      const t = (r - 0.66) / 0.17;
      s1 = THREE.MathUtils.clamp((t - 0.08) / 0.25, 0, 1);
      a1 = THREE.MathUtils.clamp((t - 0.36) / 0.25, 0, 1);
      s2 = THREE.MathUtils.clamp((t - 0.64) / 0.25, 0, 1);
    } else if (r >= 0.83 && r < 0.90) {
      // pulling back: fade-out chat overlay
      containerOpacity = 1.0 - (r - 0.83) / 0.07;
      s1 = 1; a1 = 1; s2 = 1;
    } else if (r >= 0.90) {
      containerOpacity = 0.0;
    }

    // Apply inline CSS styles directly
    if (containerRef.current) {
      containerRef.current.style.opacity = containerOpacity;
      containerRef.current.style.pointerEvents = r >= 0.66 && r < 0.83 ? 'auto' : 'none';
      containerRef.current.style.display = containerOpacity > 0.01 ? 'flex' : 'none';
    }
    if (s1Ref.current) {
      s1Ref.current.style.opacity = s1;
      s1Ref.current.style.transform = `translateY(${(1 - s1) * 12}px)`;
    }
    if (a1Ref.current) {
      a1Ref.current.style.opacity = a1;
      a1Ref.current.style.transform = `translateY(${(1 - a1) * 12}px)`;
    }
    if (s2Ref.current) {
      s2Ref.current.style.opacity = s2;
      s2Ref.current.style.transform = `translateY(${(1 - s2) * 12}px)`;
    }
  });

  // Keep the overlay mounted always, and control visibility via CSS display/opacity for fast loads
  return (
    <group position={[0, -0.05, 0]}>
      {/* 1. 3D Glowing AI Core */}
      <group position={[0, 0, 0.05]} scale={[0.65, 0.65, 0.65]}>
        {/* Inner Solid Emissive Orb */}
        <mesh ref={innerCoreRef}>
          <icosahedronGeometry args={[0.32, 2]} />
          <meshBasicMaterial color="#bd00ff" />
        </mesh>
        
        {/* Middle Wireframe Sphere */}
        <mesh ref={outerKnotRef}>
          <torusKnotGeometry args={[0.42, 0.08, 64, 8, 2, 3]} />
          <meshBasicMaterial color="#00f3ff" wireframe />
        </mesh>

        {/* Orbit Data Rings */}
        <mesh ref={orbitRingRef} rotation={[Math.PI / 2, 0.3, 0]}>
          <torusGeometry args={[0.68, 0.015, 8, 48]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* 2. Interactive R3F HTML Chat Overlay inside the 3D scene (No occlusion to prevent WebGL black screen crashes) */}
      <Html
        position={[0, 0, 0.12]}
        transform
        distanceFactor={1.35}
        style={{
          width: '270px',
          fontFamily: '"Inter", sans-serif',
        }}
      >
        <div 
          ref={containerRef}
          className="flex flex-col gap-2.5 p-3 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md shadow-card-glow text-[11px] leading-relaxed select-none"
          style={{ transition: 'opacity 0.1s linear' }}
        >
          
          {/* Student Message */}
          <div 
            ref={s1Ref}
            className="flex flex-col items-end transition-all duration-300"
          >
            <div className="bg-white/15 text-slate-100 px-3 py-1.5 rounded-2xl rounded-tr-sm max-w-[85%] border border-white/5">
              How many classes can I miss? 💬
            </div>
            <span className="text-[8px] text-slate-500 mt-0.5">Student • 11:43 AM</span>
          </div>

          {/* AI Message */}
          <div 
            ref={a1Ref}
            className="flex flex-col items-start transition-all duration-300"
          >
            <div className="bg-cyber-violet/20 border border-cyber-neonViolet/40 text-cyber-neonCyan px-3 py-2 rounded-2xl rounded-tl-sm max-w-[88%] shadow-violet-glow/10">
              <span className="font-bold text-cyber-neonViolet">Nexus AI:</span> You can safely miss <strong className="text-white underline decoration-cyber-neonCyan">2 more</strong> classes and still stay above <strong className="text-white">75%</strong>.
            </div>
            <span className="text-[8px] text-slate-500 mt-0.5">Nexus AI Assistant • Active</span>
          </div>

          {/* Action Recommendations */}
          <div 
            ref={s2Ref}
            className="flex flex-col gap-1.5 transition-all duration-300 mt-1"
          >
            <div className="text-[9px] text-slate-400 font-semibold border-t border-white/5 pt-2">
              Proactive Actions:
            </div>
            <button 
              onClick={() => alert('Attendance calendar alarm synchronized!')}
              className="w-full text-left bg-cyber-cyan/10 border border-cyber-cyan/30 hover:bg-cyber-cyan/30 text-cyber-neonCyan px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors duration-200"
            >
              <span>Add Class Calendar Alarm</span>
              <span className="text-white">⏰</span>
            </button>
          </div>
          
        </div>
      </Html>
    </group>
  );
};

export default AIAssistantPanel;
