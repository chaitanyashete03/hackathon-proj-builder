"use client";
import React from "react";

export default function GrainOverlay() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none animate-grain"
      style={{ zIndex: 9999, opacity: 0.04, mixBlendMode: 'overlay' }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="hackforge-grain">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.65" 
            numOctaves="3" 
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hackforge-grain)" />
      </svg>
    </div>
  );
}
