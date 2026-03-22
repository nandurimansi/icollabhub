import { motion } from 'framer-motion';
import { useState } from 'react';
import { Bot, CheckCircle2, Copy, ChevronDown, RotateCcw, Trash2, File as FileIcon, Download } from 'lucide-react';
import clsx from 'clsx';
import type { Message } from '../../types';

export function MessageBubble({ message, onRetry, onDelete }: { message: Message, onRetry?: () => void, onDelete?: (id: string) => void }) {
  const isAI = message.role === 'ai';
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMoreActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        "flex gap-4 w-full mb-6 group",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex-shrink-0 flex items-center justify-center shadow-md">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div className={clsx(
        "max-w-[85%] sm:max-w-[75%] px-4 py-3 shadow-sm",
        message.isError 
          ? "bg-red-50 border border-red-200/60 rounded-2xl rounded-tl-sm text-red-800"
          : isAI 
            ? "bg-slate-50 border border-slate-200/60 rounded-2xl rounded-tl-sm text-slate-800" 
            : "bg-primary-600 text-white rounded-2xl rounded-tr-sm"
      )}>
        {/* Author / time info top */}
        {isAI && (
          <div className="flex items-center gap-2 mb-1.5">
            <span className={clsx("text-xs font-semibold", message.isError ? "text-red-700" : "text-slate-600")}>
              iCollabHub AI
            </span>
            <span className="text-[10px] text-slate-400">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <CheckCircle2 size={12} className="text-green-500 ml-auto" />
          </div>
        )}

        {/* Content */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {/* File Attachment */}
        {message.file && (
          <div className="mt-3 flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-slate-200/50 hover:border-primary-100 transition-all group/file cursor-pointer shadow-sm hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 group-hover/file:bg-primary-100 transition-colors">
              <FileIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{message.file.name}</p>
              <p className="text-[10px] text-slate-500">{message.file.size} • {message.file.type.split('/')[1]?.toUpperCase() || 'FILE'}</p>
            </div>
            <Download size={16} className="text-slate-400 group-hover/file:text-primary-600 transition-colors" />
          </div>
        )}

        {/* Actions for AI responses restored */}
        {isAI && !message.isError && (
          <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative">
             <button onClick={handleCopy} className={clsx(
               "flex items-center gap-1.5 text-xs transition-colors px-2 py-1 rounded",
               copied ? "text-green-600 bg-green-50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
             )}>
               {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
               {copied ? 'Copied' : 'Copy'}
             </button>
             
             <div className="relative">
               <button onClick={handleMoreActions} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded hover:bg-slate-200/50">
                 <ChevronDown size={13} /> More
               </button>
               
               {showMenu && (
                 <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 min-w-[120px] animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={() => {
                        handleCopy();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 text-left"
                    >
                      <Copy size={12} /> Copy Text
                    </button>
                    {onDelete && (
                      <button 
                        onClick={() => {
                          onDelete(message.id);
                          setShowMenu(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 text-left"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                 </div>
               )}
             </div>
          </div>
        )}

        {/* Retry logic */}
        {message.isError && onRetry && (
          <div className="mt-3 pt-3 border-t border-red-200/60 flex items-center gap-2 transition-opacity">
            <button onClick={onRetry} className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 transition-colors px-2 py-1 rounded hover:bg-red-100/50 font-medium">
               <RotateCcw size={13} /> Retry
            </button>
          </div>
        )}
      </div>

      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-300 shadow-sm">
          U
        </div>
      )}
    </motion.div>
  );
}
