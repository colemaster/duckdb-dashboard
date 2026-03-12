"use client";

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQueryStore } from '@/store';
import { Table as LucideTable } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

export function DataGrid() {
  const { activeQueryResult, activeQueryColumns } = useQueryStore();

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
    <Card className="h-full w-full flex flex-col bg-obsidian border-white/10 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <CardHeader className="widget-header cursor-move bg-black/60 border-b border-primary/20 p-3">
        <CardTitle className="text-sm font-bold text-white/90 uppercase tracking-wider drop-shadow-[0_0_5px_rgba(255,126,0,0.8)] flex items-center gap-2">
          <LucideTable className="w-4 h-4 text-primary" /> The Vein
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-auto bg-[#0a0a0a]">
        {!activeQueryResult ? (
          <div className="flex h-full items-center justify-center text-sm text-white/30">
            No data extracted yet. Run a query in The Drill.
          </div>
        ) : (
          <div className="w-full h-full relative">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="sticky top-0 bg-black/80 backdrop-blur-md z-10 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="p-3 border-b border-white/10 text-primary font-mono font-medium whitespace-nowrap">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 text-white/70 whitespace-nowrap font-mono text-xs">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="p-4 text-center text-white/30">
                      Query returned 0 rows.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
