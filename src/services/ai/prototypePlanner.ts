// ---------------------------------------------------------------------------
// Prototype Planner — builds the system prompt for multi-page prototype
// generation. The AI is instructed to plan ALL pages of the site and link
// navigational elements (buttons, navbar links, CTAs) across pages.
// ---------------------------------------------------------------------------

import { buildSchemaCatalog } from './schemaCatalog';

// ---------------------------------------------------------------------------
// Multi-page site templates — which pages a given site type needs
// ---------------------------------------------------------------------------

const SITE_PAGE_TEMPLATES: Record<string, { pages: string[]; links: string[] }> = {
  ecommerce: {
    pages: ['home', 'products', 'product-detail', 'cart', 'contact'],
    links: [
      'home → products (via "Shop Now" or "Browse Products" button in hero)',
      'home → contact (via "Contact Us" link in navbar or footer)',
      'products → product-detail (via product card "View Details" button)',
      'products → cart (via "Add to Cart" button)',
      'product-detail → cart (via "Add to Cart" button)',
      'cart → products (via "Continue Shopping" button)',
    ],
  },
  saas: {
    pages: ['home', 'features', 'pricing', 'blog', 'contact'],
    links: [
      'home → features (via "See Features" or "Learn More" button)',
      'home → pricing (via "View Pricing" or "Get Started" button)',
      'home → contact (via "Contact Sales" or navbar link)',
      'features → pricing (via "Get Started" CTA)',
      'pricing → contact (via "Contact Sales" link)',
    ],
  },
  portfolio: {
    pages: ['home', 'projects', 'about', 'contact'],
    links: [
      'home → projects (via "View My Work" or "See Projects" button)',
      'home → contact (via "Hire Me" or "Get In Touch" button)',
      'projects → contact (via CTA button)',
      'about → contact (via "Get In Touch" button)',
    ],
  },
  agency: {
    pages: ['home', 'services', 'portfolio', 'team', 'contact'],
    links: [
      'home → services (via "Our Services" button or navbar link)',
      'home → portfolio (via "View Our Work" button)',
      'home → contact (via "Get a Quote" CTA)',
      'services → contact (via "Get Started" button)',
      'portfolio → contact (via "Start a Project" CTA)',
    ],
  },
  restaurant: {
    pages: ['home', 'menu', 'gallery', 'reservations', 'contact'],
    links: [
      'home → menu (via "View Menu" button in hero)',
      'home → reservations (via "Reserve a Table" button)',
      'menu → reservations (via "Book a Table" button)',
      'gallery → reservations (via "Reserve Now" CTA)',
    ],
  },
  healthcare: {
    pages: ['home', 'services', 'doctors', 'appointments', 'contact'],
    links: [
      'home → appointments (via "Book Appointment" hero button)',
      'home → services (via "Our Services" section or navbar link)',
      'home → doctors (via "Meet Our Doctors" section link)',
      'services → appointments (via "Book Now" button)',
      'doctors → appointments (via "Schedule with this Doctor" button)',
    ],
  },
  education: {
    pages: ['home', 'courses', 'about', 'pricing', 'contact'],
    links: [
      'home → courses (via "Browse Courses" button in hero)',
      'home → pricing (via "See Plans" button)',
      'courses → pricing (via "Enroll Now" button)',
      'pricing → contact (via "Contact Us" link)',
    ],
  },
  'saas-pricing': {
    pages: ['home', 'features', 'pricing', 'faq', 'contact'],
    links: [
      'home → features (via "See Features" button)',
      'home → pricing (via "View Plans" button)',
      'features → pricing (via "Get Started" CTA)',
      'pricing → faq (via "FAQ" link in footer)',
      'pricing → contact (via "Contact Sales" button)',
    ],
  },
  'showcase': {
    pages: ['home', 'projects', 'about', 'contact'],
    links: [
      'home → projects (via "View Projects" button)',
      'home → about (via "Learn More" button)',
      'projects → contact (via "Start a Project" CTA)',
      'about → contact (via "Get in Touch" button)',
    ],
  },
  'dashboard': {
    pages: ['dashboard', 'analytics', 'settings', 'team'],
    links: [
      'dashboard → analytics (via "View Analytics" sidebar link)',
      'dashboard → settings (via "Settings" sidebar link)',
      'dashboard → team (via "Team" sidebar link)',
      'analytics → settings (via "Configure" button)',
    ],
  },
  generic: {
    pages: ['home', 'about', 'services', 'contact'],
    links: [
      'home → services (via "Our Services" button)',
      'home → about (via "Learn More" button)',
      'home → contact (via "Get In Touch" CTA)',
      'services → contact (via "Get Started" button)',
    ],
  },
};

// ---------------------------------------------------------------------------
// Detect site type from prompt
// ---------------------------------------------------------------------------

