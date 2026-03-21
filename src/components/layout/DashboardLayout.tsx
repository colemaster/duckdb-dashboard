"use client";

import React, { useEffect, useState } from 'react';
import { getDuckDB } from '@/lib/duckdb';
import { useQueryStore } from '@/store';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const GridCanvas = dynamic(() => import('./GridCanvas').then(mod => mod.GridCanvas), { ssr: false });

export function DashboardLayout() {
  const setReady = useQueryStore((state) => state.setReady);
  const isReady = useQueryStore((state) => state.isReady);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDB = async () => {
      try {
        await getDuckDB();
        setReady(true);
      } catch (err) {
        console.error("DuckDB init error", err);
      } finally {
        setLoading(false);
      }
    };
    initDB();
  }, [setReady]);

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      {/* Sidebar Layout */}
      <div className="flex flex-1 min-h-screen">
        {/* Sidebar Nav */}
        <aside className="w-16 bg-[#0a0a0a] border-r border-[#262626] flex flex-col items-center py-4 gap-6 z-50">
           <div className="w-8 h-8 bg-primary/20 border border-primary text-primary flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(0,243,255,0.3)]">QW</div>
           <nav className="flex flex-col gap-4 mt-8 text-[#adaaaa]">
              <div className="w-10 h-10 flex items-center justify-center hover:bg-[#131313] hover:text-primary cursor-pointer border-l-2 border-transparent hover:border-primary transition-all">S</div>
              <div className="w-10 h-10 flex items-center justify-center hover:bg-[#131313] hover:text-secondary cursor-pointer border-l-2 border-transparent hover:border-secondary transition-all">O</div>
              <div className="w-10 h-10 flex items-center justify-center hover:bg-[#131313] hover:text-primary cursor-pointer border-l-2 border-transparent hover:border-primary transition-all">V</div>
           </nav>
        </aside>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col relative">
          {/* Header */}
          <header className="h-14 border-b border-[#262626] bg-[#000000] flex items-center justify-between px-6 z-40">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-none ${isReady ? 'bg-primary' : 'bg-destructive'} animate-pulse shadow-[0_0_10px_rgba(0,243,255,0.8)]`} />
                <h1 className="font-bold text-sm text-white/90 uppercase tracking-widest font-mono">Quantum Workbench</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#adaaaa] font-mono">DB: local-wasm</span>
              <button className="bg-gradient-to-br from-primary to-[#00f1fd] text-[#005f64] px-4 py-1 text-xs font-bold uppercase tracking-wider hover:brightness-125 transition-all">Run Query</button>
            </div>
          </header>

          {/* Canvas Area */}
          <main className="flex-1 relative bg-[#0e0e0e]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                >
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary animate-spin mb-4 shadow-[0_0_15px_rgba(0,243,255,0.5)]" />
                  <h1 className="text-xl font-bold tracking-[0.2em] text-primary uppercase shadow-primary">Initializing Quantum Core...</h1>
                </motion.div>
              ) : (
                <motion.div
                  key="canvas"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="h-full"
                >
                  <GridCanvas />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
