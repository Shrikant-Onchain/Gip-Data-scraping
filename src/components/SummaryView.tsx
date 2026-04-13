import React from 'react';
import { motion } from 'motion/react';
import { FileText } from 'lucide-react';

interface SummaryViewProps {
  summary: string;
}

export function SummaryView({ summary }: SummaryViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#141414] text-[#E4E3E0] p-8 rounded-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#E4E3E0]/10 rounded-lg">
          <FileText size={20} />
        </div>
        <h3 className="font-serif italic text-lg">Executive Summary</h3>
      </div>
      <p className="text-lg leading-relaxed font-light opacity-90">
        {summary}
      </p>
    </motion.div>
  );
}
