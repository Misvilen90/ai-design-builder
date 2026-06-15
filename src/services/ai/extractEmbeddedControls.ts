// ---------------------------------------------------------------------------
// Extract embedded HTML controls (buttons, headings, paragraphs, images)
// from composite components into standalone BuilderComponents so they appear
// in the layers panel and can be selected independently on the canvas.
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
const HEADING_REGEX = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
const PARAGRAPH_REGEX = /<p[^>]*>([\s\S]*?)<\/p>/gi;
const IMAGE_REGEX = /<img[^>]*>/gi;

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, '').trim();
}

function getSubElementPosition(
  parent: BuilderComponent,
  index: number,
  kind: 'heading' | 'paragraph' | 'image'
): { left: number; top: number; width: number; height: number } {
  const height = kind === 'heading' ? 40 : kind === 'image' ? 200 : 60;
  const width = kind === 'image' ? Math.min(parent.position.width - 40, 400) : Math.min(parent.position.width - 40, 500);

  if (parent.type === 'marketing-hero' || parent.type === 'marketing-hero-centered' || parent.type === 'marketing-hero-split') {
    if (kind === 'heading') {
      return {
        left: parent.position.left + 40,
        top: parent.position.top + 80 + index * (height + 8),
        width: parent.position.width / 2 - 80,
        height,
      };
    }
    if (kind === 'paragraph') {
      return {
        left: parent.position.left + 40,
        top: parent.position.top + 130 + index * (height + 8),
        width: parent.position.width / 2 - 80,
        height,
      };
    }
    if (kind === 'image') {
      return {
        left: parent.position.left + parent.position.width / 2 + 20,
        top: parent.position.top + 40,
        width: parent.position.width / 2 - 60,
        height: parent.position.height - 80,
      };
    }
  }

  // Default: stack inside parent
  return {
    left: parent.position.left + 20,
    top: parent.position.top + 20 + index * (height + 8),
    width: width,
    height,
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

  const extracted: BuilderComponent[] = [];
  let html = comp.content.html;

  // --- Extract buttons (existing logic) ---
  const btnMatches = [...comp.content.html.matchAll(BUTTON_REGEX)];
  const btnSchema = COMPONENT_SCHEMAS['btn-primary'];

  const btnsToExtract =
    comp.type === 'nav-navbar' ||
    comp.type === 'marketing-hero' ||
    comp.type === 'marketing-hero-centered' ||
    comp.type === 'marketing-hero-split' ||
    comp.type === 'marketing-cta' ||
    comp.type === 'marketing-newsletter'
      ? [btnMatches[btnMatches.length - 1]]
      : btnMatches;

  btnsToExtract.forEach((match, idx) => {
    if (!match) return;
    const label = stripHtml(match[1]) || 'Button';
    const pos = getSubElementPosition(comp, idx, 'heading');

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
        width: 140,
        height: 38,
        rotate: 0,
        zIndex: comp.position.zIndex + 1 + idx,
      },
      locked: false,
      visible: true,
    });

    html = html.replace(match[0], '<div class="invisible w-[140px] shrink-0" aria-hidden="true"></div>');
  });

  // --- Extract headings ---
  const headingMatches = [...html.matchAll(HEADING_REGEX)];
  const headingSchema = COMPONENT_SCHEMAS['heading-block'];

  headingMatches.forEach((match, idx) => {
    const text = stripHtml(match[2]);
    if (!text || text.length < 2) return;

    const pos = getSubElementPosition(comp, idx, 'heading');
    const tag = match[1].toLowerCase();
    const fontSize = tag === 'h1' ? '2rem' : tag === 'h2' ? '1.5rem' : tag === 'h3' ? '1.25rem' : '1.1rem';

    extracted.push({
      id: `${comp.id}-extracted-h-${idx}`,
      type: 'heading-block',
      name: text.slice(0, 40),
      category: headingSchema.category,
      icon: headingSchema.icon,
      content: { text, tag },
      style: {
        ...headingSchema.defaultStyle,
        fontSize,
        fontWeight: tag === 'h1' || tag === 'h2' ? 'bold' : '600',
      },
      position: {
        ...pos,
        rotate: 0,
        zIndex: comp.position.zIndex + 1 + idx,
      },
      locked: false,
      visible: true,
    });

    html = html.replace(match[0], `<div class="invisible h-[40px] w-full" aria-hidden="true"></div>`);
  });

  // --- Extract paragraphs ---
  const paragraphMatches = [...html.matchAll(PARAGRAPH_REGEX)];
  const paragraphSchema = COMPONENT_SCHEMAS['text-block'];

  paragraphMatches.forEach((match, idx) => {
    const text = stripHtml(match[1]);
    if (!text || text.length < 3) return;

    const pos = getSubElementPosition(comp, idx, 'paragraph');

    extracted.push({
      id: `${comp.id}-extracted-p-${idx}`,
      type: 'text-block',
      name: text.slice(0, 40),
      category: paragraphSchema.category,
      icon: paragraphSchema.icon,
      content: { text },
      style: { ...paragraphSchema.defaultStyle },
      position: {
        ...pos,
        rotate: 0,
        zIndex: comp.position.zIndex + 1 + idx,
      },
      locked: false,
      visible: true,
    });

    html = html.replace(match[0], `<div class="invisible h-[60px] w-full" aria-hidden="true"></div>`);
  });

  // --- Extract images ---
  const imageMatches = [...html.matchAll(IMAGE_REGEX)];
  const imageSchema = COMPONENT_SCHEMAS['media-image'];

  imageMatches.forEach((match, idx) => {
    const srcMatch = match[0].match(/src="([^"]+)"/);
    const altMatch = match[0].match(/alt="([^"]+)"/);
    const src = srcMatch ? srcMatch[1] : '';
    if (!src) return;

    const pos = getSubElementPosition(comp, idx, 'image');

    extracted.push({
      id: `${comp.id}-extracted-img-${idx}`,
      type: 'media-image',
      name: altMatch ? altMatch[1].slice(0, 40) : `Image ${idx + 1}`,
      category: imageSchema.category,
      icon: imageSchema.icon,
      content: { src, alt: altMatch ? altMatch[1] : '' },
      style: { ...imageSchema.defaultStyle },
      position: {
        ...pos,
        rotate: 0,
        zIndex: comp.position.zIndex + 1 + idx,
      },
      locked: false,
      visible: true,
    });

    html = html.replace(match[0], '<div class="invisible w-full h-full" aria-hidden="true"></div>');
  });

  // If nothing was extracted, return as-is
  if (extracted.length === 0) {
    return { parent: comp, extracted: [] };
  }

  return {
    parent: { ...comp, content: { ...comp.content, html } },
    extracted,
  };
}

/**
 * Splits embedded HTML controls (buttons, headings, paragraphs, images) out
 * of composite components into standalone button layers.
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
): Array<{ id: string; label: string; kind: 'button' | 'link' | 'heading' | 'paragraph' | 'image' }> {
  if (!comp.content.html) return [];

  const items: Array<{ id: string; label: string; kind: 'button' | 'link' | 'heading' | 'paragraph' | 'image' }> = [];

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

  const headings = [...comp.content.html.matchAll(HEADING_REGEX)];
  headings.forEach((match, i) => {
    const label = stripHtml(match[2]);
    if (label && label.length > 1) {
      items.push({ id: `${comp.id}-emb-h-${i}`, label, kind: 'heading' });
    }
  });

  const paragraphs = [...comp.content.html.matchAll(PARAGRAPH_REGEX)];
  paragraphs.forEach((match, i) => {
    const label = stripHtml(match[1]);
    if (label && label.length > 2) {
      items.push({ id: `${comp.id}-emb-p-${i}`, label, kind: 'paragraph' });
    }
  });

  return items;
}
