"use client";
import * as React from "react";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

interface CardProps {
  /** Enable mouse-tracking 3D tilt effect */
  enableTilt?: boolean;
  /** Max tilt rotation in degrees */
  tiltMax?: number;
  /** Glow accent color */
  glowAccent?: 'cerulean' | 'cerise' | 'violet' | 'none';
  /** Additional className */
  className?: string;
  /** Children */
  children?: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Style */
  style?: React.CSSProperties;
}

export function Card({ 
  className, 
  enableTilt = true, 
  tiltMax = 4,
  glowAccent = 'none',
  children,
  onClick,
  style,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [tiltMax, -tiltMax]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-tiltMax, tiltMax]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const glowColors: Record<string, string> = {
    cerulean: 'rgba(43, 144, 217, 0.08)',
    cerise: 'rgba(217, 59, 118, 0.08)',
    violet: 'rgba(124, 58, 237, 0.08)',
    none: 'transparent',
  };

  return (
    <div style={{ perspective: '800px' }}>
      <motion.div
        ref={cardRef}
        className={cn(
          "relative overflow-hidden rounded-[20px]",
          "border border-[rgba(255,255,255,0.10)]",
          "backdrop-blur-[24px]",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_32px_rgba(0,0,0,0.40)]",
          "text-[#F0F2F5] transition-colors duration-300",
          className
        )}
        style={{
          background: 'rgba(11, 19, 32, 0.50)',
          ...(enableTilt ? { rotateX, rotateY, transformStyle: 'preserve-3d' as const } : {}),
          ...style,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {/* Hover glow gradient */}
        {glowAccent !== 'none' && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-[20px]"
            style={{
              background: `radial-gradient(600px circle at 50% 50%, ${glowColors[glowAccent]}, transparent 60%)`,
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
        {children}
      </motion.div>
    </div>
  );
}

/** Backward-compatible alias */
export const GlassCard = Card;
