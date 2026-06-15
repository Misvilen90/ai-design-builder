export interface ComponentSchema {
  type: string;
  name: string;
  category: string;
  icon: string;
  defaultStyle: Record<string, any>;
  defaultContent: Record<string, any>;
  defaultPosition: {
    width: number;
    height: number;
  };
}

export const COMPONENT_SCHEMAS: Record<string, ComponentSchema> = {
  // ==========================================
  // 1. LAYOUT
  // ==========================================
  'layout-container': {
    type: 'layout-container',
    name: 'Container',
    category: 'Layout',
    icon: '📐',
    defaultPosition: { width: 900, height: 200 },
    defaultStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderColor: '#1e293b',
      borderStyle: 'dashed',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '16px'
    },
    defaultContent: { html: '<div class="text-slate-500 text-xs flex justify-center items-center h-full">💡 Grid Container. Drop components here.</div>' }
  },
  'layout-section': {
    type: 'layout-section',
    name: 'Section',
    category: 'Layout',
    icon: '🧱',
    defaultPosition: { width: 900, height: 300 },
    defaultStyle: {
      backgroundColor: 'rgba(99, 102, 241, 0.04)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '12px',
      padding: '40px 24px'
    },
    defaultContent: { html: '<div class="text-slate-400 text-xs text-center">Section Box Layout</div>' }
  },
  'layout-grid': {
    type: 'layout-grid',
    name: 'Grid',
    category: 'Layout',
    icon: '🎛️',
    defaultPosition: { width: 900, height: 160 },
    defaultStyle: {
      backgroundColor: 'transparent',
      padding: '0px'
    },
    defaultContent: {
      html: `<div class="grid grid-cols-3 gap-4 h-full w-full">
        <div class="border border-dashed border-slate-800 bg-slate-950/20 rounded-md p-4 flex flex-col justify-center items-center text-xs text-slate-500">Col 1</div>
        <div class="border border-dashed border-slate-800 bg-slate-950/20 rounded-md p-4 flex flex-col justify-center items-center text-xs text-slate-500">Col 2</div>
        <div class="border border-dashed border-slate-800 bg-slate-950/20 rounded-md p-4 flex flex-col justify-center items-center text-xs text-slate-500">Col 3</div>
      </div>`
    }
  },
  'layout-row': {
    type: 'layout-row',
    name: 'Row',
    category: 'Layout',
    icon: '↔️',
    defaultPosition: { width: 900, height: 100 },
    defaultStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.01)',
      borderColor: '#334155',
      borderStyle: 'dashed',
      borderWidth: '1px',
      borderRadius: '6px',
      padding: '8px 16px'
    },
    defaultContent: {
      html: `<div class="flex justify-between items-center h-full w-full">
        <div class="text-[10px] text-slate-500 font-mono">Row Start</div>
        <div class="text-[10px] text-slate-500 font-mono">Row End</div>
      </div>`
    }
  },
  'layout-column': {
    type: 'layout-column',
    name: 'Column',
    category: 'Layout',
    icon: '↕️',
    defaultPosition: { width: 280, height: 160 },
    defaultStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.01)',
      borderColor: '#334155',
      borderStyle: 'dashed',
      borderWidth: '1px',
      borderRadius: '6px',
      padding: '12px'
    },
    defaultContent: { html: '<div class="text-[10px] text-slate-500 h-full flex items-center justify-center">Column element</div>' }
  },

  'layout-cookie-banner': {
    type: 'layout-cookie-banner',
    name: 'Cookie Banner',
    category: 'Layout',
    icon: '🍪',
    defaultPosition: { width: 900, height: 80 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.95)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '10px',
      padding: '16px 24px'
    },
    defaultContent: {
      html: `<div class="flex items-center justify-between h-full w-full gap-4">
        <div class="flex items-center gap-3">
          <span class="text-lg">🍪</span>
          <div class="flex flex-col">
            <span class="text-xs font-bold text-white">This site uses cookies</span>
            <span class="text-[9px] text-slate-500">We use cookies to improve your experience. Accept to continue.</span>
          </div>
        </div>
        <div class="flex gap-2 shrink-0">
          <button class="text-[10px] font-semibold py-1.5 px-4 rounded-lg border border-slate-700 text-slate-400 pointer-events-none">Decline</button>
          <button class="bg-indigo-600 text-[10px] font-bold py-1.5 px-4 rounded-lg text-white pointer-events-none">Accept All</button>
        </div>
      </div>`
    }
  },

// ==========================================
// 2. NAVIGATION
// ==========================================
  'nav-navbar': {
    type: 'nav-navbar',
    name: 'Navbar',
    category: 'Navigation',
    icon: '🌐',
    defaultPosition: { width: 900, height: 60 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.9)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '12px 24px'
    },
    defaultContent: {
      html: `<div class="flex justify-between items-center h-full w-full pointer-events-none">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white">G</div>
          <span class="font-extrabold text-sm text-white">GenovaX</span>
        </div>
        <div class="flex gap-5 text-xs font-semibold text-slate-400">
          <span class="text-white">Home</span>
          <span>Features</span>
          <span>Pricing</span>
          <span>Docs</span>
        </div>
        <div class="flex gap-2">
          <button class="text-[10px] font-semibold text-slate-400 px-3 py-1 pointer-events-none">Log In</button>
          <button class="bg-indigo-600 text-[10px] font-bold px-4 py-1.5 rounded-lg text-white shadow-sm pointer-events-none">Sign Up</button>
        </div>
      </div>`
    }
  },
  'nav-sidebar': {
    type: 'nav-sidebar',
    name: 'Sidebar',
    category: 'Navigation',
    icon: '🗂️',
    defaultPosition: { width: 200, height: 400 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.8)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '16px'
    },
    defaultContent: {
      html: `<div class="flex flex-col gap-4 h-full">
        <div class="font-extrabold text-xs text-indigo-400">⚡ DASHBOARD</div>
        <ul class="flex flex-col gap-2.5 text-[10px] text-slate-400 font-semibold">
          <li class="text-white hover:text-white cursor-pointer">🏠 Home Overview</li>
          <li class="hover:text-white cursor-pointer">📊 Analytics Metrics</li>
          <li class="hover:text-white cursor-pointer">👤 Users List</li>
          <li class="hover:text-white cursor-pointer">⚙️ Settings Options</li>
        </ul>
      </div>`
    }
  },
  'nav-breadcrumb': {
    type: 'nav-breadcrumb',
    name: 'Breadcrumb',
    category: 'Navigation',
    icon: '🪧',
    defaultPosition: { width: 400, height: 40 },
    defaultStyle: {
      backgroundColor: 'transparent',
      padding: '8px 12px'
    },
    defaultContent: {
      html: `<div class="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span class="hover:text-slate-300 cursor-pointer">Home</span>
        <span>/</span>
        <span class="hover:text-slate-300 cursor-pointer">Dashboard</span>
        <span>/</span>
        <span class="text-indigo-400">Builder</span>
      </div>`
    }
  },
  'nav-menu': {
    type: 'nav-menu',
    name: 'Menu',
    category: 'Navigation',
    icon: '🍔',
    defaultPosition: { width: 300, height: 50 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.5)',
      borderRadius: '6px',
      padding: '8px 12px'
    },
    defaultContent: {
      html: `<div class="flex gap-4 items-center justify-around h-full w-full text-xs font-semibold text-slate-300">
        <span class="hover:text-indigo-400 cursor-pointer">Home</span>
        <span class="hover:text-indigo-400 cursor-pointer">Services</span>
        <span class="hover:text-indigo-400 cursor-pointer">Blog</span>
        <span class="hover:text-indigo-400 cursor-pointer">Contact</span>
      </div>`
    }
  },
  'nav-tabs': {
    type: 'nav-tabs',
    name: 'Tabs',
    category: 'Navigation',
    icon: '🗂️',
    defaultPosition: { width: 450, height: 60 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.4)',
      borderRadius: '8px',
      padding: '6px'
    },
    defaultContent: {
      html: `<div class="flex gap-2 w-full h-full text-xs font-bold text-center">
        <button class="flex-1 bg-indigo-600 text-white rounded-md py-2">Tab 1</button>
        <button class="flex-1 text-slate-400 hover:text-slate-200 py-2">Tab 2</button>
        <button class="flex-1 text-slate-400 hover:text-slate-200 py-2">Tab 3</button>
      </div>`
    }
  },

  'nav-navbar-centered': {
    type: 'nav-navbar-centered',
    name: 'Centered Navbar',
    category: 'Navigation',
    icon: '🌐',
    defaultPosition: { width: 900, height: 64 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.9)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '12px 24px'
    },
    defaultContent: {
      html: `<div class="flex flex-col items-center justify-center h-full w-full gap-1 pointer-events-none">
        <div class="font-extrabold text-sm text-indigo-400">⚡ GENOVAX</div>
        <div class="flex gap-5 text-[9px] font-semibold text-slate-400">
          <span class="text-white">Home</span>
          <span>Features</span>
          <span>Pricing</span>
          <span>Docs</span>
          <span>Contact</span>
        </div>
      </div>`
    }
  },
  'nav-navbar-transparent': {
    type: 'nav-navbar-transparent',
    name: 'Glass Navbar',
    category: 'Navigation',
    icon: '🌐',
    defaultPosition: { width: 900, height: 64 },
    defaultStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '12px',
      padding: '12px 24px',
      backdropFilter: 'blur(12px)'
    },
    defaultContent: {
      html: `<div class="flex justify-between items-center h-full w-full pointer-events-none">
        <div class="font-extrabold text-sm text-white">⚡ GENOVAX</div>
        <div class="flex gap-5 text-xs font-medium text-white/70">
          <span class="text-white">Home</span>
          <span>Features</span>
          <span>Pricing</span>
          <span>Contact</span>
        </div>
        <button class="bg-white/10 backdrop-blur text-[10px] font-bold px-4 py-1.5 rounded-full text-white border border-white/10 pointer-events-none">Get Started</button>
      </div>`
    }
  },

