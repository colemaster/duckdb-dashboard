"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { GuidanceModal } from './GuidanceModal';

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        title="System Guidance"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#0e0e0e] border border-primary/50 text-primary flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] hover:bg-primary/10 transition-colors backdrop-blur-md rounded-none cursor-pointer"
      >
        <HelpCircle className="w-5 h-5" />
      </motion.button>

      <GuidanceModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
