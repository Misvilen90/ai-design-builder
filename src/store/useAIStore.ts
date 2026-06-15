import { create } from 'zustand';
import type { AIProviderSelection, GenerationHistoryEntry } from '../services/ai/types';

const LS_PREFIX = 'genovax_ai_';
const LS_KEYS = {
  provider: `${LS_PREFIX}provider`,
  history: `${LS_PREFIX}history`,
} as const;

function lsGet(key: string, fallback: string = ''): string {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

interface AIStoreState {
  provider: AIProviderSelection;
  isGenerating: boolean;
  lastProvider: string | null;
  lastError: string | null;
  generationHistory: GenerationHistoryEntry[];

  setProvider: (p: AIProviderSelection) => void;
  setIsGenerating: (v: boolean) => void;
  setLastProvider: (p: string | null) => void;
  setLastError: (e: string | null) => void;
  addHistoryEntry: (entry: Omit<GenerationHistoryEntry, 'id' | 'timestamp'>) => void;
}

export const useAIStore = create<AIStoreState>((set, get) => ({
  provider: (lsGet(LS_KEYS.provider, 'auto') as AIProviderSelection),
  isGenerating: false,
  lastProvider: null,
  lastError: null,
  generationHistory: (() => {
    try {
      const raw = localStorage.getItem(LS_KEYS.history);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })(),

  setProvider: (p) => {
    lsSet(LS_KEYS.provider, p);
    set({ provider: p });
  },

  setIsGenerating: (v) => set({ isGenerating: v }),
  setLastProvider: (p) => set({ lastProvider: p }),
  setLastError: (e) => set({ lastError: e }),

  addHistoryEntry: (entry) => {
    const full: GenerationHistoryEntry = {
      ...entry,
      id: `gen-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [full, ...get().generationHistory].slice(0, 20);
    set({ generationHistory: updated });
    lsSet(LS_KEYS.history, JSON.stringify(updated));
  },
}));
