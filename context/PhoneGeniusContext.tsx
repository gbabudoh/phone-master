'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import * as webllm from "@mlc-ai/web-llm";

interface PhoneGeniusContextType {
  engine: webllm.MLCEngine | null;
  loadingProgress: number;
  isInitializing: boolean;
  error: string | null;
  isWebGPUSupported: boolean | null;
  initAI: () => Promise<void>;
  preLoadAI: () => Promise<void>;
  askGenius: (messages: webllm.ChatCompletionMessageParam[], onUpdate: (content: string) => void) => Promise<void>;
}

interface NetworkInformation extends EventTarget {
  readonly type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  readonly saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  readonly connection?: NetworkInformation;
  readonly mozConnection?: NetworkInformation;
  readonly webkitConnection?: NetworkInformation;
}

const PhoneGeniusContext = createContext<PhoneGeniusContextType | undefined>(undefined);

export function PhoneGeniusProvider({ children }: { children: ReactNode }) {
  const [engine, setEngine] = useState<webllm.MLCEngine | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWebGPUSupported, setIsWebGPUSupported] = useState<boolean | null>(null);

  // Refs for stable function identities
  const engineRef = React.useRef(engine);
  const isInitializingRef = React.useRef(isInitializing);
  
  React.useEffect(() => {
    engineRef.current = engine;
    isInitializingRef.current = isInitializing;
  }, [engine, isInitializing]);

  const initAI = useCallback(async () => {
    if (typeof window === 'undefined') return;

    // Check for WebGPU support
    if (!('gpu' in navigator)) {
      setIsWebGPUSupported(false);
      setError("WebGPU is not supported. Please use a modern browser.");
      return;
    }
    setIsWebGPUSupported(true);

    if (engineRef.current || isInitializingRef.current) return;

    // Use a small delay to move state updates out of the synchronous effect body
    // This prevents the "setState synchronously within an effect" warning.
    await new Promise(resolve => setTimeout(resolve, 0));

    setIsInitializing(true);
    setError(null);
    
    try {
      const engineInstance = new webllm.MLCEngine();
      
      engineInstance.setInitProgressCallback((report) => {
        setLoadingProgress(Math.round(report.progress * 100));
      });

      // Llama 3.2 1B (Ultra-lightweight)
      await engineInstance.reload("Llama-3.2-1B-Instruct-q4f16_1-MLC");
      
      setEngine(engineInstance);
    } catch (err: unknown) {
      console.error("WebLLM Init Error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize the local AI engine.";
      setError(errorMessage);
    } finally {
      setIsInitializing(false);
    }
  }, []); // Stable identity

  const preLoadAI = useCallback(async () => {
    if (typeof window === 'undefined' || engineRef.current || isInitializingRef.current) return;

    // Smart Data Saving: Only pre-load if on Wi-Fi (if supported by browser)
    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (connection) {
      // If user has 'save-data' enabled or is on cellular, don't pre-load silently
      if (connection.saveData || (connection.type && connection.type !== 'wifi')) {
        console.log("Pre-load skipped: User is on a metered or slow connection.");
        return;
      }
    }

    console.log("Silent Pre-loading Phone Genius...");
    await initAI();
  }, [initAI]); // Stable identity

  const askGenius = useCallback(async (
    chatMessages: webllm.ChatCompletionMessageParam[], 
    onUpdate: (content: string) => void
  ) => {
    if (!engine) return;

    try {
      let fullContent = "";
      const completion = await engine.chat.completions.create({
        messages: chatMessages,
        stream: true,
      });

      for await (const chunk of completion) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          fullContent += delta;
          onUpdate(fullContent);
        }
      }
    } catch (err) {
      console.error("Streaming Error:", err);
      throw err;
    }
  }, [engine]);

  return (
    <PhoneGeniusContext.Provider value={{ 
      engine, 
      loadingProgress, 
      isInitializing, 
      error, 
      isWebGPUSupported, 
      initAI,
      preLoadAI,
      askGenius
    }}>
      {children}
    </PhoneGeniusContext.Provider>
  );
}

export function usePhoneGenius() {
  const context = useContext(PhoneGeniusContext);
  if (context === undefined) {
    throw new Error("usePhoneGenius must be used within a PhoneGeniusProvider");
  }
  return context;
}
