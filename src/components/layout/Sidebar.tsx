import { motion } from 'framer-motion';
import { useState } from 'react';
import { HelpCircle, X, Plus, Trash2, MessageSquare } from 'lucide-react';
import clsx from 'clsx';
import type { ChatSession } from '../../App';
import type { User } from '../../types';

interface SidebarProps {
  onClose: () => void;
  onNewChat: () => void;
  onHistorySelect: (id: string) => void;
  onClearHistory: () => void;
  onProfileClick: () => void;
  history: ChatSession[];
  activeSessionId: string;
  user: User | null;
}

export function Sidebar({ 
  onClose, 
  onNewChat, 
  onHistorySelect, 
  onClearHistory, 
  onProfileClick, 
  history, 
  activeSessionId,
  user
}: SidebarProps) {
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="fixed inset-y-0 left-0 w-[280px] bg-slate-50 border-r border-slate-200/60 z-50 flex flex-col shadow-xl sm:shadow-none"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="iCollabHub" className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight text-slate-800">iCollabHub</span>
        </div>
        <button onClick={onClose} className="sm:hidden p-1 hover:bg-slate-200 rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-4">
        <button 
          onClick={onNewChat}
          className="flex items-center gap-2 w-full bg-white border border-slate-200 hover:border-primary-400 hover:shadow-md py-2.5 px-4 rounded-xl text-slate-700 font-medium transition-all group"
        >
          <Plus size={18} className="text-primary-500 group-hover:scale-110 transition-transform" />
          <span>New workflow</span>
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-4 custom-scrollbar">
        <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Recent Chats</span>
        {history.length > 0 ? history.map((session) => (
          <button
            key={session.id}
            onClick={() => onHistorySelect(session.id)}
            className={clsx(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all text-left",
              activeSessionId === session.id 
                ? "bg-primary-50 text-primary-700 font-medium border border-primary-100" 
                : "text-slate-600 hover:bg-slate-100 border border-transparent"
            )}
          >
            <MessageSquare size={16} className={activeSessionId === session.id ? "text-primary-500" : "text-slate-400"} />
            <span className="truncate">{session.title}</span>
          </button>
        )) : (
          <div className="px-3 py-8 text-center bg-slate-100/50 rounded-xl border border-dashed border-slate-200 mx-2">
            <p className="text-xs text-slate-400">No chat history yet</p>
          </div>
        )}
      </div>

      {/* Clear History */}
      <div className="px-4 mb-2">
        {isConfirmingClear ? (
          <div className="bg-red-50 p-2 rounded-xl border border-red-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-[10px] text-red-600 font-semibold mb-2 text-center">Clear all history?</p>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  onClearHistory();
                  setIsConfirmingClear(false);
                }}
                className="flex-1 bg-red-600 text-white text-[10px] py-1.5 rounded-lg hover:bg-red-700 font-bold"
              >
                Yes, Clear
              </button>
              <button 
                onClick={() => setIsConfirmingClear(false)}
                className="flex-1 bg-white border border-slate-200 text-slate-500 text-[10px] py-1.5 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsConfirmingClear(true)} 
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-600 transition-colors py-2 px-2 w-full rounded-lg hover:bg-red-50/50"
          >
            <Trash2 size={14} /> Clear History
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-200/60 mt-auto">
        <button onClick={onProfileClick} className="flex items-center justify-between w-full px-2 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs uppercase">
              {user ? user.name.charAt(0) : 'U'}
            </div>
            <span className="truncate max-w-[140px]">{user ? user.name : 'User Profile'}</span>
          </div>
          <HelpCircle size={16} className="text-slate-400" />
        </button>
      </div>
    </motion.aside>
  );
}
