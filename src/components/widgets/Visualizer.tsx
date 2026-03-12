"use client";

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQueryStore } from '@/store';
import { BarChart3 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function Visualizer() {
  const { activeQueryResult, activeQueryColumns } = useQueryStore();

  const chartData = useMemo(() => {
    if (!activeQueryResult || activeQueryResult.length === 0) return [];
    // Convert BigInts or complex objects to primitives for Recharts
    return activeQueryResult.map(row => {
      const parsed: any = {};
      for (const key in row) {
        if (typeof row[key] === 'bigint') {
          parsed[key] = Number(row[key]);
        } else {
          parsed[key] = row[key];
        }
      }
      return parsed;
    });
  }, [activeQueryResult]);

  // Determine axes intelligently
  const xAxisKey = activeQueryColumns.length > 0 ? activeQueryColumns[0] : '';
  const yAxisKeys = activeQueryColumns.filter(col => {
    if (chartData.length > 0) {
      const val = chartData[0][col];
      return typeof val === 'number' || !isNaN(Number(val));
    }
    return false;
  }).slice(0, 2); // Limit to 2 plots for design reasons

  return (
    <Card className="h-full w-full flex flex-col bg-obsidian border-white/10 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <CardHeader className="widget-header cursor-move bg-black/60 border-b border-primary/20 p-3">
        <CardTitle className="text-sm font-bold text-white/90 uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,126,0,0.8)] flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" /> The Refinery
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 relative pt-8">
        {!chartData.length ? (
          <div className="flex h-full items-center justify-center text-sm text-white/30">
            Awaiting flow metrics...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOxi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7E00" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#FF7E00" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B87333" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#B87333" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey={xAxisKey} stroke="#ffffff40" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff40" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => isNaN(v) ? v : Number(v).toLocaleString()} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#FF7E0040', color: '#fff', borderRadius: '8px' }}
                itemStyle={{ color: '#FF7E00' }}
              />
              {yAxisKeys.map((key, i) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={i === 0 ? "#FF7E00" : "#B87333"} 
                  fillOpacity={1} 
                  fill={i === 0 ? "url(#colorOxi)" : "url(#colorSec)"}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
