"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, TorusKnot, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

function AnimatedShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x += delta * 0.2;
      wireframeRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group>
        <TorusKnot ref={meshRef} args={[1, 0.3, 128, 32]}>
          <MeshDistortMaterial color="#000000" speed={2} distort={0.1} roughness={0.1} metalness={0.9} />
        </TorusKnot>
        <TorusKnot ref={wireframeRef} args={[1.01, 0.3, 128, 32]}>
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.3} />
        </TorusKnot>
      </group>
    </Float>
  );
}

export default function ThreePreview() {
  return (
    <div className="w-full h-64 md:h-[400px] rounded-2xl overflow-hidden border border-white/5 bg-transparent relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest font-display text-purple-200">Live 3D Engine</span>
      </div>
      <Canvas camera={{ position: [0, 0, 4] }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ec4899" />
        <directionalLight position={[-10, -10, -5]} intensity={2} color="#3b82f6" />
        <AnimatedShape />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
