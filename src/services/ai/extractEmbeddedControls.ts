// ---------------------------------------------------------------------------
// Extract embedded HTML controls (buttons, etc.) from composite components
// into standalone BuilderComponents so they appear in the layers panel and
// can be selected independently on the canvas.
// ---------------------------------------------------------------------------

import type { BuilderComponent } from '../../store/useBuilderStore';
import { COMPONENT_SCHEMAS } from '../../store/schemas';

const SKIP_EXTRACTION_TYPES = new Set([
  'nav-tabs',
  'nav-menu',
  'marketing-faq',
  'ecommerce-product',
  'ecommerce-cart',
  'form-contact',
  'form-login',
  'form-register',
  'form-newsletter',
  'media-carousel',
]);

const BUTTON_REGEX = /<button[^>]*>([\s\S]*?)<\/button>/gi;

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, '').trim();
}

function getButtonPosition(
  parent: BuilderComponent,
  index: number
): { left: number; top: number; width: number; height: number } {
  const btnWidth = 140;
  const btnHeight = 38;

  if (parent.type === 'nav-navbar') {
    return {
      left: parent.position.left + parent.position.width - btnWidth - 24,
      top: parent.position.top + (parent.position.height - btnHeight) / 2,
      width: btnWidth,
      height: btnHeight,
    };
  }

  if (parent.type === 'marketing-hero' || parent.type === 'marketing-cta') {
    return {
      left: parent.position.left + parent.position.width / 2 - btnWidth / 2,
      top: parent.position.top + parent.position.height - btnHeight - 28,
      width: btnWidth,
      height: btnHeight,
    };
  }

  if (parent.type === 'marketing-newsletter') {
    return {
      left: parent.position.left + parent.position.width - btnWidth - 32,
      top: parent.position.top + parent.position.height / 2 - btnHeight / 2,
      width: btnWidth,
      height: btnHeight,
    };
  }

  // Default: stack buttons vertically inside parent
  const gap = 8;
  const startTop = parent.position.top + 16 + index * (btnHeight + gap);
  return {
    left: parent.position.left + parent.position.width - btnWidth - 16,
    top: startTop,
    width: btnWidth,
    height: btnHeight,
  };
}

function extractFromComponent(
  comp: BuilderComponent
): { parent: BuilderComponent; extracted: BuilderComponent[] } {
  if (!comp.content.html || typeof comp.content.html !== 'string') {
    return { parent: comp, extracted: [] };
  }

  if (SKIP_EXTRACTION_TYPES.has(comp.type)) {
    return { parent: comp, extracted: [] };
  }

  const matches = [...comp.content.html.matchAll(BUTTON_REGEX)];
  if (matches.length === 0) {
    return { parent: comp, extracted: [] };
  }

  // Navbar & hero: extract only the primary CTA (last button)
  const toExtract =
    comp.type === 'nav-navbar' ||
    comp.type === 'marketing-hero' ||
    comp.type === 'marketing-cta' ||
    comp.type === 'marketing-newsletter'
      ? [matches[matches.length - 1]]
      : matches;

  const btnSchema = COMPONENT_SCHEMAS['btn-primary'];
  const extracted: BuilderComponent[] = [];
  let html = comp.content.html;

  toExtract.forEach((match, idx) => {
    const label = stripHtml(match[1]) || 'Button';
    const pos = getButtonPosition(comp, idx);

    extracted.push({
      id: `${comp.id}-extracted-btn-${idx}`,
      type: 'btn-primary',
      name: label,
      category: btnSchema.category,
      icon: btnSchema.icon,
      content: { label },
      style: { ...btnSchema.defaultStyle },
      position: {
        ...pos,
        rotate: 0,
        zIndex: comp.position.zIndex + 1 + idx,
      },
      locked: false,
      visible: true,
    });

    html = html.replace(match[0], '<div class="invisible w-[140px] shrink-0" aria-hidden="true"></div>');
  });

  return {
    parent: { ...comp, content: { ...comp.content, html } },
    extracted,
  };
}

/**
 * Splits embedded HTML buttons out of composite components (navbar, hero, etc.)
 * into standalone button layers.
 */
export function flattenEmbeddedControls(
  components: BuilderComponent[]
): BuilderComponent[] {
  const result: BuilderComponent[] = [];

  for (const comp of components) {
    const { parent, extracted } = extractFromComponent(comp);
    result.push(parent);
    result.push(...extracted);
  }

  return result;
}

/**
 * Parse embedded interactive elements still inside HTML for the layers panel.
 */
export function getEmbeddedLayerItems(
  comp: BuilderComponent
): Array<{ id: string; label: string; kind: 'button' | 'link' }> {
  if (!comp.content.html) return [];

  const items: Array<{ id: string; label: string; kind: 'button' | 'link' }> = [];

  const buttons = [...comp.content.html.matchAll(BUTTON_REGEX)];
  buttons.forEach((match, i) => {
    const label = stripHtml(match[1]);
    if (label) {
      items.push({ id: `${comp.id}-emb-btn-${i}`, label, kind: 'button' });
    }
  });

  const links = [...comp.content.html.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)];
  links.forEach((match, i) => {
    const label = stripHtml(match[1]);
    if (label) {
      items.push({ id: `${comp.id}-emb-link-${i}`, label, kind: 'link' });
    }
  });

  return items;
}
