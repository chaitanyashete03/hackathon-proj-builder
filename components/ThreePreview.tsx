"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, MeshDistortMaterial, Text } from "@react-three/drei";
import * as THREE from "three";

function AnimatedCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Box ref={meshRef} args={[2, 2, 2]}>
      <MeshDistortMaterial color="#8b5cf6" speed={2} distort={0.2} roughness={0.2} metalness={0.8} wireframe={false} />
    </Box>
  );
}

export default function ThreePreview() {
  return (
    <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-black to-slate-900 relative">
      <div className="absolute top-4 left-4 z-10 bg-black/50 px-3 py-1 rounded-full text-xs font-mono text-purple-300 border border-purple-500/30 backdrop-blur-sm">
        Live 3D Rendering
      </div>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimatedCube />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}
