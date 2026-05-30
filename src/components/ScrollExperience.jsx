import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Scene from './Scene';
import OverlaySections from './OverlaySections';

// Custom High-Performance Particle Field
const ParticleField = () => {
  const pointsRef = useRef();
  const count = 1200;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Position spread
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Cyber colors palette (Cyan, Violet, Neon Blue)
      const colorRand = Math.random();
      if (colorRand < 0.4) {
        cols[i * 3] = 0.0;     cols[i * 3 + 1] = 0.95;   cols[i * 3 + 2] = 1.0;  // #00f3ff Cyan
      } else if (colorRand < 0.7) {
        cols[i * 3] = 0.74;    cols[i * 3 + 1] = 0.0;    cols[i * 3 + 2] = 1.0;  // #bd00ff Violet
      } else {
        cols[i * 3] = 0.23;    cols[i * 3 + 1] = 0.51;   cols[i * 3 + 2] = 0.96; // #3b82f6 Blue
      }
    }
    return [pos, cols];
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (pointsRef.current) {
      // Gentle drift rotation
      pointsRef.current.rotation.y = time * 0.015;
      pointsRef.current.rotation.x = time * 0.008;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};

const ScrollExperience = () => {
  return (
    <div className="w-full h-screen relative bg-cyber-bg overflow-hidden select-none">
      
      {/* Background digital grid overlay */}
      <div className="absolute inset-0 bg-cyber-grid-overlay opacity-30 pointer-events-none" />
      
      {/* Background glowing gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyber-cyan/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyber-violet/10 blur-[120px] rounded-full pointer-events-none" />

      {/* React Three Fiber Canvas */}
      <Canvas
        camera={{
          fov: 50,
          near: 0.1,
          far: 1000,
          position: [0, 0, 7.5],
        }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance",
        }}
        className="w-full h-full"
      >
        <color attach="background" args={["#05050c"]} />
        
        {/* Procedural slow-drift particle universe */}
        <ParticleField />

        {/* Scroll Controls containing the 3D Scene and the HTML Overlay */}
        <ScrollControls pages={6} damping={0.25} distance={1.2}>
          {/* Main 3D Space Elements */}
          <Scene />
          
          {/* Scrollable HTML Overlay Layer */}
          <Scroll html>
            <OverlaySections />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
};

export default ScrollExperience;
