"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQueryStore } from '@/store';
import { getDuckDB } from '@/lib/duckdb';
import { Play, DatabaseZap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SqlWorkbench() {
  const { currentSql, setCurrentSql, setActiveQueryResult, setActiveQueryColumns } = useQueryStore();
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunQuery = async () => {
    if (!currentSql.trim()) return;
    
    setIsRunning(true);
    setError(null);
    try {
      const db = await getDuckDB();
      const conn = await db.connect();
      
      const result = await conn.query(currentSql);
      const rows = result.toArray().map(row => Object.fromEntries(row));
      
      // Extract column names if result is not empty
      if (rows.length > 0) {
        setActiveQueryColumns(Object.keys(rows[0]));
      } else {
        // Fallback or empty struct
        const fields = result.schema.fields.map((f: any) => f.name);
        setActiveQueryColumns(fields);
      }
      
      setActiveQueryResult(rows);
      await conn.close();
    } catch (err: any) {
      setError(err.message || 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="h-full w-full flex flex-col bg-[#000000] border-none rounded-none shadow-[0_0_20px_rgba(0,0,0,1)] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      <CardHeader className="widget-header cursor-move bg-[#131313]/90 backdrop-blur-sm border-b border-[#262626] p-3 flex-row items-center justify-between space-y-0 z-10 shadow-[0_5px_20px_rgba(0,0,0,0.8)]">
        <CardTitle className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 font-mono">
          <DatabaseZap className="w-4 h-4 text-primary group-hover:animate-pulse shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">SQL Editor</span>
        </CardTitle>
        <Button 
          size="sm" 
          onClick={handleRunQuery}
          disabled={isRunning}
          className="relative overflow-hidden h-7 text-xs bg-primary hover:bg-[#00f1fd] text-[#000000] rounded-none shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.8)] cursor-pointer uppercase tracking-wider font-bold transition-all"
        >
          {isRunning ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Processing
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
              <Play className="w-3 h-3" /> Execute
            </motion.div>
          )}
        </Button>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col relative bg-[#050505]">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col items-center py-4 text-[#555] font-mono text-[10px] select-none pointer-events-none">
           {[...Array(20)].map((_, i) => <div key={i} className="mb-2 opacity-50">{i + 1}</div>)}
        </div>

        <textarea 
          className="flex-1 w-full pl-12 bg-transparent text-[#00f3ff] font-mono p-4 resize-none outline-none border-none focus:ring-0 text-sm leading-relaxed z-10 selection:bg-secondary selection:text-white"
          value={currentSql}
          onChange={(e) => setCurrentSql(e.target.value)}
          spellCheck={false}
          style={{ textShadow: '0 0 5px rgba(0,243,255,0.5)' }}
        />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 p-3 bg-destructive/10 border-t-2 border-destructive text-destructive font-mono text-xs backdrop-blur-md z-20 shadow-[0_-10px_30px_rgba(255,113,108,0.2)]"
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                <span className="w-2 h-2 bg-destructive rounded-none shadow-[0_0_10px_rgba(255,113,108,0.8)] animate-pulse" />
                SYSTEM ERROR
              </div>
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
