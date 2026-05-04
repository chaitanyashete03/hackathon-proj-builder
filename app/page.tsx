"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerReveal";
import FloatingElement from "@/components/ui/FloatingElement";
import SpatialButton from "@/components/ui/SpatialButton";
import AmbientOrbs from "@/components/ui/AmbientOrbs";
import ParticleField from "@/components/ui/ParticleField";
import GrainOverlay from "@/components/ui/GrainOverlay";
import VibeSelector from "@/components/VibeSelector";
import ResearchPanel from "@/components/ResearchPanel";
import LivePreview from "@/components/LivePreview";
import {
  Sparkles, ArrowRight, Download, RefreshCw, Send,
  CheckCircle2, Loader2, Zap, Search, Code2, Eye
} from "lucide-react";

// ── State Machine Types ────────────────────────────────────
type Phase =
  | "IDLE"           // User entering brief
  | "RESEARCHING"    // AI running 5 searches + synthesis
  | "RESEARCH_REVIEW"// Show research, wait for accept/re-research
  | "GENERATING"     // AI building files one by one
  | "PREVIEW"        // StackBlitz preview + feedback loop
  | "REFINING"       // AI applying user feedback
  | "DONE";          // User happy, ready to download/deploy

interface GenerationFile {
  name: string;
  status: "pending" | "generating" | "done" | "error";
}

const PHASE_STEPS = [
  { id: "IDLE", label: "Brief", icon: Sparkles },
  { id: "RESEARCHING", label: "Research", icon: Search },
  { id: "GENERATING", label: "Generate", icon: Code2 },
  { id: "PREVIEW", label: "Preview", icon: Eye },
  { id: "DONE", label: "Deploy", icon: CheckCircle2 },
];

const FILES_ORDER = [
  "package.json", "tailwind.config.js", "app/globals.css",
  "app/layout.tsx", "components/Navbar.tsx", "components/Hero.tsx",
  "app/page.tsx", "README.md",
];