// ==========================================
// 3. CONTENT
// ==========================================
  'content-heading': {
    type: 'content-heading',
    name: 'Heading',
    category: 'Content',
    icon: '🔤',
    defaultPosition: { width: 600, height: 45 },
    defaultStyle: {
      color: '#ffffff',
      fontSize: '28px',
      fontWeight: '800',
      textAlign: 'left'
    },
    defaultContent: { text: 'Premium SaaS UI Editor' }
  },
  'content-paragraph': {
    type: 'content-paragraph',
    name: 'Paragraph',
    category: 'Content',
    icon: '📝',
    defaultPosition: { width: 600, height: 60 },
    defaultStyle: {
      color: '#94a3b8',
      fontSize: '14px',
      fontWeight: '400',
      textAlign: 'left',
      lineHeight: '1.5'
    },
    defaultContent: { text: 'Create responsive, professional layouts in seconds with drag-and-drop components, customized typography, and custom borders.' }
  },
  'content-textblock': {
    type: 'content-textblock',
    name: 'Text Block',
    category: 'Content',
    icon: '📋',
    defaultPosition: { width: 600, height: 80 },
    defaultStyle: {
      color: '#cbd5e1',
      fontSize: '15px',
      textAlign: 'left'
    },
    defaultContent: { text: 'This is a text block. Click or double click to edit, format typography, change weights, or set borders.' }
  },
  'content-list': {
    type: 'content-list',
    name: 'List',
    category: 'Content',
    icon: '🔢',
    defaultPosition: { width: 300, height: 120 },
    defaultStyle: {
      backgroundColor: 'transparent',
      padding: '8px'
    },
    defaultContent: {
      html: `<ul class="list-disc list-inside text-xs text-slate-300 space-y-1.5 font-medium">
        <li>✨ Fully Absolute Positioned Canvas</li>
        <li>⚡ Auto Alignment Snaps & Guides</li>
        <li>📁 Local Project Storage & Autosave</li>
        <li>🚀 Tailwind & Code Code Exports</li>
      </ul>`
    }
  },
  'content-table': {
    type: 'content-table',
    name: 'Table',
    category: 'Content',
    icon: '📊',
    defaultPosition: { width: 600, height: 180 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.4)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '12px'
    },
    defaultContent: {
      html: `<table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-slate-800 text-slate-400 font-bold">
            <th class="pb-2">Feature</th>
            <th class="pb-2">Status</th>
            <th class="pb-2">Version</th>
          </tr>
        </thead>
        <tbody class="text-slate-300 font-medium">
          <tr class="border-b border-slate-800/40">
            <td class="py-2.5">Canvas Drag & Drop</td>
            <td class="py-2.5 text-emerald-400">✔️ Ready</td>
            <td class="py-2.5">v2.1</td>
          </tr>
          <tr>
            <td class="py-2.5">Undo & Redo System</td>
            <td class="py-2.5 text-emerald-400">✔️ Active</td>
            <td class="py-2.5">v1.0</td>
          </tr>
        </tbody>
      </table>`
    }
  },

  // ==========================================
  // 4. MEDIA
  // ==========================================
  'media-image': {
    type: 'media-image',
    name: 'Image',
    category: 'Media',
    icon: '🖼️',
    defaultPosition: { width: 320, height: 200 },
    defaultStyle: {
      borderRadius: '8px',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px'
    },
    defaultContent: {
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
      alt: 'Dashboard Mockup'
    }
  },
  'media-video': {
    type: 'media-video',
    name: 'Video',
    category: 'Media',
    icon: '🎥',
    defaultPosition: { width: 400, height: 225 },
    defaultStyle: {
      backgroundColor: '#020617',
      borderRadius: '8px',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px'
    },
    defaultContent: {
      html: `<div class="w-full h-full relative flex items-center justify-center bg-slate-950">
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80" class="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div class="z-10 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg cursor-pointer">▶</div>
        <span class="absolute bottom-2 left-2 text-[9px] text-slate-400 bg-black/60 px-2 py-0.5 rounded font-mono">03:45</span>
      </div>`
    }
  },
  'media-gallery': {
    type: 'media-gallery',
    name: 'Gallery',
    category: 'Media',
    icon: '🖼️',
    defaultPosition: { width: 600, height: 200 },
    defaultStyle: {
      backgroundColor: 'transparent',
      padding: '0px'
    },
    defaultContent: {
      html: `<div class="grid grid-cols-3 gap-2 h-full w-full">
        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&q=80" class="w-full h-full object-cover rounded-md border border-slate-800" />
        <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&q=80" class="w-full h-full object-cover rounded-md border border-slate-800" />
        <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=200&q=80" class="w-full h-full object-cover rounded-md border border-slate-800" />
      </div>`
    }
  },
  'media-carousel': {
    type: 'media-carousel',
    name: 'Carousel',
    category: 'Media',
    icon: '🎠',
    defaultPosition: { width: 600, height: 300 },
    defaultStyle: {
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '12px'
    },
    defaultContent: {
      html: `<div class="relative w-full h-full flex items-center justify-between bg-slate-950 overflow-hidden rounded-xl">
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" class="absolute inset-0 w-full h-full object-cover opacity-80" />
        <button class="absolute left-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center font-bold text-xs select-none">◀</button>
        <button class="absolute right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center font-bold text-xs select-none">▶</button>
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
          <span class="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
          <span class="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
        </div>
      </div>`
    }
  },

  // ==========================================
  // 5. BUTTONS
  // ==========================================
  'btn-primary': {
    type: 'btn-primary',
    name: 'Primary Button',
    category: 'Buttons',
    icon: '🔘',
    defaultPosition: { width: 160, height: 40 },
    defaultStyle: {
      backgroundColor: '#6366f1',
      color: '#ffffff',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      textAlign: 'center',
      padding: '10px'
    },
    defaultContent: { label: 'Explore Features 🚀' }
  },
  'btn-secondary': {
    type: 'btn-secondary',
    name: 'Secondary Button',
    category: 'Buttons',
    icon: '🔲',
    defaultPosition: { width: 160, height: 40 },
    defaultStyle: {
      backgroundColor: 'transparent',
      borderColor: '#334155',
      borderStyle: 'solid',
      borderWidth: '1.5px',
      color: '#94a3b8',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      textAlign: 'center',
      padding: '10px'
    },
    defaultContent: { label: 'Learn More' }
  },
  'btn-icon': {
    type: 'btn-icon',
    name: 'Icon Button',
    category: 'Buttons',
    icon: '⭐',
    defaultPosition: { width: 40, height: 40 },
    defaultStyle: {
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      color: '#818cf8',
      borderRadius: '8px',
      borderColor: '#6366f1',
      borderStyle: 'solid',
      borderWidth: '1px',
      padding: '8px'
    },
    defaultContent: {
      html: '<div class="w-full h-full flex items-center justify-center font-bold">⭐</div>'
    }
  },
  'btn-cta': {
    type: 'btn-cta',
    name: 'CTA Button',
    category: 'Buttons',
    icon: '🔥',
    defaultPosition: { width: 180, height: 44 },
    defaultStyle: {
      backgroundColor: '#818cf8',
      color: '#ffffff',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '700',
      textAlign: 'center',
      padding: '12px'
    },
    defaultContent: { label: 'Get Started Instantly ⚡' }
  },

  // ==========================================
  // 6. CARDS
  // ==========================================
  'card-basic': {
    type: 'card-basic',
    name: 'Basic Card',
    category: 'Cards',
    icon: '🃏',
    defaultPosition: { width: 260, height: 160 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.4)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '16px'
    },
    defaultContent: {
      html: `<div class="flex flex-col gap-2">
        <h4 class="text-xs font-bold text-white">Title Paragraph</h4>
        <p class="text-[10px] text-slate-400 leading-relaxed">This is a basic card wrapper block layout. You can drag and drop text elements or modify style values.</p>
      </div>`
    }
  },
  'card-feature': {
    type: 'card-feature',
    name: 'Feature Card',
    category: 'Cards',
    icon: '✨',
    defaultPosition: { width: 260, height: 160 },
    defaultStyle: {
      backgroundColor: 'rgba(99, 102, 241, 0.03)',
      borderColor: '#312e81',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '16px'
    },
    defaultContent: {
      html: `<div class="flex flex-col gap-2">
        <span class="text-indigo-400 text-lg">✨</span>
        <h4 class="text-xs font-bold text-white">AI UI Generation</h4>
        <p class="text-[10px] text-slate-400 leading-relaxed">Describe layout wireframes and look at editor modules compile panels in real-time.</p>
      </div>`
    }
  },
  'card-product': {
    type: 'card-product',
    name: 'Product Card',
    category: 'Cards',
    icon: '🛍️',
    defaultPosition: { width: 240, height: 280 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.6)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '10px',
      padding: '10px'
    },
    defaultContent: {
      html: `<div class="flex flex-col h-full justify-between gap-1">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80" class="w-full h-32 object-cover rounded-md border border-slate-800" />
        <h4 class="text-xs font-bold text-white mt-1">Sneaker Max</h4>
        <p class="text-[9px] text-slate-400">Classic red edition comfort fit.</p>
        <div class="flex justify-between items-center mt-2">
          <span class="text-xs font-black text-indigo-400">$120.00</span>
          <button class="bg-indigo-600 text-[9px] font-bold py-1 px-3 rounded text-white select-none">Add</button>
        </div>
      </div>`
    }
  },
  'card-pricing': {
    type: 'card-pricing',
    name: 'Pricing Card',
    category: 'Cards',
    icon: '💎',
    defaultPosition: { width: 260, height: 320 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.5)',
      borderColor: '#6366f1',
      borderStyle: 'solid',
      borderWidth: '2px',
      borderRadius: '12px',
      padding: '24px'
    },
    defaultContent: {
      html: `<div class="flex flex-col h-full justify-between gap-3 text-center">
        <div class="text-[9px] font-bold text-indigo-400 tracking-widest uppercase">Pro Developer</div>
        <div class="text-2xl font-black text-white">$49<span class="text-xs text-slate-500 font-normal">/mo</span></div>
        <p class="text-[10px] text-slate-400 leading-normal">Perfect for advanced builders and growing agency designers.</p>
        <div class="border-t border-slate-800 my-1"></div>
        <ul class="text-[9px] text-slate-400 flex flex-col gap-1.5 text-left px-1">
          <li>✨ Unlimited Page Generations</li>
          <li>📤 Export React / HTML code</li>
          <li>☁️ Custom Domain Mapping</li>
        </ul>
        <button class="bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold py-2 rounded text-white">Subscribe Now</button>
      </div>`
    }
  },
  'card-testimonial': {
    type: 'card-testimonial',
    name: 'Testimonial Card',
    category: 'Cards',
    icon: '💬',
    defaultPosition: { width: 280, height: 160 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.4)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '16px'
    },
    defaultContent: {
      html: `<div class="flex flex-col justify-between h-full gap-2">
        <p class="text-[10px] text-slate-400 italic leading-relaxed">"The layout zoom and alignment guides save so much editing time. Totally recommend it."</p>
        <div class="flex items-center gap-2 mt-1">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&q=80" class="w-7 h-7 rounded-full border border-indigo-500" />
          <div>
            <h5 class="text-[9px] font-bold text-white">Alexa Green</h5>
            <p class="text-[8px] text-slate-500">Staff Designer</p>
          </div>
        </div>
      </div>`
    }
  },

  // ==========================================
  // 7. FORMS
  // ==========================================
  'form-input': {
    type: 'form-input',
    name: 'Input',
    category: 'Forms',
    icon: '🔤',
    defaultPosition: { width: 220, height: 40 },
    defaultStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '6px',
      padding: '8px 12px'
    },
    defaultContent: {
      html: '<input type="text" placeholder="Enter text..." class="w-full h-full bg-transparent text-xs text-white outline-none border-none pointer-events-none" disabled />'
    }
  },
  'form-textarea': {
    type: 'form-textarea',
    name: 'Textarea',
    category: 'Forms',
    icon: '📝',
    defaultPosition: { width: 280, height: 80 },
    defaultStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '6px',
      padding: '8px 12px'
    },
    defaultContent: {
      html: '<textarea placeholder="Enter message..." class="w-full h-full bg-transparent text-xs text-white outline-none border-none resize-none pointer-events-none" disabled></textarea>'
    }
  },
  'form-select': {
    type: 'form-select',
    name: 'Select',
    category: 'Forms',
    icon: '🔽',
    defaultPosition: { width: 220, height: 40 },
    defaultStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '6px',
      padding: '8px 12px'
    },
    defaultContent: {
      html: `<div class="flex justify-between items-center w-full h-full text-xs text-slate-300 font-semibold select-none pointer-events-none">
        <span>Select option...</span>
        <span>▼</span>
      </div>`
    }
  },
  'form-checkbox': {
    type: 'form-checkbox',
    name: 'Checkbox',
    category: 'Forms',
    icon: '☑️',
    defaultPosition: { width: 160, height: 30 },
    defaultStyle: {
      backgroundColor: 'transparent',
      padding: '4px'
    },
    defaultContent: {
      html: `<div class="flex items-center gap-2 text-xs font-semibold text-slate-300 pointer-events-none">
        <input type="checkbox" checked class="rounded border-slate-800 text-indigo-600" disabled />
        <span>Agree to terms</span>
      </div>`
    }
  },
  'form-radio': {
    type: 'form-radio',
    name: 'Radio Button',
    category: 'Forms',
    icon: '🔘',
    defaultPosition: { width: 160, height: 30 },
    defaultStyle: {
      backgroundColor: 'transparent',
      padding: '4px'
    },
    defaultContent: {
      html: `<div class="flex items-center gap-2 text-xs font-semibold text-slate-300 pointer-events-none">
        <input type="radio" checked class="border-slate-800 text-indigo-600" disabled />
        <span>Option Selected</span>
      </div>`
    }
  },
  'form-contact': {
    type: 'form-contact',
    name: 'Contact Form',
    category: 'Forms',
    icon: '📋',
    defaultPosition: { width: 450, height: 260 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.6)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '12px',
      padding: '20px'
    },
    defaultContent: {
      html: `<form class="flex flex-col gap-3 h-full justify-between" onsubmit="return false;">
        <h4 class="text-xs font-bold text-white mb-1">Get In Touch</h4>
        <input type="text" placeholder="Name" class="w-full text-[11px] p-2 bg-slate-950 border border-slate-800 rounded text-white outline-none">
        <input type="email" placeholder="Email" class="w-full text-[11px] p-2 bg-slate-950 border border-slate-800 rounded text-white outline-none">
        <textarea placeholder="Message..." class="w-full text-[11px] p-2 bg-slate-950 border border-slate-800 rounded text-white h-16 outline-none resize-none"></textarea>
        <button class="bg-indigo-600 text-[10px] font-bold py-2 px-3 rounded text-white w-full">Send Message</button>
      </form>`
    }
  },
  'form-login': {
    type: 'form-login',
    name: 'Login Form',
    category: 'Forms',
    icon: '🔑',
    defaultPosition: { width: 320, height: 240 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.6)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '12px',
      padding: '24px'
    },
    defaultContent: {
      html: `<form class="flex flex-col gap-3 h-full justify-between" onsubmit="return false;">
        <div class="text-center">
          <h4 class="text-xs font-bold text-white">Sign In</h4>
          <p class="text-[9px] text-slate-500">Access your account details</p>
        </div>
        <input type="email" placeholder="Email Address" class="w-full text-[11px] p-2.5 bg-slate-950 border border-slate-850 rounded text-white outline-none">
        <input type="password" placeholder="Password" class="w-full text-[11px] p-2.5 bg-slate-950 border border-slate-850 rounded text-white outline-none">
        <button class="bg-indigo-600 text-[10px] font-bold py-2.5 rounded text-white w-full">Sign In</button>
      </form>`
    }
  },
  'form-register': {
    type: 'form-register',
    name: 'Registration Form',
    category: 'Forms',
    icon: '📝',
    defaultPosition: { width: 320, height: 300 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.6)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '12px',
      padding: '24px'
    },
    defaultContent: {
      html: `<form class="flex flex-col gap-2.5 h-full justify-between" onsubmit="return false;">
        <div class="text-center">
          <h4 class="text-xs font-bold text-white">Create Account</h4>
          <p class="text-[9px] text-slate-500">Sign up in just 30 seconds</p>
        </div>
        <input type="text" placeholder="Full Name" class="w-full text-[10px] p-2 bg-slate-950 border border-slate-800 rounded text-white">
        <input type="email" placeholder="Email Address" class="w-full text-[10px] p-2 bg-slate-950 border border-slate-800 rounded text-white">
        <input type="password" placeholder="Password" class="w-full text-[10px] p-2 bg-slate-950 border border-slate-800 rounded text-white">
        <button class="bg-indigo-650 text-[10px] font-bold py-2 rounded text-white w-full">Register Account</button>
      </form>`
    }
  },

  'form-search': {
    type: 'form-search',
    name: 'Search Bar',
    category: 'Forms',
    icon: '🔍',
    defaultPosition: { width: 320, height: 42 },
    defaultStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '9999px',
      padding: '0px'
    },
    defaultContent: {
      html: `<div class="flex items-center gap-2 w-full h-full px-4 pointer-events-none">
        <span class="text-slate-500 text-sm">🔍</span>
        <input type="text" placeholder="Search components, templates, docs..." class="w-full bg-transparent text-xs text-slate-300 outline-none border-none placeholder:text-slate-600" disabled />
        <span class="text-[8px] font-mono text-slate-600 bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700">⌘K</span>
      </div>`
    }
  },

