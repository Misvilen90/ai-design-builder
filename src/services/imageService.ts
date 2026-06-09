// ---------------------------------------------------------------------------
// Image Service — provides contextual images for AI-generated layouts.
//
// Strategy:
//   1. Curated Unsplash photo IDs (high quality, always available)
//   2. Fallback to dynamic Unsplash Source URL
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Curated image database — maps keywords to real Unsplash photo IDs
// ---------------------------------------------------------------------------

const IMAGE_DATABASE: Record<string, string[]> = {
  // Tech / SaaS
  'technology': [
    'photo-1551288049-bebda4e38f71',
    'photo-1517694712202-14dd9538aa97',
    'photo-1498050108023-c5249f4df085',
    'photo-1461749280684-dccba630e2f6',
    'photo-1504639725590-34d0984388bd',
  ],
  'saas': [
    'photo-1551288049-bebda4e38f71',
    'photo-1460925895917-afdab827c52f',
    'photo-1531403009284-440f080d1e12',
  ],
  'coding': [
    'photo-1517694712202-14dd9538aa97',
    'photo-1498050108023-c5249f4df085',
    'photo-1461749280684-dccba630e2f6',
  ],
  'dashboard': [
    'photo-1551288049-bebda4e38f71',
    'photo-1460925895917-afdab827c52f',
    'photo-1504639725590-34d0984388bd',
  ],

  // Food & Beverage
  'food': [
    'photo-1504674900247-0877df9cc836',
    'photo-1565299624946-b28f40a0ae38',
    'photo-1568901346375-23c9450c58cd',
    'photo-1482049016688-2d3e1b311543',
    'photo-1414235077428-338989a2e8c0',
  ],
  'coffee': [
    'photo-1495474472287-4d71bcdd2085',
    'photo-1442512595331-e89e73853f31',
    'photo-1501339847302-ac426a4a7cbb',
    'photo-1509042239860-f550ce710b93',
    'photo-1497935586351-b67a49e012bf',
  ],
  'restaurant': [
    'photo-1414235077428-338989a2e8c0',
    'photo-1552566626-52f8b828add9',
    'photo-1517248135467-4c7edcad34c4',
    'photo-1555396273-367ea4eb4db5',
  ],
  'bakery': [
    'photo-1509440159596-0249088772ff',
    'photo-1486427944299-d1955d23e34d',
  ],

  // Fashion / E-Commerce
  'fashion': [
    'photo-1542291026-7eec264c27ff',
    'photo-1523275335684-37898b6baf30',
    'photo-1572635196237-14b3f281503f',
    'photo-1441984904996-e0b6ba687e04',
  ],
  'shoes': [
    'photo-1542291026-7eec264c27ff',
    'photo-1549298916-b41d501d3772',
  ],
  'shopping': [
    'photo-1472851294608-062f824d29cc',
    'photo-1441986300917-64674bd600d8',
  ],
  'ecommerce': [
    'photo-1472851294608-062f824d29cc',
    'photo-1523275335684-37898b6baf30',
    'photo-1542291026-7eec264c27ff',
  ],

  // Nature / Travel
  'nature': [
    'photo-1506905925346-21bda4d32df4',
    'photo-1469474968028-56623f02e42e',
    'photo-1507525428034-b723cf961d3e',
  ],
  'travel': [
    'photo-1507525428034-b723cf961d3e',
    'photo-1506905925346-21bda4d32df4',
    'photo-1476514525535-07fb3b4ae5f1',
  ],
  'mountain': [
    'photo-1506905925346-21bda4d32df4',
    'photo-1464822759023-fed622ff2c3b',
  ],
  'beach': [
    'photo-1507525428034-b723cf961d3e',
    'photo-1519046904884-53103b34b206',
  ],

  // Business / Corporate
  'business': [
    'photo-1497366216548-37526070297c',
    'photo-1497215728101-856f4ea42174',
    'photo-1519389950473-47ba0277781c',
  ],
  'office': [
    'photo-1497366216548-37526070297c',
    'photo-1497215728101-856f4ea42174',
  ],
  'corporate': [
    'photo-1497366216548-37526070297c',
    'photo-1560179707-f14e90ef3623',
  ],
  'team': [
    'photo-1522071820081-009f0129c71c',
    'photo-1521737852567-6949f3f9f2b5',
  ],
  'meeting': [
    'photo-1519389950473-47ba0277781c',
    'photo-1552581234-26160f608093',
  ],

  // Health / Fitness
  'health': [
    'photo-1571019613454-1cb2f99b2d8b',
    'photo-1544367567-0f2fcb009e0b',
    'photo-1549576490-b0b4831ef60a',
  ],
  'fitness': [
    'photo-1571019613454-1cb2f99b2d8b',
    'photo-1544367567-0f2fcb009e0b',
  ],
  'medical': [
    'photo-1576091160399-112ba8d25d1d',
    'photo-1538108149393-fbbd81895907',
  ],
  'healthcare': [
    'photo-1576091160399-112ba8d25d1d',
    'photo-1538108149393-fbbd81895907',
    'photo-1559757148-5c688a2b0965',
  ],
  'hospital': [
    'photo-1519494026892-80bbd2d6fd0d',
    'photo-1538108149393-fbbd81895907',
  ],

  // Education
  'education': [
    'photo-1503676260728-1c00da094a0b',
    'photo-1523050854058-8df90110c9f1',
    'photo-1427504494785-3a9ca7044f45',
  ],
  'school': [
    'photo-1503676260728-1c00da094a0b',
    'photo-1580582932707-520aed937b7b',
  ],
  'university': [
    'photo-1523050854058-8df90110c9f1',
    'photo-1541339907198-e08756dedf3f',
  ],
  'learning': [
    'photo-1503676260728-1c00da094a0b',
    'photo-1427504494785-3a9ca7044f45',
  ],
  'course': [
    'photo-1501504905252-473c47e087f8',
    'photo-1434030216411-0b793f4b4173',
  ],

  // Real Estate
  'real-estate': [
    'photo-1560518883-ce09059eeffa',
    'photo-1512917774080-9991f1c4c750',
    'photo-1600585154340-be6161a56a0c',
  ],
  'house': [
    'photo-1600585154340-be6161a56a0c',
    'photo-1564013799919-ab600027ffc6',
  ],
  'apartment': [
    'photo-1512917774080-9991f1c4c750',
    'photo-1502672260266-1c1ef2d93688',
  ],

  // Electronics / Arduino / Raspberry Pi
  'electronics': [
    'photo-1518770660439-4636190af475',
    'photo-1526406915894-7bcd65f60845',
    'photo-1555664424-778a1e5e1b48',
  ],
  'arduino': [
    'photo-1553406830-ef2513450d76',
    'photo-1518770660439-4636190af475',
  ],
  'raspberry-pi': [
    'photo-1518770660439-4636190af475',
    'photo-1526406915894-7bcd65f60845',
  ],
  'hardware': [
    'photo-1518770660439-4636190af475',
    'photo-1555664424-778a1e5e1b48',
  ],
  'circuit': [
    'photo-1518770660439-4636190af475',
    'photo-1555664424-778a1e5e1b48',
  ],

  // Art / Creative
  'art': [
    'photo-1618005182384-a83a8bd57fbe',
    'photo-1547826039-bfc35e0f1ea8',
  ],
  'creative': [
    'photo-1618005182384-a83a8bd57fbe',
    'photo-1513364776144-60967b0f800f',
  ],
  'design': [
    'photo-1531403009284-440f080d1e12',
    'photo-1507238691740-187a5b1d37b8',
  ],
  'portfolio': [
    'photo-1507238691740-187a5b1d37b8',
    'photo-1531403009284-440f080d1e12',
  ],

  // Music
  'music': [
    'photo-1511671782779-c97d3d27a1d4',
    'photo-1493225457124-a3eb161ffa5f',
  ],

  // Automotive
  'automotive': [
    'photo-1494976388531-d1058494cdd8',
    'photo-1502877338535-766e1452684a',
  ],
  'car': [
    'photo-1494976388531-d1058494cdd8',
    'photo-1502877338535-766e1452684a',
  ],

  // Generic / Fallback
  'abstract': [
    'photo-1618005182384-a83a8bd57fbe',
    'photo-1557683316-973673baf926',
  ],
  'background': [
    'photo-1557683316-973673baf926',
    'photo-1618005182384-a83a8bd57fbe',
  ],
  'workspace': [
    'photo-1497366216548-37526070297c',
    'photo-1517694712202-14dd9538aa97',
  ],
  'people': [
    'photo-1522071820081-009f0129c71c',
    'photo-1521737852567-6949f3f9f2b5',
  ],
};

