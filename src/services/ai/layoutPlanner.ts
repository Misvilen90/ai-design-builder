// ---------------------------------------------------------------------------
// Layout Planner — builds the system prompt that instructs the AI to act as
// a professional UI/UX layout architect using only available components.
// ---------------------------------------------------------------------------

import { buildSchemaCatalog } from './schemaCatalog';

// Canvas dimensions
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1600;

// ---------------------------------------------------------------------------
// Website type layout templates (guidance for the AI)
// ---------------------------------------------------------------------------

const WEBSITE_TEMPLATES: Record<string, { pattern: string; components: string[] }> = {
  saas: {
    pattern: 'navbar → hero → features/services → pricing → testimonials → CTA → newsletter → footer',
    components: ['nav-navbar', 'marketing-hero', 'business-services', 'card-pricing', 'marketing-testimonials', 'marketing-cta', 'marketing-newsletter', 'footer-block']
  },
  ecommerce: {
    pattern: 'navbar → hero → category grid → product grid → testimonials → newsletter → footer',
    components: ['nav-navbar', 'marketing-hero', 'business-services', 'ecommerce-grid', 'marketing-testimonials', 'marketing-newsletter', 'footer-block']
  },
  portfolio: {
    pattern: 'navbar → hero → skills/services → gallery → about → contact form → footer',
    components: ['nav-navbar', 'marketing-hero', 'business-services', 'media-gallery', 'business-about', 'form-contact', 'footer-simple']
  },
  agency: {
    pattern: 'navbar → hero → services → team → profile → testimonials → CTA → footer',
    components: ['nav-navbar', 'marketing-hero', 'business-services', 'business-team', 'business-profile', 'marketing-testimonials', 'marketing-cta', 'footer-block']
  },
  restaurant: {
    pattern: 'navbar → hero → services (menu/specials) → about → gallery → contact form → footer',
    components: ['nav-navbar', 'marketing-hero', 'business-services', 'business-about', 'media-gallery', 'form-contact', 'footer-simple']
  },
  coffee: {
    pattern: 'navbar → hero → services (drinks/menu) → about → testimonials → newsletter → footer',
    components: ['nav-navbar', 'marketing-hero', 'business-services', 'business-about', 'marketing-testimonials', 'marketing-newsletter', 'footer-simple']
  },
  education: {
    pattern: 'navbar → hero → services (courses) → testimonials → pricing → CTA → footer',
    components: ['nav-navbar', 'marketing-hero', 'business-services', 'marketing-testimonials', 'card-pricing', 'marketing-cta', 'footer-block']
  },
  healthcare: {
    pattern: 'navbar → hero → services → team → about → contact form → testimonials → footer',
    components: ['nav-navbar', 'marketing-hero', 'business-services', 'business-team', 'business-about', 'form-contact', 'marketing-testimonials', 'footer-simple']
  },
  electronics: {
    pattern: 'navbar → hero → services (categories) → product grid → testimonials → newsletter → footer',
    components: ['nav-navbar', 'marketing-hero', 'business-services', 'ecommerce-grid', 'marketing-testimonials', 'marketing-newsletter', 'footer-block']
  },
  dashboard: {
    pattern: 'sidebar → header → stats/content area',
    components: ['nav-sidebar', 'nav-navbar', 'layout-grid']
  },
  blog: {
    pattern: 'navbar → hero → featured post → post grid → newsletter → footer',
    components: ['nav-navbar', 'marketing-hero', 'card-feature', 'layout-grid', 'marketing-newsletter', 'footer-simple']
  },
  landing: {
    pattern: 'navbar → hero → features → testimonials → pricing → CTA → footer',
    components: ['nav-navbar', 'marketing-hero', 'business-services', 'marketing-testimonials', 'card-pricing', 'marketing-cta', 'footer-simple']
  },

  // ── New layout patterns ─────────────────────────────────────

  'grid-dashboard': {
    pattern: 'sidebar → header → stats grid → activity chart → recent projects → team → footer',
    components: ['nav-sidebar', 'nav-navbar', 'stats-counters', 'layout-grid', 'content-table', 'business-team', 'footer-simple']
  },
  'asymmetric-magazine': {
    pattern: 'navbar → large hero (2/3 width) → sidebar panel (1/3) → split gallery → testimonials → newsletter → footer',
    components: ['nav-navbar-centered', 'marketing-hero-split', 'business-profile', 'media-gallery', 'marketing-testimonials', 'marketing-newsletter', 'footer-block']
  },
  'sidebar-layout': {
    pattern: 'sidebar navigation → top header bar → main content area (stats + table + cards) → footer',
    components: ['nav-sidebar', 'nav-navbar', 'stats-counters', 'content-table', 'card-feature', 'footer-simple']
  },
  'showcase-portfolio': {
    pattern: 'transparent navbar → centered hero with large title → project grid (2×2) → about + stats → testimonials → contact form → minimal footer',
    components: ['nav-navbar-transparent', 'marketing-hero-centered', 'layout-grid', 'business-about', 'stats-counters', 'marketing-testimonials', 'form-contact', 'footer-minimal']
  },
  'saas-pricing': {
    pattern: 'navbar → hero → social proof logos → pricing table (3 tiers) → feature comparison → CTA → newsletter → footer',
    components: ['nav-navbar', 'marketing-hero', 'stats-counters', 'card-pricing-table', 'content-comparison', 'marketing-cta', 'marketing-newsletter', 'footer-block']
  },
  'mobile-app': {
    pattern: 'glass navbar → centered hero with app mockup → feature cards (3) → timeline roadmap → FAQ → CTA → minimal footer',
    components: ['nav-navbar-transparent', 'marketing-hero-centered', 'card-feature', 'content-timeline', 'marketing-faq', 'marketing-cta', 'footer-minimal']
  },
};

