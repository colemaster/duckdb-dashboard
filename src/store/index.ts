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
          { i: 'visualizer', x: 0, y: 0, w: 8, h: 4 },
          { i: 'oracle', x: 8, y: 0, w: 4, h: 10 },
          { i: 'workbench', x: 0, y: 4, w: 8, h: 4 },
          { i: 'datagrid', x: 0, y: 8, w: 8, h: 6 }
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
  currentSql: 'SELECT * FROM telemetry LIMIT 10;',
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
    content: 'Oracle AI initialized. Waiting for prompt against `telemetry` or `server_logs` tables.' 
  }],
  addMessage: (msg) => set((state) => ({ 
    messages: [...state.messages, { ...msg, id: Date.now().toString() }] 
  })),
  isThinking: false,
  setIsThinking: (thinking) => set({ isThinking: thinking }),
}));
