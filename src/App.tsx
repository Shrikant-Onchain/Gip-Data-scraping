/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Loader2, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';
import { VideoUploader } from './components/VideoUploader';
import { ActionTimeline } from './components/ActionTimeline';
import { SummaryView } from './components/SummaryView';
import { analyzeVideo, VideoAnalysis } from './services/gemini';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VideoAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Uploading video to Gemini...",
    "Scanning frames for movement...",
    "Identifying key actions...",
    "Scripting the sequence...",
    "Synthesizing the summary...",
    "Finalizing the report..."
  ];

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);

    // Message rotation interval
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % loadingMessages.length);
    }, 3000);

    try {
      const analysis = await analyzeVideo(file);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header */}
      <header className="border-b border-[#141414] px-6 py-4 flex items-center justify-between sticky top-0 bg-[#E4E3E0] z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#141414] rounded flex items-center justify-center text-[#E4E3E0]">
            <Play size={18} fill="currentColor" />
          </div>
          <h1 className="font-serif italic text-xl tracking-tight">Video Action Scripter</h1>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest opacity-50">
          <span>v1.0.0</span>
          <div className="w-1 h-1 bg-[#141414] rounded-full" />
          <span>Gemini 3.1 Pro</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          {/* Left Column: Input & Results */}
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-xs opacity-40">01</span>
                <h2 className="font-serif italic text-2xl">Source Material</h2>
              </div>
              
              <div className="space-y-6">
                <VideoUploader 
                  onFileSelect={setFile} 
                  selectedFile={file} 
                  onClear={() => {
                    setFile(null);
                    setResult(null);
                    setError(null);
                  }}
                  disabled={isAnalyzing}
                />

                {file && !result && !isAnalyzing && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleAnalyze}
                    className="w-full bg-[#141414] text-[#E4E3E0] py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <Sparkles size={18} />
                    Analyze {file.type.includes('gif') ? 'GIF' : 'Video'}
                  </motion.button>
                )}
              </div>
            </section>

            <AnimatePresence mode="wait">
              {isAnalyzing && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 gap-6 text-center"
                >
                  <Loader2 size={48} className="animate-spin opacity-20" />
                  <div className="space-y-2">
                    <p className="text-xl font-serif italic">{loadingMessages[loadingStep]}</p>
                    <p className="text-xs font-mono opacity-40 uppercase tracking-widest">Processing via Gemini AI</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 flex gap-4"
                >
                  <AlertCircle className="shrink-0" />
                  <div>
                    <p className="font-medium">Analysis Failed</p>
                    <p className="text-sm opacity-80 mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-mono text-xs opacity-40">02</span>
                      <h2 className="font-serif italic text-2xl">Analysis Report</h2>
                    </div>
                    <SummaryView summary={result.summary} />
                  </section>

                  <section className="lg:hidden">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-mono text-xs opacity-40">03</span>
                      <h2 className="font-serif italic text-2xl">Action Script</h2>
                    </div>
                    <ActionTimeline actions={result.actions} />
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Sidebar Timeline (Desktop) */}
          <div className="hidden lg:block border-l border-[#141414]/10 pl-12">
            <div className="sticky top-28">
              {result ? (
                <ActionTimeline actions={result.actions} />
              ) : (
                <div className="space-y-6 opacity-20 select-none pointer-events-none">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif italic text-xs uppercase tracking-widest">Action Script</h3>
                  </div>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="grid grid-cols-[60px_1fr] gap-4 py-4 border-b border-[#141414]">
                      <div className="h-4 bg-[#141414] rounded w-full" />
                      <div className="space-y-2">
                        <div className="h-4 bg-[#141414] rounded w-full" />
                        <div className="h-4 bg-[#141414] rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#141414] p-6 mt-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-widest opacity-40">
          <p>© 2026 Video Action Scripter. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:opacity-100 transition-opacity">Documentation</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">API Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

