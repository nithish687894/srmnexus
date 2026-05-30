import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Scene from './Scene';
import CyberEnvironment from './CyberEnvironment';
import OverlaySections from './OverlaySections';

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
        
        {/* Scroll Controls containing the 3D Scene and the HTML Overlay */}
        <ScrollControls pages={6} damping={0.25} distance={1.2}>
          {/* Futuristic Cinematic Cyber OS Background Environment */}
          <CyberEnvironment />

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