// ==========================================
// 8. BUSINESS
// ==========================================
  'business-services': {
    type: 'business-services',
    name: 'Services Section',
    category: 'Business',
    icon: '🛠️',
    defaultPosition: { width: 900, height: 280 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.4)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '16px',
      padding: '32px'
    },
    defaultContent: {
      html: `<div class="flex flex-col gap-4 text-center h-full justify-center">
        <h3 class="text-sm font-bold text-white uppercase tracking-wider">Our Core Services</h3>
        <div class="grid grid-cols-3 gap-4 mt-2">
          <div class="p-4 rounded-lg bg-slate-950/40 border border-slate-800">
            <span class="text-indigo-400 text-lg">💡</span>
            <h5 class="text-xs font-bold text-white mt-1">UX/UI Layouts</h5>
            <p class="text-[9px] text-slate-500 mt-1">Stunning mockup layouts styled dynamically.</p>
          </div>
          <div class="p-4 rounded-lg bg-slate-950/40 border border-slate-800">
            <span class="text-indigo-400 text-lg">⚡</span>
            <h5 class="text-xs font-bold text-white mt-1">Rapid Building</h5>
            <p class="text-[9px] text-slate-500 mt-1">Compile design modules instantly to web output.</p>
          </div>
          <div class="p-4 rounded-lg bg-slate-950/40 border border-slate-800">
            <span class="text-indigo-400 text-lg">⚙️</span>
            <h5 class="text-xs font-bold text-white mt-1">API Integrations</h5>
            <p class="text-[9px] text-slate-500 mt-1">Custom business workflows mapped automatically.</p>
          </div>
        </div>
      </div>`
    }
  },
  'business-team': {
    type: 'business-team',
    name: 'Team Section',
    category: 'Business',
    icon: '👥',
    defaultPosition: { width: 900, height: 280 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.4)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '16px',
      padding: '32px'
    },
    defaultContent: {
      html: `<div class="flex flex-col gap-4 text-center h-full justify-center">
        <h3 class="text-sm font-bold text-white uppercase tracking-wider">Meet Our Leadership Team</h3>
        <div class="grid grid-cols-3 gap-6 mt-2 max-w-[760px] mx-auto w-full">
          <div class="flex flex-col items-center">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80" class="w-12 h-12 rounded-full border border-slate-800 object-cover" />
            <h5 class="text-xs font-bold text-white mt-1.5">Marcus Vance</h5>
            <p class="text-[8px] text-slate-500">CEO & Founder</p>
          </div>
          <div class="flex flex-col items-center">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&q=80" class="w-12 h-12 rounded-full border border-slate-800 object-cover" />
            <h5 class="text-xs font-bold text-white mt-1.5">Sophia Reyes</h5>
            <p class="text-[8px] text-slate-500">Head of UX</p>
          </div>
          <div class="flex flex-col items-center">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80" class="w-12 h-12 rounded-full border border-slate-800 object-cover" />
            <h5 class="text-xs font-bold text-white mt-1.5">David Chen</h5>
            <p class="text-[8px] text-slate-500">CTO</p>
          </div>
        </div>
      </div>`
    }
  },
  'business-profile': {
    type: 'business-profile',
    name: 'Company Profile',
    category: 'Business',
    icon: '🏢',
    defaultPosition: { width: 900, height: 240 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.4)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '16px',
      padding: '32px'
    },
    defaultContent: {
      html: `<div class="flex justify-between items-center h-full w-full gap-8">
        <div class="flex-1 flex flex-col gap-2">
          <h3 class="text-sm font-bold text-white uppercase tracking-wider">GenovaX Technologies</h3>
          <p class="text-[10px] text-slate-400 leading-relaxed">GenovaX is a next-generation website building platform bridging static design wireframes with React component compilation and hosting services.</p>
        </div>
        <div class="grid grid-cols-2 gap-4 text-center shrink-0">
          <div class="p-3 bg-slate-950/40 border border-slate-850 rounded">
            <div class="text-lg font-black text-indigo-400">10M+</div>
            <div class="text-[8px] text-slate-500 uppercase font-mono">Hits / Mo</div>
          </div>
          <div class="p-3 bg-slate-950/40 border border-slate-850 rounded">
            <div class="text-lg font-black text-indigo-400">140+</div>
            <div class="text-[8px] text-slate-500 uppercase font-mono">SaaS Tools</div>
          </div>
        </div>
      </div>`
    }
  },
  'business-about': {
    type: 'business-about',
    name: 'About Us Section',
    category: 'Business',
    icon: 'ℹ️',
    defaultPosition: { width: 900, height: 280 },
    defaultStyle: {
      backgroundColor: 'transparent',
      padding: '24px'
    },
    defaultContent: {
      html: `<div class="flex flex-col md:flex-row justify-between items-center h-full gap-8">
        <div class="flex-1 flex flex-col gap-2">
          <div class="text-[9px] text-indigo-400 uppercase tracking-widest font-bold">About Our Mission</div>
          <h3 class="text-lg font-black text-white">We Build the Future of Frontend Design</h3>
          <p class="text-[10px] text-slate-400 leading-relaxed">Our unified canvas workspace allows teams to prototype visual elements, customize layouts, edit inline texts, and compile code in real-time without deployment latency.</p>
        </div>
        <div class="flex-1">
          <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80" class="rounded-lg border border-slate-800 w-full h-44 object-cover" />
        </div>
      </div>`
    }
  },

  // ==========================================
  // 9. MARKETING
  // ==========================================
  'marketing-hero': {
    type: 'marketing-hero',
    name: 'Hero Section',
    category: 'Marketing',
    icon: '🚀',
    defaultPosition: { width: 900, height: 340 },
    defaultStyle: {
      backgroundImage: 'radial-gradient(ellipse at top right, rgba(99,102,241,0.12) 0%, transparent 60%)',
      backgroundColor: 'rgba(9, 13, 22, 0.8)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '16px',
      padding: '40px'
    },
    defaultContent: {
      html: `<div class="flex flex-col md:flex-row items-center justify-between h-full gap-8">
        <div class="flex-1 flex flex-col gap-3">
          <div class="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-indigo-400 font-extrabold bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 w-fit">✦ GenovaX AI Launch</div>
          <h2 class="text-2xl font-extrabold text-white leading-tight">Design Web Interfaces at the Speed of Thought</h2>
          <p class="text-xs text-slate-400 leading-relaxed">Instantiate, drag, lock, snap, and compile design frames with our professional absolute-positioned builder canvas.</p>
          <div class="flex gap-2 mt-1">
            <button class="bg-indigo-600 text-[10px] font-bold py-2 px-4 rounded-lg text-white shadow-lg shadow-indigo-500/20">Get Started Free</button>
            <button class="border border-slate-700 text-[10px] font-bold py-2 px-4 rounded-lg text-slate-400">Learn More</button>
          </div>
        </div>
        <div class="flex-1 max-w-[340px]">
          <div class="relative">
            <div class="absolute -inset-1 bg-gradient-to-br from-indigo-500/30 to-purple-500/20 rounded-lg blur-xl"></div>
            <img src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&q=80" class="relative rounded-lg shadow-lg border border-slate-800" />
          </div>
        </div>
      </div>`
    }
  },
  'marketing-testimonials': {
    type: 'marketing-testimonials',
    name: 'Testimonials',
    category: 'Marketing',
    icon: '💬',
    defaultPosition: { width: 900, height: 260 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.6)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '12px',
      padding: '24px'
    },
    defaultContent: {
      html: `<div class="flex flex-col items-center gap-4 text-center h-full justify-center">
        <span class="text-xs text-indigo-400 font-bold uppercase tracking-wider font-mono">Testimonials</span>
        <h3 class="text-lg font-black text-white">What Our Customers Say</h3>
        <div class="grid grid-cols-2 gap-6 max-w-[800px] mt-2">
          <div class="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-left">
            <p class="text-[10px] text-slate-400 italic">"GenovaX has completely transformed our design workflow. The canvas speed is incredible!"</p>
            <div class="text-[9px] font-bold text-white mt-2">- Sarah K., Lead Designer</div>
          </div>
          <div class="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-left">
            <p class="text-[10px] text-slate-400 italic">"The drag-and-drop combined with custom CSS settings gives us absolute layout freedom."</p>
            <div class="text-[9px] font-bold text-white mt-2">- James L., CTO</div>
          </div>
        </div>
      </div>`
    }
  },
  'marketing-faq': {
    type: 'marketing-faq',
    name: 'FAQ Section',
    category: 'Marketing',
    icon: '❓',
    defaultPosition: { width: 600, height: 240 },
    defaultStyle: {
      backgroundColor: 'transparent',
      padding: '16px'
    },
    defaultContent: {
      html: `<div class="flex flex-col gap-3 h-full justify-center">
        <h3 class="text-base font-black text-white text-center mb-1">Frequently Asked Questions</h3>
        <div class="space-y-2">
          <details class="bg-slate-950/40 border border-slate-800 rounded p-2.5" open>
            <summary class="text-xs font-bold cursor-pointer text-white">Is it fully responsive?</summary>
            <p class="text-[10px] text-slate-400 mt-1">Yes, you can edit layout properties in Desktop, Tablet, and Mobile viewports.</p>
          </details>
          <details class="bg-slate-950/40 border border-slate-800 rounded p-2.5">
            <summary class="text-xs font-bold cursor-pointer text-white">Can I export clean code?</summary>
            <p class="text-[10px] text-slate-400 mt-1">Absolutely! You can export React, HTML/CSS, Tailwind CSS, or JSON formats.</p>
          </details>
        </div>
      </div>`
    }
  },
  'marketing-newsletter': {
    type: 'marketing-newsletter',
    name: 'Newsletter Signup',
    category: 'Marketing',
    icon: '✉️',
    defaultPosition: { width: 600, height: 140 },
    defaultStyle: {
      backgroundColor: 'rgba(99, 102, 241, 0.05)',
      borderColor: '#312e81',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '10px',
      padding: '20px'
    },
    defaultContent: {
      html: `<div class="flex justify-between items-center h-full w-full gap-4">
        <div class="flex flex-col gap-1 max-w-[280px]">
          <h4 class="text-xs font-bold text-white">Subscribe to Newsletter</h4>
          <p class="text-[9px] text-slate-500">Get product release news and discounts.</p>
        </div>
        <form class="flex gap-2 flex-1 max-w-[260px]" onsubmit="return false;">
          <input type="email" placeholder="Your Email" class="w-full text-[10px] p-2 bg-slate-950 border border-slate-850 rounded text-white outline-none">
          <button class="bg-indigo-600 text-[10px] font-bold px-3 rounded text-white shrink-0">Join</button>
        </form>
      </div>`
    }
  },
  'marketing-cta': {
    type: 'marketing-cta',
    name: 'Call To Action Section',
    category: 'Marketing',
    icon: '📢',
    defaultPosition: { width: 900, height: 180 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.7)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '12px',
      padding: '24px'
    },
    defaultContent: {
      html: `<div class="flex justify-between items-center h-full w-full px-6">
        <div class="flex flex-col gap-1">
          <h3 class="text-sm font-black text-white uppercase tracking-wider">Ready to Build Something Awesome?</h3>
          <p class="text-[10px] text-slate-500">Create beautiful grids, edit inline texts, and deploy now.</p>
        </div>
        <button class="bg-indigo-650 hover:bg-indigo-500 text-xs font-bold py-2.5 px-6 rounded text-white shrink-0">Start Free Trial</button>
      </div>`
    }
  },

  'marketing-hero-centered': {
    type: 'marketing-hero-centered',
    name: 'Centered Hero',
    category: 'Marketing',
    icon: '🚀',
    defaultPosition: { width: 900, height: 360 },
    defaultStyle: {
      backgroundImage: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.05) 100%)',
      borderColor: '#312e81',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '16px',
      padding: '48px'
    },
    defaultContent: {
      html: `<div class="flex flex-col items-center justify-center h-full text-center gap-4 max-w-[700px] mx-auto">
        <div class="text-[9px] uppercase tracking-[0.2em] text-indigo-400 font-extrabold">🚀 GenovaX AI Launch</div>
        <h2 class="text-3xl font-extrabold text-white leading-tight">Design Web Interfaces at the Speed of Thought</h2>
        <p class="text-xs text-slate-400 leading-relaxed max-w-[520px]">Instantiate, drag, lock, snap, and compile design frames with our professional absolute-positioned builder canvas. No coding required.</p>
        <div class="flex gap-3 mt-2">
          <button class="bg-indigo-600 text-xs font-bold py-2.5 px-6 rounded-lg text-white shadow-lg shadow-indigo-500/25 pointer-events-none">Start Free Trial</button>
          <button class="border border-slate-700 text-xs font-bold py-2.5 px-6 rounded-lg text-slate-300 pointer-events-none">Watch Demo</button>
        </div>
      </div>`
    }
  },
  'marketing-hero-split': {
    type: 'marketing-hero-split',
    name: 'Split Hero',
    category: 'Marketing',
    icon: '🚀',
    defaultPosition: { width: 900, height: 360 },
    defaultStyle: {
      backgroundColor: 'rgba(9, 13, 22, 0.8)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '16px',
      padding: '0px',
      overflow: 'hidden'
    },
    defaultContent: {
      html: `<div class="flex h-full w-full">
        <div class="flex-1 flex flex-col justify-center gap-3 p-10">
          <div class="text-[9px] uppercase tracking-widest text-indigo-400 font-extrabold">⚡ GenovaX AI</div>
          <h2 class="text-2xl font-extrabold text-white leading-tight">Build Beautiful UIs<br/>with Natural Language</h2>
          <p class="text-xs text-slate-400 leading-relaxed">Just describe what you want and watch the AI generate a complete, editable layout in seconds.</p>
          <div class="flex gap-2 mt-1">
            <button class="bg-indigo-600 text-[10px] font-bold py-2 px-4 rounded text-white pointer-events-none">Try It Free</button>
            <button class="border border-slate-700 text-[10px] font-bold py-2 px-4 rounded text-slate-400 pointer-events-none">Learn More</button>
          </div>
        </div>
        <div class="flex-1 bg-gradient-to-br from-indigo-600/20 to-purple-600/10 flex items-center justify-center">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80" class="w-full h-full object-cover opacity-80" />
        </div>
      </div>`
    }
  },