export default function Home() {
  // ── State ──────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [topic, setTopic] = useState("");
  const [vibe, setVibe] = useState("Glassmorphism");
  const [category, setCategory] = useState("productivity");
  const [researchData, setResearchData] = useState<Record<string, unknown> | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({});
  const [zipBase64, setZipBase64] = useState<string>("");
  const [fileStatuses, setFileStatuses] = useState<GenerationFile[]>([]);
  const [feedback, setFeedback] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const feedbackRef = useRef<HTMLTextAreaElement>(null);

  // ── Handlers ───────────────────────────────────────────

  // Phase 2: Run Research
  const handleResearch = async () => {
    if (!topic.trim()) return;
    setPhase("RESEARCHING");
    setStatusMsg("Running 5 parallel searches across the web...");

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, vibe, category }),
      });
      const data = await res.json();
      if (data.success) {
        setResearchData(data.data);
        setPhase("RESEARCH_REVIEW");
        setStatusMsg("");
      } else {
        setStatusMsg("Research failed — try again");
        setPhase("IDLE");
      }
    } catch {
      setStatusMsg("Network error — try again");
      setPhase("IDLE");
    }
  };

  // Phase 3: Generate Project
  const handleGenerate = async () => {
    setPhase("GENERATING");
    setGeneratedFiles({});

    const initialStatuses: GenerationFile[] = FILES_ORDER.map(f => ({
      name: f, status: "pending"
    }));
    setFileStatuses(initialStatuses);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ researchData, topic, vibe, category, stream: true }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.replace("data: ", ""));

            if (event.type === "progress") {
              setFileStatuses(prev =>
                prev.map(f => f.name === event.file ? { ...f, status: event.status } : f)
              );
              setStatusMsg(`Generating ${event.file}... (${event.index + 1}/${event.total})`);
            }

            if (event.type === "complete") {
              setGeneratedFiles(event.files);
              setZipBase64(event.zipBase64);
              setPhase("PREVIEW");
              setStatusMsg("");
            }

            if (event.type === "error") {
              setStatusMsg(`Error: ${event.message}`);
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (err) {
      setStatusMsg(`Generation failed: ${err}`);
      setPhase("RESEARCH_REVIEW");
    }
  };

  // Phase 4: Submit Feedback & Refine
  const handleRefine = async () => {
    if (!feedback.trim()) return;
    setPhase("REFINING");
    setStatusMsg(`Refining based on your feedback...`);

    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, existingFiles: generatedFiles, researchData, topic, vibe, category }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.replace("data: ", ""));
            if (event.type === "progress") setStatusMsg(`Refining ${event.file}... (${event.index + 1}/${event.total})`);
            if (event.type === "complete") {
              setGeneratedFiles(event.files);
              setZipBase64(event.zipBase64);
              setFeedback("");
              setPhase("PREVIEW");
              setStatusMsg("");
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setStatusMsg("Refinement failed — try again");
      setPhase("PREVIEW");
    }
  };

  // Download ZIP
  const handleDownload = () => {
    if (!zipBase64) return;
    const bytes = Uint8Array.from(atob(zipBase64), c => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(researchData as { projectName?: string })?.projectName || "hackforge-project"}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Deploy to Vercel
  const handleDeploy = () => {
    const name = (researchData as { projectName?: string })?.projectName || "hackforge-project";
    window.open(`https://vercel.com/new?projectName=${encodeURIComponent(name)}`, "_blank");
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <main className="min-h-screen overflow-hidden relative">
      <AmbientOrbs />
      <GrainOverlay />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">

        {/* ── Hero Header (always shown) ── */}
        <div className="relative mb-10">
          <ParticleField />
          <StaggerContainer className="flex flex-col items-center text-center mb-8 mt-16 relative z-10">
            <StaggerItem>
              <FloatingElement distance={6} duration={5}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-chip mb-6">
                  <Sparkles className="w-4 h-4 text-accent-cerulean animate-pulse" />
                  <span className="text-xs font-display tracking-widest uppercase font-semibold text-accent-cerulean/80">
                    HackForge Engine v2.0
                  </span>
                </div>
              </FloatingElement>
            </StaggerItem>
            <StaggerItem>
              <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tighter mb-4 text-text-primary leading-[1.05]">
                Build hackathon projects<br />
                <span className="text-gradient-hero">at thought speed.</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-lg text-text-secondary max-w-xl font-light leading-relaxed">
                Brief → Research → Generate → Preview → Deploy. The complete AI project factory.
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* ── Phase Progress Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mb-10"
        >
          {PHASE_STEPS.map((step, i) => {
            const isActive = phase === step.id || (phase === "RESEARCHING" && step.id === "RESEARCHING") || (phase === "GENERATING" && step.id === "GENERATING") || (phase === "REFINING" && step.id === "PREVIEW") || (phase === "RESEARCH_REVIEW" && step.id === "RESEARCHING");
            const isDone = PHASE_STEPS.findIndex(s => s.id === phase) > i || phase === "DONE";
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-display font-semibold uppercase tracking-wider transition-all duration-500 ${
                  isDone
                    ? "bg-accent-cerulean/20 text-accent-cerulean border border-accent-cerulean/40"
                    : isActive
                    ? "bg-accent-cerise/20 text-accent-cerise border border-accent-cerise/40 animate-pulse"
                    : "border border-glass-border text-text-muted"
                }`}>
                  {isDone ? <CheckCircle2 className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                  {step.label}
                </div>
                {i < PHASE_STEPS.length - 1 && (
                  <div className={`flex-1 max-w-8 h-px transition-all duration-500 ${isDone ? "bg-accent-cerulean/40" : "bg-glass-border"}`} />
                )}
              </React.Fragment>
            );
          })}
        </motion.div>

        {/* ══════════════════════════════════════════════════
            PHASE: IDLE — User Brief
        ══════════════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {phase === "IDLE" && (
            <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="max-w-3xl mx-auto p-8" glowAccent="cerulean" enableTilt={false}>
                <h2 className="text-2xl font-display font-bold text-text-primary mb-2">
                  What are you building?
                </h2>
                <p className="text-sm text-text-muted mb-6">Describe your idea — the AI handles everything else.</p>

                <textarea
                  className="w-full h-32 bg-void-deep/40 border border-glass-border rounded-xl p-4 text-lg font-display text-text-primary placeholder-text-muted/40 focus:outline-none focus:border-accent-cerulean/50 focus-glow resize-none transition-all"
                  placeholder="e.g. An AI-powered platform that helps indie developers find and fix accessibility issues in their apps automatically..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handleResearch(); }}
                />

                <VibeSelector
                  vibe={vibe}
                  category={category}
                  onVibeChange={setVibe}
                  onCategoryChange={setCategory}
                />

                <div className="mt-8 flex items-center justify-between">
                  <p className="text-xs text-text-muted">⌘ + Enter to research</p>
                  <SpatialButton
                    variant="primary"
                    size="lg"
                    onClick={handleResearch}
                    disabled={!topic.trim()}
                  >
                    Research & Build <ArrowRight className="w-5 h-5" />
                  </SpatialButton>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              PHASE: RESEARCHING — Animated Loading
          ══════════════════════════════════════════════ */}
          {phase === "RESEARCHING" && (
            <motion.div key="researching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto text-center py-24"
            >
              <div className="relative inline-flex items-center justify-center mb-8">
                <div className="absolute w-32 h-32 rounded-full border border-accent-cerulean/20 animate-ping" />
                <div className="absolute w-24 h-24 rounded-full border border-accent-cerulean/40 animate-ping" style={{ animationDelay: "0.3s" }} />
                <div className="w-16 h-16 rounded-full bg-accent-cerulean/10 border border-accent-cerulean/60 flex items-center justify-center">
                  <Search className="w-7 h-7 text-accent-cerulean animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-display font-bold text-text-primary mb-3">AI Research in Progress</h2>
              <p className="text-text-muted mb-2">{statusMsg}</p>
              <div className="flex justify-center gap-6 mt-8 text-xs text-text-muted">
                {["Market Analysis", "Competitor Research", "UX Patterns", "Tech Stack", "Wow Factors"].map((q, i) => (
                  <motion.div key={q} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.5 }}
                    className="flex items-center gap-1.5"
                  >
                    <Loader2 className="w-3 h-3 animate-spin text-accent-cerulean" />
                    {q}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              PHASE: RESEARCH_REVIEW — Show Findings
          ══════════════════════════════════════════════ */}
          {phase === "RESEARCH_REVIEW" && researchData && (
            <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResearchPanel
                data={researchData as unknown as Parameters<typeof ResearchPanel>[0]["data"]}
                onAccept={handleGenerate}
                onReResearch={handleResearch}
              />
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              PHASE: GENERATING — File-by-file Progress
          ══════════════════════════════════════════════ */}
          {phase === "GENERATING" && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="max-w-xl mx-auto py-16"
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-violet/10 border border-accent-violet/40 mb-6">
                  <Code2 className="w-7 h-7 text-accent-violet animate-pulse" />
                </div>
                <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Building Your Project</h2>
                <p className="text-sm text-text-muted">{statusMsg}</p>
              </div>

              <Card className="p-6" enableTilt={false}>
                <div className="space-y-3">
                  {fileStatuses.map((file, i) => (
                    <motion.div key={file.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        file.status === "done" ? "bg-accent-cerulean/20 border border-accent-cerulean/60" :
                        file.status === "generating" ? "border-2 border-accent-cerise/60 animate-spin" :
                        file.status === "error" ? "bg-red-500/20 border border-red-500/60" :
                        "border border-glass-border"
                      }`}>
                        {file.status === "done" && <CheckCircle2 className="w-3 h-3 text-accent-cerulean" />}
                        {file.status === "error" && <span className="text-[9px] text-red-400">!</span>}
                      </div>
                      <span className={`text-xs font-mono flex-1 ${
                        file.status === "done" ? "text-accent-cerulean" :
                        file.status === "generating" ? "text-accent-cerise" :
                        "text-text-muted"
                      }`}>
                        {file.name}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wider ${
                        file.status === "done" ? "text-accent-cerulean/70" :
                        file.status === "generating" ? "text-accent-cerise/70" :
                        "text-text-muted/40"
                      }`}>
                        {file.status === "pending" ? "..." : file.status}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Overall progress bar */}
                <div className="mt-6 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-accent-cerulean via-accent-violet to-accent-cerise"
                    animate={{
                      width: `${Math.round((fileStatuses.filter(f => f.status === "done").length / Math.max(fileStatuses.length, 1)) * 100)}%`
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-text-muted text-center mt-2">
                  {fileStatuses.filter(f => f.status === "done").length} / {fileStatuses.length} files generated
                </p>
              </Card>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              PHASE: PREVIEW + REFINING — The Big Layout
          ══════════════════════════════════════════════ */}
          {(phase === "PREVIEW" || phase === "REFINING" || phase === "DONE") && (
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left sidebar — controls */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                  {/* Project identity */}
                  <Card className="p-5" enableTilt={false}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-accent-cerulean animate-pulse" />
                      <span className="text-[10px] font-display uppercase tracking-widest text-text-muted">Project Ready</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-text-primary">
                      {(researchData as Record<string, string>)?.projectName}
                    </h3>
                    <p className="text-xs text-text-muted italic mt-1">
                      "{(researchData as Record<string, string>)?.tagline}"
                    </p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <span className="glass-chip text-[10px] px-2 py-1">{vibe}</span>
                      <span className="glass-chip text-[10px] px-2 py-1">{category}</span>
                    </div>
                  </Card>

                  {/* Files generated */}
                  <Card className="p-4" enableTilt={false}>
                    <p className="text-[10px] font-display uppercase tracking-widest text-text-muted mb-3">Generated Files</p>
                    <div className="space-y-1.5">
                      {Object.keys(generatedFiles).map(f => (
                        <div key={f} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-accent-cerulean flex-shrink-0" />
                          <span className="text-[10px] font-mono text-text-muted truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Feedback input */}
                  <Card className="p-4" glowAccent="cerise" enableTilt={false}>
                    <p className="text-[10px] font-display uppercase tracking-widest text-text-muted mb-3 flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3" /> Feedback & Refine
                    </p>
                    <textarea
                      ref={feedbackRef}
                      className="w-full h-24 bg-void-deep/40 border border-glass-border rounded-lg p-3 text-xs font-display text-text-primary placeholder-text-muted/40 focus:outline-none focus:border-accent-cerise/50 resize-none transition-all"
                      placeholder="e.g. Make the hero section more dramatic, use a darker color scheme, add a particles effect..."
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      disabled={phase === "REFINING"}
                    />
                    <SpatialButton
                      variant="cerise"
                      size="sm"
                      className="w-full mt-3"
                      onClick={handleRefine}
                      disabled={!feedback.trim() || phase === "REFINING"}
                      loading={phase === "REFINING"}
                    >
                      <Send className="w-3.5 h-3.5" />
                      {phase === "REFINING" ? statusMsg || "Refining..." : "Refine Project"}
                    </SpatialButton>
                  </Card>

                  {/* Download + Deploy */}
                  <div className="flex flex-col gap-3">
                    <SpatialButton variant="primary" size="md" onClick={handleDownload} disabled={!zipBase64}>
                      <Download className="w-4 h-4" /> Download ZIP
                    </SpatialButton>
                    <SpatialButton variant="ghost" size="md" onClick={handleDeploy}>
                      <Zap className="w-4 h-4" /> Deploy to Vercel
                    </SpatialButton>
                  </div>

                  {/* Start over */}
                  <button
                    onClick={() => {
                      setPhase("IDLE");
                      setResearchData(null);
                      setGeneratedFiles({});
                      setZipBase64("");
                      setTopic("");
                      setFeedback("");
                    }}
                    className="text-xs text-text-muted hover:text-text-secondary transition-colors text-center"
                  >
                    ← Start a new project
                  </button>
                </div>

                {/* Right — StackBlitz Preview */}
                <div className="lg:col-span-9">
                  <Card className="overflow-hidden" style={{ height: "75vh" }} enableTilt={false}>
                    <LivePreview
                      files={generatedFiles}
                      projectName={(researchData as Record<string, string>)?.projectName || "HackForge Project"}
                    />
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
