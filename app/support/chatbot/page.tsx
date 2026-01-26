'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { IChatMessage } from '@/types/chatbot';
import FormattedMessage from '@/components/chatbot/FormattedMessage';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: IChatMessage = {
      sender: 'user',
      content: input.trim(),
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
        console.error('Chatbot API error:', {
          status: response.status,
          error: errorData,
        });
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
      console.error('Chatbot error:', error);
      const message = error instanceof Error ? error.message : '';
      const errorMessage: IChatMessage = {
        sender: 'chatbot',
        content: message.includes('Failed to fetch') 
          ? 'Network error. Please check your connection and try again.'
          : 'Sorry, I encountered an error. Please check the server console for details.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-cyan-light">
          <MessageCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Phone Genius</h1>
        <p className="mt-4 text-lg text-foreground/60">
          Your AI-powered mobile device assistant
        </p>
      </div>

      <div className="flex h-[600px] flex-col rounded-lg border border-accent-grey/20 bg-white shadow-lg">
        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6 scroll-smooth">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <MessageCircle className="mx-auto mb-4 h-12 w-12 text-accent-grey" />
                <p className="text-lg font-semibold text-foreground">Hello! I&apos;m Phone Genius</p>
                <p className="mt-2 text-foreground/60">
                  Ask me anything about mobile devices, troubleshooting, or compatibility!
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-3 ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-accent-cyan-light text-foreground shadow-sm'
                    }`}
                  >
                    <FormattedMessage content={msg.content} isUser={msg.sender === 'user'} />
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-accent-cyan-light px-4 py-3 text-foreground shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-accent-grey/20 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-lg border border-accent-grey/20 px-4 py-2 focus:border-primary focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-primary px-6 py-2 text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

