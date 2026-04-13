import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Copy, Check } from 'lucide-react';

interface SummaryViewProps {
  summary: string;
}

export function SummaryView({ summary }: SummaryViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#141414] text-[#E4E3E0] p-8 rounded-2xl relative group"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E4E3E0]/10 rounded-lg">
            <FileText size={20} />
          </div>
          <h3 className="font-serif italic text-lg">Executive Summary</h3>
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E4E3E0]/10 hover:bg-[#E4E3E0]/20 transition-all text-xs font-mono uppercase tracking-widest"
          title="Copy to clipboard"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-2 text-green-400"
              >
                <Check size={14} />
                <span>Copied</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Copy size={14} />
                <span>Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
      
      <p className="text-lg leading-relaxed font-light opacity-90">
        {summary}
      </p>
    </motion.div>
  );
}
