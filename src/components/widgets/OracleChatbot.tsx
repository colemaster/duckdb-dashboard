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
    <Card className="h-full w-full flex flex-col bg-[#0e0e0e] rounded-none border-none overflow-hidden shadow-none">
      <CardHeader className="widget-header cursor-move bg-[#131313] border-b-0 p-3">
        <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-none ${isThinking ? 'bg-secondary animate-pulse shadow-[0_0_8px_rgba(188,19,254,0.8)]' : 'bg-secondary/50'}`} />
            Oracle AI
          </div>
          <Terminal className="w-4 h-4 text-secondary/70" />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]" ref={scrollRef}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col max-w-[90%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div className={`p-3 text-sm font-sans rounded-none border-b-2 ${msg.role === 'user' ? 'bg-[#131313] text-white border-primary' : 'bg-[#131313] border-secondary text-[#adaaaa]'}`}>
                  {msg.content}
                </div>
                {msg.sql && (
                  <div className="mt-2 p-3 bg-[#000000] border-l-2 border-primary w-full font-mono text-xs text-primary flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white/50 mb-1 border-b border-[#262626] pb-1">
                      <Database className="w-3 h-3 text-primary" /> <span className="uppercase text-[10px]">Generated Query</span>
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
                className="flex items-center gap-2 text-secondary text-sm p-3 bg-[#131313] border-b-2 border-secondary w-fit font-mono uppercase text-xs"
              >
                <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-secondary animate-bounce rounded-none" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-secondary animate-bounce rounded-none" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-secondary animate-bounce rounded-none" style={{ animationDelay: '300ms' }} />
                </div>
                Processing...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-3 bg-[#131313] relative z-20">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query the Oracle..."
              className="bg-[#000000] border-b border-x-0 border-t-0 border-[#262626] rounded-none focus-visible:ring-0 focus-visible:border-primary text-white placeholder:text-[#adaaaa] font-sans"
              disabled={isThinking}
            />
            <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isThinking} 
                className="bg-secondary hover:bg-secondary/80 text-white rounded-none border-none transition-all"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
