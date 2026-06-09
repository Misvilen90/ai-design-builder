import { create } from 'zustand';
import type { AIProviderSelection, GenerationHistoryEntry } from '../services/ai/types';

// ---------------------------------------------------------------------------
// LocalStorage keys
// ---------------------------------------------------------------------------

const LS_PREFIX = 'genovax_ai_';
const LS_KEYS = {
  provider: `${LS_PREFIX}provider`,
  geminiKey: `${LS_PREFIX}gemini_key`,
  groqKey: `${LS_PREFIX}groq_key`,
  openRouterKey: `${LS_PREFIX}openrouter_key`,
  geminiModel: `${LS_PREFIX}gemini_model`,
  groqModel: `${LS_PREFIX}groq_model`,
  openRouterModel: `${LS_PREFIX}openrouter_model`,
  history: `${LS_PREFIX}history`,
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
    /* quota exceeded — ignore */
  }
}

function getEnvKey(envVar: string): string {
  try {
    const val = (import.meta as any).env?.[envVar];
    return val && val !== 'your_api_key_here' ? val : '';
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

interface AIStoreState {
  // Provider selection
  provider: AIProviderSelection;

  // API keys  (env vars take priority → fallback to localStorage)
  geminiApiKey: string;
  groqApiKey: string;
  openRouterApiKey: string;

  // Model selections
  geminiModel: string;
  groqModel: string;
  openRouterModel: string;

  // Runtime generation state
  isGenerating: boolean;
  lastProvider: string | null;
  lastError: string | null;
  generationHistory: GenerationHistoryEntry[];

  // Actions — provider
  setProvider: (p: AIProviderSelection) => void;

  // Actions — keys
  setGeminiApiKey: (key: string) => void;
  setGroqApiKey: (key: string) => void;
  setOpenRouterApiKey: (key: string) => void;

  // Actions — models
  setGeminiModel: (m: string) => void;
  setGroqModel: (m: string) => void;
  setOpenRouterModel: (m: string) => void;

  // Actions — runtime
  setIsGenerating: (v: boolean) => void;
  setLastProvider: (p: string | null) => void;
  setLastError: (e: string | null) => void;
  addHistoryEntry: (entry: Omit<GenerationHistoryEntry, 'id' | 'timestamp'>) => void;

  // Derived helpers
  getActiveGeminiKey: () => string;
  getActiveGroqKey: () => string;
  getActiveOpenRouterKey: () => string;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAIStore = create<AIStoreState>((set, get) => ({
  // ── Initialise from localStorage / env ──────────────────────────────
  provider: (lsGet(LS_KEYS.provider, 'auto') as AIProviderSelection),
  geminiApiKey: lsGet(LS_KEYS.geminiKey),
  groqApiKey: lsGet(LS_KEYS.groqKey),
  openRouterApiKey: lsGet(LS_KEYS.openRouterKey),
  geminiModel: lsGet(LS_KEYS.geminiModel, 'gemini-2.5-flash'),
  groqModel: lsGet(LS_KEYS.groqModel, 'llama-3.3-70b-versatile'),
  openRouterModel: lsGet(LS_KEYS.openRouterModel, 'nvidia/nemotron-3-ultra-550b-a55b:free'),

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

  // ── Provider ────────────────────────────────────────────────────────
  setProvider: (p) => {
    lsSet(LS_KEYS.provider, p);
    set({ provider: p });
  },

  // ── API Keys ────────────────────────────────────────────────────────
  setGeminiApiKey: (key) => {
    const trimmed = key.trim();
    lsSet(LS_KEYS.geminiKey, trimmed);
    set({ geminiApiKey: trimmed });
  },
  setGroqApiKey: (key) => {
    const trimmed = key.trim();
    lsSet(LS_KEYS.groqKey, trimmed);
    set({ groqApiKey: trimmed });
  },
  setOpenRouterApiKey: (key) => {
    const trimmed = key.trim();
    lsSet(LS_KEYS.openRouterKey, trimmed);
    set({ openRouterApiKey: trimmed });
  },

  // ── Models ──────────────────────────────────────────────────────────
  setGeminiModel: (m) => {
    lsSet(LS_KEYS.geminiModel, m);
    set({ geminiModel: m });
  },
  setGroqModel: (m) => {
    lsSet(LS_KEYS.groqModel, m);
    set({ groqModel: m });
  },
  setOpenRouterModel: (m) => {
    lsSet(LS_KEYS.openRouterModel, m);
    set({ openRouterModel: m });
  },

  // ── Runtime ─────────────────────────────────────────────────────────
  setIsGenerating: (v) => set({ isGenerating: v }),
  setLastProvider: (p) => set({ lastProvider: p }),
  setLastError: (e) => set({ lastError: e }),

  addHistoryEntry: (entry) => {
    const full: GenerationHistoryEntry = {
      ...entry,
      id: `gen-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [full, ...get().generationHistory].slice(0, 20); // keep last 20
    set({ generationHistory: updated });
    lsSet(LS_KEYS.history, JSON.stringify(updated));
  },

  // ── Derived — env var takes priority over stored key ────────────────
  getActiveGeminiKey: () => getEnvKey('VITE_GEMINI_API_KEY') || get().geminiApiKey,
  getActiveGroqKey: () => getEnvKey('VITE_GROQ_API_KEY') || get().groqApiKey,
  getActiveOpenRouterKey: () => getEnvKey('VITE_OPENROUTER_API_KEY') || get().openRouterApiKey,
}));
