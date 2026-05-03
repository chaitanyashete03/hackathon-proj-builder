"use client";
import React from "react";

export default function AmbientOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Cerulean Orb — Top Left */}
      <div
        className="absolute animate-orb-1"
        style={{
          top: '-15%',
          left: '-10%',
          width: '55vw',
          height: '55vw',
          maxWidth: '800px',
          maxHeight: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(43, 144, 217, 0.12) 0%, rgba(43, 144, 217, 0.04) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Cerise Orb — Bottom Right */}
      <div
        className="absolute animate-orb-2"
        style={{
          bottom: '-20%',
          right: '-15%',
          width: '50vw',
          height: '50vw',
          maxWidth: '750px',
          maxHeight: '750px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(217, 59, 118, 0.10) 0%, rgba(217, 59, 118, 0.03) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Violet Orb — Center */}
      <div
        className="absolute animate-orb-3"
        style={{
          top: '30%',
          left: '40%',
          width: '40vw',
          height: '40vw',
          maxWidth: '600px',
          maxHeight: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0.02) 40%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
    </div>
  );
}
