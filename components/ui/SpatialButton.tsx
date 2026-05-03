"use client";
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "./card";

type ButtonVariant = "primary" | "ghost" | "cerulean" | "cerise";
type ButtonSize = "sm" | "md" | "lg";

interface SpatialButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  /** Show shimmer effect on hover */
  shimmer?: boolean;
  /** Show loading spinner */
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-gradient-to-r from-accent-cerulean via-accent-violet to-accent-cerise",
    "text-white font-semibold",
    "border border-white/10",
    "shadow-[0_4px_20px_rgba(43,144,217,0.25)]",
    "hover:shadow-[0_8px_30px_rgba(43,144,217,0.35)]",
  ].join(" "),
  ghost: [
    "bg-glass-base backdrop-blur-glass",
    "text-text-primary",
    "border border-glass-border",
    "shadow-glass",
    "hover:bg-glass-hover hover:border-glass-border",
  ].join(" "),
  cerulean: [
    "bg-accent-cerulean/10",
    "text-accent-cerulean",
    "border border-accent-cerulean/30",
    "hover:bg-accent-cerulean/20 hover:border-accent-cerulean/50",
  ].join(" "),
  cerise: [
    "bg-accent-cerise/10",
    "text-accent-cerise",
    "border border-accent-cerise/30",
    "hover:bg-accent-cerise/20 hover:border-accent-cerise/50",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-xl gap-2",
  md: "px-6 py-3 text-base rounded-2xl gap-3",
  lg: "px-8 py-4 text-lg rounded-full gap-3",
};

export default function SpatialButton({
  variant = "primary",
  size = "md",
  shimmer = true,
  loading = false,
  children,
  className,
  disabled,
  ...props
}: SpatialButtonProps) {
  return (
    <motion.button
      className={cn(
        "relative inline-flex items-center justify-center font-display tracking-wide overflow-hidden",
        "transition-colors duration-300",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { 
        scale: 0.96,
        boxShadow: '0 2px 8px rgba(0,0,0,0.50)',
      } : undefined}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect */}
      {shimmer && variant === "primary" && !disabled && (
        <span 
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{ pointerEvents: 'none' }}
        >
          <span 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              animation: 'shimmer 2s ease-in-out infinite',
              animationDelay: '1s',
            }}
          />
        </span>
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-inherit">
        {loading ? (
          <span className="flex items-center gap-3">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}
