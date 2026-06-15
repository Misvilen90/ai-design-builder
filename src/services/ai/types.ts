// ---------------------------------------------------------------------------
// AI Engine — Shared Types & Interfaces
// ---------------------------------------------------------------------------

import type { BuilderComponent } from '../../store/useBuilderStore';

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export type AIProviderSelection = 'auto' | 'gemini' | 'groq' | 'openrouter' | 'openai';

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
// Prototype Plan types  (multi-page generation)
// ---------------------------------------------------------------------------

/** A single link: which component (by name) navigates to which page */
export interface AIPrototypeLink {
  /** Display name of the component that should be the clickable trigger */
  componentName: string;
  /** pageId of the destination page (must match one of the pages in AIPrototypePlan) */
  toPageId: string;
}

/** A single page within a multi-page prototype plan */
export interface AIPagePlan {
  /** Short slug used as an ID, e.g. "home", "products", "cart" */
  pageId: string;
  /** Human-readable page name shown in the left panel */
  pageName: string;
  /** true for the root/entry page */
  isHome: boolean;
  /** Components to place on this page — same format as AILayoutPlan.components */
  components: AIComponentPlan[];
  /**
   * Inter-page links — the AI specifies which component name links to which pageId.
   * The mapper will find the component by name and set its prototypeDestination.
   */
  links: AIPrototypeLink[];
}

/** Top-level response the LLM returns for a prototype generation request */
export interface AIPrototypePlan {
  siteDescription: string;
  pages: AIPagePlan[];
}

/** Result returned to the UI after a prototype generation call */
export interface PrototypeGenerationResult {
  success: boolean;
  /** Fully built Page[] ready to be set in the Zustand store */
  pages: import('../../store/useBuilderStore').Page[];
  /** ID of the home/root page */
  homePageId: string;
  /** Which provider actually produced the result */
  provider: string;
  /** Total prototype links applied */
  linksApplied: number;
  /** Human-readable error when success === false */
  error?: string;
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
