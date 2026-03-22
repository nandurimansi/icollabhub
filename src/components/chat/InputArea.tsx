import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import clsx from 'clsx';

interface InputAreaProps {
  onSend: (text: string) => void;
  onFileSelect?: (file: File) => void;
  disabled: boolean;
}

export function InputArea({ onSend, onFileSelect, disabled }: InputAreaProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
      if (textareaRef.current) {
         textareaRef.current.style.height = 'auto'; // Reset height
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex items-end w-full pl-4 pr-14 py-3 bg-white border border-slate-200 shadow-lg shadow-slate-200/50 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-400">
      {/* Action Buttons Left */}
      <div className="absolute left-3 bottom-0 h-14 flex items-center gap-1 z-10">
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          onChange={(e) => { 
            const file = e.target.files?.[0];
            if (file && onFileSelect) {
              onFileSelect(file);
              e.target.value = ''; // Reset for same file selection
            }
          }} 
        />
        <button 
          type="button"
          onClick={() => document.getElementById('file-upload')?.click()}
          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors hidden sm:flex cursor-pointer"
        >
          <Paperclip size={20} />
        </button>
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Please login to start chatting..." : "Ask or trigger a workflow..."}
        disabled={disabled}
        className="w-full pl-10 sm:pl-14 pr-12 bg-transparent text-slate-800 placeholder-slate-400 outline-none resize-none max-h-32 text-base leading-relaxed overflow-hidden py-1 mb-0.5 relative z-0 disabled:opacity-50"
        rows={1}
      />

      {/* Action Buttons Right */}
      <div className="absolute right-3 bottom-0 h-14 flex items-center gap-1.5 z-10">
        <button 
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim() || disabled}
          className={clsx(
            "p-2 rounded-full transition-all flex items-center justify-center",
            text.trim() && !disabled 
              ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/20 hover:shadow-lg hover:-translate-y-0.5" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          <Send size={18} className="translate-x-[1px]" />
        </button>
      </div>
    </div>
  );
}
