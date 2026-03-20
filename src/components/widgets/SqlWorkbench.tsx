"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQueryStore } from '@/store';
import { getDuckDB } from '@/lib/duckdb';
import { Play, DatabaseZap } from 'lucide-react';

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
    <Card className="h-full w-full flex flex-col bg-[#000000] border-none rounded-none shadow-none">
      <CardHeader className="widget-header cursor-move bg-[#131313] border-b-0 p-3 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
          <DatabaseZap className="w-4 h-4 text-primary" /> SQL Editor
        </CardTitle>
        <Button 
          size="sm" 
          onClick={handleRunQuery}
          disabled={isRunning}
          className="h-7 text-xs bg-primary hover:bg-primary/80 text-[#000000] rounded-none shadow-none cursor-pointer uppercase tracking-wider font-bold"
        >
          {isRunning ? 'Extracting...' : ( <><Play className="w-3 h-3 mr-1" /> Execute</> )}
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col relative">
        <textarea 
          className="flex-1 w-full bg-[#0e0e0e] text-[#adaaaa] font-mono p-4 resize-none outline-none border-none focus:ring-0 text-sm leading-relaxed"
          value={currentSql}
          onChange={(e) => setCurrentSql(e.target.value)}
          spellCheck={false}
        />
        {error && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-destructive/20 border-t border-destructive/50 text-destructive text-xs backdrop-blur-md">
            [ERROR] {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
