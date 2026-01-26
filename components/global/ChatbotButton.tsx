'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'chatbot'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/support/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
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
      setMessages((prev) => [
        ...prev,
        { sender: 'chatbot', content: data.response || data.error || 'Sorry, I encountered an error.' },
      ]);
    } catch (error: any) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev,
        { 
          sender: 'chatbot', 
          content: error.message?.includes('Failed to fetch') 
            ? 'Network error. Please check your connection and try again.'
            : 'Sorry, I encountered an error. Please check the server console for details.' 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:scale-110 hover:bg-primary-dark"
          aria-label="Open Phone Genius chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[400px] flex-col rounded-lg border border-accent-grey/20 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-accent-grey/20 bg-primary px-4 py-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary">
                <span className="text-sm font-bold">PG</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Phone Genius</h3>
                <p className="text-xs text-white/80">Your mobile device assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
              aria-label="Close chatbot"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="text-center text-sm text-foreground/60">
                <p className="mb-2 font-semibold">👋 Hello! I'm Phone Genius</p>
                <p>Ask me anything about mobile devices, troubleshooting, or compatibility!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex',
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-4 py-2 text-sm',
                      msg.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-accent-cyan-light text-foreground'
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-accent-cyan-light px-4 py-2 text-sm text-foreground">
                  Thinking...
                </div>
              </div>
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
                className="flex-1 rounded-lg border border-accent-grey/20 px-4 py-2 text-sm focus:border-primary focus:outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

