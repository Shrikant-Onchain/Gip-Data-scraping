import React from 'react';
import { motion } from 'motion/react';
import { Clock, AlertCircle } from 'lucide-react';
import { Action } from '../services/gemini';
import { cn } from '../lib/utils';

interface ActionTimelineProps {
  actions: Action[];
}

export function ActionTimeline({ actions }: ActionTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif italic text-xs uppercase tracking-widest opacity-50">Action Script</h3>
        <span className="text-[10px] font-mono opacity-40">{actions.length} events detected</span>
      </div>
      
      <div className="space-y-2">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group grid grid-cols-[80px_1fr] gap-4 p-4 border-b border-[#141414]/10 hover:bg-[#141414] hover:text-[#E4E3E0] transition-all cursor-default"
          >
            <div className="flex items-center gap-2 font-mono text-xs">
              <Clock size={12} className="opacity-50" />
              <span>{action.timestamp}</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm leading-relaxed">{action.description}</p>
              <div className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter",
                action.importance === 'high' ? "bg-red-500/10 text-red-600 group-hover:bg-red-500 group-hover:text-white" :
                action.importance === 'medium' ? "bg-orange-500/10 text-orange-600 group-hover:bg-orange-500 group-hover:text-white" :
                "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white"
              )}>
                {action.importance}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
