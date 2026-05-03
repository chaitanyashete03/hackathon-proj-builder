"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerReveal";
import FloatingElement from "@/components/ui/FloatingElement";
import SpatialButton from "@/components/ui/SpatialButton";
import AmbientOrbs from "@/components/ui/AmbientOrbs";
import ParticleField from "@/components/ui/ParticleField";
import GrainOverlay from "@/components/ui/GrainOverlay";
import { Sparkles, Download, ArrowRight, Activity, Zap, Shield, Globe, Users } from "lucide-react";
import GamifiedProgress from "@/components/GamifiedProgress";
import ThreePreview from "@/components/ThreePreview";
import VoiceControl from "@/components/VoiceControl";
import RealtimeEditor from "@/components/RealtimeEditor";

export default function Home() {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState("Mental health support for remote teams");
  const [loading, setLoading] = useState(false);
  const [researchData, setResearchData] = useState<{analysis: string, sources: any[]} | null>(null);
  const [isSyncConnected, setIsSyncConnected] = useState(false);
  
  // Handle Voice Commands
  const handleVoiceCommand = (cmd: string) => {
    if (cmd === "research") handleResearch();
    else if (cmd === "deploy") handleDeploy();
    else setStep((s) => Math.min(s + 1, 4));
  };

  const handleResearch = async () => {
    setLoading(true);
    setStep(1);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (data.success) {
        setResearchData(data.data);
        setStep(2);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    setLoading(true);
    setStep(4);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hackforge-project.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setStep(5); // trigger confetti
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden relative">
      {/* ═══ Ambient Background Layers ═══ */}
      <AmbientOrbs />
      <GrainOverlay />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 flex flex-col min-h-screen">
        
        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION — with particle cinemagraph
           ═══════════════════════════════════════════════════════════ */}
        <div className="relative">
          <ParticleField />
          
          <StaggerContainer className="flex flex-col items-center text-center mb-8 mt-16 relative z-10">
            {/* Floating Badge */}
            <StaggerItem>
              <FloatingElement distance={6} duration={5}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-chip mb-8">
                  <Sparkles className="w-4 h-4 text-accent-cerulean animate-pulse" />
                  <span className="text-xs font-display tracking-widest uppercase font-semibold text-accent-cerulean/80">
                    HackForge Engine v2.0
                  </span>
                </div>
              </FloatingElement>
            </StaggerItem>

            {/* Hero Headline */}
            <StaggerItem>
              <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter mb-6 text-text-primary leading-[1.05]">
                Build startups at <br /> 
                <span className="text-gradient-hero">
                  thought speed.
                </span>
              </h1>
            </StaggerItem>

            {/* Subtitle */}
            <StaggerItem>
              <p className="text-lg md:text-xl text-text-secondary max-w-2xl font-light leading-relaxed">
                Real-time collaboration, AI research, and automatic code generation 
                in one premium environment.
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* ═══ Progress Tracker ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <GamifiedProgress currentStep={step} />
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            BENTO BOX LAYOUT
           ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 flex-1 pb-12">
          
          {/* ─── Main Workstation (8 columns) ─── */}
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} 
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 flex flex-col gap-6"
          >
            <Card 
              className="flex-1 p-8 flex flex-col" 
              glowAccent="cerulean"
              enableTilt={false}
            >
              {/* Section Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-display font-semibold flex items-center gap-3 text-text-primary">
                  <div className="p-2 rounded-xl bg-accent-cerulean/10 text-accent-cerulean border border-accent-cerulean/20">
                    <Activity className="w-5 h-5" />
                  </div>
                  Core Directive
                </h2>

                <div className="flex items-center gap-4">
                  {/* Live Sync Badge - Now outside the editor box */}
                  <div className="flex items-center gap-2 text-[10px] uppercase font-display font-semibold tracking-wider glass-chip px-3 py-1.5">
                    <div className="relative flex items-center justify-center w-2 h-2">
                      {isSyncConnected && (
                        <div 
                          className="absolute inset-0 rounded-full animate-ping opacity-75" 
                          style={{ background: 'rgba(43, 144, 217, 0.5)' }}
                        />
                      )}
                      <div className={`relative w-2 h-2 rounded-full ${isSyncConnected ? 'bg-accent-cerulean' : 'bg-accent-cerise'}`} />
                    </div>
                    <Users className="w-3 h-3 text-text-muted" />
                    <span className="text-text-secondary">{isSyncConnected ? 'Live Sync' : 'Connecting...'}</span>
                  </div>

                  {/* Off-grid accent — Purposeful Chaos */}
                  <div className="hidden md:block w-16 h-[2px] bg-gradient-to-r from-accent-cerulean/40 to-transparent -rotate-3" />
                </div>
              </div>
              
              {/* Editor */}
              <div className="flex-1">
                <RealtimeEditor 
                  initialValue={topic} 
                  onChange={setTopic} 
                  onStatusChange={setIsSyncConnected}
                />
              </div>
              
              {/* Action Bar */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-glass-border">
                <VoiceControl onCommand={handleVoiceCommand} />
                
                <SpatialButton
                  variant="primary"
                  size="lg"
                  onClick={step < 3 ? handleResearch : handleDeploy}
                  loading={loading}
                  disabled={loading}
                >
                  {step < 3 ? (
                    <>Run AI Research <ArrowRight className="w-5 h-5" /></>
                  ) : (
                    <>Deploy & Download <Download className="w-5 h-5" /></>
                  )}
                </SpatialButton>
              </div>
            </Card>

            {/* Research Results */}
            {researchData && (
              <motion.div 
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} 
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="p-6 border-accent-cerulean/20" glowAccent="cerulean" enableTilt={false}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display font-semibold text-accent-cerulean flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Gemini Intelligence
                    </h3>
                    <span className="text-[10px] uppercase tracking-widest glass-chip text-accent-cerulean/80 px-3 py-1 font-display font-semibold">
                      Validated
                    </span>
                  </div>
                  <div className="text-sm text-text-secondary whitespace-pre-wrap font-sans leading-relaxed opacity-90 max-h-48 overflow-y-auto pr-4 custom-scrollbar">
                    {researchData.analysis}
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* ─── Side Panel (4 columns) ─── */}
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} 
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            {/* 3D Preview */}
            <ThreePreview />
            
            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4">
              <FloatingElement distance={4} duration={7} delay={0}>
                <Card 
                  className="p-6 flex flex-col items-center justify-center text-center"
                  glowAccent="cerulean"
                  tiltMax={6}
                >
                  <div className="p-2 rounded-xl bg-accent-cerulean/10 mb-3">
                    <Zap className="w-5 h-5 text-accent-cerulean" />
                  </div>
                  <div className="text-3xl font-display font-bold text-text-primary mb-1">100%</div>
                  <div className="text-[10px] text-text-muted font-display uppercase tracking-wider">Strict TS</div>
                </Card>
              </FloatingElement>
              
              <FloatingElement distance={4} duration={7} delay={1}>
                <Card 
                  className="p-6 flex flex-col items-center justify-center text-center"
                  glowAccent="cerise"
                  tiltMax={6}
                >
                  <div className="p-2 rounded-xl bg-accent-cerise/10 mb-3">
                    <Shield className="w-5 h-5 text-accent-cerise" />
                  </div>
                  <div className="text-3xl font-display font-bold text-text-primary mb-1">$0</div>
                  <div className="text-[10px] text-text-muted font-display uppercase tracking-wider">Zero API Cost</div>
                </Card>
              </FloatingElement>
            </div>
            
            {/* System Status Card */}
            <Card 
              className="flex-1 p-6 relative overflow-hidden flex items-end min-h-[120px]"
              glowAccent="violet"
            >
              {/* Off-grid decorative accent */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full"
                style={{ 
                  background: 'radial-gradient(circle, rgba(43,144,217,0.15) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                  transform: 'translate(20%, -30%) rotate(-12deg)',
                }}
              />
              <div 
                className="absolute bottom-4 left-4 w-20 h-20 rounded-full"
                style={{ 
                  background: 'radial-gradient(circle, rgba(217,59,118,0.08) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />
              
              <div className="relative z-10 w-full">
                <div className="text-sm font-display text-text-muted uppercase tracking-widest mb-2">
                  System Status
                </div>
                <div className="flex items-center gap-2 text-accent-cerulean font-mono text-sm">
                  <div className="relative w-2 h-2">
                    <div className="absolute inset-0 rounded-full bg-accent-cerulean animate-ping opacity-40" />
                    <div className="relative w-2 h-2 rounded-full bg-accent-cerulean" />
                  </div>
                  All systems nominal
                </div>
                
                {/* Decorative mini stat bar */}
                <div className="mt-4 flex gap-1">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 h-1 rounded-full"
                      style={{ background: i < 9 ? 'rgba(43, 144, 217, 0.40)' : 'rgba(61, 74, 92, 0.30)' }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8 + i * 0.05, duration: 0.4 }}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Features Overview Card */}
            <Card className="p-6" glowAccent="cerulean">
              <h3 className="text-sm font-display font-semibold text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent-violet" />
                Capabilities
              </h3>
              <div className="space-y-3">
                {[
                  { label: "AI Research", color: "cerulean", progress: 95 },
                  { label: "Code Gen", color: "cerise", progress: 88 },
                  { label: "Collab", color: "violet", progress: 100 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-xs font-display text-text-muted w-20">{item.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: item.color === 'cerulean' 
                            ? '#2B90D9' 
                            : item.color === 'cerise' 
                            ? '#D93B76' 
                            : '#7C3AED',
                          boxShadow: `0 0 10px ${
                            item.color === 'cerulean' 
                              ? 'rgba(43,144,217,0.30)' 
                              : item.color === 'cerise' 
                              ? 'rgba(217,59,118,0.30)' 
                              : 'rgba(124,58,237,0.30)'
                          }`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <span className="text-xs font-mono text-text-muted w-8 text-right">{item.progress}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
