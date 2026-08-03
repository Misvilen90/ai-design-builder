import React, { useState, useEffect } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { COMPONENT_SCHEMAS, ComponentSchema } from '../store/schemas';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Layout, 
  Compass, 
  FileText, 
  Image as ImageIcon, 
  Square, 
  CreditCard, 
  Clipboard, 
  Briefcase, 
  Sparkles, 
  ShoppingCart, 
  AlignJustify
} from 'lucide-react';

export const ComponentsPanel: React.FC = () => {
  const { addComponent, theme } = useBuilderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>('Layout');

  const categories = [
    'Layout',
    'Navigation',
    'Content',
    'Media',
    'Buttons',
    'Cards',
    'Forms',
    'Business',
    'Marketing',
    'E-Commerce',
    'Footer'
  ];

  const categoryIconMap: Record<string, React.ReactNode> = {
    'Layout': <Layout className="w-3 h-3 text-indigo-400" />,
    'Navigation': <Compass className="w-3 h-3 text-sky-400" />,
    'Content': <FileText className="w-3 h-3 text-emerald-400" />,
    'Media': <ImageIcon className="w-3 h-3 text-amber-400" />,
    'Buttons': <Square className="w-3 h-3 text-rose-400" />,
    'Cards': <CreditCard className="w-3 h-3 text-pink-400" />,
    'Forms': <Clipboard className="w-3 h-3 text-violet-400" />,
    'Business': <Briefcase className="w-3 h-3 text-teal-400" />,
    'Marketing': <Sparkles className="w-3 h-3 text-yellow-400" />,
    'E-Commerce': <ShoppingCart className="w-3 h-3 text-purple-400" />,
    'Footer': <AlignJustify className="w-3 h-3 text-slate-400" />
  };

  const handleComponentClick = (schema: ComponentSchema) => {
    addComponent({
      type: schema.type,
      name: schema.name,
      category: schema.category,
      icon: schema.icon,
      content: { ...schema.defaultContent },
      style: { ...schema.defaultStyle },
      position: {
        left: 100 + Math.random() * 40,
        top: 150 + Math.random() * 40,
        width: schema.defaultPosition.width,
        height: schema.defaultPosition.height,
        rotate: 0,
        zIndex: 10
      }
    });
  };

  const handleComponentDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const getFilteredSchemas = (category: string) => {
    return Object.values(COMPONENT_SCHEMAS).filter(schema => {
      if (schema.category.toLowerCase() !== category.toLowerCase()) return false;
      if (searchQuery.trim()) {
        return (
          schema.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          schema.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    });
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const match = categories.find(cat => getFilteredSchemas(cat).length > 0);
      if (match) setActiveCategory(match);
    }
  }, [searchQuery]);

  return (
    <aside 
      className={`w-[210px] h-full flex flex-col border-r z-30 fixed top-14 left-[40px] select-none ${
        theme === 'dark' 
          ? 'bg-[#101726]/90 border-[#1e293b] text-[#f1f5f9]' 
          : 'bg-white border-[#e2e8f0] text-slate-800'
      } backdrop-blur-xl`}
    >
      {/* Panel Header */}
      <div className="p-3 border-b border-slate-850 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
          Components Library
        </span>
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-slate-850/60">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#1e293b] text-xs bg-[#090d16]/65">
          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full text-slate-300 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1 pb-20 scrollbar-thin">
        {categories.map(cat => {
          const schemas = getFilteredSchemas(cat);
          if (schemas.length === 0) return null;
          const isOpen = searchQuery ? true : activeCategory === cat;

          return (
            <div key={cat} className={`border rounded overflow-hidden ${
              theme === 'dark' ? 'border-slate-800/80 bg-black/10' : 'border-slate-200 bg-slate-50/50'
            }`}>
              <button
                onClick={() => setActiveCategory(isOpen ? null : cat)}
                className={`w-full flex items-center justify-between px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider ${
                  theme === 'dark' 
                    ? 'bg-slate-800/25 hover:bg-slate-800/50 text-slate-400' 
                    : 'bg-slate-100 hover:bg-slate-200/50 text-slate-600'
                }`}
              >
                <span className="flex items-center gap-1">
                  {categoryIconMap[cat]}
                  <span>{cat}</span>
                  <span className="text-[8px] opacity-40 font-mono">({schemas.length})</span>
                </span>
                {isOpen ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
              </button>

              {isOpen && (
                <div className="grid grid-cols-2 gap-1 p-1 bg-black/15">
                  {schemas.map(schema => (
                    <div
                      key={schema.type}
                      onClick={() => handleComponentClick(schema)}
                      draggable
                      onDragStart={(e) => handleComponentDragStart(e, schema.type)}
                      className={`group flex flex-col items-center justify-center p-1 rounded border text-center aspect-[1.1] cursor-grab active:cursor-grabbing hover:border-indigo-500 transition-all ${
                        theme === 'dark' 
                          ? 'border-slate-850 bg-[#101726]/40 hover:bg-slate-850/20' 
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm group-hover:scale-110 mb-0.5 transition-transform">
                        {schema.icon}
                      </span>
                      <span className={`text-[8px] leading-tight font-medium truncate w-full px-0.5 ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {schema.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
