"use client";
import { motion } from "framer-motion";

const VIBES = [
  { id: "Glassmorphism", label: "Glass", emoji: "🪟", desc: "Frosted glass, blur, translucent" },
  { id: "Cyberpunk", label: "Cyber", emoji: "⚡", desc: "Neon, grid, high contrast" },
  { id: "Minimal", label: "Minimal", emoji: "◻️", desc: "Clean, whitespace, typography" },
  { id: "Brutalist", label: "Brutal", emoji: "◼️", desc: "Raw, bold, unconventional" },
  { id: "Organic", label: "Organic", emoji: "🌿", desc: "Soft gradients, rounded, warm" },
  { id: "Futuristic", label: "Future", emoji: "🚀", desc: "3D, motion, spatial UI" },
];

const CATEGORIES = [
  { id: "fintech", label: "Fintech", emoji: "💳" },
  { id: "health", label: "Health", emoji: "🏥" },
  { id: "edtech", label: "EdTech", emoji: "📚" },
  { id: "productivity", label: "Productivity", emoji: "⚡" },
  { id: "social", label: "Social", emoji: "💬" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "ecommerce", label: "Commerce", emoji: "🛍️" },
  { id: "ai", label: "AI/ML", emoji: "🤖" },
];

interface VibeSelectorProps {
  vibe: string;
  category: string;
  onVibeChange: (vibe: string) => void;
  onCategoryChange: (category: string) => void;
}

export default function VibeSelector({ vibe, category, onVibeChange, onCategoryChange }: VibeSelectorProps) {
  return (
    <div className="space-y-5 mt-6">
      {/* Vibe */}
      <div>
        <p className="text-[10px] font-display uppercase tracking-widest text-text-muted mb-3">
          Design Vibe
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {VIBES.map((v) => (
            <motion.button
              key={v.id}
              onClick={() => onVibeChange(v.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`relative flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all duration-200 ${
                vibe === v.id
                  ? "border-accent-cerulean bg-accent-cerulean/10 text-text-primary"
                  : "border-glass-border bg-void-deep/30 text-text-muted hover:border-accent-cerulean/40 hover:text-text-secondary"
              }`}
            >
              <span className="text-lg">{v.emoji}</span>
              <span className="text-[10px] font-display font-semibold uppercase tracking-wider">{v.label}</span>
              {vibe === v.id && (
                <motion.div
                  layoutId="vibe-active"
                  className="absolute inset-0 rounded-xl border border-accent-cerulean/60"
                  style={{ boxShadow: "0 0 12px rgba(43,144,217,0.20)" }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-[10px] font-display uppercase tracking-widest text-text-muted mb-3">
          Project Category
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <motion.button
              key={c.id}
              onClick={() => onCategoryChange(c.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-semibold border transition-all duration-200 ${
                category === c.id
                  ? "border-accent-cerise bg-accent-cerise/10 text-text-primary"
                  : "border-glass-border bg-void-deep/30 text-text-muted hover:border-accent-cerise/40"
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
