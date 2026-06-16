import type {
  AILayoutPlan,
  GenerationResult,
  AIPrototypePlan,
  PrototypeGenerationResult,
} from './types';
import type { BuilderComponent } from '../../store/useBuilderStore';
import { useBuilderStore, type Page } from '../../store/useBuilderStore';
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
    const globalTheme = useBuilderStore.getState().globalTheme;
    const systemPrompt = buildLayoutSystemPrompt(globalTheme);
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

// ---------------------------------------------------------------------------
// Result type for layout + auto-generated nav pages
// ---------------------------------------------------------------------------
export interface NavPageGenerationResult {
  success: boolean;
  pages: Page[];
  homePageId: string;
  provider: string;
  linksApplied: number;
  error?: string;
  rawResponse?: string;
}

/**
 * Extracts all non-"home" nav link labels from the navbar HTML in the
 * generated components. Returns an array of { label, slug } pairs.
 */
function extractNavLinks(components: BuilderComponent[]): Array<{ label: string; slug: string }> {
  const navComp = components.find(
    (c) => c.type?.includes('nav') && c.content?.html
  );
  if (!navComp?.content?.html) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(navComp.content.html, 'text/html');
  const anchors = Array.from(
    doc.body.querySelectorAll('a, span[class*="nav"], li')
  );

  const seen = new Set<string>();
  const results: Array<{ label: string; slug: string }> = [];

  for (const el of anchors) {
    const text = (el.textContent || '').trim();
    if (!text || text.length > 40) continue;
    const lower = text.toLowerCase();
    // Skip "Home" and button-like labels
    if (lower === 'home' || lower === 'login' || lower === 'sign up' || lower === 'get started') continue;
    if (seen.has(lower)) continue;
    seen.add(lower);
    results.push({
      label: text,
      slug: lower.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  }

  return results;
}

/**
 * Patches data-page-link attributes on navbar HTML elements matching each nav link label.
 * Returns the updated navbar HTML string.
 */
function patchNavbarLinks(
  navbarHtml: string,
  linkMap: Record<string, string>
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(navbarHtml, 'text/html');
  const candidates = Array.from(
    doc.body.querySelectorAll('a, span, li, button')
  );

  for (const el of candidates) {
    const text = (el.textContent || '').trim().toLowerCase();
    const targetPageId = linkMap[text];
    if (targetPageId) {
      el.setAttribute('data-page-link', targetPageId);
      (el as HTMLElement).style.cursor = 'pointer';
    }
  }
  return doc.body.innerHTML;
}

/**
 * Generates a home page layout AND automatically generates a dedicated page for
 * each navigation link found in the home page's navbar, then wires them together.
 */
export async function generateLayoutWithPages(
  userPrompt: string
): Promise<NavPageGenerationResult> {
  const store = useAIStore.getState();
  const provider = store.provider;

  store.setIsGenerating(true);
  store.setLastError(null);

  try {
    // 1. Generate the Home page layout
    const globalTheme = useBuilderStore.getState().globalTheme;
    const systemPrompt = buildLayoutSystemPrompt(globalTheme);
    const combinedPrompt = `${systemPrompt}\n\nUser Request: ${userPrompt}\n\nGenerate the layout plan now. Return ONLY the JSON object.`;

    const result = await callBackendGenerate(combinedPrompt, 'layout', provider);
    const plan: AILayoutPlan = result.plan;
    const homeComponents = mapPlanToComponents(plan);

    if (homeComponents.length === 0) {
      throw new Error('All components from AI plan were unresolvable.');
    }

    store.setLastProvider(result.provider);

    // 2. Extract nav links from the generated home page
    const navLinks = extractNavLinks(homeComponents);

    if (navLinks.length === 0) {
      // No navbar links found — just return as a single page
      const homePageId = 'home';
      store.addHistoryEntry({
        prompt: userPrompt,
        provider: result.provider,
        componentCount: homeComponents.length,
      });
      return {
        success: true,
        pages: [{ id: homePageId, name: plan.pageName || 'Home', components: homeComponents }],
        homePageId,
        provider: result.provider,
        linksApplied: 0,
        rawResponse: result.rawResponse,
      };
    }

    // 3. Generate a page for each non-home nav link in parallel
    const pageGenerationPromises = navLinks.map(async ({ label, slug }) => {
      try {
        const pagePrompt = `${systemPrompt}

User Request: Create a ${label} page for a website about: ${userPrompt}
This is the "${label}" sub-page. Generate content and layout appropriate for a "${label}" page.
Do NOT include "home" page content — this is specifically the ${label} section page.
Return ONLY the JSON object.`;

        const pageResult = await callBackendGenerate(pagePrompt, 'layout', provider);
        const pagePlan: AILayoutPlan = pageResult.plan;
        const pageComponents = mapPlanToComponents(pagePlan);

        return {
          id: slug,
          name: label,
          components: pageComponents,
        } as Page;
      } catch (err) {
        console.warn(`[aiRouter] Failed to generate page for "${label}":`, err);
        return null;
      }
    });

    const generatedPages = (await Promise.all(pageGenerationPromises)).filter(Boolean) as Page[];

    // 4. Build the link map: lowercase label → pageId
    const linkMap: Record<string, string> = {};
    for (const page of generatedPages) {
      linkMap[page.name.toLowerCase()] = page.id;
    }

    // 5. Patch navbar HTML in the home page to add data-page-link attributes
    let linksApplied = 0;
    const patchedHomeComponents = homeComponents.map((comp) => {
      if (comp.type?.includes('nav') && comp.content?.html) {
        const patched = patchNavbarLinks(comp.content.html, linkMap);
        if (patched !== comp.content.html) {
          linksApplied++;
          return { ...comp, content: { ...comp.content, html: patched } };
        }
      }
      return comp;
    });

    // 6. Also patch navbar on every generated sub-page (same navbar HTML)
    const homePage: Page = {
      id: 'home',
      name: plan.pageName || 'Home',
      components: patchedHomeComponents,
    };

    const allPages: Page[] = [homePage, ...generatedPages];

    // Add 'home' to the linkMap for any "Home" links in sub-page navbars
    linkMap['home'] = 'home';
    const allLinkedPages = allPages.map((page) => ({
      ...page,
      components: page.components.map((comp) => {
        if (comp.type?.includes('nav') && comp.content?.html) {
          const patched = patchNavbarLinks(comp.content.html, linkMap);
          if (patched !== comp.content.html) {
            linksApplied++;
            return { ...comp, content: { ...comp.content, html: patched } };
          }
        }
        return comp;
      }),
    }));

    store.addHistoryEntry({
      prompt: userPrompt,
      provider: result.provider,
      componentCount: allLinkedPages.reduce((s, p) => s + p.components.length, 0),
    });

    return {
      success: true,
      pages: allLinkedPages,
      homePageId: 'home',
      provider: result.provider,
      linksApplied,
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

export async function generatePrototype(
  userPrompt: string
): Promise<PrototypeGenerationResult> {
  const store = useAIStore.getState();
  const provider = store.provider;

  store.setIsGenerating(true);
  store.setLastError(null);

  try {
    const siteType = detectPrototypeType(userPrompt);
    const globalTheme = useBuilderStore.getState().globalTheme;

    // STEP 1: Plan the navbar links, brand name, and the list of pages.
    const planPrompt = `You are a premium UI/UX planner designing a website prototype for: "${userPrompt}"
Plan a 4-page prototype matching the site type: "${siteType}".
Determine:
1. The brand/company name.
2. The exact 4 pages to generate (Home, and 3 sub-pages).
3. The navigation link options.

Return ONLY a valid JSON matching this schema:
{
  "siteDescription": "A short description of the website",
  "pages": [
    {
      "pageId": "home",
      "pageName": "Home",
      "isHome": true,
      "components": [
        {
          "type": "nav-navbar",
          "name": "Navbar",
          "x": 50,
          "y": 0,
          "width": 900,
          "height": 64,
          "zIndex": 1,
          "contentOverrides": {
            "brand": "BrandName",
            "navLinks": "Home, Link 1, Link 2, Link 3"
          }
        }
      ],
      "links": []
    }
  ]
}

Make sure there are EXACTLY 4 pages in the pages array. Return ONLY this raw JSON object.`;

    const planResult = await callBackendGenerate(planPrompt, 'prototype', provider);
    const protoPlan: AIPrototypePlan = planResult.plan;
    
    // Extract the brand name and navbar links from the home page navbar
    const homePagePlan = protoPlan.pages.find(p => p.isHome) || protoPlan.pages[0];
    const homeNavbar = homePagePlan.components.find(c => c.type === 'nav-navbar');
    const brandName = homeNavbar?.contentOverrides?.brand || 'BrandName';
    const navLinksStr = homeNavbar?.contentOverrides?.navLinks || 'Home, Features, Pricing, Contact';

    const builtPages: Page[] = [];
    let totalLinks = 0;
    let homePageId = '';

    // STEP 2: Generate UI layout for each page individually
    const systemPrompt = buildLayoutSystemPrompt(globalTheme);

    for (const pagePlan of protoPlan.pages) {
      console.log(`[aiRouter] Generating UI layout for page: ${pagePlan.pageName}...`);
      
      const pageGenPrompt = `${systemPrompt}

User Request: Create a premium "${pagePlan.pageName}" page layout for a website about: "${userPrompt}"
This website brand is "${brandName}". 
This page is specifically the "${pagePlan.pageName}" page.
CRITICAL STYLING & COMPONENT RULES:
1. You MUST include a navigation bar ("nav-navbar") at y=0, width=900, x=50, height=64, with the brand name "${brandName}" and exactly these navigation links: "${navLinksStr}".
2. Design custom content layout blocks below the navbar starting from y=84. Stack them vertically.
3. You MUST end the page with a footer at the bottom.
4. Return ONLY a valid JSON object matching the single page layout schema.`;

      let components: BuilderComponent[] = [];
      try {
        const pageResult = await callBackendGenerate(pageGenPrompt, 'layout', provider);
        const layoutPlan = pageResult.plan;
        components = mapPlanToComponents(layoutPlan);
      } catch (err) {
        console.warn(`[aiRouter] Single page UI generation failed for "${pagePlan.pageName}". Using fallback navbar/footer.`, err);
        components = mapPlanToComponents({
          pageName: pagePlan.pageName,
          description: '',
          components: [
            {
              type: 'nav-navbar',
              name: 'Navbar',
              x: 50,
              y: 0,
              width: 900,
              height: 64,
              zIndex: 1,
              contentOverrides: { brand: brandName, navLinks: navLinksStr }
            },
            {
              type: 'marketing-hero',
              name: 'Hero Section',
              x: 50,
              y: 84,
              width: 900,
              height: 360,
              zIndex: 2,
              contentOverrides: { title: `${pagePlan.pageName} Page`, text: `Explore the ${pagePlan.pageName} page layout.` }
            },
            {
              type: 'footer-block',
              name: 'Footer',
              x: 50,
              y: 464,
              width: 900,
              height: 280,
              zIndex: 10,
              contentOverrides: { brand: brandName }
            }
          ],
          imageKeywords: []
        });
      }

      builtPages.push({
        id: pagePlan.pageId,
        name: pagePlan.pageName,
        components
      });

      if (pagePlan.isHome) {
        homePageId = pagePlan.pageId;
      }
    }

    if (builtPages.length === 0) {
      throw new Error('Prototype generation produced zero pages.');
    }

    // STEP 3: Cross-link the pages
    const linkMap: Record<string, string> = {};
    for (const page of builtPages) {
      linkMap[page.name.toLowerCase()] = page.id;
    }
    linkMap['home'] = homePageId || builtPages[0].id;

    const allLinkedPages = builtPages.map((page) => {
      const components = page.components.map((c) => {
        // 1. Patch Navbar links
        if (c.type?.includes('nav') && c.content?.html) {
          const patched = patchNavbarLinks(c.content.html, linkMap);
          if (patched !== c.content.html) {
            totalLinks++;
            return { ...c, content: { ...c.content, html: patched } };
          }
        }
        
        // 2. Patch buttons / CTA text targets
        if (c.type?.includes('btn') || c.type?.includes('cta')) {
          const label = (c.content?.label || c.content?.text || '').toLowerCase();
          for (const [key, pageId] of Object.entries(linkMap)) {
            if (label.includes(key)) {
              totalLinks++;
              return { ...c, prototypeDestination: pageId };
            }
          }
        }
        return c;
      });
      
      return { ...page, components };
    });

    store.setLastProvider(planResult.provider);
    store.addHistoryEntry({
      prompt: userPrompt,
      provider: planResult.provider,
      componentCount: allLinkedPages.reduce(
        (sum, p) => sum + p.components.length,
        0
      ),
    });

    return {
      success: true,
      pages: allLinkedPages,
      homePageId: homePageId || allLinkedPages[0].id,
      provider: planResult.provider,
      linksApplied: totalLinks,
      rawResponse: planResult.rawResponse,
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
    const globalTheme = useBuilderStore.getState().globalTheme;
    const systemPrompt = buildLayoutSystemPrompt(globalTheme);
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
