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
    <main className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] selection:bg-purple-500/30 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* Header section - Wow factor right away */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-200">HackForge Production Engine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            Build Startups at <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Thought Speed</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Real-time collaboration, AI research, and automatic code generation in one platform. Speak your idea, download a working app.
          </p>
        </motion.div>

        <GamifiedProgress currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          
          {/* Left Column: Input and Controls */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="text-blue-400 w-5 h-5" /> Problem Statement
              </h2>
              
              <RealtimeEditor initialValue={topic} onChange={setTopic} />
              
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <VoiceControl onCommand={handleVoiceCommand} />
                
                <button 
                  onClick={step < 3 ? handleResearch : handleDeploy}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : step < 3 ? (
                    <>Run AI Research <ArrowRight className="w-4 h-4" /></>
                  ) : (
                    <>Deploy & Download <Download className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </Card>

            {/* Research Results Display */}
            {researchData && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6">
                <Card className="p-6 border-purple-500/30 bg-purple-500/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-purple-300">AI-powered insights by Gemini</h3>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Validated</span>
                  </div>
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">{researchData.analysis}</pre>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column: Visual Preview */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <ThreePreview />
            
            <div className="mt-8 grid grid-cols-2 gap-4">
               <Card className="p-4 text-center">
                 <div className="text-2xl font-bold text-white mb-1">100%</div>
                 <div className="text-xs text-gray-400">Strict TypeScript</div>
               </Card>
               <Card className="p-4 text-center">
                 <div className="text-2xl font-bold text-white mb-1">Zero</div>
                 <div className="text-xs text-gray-400">Paid API Costs</div>
               </Card>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