// Track used indices per keyword so we don't repeat images in the same generation
let usageTracker: Record<string, number> = {};

/** Reset the per-session usage tracker (call before each generation) */
export function resetImageTracker(): void {
  usageTracker = {};
}

// ---------------------------------------------------------------------------
// Core API
// ---------------------------------------------------------------------------

/**
 * Returns a high-quality Unsplash image URL for the given keyword.
 * Cycles through curated photos so repeated calls with the same keyword
 * return different images.
 */
export function getImageForKeyword(
  keyword: string,
  width: number = 600,
  height: number = 400
): string {
  const normalised = keyword.toLowerCase().trim();

  // Try direct match
  let photos = IMAGE_DATABASE[normalised];

  // Try partial match
  if (!photos) {
    for (const [key, value] of Object.entries(IMAGE_DATABASE)) {
      if (normalised.includes(key) || key.includes(normalised)) {
        photos = value;
        break;
      }
    }
  }

  // Try multi-word: split and match first hit
  if (!photos) {
    const words = normalised.split(/[\s,_-]+/);
    for (const word of words) {
      if (IMAGE_DATABASE[word]) {
        photos = IMAGE_DATABASE[word];
        break;
      }
    }
  }

  if (photos && photos.length > 0) {
    // Cycle through available photos
    const idx = (usageTracker[normalised] || 0) % photos.length;
    usageTracker[normalised] = idx + 1;
    return `https://images.unsplash.com/${photos[idx]}?w=${width}&q=80`;
  }

  // Fallback to Unsplash Source (dynamic)
  const encodedKeyword = encodeURIComponent(normalised.replace(/\s+/g, ','));
  return `https://source.unsplash.com/${width}x${height}/?${encodedKeyword}`;
}

/**
 * Batch lookup: returns a map of keyword → image URL.
 */
export function getImagesForKeywords(
  keywords: string[],
  width: number = 600,
  height: number = 400
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const kw of keywords) {
    result[kw] = getImageForKeyword(kw, width, height);
  }
  return result;
}

/**
 * Simple keyword extraction from a user prompt.
 * The AI system prompt also generates keywords, but this is used as a
 * lightweight pre-pass.
 */
export function extractImageKeywords(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const matched: string[] = [];

  for (const key of Object.keys(IMAGE_DATABASE)) {
    if (lower.includes(key)) {
      matched.push(key);
    }
  }

  // Always include at least one generic keyword
  if (matched.length === 0) {
    matched.push('technology');
  }

  return matched.slice(0, 6); // Cap at 6
}
