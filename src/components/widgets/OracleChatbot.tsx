"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useChatStore, useQueryStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Database, Terminal } from 'lucide-react';

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
      
      if (userPrompt.toLowerCase().includes('telemetry') || userPrompt.toLowerCase().includes('cost')) {
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
    }, 1500);
  };

  return (
    <Card className="h-full w-full flex flex-col bg-obsidian border-white/10 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
      <CardHeader className="widget-header cursor-move bg-black/60 border-b border-primary/20 p-3">
        <CardTitle className="text-sm font-bold text-white/90 uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,126,0,0.8)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-primary animate-pulse shadow-[0_0_8px_#FF7E00]' : 'bg-primary/50'}`} />
            The Oracle
          </div>
          <Terminal className="w-4 h-4 text-primary/70" />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col max-w-[90%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-primary/20 text-white border border-primary/30' : 'bg-white/5 border border-white/10 text-slate-300'}`}>
                  {msg.content}
                </div>
                {msg.sql && (
                  <div className="mt-2 p-3 bg-black/80 rounded border border-primary/40 w-full font-mono text-xs text-primary/90 flex flex-col gap-1 shadow-inner">
                    <div className="flex items-center gap-2 text-white/50 mb-1 border-b border-white/10 pb-1">
                      <Database className="w-3 h-3" /> <span className="uppercase text-[10px]">Generated Query</span>
                    </div>
                    <span>{msg.sql}</span>
                  </div>
                )}
              </motion.div>
            ))}
            {isThinking && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-primary text-sm p-3 bg-white/5 rounded-lg border border-primary/30 w-fit"
              >
                <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                Processing syntax...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-3 border-t border-white/10 bg-black/40 backdrop-blur-sm relative z-20">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the Oracle..." 
              className="bg-black/50 border-primary/30 text-white placeholder:text-white/40 focus-visible:ring-primary shadow-inner"
              disabled={isThinking}
            />
            <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isThinking} 
                className="bg-primary hover:bg-primary/80 text-white shadow-[0_0_10px_rgba(255,126,0,0.5)] transition-all"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
