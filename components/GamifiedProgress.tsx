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
    <div className="w-full py-6">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} />}
      <div className="flex justify-between items-center relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 z-0">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(100, (currentStep / (STEPS.length - 1)) * 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 
                  ${isCompleted ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                  : isCurrent ? 'bg-blue-600 border-blue-400 text-white animate-pulse' 
                  : 'bg-gray-900 border-gray-700 text-gray-500'}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent || isCompleted ? 1 : 0.8 }}
              >
                {isCompleted ? '✓' : index + 1}
              </motion.div>
              <span className={`mt-2 text-xs font-semibold ${isCurrent ? 'text-blue-400' : isCompleted ? 'text-purple-400' : 'text-gray-500'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
