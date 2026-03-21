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
    <Card className="h-full w-full flex flex-col bg-[#0e0e0e] border-none rounded-none shadow-none">
      <CardHeader className="widget-header cursor-move bg-[#131313] border-b-0 p-3">
        <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
          <LucideTable className="w-4 h-4 text-primary" /> Data Results
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-auto bg-[#000000]">
        {!activeQueryResult ? (
          <div className="flex h-full items-center justify-center text-sm text-[#adaaaa] font-mono">
            Execute a query to view results
          </div>
        ) : (
          <div className="w-full h-full relative">
            <table className="w-full text-sm text-left border-collapse font-mono text-xs">
              <thead className="sticky top-0 bg-[#131313] z-10 border-b-2 border-primary">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="p-3 text-primary uppercase font-bold whitespace-nowrap">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, i) => (
                  <tr key={row.id} className={`${i % 2 === 0 ? 'bg-[#000000]' : 'bg-[#0a0a0a]'} hover:border-b hover:border-primary transition-colors cursor-default`}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 text-[#ffffff] whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="p-4 text-center text-[#adaaaa]">
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
