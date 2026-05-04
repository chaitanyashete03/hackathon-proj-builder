"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, Zap, Code2, Palette, CheckCircle2, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import SpatialButton from "@/components/ui/SpatialButton";

interface ResearchData {
  projectName: string;
  tagline: string;
  productVision: string;
  uniqueWowFactors: string[];
  userPersonas: Array<{ name: string; role: string; painPoint: string }>;
  mvpFeatures: string[];
  techStack: Record<string, string>;
  designSystem: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontPair: [string, string];
    vibe: string;
    componentStyle: string;
  };
  competitorGaps?: string[];
}

interface ResearchPanelProps {
  data: ResearchData;
  onAccept: () => void;
  onReResearch: () => void;
  loading?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function ResearchPanel({ data, onAccept, onReResearch, loading }: ResearchPanelProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="text-center">
        <div className="inline-flex items-center gap-2 glass-chip px-4 py-2 mb-4">
          <Sparkles className="w-4 h-4 text-accent-cerulean animate-pulse" />
          <span className="text-xs font-display font-semibold uppercase tracking-widest text-accent-cerulean/90">
            Research Intelligence Ready
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-extrabold text-text-primary mb-2 tracking-tight">
          {data.projectName}
        </h2>
        <p className="text-lg text-text-secondary font-light italic">"{data.tagline}"</p>
      </motion.div>

      {/* Design System Preview */}
      <motion.div variants={item}>
        <Card className="p-5" glowAccent="cerulean" enableTilt={false}>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-accent-cerulean" />
            <h3 className="text-sm font-display font-semibold uppercase tracking-widest text-text-muted">Design System</h3>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Color Swatches */}
            <div className="flex gap-2 items-center">
              {[data.designSystem.primaryColor, data.designSystem.secondaryColor, data.designSystem.accentColor].map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-lg border border-white/10 shadow-lg"
                    style={{ background: color, boxShadow: `0 0 12px ${color}60` }}
                  />
                  <span className="text-[9px] font-mono text-text-muted">{color}</span>
                </div>
              ))}
            </div>
            <div className="h-8 w-px bg-glass-border" />
            {/* Font pair */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-muted font-mono">{data.designSystem.fontPair[0]} + {data.designSystem.fontPair[1]}</span>
              <span className="text-[10px] text-text-muted/60">{data.designSystem.componentStyle}</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Product Vision */}
      <motion.div variants={item}>
        <Card className="p-5" enableTilt={false}>
          <p className="text-sm text-text-secondary leading-relaxed italic border-l-2 border-accent-cerulean/50 pl-4">
            {data.productVision}
          </p>
        </Card>
      </motion.div>

      {/* Wow Factors */}
      <motion.div variants={item}>
        <Card className="p-5" glowAccent="cerulean" enableTilt={false}>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-accent-cerulean" />
            <h3 className="text-sm font-display font-semibold uppercase tracking-widest text-text-muted">5 Unique Wow Factors</h3>
          </div>
          <div className="space-y-2.5">
            {data.uniqueWowFactors.map((factor, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 w-5 h-5 rounded-full bg-accent-cerulean/10 border border-accent-cerulean/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-mono font-bold text-accent-cerulean">{i + 1}</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{factor}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Personas + MVP Features row */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personas */}
        <Card className="p-5" enableTilt={false}>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-accent-cerise" />
            <h3 className="text-sm font-display font-semibold uppercase tracking-widest text-text-muted">User Personas</h3>
          </div>
          <div className="space-y-3">
            {data.userPersonas.map((persona, i) => (
              <div key={i} className="rounded-lg bg-void-deep/40 border border-glass-border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-accent-cerise/20 flex items-center justify-center text-[10px] font-bold text-accent-cerise">
                    {persona.name[0]}
                  </div>
                  <span className="text-xs font-display font-semibold text-text-primary">{persona.name}</span>
                  <span className="text-[10px] text-text-muted">· {persona.role}</span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">"{persona.painPoint}"</p>
              </div>
            ))}
          </div>
        </Card>

        {/* MVP Features */}
        <Card className="p-5" enableTilt={false}>
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-accent-violet" />
            <h3 className="text-sm font-display font-semibold uppercase tracking-widest text-text-muted">MVP Features</h3>
          </div>
          <div className="space-y-2">
            {data.mvpFeatures.map((feature, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-cerulean mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-text-secondary leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Tech Stack */}
      <motion.div variants={item}>
        <Card className="p-5" enableTilt={false}>
          <h3 className="text-sm font-display font-semibold uppercase tracking-widest text-text-muted mb-3">Recommended Tech Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(data.techStack).filter(([k]) => k !== 'justification').map(([key, val]) => (
              <div key={key} className="rounded-lg bg-void-deep/40 border border-glass-border p-2.5">
                <p className="text-[10px] font-display uppercase tracking-wider text-text-muted mb-1">{key}</p>
                <p className="text-xs text-text-primary font-semibold">{String(val)}</p>
              </div>
            ))}
          </div>
          {data.techStack.justification && (
            <p className="text-[11px] text-text-muted mt-3 italic">{data.techStack.justification}</p>
          )}
        </Card>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <SpatialButton variant="ghost" size="md" onClick={onReResearch} disabled={loading}>
          <RefreshCw className="w-4 h-4" /> Re-Research
        </SpatialButton>
        <SpatialButton variant="primary" size="lg" onClick={onAccept} loading={loading} disabled={loading}>
          <Zap className="w-5 h-5" /> Accept & Generate Project
        </SpatialButton>
      </motion.div>
    </motion.div>
  );
}
