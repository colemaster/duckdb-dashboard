import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Layout } from 'react-grid-layout';

// --- Layout Store ---
interface LayoutState {
  layouts: any;
  setLayouts: (layouts: any) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      layouts: {
        lg: [
          { i: 'workbench', x: 0, y: 0, w: 6, h: 4 },
          { i: 'datagrid', x: 0, y: 4, w: 6, h: 6 },
          { i: 'visualizer', x: 6, y: 0, w: 6, h: 6 },
          { i: 'oracle', x: 6, y: 6, w: 6, h: 4 }
        ]
      },
      setLayouts: (layouts) => set({ layouts }),
    }),
    { name: 'deep-earth-dashboard-layout' }
  )
);

// --- Query Store ---
interface QueryState {
  isReady: boolean;
  setReady: (ready: boolean) => void;
  activeQueryResult: Record<string, any>[] | null;
  setActiveQueryResult: (result: Record<string, any>[] | null) => void;
  activeQueryColumns: string[];
  setActiveQueryColumns: (cols: string[]) => void;
  currentSql: string;
  setCurrentSql: (sql: string) => void;
}

export const useQueryStore = create<QueryState>((set) => ({
  isReady: false,
  setReady: (ready) => set({ isReady: ready }),
  activeQueryResult: null,
  setActiveQueryResult: (result) => set({ activeQueryResult: result }),
  activeQueryColumns: [],
  setActiveQueryColumns: (cols) => set({ activeQueryColumns: cols }),
  currentSql: "SELECT\n  l_returnflag,\n  l_linestatus,\n  sum(l_quantity) as sum_qty,\n  sum(l_extendedprice) as sum_base_price,\n  count(*) as count_order\nFROM 'https://shell.duckdb.org/data/tpch/0_01/parquet/lineitem.parquet'\nGROUP BY\n  l_returnflag,\n  l_linestatus\nORDER BY\n  l_returnflag,\n  l_linestatus;",
  setCurrentSql: (sql) => set({ currentSql: sql }),
}));

// --- Chat Store ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  isError?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  addMessage: (msg: Omit<ChatMessage, 'id'>) => void;
  isThinking: boolean;
  setIsThinking: (thinking: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [{ 
    id: '1', 
    role: 'assistant', 
    content: 'Oracle AI initialized. Waiting for prompt. Try asking me to analyze remote Parquet files or local tables.'
  }],
  addMessage: (msg) => set((state) => ({ 
    messages: [...state.messages, { ...msg, id: Date.now().toString() }] 
  })),
  isThinking: false,
  setIsThinking: (thinking) => set({ isThinking: thinking }),
}));
