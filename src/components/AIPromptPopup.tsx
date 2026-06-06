import React, { useState } from 'react';
import { useBuilderStore, Page } from '../store/useBuilderStore';
import { Sparkles, X, Lightbulb, Play, AlertCircle } from 'lucide-react';

interface AIPromptPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onShowLoading: (loading: boolean) => void;
}

export const AIPromptPopup: React.FC<AIPromptPopupProps> = ({ 
  isOpen, 
  onClose,
  onShowLoading
}) => {
  const { setPages, activePageId, pages, theme } = useBuilderStore();
  const [promptValue, setPromptValue] = useState('');
  
  const suggestions = [
    { 
      title: 'Restaurant Menu', 
      text: 'Create a modern restaurant website with hero section, menu cards and contact form' 
    },
    { 
      title: 'SaaS Platform', 
      text: 'Build a SaaS landing page with pricing tables and testimonials' 
    },
    { 
      title: 'E-Commerce Store', 
      text: 'Create an e-commerce fashion store homepage' 
    }
  ];

  const handleGenerate = () => {
    if (!promptValue.trim()) return;

    onShowLoading(true);
    onClose();

    // Mock AI generator compiled layout delay
    setTimeout(() => {
      const promptLower = promptValue.toLowerCase();
      let generatedComps = [];

      if (promptLower.includes('restaurant') || promptLower.includes('food') || promptLower.includes('menu')) {
        // 1. Restaurant website layout template
        generatedComps = [
          {
            id: 'res-hero',
            type: 'mkt-hero',
            name: 'Hero Gourmet',
            category: 'Marketing',
            icon: '🚀',
            content: {
              html: `<div class="flex flex-col md:flex-row items-center justify-between h-full gap-8">
                <div class="flex-1 flex flex-col gap-3">
                  <span class="text-[9px] uppercase font-bold text-amber-500 tracking-wider">Five-Star Dining</span>
                  <h2 class="text-2xl font-extrabold text-white">Le Petit Bistro</h2>
                  <p class="text-xs text-textMuted-dark leading-relaxed">Experience artisanal recipes prepared by award-winning chefs, made with organic local ingredients.</p>
                  <button class="bg-amber-600 w-36 text-[10px] font-bold py-2 rounded-md text-white mt-2">Book a Table 🍷</button>
                </div>
                <div class="flex-1 max-w-[340px]">
                  <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" class="rounded-lg border border-amber-500/20 shadow-lg shadow-amber-500/5" />
                </div>
              </div>`
            },
            style: {
              backgroundColor: 'rgba(217, 119, 6, 0.04)',
              borderColor: 'rgba(217, 119, 6, 0.2)',
              borderStyle: 'solid',
              borderWidth: '1px',
              borderRadius: '12px',
              padding: '30px'
            },
            position: { left: 50, top: 40, width: 900, height: 320, rotate: 0, zIndex: 1 }
          },
          {
            id: 'res-menu-heading',
            type: 'content-heading',
            name: 'Menu Title',
            category: 'Content',
            icon: '🔤',
            content: { text: '🍳 Our Signature Dishes' },
            style: {
              fontSize: '22px',
              fontWeight: '800',
              color: '#d97706',
              textAlign: 'center'
            },
            position: { left: 200, top: 390, width: 600, height: 40, rotate: 0, zIndex: 2 }
          },
          {
            id: 'res-menu-grid',
            type: 'layout-grid',
            name: 'Menu Cards Grid',
            category: 'Layout',
            icon: '🎛️',
            defaultStyle: {},
            content: {
              html: `<div class="grid grid-cols-3 gap-5 h-full w-full">
                <div class="bg-card-dark/30 border border-border-dark p-3 rounded-lg flex flex-col justify-between">
                  <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80" class="w-full h-24 object-cover rounded mb-2" />
                  <h4 class="text-xs font-bold text-white">Woodfired Margherita</h4>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs font-extrabold text-amber-500">$16.50</span>
                  </div>
                </div>
                <div class="bg-card-dark/30 border border-border-dark p-3 rounded-lg flex flex-col justify-between">
                  <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80" class="w-full h-24 object-cover rounded mb-2" />
                  <h4 class="text-xs font-bold text-white">Angus Cheese Burger</h4>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs font-extrabold text-amber-500">$18.99</span>
                  </div>
                </div>
                <div class="bg-card-dark/30 border border-border-dark p-3 rounded-lg flex flex-col justify-between">
                  <img src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&q=80" class="w-full h-24 object-cover rounded mb-2" />
                  <h4 class="text-xs font-bold text-white">Avocado Poached Eggs</h4>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs font-extrabold text-amber-500">$14.00</span>
                  </div>
                </div>
              </div>`
            },
            style: { backgroundColor: 'transparent', padding: '0px' },
            position: { left: 50, top: 450, width: 900, height: 240, rotate: 0, zIndex: 3 }
          },
          {
            id: 'res-contact',
            type: 'form-contact',
            name: 'Reservation Form',
            category: 'Forms',
            icon: '📝',
            content: {
              html: `<form class="flex flex-col gap-2 h-full justify-between" onsubmit="return false;">
                <h4 class="text-xs font-bold text-amber-500 text-center uppercase tracking-wider mb-1">Reserve a Table</h4>
                <div class="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Full Name" class="text-[10px] p-2 bg-[#090d16] border border-border-dark rounded text-white outline-none">
                  <input type="email" placeholder="Email Address" class="text-[10px] p-2 bg-[#090d16] border border-border-dark rounded text-white outline-none">
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <input type="date" class="text-[10px] p-2 bg-[#090d16] border border-border-dark rounded text-white outline-none">
                  <input type="time" class="text-[10px] p-2 bg-[#090d16] border border-border-dark rounded text-white outline-none">
                </div>
                <button class="bg-amber-600 text-[10px] font-bold py-2 rounded text-white w-full">Submit Table Request</button>
              </form>`
            },
            style: {
              backgroundColor: 'rgba(16, 23, 38, 0.7)',
              borderColor: '#1e293b',
              borderStyle: 'solid',
              borderWidth: '1px',
              borderRadius: '12px',
              padding: '16px'
            },
            position: { left: 225, top: 720, width: 450, height: 210, rotate: 0, zIndex: 4 }
          }
        ];
      } else if (promptLower.includes('saas') || promptLower.includes('pricing') || promptLower.includes('testimonials')) {
        // 2. SaaS landing page templates
        generatedComps = [
          {
            id: 'saas-hero',
            type: 'mkt-hero',
            name: 'Hero SaaS',
            category: 'Marketing',
            icon: '🚀',
            content: {
              html: `<div class="flex flex-col md:flex-row items-center justify-between h-full gap-8">
                <div class="flex-1 flex flex-col gap-3">
                  <span class="text-[9px] uppercase font-bold text-indigo-400 tracking-wider">AI Operations v2.4</span>
                  <h2 class="text-2xl font-extrabold text-white">DevOps Workflow Automation</h2>
                  <p class="text-xs text-textMuted-dark leading-relaxed">Automate build pipelines, orchestrate kubernetes containers, and track server resource metrics using AI-driven dashboards.</p>
                  <button class="bg-indigo-600 w-36 text-[10px] font-bold py-2 rounded-md text-white mt-2">Deploy Sandbox Free</button>
                </div>
                <div class="flex-1 max-w-[340px]">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80" class="rounded-lg border border-indigo-500/20 shadow-lg shadow-indigo-500/5" />
                </div>
              </div>`
            },
            style: {
              backgroundColor: 'rgba(99, 102, 241, 0.04)',
              borderColor: 'rgba(99, 102, 241, 0.2)',
              borderStyle: 'solid',
              borderWidth: '1px',
              borderRadius: '12px',
              padding: '30px'
            },
            position: { left: 50, top: 40, width: 900, height: 320, rotate: 0, zIndex: 1 }
          },
          {
            id: 'saas-price-heading',
            type: 'content-heading',
            name: 'Pricing Header',
            category: 'Content',
            icon: '🔤',
            content: { text: '💎 Simple Tier Pricing' },
            style: {
              fontSize: '22px',
              fontWeight: '800',
              color: '#818cf8',
              textAlign: 'center'
            },
            position: { left: 200, top: 390, width: 600, height: 40, rotate: 0, zIndex: 2 }
          },
          {
            id: 'saas-pricing-grid',
            type: 'layout-grid',
            name: 'Pricing Grid Layout',
            category: 'Layout',
            icon: '🎛️',
            content: {
              html: `<div class="grid grid-cols-2 gap-8 h-full w-full">
                <div class="bg-card-dark/30 border border-border-dark p-6 rounded-lg flex flex-col justify-between">
                  <div>
                    <h5 class="text-xs font-bold text-white">Starter Team</h5>
                    <div class="text-2xl font-extrabold text-white mt-2">$19<span class="text-xs text-slate-500 font-medium">/mo</span></div>
                    <p class="text-[10px] text-textMuted-dark mt-1">Excellent for single developers and hobby projects.</p>
                    <ul class="text-[10px] text-textMuted-dark mt-4 space-y-1">
                      <li>⚡ 2 Core Cloud Containers</li>
                      <li>📁 10GB SSD storage</li>
                    </ul>
                  </div>
                  <button class="bg-[#101726] border border-border-dark text-[10px] font-bold py-2 rounded text-white mt-4">Select Starter</button>
                </div>
                <div class="bg-card-dark/30 border border-indigo-500/40 p-6 rounded-lg flex flex-col justify-between shadow-glow shadow-indigo-500/5">
                  <div>
                    <h5 class="text-xs font-bold text-indigo-400">Enterprise Pro</h5>
                    <div class="text-2xl font-extrabold text-white mt-2">$59<span class="text-xs text-slate-500 font-medium">/mo</span></div>
                    <p class="text-[10px] text-textMuted-dark mt-1">Advanced capabilities for high-performance squads.</p>
                    <ul class="text-[10px] text-textMuted-dark mt-4 space-y-1">
                      <li>⚡ 16 Core Cloud Containers</li>
                      <li>📁 Unlimited SSD storage</li>
                    </ul>
                  </div>
                  <button class="bg-indigo-600 text-[10px] font-bold py-2 rounded text-white mt-4">Select Pro</button>
                </div>
              </div>`
            },
            style: { backgroundColor: 'transparent', padding: '0px' },
            position: { left: 150, top: 450, width: 600, height: 280, rotate: 0, zIndex: 3 }
          }
        ];
      } else {
        // 3. E-commerce website templates
        generatedComps = [
          {
            id: 'ecom-nav',
            type: 'nav-bar',
            name: 'Ecom Navbar',
            category: 'Navigation',
            icon: '🌐',
            content: {
              html: `<div class="flex justify-between items-center h-full w-full">
                <div class="font-extrabold text-sm text-indigo-400">⚡ APPAREL STORE</div>
                <div class="flex gap-4 text-xs font-semibold text-textMuted-dark">
                  <span class="hover:text-white cursor-pointer">Summer Sale</span>
                  <span class="hover:text-white cursor-pointer">Men</span>
                  <span class="hover:text-white cursor-pointer">Women</span>
                </div>
                <button class="bg-indigo-600 text-[10px] font-bold px-3 py-1 rounded-md text-white">Cart (0)</button>
              </div>`
            },
            style: {
              backgroundColor: 'rgba(16, 23, 38, 0.9)',
              borderColor: '#1e293b',
              borderStyle: 'solid',
              borderWidth: '1px',
              borderRadius: '8px',
              padding: '12px 24px'
            },
            position: { left: 50, top: 20, width: 900, height: 60, rotate: 0, zIndex: 1 }
          },
          {
            id: 'ecom-heading',
            type: 'content-heading',
            name: 'Ecom Heading',
            category: 'Content',
            icon: '🔤',
            content: { text: '🔥 Summer Season New Releases' },
            style: {
              fontSize: '20px',
              fontWeight: '800',
              color: '#818cf8',
              textAlign: 'center'
            },
            position: { left: 200, top: 110, width: 600, height: 40, rotate: 0, zIndex: 2 }
          },
          {
            id: 'ecom-products',
            type: 'ecom-grid',
            name: 'Apparel Grid',
            category: 'E-Commerce',
            icon: '🛍️',
            content: {
              html: `<div class="grid grid-cols-3 gap-6 h-full w-full">
                <div class="bg-card-dark/40 border border-border-dark rounded-lg p-3 flex flex-col justify-between">
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80" class="w-full h-24 object-cover rounded-md mb-2" />
                  <h4 class="text-[11px] font-bold text-white">Speedrunner Red</h4>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs font-extrabold text-indigo-400">$95</span>
                    <button class="bg-indigo-600 text-[9px] font-bold py-1 px-2 rounded text-white">Add</button>
                  </div>
                </div>
                <div class="bg-card-dark/40 border border-border-dark rounded-lg p-3 flex flex-col justify-between">
                  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80" class="w-full h-24 object-cover rounded-md mb-2" />
                  <h4 class="text-[11px] font-bold text-white">Timex Watch</h4>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs font-extrabold text-indigo-400">$120</span>
                    <button class="bg-indigo-600 text-[9px] font-bold py-1 px-2 rounded text-white">Add</button>
                  </div>
                </div>
                <div class="bg-card-dark/40 border border-border-dark rounded-lg p-3 flex flex-col justify-between">
                  <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80" class="w-full h-24 object-cover rounded-md mb-2" />
                  <h4 class="text-[11px] font-bold text-white">Round Shades</h4>
                  <div class="flex justify-between items-center mt-2">
                    <span class="text-xs font-extrabold text-indigo-400">$35</span>
                    <button class="bg-indigo-600 text-[9px] font-bold py-1 px-2 rounded text-white">Add</button>
                  </div>
                </div>
              </div>`
            },
            style: { backgroundColor: 'transparent', padding: '0px' },
            position: { left: 50, top: 170, width: 900, height: 250, rotate: 0, zIndex: 3 }
          },
          {
            id: 'ecom-footer',
            type: 'footer-block',
            name: 'Store Footer',
            category: 'Footer',
            icon: '👣',
            content: {
              html: `<div class="flex justify-between items-center h-full w-full text-[10px] text-textMuted-dark">
                <span>© 2026 Apparel Store. Powered by GenovaX.</span>
                <div class="flex gap-4">
                  <span>Contact</span>
                  <span>Returns</span>
                </div>
              </div>`
            },
            style: {
              backgroundColor: 'rgba(16, 23, 38, 0.9)',
              borderColor: '#1e293b',
              borderStyle: 'solid',
              borderWidth: '1px',
              borderRadius: '8px',
              padding: '16px'
            },
            position: { left: 50, top: 450, width: 900, height: 60, rotate: 0, zIndex: 4 }
          }
        ];
      }

      // Overwrite components on the active page
      const updatedPages: Page[] = pages.map(page => 
        page.id === activePageId ? { ...page, components: generatedComps as any[] } : page
      );
      setPages(updatedPages);
      
      onShowLoading(false);
      alert('AI Generator compiled and created layout layout successfully!');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm select-none">
      <div className={`w-[500px] border rounded-lg shadow-2xl flex flex-col ${
        theme === 'dark' ? 'bg-[#101726] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-inherit">
          <h3 className="text-sm font-extrabold flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="w-4 h-4 text-indigo-400 fill-indigo-400/10" />
            AI Prompt Layout Generator
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500">Describe the layout or page structure you want to generate:</label>
            <textarea
              value={promptValue}
              onChange={e => setPromptValue(e.target.value)}
              placeholder="e.g., Create a dark-mode SaaS portfolio page with features and pricing tables..."
              className={`w-full h-24 p-3 text-xs rounded border outline-none resize-none bg-black/20 ${
                theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
              }`}
            />
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/10" />
              Suggested prompts
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setPromptValue(s.text)}
                  className={`p-2 rounded border cursor-pointer transition-colors ${
                    theme === 'dark' 
                      ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/40' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[10px] font-bold text-indigo-400">{s.title}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">"{s.text}"</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-4 py-3 border-t border-inherit bg-black/10">
          <span className="text-[9px] text-slate-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Generating will overwrite components on active page.
          </span>
          <button
            onClick={handleGenerate}
            disabled={!promptValue.trim()}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-3 h-3 fill-white" />
            Generate Layout
          </button>
        </div>
      </div>
    </div>
  );
};
