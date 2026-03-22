import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { InputArea } from './InputArea';
import { Suggestions } from './Suggestions';
import type { User, Message } from '../../types';

interface ChatAreaProps {
  messages: Message[];
  onUpdateMessages: (updater: (prev: Message[]) => Message[]) => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  user: User | null;
  onLoginRequest: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  onDeleteMessage?: (id: string) => void;
}



export function ChatArea({
  messages,
  onUpdateMessages,
  onToggleSidebar,
  isSidebarOpen,
  user,
  onLoginRequest,
  onLogout,
  onDeleteMessage
}: ChatAreaProps) {
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    onUpdateMessages(prev => [...prev, userMessage]);

    setIsTyping(true);
    try {
      const response = await fetch('https://amulya01.app.n8n.cloud/webhook/tender-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, source: 'icollabhub' }),
      });
      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: typeof data === 'string' ? data : data.output || data.message || "I've processed your request.",
        timestamp: Date.now(),
      };
      onUpdateMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Error in workflow",
        timestamp: Date.now(),
        isError: true,
      };
      onUpdateMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileSelect = (file: File) => {
    const formattedSize = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Attached file: ${file.name}`,
      timestamp: Date.now(),
      file: {
        name: file.name,
        size: formattedSize,
        type: file.type
      }
    };

    onUpdateMessages(prev => [...prev, userMessage]);

    setIsTyping(true);
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `I've received your file: **${file.name}** (${formattedSize}). I can help you analyze this document or use it in a workflow. What would you like to do?`,
        timestamp: Date.now(),
      };
      onUpdateMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleRetry = (errorIdx: number) => {
    const lastUserMsg = [...messages].slice(0, errorIdx).reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      // remove the error message
      onUpdateMessages(prev => prev.filter((_, i) => i !== errorIdx));
      handleSend(lastUserMsg.content);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-100 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu size={20} />
            </button>
          )}
          <div className="flex items-center">
            <img
              src="/icollabhub/logo.png"
              alt="iCollabHub Logo"
              className="h-8 w-8 object-contain mr-2"
            />
            <h2 className="font-semibold text-slate-800 tracking-tight">Active Session</h2>
          </div>
        </div>

        {/* Auth Buttons / User Profile */}
        <div className="flex items-center gap-3">
          {!user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onLoginRequest('login')}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => onLoginRequest('signup')}
                className="text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white px-4 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 rounded-full pl-1 pr-3 py-1 shadow-sm">
              <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block truncate max-w-[100px]">{user.name}</span>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 sm:p-6 pb-32">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onRetry={msg.isError ? () => handleRetry(idx) : undefined}
            onDelete={onDeleteMessage}
          />
        ))}
        {isTyping && (
          <div className="mb-6 flex gap-3 items-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex-shrink-0 flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className="flex space-x-1 bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-200/50">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-4 pointer-events-none">
        <div className="max-w-3xl mx-auto w-full relative pointer-events-auto">
          <div className="mb-2">
            {messages.length <= 1 && !isTyping && user && (
              <Suggestions onSelect={handleSend} />
            )}
          </div>
          <InputArea
            onSend={handleSend}
            onFileSelect={handleFileSelect}
            disabled={!user}
          />
        </div>
      </div>
    </div>
  );
}
