"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Responsive, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useLayoutStore, useQueryStore } from '@/store';
import { OracleChatbot } from '@/components/widgets/OracleChatbot';
import { SqlWorkbench } from '@/components/widgets/SqlWorkbench';
import { DataGrid } from '@/components/widgets/DataGrid';
import { Visualizer } from '@/components/widgets/Visualizer';

export function GridCanvas() {
  const { layouts, setLayouts } = useLayoutStore();
  const [mounted, setMounted] = useState(false);
  const isReady = useQueryStore((state) => state.isReady);
  const [width, setWidth] = useState(1200);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0] && entries[0].contentRect) {
        setWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [mounted, isReady]);

  if (!mounted || !isReady) {
    return null; // DashboardLayout handles loading state
  }

  const handleLayoutChange = (currentLayout: any, allLayouts: any) => {
    setLayouts(allLayouts);
  };

  return (
    <div className="w-full h-full p-4 relative z-10" ref={wrapperRef}>
      {width > 0 && (
        <Responsive
          className="layout"
          width={width}
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          onLayoutChange={handleLayoutChange}
          {...({ draggableHandle: ".widget-header" } as any)}
          margin={[16, 16]}
        >
          <div key="visualizer">
            <Visualizer />
          </div>
          <div key="oracle">
            <OracleChatbot />
          </div>
          <div key="workbench">
            <SqlWorkbench />
          </div>
          <div key="datagrid">
            <DataGrid />
          </div>
        </Responsive>
      )}
    </div>
  );
}
