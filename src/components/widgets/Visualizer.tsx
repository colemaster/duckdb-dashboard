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
    <Card className="h-full w-full flex flex-col bg-[#0e0e0e] border-none rounded-none shadow-none">
      <CardHeader className="widget-header cursor-move bg-[#131313] border-b-0 p-3">
        <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
          <BarChart3 className="w-4 h-4 text-primary" /> Data Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 relative pt-8 bg-[#000000]">
        {!chartData.length ? (
          <div className="flex h-full items-center justify-center text-sm text-[#adaaaa] font-mono">
            Awaiting flow metrics...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOxi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey={xAxisKey} stroke="#adaaaa" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#adaaaa" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => isNaN(v) ? v : Number(v).toLocaleString()} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#131313', borderColor: '#262626', color: '#fff', borderRadius: '0px', fontStyle: 'monospace' }}
                itemStyle={{ color: '#00f3ff' }}
              />
              {yAxisKeys.map((key, i) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={i === 0 ? "#00f3ff" : "#bc13fe"}
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
