import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] text-white transition-all duration-300",
        className
      )} 
      {...props} 
    />
  )
}
