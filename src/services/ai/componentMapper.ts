// ---------------------------------------------------------------------------
// Component Mapper — converts an AILayoutPlan into BuilderComponent[]
// ready for the Zustand store.
// ---------------------------------------------------------------------------

import type { AILayoutPlan, AIComponentPlan } from './types';
import type { BuilderComponent } from '../../store/useBuilderStore';
import { COMPONENT_SCHEMAS } from '../../store/schemas';
import { resolveType } from './schemaCatalog';
import { getImageForKeyword, resetImageTracker } from '../imageService';
import { flattenEmbeddedControls } from './extractEmbeddedControls';

// ---------------------------------------------------------------------------
// Main mapping function
// ---------------------------------------------------------------------------

/**
 * Takes an AI-generated layout plan and converts each component entry
 * into a full BuilderComponent using schemas + overrides.
 *
 * - Resolves type aliases
 * - Clones default content & style from the schema
 * - Applies contentOverrides from the AI
 * - Injects real image URLs for image components
 * - Assigns unique IDs
 */
export function mapPlanToComponents(plan: AILayoutPlan): BuilderComponent[] {
  // Reset image tracker so each generation gets fresh images
  resetImageTracker();

  const components: BuilderComponent[] = [];
  const skipped: string[] = [];

  for (let i = 0; i < plan.components.length; i++) {
    const entry = plan.components[i];
    const mapped = mapSingleComponent(entry, i);

    if (mapped) {
      components.push(mapped);
    } else {
      skipped.push(`${entry.type} ("${entry.name}")`);
    }
  }

  if (skipped.length > 0) {
    console.warn(
      `[ComponentMapper] Skipped ${skipped.length} unresolvable component(s):`,
      skipped
    );
  }

  return flattenEmbeddedControls(components);
}

// ---------------------------------------------------------------------------
// Single component mapper
// ---------------------------------------------------------------------------

function mapSingleComponent(
  entry: AIComponentPlan,
  index: number
): BuilderComponent | null {
  // 1. Resolve the type to a valid schema key
  const resolvedType = resolveType(entry.type);
  if (!resolvedType) {
    console.warn(
      `[ComponentMapper] Cannot resolve type "${entry.type}" — skipping "${entry.name}"`
    );
    return null;
  }

  const schema = COMPONENT_SCHEMAS[resolvedType];
  if (!schema) return null;

  // 2. Clone default content & style from the schema
  const content = deepClone(schema.defaultContent);
  const style = deepClone(schema.defaultStyle);

  // 3. Apply content overrides from the AI (Zustand values)
  if (entry.contentOverrides) {
    for (const [key, value] of Object.entries(entry.contentOverrides)) {
      if (value !== undefined && value !== null && value !== '') {
        content[key] = value;
      }
    }
  }

  // 4. Handle image injection for media-image components
  if (entry.imageKeyword) {
    injectImage(resolvedType, content, entry.imageKeyword);
  }

  // 5. Parse and apply dynamic text & image replacements inside HTML strings
  parseAndApplyHtmlOverrides(resolvedType, content, entry.contentOverrides, entry.imageKeyword);

  // 6. Build the final BuilderComponent
  const component: BuilderComponent = {
    id: `${resolvedType}-${Date.now()}-${index}`,
    type: resolvedType,
    name: entry.name || schema.name,
    category: schema.category,
    icon: schema.icon,
    content,
    style: {
      backgroundColor: 'transparent',
      ...style,
    },
    position: {
      left: Math.max(0, Math.round(entry.x ?? 50)),
      top: Math.max(0, Math.round(entry.y ?? index * 200)),
      width: Math.max(50, Math.round(entry.width ?? schema.defaultPosition.width)),
      height: Math.max(30, Math.round(entry.height ?? schema.defaultPosition.height)),
      rotate: 0,
      zIndex: entry.zIndex ?? index + 1,
    },
    locked: false,
    visible: true,
  };

  return component;
}

// ---------------------------------------------------------------------------
// Image injection
// ---------------------------------------------------------------------------

function injectImage(
  type: string,
  content: Record<string, any>,
  keyword: string
): void {
  const url = getImageForKeyword(keyword, 600, 400);

  // For media-image components, set the src field
  if (type === 'media-image') {
    content.src = url;
    content.alt = keyword;
    return;
  }
}

