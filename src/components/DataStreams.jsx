import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

const DataStreams = () => {
  const scroll = useScroll();
  const dataStreamsRef = useRef();

  const count = 400;
  
  // Initialize structured columns (data streams) coordinates
  const [positions, speeds, streams] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    const str = [];
    
    // Create 12 columns
    for (let s = 0; s < 12; s++) {
      str.push({
        x: (Math.random() - 0.5) * 14,
        z: -3.5 - Math.random() * 4.5
      });
    }

    for (let i = 0; i < count; i++) {
      const streamIdx = i % 12;
      pos[i * 3] = str[streamIdx].x + (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = str[streamIdx].z + (Math.random() - 0.5) * 0.3;
      sp[i] = 0.6 + Math.random() * 1.4;
    }
    return [pos, sp, str];
  }, []);

  useFrame((state, delta) => {
    const r = scroll.offset;
    const time = state.clock.elapsedTime;
    
    if (dataStreamsRef.current) {
      const posAttr = dataStreamsRef.current.geometry.attributes.position;
      
      for (let i = 0; i < count; i++) {
        let y = posAttr.array[i * 3 + 1];
        let speedMult = 1.0;
        let jitter = 0.0;
        
        // Scene 2 (Chaos): streams speed up and scatter
        if (r >= 0.16 && r < 0.33) {
          const t = (r - 0.16) / 0.17;
          speedMult = 1.0 + t * 2.5;
          jitter = t * 0.03;
        }
        // Scene 3 (Organize Solution): stream aligns and returns to calm speed
        else if (r >= 0.33 && r < 0.50) {
          const t = (r - 0.33) / 0.17;
          speedMult = 3.5 - t * 2.5;
        }

        y += delta * speeds[i] * 0.9 * speedMult;
        
        // Reset vertically when reaching ceiling
        if (y > 6) {
          y = -6;
          const streamIdx = i % 12;
          posAttr.array[i * 3] = streams[streamIdx].x + (Math.random() - 0.5) * 0.3;
        }
        
        posAttr.array[i * 3 + 1] = y;
        if (jitter > 0) {
          posAttr.array[i * 3] += (Math.random() - 0.5) * jitter;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
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
  );
};

export default DataStreams;
