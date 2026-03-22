import { motion } from 'framer-motion';
import { X, Activity, Database, Server, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface RightPanelProps {
  onClose: () => void;
}

const logs = [
  { time: "14:02:11", type: "info", msg: "Workflow triggered via API" },
  { time: "14:02:12", type: "success", msg: "Data mapped successfully" },
  { time: "14:02:12", type: "info", msg: "External API call complete" },
];

export function RightPanel({ onClose }: RightPanelProps) {
  return (
    <motion.aside
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="hidden lg:flex w-80 h-full flex-col bg-slate-50 border-l border-slate-200/50 relative z-0"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200/50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-slate-800">
          <Activity size={16} className="text-accent-500" />
          <span className="font-semibold text-sm">n8n Execution Details</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Visual Workflow Preview (Simulated) */}
      <div className="p-4 border-b border-slate-200/50 bg-slate-100/50">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Pipeline</h3>
        <div className="flex flex-col gap-2 relative">
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200 z-0"></div>
          
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-green-100 border border-green-200 flex items-center justify-center shadow-sm">
              <Activity size={14} className="text-green-600" />
            </div>
            <div className="flex-1 bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm">
              <p className="text-xs font-medium text-slate-800">Webhook Trigger</p>
              <p className="text-[10px] text-slate-500">POST /api/chat</p>
            </div>
          </div>

          <div className="flex items-start gap-3 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center shadow-sm">
              <Database size={14} className="text-blue-600" />
            </div>
            <div className="flex-1 bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm">
              <p className="text-xs font-medium text-slate-800">Data Processor</p>
              <p className="text-[10px] text-slate-500">Transform JSON</p>
            </div>
          </div>

          <div className="flex items-start gap-3 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-accent-100 border border-accent-200 flex items-center justify-center shadow-sm">
              <Server size={14} className="text-accent-600" />
            </div>
            <div className="flex-1 bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm group cursor-pointer hover:border-accent-300 transition-colors">
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-slate-800">OpenAI Node</p>
                <ChevronRight size={12} className="text-slate-400 group-hover:text-accent-500" />
              </div>
              <p className="text-[10px] text-slate-500">Generate response</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Execution Logs</h3>
        <div className="space-y-3 font-mono text-[10px]">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-slate-400">{log.time}</span>
              <span className={clsx(
                "flex-1",
                log.type === 'success' ? 'text-green-600' : 'text-slate-600'
              )}>
                {log.msg}
              </span>
            </div>
          ))}
          <div className="flex gap-2 animate-pulse">
            <span className="text-slate-400">14:02:13</span>
            <span className="flex-1 text-slate-500">Awaiting user input...</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
// Trigger TS Server update
