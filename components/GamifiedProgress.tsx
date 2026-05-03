"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

interface GamifiedProgressProps {
  currentStep: number;
}

const STEPS = [
  { label: "Ideate", icon: "💡" },
  { label: "Research", icon: "🔍" },
  { label: "Design", icon: "✏️" },
  { label: "Build", icon: "⚡" },
  { label: "Deploy", icon: "🚀" },
];

export default function GamifiedProgress({ currentStep }: GamifiedProgressProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    if (currentStep === STEPS.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [currentStep]);

  const progress = Math.min(100, (currentStep / (STEPS.length - 1)) * 100);

  return (
    <div className="w-full py-8 max-w-4xl mx-auto">
      {showConfetti && (
        <Confetti 
          width={windowSize.width} 
          height={windowSize.height} 
          recycle={false} 
          colors={['#2B90D9', '#D93B76', '#7C3AED', '#06B6D4']} 
        />
      )}
      
      <div className="flex justify-between items-center relative">
        {/* Track background */}
        <div className="absolute left-0 top-4 -translate-y-1/2 w-full h-[1px] bg-white/[0.05] z-0" />
        
        {/* Animated progress line — cerulean to cerise gradient */}
        <div className="absolute left-0 top-4 -translate-y-1/2 w-full h-[2px] z-0">
          <motion.div 
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #2B90D9, #7C3AED, #D93B76)',
              boxShadow: '0 0 20px rgba(43, 144, 217, 0.40)',
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          
          return (
            <div key={step.label} className="relative z-10 flex flex-col items-center">
              <motion.div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 backdrop-blur-md
                  ${isCompleted 
                    ? 'bg-accent-cerulean/20 border-accent-cerulean shadow-glow-cerulean' 
                    : isCurrent 
                    ? 'bg-accent-cerise/10 border-accent-cerise shadow-glow-cerise' 
                    : 'bg-void-deep/60 border-white/10'
                  }`}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: isCurrent ? 1.2 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {isCompleted ? (
                  <motion.svg 
                    initial={{ scale: 0, rotate: -90 }} 
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="w-3.5 h-3.5 text-accent-cerulean" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : isCurrent ? (
                  <motion.div 
                    className="w-2 h-2 bg-accent-cerise rounded-full" 
                    animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }} 
                    transition={{ duration: 2, repeat: Infinity }} 
                  />
                ) : (
                  <span className="text-xs opacity-40">{step.icon}</span>
                )}
              </motion.div>
              
              <span className={`mt-4 text-[9px] tracking-[0.2em] uppercase font-display font-bold transition-all duration-500
                ${isCurrent 
                  ? 'text-accent-cerise' 
                  : isCompleted 
                  ? 'text-accent-cerulean/70' 
                  : 'text-text-muted'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
