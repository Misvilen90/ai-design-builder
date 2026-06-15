import type {
  AILayoutPlan,
  GenerationResult,
  AIPrototypePlan,
  PrototypeGenerationResult,
} from './types';
import type { Page } from '../../store/useBuilderStore';
import { useAIStore } from '../../store/useAIStore';
import { useAuthStore } from '../../store/useAuthStore';
import { buildSystemPrompt as buildLayoutSystemPrompt } from './layoutPlanner';
import {
  buildPrototypeSystemPrompt,
  detectPrototypeType,
} from './prototypePlanner';
import { mapPlanToComponents } from './componentMapper';

// In development the Vite proxy forwards /api/* → http://localhost:5000.
// In production, set VITE_API_BASE to your deployed backend URL.
const API_BASE: string =
  (typeof import.meta !== 'undefined' &&
    (import.meta as any).env?.VITE_API_BASE) ||
  '';

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function getBackendProviders(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/api/ai/providers`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    const data = await res.json();
    return data.providers || [];
  } catch {
    return [];
  }
}

async function callBackendGenerate(
  prompt: string,
  mode: 'layout' | 'prototype',
  provider: string
): Promise<any> {
  const endpoint =
    mode === 'prototype' ? '/api/ai/generate-prototype' : '/api/ai/generate';

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ prompt, provider }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || `Server error ${response.status}`);
  }

  return result;
}

export async function generateLayout(
  userPrompt: string
): Promise<GenerationResult> {
  const store = useAIStore.getState();
  const provider = store.provider;

  store.setIsGenerating(true);
  store.setLastError(null);

  try {
    const systemPrompt = buildLayoutSystemPrompt();
    const combinedPrompt = `${systemPrompt}\n\nUser Request: ${userPrompt}\n\nGenerate the layout plan now. Return ONLY the JSON object.`;

    const result = await callBackendGenerate(combinedPrompt, 'layout', provider);

    const plan: AILayoutPlan = result.plan;

    const components = mapPlanToComponents(plan);

    if (components.length === 0) {
      throw new Error('All components from AI plan were unresolvable.');
    }

    store.setLastProvider(result.provider);
    store.addHistoryEntry({
      prompt: userPrompt,
      provider: result.provider,
      componentCount: components.length,
    });

    return {
      success: true,
      components,
      provider: result.provider,
      plan,
      rawResponse: result.rawResponse,
    };
  } catch (err: any) {
    const msg = err?.message || String(err);
    store.setLastError(msg);
    return {
      success: false,
      components: [],
      provider: 'none',
      error: msg,
    };
  } finally {
    store.setIsGenerating(false);
  }
}

export const generateUILayout = generateLayout;

export async function generatePrototype(
  userPrompt: string
): Promise<PrototypeGenerationResult> {
  const store = useAIStore.getState();
  const provider = store.provider;

  store.setIsGenerating(true);
  store.setLastError(null);

  try {
    const siteType = detectPrototypeType(userPrompt);
    const systemPrompt = buildPrototypeSystemPrompt(siteType);
    const combinedPrompt = `${systemPrompt}\n\nUser Request: ${userPrompt}\n\nGenerate the full multi-page prototype plan now. Return ONLY the JSON object.`;

    const result = await callBackendGenerate(
      combinedPrompt,
      'prototype',
      provider
    );

    const protoPlan: AIPrototypePlan = result.plan;

    const pageIdMap = new Map<string, string>();
    for (const pagePlan of protoPlan.pages) {
      pageIdMap.set(pagePlan.pageId, pagePlan.pageId);
    }

    const builtPages: Page[] = [];
    let totalLinks = 0;
    let homePageId = '';

    for (const pagePlan of protoPlan.pages) {
      const components = mapPlanToComponents({
        pageName: pagePlan.pageName,
        description: '',
        components: pagePlan.components,
        imageKeywords: [],
      });

      for (const link of pagePlan.links) {
        const targetPageId = pageIdMap.get(link.toPageId);
        if (!targetPageId) {
          console.warn(
            `[AI Router] Prototype link target "${link.toPageId}" not found — skipping.`
          );
          continue;
        }

        const linkName = link.componentName.toLowerCase();
        const matched = components.find(
          (c) =>
            c.name.toLowerCase().includes(linkName) ||
            linkName.includes(c.name.toLowerCase())
        );

        if (matched) {
          matched.prototypeDestination = targetPageId;
          totalLinks++;
        } else {
          const fallback = components.find(
            (c) =>
              (linkName.includes('nav') && c.type.includes('nav')) ||
              (linkName.includes('button') && c.type.includes('button')) ||
              (linkName.includes('hero') && c.type.includes('hero'))
          );
          if (fallback && !fallback.prototypeDestination) {
            fallback.prototypeDestination = targetPageId;
            totalLinks++;
          }
        }
      }

      builtPages.push({
        id: pagePlan.pageId,
        name: pagePlan.pageName,
        components,
      });

      if (pagePlan.isHome) {
        homePageId = pagePlan.pageId;
      }
    }

    if (builtPages.length === 0) {
      throw new Error('Prototype generation produced zero pages.');
    }

    store.setLastProvider(result.provider);
    store.addHistoryEntry({
      prompt: userPrompt,
      provider: result.provider,
      componentCount: builtPages.reduce(
        (sum, p) => sum + p.components.length,
        0
      ),
    });

    return {
      success: true,
      pages: builtPages,
      homePageId,
      provider: result.provider,
      linksApplied: totalLinks,
      rawResponse: result.rawResponse,
    };
  } catch (err: any) {
    const msg = err?.message || String(err);
    store.setLastError(msg);
    return {
      success: false,
      pages: [],
      homePageId: '',
      provider: 'none',
      linksApplied: 0,
      error: msg,
    };
  } finally {
    store.setIsGenerating(false);
  }
}

export async function refineLayout(
  userPrompt: string,
  currentLayoutDescription: string
): Promise<GenerationResult> {
  const store = useAIStore.getState();
  const provider = store.provider;

  store.setIsGenerating(true);
  store.setLastError(null);

  try {
    const systemPrompt = buildLayoutSystemPrompt();
    const combinedPrompt = `${systemPrompt}

## CURRENT LAYOUT CONTEXT
The user already has this layout on their canvas:
${currentLayoutDescription}

## REFINEMENT REQUEST
The user wants to modify the existing layout with the following changes:
${userPrompt}

Generate an UPDATED layout plan that incorporates these changes while keeping the structure that wasn't mentioned. Return ONLY the JSON object.`;

    const result = await callBackendGenerate(combinedPrompt, 'layout', provider);

    const plan: AILayoutPlan = result.plan;
    const components = mapPlanToComponents(plan);

    if (components.length === 0) {
      throw new Error('All components from AI plan were unresolvable.');
    }

    store.setLastProvider(result.provider);
    store.addHistoryEntry({
      prompt: userPrompt,
      provider: result.provider,
      componentCount: components.length,
    });

    return {
      success: true,
      components,
      provider: result.provider,
      plan,
      rawResponse: result.rawResponse,
    };
  } catch (err: any) {
    const msg = err?.message || String(err);
    store.setLastError(msg);
    return {
      success: false,
      components: [],
      provider: 'none',
      error: msg,
    };
  } finally {
    store.setIsGenerating(false);
  }
}

export function describeCurrentLayout(pages: Page[], activePageId: string): string {
  const activePage = pages.find(p => p.id === activePageId);
  if (!activePage || activePage.components.length === 0) {
    return 'Empty canvas with no components.';
  }

  const parts = [`Page: "${activePage.name}"`, `Components (${activePage.components.length}):`];
  for (const c of activePage.components) {
    const pos = c.position;
    parts.push(`- ${c.type} "${c.name}" at (${pos.left}, ${pos.top}), size ${pos.width}x${pos.height}`);
  }
  return parts.join('\n');
}

export async function testProviderConnection(
  providerName: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/api/ai/test-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ provider: providerName }),
    });
    const result = await response.json();
    return result;
  } catch (err: any) {
    return {
      success: false,
      message: `Cannot reach backend: ${err?.message || String(err)}`,
    };
  }
}

export async function testAllProviders(): Promise<
  Record<string, { success: boolean; message: string }>
> {
  const result: Record<string, { success: boolean; message: string }> = {};

  try {
    const configured = await getBackendProviders();
    for (const name of configured) {
      result[name] = await testProviderConnection(name);
    }
  } catch {
    // If backend unreachable, mark all as failed
  }

  return result;
}
