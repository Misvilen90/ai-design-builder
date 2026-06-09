// ---------------------------------------------------------------------------
// Schema Catalog — reads COMPONENT_SCHEMAS and builds a structured catalog
// that the AI system prompt can consume.
// ---------------------------------------------------------------------------

import { COMPONENT_SCHEMAS, type ComponentSchema } from '../../store/schemas';

// ---------------------------------------------------------------------------
// 1.  Available types
// ---------------------------------------------------------------------------

/** Returns all valid component type keys from the schema registry. */
export function getAvailableTypes(): string[] {
  return Object.keys(COMPONENT_SCHEMAS);
}

/** Lookup a single schema by its type key. Returns undefined if not found. */
export function getSchemaByType(type: string): ComponentSchema | undefined {
  return COMPONENT_SCHEMAS[type];
}

// ---------------------------------------------------------------------------
// 2.  Type alias map — lets the AI use human-friendly names
// ---------------------------------------------------------------------------

/**
 * Maps common shorthand / human-friendly names to actual schema keys.
 * The layout planner prompt encourages the AI to use exact schema keys,
 * but this map provides a safety net for common variations.
 */
export const TYPE_ALIASES: Record<string, string> = {
  // Layout
  'container': 'layout-container',
  'section': 'layout-section',
  'grid': 'layout-grid',
  'row': 'layout-row',
  'column': 'layout-column',

  // Navigation
  'navbar': 'nav-navbar',
  'nav': 'nav-navbar',
  'navigation': 'nav-navbar',
  'sidebar': 'nav-sidebar',
  'breadcrumb': 'nav-breadcrumb',
  'menu': 'nav-menu',
  'tabs': 'nav-tabs',

  // Content
  'heading': 'content-heading',
  'h1': 'content-heading',
  'title': 'content-heading',
  'paragraph': 'content-paragraph',
  'text': 'content-paragraph',
  'textblock': 'content-textblock',
  'text-block': 'content-textblock',
  'list': 'content-list',
  'table': 'content-table',

  // Media
  'image': 'media-image',
  'img': 'media-image',
  'video': 'media-video',
  'gallery': 'media-gallery',
  'carousel': 'media-carousel',

  // Buttons
  'button': 'btn-primary',
  'primary-button': 'btn-primary',
  'secondary-button': 'btn-secondary',
  'icon-button': 'btn-icon',
  'cta-button': 'btn-cta',

  // Cards
  'card': 'card-basic',
  'basic-card': 'card-basic',
  'feature-card': 'card-feature',
  'product-card': 'card-product',
  'pricing-card': 'card-pricing',
  'pricing': 'card-pricing',
  'testimonial-card': 'card-testimonial',

  // Forms
  'input': 'form-input',
  'textarea': 'form-textarea',
  'select': 'form-select',
  'checkbox': 'form-checkbox',
  'radio': 'form-radio',
  'contact-form': 'form-contact',
  'contact': 'form-contact',
  'login-form': 'form-login',
  'login': 'form-login',
  'register-form': 'form-register',
  'register': 'form-register',
  'registration': 'form-register',

  // Business
  'services': 'business-services',
  'services-section': 'business-services',
  'team': 'business-team',
  'team-section': 'business-team',
  'company-profile': 'business-profile',
  'profile': 'business-profile',
  'about': 'business-about',
  'about-us': 'business-about',
  'about-section': 'business-about',

  // Marketing
  'hero': 'marketing-hero',
  'hero-section': 'marketing-hero',
  'hero-banner': 'marketing-hero',
  'herobanner': 'marketing-hero',
  'testimonials': 'marketing-testimonials',
  'testimonials-section': 'marketing-testimonials',
  'faq': 'marketing-faq',
  'faq-section': 'marketing-faq',
  'newsletter': 'marketing-newsletter',
  'newsletter-signup': 'marketing-newsletter',
  'cta': 'marketing-cta',
  'cta-section': 'marketing-cta',
  'call-to-action': 'marketing-cta',

  // E-Commerce
  'product-grid': 'ecommerce-grid',
  'products': 'ecommerce-grid',
  'products-grid': 'ecommerce-grid',
  'ecommerce-product-card': 'ecommerce-product-card',
  'shop-card': 'ecommerce-product-card',
  'cart': 'ecommerce-cart',
  'shopping-cart': 'ecommerce-cart',
  'product-details': 'ecommerce-details',
  'checkout': 'ecommerce-checkout',
  'checkout-form': 'ecommerce-checkout',

  // Footer
  'footer': 'footer-block',
  'simple-footer': 'footer-simple',
  'footer-simple': 'footer-simple',
  'social-footer': 'footer-social',
  'copyright-footer': 'footer-copyright',
  'copyright': 'footer-copyright',
};

/**
 * Resolves a type string to a valid schema key.
 * 1. Try exact match in COMPONENT_SCHEMAS
 * 2. Try lowercase alias map
 * 3. Return null if nothing matches
 */
export function resolveType(type: string): string | null {
  const normalised = type.trim();

  // Exact match
  if (COMPONENT_SCHEMAS[normalised]) return normalised;

  // Alias match (case-insensitive)
  const lower = normalised.toLowerCase();
  if (TYPE_ALIASES[lower] && COMPONENT_SCHEMAS[TYPE_ALIASES[lower]]) {
    return TYPE_ALIASES[lower];
  }

  // Partial / fuzzy: try with dashes and without
  for (const key of Object.keys(COMPONENT_SCHEMAS)) {
    if (key.toLowerCase() === lower) return key;
  }

  return null;
}

// ---------------------------------------------------------------------------
// 3.  Catalog builder — structured text for the AI system prompt
// ---------------------------------------------------------------------------

interface CatalogEntry {
  type: string;
  name: string;
  category: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
}

function getCatalogEntries(): CatalogEntry[] {
  return Object.values(COMPONENT_SCHEMAS).map((s) => ({
    type: s.type,
    name: s.name,
    category: s.category,
    icon: s.icon,
    defaultWidth: s.defaultPosition.width,
    defaultHeight: s.defaultPosition.height,
  }));
}

/**
 * Builds a formatted component catalog string grouped by category.
 * This is injected into the AI system prompt so the model knows exactly
 * which components are available.
 */
export function buildSchemaCatalog(): string {
  const entries = getCatalogEntries();

  // Group by category
  const grouped: Record<string, CatalogEntry[]> = {};
  for (const e of entries) {
    if (!grouped[e.category]) grouped[e.category] = [];
    grouped[e.category].push(e);
  }

  const lines: string[] = [];
  for (const [category, items] of Object.entries(grouped)) {
    lines.push(`### ${category}`);
    for (const item of items) {
      lines.push(
        `- type: "${item.type}" | name: "${item.name}" | icon: ${item.icon} | defaultSize: ${item.defaultWidth}×${item.defaultHeight}`
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Returns a compact JSON-friendly list of just the type keys, grouped by
 * category.  Useful for a shorter system prompt variant.
 */
export function buildCompactCatalog(): string {
  const entries = getCatalogEntries();
  const grouped: Record<string, string[]> = {};
  for (const e of entries) {
    if (!grouped[e.category]) grouped[e.category] = [];
    grouped[e.category].push(e.type);
  }

  return Object.entries(grouped)
    .map(([cat, types]) => `${cat}: ${types.join(', ')}`)
    .join('\n');
}
