// ---------------------------------------------------------------------------
// AI Router — multi-provider failover orchestration
//
// Auto mode:  Gemini → Groq → OpenRouter
// Manual:     Use selected provider only
// ---------------------------------------------------------------------------

import type { AIProvider, AILayoutPlan, GenerationResult } from './types';
import { useAIStore } from '../../store/useAIStore';
import { createGeminiProvider } from './providers/geminiProvider';
import { createGroqProvider } from './providers/groqProvider';
import { createOpenRouterProvider } from './providers/openRouterProvider';
import { buildSystemPrompt } from './layoutPlanner';
import { mapPlanToComponents } from './componentMapper';

// ---------------------------------------------------------------------------
// Provider factory
// ---------------------------------------------------------------------------

function getProviderAdapter(name: string): AIProvider {
  switch (name) {
    case 'gemini':
      return createGeminiProvider();
    case 'groq':
      return createGroqProvider();
    case 'openrouter':
      return createOpenRouterProvider();
    default:
      throw new Error(`Unknown provider: ${name}`);
  }
}

/** Returns ordered list of providers to try for auto mode. */
function getAutoProviderOrder(): string[] {
  const store = useAIStore.getState();
  const order: string[] = [];

  // Only include providers that have an API key configured
  if (store.getActiveGeminiKey()) order.push('gemini');
  if (store.getActiveGroqKey()) order.push('groq');
  if (store.getActiveOpenRouterKey()) order.push('openrouter');

  return order;
}

// ---------------------------------------------------------------------------
// JSON parsing helpers
// ---------------------------------------------------------------------------

function extractJSON(raw: string): string {
  let text = raw.trim();

  // Strip markdown code fences
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  // Try to find a JSON object
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) return objMatch[0];

  return text;
}

function parsePlan(raw: string): AILayoutPlan {
  const jsonText = extractJSON(raw);
  const parsed = JSON.parse(jsonText);

  // Validate required fields
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('AI response is not a JSON object.');
  }
  if (!Array.isArray(parsed.components) || parsed.components.length === 0) {
    throw new Error('AI response has no components array.');
  }

  // Normalise the plan
  return {
    pageName: parsed.pageName || 'AI Generated Page',
    description: parsed.description || '',
    components: parsed.components.filter(
      (c: any) => c && typeof c === 'object' && c.type
    ),
    imageKeywords: Array.isArray(parsed.imageKeywords)
      ? parsed.imageKeywords
      : [],
  };
}

// ---------------------------------------------------------------------------
// Main generation function
// ---------------------------------------------------------------------------

export async function generateLayout(
  userPrompt: string
): Promise<GenerationResult> {
  const store = useAIStore.getState();
  const provider = store.provider; // 'auto' | 'gemini' | 'groq' | 'openrouter'

  store.setIsGenerating(true);
  store.setLastError(null);

  try {
    const systemPrompt = buildSystemPrompt();
    const combinedPrompt = `${systemPrompt}\n\nUser Request: ${userPrompt}\n\nGenerate the layout plan now. Return ONLY the JSON object.`;

    // Determine which providers to try
    let providerNames: string[];
    if (provider === 'auto') {
      providerNames = getAutoProviderOrder();
      if (providerNames.length === 0) {
        return {
          success: false,
          components: [],
          provider: 'none',
          error:
            'No AI provider has an API key configured. Go to Settings → AI Configuration to add at least one key.',
        };
      }
    } else {
      providerNames = [provider];
    }

    const errors: string[] = [];

    for (const providerName of providerNames) {
      const adapter = getProviderAdapter(providerName);
      console.log(`[AI Router] Trying ${adapter.name}...`);

      try {
        // Call the LLM provider (internally retries & handles timeouts)
        const rawText = await adapter.generate(combinedPrompt);

        // Parse the JSON plan
        const plan = parsePlan(rawText);

        // Map to BuilderComponents
        const components = mapPlanToComponents(plan);

        if (components.length === 0) {
          throw new Error('All components from AI plan were unresolvable.');
        }

        // Success! Log success exactly as specified
        console.log(`[AI Router] ${adapter.name} Success`);

        store.setLastProvider(adapter.name);
        store.addHistoryEntry({
          prompt: userPrompt,
          provider: adapter.name,
          componentCount: components.length,
        });

        return {
          success: true,
          components,
          provider: adapter.name,
          plan,
          rawResponse: rawText.substring(0, 500)
        };
      } catch (err: any) {
        const msg = err?.message || String(err);
        console.log(`[AI Router] ${adapter.name} Failed (${msg})`);
        errors.push(`${adapter.name}: ${msg}`);

        // If error occurred and we're in manual mode, stop trying
        if (provider !== 'auto') {
          break;
        }

        // If in auto mode, continue to next fallback
        continue;
      }
    }

    // All providers failed
    const errorSummary = errors
      .map((e, i) => `${i + 1}. ${e}`)
      .join('\n');

    store.setLastError(errorSummary);

    return {
      success: false,
      components: [],
      provider: 'none',
      error: `All AI providers failed:\n${errorSummary}`,
    };
  } finally {
    store.setIsGenerating(false);
  }
}

// Keep the old function name as an alias for simple integration
export const generateUILayout = generateLayout;

// ---------------------------------------------------------------------------
// Test connection for a specific provider
// ---------------------------------------------------------------------------

export async function testProviderConnection(
  providerName: string
): Promise<{ success: boolean; message: string }> {
  try {
    const adapter = getProviderAdapter(providerName);
    const connected = await adapter.testConnection();
    return {
      success: connected,
      message: connected 
        ? `${adapter.name} connected successfully!` 
        : `${adapter.name} connection failed.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `${providerName}: ${err?.message || String(err)}`,
    };
  }
}

/** Test all configured providers. Returns results keyed by provider name. */
export async function testAllProviders(): Promise<
  Record<string, { success: boolean; message: string }>
> {
  const store = useAIStore.getState();
  const results: Record<string, { success: boolean; message: string }> = {};

  const providers = getAutoProviderOrder();
  for (const name of providers) {
    results[name] = await testProviderConnection(name);
  }

  // Mark providers without keys
  if (!store.getActiveGeminiKey()) {
    results['gemini'] = { success: false, message: 'No API key configured.' };
  }
  if (!store.getActiveGroqKey()) {
    results['groq'] = { success: false, message: 'No API key configured.' };
  }
  if (!store.getActiveOpenRouterKey()) {
    results['openrouter'] = { success: false, message: 'No API key configured.' };
  }

  return results;
}
