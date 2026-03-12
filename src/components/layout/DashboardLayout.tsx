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
    <div className="relative min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A0A0A] via-[#050505] to-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 h-14 border-b border-white/5 bg-black/40 backdrop-blur-md z-50 flex items-center px-6">
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isReady ? 'bg-primary' : 'bg-red-500'} animate-pulse shadow-[0_0_10px_rgba(255,126,0,0.8)]`} />
            <h1 className="font-bold text-lg text-white/90 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(255,126,0,0.5)]">Data Refinery</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-14 relative min-h-screen">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(255,126,0,0.5)]" />
              <h1 className="text-xl font-bold tracking-[0.2em] text-primary uppercase drop-shadow-[0_0_10px_rgba(255,126,0,0.8)]">Warming up the drill...</h1>
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
  );
}
