"use client";
import React from "react";
import { motion } from "framer-motion";

interface FloatingElementProps {
  children: React.ReactNode;
  /** Float distance in pixels */
  distance?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Stagger delay in seconds */
  delay?: number;
  /** Additional className */
  className?: string;
}

export default function FloatingElement({
  children,
  distance = 10,
  duration = 6,
  delay = 0,
  className = "",
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -distance, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
