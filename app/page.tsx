"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Sparkles, Download, ArrowRight, Activity } from "lucide-react";
import GamifiedProgress from "@/components/GamifiedProgress";
import ThreePreview from "@/components/ThreePreview";
import VoiceControl from "@/components/VoiceControl";
import RealtimeEditor from "@/components/RealtimeEditor";

export default function Home() {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState("Mental health support for remote teams");
  const [loading, setLoading] = useState(false);
  const [researchData, setResearchData] = useState<{analysis: string, sources: any[]} | null>(null);
  
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
    <main className="min-h-screen bg-aurora selection:bg-purple-500/30 overflow-hidden relative">
      {/* Abstract blurred spheres for extra depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 flex flex-col min-h-screen">
        
        {/* Premium Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-8 mt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-8 backdrop-blur-md shadow-lg">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-xs font-display tracking-widest uppercase font-semibold text-purple-200">HackForge Engine v2.0</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter mb-6 text-white leading-[1.1]">
            Build startups at <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 animate-pulse-glow">
              thought speed.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-light">
            Real-time collaboration, AI research, and automatic code generation in one premium environment.
          </p>
        </motion.div>

        <GamifiedProgress currentStep={step} />

        {/* Bento Box Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 flex-1 pb-12">
          
          {/* Main Workstation (Spans 8 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-8 flex flex-col gap-6"
          >
            <Card className="flex-1 p-8 flex flex-col border-white/10 bg-black/40 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-display font-semibold flex items-center gap-3 text-white">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  Core Directive
                </h2>
              </div>
              
              <div className="flex-1">
                <RealtimeEditor initialValue={topic} onChange={setTopic} />
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
                <VoiceControl onCommand={handleVoiceCommand} />
                
                <button 
                  onClick={step < 3 ? handleResearch : handleDeploy}
                  disabled={loading}
                  className="group relative w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-display font-bold tracking-wide flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : step < 3 ? (
                    <>Run AI Research <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  ) : (
                    <>Deploy & Download <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                </button>
              </div>
            </Card>

            {/* Research Results */}
            {researchData && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-none">
                <Card className="p-6 border-purple-500/30 bg-purple-500/10 backdrop-blur-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display font-semibold text-purple-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Gemini Intelligence
                    </h3>
                    <span className="text-[10px] uppercase tracking-widest bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full border border-purple-500/30">Validated</span>
                  </div>
                  <div className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed opacity-90 max-h-48 overflow-y-auto pr-4 custom-scrollbar">
                    {researchData.analysis}
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Side Panel (Spans 4 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            <ThreePreview />
            
            <div className="grid grid-cols-2 gap-4">
               <Card className="p-6 flex flex-col items-center justify-center text-center bg-black/40 border-white/5 hover:bg-white/[0.05] transition-colors cursor-default">
                 <div className="text-3xl font-display font-bold text-white mb-2">100%</div>
                 <div className="text-xs text-gray-400 font-display uppercase tracking-wider">Strict TS</div>
               </Card>
               <Card className="p-6 flex flex-col items-center justify-center text-center bg-black/40 border-white/5 hover:bg-white/[0.05] transition-colors cursor-default">
                 <div className="text-3xl font-display font-bold text-white mb-2">$0</div>
                 <div className="text-xs text-gray-400 font-display uppercase tracking-wider">Zero API Cost</div>
               </Card>
            </div>
            
            {/* Ambient decorative card */}
            <Card className="flex-1 p-6 relative overflow-hidden bg-black/40 border-white/5 flex items-end">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full" />
              <div className="relative z-10">
                <div className="text-sm font-display text-gray-400 uppercase tracking-widest mb-1">System Status</div>
                <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  All systems nominal
                </div>
              </div>
            </Card>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