// ==========================================
// 10. E-COMMERCE
// ==========================================
  'ecommerce-grid': {
    type: 'ecommerce-grid',
    name: 'Product Grid',
    category: 'E-Commerce',
    icon: '🛍️',
    defaultPosition: { width: 900, height: 340 },
    defaultStyle: {
      backgroundColor: 'transparent',
      padding: '0px'
    },
    defaultContent: {
      html: `<div class="grid grid-cols-3 gap-6 h-full w-full">
        <div class="bg-slate-900/40 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80" class="w-full h-28 object-cover rounded-md mb-2 border border-slate-850" />
          <h4 class="text-xs font-bold text-white">Classic Red Sneaker</h4>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs font-extrabold text-indigo-400">$89.00</span>
            <button class="bg-indigo-600 text-[9px] font-bold py-1 px-2 rounded text-white">Add</button>
          </div>
        </div>
        <div class="bg-slate-900/40 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80" class="w-full h-28 object-cover rounded-md mb-2 border border-slate-850" />
          <h4 class="text-xs font-bold text-white">Minimalist Smart Watch</h4>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs font-extrabold text-indigo-400">$199.00</span>
            <button class="bg-indigo-600 text-[9px] font-bold py-1 px-2 rounded text-white">Add</button>
          </div>
        </div>
        <div class="bg-slate-900/40 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
          <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80" class="w-full h-28 object-cover rounded-md mb-2 border border-slate-850" />
          <h4 class="text-xs font-bold text-white">Retro Sunglasses</h4>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs font-extrabold text-indigo-400">$45.00</span>
            <button class="bg-indigo-600 text-[9px] font-bold py-1 px-2 rounded text-white">Add</button>
          </div>
        </div>
      </div>`
    }
  },
  'ecommerce-product-card': {
    type: 'ecommerce-product-card',
    name: 'Product Card',
    category: 'E-Commerce',
    icon: '🏷️',
    defaultPosition: { width: 240, height: 300 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.4)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '12px'
    },
    defaultContent: {
      html: `<div class="flex flex-col h-full justify-between gap-1.5">
        <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80" class="w-full h-36 object-cover rounded-md border border-slate-850" />
        <h4 class="text-xs font-bold text-white">Premium Product</h4>
        <div class="flex justify-between items-center mt-1">
          <span class="text-xs font-extrabold text-indigo-400">$99.00</span>
          <span class="text-[8px] text-green-400 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">In Stock</span>
        </div>
      </div>`
    }
  },
  'ecommerce-cart': {
    type: 'ecommerce-cart',
    name: 'Shopping Cart',
    category: 'E-Commerce',
    icon: '🛒',
    defaultPosition: { width: 260, height: 300 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.8)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '10px',
      padding: '16px'
    },
    defaultContent: {
      html: `<div class="flex flex-col h-full justify-between gap-2">
        <div class="flex justify-between items-center pb-2 border-b border-slate-800">
          <span class="text-xs font-extrabold text-white">Cart Summary</span>
          <span class="text-[9px] text-indigo-400 font-bold">(2 items)</span>
        </div>
        <div class="flex-1 flex flex-col gap-2 py-2 overflow-y-auto">
          <div class="flex justify-between text-[10px] text-slate-300">
            <span>👟 Sneaker Max (x1)</span>
            <span>$120.00</span>
          </div>
          <div class="flex justify-between text-[10px] text-slate-300">
            <span>👓 Sunglasses (x1)</span>
            <span>$45.00</span>
          </div>
        </div>
        <div class="border-t border-slate-800 pt-2 flex flex-col gap-2">
          <div class="flex justify-between text-xs font-bold text-white">
            <span>Total:</span>
            <span>$165.00</span>
          </div>
          <button class="bg-indigo-600 text-[10px] font-bold py-2 rounded text-white w-full">Checkout</button>
        </div>
      </div>`
    }
  },
  'ecommerce-details': {
    type: 'ecommerce-details',
    name: 'Product Details',
    category: 'E-Commerce',
    icon: '🔍',
    defaultPosition: { width: 600, height: 300 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.5)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '12px',
      padding: '24px'
    },
    defaultContent: {
      html: `<div class="flex gap-6 h-full items-center">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" class="w-1/3 h-44 object-cover rounded-md border border-slate-850" />
        <div class="flex-1 flex flex-col gap-2">
          <h3 class="text-sm font-bold text-white">Classic Red Comfort Sneaker</h3>
          <p class="text-[10px] text-slate-400 leading-relaxed">Engineered comfort, featuring mesh structures and flexible red sole linings designed to last forever.</p>
          <div class="text-sm font-black text-indigo-400 mt-1">$89.00</div>
          <button class="bg-indigo-650 w-36 text-[10px] font-bold py-2 rounded text-white mt-1">Add to Cart</button>
        </div>
      </div>`
    }
  },
  'ecommerce-checkout': {
    type: 'ecommerce-checkout',
    name: 'Checkout Form',
    category: 'E-Commerce',
    icon: '💳',
    defaultPosition: { width: 600, height: 340 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.7)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '12px',
      padding: '24px'
    },
    defaultContent: {
      html: `<form class="flex flex-col gap-3 h-full justify-between" onsubmit="return false;">
        <h4 class="text-xs font-bold text-white pb-2 border-b border-slate-800">Billing Information</h4>
        <div class="grid grid-cols-2 gap-3">
          <input type="text" placeholder="First Name" class="text-[10px] p-2 bg-slate-950 border border-slate-800 rounded text-white">
          <input type="text" placeholder="Last Name" class="text-[10px] p-2 bg-slate-950 border border-slate-800 rounded text-white">
        </div>
        <input type="text" placeholder="Billing Address" class="w-full text-[10px] p-2 bg-slate-950 border border-slate-800 rounded text-white">
        <div class="grid grid-cols-3 gap-3">
          <input type="text" placeholder="City" class="text-[10px] p-2 bg-slate-950 border border-slate-800 rounded text-white">
          <input type="text" placeholder="Zip" class="text-[10px] p-2 bg-slate-950 border border-slate-800 rounded text-white">
          <input type="text" placeholder="State" class="text-[10px] p-2 bg-slate-950 border border-slate-800 rounded text-white">
        </div>
        <button class="bg-indigo-600 text-[10px] font-bold py-2 rounded text-white w-full mt-1">Pay Now ($165.00)</button>
      </form>`
    }
  },

