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
    <div className="flex items-center gap-4 bg-white/[0.02] p-2 rounded-full border border-white/5 backdrop-blur-md w-full sm:w-auto">
      <div className="relative">
        {isListening && (
          <div className="absolute inset-0 rounded-full bg-red-500 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
        )}
        <button 
          onClick={isListening ? undefined : startListening}
          className={`relative z-10 p-4 rounded-full transition-all duration-300 shadow-lg ${isListening ? 'bg-red-500 text-white shadow-red-500/50' : 'bg-gradient-to-tr from-gray-800 to-gray-700 text-gray-300 hover:text-white border border-white/10 hover:border-white/20'}`}
        >
          {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-400 font-display px-2 pr-4">
        {isListening ? (
          <span className="text-red-400 animate-pulse">Listening for commands...</span>
        ) : (
          <>
            <Command className="w-4 h-4 text-purple-400" />
            <span>{transcript ? `"${transcript}"` : "Say 'Research' or 'Deploy'"}</span>
          </>
        )}
      </div>
    </div>
  );
}