export function detectPrototypeType(prompt: string): string {
  const lower = prompt.toLowerCase();
  const typeKeywords: Record<string, string[]> = {
    ecommerce: ['ecommerce', 'e-commerce', 'shop', 'store', 'product', 'buy', 'sell', 'cart', 'shopping'],
    saas: ['saas', 'software', 'app', 'platform', 'startup', 'tool', 'subscription'],
    portfolio: ['portfolio', 'personal', 'freelancer', 'designer', 'developer', 'showcase'],
    agency: ['agency', 'studio', 'consulting', 'firm'],
    restaurant: ['restaurant', 'food', 'dining', 'menu', 'bistro', 'cafe', 'coffee', 'bakery'],
    healthcare: ['health', 'medical', 'clinic', 'hospital', 'doctor', 'dental', 'wellness'],
    education: ['education', 'school', 'course', 'learning', 'university', 'training', 'academy'],
    showcase: ['showcase', 'portfolio', 'gallery', 'creative', 'designer', 'photography', 'artist'],
    dashboard: ['dashboard', 'admin', 'panel', 'analytics', 'metrics', 'crm', 'management'],
  };

  for (const [type, keywords] of Object.entries(typeKeywords)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return type;
    }
  }
  return 'generic';
}

// ---------------------------------------------------------------------------
// System prompt builder
// ---------------------------------------------------------------------------

export function buildPrototypeSystemPrompt(siteType: string): string {
  const catalog = buildSchemaCatalog();
  const template = SITE_PAGE_TEMPLATES[siteType] || SITE_PAGE_TEMPLATES.generic;

  const pagesGuide = template.pages.map(p => `"${p}"`).join(', ');
  const linksGuide = template.links.map(l => `  - ${l}`).join('\n');

  return `You are GenovaX AI — a professional UI/UX architect that generates complete multi-page website prototypes.

## Your Task
Given a user's description, generate a FULL MULTI-PAGE PROTOTYPE as a JSON plan.
You design ALL pages of the site AND specify which elements link to which pages.
You use ONLY the pre-built component catalog listed below — no raw HTML or React code.

## Canvas Specifications
- Canvas size: 1000px wide × 1400px tall
- All components use ABSOLUTE positioning (x, y, width, height in pixels)
- Components must NOT overlap vertically
- Use sequential zIndex values starting from 1 within each page
- Dark theme defaults: background #090d16, text #f1f5f9, primary #6366f1

## Available Component Types (use EXACT "type" values)
${catalog}

## Output Format
Return ONLY a valid JSON object. No markdown, no backticks, no extra text.

{
  "siteDescription": "<1 sentence describing the whole site>",
  "pages": [
    {
      "pageId": "<short-slug e.g. home, products, cart>",
      "pageName": "<Human-readable Page Name>",
      "isHome": true,
      "components": [
        {
          "type": "<EXACT type from catalog>",
          "name": "<descriptive name>",
          "x": <number>,
          "y": <number>,
          "width": <number>,
          "height": <number>,
          "zIndex": <number>,
          "contentOverrides": {
            "text": "<for headings/paragraphs>",
            "label": "<for buttons>",
            "title": "<for section titles>",
            "brand": "<for navbar brand name>"
          },
          "imageKeyword": "<keyword for image components>"
        }
      ],
      "links": [
        {
          "componentName": "<exact component name that should be clickable>",
          "toPageId": "<target pageId from this prototype>"
        }
      ]
    }
  ]
}

## Site Architecture for this Request
For this ${siteType} site, generate these pages: ${pagesGuide}

Suggested inter-page links to implement:
${linksGuide}

## Layout Rules Per Page
1. Start every page with a navbar (y=0, full width 900px, x=50)
2. End every page with a footer
3. Leave 20-30px vertical gaps between sections
4. Full-width sections: width=900, x=50
5. Generate 6-10 components per page
6. Spread content across 800-1300px of vertical space per page
7. For grids, use ONE grid component rather than individual cards

## Content Intelligence
- Generate unique, contextually relevant content for EACH page
- Navbar brand name should be consistent across all pages
- Home page hero should be bold and action-oriented
- Links (in the "links" array) must use the EXACT component "name" as written in that page's components
- toPageId values must match a pageId declared in the pages array

## Linking Rules
- The navbar on every page should have its main CTA button linked to the most relevant page
- Hero CTA buttons should link to the next logical page in the user journey
- "Contact Us" / "Get in Touch" buttons should link to the contact page
- Every page's navbar links should connect to other major pages

## Critical Rules
- Return ONLY the JSON object — no markdown, no code fences, no explanation
- The JSON must be parseable by JSON.parse()
- Every component MUST have: type, name, x, y, width, height, zIndex
- Maximum 6 pages total
- The "links" array in each page can be empty [] if no outgoing links from that page
- isHome must be true for exactly ONE page (the main landing page)`;
}
