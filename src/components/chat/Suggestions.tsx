import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const defaultSuggestions = [
  "Run Daily Sync",
  "Summarize latest PR",
  "Schedule post for Twitter",
  "Analyze quarterly metrics",
];

interface SuggestionsProps {
  onSelect: (text: string) => void;
}

export function Suggestions({ onSelect }: SuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {defaultSuggestions.map((text, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i, duration: 0.3 }}
          onClick={() => onSelect(text)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs sm:text-sm font-medium rounded-full hover:bg-slate-50 hover:text-primary-600 hover:border-primary-200 transition-colors shadow-sm"
        >
          {i === 0 && <Zap size={14} className="text-amber-500" />}
          {text}
        </motion.button>
      ))}
    </div>
  );
}
