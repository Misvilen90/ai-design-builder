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

export function buildPrototypeSystemPrompt(siteType: string, theme?: any): string {
  const catalog = buildSchemaCatalog();
  const template = SITE_PAGE_TEMPLATES[siteType] || SITE_PAGE_TEMPLATES.generic;

  const pagesGuide = template.pages.map(p => `"${p}"`).join(', ');
  const linksGuide = template.links.map(l => `  - ${l}`).join('\n');

  let themeInstructions = '';
  if (theme) {
    themeInstructions = `
## Selected Theme & Style Rules (CRITICAL)
The user has chosen a specific visual theme. You MUST apply these theme settings to EACH component by setting style properties inside the "styleOverrides" field in the component JSON (e.g. "styleOverrides": { "backgroundColor": "#...", "color": "#...", "borderRadius": "..." }).
Theme colors and typography parameters:
- Primary Color: ${theme.primaryColor || '#6366f1'} (Use for main interactive controls like buttons, highlights, primary text, links)
- Secondary Color: ${theme.secondaryColor || '#4f46e5'} (Use for borders, hover states, secondary elements)
- Accent Color: ${theme.accentColor || '#818cf8'} (Use for icons, subtle highlights, badges)
- Background Color: ${theme.backgroundColor || '#090d16'} (Use for component cards, section backgrounds, container overlays)
- Text Color: ${theme.textColor || '#f1f5f9'} (Use for paragraph texts, labels, secondary headers)
- Font Family: ${theme.fontFamily || 'sans-serif'} (Apply to "fontFamily" property for typography consistency)
- Border Radius: ${theme.borderRadius || '8px'} (Use for "borderRadius" property on buttons, cards, images, sections)
- Box Shadow: ${theme.boxShadow || 'none'} (Use for "boxShadow" property on cards, buttons)

Always map these properties into "styleOverrides" values in your JSON return structure where appropriate.
`;
  }

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
${themeInstructions}

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
          "styleOverrides": {
            "backgroundColor": "<matching background or secondary color>",
            "color": "<matching text color>",
            "borderRadius": "<matching border radius>"
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

## Professional UI/UX Design & Aesthetics Rules (CRITICAL)
Your designs must look like they were designed by a premium, professional web designer. Follow these rules:
1. **Sleek Modern Spacing**: Do not crowd elements. Use consistent paddings (32px to 48px) inside component styleOverrides.
2. **Glassmorphism & Fine Accents**: Use translucent dark component cards with thin, semi-transparent borders. For example, use styleOverrides like:
   '{ "backgroundColor": "rgba(16, 23, 38, 0.6)", "borderColor": "rgba(99, 102, 241, 0.12)", "borderWidth": "1px", "borderStyle": "solid", "borderRadius": "16px", "padding": "40px" }'.
3. **Color Harmony & Styling**: Use the selected theme colors consistently. Map primaryColor to buttons background and text highlights, accentColor to badges/icons, and backgroundColor/textColor to cards and typography.
4. **Contrast & Typographic Hierarchy**: Headings must be bold and clean. Body descriptions should be smaller, low-contrast, and readable. Use uppercase subheadings with wide letter spacing for badges.
5. **Modern Media Keywords**: Choose descriptive, high-quality Unsplash image keywords to match the theme (e.g. "modern tech dashboard interface screenshot", "minimalist creative office workspace", "abstract glowing fluid gradient design").

## Layout Rules Per Page
1. Start every page with a navbar (y=0, full width 900px, x=50). The navbar on every page MUST display exactly the same navigation links representing the pages in this prototype.
2. The prototype pages generated MUST match exactly 1:1 with the links in the Home page's navbar (e.g. if the navbar lists Home, Features, Pricing, and Contact, then the prototype must consist of exactly those 4 pages with pageIds matching those slugs: 'home', 'features', 'pricing', 'contact'). Do not generate extraneous pages.
3. The Home Page itself must act as a comprehensive single-page overview containing all key layout sections (such as Hero, Features/Products grid, Testimonials, CTA, and Footer) styled professionally.
4. End every page with a footer.
5. Leave 20-30px vertical gaps between sections.
6. Full-width sections: width=900, x=50. Center them horizontally. Do not make x off-center.
7. Generate 6-10 components per page.
8. Spread content across 800-1300px of vertical space per page.
9. For grids, use ONE grid component rather than individual cards.

## Content Intelligence
- Generate unique, contextually relevant content for EACH page.
- Navbar brand name and link options must be identical across all pages.
- Home page hero should be bold and action-oriented.
- Links (in the "links" array) must use the EXACT component "name" as written in that page's components.
- toPageId values must match a pageId declared in the pages array.

## Linking Rules
- Every navigation link, menu item, and CTA button in the navbar/footer must link directly to the corresponding pageId in the prototype.
- To link an individual navbar item or sub-element (such as a text link like "Features", "Pricing", or "Docs"), you MUST add an entry in the page's "links" array where "componentName" is the exact text label of that link (e.g., "Features", "Pricing", "Docs", "Log In", "Sign Up") and "toPageId" is the target page's pageId.
- Hero CTA buttons should link to the next logical page in the user journey (e.g. "Pricing" or "Features").
- "Contact Us" / "Get in Touch" buttons should link to the contact page.

## DYNAMIC VARIATION RULES
1. DO NOT return identical layout plans for similar prompts. Introduce variations in component type selections, copy, ordering, and themes.
2. Adapt design structure to fit the requested brand identity.

## Critical Rules
- Return ONLY the JSON object — no markdown, no code fences, no explanation
- The JSON must be parseable by JSON.parse()
- Every component MUST have: type, name, x, y, width, height, zIndex
- Generate EXACTLY 4 pages total. The pages must match the main navigation links.
- The "links" array in each page can be empty [] if no outgoing links from that page
- isHome must be true for exactly ONE page (the main landing page)`;
}
