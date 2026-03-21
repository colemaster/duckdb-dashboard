"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, MessageSquare, Database, LayoutTemplate } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function GuidanceModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-[#000000]/80 backdrop-blur-sm"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-2xl bg-[#0e0e0e] border border-[#262626] shadow-[0_0_30px_rgba(0,243,255,0.15)] rounded-none overflow-hidden"
          >
            <div className="bg-[#131313] p-4 flex items-center justify-between border-b border-[#262626]">
              <h2 className="text-primary font-heading uppercase font-bold tracking-widest text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" /> System Guidance Matrix
              </h2>
              <button onClick={onClose} className="text-[#adaaaa] hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-[#adaaaa] font-sans text-sm h-[60vh] overflow-y-auto">
              <div>
                <h3 className="text-white font-heading uppercase text-xs tracking-wider mb-2">Welcome to Quantum Workbench</h3>
                <p>This is a state-of-the-art data interaction interface. Designed for high-velocity data analysis utilizing a local DuckDB-Wasm engine.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#000000] border border-[#262626] p-4 relative group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2 text-white mb-2 font-heading uppercase text-xs">
                    <Database className="w-4 h-4 text-[#bc13fe]" /> Local SQL Engine
                  </div>
                  <p className="text-xs">Execute SQL directly in your browser. Start by querying `telemetry` or `server_logs` in the SQL Editor.</p>
                </div>

                <div className="bg-[#000000] border border-[#262626] p-4 relative group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2 text-white mb-2 font-heading uppercase text-xs">
                    <MessageSquare className="w-4 h-4 text-[#00f3ff]" /> Oracle AI
                  </div>
                  <p className="text-xs">Ask natural language questions like "Show me error logs". The AI will generate and run the SQL automatically.</p>
                </div>
                
                <div className="bg-[#000000] border border-[#262626] p-4 relative group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2 text-white mb-2 font-heading uppercase text-xs">
                    <LayoutTemplate className="w-4 h-4 text-[#bc13fe]" /> Kinetic Monolith
                  </div>
                  <p className="text-xs">Drag and resize internal windows dynamically. The interface adapts to a seamless, light-emitting aesthetic.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-[#131313] border-t border-[#262626] flex justify-end">
              <button 
                onClick={onClose}
                className="bg-gradient-to-br from-primary to-[#00f1fd] text-[#005f64] font-bold font-heading uppercase tracking-wider text-xs px-6 py-2 hover:brightness-125 transition-all cursor-pointer"
              >
                Acknowledge
              </button>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