// ==========================================
// 10b. STATS
// ==========================================
'stats-counters': {
  type: 'stats-counters',
  name: 'Stats Counters',
  category: 'Business',
  icon: '📊',
  defaultPosition: { width: 900, height: 140 },
  defaultStyle: {
    backgroundColor: 'transparent',
    padding: '0px'
  },
  defaultContent: {
    html: `<div class="grid grid-cols-4 gap-6 h-full w-full">
      <div class="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-xl p-5 flex flex-col items-center justify-center text-center">
        <div class="text-2xl font-black text-white">10M+</div>
        <div class="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Active Users</div>
      </div>
      <div class="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-xl p-5 flex flex-col items-center justify-center text-center">
        <div class="text-2xl font-black text-white">99.9%</div>
        <div class="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Uptime</div>
      </div>
      <div class="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-xl p-5 flex flex-col items-center justify-center text-center">
        <div class="text-2xl font-black text-white">50K+</div>
        <div class="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Projects Built</div>
      </div>
      <div class="bg-gradient-to-br from-rose-500/10 to-pink-500/5 border border-rose-500/20 rounded-xl p-5 flex flex-col items-center justify-center text-center">
        <div class="text-2xl font-black text-white">4.9★</div>
        <div class="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Avg Rating</div>
      </div>
    </div>`
  }
},