// ---------------------------------------------------------------------------
// HTML replacement engine
// ---------------------------------------------------------------------------

function parseAndApplyHtmlOverrides(
  type: string,
  content: Record<string, any>,
  overrides: Record<string, any> | undefined,
  imageKeyword: string | undefined
): void {
  if (!content.html || typeof content.html !== 'string') return;
  let html = content.html;

  // 1. If imageKeyword is provided and we have Unsplash images in the HTML, replace them
  if (imageKeyword) {
    const url = getImageForKeyword(imageKeyword, 600, 400);
    const imgRegex = /src=["'](https:\/\/images\.unsplash\.com\/[^"']+)["']/g;
    html = html.replace(imgRegex, `src="${url}"`);
  }

  // If no overrides, save the updated images and return
  if (!overrides) {
    content.html = html;
    return;
  }

  const clean = (val: any) => (val !== undefined && val !== null ? String(val).trim() : '');

  // Helper helper to replace a default substring with an override
  const replaceStr = (search: string, newVal: string) => {
    if (!newVal) return;
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(escaped, 'g'), newVal);
  };

  // 2. Perform replacements based on component type
  switch (type) {
    case 'nav-navbar': {
      const brand = clean(overrides.brand || overrides.title || overrides.logo);
      if (brand) replaceStr('⚡ GENOVAX', brand.startsWith('⚡') ? brand : `⚡ ${brand}`);
      const btn = clean(overrides.label || overrides.buttonText);
      if (btn) replaceStr('Sign In', btn);
      break;
    }
    case 'marketing-hero': {
      const title = clean(overrides.title);
      if (title) replaceStr('Design Web Interfaces at the Speed of Thought', title);
      const text = clean(overrides.text || overrides.description);
      if (text) replaceStr('Instantiate, drag, lock, snap, and compile design frames with our professional absolute-positioned builder canvas.', text);
      const badge = clean(overrides.badge || overrides.subtitle);
      if (badge) replaceStr('GenovaX AI Launch', badge);
      const btn = clean(overrides.label || overrides.buttonText);
      if (btn) replaceStr('Get Started Free', btn);
      break;
    }
    case 'business-about': {
      const title = clean(overrides.title);
      if (title) replaceStr('We Build the Future of Frontend Design', title);
      const text = clean(overrides.text || overrides.description);
      if (text) replaceStr('Our unified canvas workspace allows teams to prototype visual elements, customize layouts, edit inline texts, and compile code in real-time without deployment latency.', text);
      const badge = clean(overrides.badge || overrides.subtitle);
      if (badge) replaceStr('About Our Mission', badge);
      break;
    }
    case 'business-services': {
      const title = clean(overrides.title);
      if (title) replaceStr('Our Core Services', title);
      const s1_title = clean(overrides.service1_title || overrides.feature1_title);
      if (s1_title) replaceStr('UX/UI Layouts', s1_title);
      const s1_text = clean(overrides.service1_text || overrides.feature1_text);
      if (s1_text) replaceStr('Stunning mockup layouts styled dynamically.', s1_text);
      const s2_title = clean(overrides.service2_title || overrides.feature2_title);
      if (s2_title) replaceStr('Rapid Building', s2_title);
      const s2_text = clean(overrides.service2_text || overrides.feature2_text);
      if (s2_text) replaceStr('Compile design modules instantly to web output.', s2_text);
      const s3_title = clean(overrides.service3_title || overrides.feature3_title);
      if (s3_title) replaceStr('API Integrations', s3_title);
      const s3_text = clean(overrides.service3_text || overrides.feature3_text);
      if (s3_text) replaceStr('Custom business workflows mapped automatically.', s3_text);
      break;
    }
    case 'business-team': {
      const title = clean(overrides.title);
      if (title) replaceStr('Meet Our Leadership Team', title);
      break;
    }
    case 'business-profile': {
      const title = clean(overrides.title);
      if (title) replaceStr('GenovaX Technologies', title);
      const text = clean(overrides.text);
      if (text) replaceStr('GenovaX is a next-generation website building platform bridging static design wireframes with React component compilation and hosting services.', text);
      break;
    }
    case 'marketing-testimonials': {
      const title = clean(overrides.title);
      if (title) replaceStr('What Our Customers Say', title);
      const badge = clean(overrides.badge || overrides.subtitle);
      if (badge) replaceStr('Testimonials', badge);
      break;
    }
    case 'marketing-faq': {
      const title = clean(overrides.title);
      if (title) replaceStr('Frequently Asked Questions', title);
      break;
    }
    case 'marketing-newsletter': {
      const title = clean(overrides.title);
      if (title) replaceStr('Subscribe to Newsletter', title);
      const text = clean(overrides.text || overrides.description);
      if (text) replaceStr('Get product release news and discounts.', text);
      const btn = clean(overrides.label || overrides.buttonText);
      if (btn) replaceStr('Join', btn);
      break;
    }
    case 'marketing-cta': {
      const title = clean(overrides.title);
      if (title) replaceStr('Ready to Build Something Awesome?', title);
      const text = clean(overrides.text || overrides.description);
      if (text) replaceStr('Create beautiful grids, edit inline texts, and deploy now.', text);
      const btn = clean(overrides.label || overrides.buttonText);
      if (btn) replaceStr('Start Free Trial', btn);
      break;
    }
    case 'ecommerce-grid': {
      const p1_title = clean(overrides.product1_title || overrides.item1_title);
      if (p1_title) replaceStr('Classic Red Sneaker', p1_title);
      const p1_price = clean(overrides.product1_price || overrides.item1_price);
      if (p1_price) replaceStr('$89.00', p1_price.startsWith('$') ? p1_price : `$${p1_price}`);
      
      const p2_title = clean(overrides.product2_title || overrides.item2_title);
      if (p2_title) replaceStr('Minimalist Smart Watch', p2_title);
      const p2_price = clean(overrides.product2_price || overrides.item2_price);
      if (p2_price) replaceStr('$199.00', p2_price.startsWith('$') ? p2_price : `$${p2_price}`);
      
      const p3_title = clean(overrides.product3_title || overrides.item3_title);
      if (p3_title) replaceStr('Retro Sunglasses', p3_title);
      const p3_price = clean(overrides.product3_price || overrides.item3_price);
      if (p3_price) replaceStr('$45.00', p3_price.startsWith('$') ? p3_price : `$${p3_price}`);
      break;
    }
    case 'ecommerce-product-card': {
      const title = clean(overrides.title);
      if (title) replaceStr('Premium Product', title);
      const price = clean(overrides.price);
      if (price) replaceStr('$99.00', price.startsWith('$') ? price : `$${price}`);
      break;
    }
    case 'ecommerce-details': {
      const title = clean(overrides.title);
      if (title) replaceStr('Classic Red Comfort Sneaker', title);
      const text = clean(overrides.text || overrides.description);
      if (text) replaceStr('Engineered comfort, featuring mesh structures and flexible red sole linings designed to last forever.', text);
      const price = clean(overrides.price);
      if (price) replaceStr('$89.00', price.startsWith('$') ? price : `$${price}`);
      const btn = clean(overrides.label || overrides.buttonText);
      if (btn) replaceStr('Add to Cart', btn);
      break;
    }
    case 'footer-simple': {
      const brand = clean(overrides.brand || overrides.title);
      if (brand) replaceStr('⚡ GenovaX AI Builder', brand.startsWith('⚡') ? brand : `⚡ ${brand}`);
      break;
    }
    case 'footer-block': {
      const brand = clean(overrides.brand || overrides.title);
      if (brand) replaceStr('⚡ GenovaX', brand.startsWith('⚡') ? brand : `⚡ ${brand}`);
      const compName = clean(overrides.company || overrides.brand || overrides.title);
      if (compName) replaceStr('© 2026 GenovaX Technologies.', `© 2026 ${compName}.`);
      break;
    }
    case 'footer-copyright': {
      const brand = clean(overrides.brand || overrides.title || 'GENOVAX').toUpperCase();
      replaceStr('© 2026 GENOVAX. DESIGNED AT THE SPEED OF THOUGHT.', `© 2026 ${brand}. DESIGNED AT THE SPEED OF THOUGHT.`);
      break;
    }
  }

  content.html = html;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

