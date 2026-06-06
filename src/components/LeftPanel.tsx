import React, { useState, useEffect } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { COMPONENT_SCHEMAS, ComponentSchema } from '../store/schemas';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle, 
  Layout, 
  Compass, 
  FileText, 
  Image, 
  Square, 
  CreditCard, 
  Clipboard, 
  Briefcase, 
  Sparkles, 
  ShoppingCart, 
  AlignJustify,
  BookOpen,
  Share2,
  Cpu
} from 'lucide-react';

export const LeftPanel: React.FC = () => {
  const { addComponent, theme } = useBuilderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>('Layout'); // Expand 'Layout' by default

  // Complete category list in order
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
    'Blog',
    'Social',
    'Advanced',
    'Footer'
  ];

  // Map category names to Lucide icons
  const categoryIconMap: Record<string, React.ReactNode> = {
    'Layout': <Layout className="w-3.5 h-3.5 text-indigo-400" />,
    'Navigation': <Compass className="w-3.5 h-3.5 text-sky-400" />,
    'Content': <FileText className="w-3.5 h-3.5 text-emerald-400" />,
    'Media': <Image className="w-3.5 h-3.5 text-amber-400" />,
    'Buttons': <Square className="w-3.5 h-3.5 text-rose-400" />,
    'Cards': <CreditCard className="w-3.5 h-3.5 text-pink-400" />,
    'Forms': <Clipboard className="w-3.5 h-3.5 text-violet-400" />,
    'Business': <Briefcase className="w-3.5 h-3.5 text-teal-400" />,
    'Marketing': <Sparkles className="w-3.5 h-3.5 text-yellow-400" />,
    'E-Commerce': <ShoppingCart className="w-3.5 h-3.5 text-purple-400" />,
    'Blog': <BookOpen className="w-3.5 h-3.5 text-orange-400" />,
    'Social': <Share2 className="w-3.5 h-3.5 text-blue-400" />,
    'Advanced': <Cpu className="w-3.5 h-3.5 text-indigo-500" />,
    'Footer': <AlignJustify className="w-3.5 h-3.5 text-slate-400" />
  };

  const handleCardClick = (schema: ComponentSchema) => {
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

  const handleDragStart = (e: React.DragEvent, type: string) => {
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

  // Expand category automatically on search typing
  useEffect(() => {
    if (searchQuery.trim()) {
      const match = categories.find(cat => getFilteredSchemas(cat).length > 0);
      if (match) setActiveCategory(match);
    }
  }, [searchQuery]);

  return (
    <aside 
      className={`w-[220px] h-full flex flex-col border-r z-30 fixed top-14 left-0 select-none ${
        theme === 'dark' 
          ? 'bg-[#101726]/75 border-[#1e293b] text-[#f1f5f9] backdrop-blur-xl' 
          : 'bg-white/85 border-[#e2e8f0] text-[#0f172a] backdrop-blur-xl'
      }`}
    >
      {/* Search Header */}
      <div className="p-2 border-b border-inherit">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs ${
          theme === 'dark' ? 'bg-[#090d16]/65 border-[#1e293b]' : 'bg-slate-50 border-[#e2e8f0]'
        }`}>
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

      {/* Accordions list (single-open) */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1 pb-20">
        {categories.map(cat => {
          const schemas = getFilteredSchemas(cat);
          if (schemas.length === 0) return null;

          const isOpen = searchQuery ? true : activeCategory === cat;

          return (
            <div key={cat} className={`border rounded overflow-hidden transition-all ${
              theme === 'dark' ? 'border-slate-800/80 bg-black/10' : 'border-slate-200 bg-slate-50/50'
            }`}>
              {/* Category Header with count */}
              <button
                onClick={() => setActiveCategory(isOpen ? null : cat)}
                className={`w-full flex items-center justify-between px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider select-none ${
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

              {/* Component Cards Grid */}
              {isOpen && (
                <div className={`grid grid-cols-2 gap-1 p-1 ${
                  theme === 'dark' ? 'bg-black/15' : 'bg-white'
                }`}>
                  {schemas.map(schema => (
                    <div
                      key={schema.type}
                      onClick={() => handleCardClick(schema)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, schema.type)}
                      className={`group flex flex-col items-center justify-center p-1 rounded border text-center aspect-[1.1] cursor-grab active:cursor-grabbing hover:border-indigo-500 transition-all ${
                        theme === 'dark' 
                          ? 'bg-[#101726]/40 border-slate-800/80 hover:bg-slate-800/20' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/30'
                      }`}
                      title="Click or Drag to canvas"
                    >
                      <span className="text-sm group-hover:scale-110 transition-transform mb-0.5">
                        {schema.icon}
                      </span>
                      <span className="text-[8px] leading-tight font-medium text-slate-300 truncate w-full px-0.5">
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

      {/* Footer Info */}
      <div className="p-1.5 text-[8px] text-center border-t border-slate-800/20 text-slate-500 shrink-0 select-none flex items-center justify-center gap-1">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Drag elements to Canvas</span>
      </div>
    </aside>
  );
};
