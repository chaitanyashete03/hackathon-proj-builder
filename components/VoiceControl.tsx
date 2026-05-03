"use client";
import React, { useState, useCallback } from "react";
import { Mic, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceControlProps {
  onCommand: (command: string) => void;
}

export default function VoiceControl({ onCommand }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript.toLowerCase();
      setTranscript(text);
      
      if (text.includes("research")) onCommand("research");
      else if (text.includes("design")) onCommand("design");
      else if (text.includes("build")) onCommand("build");
      else if (text.includes("deploy") || text.includes("download")) onCommand("deploy");
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  }, [onCommand]);

  if (!supported) return null;

  return (
    <div className="flex items-center gap-4 group w-full sm:w-auto">
      <div className="relative flex items-center justify-center">
        <AnimatePresence>
          {isListening && (
            <>
              {/* Cerulean pulse ring */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'rgba(43, 144, 217, 0.15)' }}
              />
              {/* Cerise pulse ring */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.3, ease: "easeOut" }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'rgba(217, 59, 118, 0.10)' }}
              />
            </>
          )}
        </AnimatePresence>
        
        <motion.button 
          onClick={isListening ? undefined : startListening}
          className={`relative z-10 p-5 rounded-full transition-all duration-500 border backdrop-blur-md ${
            isListening 
              ? 'bg-accent-cerulean text-white border-accent-cerulean/60' 
              : 'bg-glass-base text-text-secondary border-glass-border hover:border-accent-cerulean/30 hover:text-accent-cerulean'
          }`}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={isListening ? { boxShadow: '0 0 30px rgba(43, 144, 217, 0.40)' } : undefined}
        >
          <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
        </motion.button>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Command className="w-3.5 h-3.5 text-accent-cerulean/50" />
          <span className={`text-xs font-display uppercase tracking-widest font-bold ${isListening ? 'text-accent-cerulean' : 'text-text-muted group-hover:text-text-secondary'} transition-colors`}>
            {isListening ? "Listening..." : "Voice Control"}
          </span>
        </div>
        <div className="text-sm text-text-secondary font-light truncate max-w-[200px]">
          {isListening ? "Say 'Research' or 'Deploy'" : (transcript ? `"${transcript}"` : "Tap to activate")}
        </div>
      </div>
    </div>
  );
}