// ==========================================
// 10c. CONTENT - ADDITIONAL
// ==========================================
'content-timeline': {
  type: 'content-timeline',
  name: 'Timeline',
  category: 'Content',
  icon: '📅',
  defaultPosition: { width: 600, height: 300 },
  defaultStyle: {
    backgroundColor: 'rgba(16, 23, 38, 0.3)',
    borderColor: '#1e293b',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '12px',
    padding: '24px'
  },
  defaultContent: {
    html: `<div class="flex flex-col gap-0 h-full relative">
      <h3 class="text-sm font-bold text-white mb-3">Project Timeline</h3>
      <div class="flex-1 relative pl-6 border-l-2 border-indigo-500/40 space-y-4">
        <div class="relative">
          <div class="absolute -left-[25px] top-0.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-indigo-900"></div>
          <p class="text-[9px] text-indigo-400 font-bold">Phase 1 — Q1 2026</p>
          <p class="text-[10px] text-slate-400 mt-0.5">Initial research, wireframing, and component architecture design.</p>
        </div>
        <div class="relative">
          <div class="absolute -left-[25px] top-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-emerald-900"></div>
          <p class="text-[9px] text-emerald-400 font-bold">Phase 2 — Q2 2026</p>
          <p class="text-[10px] text-slate-400 mt-0.5">Core canvas implementation with drag-and-drop and alignment system.</p>
        </div>
        <div class="relative">
          <div class="absolute -left-[25px] top-0.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-amber-900"></div>
          <p class="text-[9px] text-amber-400 font-bold">Phase 3 — Q3 2026</p>
          <p class="text-[10px] text-slate-400 mt-0.5">AI integration, export system, and multi-page prototype support.</p>
        </div>
      </div>
    </div>`
  }
},
'content-comparison': {
  type: 'content-comparison',
  name: 'Comparison Table',
  category: 'Content',
  icon: '⚖️',
  defaultPosition: { width: 800, height: 260 },
  defaultStyle: {
    backgroundColor: 'rgba(16, 23, 38, 0.4)',
    borderColor: '#1e293b',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '12px',
    padding: '20px'
  },
  defaultContent: {
    html: `<div class="flex flex-col h-full">
      <h3 class="text-xs font-bold text-white mb-3">Feature Comparison</h3>
      <table class="w-full text-left text-[10px] border-collapse">
        <thead>
          <tr class="border-b border-slate-800 text-slate-400 font-semibold">
            <th class="pb-2 font-medium">Feature</th>
            <th class="pb-2 text-center">Free</th>
            <th class="pb-2 text-center">Pro</th>
            <th class="pb-2 text-center">Enterprise</th>
          </tr>
        </thead>
        <tbody class="text-slate-300">
          <tr class="border-b border-slate-800/40">
            <td class="py-2.5 text-slate-400">Components</td>
            <td class="py-2.5 text-center">46</td>
            <td class="py-2.5 text-center text-indigo-400 font-bold">Unlimited</td>
            <td class="py-2.5 text-center text-indigo-400 font-bold">Unlimited</td>
          </tr>
          <tr class="border-b border-slate-800/40">
            <td class="py-2.5 text-slate-400">AI Generations</td>
            <td class="py-2.5 text-center">10/mo</td>
            <td class="py-2.5 text-center">500/mo</td>
            <td class="py-2.5 text-center text-indigo-400 font-bold">Unlimited</td>
          </tr>
          <tr>
            <td class="py-2.5 text-slate-400">Export Formats</td>
            <td class="py-2.5 text-center">HTML</td>
            <td class="py-2.5 text-center">HTML + React</td>
            <td class="py-2.5 text-center text-indigo-400 font-bold">All + API</td>
          </tr>
        </tbody>
      </table>
    </div>`
  }
},