// ---------------------------------------------------------------------------
// Height guidance for each component type
// ---------------------------------------------------------------------------

const COMPONENT_HEIGHT_GUIDE: Record<string, number> = {
  'nav-navbar': 64,
  'marketing-hero': 360,
  'business-services': 300,
  'business-team': 300,
  'business-profile': 260,
  'business-about': 300,
  'marketing-testimonials': 280,
  'marketing-newsletter': 160,
  'marketing-cta': 180,
  'marketing-faq': 260,
  'ecommerce-grid': 320,
  'ecommerce-details': 340,
  'ecommerce-cart': 340,
  'ecommerce-checkout': 340,
  'card-pricing': 340,
  'card-feature': 180,
  'card-basic': 180,
  'card-product': 300,
  'card-testimonial': 180,
  'form-contact': 280,
  'form-login': 260,
  'form-register': 320,
  'footer-block': 280,
  'footer-simple': 120,
  'footer-copyright': 80,
  'footer-social': 160,
  'media-gallery': 220,
  'media-image': 240,
  'media-carousel': 320,
  'nav-sidebar': 500,
  'nav-menu': 54,
  'nav-tabs': 60,
  'layout-section': 300,
  'layout-grid': 200,
  'layout-cookie-banner': 80,
  'nav-navbar-centered': 64,
  'nav-navbar-transparent': 64,
  'marketing-hero-centered': 360,
  'marketing-hero-split': 360,
  'stats-counters': 140,
  'content-timeline': 300,
  'content-comparison': 260,
  'card-pricing-table': 340,
  'form-search': 42,
  'footer-minimal': 48,
};

// ---------------------------------------------------------------------------
// System prompt builder
// ---------------------------------------------------------------------------

