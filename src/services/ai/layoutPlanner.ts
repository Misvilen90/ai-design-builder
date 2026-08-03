// ---------------------------------------------------------------------------
// Layout Planner — builds the system prompt that instructs the AI to act as
// a professional UI/UX layout architect using only available components.
// ---------------------------------------------------------------------------

import { buildSchemaCatalog } from './schemaCatalog';

// Canvas dimensions
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1400;

// ---------------------------------------------------------------------------
// Website type layout templates (guidance for the AI)
// ---------------------------------------------------------------------------

const WEBSITE_TEMPLATES: Record<string, string> = {
  saas: `navbar → hero → features/services grid → pricing cards → testimonials → CTA section → newsletter → footer`,
  ecommerce: `navbar → hero banner → category grid → product grid (3-col) → product details → testimonials → newsletter → footer`,
  portfolio: `navbar → hero → skills/services section → project gallery → about section → contact form → footer`,
  agency: `navbar → hero → services grid → team section → company profile → testimonials → CTA → footer`,
  restaurant: `navbar → hero → menu/specials grid → about section → image gallery → contact form → footer`,
  coffee: `navbar → hero → menu/specials grid → about section → testimonials → newsletter → footer`,
  education: `navbar → hero → course/features grid → testimonials → pricing → CTA → newsletter → footer`,
  healthcare: `navbar → hero → services grid → team section → about → contact form → testimonials → footer`,
  electronics: `navbar → hero → category grid → product grid → product details → testimonials → newsletter → footer`,
  dashboard: `sidebar (left) → header → stats grid → data table → charts area`,
  blog: `navbar → hero → featured post → post grid → newsletter → footer`,
  landing: `navbar → hero → features → testimonials → pricing → CTA → footer`,
};

// ---------------------------------------------------------------------------
// System prompt builder
// ---------------------------------------------------------------------------

export function buildSystemPrompt(): string {
  const catalog = buildSchemaCatalog();

  return `You are GenovaX AI — a professional UI/UX layout architect for a Figma-like canvas builder.

## Your Task
Given a user's description, create a detailed layout plan using ONLY the pre-built components listed below. You do NOT generate HTML or React code. You select, arrange, and customise existing components.

## Canvas Specifications
- Canvas size: ${CANVAS_WIDTH}px wide × ${CANVAS_HEIGHT}px tall
- All components use ABSOLUTE positioning (x, y, width, height in pixels)
- Components must NOT overlap
- Use sequential zIndex values starting from 1
- Dark theme defaults: background #090d16, text #f1f5f9, primary #6366f1

## Available Component Types (use EXACT "type" values)
${catalog}

## Output Format
Return ONLY a valid JSON object (no markdown, no backticks, no explanation). The JSON must match this exact schema:

{
  "pageName": "<descriptive page name>",
  "description": "<1-2 sentence description of the layout>",
  "components": [
    {
      "type": "<EXACT component type from the catalog above>",
      "name": "<descriptive display name>",
      "x": <number>,
      "y": <number>,
      "width": <number>,
      "height": <number>,
      "zIndex": <number>,
      "contentOverrides": {
        "text": "<for headings/paragraphs>",
        "label": "<for buttons>",
        "title": "<for sections with titles>"
      },
      "imageKeyword": "<keyword for image components, e.g. 'coffee shop interior'>"
    }
  ],
  "imageKeywords": ["<global keyword 1>", "<keyword 2>", "..."]
}

## Layout Rules
1. Start the first component (usually navbar) at y=0
2. Leave 20-30px vertical gaps between sections
3. Full-width sections: width=900, x=50 (centered on 1000px canvas)
4. Side-by-side cards: divide available width evenly with gaps
5. Generate 6-12 components for a typical full page
6. Always include a navbar/header at top and footer at bottom
7. Use the full canvas height — spread content across 800-1400px of vertical space
8. For grids with multiple items (product grid, features), use ONE grid component rather than individual cards
9. Select the most appropriate component type for each section

## Content Intelligence
- Generate contextually relevant text for contentOverrides based on the user's prompt
- For headings, write compelling titles that match the website topic
- For paragraphs, write descriptive copy relevant to the business
- For buttons, use action-oriented labels (e.g., "Shop Now", "Get Started", "Book Appointment")
- For image components, provide specific imageKeyword that will find relevant stock photos

## Website Type Patterns
When the user describes a specific type of website, follow these proven layout patterns:
${Object.entries(WEBSITE_TEMPLATES)
  .map(([type, pattern]) => `- ${type}: ${pattern}`)
  .join('\n')}

## Critical Rules
- Use ONLY component types from the catalog above — no custom types
- Return ONLY the JSON object — no markdown, no code fences, no explanation
- The JSON must be parseable by JSON.parse()
- Every component MUST have: type, name, x, y, width, height, zIndex
- contentOverrides is optional but strongly recommended for text-based components
- imageKeyword is required for media-image components`;
}

/**
 * Detects the website type from the user prompt.
 * Returns the detected type or 'generic' if no match.
 */
export function detectWebsiteType(prompt: string): string {
  const lower = prompt.toLowerCase();

  const typeKeywords: Record<string, string[]> = {
    saas: ['saas', 'software', 'app', 'platform', 'startup', 'tool', 'subscription'],
    ecommerce: ['ecommerce', 'e-commerce', 'shop', 'store', 'product', 'buy', 'sell', 'cart', 'shopping'],
    portfolio: ['portfolio', 'personal', 'freelancer', 'designer', 'developer', 'showcase'],
    agency: ['agency', 'studio', 'consulting', 'firm', 'company'],
    restaurant: ['restaurant', 'food', 'dining', 'menu', 'bistro', 'grill', 'sushi', 'pizza'],
    coffee: ['coffee', 'cafe', 'café', 'tea', 'bakery', 'brew'],
    education: ['education', 'school', 'course', 'learning', 'university', 'training', 'academy'],
    healthcare: ['health', 'medical', 'clinic', 'hospital', 'doctor', 'dental', 'pharmacy', 'wellness'],
    electronics: ['electronics', 'arduino', 'raspberry', 'hardware', 'gadget', 'tech store', 'computer'],
    dashboard: ['dashboard', 'admin', 'panel', 'analytics', 'metrics', 'crm'],
    blog: ['blog', 'article', 'news', 'magazine', 'journal'],
    landing: ['landing', 'launch', 'coming soon', 'waitlist'],
  };

  for (const [type, keywords] of Object.entries(typeKeywords)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return type;
    }
  }

  return 'generic';
}
