"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Mic, MicOff, Command } from "lucide-react";

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
      
      // Map voice to commands
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
    <div className="flex items-center gap-3">
      <button 
        onClick={isListening ? undefined : startListening}
        className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'}`}
      >
        {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>
      <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
        <Command className="w-4 h-4" />
        {transcript ? `Heard: "${transcript}"` : "Try saying 'Research' or 'Deploy'"}
      </div>
    </div>
  );
}
