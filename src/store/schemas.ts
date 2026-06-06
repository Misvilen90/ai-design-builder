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
  // 1. LAYOUT
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
    defaultContent: { html: '<div class="text-textMuted-dark text-xs flex justify-center items-center h-full">💡 Grid Container. Drop components here.</div>' }
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
    defaultContent: { html: '<div class="text-textMuted-dark text-xs text-center">Section Box</div>' }
  },
  'layout-grid': {
    type: 'layout-grid',
    name: 'Grid Columns',
    category: 'Layout',
    icon: '🎛️',
    defaultPosition: { width: 900, height: 160 },
    defaultStyle: {
      backgroundColor: 'transparent',
      padding: '0px'
    },
    defaultContent: {
      html: `<div class="grid grid-cols-3 gap-4 h-full w-full">
        <div class="border border-dashed border-border-dark bg-card-dark/20 rounded-md p-4 flex flex-col justify-center items-center text-xs text-textMuted-dark">Col 1</div>
        <div class="border border-dashed border-border-dark bg-card-dark/20 rounded-md p-4 flex flex-col justify-center items-center text-xs text-textMuted-dark">Col 2</div>
        <div class="border border-dashed border-border-dark bg-card-dark/20 rounded-md p-4 flex flex-col justify-center items-center text-xs text-textMuted-dark">Col 3</div>
      </div>`
    }
  },

  // 2. NAVIGATION
  'nav-bar': {
    type: 'nav-bar',
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
      html: `<div class="flex justify-between items-center h-full w-full">
        <div class="font-extrabold text-sm text-indigo-400">⚡ GENOVAX</div>
        <div class="flex gap-4 text-xs font-semibold text-textMuted-dark">
          <span class="hover:text-white cursor-pointer">Product</span>
          <span class="hover:text-white cursor-pointer">Templates</span>
          <span class="hover:text-white cursor-pointer">Pricing</span>
        </div>
        <button class="bg-indigo-600 text-[10px] font-bold px-3 py-1 rounded-md text-white">Sign In</button>
      </div>`
    }
  },

  // 3. CONTENT
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
    defaultContent: { text: 'Premium SaaS Dashboard UI' }
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
  'content-accordion': {
    type: 'content-accordion',
    name: 'Accordion',
    category: 'Content',
    icon: '📂',
    defaultPosition: { width: 600, height: 130 },
    defaultStyle: {
      backgroundColor: 'transparent',
      padding: '8px'
    },
    defaultContent: {
      html: `<div class="w-full flex flex-col gap-2">
        <details class="bg-card-dark/40 border border-border-dark rounded-md p-3 group" open>
          <summary class="text-xs font-semibold cursor-pointer select-none text-textMain-dark flex justify-between items-center list-none">
            <span>What is GenovaX?</span>
            <span class="transition-transform group-open:rotate-180">▼</span>
          </summary>
          <p class="text-[11px] text-textMuted-dark mt-2">GenovaX is a next-generation website editor bridging static Figma wireframes with Wix-like responsive hosting.</p>
        </details>
      </div>`
    }
  },

  // 4. MEDIA
  'media-image': {
    type: 'media-image',
    name: 'Image Box',
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

  // 5. BUTTONS
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

  // 6. CARDS
  'card-feature': {
    type: 'card-feature',
    name: 'Feature Card',
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
        <span class="text-indigo-400 text-lg">✨</span>
        <h4 class="text-xs font-bold text-white">AI Layout Design</h4>
        <p class="text-[10px] text-textMuted-dark leading-relaxed">Describe a layout and watch the AI assemble editable panels in real-time.</p>
      </div>`
    }
  },

  // 7. FORMS
  'form-contact': {
    type: 'form-contact',
    name: 'Contact Form',
    category: 'Forms',
    icon: '📝',
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
        <input type="text" placeholder="Name" class="w-full text-[11px] p-2 bg-[#090d16] border border-border-dark rounded-md text-white outline-none">
        <input type="email" placeholder="Email" class="w-full text-[11px] p-2 bg-[#090d16] border border-border-dark rounded-md text-white outline-none">
        <textarea placeholder="Message..." class="w-full text-[11px] p-2 bg-[#090d16] border border-border-dark rounded-md text-white h-16 outline-none resize-none"></textarea>
        <button class="bg-indigo-600 text-[10px] font-bold py-2 px-3 rounded-md text-white w-full">Send Message</button>
      </form>`
    }
  },

  // 8. BUSINESS
  'business-pricing': {
    type: 'business-pricing',
    name: 'Pricing Card',
    category: 'Business',
    icon: '💎',
    defaultPosition: { width: 280, height: 320 },
    defaultStyle: {
      backgroundColor: 'rgba(99, 102, 241, 0.03)',
      borderColor: '#6366f1',
      borderStyle: 'solid',
      borderWidth: '2px',
      borderRadius: '12px',
      padding: '24px'
    },
    defaultContent: {
      html: `<div class="flex flex-col h-full justify-between gap-3 text-center">
        <div class="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">Pro Developer</div>
        <div class="text-3xl font-extrabold text-white">$49<span class="text-xs text-textMuted-dark">/mo</span></div>
        <p class="text-[10px] text-textMuted-dark">Perfect for advanced builders and growing agencies.</p>
        <div class="border-t border-border-dark/60 my-2"></div>
        <ul class="text-[10px] text-textMuted-dark flex flex-col gap-2 text-left px-2">
          <li>✨ Unlimited Page Generations</li>
          <li>📤 Export React / HTML code</li>
          <li>☁️ Custom Domain Mapping</li>
        </ul>
        <button class="bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold py-2 rounded-md text-white">Subscribe Now</button>
      </div>`
    }
  },

  // 9. MARKETING
  'mkt-hero': {
    type: 'mkt-hero',
    name: 'Hero Block',
    category: 'Marketing',
    icon: '🚀',
    defaultPosition: { width: 900, height: 340 },
    defaultStyle: {
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
          <div class="text-[9px] uppercase tracking-widest text-indigo-400 font-extrabold">GenovaX AI Release</div>
          <h2 class="text-2xl font-extrabold text-white leading-tight">Empower Web Layouts with Agentic AI</h2>
          <p class="text-xs text-textMuted-dark leading-relaxed">Instantiate, drag, lock, snap, and compile design frames with our professional absolute-positioned builder canvas.</p>
          <button class="bg-indigo-600 w-32 text-[10px] font-bold py-2 rounded-md text-white mt-2">Get Started Free</button>
        </div>
        <div class="flex-1 max-w-[340px]">
          <img src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&q=80" class="rounded-lg shadow-glow shadow-indigo-500/10 border border-border-dark" />
        </div>
      </div>`
    }
  },

  // 10. E-COMMERCE
  'ecom-grid': {
    type: 'ecom-grid',
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
        <div class="bg-card-dark/40 border border-border-dark rounded-lg p-3 flex flex-col justify-between">
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80" class="w-full h-28 object-cover rounded-md mb-2" />
          <h4 class="text-xs font-bold text-white">Classic Red Sneaker</h4>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs font-extrabold text-indigo-400">$89</span>
            <button class="bg-indigo-600 text-[9px] font-bold py-1 px-2 rounded text-white">Add</button>
          </div>
        </div>
        <div class="bg-card-dark/40 border border-border-dark rounded-lg p-3 flex flex-col justify-between">
          <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80" class="w-full h-28 object-cover rounded-md mb-2" />
          <h4 class="text-xs font-bold text-white">Minimalist Smart Watch</h4>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs font-extrabold text-indigo-400">$199</span>
            <button class="bg-indigo-600 text-[9px] font-bold py-1 px-2 rounded text-white">Add</button>
          </div>
        </div>
        <div class="bg-card-dark/40 border border-border-dark rounded-lg p-3 flex flex-col justify-between">
          <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80" class="w-full h-28 object-cover rounded-md mb-2" />
          <h4 class="text-xs font-bold text-white">Retro Sunglasses</h4>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs font-extrabold text-indigo-400">$45</span>
            <button class="bg-indigo-600 text-[9px] font-bold py-1 px-2 rounded text-white">Add</button>
          </div>
        </div>
      </div>`
    }
  },

  // 11. FOOTER
  'footer-block': {
    type: 'footer-block',
    name: 'Footer',
    category: 'Footer',
    icon: '👣',
    defaultPosition: { width: 900, height: 120 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.9)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '24px'
    },
    defaultContent: {
      html: `<div class="flex flex-col md:flex-row justify-between items-center h-full w-full gap-4 text-xs">
        <div class="flex flex-col gap-1">
          <div class="font-extrabold text-white text-sm">⚡ GenovaX</div>
          <div class="text-[10px] text-textMuted-dark">© 2026 GenovaX. All rights reserved.</div>
        </div>
        <div class="flex gap-4 text-[10px] text-textMuted-dark font-semibold">
          <span class="hover:text-white cursor-pointer">Privacy Policy</span>
          <span class="hover:text-white cursor-pointer">Terms of Service</span>
          <span class="hover:text-white cursor-pointer">Security</span>
        </div>
      </div>`
    }
  },

  // 12. BLOG
  'blog-card': {
    type: 'blog-card',
    name: 'Blog Post Card',
    category: 'Blog',
    icon: '📝',
    defaultPosition: { width: 280, height: 260 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.4)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '12px'
    },
    defaultContent: {
      html: `<div class="flex flex-col gap-2 h-full justify-between">
        <img src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=300&q=80" class="w-full h-24 object-cover rounded-md" />
        <span class="text-[8px] text-indigo-400 font-extrabold uppercase tracking-widest font-mono">Productivity</span>
        <h4 class="text-xs font-bold text-white line-clamp-2">How to Optimize Your Design Workspace</h4>
        <p class="text-[9px] text-textMuted-dark line-clamp-2">Learn UX secrets from professional designers at Framer and Figma.</p>
        <div class="text-[8px] text-slate-500 mt-1">June 6, 2026 • 5 min read</div>
      </div>`
    }
  },

  // 13. SOCIAL
  'social-share': {
    type: 'social-share',
    name: 'Social Share',
    category: 'Social',
    icon: '🔗',
    defaultPosition: { width: 280, height: 50 },
    defaultStyle: {
      backgroundColor: 'transparent',
      padding: '8px'
    },
    defaultContent: {
      html: `<div class="flex gap-2 justify-center items-center h-full w-full">
        <button class="bg-[#1877f2] text-[10px] font-bold py-1.5 px-3 rounded text-white flex items-center gap-1">Facebook</button>
        <button class="bg-[#1da1f2] text-[10px] font-bold py-1.5 px-3 rounded text-white flex items-center gap-1">Twitter</button>
        <button class="bg-[#0a66c2] text-[10px] font-bold py-1.5 px-3 rounded text-white flex items-center gap-1">LinkedIn</button>
      </div>`
    }
  },

  // 14. ADVANCED
  'adv-chart': {
    type: 'adv-chart',
    name: 'Analytics Chart',
    category: 'Advanced',
    icon: '📊',
    defaultPosition: { width: 450, height: 200 },
    defaultStyle: {
      backgroundColor: 'rgba(16, 23, 38, 0.7)',
      borderColor: '#1e293b',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '8px',
      padding: '16px'
    },
    defaultContent: {
      html: `<div class="flex flex-col gap-2 h-full justify-between">
        <div class="flex justify-between items-center">
          <span class="text-xs font-extrabold text-white">Conversion Funnel</span>
          <span class="text-[9px] text-green-400 font-bold font-mono">+18.4% YoY</span>
        </div>
        <div class="flex items-end gap-3 h-24 pt-2">
          <div class="bg-indigo-500/20 hover:bg-indigo-500 transition-colors w-full h-[30%] rounded-t-sm" title="Jan: 30%"></div>
          <div class="bg-indigo-500/20 hover:bg-indigo-500 transition-colors w-full h-[45%] rounded-t-sm" title="Feb: 45%"></div>
          <div class="bg-indigo-500/20 hover:bg-indigo-500 transition-colors w-full h-[65%] rounded-t-sm" title="Mar: 65%"></div>
          <div class="bg-indigo-500 hover:bg-indigo-400 transition-colors w-full h-[85%] rounded-t-sm" title="Apr: 85%"></div>
          <div class="bg-indigo-500/20 hover:bg-indigo-500 transition-colors w-full h-[55%] rounded-t-sm" title="May: 55%"></div>
          <div class="bg-indigo-500/20 hover:bg-indigo-500 transition-colors w-full h-[95%] rounded-t-sm" title="Jun: 95%"></div>
        </div>
        <div class="flex justify-between text-[8px] text-slate-500 uppercase font-mono px-0.5">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
        </div>
      </div>`
    }
  }
};
