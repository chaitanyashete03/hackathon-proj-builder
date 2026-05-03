"use client";
import React, { useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { Users } from "lucide-react"

interface RealtimeEditorProps {
  initialValue: string;
  onChange: (val: string) => void;
  onStatusChange?: (connected: boolean) => void;
}

export default function RealtimeEditor({ initialValue, onChange, onStatusChange }: RealtimeEditorProps) {
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
      const isConnected = event.status === 'connected';
      setConnected(isConnected);
      onStatusChange?.(isConnected);
    });

    // Simulate connection for demo since we disabled the public signaling server
    setTimeout(() => {
      setConnected(true);
      onStatusChange?.(true);
    }, 1500);

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
    <div className="relative w-full group rounded-glass bg-void-deep/40 border border-glass-border focus-within:border-accent-cerulean/40 transition-all duration-500 focus-glow">
      {/* Textarea */}
      <textarea
        className="w-full h-40 bg-transparent border-none rounded-glass p-6 text-xl md:text-2xl font-display font-medium text-text-primary placeholder-text-muted/50 focus:outline-none focus:ring-0 resize-none transition-all leading-relaxed"
        value={content}
        onChange={handleChange}
        placeholder="Describe your disruptive startup idea here..."
      />
    </div>
  );
}
