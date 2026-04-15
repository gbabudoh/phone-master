'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';
import { IChatMessage } from '@/types/chatbot';
import FormattedMessage from '@/components/chatbot/FormattedMessage';

const SUGGESTED_QUESTIONS = [
  'How do I check if a phone is blacklisted?',
  'What is the difference between unlocked and carrier-locked?',
  'How does escrow protection work on Phone Master?',
  'How do I verify an IMEI number?',
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Ref on the scrollable messages container — NOT on a child element.
  // scrollIntoView() scrolls ALL ancestor scrollable containers (including the page),
  // causing the chat to overlap the site nav. scrollTop only scrolls this div.
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
    if (!content || loading) return;

    const userMessage: IChatMessage = {
      sender: 'user',
      content,
      timestamp: new Date(),
    };

    setInput('');
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/support/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const botMessage: IChatMessage = {
        sender: 'chatbot',
        content: data.response || data.error || 'Sorry, I encountered an error.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '';
      const errorMessage: IChatMessage = {
        sender: 'chatbot',
        content: message.includes('Failed to fetch')
          ? 'Network error. Please check your connection and try again.'
          : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      {/*
        Height = viewport minus ~10rem (site header + page padding + disclaimer).
        Max-capped at 700px on large screens.
        This prevents the page itself from scrolling, so scrollTop-based scrolling
        inside the messages div is the only scroll that happens.
      */}
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
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-gray-900">Phone Genius</p>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      Online
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-400">AI-powered device assistant</p>
                </div>
              </div>
            </div>
            <span className="hidden items-center gap-1.5 text-xs font-semibold text-gray-400 sm:flex">
              <Zap className="h-3.5 w-3.5 text-yellow-500" />
              Powered by Gemini AI
            </span>
          </div>
        </div>

        {/* Messages — the only scrollable area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6 sm:px-6"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-8 pt-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-black text-gray-900">Hello! I&apos;m Phone Genius</h2>
                <p className="mt-2 max-w-sm text-sm font-medium text-gray-500">
                  Ask me anything about mobile devices — troubleshooting, compatibility, IMEI checks, buying advice, and more.
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

        {/* Input — always pinned to bottom of the card */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-4 sm:px-6">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any mobile device..."
              className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:opacity-60"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95 disabled:opacity-40 disabled:shadow-none"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-2 text-center text-[11px] text-gray-400">
            Phone Genius can make mistakes. Verify important information independently.
          </p>
        </div>

      </div>
    </div>
  );
}
