import { create } from 'zustand';
import type { AIProviderSelection, GenerationHistoryEntry } from '../services/ai/types';

const LS_PREFIX = 'genovax_ai_';
const LS_KEYS = {
  provider: `${LS_PREFIX}provider`,
  history: `${LS_PREFIX}history`,
  openRouterApiKey: `${LS_PREFIX}openrouter_api_key`,
  openRouterModel: `${LS_PREFIX}openrouter_model`,
  groqApiKey: `${LS_PREFIX}groq_api_key`,
  geminiApiKey: `${LS_PREFIX}gemini_api_key`,
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
  openRouterApiKey: string;
  openRouterModel: string;
  groqApiKey: string;
  geminiApiKey: string;

  setProvider: (p: AIProviderSelection) => void;
  setIsGenerating: (v: boolean) => void;
  setLastProvider: (p: string | null) => void;
  setLastError: (e: string | null) => void;
  addHistoryEntry: (entry: Omit<GenerationHistoryEntry, 'id' | 'timestamp'>) => void;
  setOpenRouterApiKey: (key: string) => void;
  setOpenRouterModel: (model: string) => void;
  setGroqApiKey: (key: string) => void;
  setGeminiApiKey: (key: string) => void;
  getActiveOpenRouterKey: () => string;
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
  openRouterApiKey: lsGet(LS_KEYS.openRouterApiKey),
  openRouterModel: lsGet(LS_KEYS.openRouterModel, 'google/gemini-2.0-flash-001'),
  groqApiKey: lsGet(LS_KEYS.groqApiKey),
  geminiApiKey: lsGet(LS_KEYS.geminiApiKey),

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

  setOpenRouterApiKey: (key) => {
    lsSet(LS_KEYS.openRouterApiKey, key);
    set({ openRouterApiKey: key });
  },
  setOpenRouterModel: (model) => {
    lsSet(LS_KEYS.openRouterModel, model);
    set({ openRouterModel: model });
  },
  setGroqApiKey: (key) => {
    lsSet(LS_KEYS.groqApiKey, key);
    set({ groqApiKey: key });
  },
  setGeminiApiKey: (key) => {
    lsSet(LS_KEYS.geminiApiKey, key);
    set({ geminiApiKey: key });
  },
  getActiveOpenRouterKey: () => get().openRouterApiKey,
}));
