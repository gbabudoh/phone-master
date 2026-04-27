'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Zap, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { usePhoneGenius } from '@/context/PhoneGeniusContext';
import Link from 'next/link';
import { getSystemPrompt } from '@/lib/ai/prompts';

type Message = { sender: 'user' | 'chatbot'; content: string };

const SUGGESTED = [
  'Is this phone unlocked?',
  'How does escrow work?',
  'How do I check an IMEI?',
];

export default function ChatbotButton() {
  const { 
    engine, 
    loadingProgress, 
    isInitializing, 
    isWebGPUSupported, 
    initAI,
    preLoadAI,
    askGenius 
  } = usePhoneGenius();

  useEffect(() => {
    preLoadAI();
  }, [preLoadAI]);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages container only (not the page)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const open = () => {
    setIsOpen(true);
  };

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading || !engine) return;

    setInput('');
    const userMessage: Message = { sender: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const history = messages.slice(-4).map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      const systemPrompt = getSystemPrompt();

      // Placeholder for streaming
      setMessages((prev) => [...prev, { sender: 'chatbot', content: '' }]);

      await askGenius(
        [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: content }
        ],
        (updatedContent) => {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.sender === 'chatbot') {
              lastMessage.content = updatedContent;
            }
            return newMessages;
          });
        }
      );
    } catch (error: unknown) {
      console.error("WebLLM Button Error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: 'chatbot',
          content: 'Sorry, the local AI encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Floating trigger ── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <button
            onClick={open}
            className="group relative flex cursor-pointer items-center gap-2.5 rounded-full bg-primary pl-4 pr-5 py-3 text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-2xl hover:scale-105 active:scale-95"
            aria-label="Open Phone Genius chatbot"
          >
            <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
              <MessageCircle className="h-4 w-4 text-white" />
              {/* Online dot */}
              {engine && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-emerald-400" />}
            </div>
            <div className="text-left">
              <p className="text-xs font-black leading-tight">Ask Phone Genius</p>
              <p className="text-[10px] font-medium text-white/70 leading-tight">Private Local AI</p>
            </div>
          </button>
        </div>
      )}

      {/* ── Chat window ── */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
          style={{ height: 'min(520px, calc(100dvh - 5rem))' }}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between bg-primary px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <MessageCircle className="h-4.5 w-4.5 text-white" />
                {engine && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-emerald-400" />}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-black text-white">Phone Genius</p>
                  <span className="flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white/80">
                    <ShieldCheck className="h-2 w-2" />
                    Local
                  </span>
                </div>
                <p className="text-[11px] font-medium text-white/60">Private technical assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4"
          >
            {!engine ? (
              <div className="flex h-full flex-col items-center justify-center gap-5 text-center px-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 text-balance">Activate Local AI for Absolute Privacy</p>
                  <p className="mt-1 text-[11px] font-medium text-gray-500">
                    Phone Genius now runs locally on your device hardware.
                  </p>
                </div>
                
                {isWebGPUSupported === false ? (
                  <div className="rounded-xl bg-amber-50 p-4 text-left border border-amber-100 flex flex-col gap-2">
                    <p className="text-[10px] font-black text-amber-900 uppercase">Hardware Issue</p>
                    <p className="text-[10px] font-semibold text-amber-800 leading-relaxed">
                      This browser doesn&apos;t support WebGPU, which is required for our private Local AI.
                    </p>
                    <Link 
                      href="/support/chatbot" 
                      onClick={() => setIsOpen(false)}
                      className="text-[9px] font-bold text-amber-900 underline underline-offset-2"
                    >
                      Learn more in Support Center
                    </Link>
                  </div>
                ) : isInitializing ? (
                   <div className="w-full space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <span>Downloading Model</span>
                      <span>{loadingProgress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${loadingProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={initAI}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Initialize AI (~600MB)
                    </button>
                    <Link 
                      href="/support/chatbot"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-1 text-[10px] font-bold text-gray-400 hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Full Chat Experience
                    </Link>
                  </div>
                )}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center gap-5 pt-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">Hi! I&apos;m Phone Genius</p>
                  <p className="mt-1 text-xs font-medium text-gray-500">
                    Ask me anything about mobile devices or how this marketplace works.
                  </p>
                </div>
                <div className="w-full space-y-2">
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-left text-xs font-semibold text-gray-700 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                    >
                      {q}
                      <Send className="ml-2 h-3 w-3 shrink-0 text-gray-300" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'chatbot' && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mb-0.5">
                        <MessageCircle className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs font-medium leading-relaxed ${
                        msg.sender === 'user'
                          ? 'rounded-br-sm bg-primary text-white shadow-sm shadow-primary/20'
                          : 'rounded-bl-sm bg-white text-gray-800 shadow-sm ring-1 ring-black/5'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-end gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <MessageCircle className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="rounded-2xl rounded-bl-sm bg-white px-3.5 py-3 shadow-sm ring-1 ring-black/5">
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-gray-100 bg-white px-3 py-3">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={engine ? "Ask about any device..." : "AI Not Initialized"}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-medium text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
                disabled={loading || !engine}
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || !engine}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-all hover:bg-primary-dark active:scale-95 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
