'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, ArrowLeft, Zap, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { IChatMessage } from '@/types/chatbot';
import FormattedMessage from '@/components/chatbot/FormattedMessage';
import { usePhoneGenius } from '@/context/PhoneGeniusContext';
import { getSystemPrompt } from '@/lib/ai/prompts';

const SUGGESTED_QUESTIONS = [
  'How do I check if a phone is blacklisted?',
  'What is the difference between unlocked and carrier-locked?',
  'How does escrow protection work on Phone Master?',
  'How do I verify an IMEI number?',
];

export default function ChatbotPage() {
  const { 
    engine, 
    loadingProgress, 
    isInitializing, 
    error: initError, 
    isWebGPUSupported, 
    initAI,
    preLoadAI,
    askGenius
  } = usePhoneGenius();

  useEffect(() => {
    preLoadAI();
  }, [preLoadAI]);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Ref on the scrollable messages container — NOT on a child element.
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading || !engine) return;

    const userMessage: IChatMessage = {
      sender: 'user',
      content,
      timestamp: new Date(),
    };

    setInput('');
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Build history for the local model
      const history = messages.slice(-6).map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      const systemPrompt = getSystemPrompt();

      // Create a placeholder message for the assistant
      setMessages((prev) => [...prev, {
        sender: 'chatbot',
        content: '',
        timestamp: new Date(),
      }]);

      await askGenius(
        [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: userMessage.content }
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
      console.error("WebLLM Chat Error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: 'chatbot',
          content: 'Sorry, I encountered an error with the local AI. Please try again.',
          timestamp: new Date(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div
        className="flex flex-col overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5"
        style={{ height: 'min(700px, calc(100dvh - 10rem))' }}
      >

        {/* Chat header */}
        <div className="flex-shrink-0 border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/support"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  {engine && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-gray-900">Phone Genius</p>
                    {engine && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                        Online
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-400">
                    {engine ? 'Local AI Active' : 'Private AI Assistant'}
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="h-3.5 w-3.5" />
                100% Private
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                <Zap className="h-3.5 w-3.5 text-yellow-500" />
                Local WebLLM
              </span>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6 sm:px-6 relative"
        >
          {!engine ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-inner">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <div className="max-w-sm space-y-2">
                <h2 className="text-xl font-black text-gray-900">Activate Private AI</h2>
                <p className="text-sm font-medium text-gray-500">
                  Phone Genius now runs entirely on your device. No data ever leaves your phone.
                </p>
              </div>

              {isWebGPUSupported === false ? (
                <div className="max-w-md rounded-2xl bg-amber-50 p-6 text-left border border-amber-100 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-amber-600" />
                    <h3 className="text-sm font-black text-amber-900 uppercase tracking-tight">Modern Browser Required</h3>
                  </div>
                  <p className="text-xs font-semibold text-amber-800/80 leading-relaxed">
                    Phone Genius runs locally on your device for absolute privacy. To enable this, your browser must support <strong className="text-amber-900">WebGPU</strong>.
                  </p>
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-amber-700 uppercase">Recommended Browsers:</p>
                    <div className="flex gap-2">
                      <span className="bg-white px-2 py-1 rounded-md text-[10px] font-bold border border-amber-200">Chrome 113+</span>
                      <span className="bg-white px-2 py-1 rounded-md text-[10px] font-bold border border-amber-200">Edge 113+</span>
                      <span className="bg-white px-2 py-1 rounded-md text-[10px] font-bold border border-amber-200">Opera 99+</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                  {isInitializing ? (
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                        <span>Downloading Model</span>
                        <span>{loadingProgress}%</span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]"
                          style={{ width: `${loadingProgress}%` }}
                        />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400">
                        Initial download is ~600MB. It will be cached for future use.
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={initAI}
                      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95"
                    >
                      <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                      Initialize Phone Genius
                    </button>
                  )}
                  {initError && (
                    <p className="text-xs font-bold text-red-500">{initError}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center gap-8 pt-4">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <MessageCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900">Hello! I&apos;m Phone Genius</h2>
                    <p className="mt-2 max-w-sm text-sm font-medium text-gray-500">
                      Ask me anything about mobile devices. I&apos;m running locally on your device for maximum privacy.
                    </p>
                  </div>
                  <div className="w-full max-w-lg">
                    <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                      Suggested questions
                    </p>
                    <div className="flex flex-col gap-2">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-left text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                        >
                          <span>{q}</span>
                          <Send className="ml-3 h-3.5 w-3.5 flex-shrink-0 text-gray-300 transition-colors group-hover:text-primary" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-end gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'chatbot' && (
                        <div className="mb-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <MessageCircle className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                          msg.sender === 'user'
                            ? 'rounded-br-md bg-primary text-white shadow-md shadow-primary/20'
                            : 'rounded-bl-md bg-white text-gray-800 shadow-sm ring-1 ring-black/5'
                        }`}
                      >
                        <FormattedMessage content={msg.content} isUser={msg.sender === 'user'} />
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex items-end gap-2.5">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <MessageCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3.5 shadow-sm ring-1 ring-black/5">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-4 sm:px-6">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={engine ? "Ask about any mobile device..." : "Activate AI to start chatting..."}
              className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
              disabled={loading || !engine}
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || !engine}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95 disabled:opacity-40 disabled:shadow-none"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-2 text-center text-[11px] text-gray-400">
            Local AI is private and secure. Processing happens entirely on your hardware.
          </p>
        </div>

      </div>
    </div>
  );
}
