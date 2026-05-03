"use client";
import React from "react";
import { motion, type Variants } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   STAGGER REVEAL SYSTEM
   Orchestrates staggered blur-in animations for page entry
   ═══════════════════════════════════════════════════════════════════════════ */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Custom stagger delay between children (seconds) */
  stagger?: number;
  /** Initial delay before animation starts (seconds) */
  delay?: number;
}

export function StaggerContainer({ 
  children, 
  className = "",
  stagger = 0.1,
  delay = 0.1,
}: StaggerContainerProps) {
  const customVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={customVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
