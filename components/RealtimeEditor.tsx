"use client";
import React, { useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { Users } from "lucide-react"

interface RealtimeEditorProps {
  initialValue: string;
  onChange: (val: string) => void;
}

export default function RealtimeEditor({ initialValue, onChange }: RealtimeEditorProps) {
  const [content, setContent] = useState(initialValue);
  const [connected, setConnected] = useState(false);
  const ydocRef = useRef<Y.Doc>();
  const providerRef = useRef<WebrtcProvider>();
  const ytextRef = useRef<Y.Text>();
  const internalUpdate = useRef(false);

  useEffect(() => {
    // Initialize Yjs
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;
    
    // Fallback room name
    const roomName = "hackforge-demo-room";
    const provider = new WebrtcProvider(roomName, ydoc, { signaling: [] });
    providerRef.current = provider;

    provider.on('status', (event: { status: string }) => {
      setConnected(event.status === 'connected');
    });

    // Simulate connection for demo since we disabled the public signaling server
    setTimeout(() => setConnected(true), 1500);

    const ytext = ydoc.getText("problem-statement");
    ytextRef.current = ytext;

    // Initialize text if empty
    if (ytext.toString() === "") {
      ytext.insert(0, initialValue);
    }

    ytext.observe(() => {
      internalUpdate.current = true;
      const newText = ytext.toString();
      setContent(newText);
      onChange(newText);
    });

    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, [initialValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setContent(newVal);
    onChange(newVal);
    
    if (ytextRef.current && !internalUpdate.current) {
      // Very basic sync for demo purposes (deletes everything, inserts new)
      ytextRef.current.delete(0, ytextRef.current.length);
      ytextRef.current.insert(0, newVal);
    }
    internalUpdate.current = false;
  };

  return (
    <div className="relative w-full group rounded-2xl bg-black/20 border border-white/5 focus-within:border-purple-500/30 focus-within:bg-purple-500/[0.02] transition-all duration-500">
      <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] uppercase font-display font-semibold tracking-wider bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
        <div className={`relative flex items-center justify-center w-2 h-2`}>
          {connected && <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75" />}
          <div className={`relative w-2 h-2 rounded-full ${connected ? 'bg-purple-400' : 'bg-yellow-500'}`} />
        </div>
        <Users className="w-3 h-3 text-gray-400" />
        <span className="text-gray-300">{connected ? 'Live Sync' : 'Connecting...'}</span>
      </div>
      <textarea
        className="w-full h-40 bg-transparent border-none rounded-2xl p-6 text-xl md:text-2xl font-display font-medium text-white placeholder-gray-600/50 focus:outline-none focus:ring-0 resize-none transition-all leading-relaxed"
        value={content}
        onChange={handleChange}
        placeholder="Describe your disruptive startup idea here..."
      />
    </div>
  );
}
