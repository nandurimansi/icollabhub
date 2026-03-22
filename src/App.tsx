import { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { ChatArea } from './components/chat/ChatArea';
import { AuthModal } from './components/auth/AuthModal';
import type { Message, User } from './types';
import { AnimatePresence } from 'framer-motion';

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('icollabhub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Initialize sessions from localStorage
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('icollabhub_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse chats", e);
      }
    }
    return [{ id: 'default', title: 'New Chat', messages: [
      {
        id: '1',
        role: 'ai',
        content: 'Hello! I am your iCollabHub AI assistant powered by n8n. How can I help you automate your workflows today?',
        timestamp: new Date().toISOString(),
      } as Message
    ] }];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || 'default');

  // Persist to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('icollabhub_chats', JSON.stringify(sessions));
  }, [sessions]);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('icollabhub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('icollabhub_user');
    }
  }, [user]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  const handleUpdateMessages = (updater: (prev: Message[]) => Message[]) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const newMessages = updater(s.messages);
        // Auto-generate title from first user message
        const firstUserMsg = newMessages.find(m => m.role === 'user');
        const title = firstUserMsg ? firstUserMsg.content.slice(0, 30) + '...' : s.title;
        return { ...s, messages: newMessages, title };
      }
      return s;
    }));
  };

  const handleNewChat = () => {
    const newSession = { id: Date.now().toString(), title: 'New Chat', messages: [] };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleClearHistory = () => {
    const defaultSession = { 
      id: 'default', 
      title: 'New Chat', 
      messages: [
        {
          id: '1',
          role: 'ai',
          content: 'Hello! I am your iCollabHub AI assistant powered by n8n. How can I help you automate your workflows today?',
          timestamp: Date.now(),
        } as Message
      ] 
    };
    setSessions([defaultSession]);
    setActiveSessionId('default');
    localStorage.removeItem('icollabhub_chats');
  };

  const handleLoginRequest = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleDeleteMessage = (messageId: string) => {
    handleUpdateMessages(prev => prev.filter(m => m.id !== messageId));
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <Sidebar 
            onClose={() => setIsSidebarOpen(false)} 
            onNewChat={handleNewChat}
            onHistorySelect={(id) => setActiveSessionId(id)}
            onClearHistory={handleClearHistory}
            onProfileClick={() => alert('Profile settings clicked')}
            history={sessions}
            activeSessionId={activeSessionId}
            user={user}
          />
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full bg-white relative shadow-2xl z-10 sm:rounded-tl-2xl sm:rounded-bl-2xl overflow-hidden transition-all duration-300 border border-slate-200/60">
        <ChatArea 
          key={activeSessionId}
          messages={activeSession.messages}
          onUpdateMessages={handleUpdateMessages}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
          user={user}
          onLoginRequest={handleLoginRequest}
          onLogout={handleLogout}
          onDeleteMessage={handleDeleteMessage}
        />
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={setUser}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default App;
