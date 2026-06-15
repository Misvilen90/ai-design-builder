function validateLayoutResponse(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Response is not a JSON object.' };
  }

  if (!Array.isArray(data.components) || data.components.length === 0) {
    return { valid: false, error: 'Response has no components array.' };
  }

  const componentErrors = [];
  for (let i = 0; i < data.components.length; i++) {
    const c = data.components[i];
    if (!c || typeof c !== 'object') {
      componentErrors.push(`Component ${i}: not an object.`);
      continue;
    }
    if (!c.type || typeof c.type !== 'string') {
      componentErrors.push(`Component ${i}: missing or invalid "type".`);
    }
    if (c.x !== undefined && (typeof c.x !== 'number' || c.x < 0 || c.x > 1200)) {
      componentErrors.push(`Component ${i} ("${c.type || '?'}"): "x" must be 0–1200.`);
    }
    if (c.y !== undefined && (typeof c.y !== 'number' || c.y < 0)) {
      componentErrors.push(`Component ${i} ("${c.type || '?'}"): "y" must be >= 0.`);
    }
    if (c.width !== undefined && (typeof c.width !== 'number' || c.width < 20 || c.width > 1200)) {
      componentErrors.push(`Component ${i} ("${c.type || '?'}"): "width" must be 20–1200.`);
    }
    if (c.height !== undefined && (typeof c.height !== 'number' || c.height < 10 || c.height > 2000)) {
      componentErrors.push(`Component ${i} ("${c.type || '?'}"): "height" must be 10–2000.`);
    }
    if (c.zIndex !== undefined && typeof c.zIndex !== 'number') {
      componentErrors.push(`Component ${i} ("${c.type || '?'}"): "zIndex" must be a number.`);
    }
  }

  if (componentErrors.length > 0) {
    return { valid: false, error: `Component validation errors:\n${componentErrors.join('\n')}` };
  }

  return {
    valid: true,
    data: {
      pageName: typeof data.pageName === 'string' ? data.pageName : 'AI Generated Page',
      description: typeof data.description === 'string' ? data.description : '',
      components: data.components,
      imageKeywords: Array.isArray(data.imageKeywords) ? data.imageKeywords : [],
    },
  };
}

function validatePrototypeResponse(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Prototype response is not a JSON object.' };
  }

  if (!Array.isArray(data.pages) || data.pages.length === 0) {
    return { valid: false, error: 'Prototype response has no pages array.' };
  }

  const pageErrors = [];
  for (let i = 0; i < data.pages.length; i++) {
    const p = data.pages[i];
    if (!p || typeof p !== 'object') {
      pageErrors.push(`Page ${i}: not an object.`);
      continue;
    }
    if (!p.pageId || typeof p.pageId !== 'string') {
      pageErrors.push(`Page ${i}: missing or invalid "pageId".`);
    }
    if (!p.pageName || typeof p.pageName !== 'string') {
      pageErrors.push(`Page ${i}: missing or invalid "pageName".`);
    }
    if (!Array.isArray(p.components)) {
      pageErrors.push(`Page ${i} ("${p.pageName || '?'}"): "components" is not an array.`);
    } else {
      for (let j = 0; j < p.components.length; j++) {
        const c = p.components[j];
        if (!c || !c.type) {
          pageErrors.push(`Page ${i} ("${p.pageName || '?'}"), Component ${j}: missing "type".`);
        }
      }
    }
  }

  if (pageErrors.length > 0) {
    return { valid: false, error: `Page validation errors:\n${pageErrors.join('\n')}` };
  }

  const pages = data.pages.map(p => ({
    pageId: String(p.pageId).toLowerCase().replace(/\s+/g, '-'),
    pageName: String(p.pageName),
    isHome: Boolean(p.isHome),
    components: Array.isArray(p.components) ? p.components.filter(c => c && c.type) : [],
    links: Array.isArray(p.links) ? p.links.filter(l => l && l.componentName && l.toPageId) : [],
  }));

  const homeCount = pages.filter(p => p.isHome).length;
  if (homeCount === 0) pages[0].isHome = true;
  else if (homeCount > 1) {
    let first = true;
    for (const p of pages) {
      if (p.isHome && !first) p.isHome = false;
      else if (p.isHome) first = false;
    }
  }

  return {
    valid: true,
    data: {
      siteDescription: typeof data.siteDescription === 'string' ? data.siteDescription : '',
      pages,
    },
  };
}

module.exports = { validateLayoutResponse, validatePrototypeResponse };
