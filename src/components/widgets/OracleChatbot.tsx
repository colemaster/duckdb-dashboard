"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useChatStore, useQueryStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Database, Terminal, Sparkles } from 'lucide-react';

export function OracleChatbot() {
  const { messages, addMessage, isThinking, setIsThinking } = useChatStore();
  const setCurrentSql = useQueryStore((state) => state.setCurrentSql);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userPrompt = input.trim();
    setInput('');
    addMessage({ role: 'user', content: userPrompt });
    setIsThinking(true);

    // Simulate Agent API call to translate text to SQL
    setTimeout(() => {
      let generatedSql = '';
      let reply = '';
      
      if (userPrompt.toLowerCase().includes('parquet')) {
        generatedSql = "SELECT count(*) FROM 'https://shell.duckdb.org/data/tpch/0_01/parquet/orders.parquet';";
        reply = "Executing an extremely fast scan over the remote Parquet file...";
      } else if (userPrompt.toLowerCase().includes('telemetry') || userPrompt.toLowerCase().includes('cost')) {
        generatedSql = "SELECT region, sum(revenue) as total_revenue, sum(cost) as total_cost FROM telemetry GROUP BY region ORDER BY total_revenue DESC LIMIT 5;";
        reply = "I've aggregated the telemetry data to show total revenue and cost by region.";
      } else if (userPrompt.toLowerCase().includes('log') || userPrompt.toLowerCase().includes('error')) {
        generatedSql = "SELECT * FROM server_logs WHERE level = 'ERROR' OR level = 'WARN' ORDER BY timestamp DESC;";
        reply = "Here are the recent warning and error logs from the server cluster.";
      } else {
        generatedSql = "SELECT * FROM telemetry LIMIT 10;";
        reply = "I've pulled a general sample of the telemetry stream for your review.";
      }

      addMessage({ role: 'assistant', content: reply, sql: generatedSql });
      
      // Send the query to the Workbench
      setCurrentSql(generatedSql);
      
      setIsThinking(false);
    }, 2000);
  };

  return (
    <Card className="h-full w-full flex flex-col bg-[#0e0e0e] rounded-none border-none overflow-hidden shadow-none transition-all duration-300">
      <CardHeader className="widget-header cursor-move bg-[#131313] border-b-0 p-3">
        <CardTitle className="text-sm font-bold text-white uppercase tracking-widest flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-none ${isThinking ? 'bg-secondary shadow-[0_0_15px_rgba(188,19,254,1)] animate-pulse' : 'bg-secondary/50'}`} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">Oracle AI</span>
          </div>
          <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0a0a0a] to-[#000000]" ref={scrollRef}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.3, type: "spring" }}
                className={`flex flex-col max-w-[90%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div className={`p-3 text-sm font-sans rounded-none border-l-2 ${msg.role === 'user' ? 'bg-[#1a1a1a] text-white border-primary shadow-[0_0_10px_rgba(0,243,255,0.1)]' : 'bg-[#131313] border-secondary text-[#e0e0e0] shadow-[0_0_10px_rgba(188,19,254,0.1)]'}`}>
                  {msg.content}
                </div>
                {msg.sql && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-2 p-3 bg-[#050505] border-l-2 border-primary w-full font-mono text-xs text-primary flex flex-col gap-1 relative overflow-hidden group hover:border-l-4 transition-all"
                  >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-2 text-white/50 mb-1 border-b border-[#262626] pb-1 z-10">
                      <Database className="w-3 h-3 text-primary animate-pulse" /> <span className="uppercase text-[10px] tracking-widest text-primary/80">Generated Query</span>
                    </div>
                    <span className="z-10 text-primary drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">{msg.sql}</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
            {isThinking && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-3 text-secondary text-sm p-3 bg-[#131313] border-l-2 border-secondary w-fit font-mono uppercase text-xs shadow-[0_0_15px_rgba(188,19,254,0.2)]"
              >
                <div className="flex gap-1.5">
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-secondary shadow-[0_0_5px_#bc13fe] rounded-none" />
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-secondary shadow-[0_0_5px_#bc13fe] rounded-none" />
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-secondary shadow-[0_0_5px_#bc13fe] rounded-none" />
                </div>
                <span className="tracking-widest animate-pulse">Synthesizing...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-3 bg-[#0a0a0a] border-t border-[#262626] relative z-20">
          <form onSubmit={handleSubmit} className="flex gap-2 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-primary opacity-20 group-focus-within:opacity-50 blur transition duration-500"></div>
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Command the Oracle..."
              className="relative bg-[#000000] border border-[#262626] rounded-none focus-visible:ring-0 focus-visible:border-secondary text-white placeholder:text-[#555] font-mono tracking-wide"
              disabled={isThinking}
            />
            <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isThinking} 
                className="relative bg-secondary hover:bg-[#d03bff] text-white rounded-none border-none transition-all shadow-[0_0_10px_rgba(188,19,254,0.5)] hover:shadow-[0_0_20px_rgba(188,19,254,0.8)]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
