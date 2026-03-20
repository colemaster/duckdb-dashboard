"use client";

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQueryStore } from '@/store';
import { BarChart3, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <Card className="h-full w-full flex flex-col bg-[#0e0e0e] border-none rounded-none shadow-none group transition-all duration-300">
      <CardHeader className="widget-header cursor-move bg-[#131313] border-b-0 p-3">
        <CardTitle className="text-sm font-bold text-white uppercase tracking-widest flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
             <BarChart3 className="w-4 h-4 text-primary group-hover:animate-bounce shadow-[0_0_10px_rgba(0,243,255,0.5)] rounded-full" />
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Data Visualizer</span>
          </div>
          <TrendingUp className="w-4 h-4 text-[#adaaaa] group-hover:text-primary transition-colors" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 relative pt-8 bg-gradient-to-b from-[#000000] to-[#0a0a0a]">
        {!chartData.length ? (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1 }}
             className="flex h-full items-center justify-center text-sm text-[#adaaaa] font-mono tracking-widest uppercase"
          >
            Awaiting quantum metrics...
          </motion.div>
        ) : (
          <motion.div
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, type: "spring" }}
             className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOxi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorSec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#bc13fe" stopOpacity={0.05}/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="1 4" stroke="#262626" vertical={false} />
                <XAxis dataKey={xAxisKey} stroke="#adaaaa" fontSize={10} tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis stroke="#adaaaa" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => isNaN(v) ? v : Number(v).toLocaleString()} tickMargin={10} />
                <Tooltip
                  contentStyle={{
                      backgroundColor: 'rgba(19,19,19,0.9)',
                      borderColor: 'rgba(0,243,255,0.3)',
                      color: '#fff',
                      borderRadius: '4px',
                      fontFamily: 'JetBrains Mono',
                      boxShadow: '0 0 20px rgba(0,243,255,0.2)',
                      backdropFilter: 'blur(10px)'
                  }}
                  itemStyle={{ color: '#00f3ff', fontWeight: 'bold' }}
                  cursor={{ stroke: '#bc13fe', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                {yAxisKeys.map((key, i) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={i === 0 ? "#00f3ff" : "#bc13fe"}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={i === 0 ? "url(#colorOxi)" : "url(#colorSec)"}
                    activeDot={{ r: 6, fill: i === 0 ? '#000' : '#000', stroke: i === 0 ? '#00f3ff' : '#bc13fe', strokeWidth: 2, filter: 'url(#glow)' }}
                    filter="url(#glow)"
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
