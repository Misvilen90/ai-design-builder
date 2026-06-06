import React from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { X, BookOpen } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose }) => {
  const { setPages, activePageId, pages, theme } = useBuilderStore();

  if (!isOpen) return null;

  const templatesList = [
    {
      name: 'Creative Agency Portfolio',
      desc: 'Dark mode minimal portfolio containing a hero section, responsive image gallery, and footer links.',
      icon: '🎨',
      components: [
        {
          id: 'port-hero',
          type: 'mkt-hero',
          name: 'Agency Hero',
          category: 'Marketing',
          icon: '🚀',
          content: {
            html: `<div class="flex flex-col items-center justify-center text-center h-full gap-3">
              <span class="text-[9px] uppercase font-bold text-indigo-400 tracking-wider">Visual Arts Agency</span>
              <h2 class="text-3xl font-extrabold text-white">We Design Digital Experiences</h2>
              <p class="text-xs text-textMuted-dark max-w-[500px]">Creating clean, glassmorphic layouts, modular widgets, and high-performance React frontends.</p>
              <button class="bg-indigo-600 text-[10px] font-bold py-2 px-6 rounded-md text-white mt-2">See Our Work</button>
            </div>`
          },
          style: {
            backgroundColor: 'rgba(99, 102, 241, 0.03)',
            borderColor: '#1e293b',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderRadius: '16px',
            padding: '30px'
          },
          position: { left: 50, top: 40, width: 900, height: 260, rotate: 0, zIndex: 1 }
        },
        {
          id: 'port-gallery',
          type: 'media-image',
          name: 'Visual Box 1',
          category: 'Media',
          icon: '🖼️',
          content: {
            src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80',
            alt: 'Team'
          },
          style: { borderRadius: '8px' },
          position: { left: 50, top: 330, width: 435, height: 240, rotate: 0, zIndex: 2 }
        },
        {
          id: 'port-gallery-2',
          type: 'media-image',
          name: 'Visual Box 2',
          category: 'Media',
          icon: '🖼️',
          content: {
            src: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&q=80',
            alt: 'Coding'
          },
          style: { borderRadius: '8px' },
          position: { left: 515, top: 330, width: 435, height: 240, rotate: 0, zIndex: 3 }
        }
      ]
    },
    {
      name: 'Bistro Restaurant Page',
      desc: 'Elegantly styled landing page featuring chef specials, food grid collections, and reservation forms.',
      icon: '🍳',
      components: [
        {
          id: 'rest-hero',
          type: 'mkt-hero',
          name: 'Bistro Banner',
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
        }
      ]
    }
  ];

  const handleSelectTemplate = (comps: any[]) => {
    const updatedPages = pages.map(page => 
      page.id === activePageId ? { ...page, components: comps } : page
    );
    setPages(updatedPages);
    onClose();
    alert('Template loaded successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm select-none">
      <div className={`w-[600px] border rounded-lg shadow-2xl flex flex-col ${
        theme === 'dark' ? 'bg-[#101726] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-inherit">
          <h3 className="text-sm font-extrabold flex items-center gap-1.5 text-indigo-400">
            <BookOpen className="w-4 h-4" />
            Templates Gallery
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
          <p className="text-[11px] text-slate-500 text-center">
            Select a premium design template to jumpstart your page layout instantly. This will override current workspace components.
          </p>

          <div className="grid grid-cols-1 gap-3">
            {templatesList.map((t, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectTemplate(t.components)}
                className={`p-4 rounded-lg border cursor-pointer flex items-start gap-4 transition-all hover:-translate-y-0.5 ${
                  theme === 'dark' 
                    ? 'border-slate-850 bg-slate-900/40 hover:border-indigo-500/60 hover:bg-slate-900/60' 
                    : 'border-slate-200 bg-slate-50 hover:border-indigo-500/60 hover:bg-slate-100'
                }`}
              >
                <span className="text-3xl p-2 bg-indigo-500/10 rounded-lg">{t.icon}</span>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    {t.name}
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded uppercase font-semibold">Premium</span>
                  </h4>
                  <p className="text-[10px] text-textMuted-dark mt-1 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
