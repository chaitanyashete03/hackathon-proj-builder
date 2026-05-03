"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

interface GamifiedProgressProps {
  currentStep: number;
}

const STEPS = ["Ideate", "Research", "Design", "Build", "Deploy"];

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

  return (
    <div className="w-full py-8 max-w-4xl mx-auto">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} colors={['#a855f7', '#3b82f6', '#ec4899']} />}
      <div className="flex justify-between items-center relative">
        <div className="absolute left-0 top-3 -translate-y-1/2 w-full h-[2px] bg-white/5 z-0">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(100, (currentStep / (STEPS.length - 1)) * 100)}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>
        
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <motion.div 
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted ? 'bg-purple-500 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.6)]' 
                  : isCurrent ? 'bg-black border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]' 
                  : 'bg-black border-white/10'}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.2 : 1 }}
              >
                {isCompleted && <div className="w-2 h-2 bg-white rounded-full" />}
                {isCurrent && <motion.div className="w-2 h-2 bg-blue-400 rounded-full" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />}
              </motion.div>
              <span className={`mt-4 text-[10px] tracking-widest uppercase font-display font-semibold transition-colors duration-300 ${isCurrent ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : isCompleted ? 'text-purple-300' : 'text-gray-600'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
