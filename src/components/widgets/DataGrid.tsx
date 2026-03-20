"use client";

import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQueryStore } from '@/store';
import { Table as LucideTable, DatabaseZap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

export function DataGrid() {
  const { activeQueryResult, activeQueryColumns } = useQueryStore();
  const [hoverRow, setHoverRow] = useState<number | null>(null);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    return activeQueryColumns.map((col) => ({
      accessorKey: col,
      header: col,
      cell: info => {
        const val = info.getValue();
        if (typeof val === 'bigint') return val.toString();
        return val !== null && val !== undefined ? String(val) : '';
      }
    }));
  }, [activeQueryColumns]);

  const table = useReactTable({
    data: activeQueryResult || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="h-full w-full flex flex-col bg-[#0e0e0e] border-none rounded-none shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] transition-all duration-300">
      <CardHeader className="widget-header cursor-move bg-[#131313] border-b border-[#262626] p-3 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <CardTitle className="text-sm font-bold text-white uppercase tracking-widest flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <LucideTable className="w-4 h-4 text-primary animate-pulse" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">Data Grid</span>
          </div>
          <DatabaseZap className="w-4 h-4 text-[#adaaaa]" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-auto bg-[#000000] relative group">
        {!activeQueryResult ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex h-full items-center justify-center text-sm text-[#555] font-mono tracking-widest uppercase"
          >
            Execute a query to view payload
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            className="w-full h-full relative"
          >
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#131313] to-transparent pointer-events-none z-10 opacity-50"></div>
            <table className="w-full text-sm text-left border-collapse font-mono text-xs">
              <thead className="sticky top-0 bg-[#131313]/90 backdrop-blur-md z-20 border-b-2 border-primary shadow-[0_5px_15px_rgba(0,243,255,0.05)]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="p-3 text-primary uppercase font-bold whitespace-nowrap tracking-wider text-[10px] group-hover:text-[#00f1fd] transition-colors">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                <AnimatePresence>
                  {table.getRowModel().rows.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      onMouseEnter={() => setHoverRow(i)}
                      onMouseLeave={() => setHoverRow(null)}
                      className={`${i % 2 === 0 ? 'bg-[#000000]' : 'bg-[#050505]'} border-b border-[#131313] transition-all cursor-crosshair relative`}
                    >
                      {row.getVisibleCells().map((cell, j) => (
                        <td key={cell.id} className="p-3 text-[#d0d0d0] whitespace-nowrap relative z-10 transition-colors duration-200">
                          {hoverRow === i && j === 0 && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
                          )}
                          <span className={`${hoverRow === i ? 'text-white' : ''}`}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </span>
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="p-4 text-center text-[#555] font-mono tracking-widest uppercase text-[10px]">
                      Query returned empty payload.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