// ==========================================
// 10d. CARDS - ADDITIONAL
// ==========================================
'card-pricing-table': {
  type: 'card-pricing-table',
  name: 'Pricing Table',
  category: 'Cards',
  icon: '💎',
  defaultPosition: { width: 900, height: 340 },
  defaultStyle: {
    backgroundColor: 'transparent',
    padding: '0px'
  },
  defaultContent: {
    html: `<div class="grid grid-cols-3 gap-4 h-full w-full">
      <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Starter</div>
          <div class="text-2xl font-black text-white mt-2">Free</div>
          <p class="text-[9px] text-slate-500 mt-1">Perfect for getting started</p>
        </div>
        <ul class="text-[9px] text-slate-400 space-y-1.5 my-4">
          <li class="flex items-center gap-1"><span class="text-emerald-400">✓</span> 46 components</li>
          <li class="flex items-center gap-1"><span class="text-emerald-400">✓</span> 10 AI generations/mo</li>
          <li class="flex items-center gap-1"><span class="text-emerald-400">✓</span> HTML export</li>
        </ul>
        <button class="w-full text-[10px] font-bold py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">Get Started</button>
      </div>
      <div class="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border-2 border-indigo-500 rounded-xl p-5 flex flex-col justify-between relative">
        <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-[8px] font-bold text-white px-3 py-0.5 rounded-full uppercase tracking-wider">Popular</div>
        <div>
          <div class="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Pro</div>
          <div class="text-2xl font-black text-white mt-2">$29<span class="text-xs text-slate-500 font-normal">/mo</span></div>
          <p class="text-[9px] text-slate-500 mt-1">For professionals and teams</p>
        </div>
        <ul class="text-[9px] text-slate-400 space-y-1.5 my-4">
          <li class="flex items-center gap-1"><span class="text-emerald-400">✓</span> Unlimited components</li>
          <li class="flex items-center gap-1"><span class="text-emerald-400">✓</span> 500 AI generations/mo</li>
          <li class="flex items-center gap-1"><span class="text-emerald-400">✓</span> HTML + React export</li>
        </ul>
        <button class="w-full text-[10px] font-bold py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">Subscribe Now</button>
      </div>
      <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Enterprise</div>
          <div class="text-2xl font-black text-white mt-2">Custom</div>
          <p class="text-[9px] text-slate-500 mt-1">For large organizations</p>
        </div>
        <ul class="text-[9px] text-slate-400 space-y-1.5 my-4">
          <li class="flex items-center gap-1"><span class="text-emerald-400">✓</span> Everything in Pro</li>
          <li class="flex items-center gap-1"><span class="text-emerald-400">✓</span> Unlimited AI</li>
          <li class="flex items-center gap-1"><span class="text-emerald-400">✓</span> API access + SSO</li>
        </ul>
        <button class="w-full text-[10px] font-bold py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">Contact Sales</button>
      </div>
    </div>`
  }
},

