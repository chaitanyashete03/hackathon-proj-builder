"use client";
import React, { useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { Users } from "lucide-react";

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
    const provider = new WebrtcProvider(roomName, ydoc, { signaling: ['wss://signaling.yjs.dev'] });
    providerRef.current = provider;

    provider.on('status', (event: { status: string }) => {
      setConnected(event.status === 'connected');
    });

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
    <div className="relative w-full group">
      <div className="absolute top-3 right-3 flex items-center gap-2 text-xs font-mono bg-black/40 px-2 py-1 rounded backdrop-blur border border-white/5">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <Users className="w-3 h-3 text-gray-400" />
        <span className="text-gray-400">{connected ? 'Live Sync' : 'Connecting...'}</span>
      </div>
      <textarea
        className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-all"
        value={content}
        onChange={handleChange}
        placeholder="Describe your startup idea..."
      />
    </div>
  );
}