export function buildSystemPrompt(theme?: any): string {
  const catalog = buildSchemaCatalog();

  const heightGuideText = Object.entries(COMPONENT_HEIGHT_GUIDE)
    .map(([type, h]) => `  "${type}": ${h}px tall`)
    .join('\n');

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

  return `You are GenovaX AI — a professional UI/UX layout architect for a component-based canvas builder.

## CRITICAL INSTRUCTION
You MUST use ONLY the exact "type" strings listed in the Component Catalog below.
Using any other type string will cause that component to be silently dropped and not rendered.

## Canvas Specifications
- Canvas: ${CANVAS_WIDTH}px wide × ${CANVAS_HEIGHT}px tall (absolute positioning)
- Components are positioned absolutely with x (left offset), y (top offset), width, height
- Components must NOT overlap. Stack them vertically with 20px gaps.
- Start at y=0 for the navbar
- Use sequential zIndex values (1, 2, 3...)

## ✅ Available Component Types (COPY THESE EXACTLY)
${catalog}

## ⚠️ REQUIRED Heights (use these exact pixel heights for each type)
${heightGuideText}
  For all other types use their defaultSize height from the catalog.
${themeInstructions}

## Output Format (RETURN ONLY THIS JSON — no markdown, no backticks)
{
  "pageName": "Page Name",
  "description": "Brief description",
  "components": [
    {
      "type": "nav-navbar",
      "name": "Main Navigation",
      "x": 50,
      "y": 0,
      "width": 900,
      "height": 64,
      "zIndex": 1,
      "contentOverrides": {
        "brand": "YourBrand",
        "navLinks": "Home, About, Services, Contact",
        "buttonText": "Get Started"
      },
      "styleOverrides": {
        "backgroundColor": "rgba(16, 23, 38, 0.9)",
        "borderColor": "#1e293b"
      }
    },
    {
      "type": "marketing-hero",
      "name": "Hero Section",
      "x": 50,
      "y": 84,
      "width": 900,
      "height": 360,
      "zIndex": 2,
      "contentOverrides": {
        "title": "Your Hero Heading Here",
        "text": "Your hero description text. Make it compelling.",
        "badge": "Launch Badge Text",
        "label": "Primary CTA Button"
      },
      "imageKeyword": "relevant photo keyword",
      "styleOverrides": {
        "borderRadius": "8px"
      }
    },
    {
      "type": "business-services",
      "name": "Services Section",
      "x": 50,
      "y": 464,
      "width": 900,
      "height": 300,
      "zIndex": 3,
      "contentOverrides": {
        "title": "Our Services",
        "service1_title": "Service One",
        "service1_text": "Description of first service.",
        "service2_title": "Service Two",
        "service2_text": "Description of second service.",
        "service3_title": "Service Three",
        "service3_text": "Description of third service."
      },
      "styleOverrides": {
        "borderRadius": "8px"
      }
    },
    {
      "type": "footer-block",
      "name": "Footer",
      "x": 50,
      "y": 1400,
      "width": 900,
      "height": 280,
      "zIndex": 10,
      "contentOverrides": {
        "brand": "YourBrand",
        "company": "YourBrand"
      },
      "styleOverrides": {
        "backgroundColor": "rgba(16, 23, 38, 0.95)"
      }
    }
  ],
  "imageKeywords": ["keyword1", "keyword2"]
}

## Website Layout Patterns (follow these for the given site type)
${Object.entries(WEBSITE_TEMPLATES).map(([type, t]) => `- **${type}**: ${t.pattern}
  Components to use (in order): ${t.components.join(' → ')}`).join('\n')}

## Professional UI/UX Design & Aesthetics Rules (CRITICAL)
Your designs must look like they were designed by a premium, professional web designer. Follow these rules:
1. **Sleek Modern Spacing**: Do not crowd elements. Use consistent paddings (32px to 48px) inside component styleOverrides.
2. **Glassmorphism & Fine Accents**: Use translucent dark component cards with thin, semi-transparent borders. For example, use styleOverrides like:
   '{ "backgroundColor": "rgba(16, 23, 38, 0.6)", "borderColor": "rgba(99, 102, 241, 0.12)", "borderWidth": "1px", "borderStyle": "solid", "borderRadius": "16px", "padding": "40px" }'.
3. **Color Harmony & Styling**: Use the selected theme colors consistently. Map primaryColor to buttons background and text highlights, accentColor to badges/icons, and backgroundColor/textColor to cards and typography.
4. **Contrast & Typographic Hierarchy**: Headings must be bold and clean. Body descriptions should be smaller, low-contrast, and readable. Use uppercase subheadings with wide letter spacing for badges.
5. **Modern Media Keywords**: Choose descriptive, high-quality Unsplash image keywords to match the theme (e.g. "modern tech dashboard interface screenshot", "minimalist creative office workspace", "abstract glowing fluid gradient design").

## Layout Rules
1. Always start with "nav-navbar" at y=0
2. Next component starts at y = (previous y + previous height + 20)
3. Full-width sections: x=50, width=900. Center them horizontally. Do not make x off-center.
4. Use the EXACT heights from the Required Heights guide above
5. Generate 7-11 components per page
6. Always end with a footer (footer-block, footer-simple, or footer-copyright)
7. Spread content across 1000-1400px total vertical space

## Content Rules
- brand/company = website/brand name (appear in navbar & footer)
- title = main heading text for sections
- text/description = body paragraph copy
- label/buttonText = button call-to-action text
- service1_title, service2_title, service3_title = the 3 feature/service names
- service1_text, service2_text, service3_text = their descriptions
- Generate content SPECIFIC to the user's prompt topic — never leave defaults

## DYNAMIC VARIATION RULES
1. DO NOT return the example layouts verbatim. Always vary the order, selection, and copy details based on the user request.
2. Mix and match component types creatively (e.g. use pricing cards, contact forms, testimonials, grids, timelines, and galleries dynamically).
3. Vary styling, heights, borders, and copy to fit the requested domain name and topic.

## ABSOLUTE RULES
1. ONLY use "type" values from the catalog — NEVER invent type names
2. Return ONLY the JSON object — no markdown, no \`\`\`, no text before/after
3. Every component needs: type, name, x, y, width, height, zIndex
4. Heights MUST match the Required Heights guide or the component will render incorrectly`;
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
    'grid-dashboard': ['dashboard', 'admin', 'analytics', 'metrics', 'crm', 'management'],
    'asymmetric-magazine': ['magazine', 'editorial', 'blog magazine', 'content site', 'publication'],
    'sidebar-layout': ['sidebar', 'side navigation', 'app layout', 'web app'],
    'showcase-portfolio': ['showcase', 'creative portfolio', 'designer', 'photography', 'artist portfolio'],
    'saas-pricing': ['pricing page', 'comparison', 'plans', 'subscription'],
    'mobile-app': ['mobile app', 'app landing', 'app showcase', 'ios app', 'android app'],
  };

  for (const [type, keywords] of Object.entries(typeKeywords)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return type;
    }
  }

  return 'generic';
}
