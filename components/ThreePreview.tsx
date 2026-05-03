"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, TorusKnot, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { Card } from "@/components/ui/card";

function AnimatedShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.25;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x += delta * 0.15;
      wireframeRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <group>
        <TorusKnot ref={meshRef} args={[1, 0.3, 128, 32]}>
          <MeshDistortMaterial 
            color="#08081A" 
            speed={1.5} 
            distort={0.08} 
            roughness={0.15} 
            metalness={0.95} 
          />
        </TorusKnot>
        <TorusKnot ref={wireframeRef} args={[1.01, 0.3, 128, 32]}>
          <meshBasicMaterial color="#2B90D9" wireframe transparent opacity={0.25} />
        </TorusKnot>
      </group>
    </Float>
  );
}

export default function ThreePreview() {
  return (
    <Card 
      className="w-full h-64 md:h-[400px] overflow-hidden relative group p-0"
      glowAccent="cerulean"
      enableTilt={true}
      tiltMax={3}
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cerulean/10 to-accent-cerise/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[1]" />
      
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 glass-chip">
        <div className="w-2 h-2 rounded-full bg-accent-cerulean animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest font-display text-accent-cerulean/80 font-semibold">
          Live 3D Engine
        </span>
      </div>
      
      {/* Canvas */}
      <Canvas camera={{ position: [0, 0, 4] }} gl={{ alpha: true }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#2B90D9" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#D93B76" />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#7C3AED" />
        <AnimatedShape />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </Card>
  );
}
