'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, ArrowLeft, Search, Circle, User } from 'lucide-react';

interface OtherUser {
  id: string;
  name: string;
  avatar?: string | null;
}

interface Conversation {
  id: string;
  otherUser: OtherUser;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
    // Get current user ID
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setCurrentUserId(data.user?.id))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setOtherUser(data.conversation?.otherUser || null);
        // Update unread count in conversations list
        setConversations(prev => prev.map(c => 
          c.id === conversationId ? { ...c, unreadCount: 0 } : c
        ));
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !otherUser) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: otherUser.id,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: data.message.id,
          content: data.message.content,
          senderId: data.message.senderId,
          createdAt: data.message.createdAt,
          isRead: false
        }]);
        setNewMessage('');
        // Update conversation list
        setConversations(prev => prev.map(c => 
          c.id === selectedConversation 
            ? { ...c, lastMessage: newMessage.trim().substring(0, 100), lastMessageAt: new Date().toISOString() }
            : c
        ));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-GB', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const filteredConversations = conversations.filter(c =>
    c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="h-[calc(100vh-200px)] min-h-[500px] flex rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Conversations List */}
      <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Messages</h2>
            {totalUnread > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                {totalUnread}
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <MessageCircle className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No messages yet</p>
              <p className="text-gray-400 text-sm mt-1">Start a conversation from a product listing</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 ${
                  selectedConversation === conv.id ? 'bg-primary/5' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold truncate ${conv.unreadCount > 0 ? 'text-foreground' : 'text-gray-700'}`}>
                      {conv.otherUser.name}
                    </h3>
                    {conv.lastMessageAt && (
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {formatTime(conv.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                      {conv.lastMessage}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
        {selectedConversation && otherUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{otherUser.name}</h3>
                <p className="text-xs text-gray-500">Click to view profile</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => {
                const isOwn = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${isOwn ? 'order-2' : ''}`}>
                      <div className={`px-4 py-2 rounded-2xl ${
                        isOwn 
                          ? 'bg-primary text-white rounded-br-md' 
                          : 'bg-white text-foreground rounded-bl-md shadow-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <p className={`text-xs text-gray-400 mt-1 ${isOwn ? 'text-right' : ''}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="p-3 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">Your Messages</h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              Select a conversation to view messages or start a new one from a product listing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