// ==========================================
// 11. FOOTER
// ==========================================
  'footer-simple': {
    type: 'footer-simple',
    name: 'Simple Footer',
    category: 'Footer',
    icon: '👣',
    defaultPosition: { width: 900, height: 80 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.9)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '20px'
    },
    defaultContent: {
      html: `<div class="flex justify-between items-center h-full w-full text-[10px] text-slate-400 font-semibold px-4">
        <span>⚡ GenovaX AI Builder</span>
        <span>© 2026. All rights reserved.</span>
      </div>`
    }
  },
  'footer-block': {
    type: 'footer-block',
    name: 'Multi-Column Footer',
    category: 'Footer',
    icon: '👣',
    defaultPosition: { width: 900, height: 180 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.9)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '24px'
    },
    defaultContent: {
      html: `<div class="flex flex-col md:flex-row justify-between items-start h-full w-full gap-4 text-xs">
        <div class="flex flex-col gap-1.5">
          <div class="font-extrabold text-white text-sm">⚡ GenovaX</div>
          <div class="text-[10px] text-slate-500">© 2026 GenovaX Technologies.</div>
        </div>
        <div class="flex gap-8 text-[10px] text-slate-400 font-semibold">
          <div class="flex flex-col gap-1">
            <span class="text-white">Product</span>
            <span class="hover:text-white cursor-pointer mt-1">Builder</span>
            <span class="hover:text-white cursor-pointer">Templates</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-white">Resources</span>
            <span class="hover:text-white cursor-pointer mt-1">Guides</span>
            <span class="hover:text-white cursor-pointer">Support</span>
          </div>
        </div>
      </div>`
    }
  },
  'footer-social': {
    type: 'footer-social',
    name: 'Social Footer',
    category: 'Footer',
    icon: '🔗',
    defaultPosition: { width: 900, height: 100 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.9)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '16px'
    },
    defaultContent: {
      html: `<div class="flex justify-between items-center h-full w-full px-4 text-xs text-slate-400 font-semibold">
        <span>Connect with us:</span>
        <div class="flex gap-3">
          <span class="hover:text-white cursor-pointer">𝕏 Twitter</span>
          <span class="hover:text-white cursor-pointer">🐙 GitHub</span>
          <span class="hover:text-white cursor-pointer">💼 LinkedIn</span>
        </div>
      </div>`
    }
  },
  'footer-copyright': {
    type: 'footer-copyright',
    name: 'Copyright Footer',
    category: 'Footer',
    icon: '🪧',
    defaultPosition: { width: 900, height: 50 },
    defaultStyle: {
      backgroundColor: '#090d16',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '6px',
      padding: '12px'
    },
    defaultContent: {
      html: '<div class="text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">© 2026 GENOVAX. DESIGNED AT THE SPEED OF THOUGHT.</div>'
    }
  },
  'footer-minimal': {
    type: 'footer-minimal',
    name: 'Minimal Footer',
    category: 'Footer',
    icon: '👣',
    defaultPosition: { width: 900, height: 48 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.5)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '6px',
      padding: '12px 20px'
    },
    defaultContent: {
      html: `<div class="flex items-center justify-between h-full w-full text-[9px] text-slate-500">
        <span class="font-semibold">© 2026 GenovaX. All rights reserved.</span>
        <div class="flex gap-4">
          <span class="hover:text-slate-300 cursor-pointer">Privacy</span>
          <span class="hover:text-slate-300 cursor-pointer">Terms</span>
          <span class="hover:text-slate-300 cursor-pointer">Contact</span>
        </div>
      </div>`
    }
  }
};
