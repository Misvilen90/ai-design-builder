// ---------------------------------------------------------------------------
// AI Engine — Shared Types & Interfaces
// ---------------------------------------------------------------------------

import type { BuilderComponent } from '../../store/useBuilderStore';

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export type AIProviderSelection = 'auto' | 'gemini' | 'groq' | 'openrouter';

export interface AIProvider {
  /** Human-readable provider name (e.g. "Gemini", "Groq") */
  readonly name: string;

  /**
   * Send a combined prompt to the LLM and return the raw text response.
   */
  generate(prompt: string): Promise<string>;

  /** Quick health-check / key validation. */
  testConnection(): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// AI Layout Plan  (what the LLM returns as JSON)
// ---------------------------------------------------------------------------

export interface AIComponentPlan {
  /** Component type — should match a key in COMPONENT_SCHEMAS (or an alias) */
  type: string;
  /** Human-readable display name */
  name: string;
  /** Left offset in canvas pixels */
  x: number;
  /** Top offset in canvas pixels */
  y: number;
  /** Width in canvas pixels */
  width: number;
  /** Height in canvas pixels */
  height: number;
  /** Stacking order */
  zIndex: number;
  /**
   * Optional overrides applied on top of the schema's defaultContent.
   * E.g. { text: "Welcome to Our Store" } or { label: "Shop Now" }
   */
  contentOverrides?: Record<string, any>;
  /** If this component should contain a contextual image, specify a keyword */
  imageKeyword?: string;
}

export interface AILayoutPlan {
  /** Suggested page / layout name */
  pageName: string;
  /** Short description of the generated layout */
  description: string;
  /** Ordered list of components to place on the canvas */
  components: AIComponentPlan[];
  /**
   * Global image-search keywords derived from the user prompt.
   * Used by imageService to pre-fetch relevant images.
   */
  imageKeywords: string[];
}

// ---------------------------------------------------------------------------
// Generation result  (returned to the UI layer)
// ---------------------------------------------------------------------------

export interface GenerationResult {
  success: boolean;
  /** Final BuilderComponent[] ready for the Zustand store */
  components: BuilderComponent[];
  /** Which provider actually produced the result */
  provider: string;
  /** Human-readable error when success === false */
  error?: string;
  /** The parsed layout plan (for debugging / display) */
  plan?: AILayoutPlan;
  /** First 500 chars of raw LLM text (for debugging) */
  rawResponse?: string;
}

// ---------------------------------------------------------------------------
// Generation history entry (stored in useAIStore)
// ---------------------------------------------------------------------------

export interface GenerationHistoryEntry {
  id: string;
  prompt: string;
  provider: string;
  componentCount: number;
  timestamp: string;
}
