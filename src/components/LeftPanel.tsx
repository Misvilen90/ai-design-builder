import React, { useState, useEffect, useRef } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { COMPONENT_SCHEMAS, ComponentSchema } from '../store/schemas';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
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
  AlignJustify,
  Layers,
  Paintbrush,
  Settings,
  Plus,
  Trash2,
  Copy,
  Edit3,
  Check,
  UploadCloud
} from 'lucide-react';

// Color picker row helper
interface ThemeColorPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({ label, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="flex items-center justify-between text-[9px] py-1 border-b border-slate-800/40">
      <span className="text-slate-400 font-medium">{label}</span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => inputRef.current?.click()}
          className="w-4 h-4 rounded-full border border-slate-700 hover:border-indigo-500 transition-colors shadow shadow-black"
          style={{ backgroundColor: value || 'transparent' }}
          title="Choose color"
        />
        <span 
          onClick={() => inputRef.current?.click()}
          className="font-mono text-[8px] text-slate-500 cursor-pointer select-all hover:text-white"
        >
          {value ? value.toUpperCase() : '#NONE'}
        </span>
        <input
          ref={inputRef}
          type="color"
          value={value && value.startsWith('#') ? value : '#ffffff'}
          onChange={e => onChange(e.target.value)}
          className="hidden"
          aria-label="Choose color"
        />
      </div>
    </div>
  );
};

export const LeftPanel: React.FC = () => {
  const { 
    addComponent, 
    leftPanelExpanded, 
    setLeftPanelExpanded,
    leftPanelTab,
    setLeftPanelTab,
    globalTheme,
    updateGlobalTheme,
    mediaAssets,
    addMediaAsset,
    deleteMediaAsset,
    pages,
    activePageId,
    setActivePageId,
    addPage,
    deletePage,
    duplicatePage,
    renamePage,
    selectedComponentId,
    updateComponentStyle,
    snapToGrid,
    setSnapToGrid,
    zoom,
    setZoom,
    clearCanvas,
    theme,
    toggleTheme
  } = useBuilderStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>('Layout');
  
  // Page renaming states
  const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
  const [renamePageValue, setRenamePageValue] = useState('');

  const drawerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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

  // 1. Components tab handlers
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
    setLeftPanelExpanded(false);
  };

  const handleComponentDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
    setTimeout(() => setLeftPanelExpanded(false), 200);
  };

  const getFilteredSchemas = (category: string) => {
    return Object.values(COMPONENT_SCHEMAS).filter(schema => {
      if (schema.category.toLowerCase() !== category.toLowerCase()) return false;
      if (searchQuery.trim() && leftPanelTab === 'components') {
        return (
          schema.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          schema.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    });
  };

  // 2. Media tab handlers
  const handleMediaDragStart = (e: React.DragEvent, type: 'image' | 'video', url: string) => {
    e.dataTransfer.setData('text/plain', `media-${type}:${url}`);
    e.dataTransfer.effectAllowed = 'copy';
    setTimeout(() => setLeftPanelExpanded(false), 200);
  };

  const handleMediaClick = (type: 'image' | 'video', url: string) => {
    if (type === 'image') {
      const schema = COMPONENT_SCHEMAS['media-image'];
      addComponent({
        type: schema.type,
        name: schema.name,
        category: schema.category,
        icon: schema.icon,
        content: { ...schema.defaultContent, src: url },
        style: { ...schema.defaultStyle },
        position: {
          left: 150,
          top: 180,
          width: schema.defaultPosition.width,
          height: schema.defaultPosition.height,
          rotate: 0,
          zIndex: 20
        }
      });
    } else {
      const schema = COMPONENT_SCHEMAS['media-video'];
      addComponent({
        type: schema.type,
        name: schema.name,
        category: schema.category,
        icon: schema.icon,
        content: {
          html: `<video src="${url}" controls class="w-full h-full object-cover rounded-md" autoplay muted loop></video>`
        },
        style: { ...schema.defaultStyle },
        position: {
          left: 150,
          top: 180,
          width: schema.defaultPosition.width,
          height: schema.defaultPosition.height,
          rotate: 0,
          zIndex: 20
        }
      });
    }
    setLeftPanelExpanded(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    addMediaAsset({
      type,
      name: file.name.split('.')[0] || 'Uploaded Asset',
      url
    });
  };

  // 3. Theme tab presets
  const applyPresetTheme = (preset: string) => {
    switch(preset) {
      case 'light':
        updateGlobalTheme({
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
          accentColor: '#10b981',
          backgroundColor: '#ffffff',
          textColor: '#0f172a',
          fontFamily: 'sans-serif',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        });
        break;
      case 'dark':
        updateGlobalTheme({
          primaryColor: '#6366f1',
          secondaryColor: '#475569',
          accentColor: '#818cf8',
          backgroundColor: '#090d16',
          textColor: '#f8fafc',
          fontFamily: "'Inter', sans-serif",
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        });
        break;
      case 'saas':
        updateGlobalTheme({
          primaryColor: '#4f46e5',
          secondaryColor: '#06b6d4',
          accentColor: '#f43f5e',
          backgroundColor: '#0f172a',
          textColor: '#f1f5f9',
          fontFamily: "'Outfit', sans-serif",
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
        });
        break;
      case 'corporate':
        updateGlobalTheme({
          primaryColor: '#1e3a8a',
          secondaryColor: '#475569',
          accentColor: '#0284c7',
          backgroundColor: '#f8fafc',
          textColor: '#1e293b',
          fontFamily: 'serif',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        });
        break;
      case 'ecommerce':
        updateGlobalTheme({
          primaryColor: '#db2777',
          secondaryColor: '#ea580c',
          accentColor: '#fbbf24',
          backgroundColor: '#ffffff',
          textColor: '#111827',
          fontFamily: 'sans-serif',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        });
        break;
      case 'creative':
        updateGlobalTheme({
          primaryColor: '#8b5cf6',
          secondaryColor: '#ec4899',
          accentColor: '#14b8a6',
          backgroundColor: '#1e1b4b',
          textColor: '#ffe4e6',
          fontFamily: "'Outfit', sans-serif",
          borderRadius: '24px',
          boxShadow: '0 0 25px rgba(139, 92, 246, 0.25)'
        });
        break;
    }
  };

  const handleApplyThemeToSelection = () => {
    if (!selectedComponentId) {
      alert('Select a component on canvas to apply the theme.');
      return;
    }
    updateComponentStyle(selectedComponentId, {
      backgroundColor: globalTheme.primaryColor,
      color: globalTheme.textColor,
      borderRadius: globalTheme.borderRadius,
      fontFamily: globalTheme.fontFamily,
      boxShadow: globalTheme.boxShadow
    });
  };

  // 4. Pages tab handlers
  const handleCreatePage = () => {
    const pageName = prompt('Enter new page name:');
    if (pageName && pageName.trim()) {
      const success = addPage(pageName.trim());
      if (!success) alert('A page with this name already exists.');
    }
  };

  const handleStartRenamePage = (id: string, currentName: string) => {
    setRenamingPageId(id);
    setRenamePageValue(currentName);
  };

  const handleSaveRenamePage = (id: string) => {
    if (renamePageValue.trim()) {
      renamePage(id, renamePageValue.trim());
    }
    setRenamingPageId(null);
  };

  // Expand accordion automatically on search matching
  useEffect(() => {
    if (searchQuery.trim() && leftPanelTab === 'components') {
      const match = categories.find(cat => getFilteredSchemas(cat).length > 0);
      if (match) setActiveCategory(match);
    }
  }, [searchQuery, leftPanelTab]);

  // Click outside to collapse components drawer
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!leftPanelExpanded) return;
      const target = e.target as HTMLElement;
      if (target.closest('main') || target.closest('header') || target.closest('.right-panel-container')) {
        if (!target.closest('.left-panel-container') && !target.closest('.slim-sidebar-bar')) {
          setLeftPanelExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [leftPanelExpanded]);

  const handleTabToggle = (tab: typeof leftPanelTab) => {
    if (leftPanelExpanded && leftPanelTab === tab) {
      setLeftPanelExpanded(false);
    } else {
      setLeftPanelTab(tab);
      setLeftPanelExpanded(true);
    }
  };

  return (
    <>
      {/* 1. Permanent Slim Icon Sidebar (40px wide) */}
      <aside 
        className="slim-sidebar-bar w-[40px] h-full flex flex-col border-r z-35 fixed top-14 left-0 select-none items-center py-2 gap-3 shrink-0 bg-[#0b0f19] border-[#1e293b] text-[#f1f5f9]"
      >
        <button
          onClick={() => setLeftPanelExpanded(!leftPanelExpanded)}
          className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
            leftPanelExpanded ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-400'
          }`}
          title={leftPanelExpanded ? 'Collapse Library' : 'Expand Library'}
        >
          {leftPanelExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        <div className="border-b border-slate-850 w-full mb-1"></div>

        {/* System Drawer Tabs */}
        <div className="flex flex-col gap-2 px-1">
          <button
            onClick={() => handleTabToggle('components')}
            className={`p-2 rounded-lg transition-all ${
              leftPanelTab === 'components' && leftPanelExpanded
                ? 'bg-indigo-600 text-white shadow shadow-indigo-600/35'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/40'
            }`}
            title="Component Library"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleTabToggle('media')}
            className={`p-2 rounded-lg transition-all ${
              leftPanelTab === 'media' && leftPanelExpanded
                ? 'bg-indigo-600 text-white shadow shadow-indigo-600/35'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/40'
            }`}
            title="Media Library"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleTabToggle('theme')}
            className={`p-2 rounded-lg transition-all ${
              leftPanelTab === 'theme' && leftPanelExpanded
                ? 'bg-indigo-600 text-white shadow shadow-indigo-600/35'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/40'
            }`}
            title="Theme Settings"
          >
            <Paintbrush className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleTabToggle('pages')}
            className={`p-2 rounded-lg transition-all ${
              leftPanelTab === 'pages' && leftPanelExpanded
                ? 'bg-indigo-600 text-white shadow shadow-indigo-600/35'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/40'
            }`}
            title="Pages"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleTabToggle('settings')}
            className={`p-2 rounded-lg transition-all ${
              leftPanelTab === 'settings' && leftPanelExpanded
                ? 'bg-indigo-600 text-white shadow shadow-indigo-600/35'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/40'
            }`}
            title="Editor Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. Collapsible Slide-out Drawer Panel (210px wide) */}
      <aside 
        ref={drawerRef}
        style={{
          transform: leftPanelExpanded ? 'translateX(0)' : 'translateX(-260px)',
          transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="left-panel-container w-[210px] h-full flex flex-col border-r z-30 fixed top-14 left-[40px] select-none shadow-2xl bg-[#101726]/90 border-[#1e293b] text-[#f1f5f9] backdrop-blur-xl"
      >
        {/* Drawer Header */}
        <div className="p-3 border-b border-slate-850 flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
            {leftPanelTab === 'components' && 'Components'}
            {leftPanelTab === 'media' && 'Media Library'}
            {leftPanelTab === 'theme' && 'Themes'}
            {leftPanelTab === 'pages' && 'Pages'}
            {leftPanelTab === 'settings' && 'Settings'}
          </span>
          <button 
            onClick={() => setLeftPanelExpanded(false)}
            className="p-1 rounded text-[10px] font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* TAB CONTENTS */}
        
        {/* TAB 1: COMPONENTS */}
        {leftPanelTab === 'components' && (
          <>
            <div className="p-2 border-b border-slate-850/60">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#1e293b] text-xs bg-[#090d16]/65">
                <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-slate-300 placeholder:text-slate-505"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-1.5 space-y-1 pb-20">
              {categories.map(cat => {
                const schemas = getFilteredSchemas(cat);
                if (schemas.length === 0) return null;
                const isOpen = searchQuery ? true : activeCategory === cat;

                return (
                  <div key={cat} className="border border-slate-800/80 bg-black/10 rounded overflow-hidden">
                    <button
                      onClick={() => setActiveCategory(isOpen ? null : cat)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider bg-slate-800/25 hover:bg-slate-800/50 text-slate-400"
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
                            className="group flex flex-col items-center justify-center p-1 rounded border border-slate-850 text-center aspect-[1.1] cursor-grab active:cursor-grabbing hover:border-indigo-500 transition-all bg-[#101726]/40 hover:bg-slate-850/20"
                          >
                            <span className="text-sm group-hover:scale-110 mb-0.5 transition-transform">
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
          </>
        )}

        {/* TAB 2: MEDIA LIBRARY */}
        {leftPanelTab === 'media' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search and Upload triggers */}
            <div className="p-2.5 border-b border-slate-850 flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#1e293b] text-xs bg-[#090d16]/65">
                <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-slate-300 placeholder:text-slate-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center justify-center gap-1 py-1 rounded border border-dashed border-slate-800 bg-slate-900/40 text-[9px] font-bold text-slate-400 hover:text-white hover:border-indigo-500 transition-colors"
                >
                  <UploadCloud className="w-3 h-3 text-indigo-400" />
                  + Image
                </button>
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center justify-center gap-1 py-1 rounded border border-dashed border-slate-800 bg-slate-900/40 text-[9px] font-bold text-slate-400 hover:text-white hover:border-indigo-500 transition-colors"
                >
                  <UploadCloud className="w-3 h-3 text-indigo-400" />
                  + Video
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  aria-label="Upload Image"
                  onChange={e => handleFileUpload(e, 'image')}
                  className="hidden"
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  aria-label="UploadVideo"
                  onChange={e => handleFileUpload(e, 'video')}
                  className="hidden"
                />
              </div>
            </div>

            {/* Gallery grid */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 pb-24">
              <div className="text-[8px] uppercase tracking-wider font-extrabold text-slate-500 px-0.5">
                Assets ({mediaAssets.length})
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {mediaAssets
                  .filter(asset => !searchQuery.trim() || asset.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(asset => (
                    <div
                      key={asset.id}
                      draggable
                      onDragStart={(e) => handleMediaDragStart(e, asset.type, asset.url)}
                      onClick={() => handleMediaClick(asset.type, asset.url)}
                      className="group relative border border-slate-800/80 hover:border-indigo-500 rounded bg-[#0b0f19] overflow-hidden aspect-[1.1] cursor-grab active:cursor-grabbing flex flex-col justify-between"
                      title="Click to add or Drag to canvas"
                    >
                      <div className="w-full h-12 relative bg-slate-950 flex items-center justify-center overflow-hidden">
                        {asset.type === 'image' ? (
                          <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center relative bg-slate-900/50">
                            <span className="text-[9px] font-bold bg-indigo-500 text-white w-4 h-4 rounded-full flex items-center justify-center shadow">▶</span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMediaAsset(asset.id);
                          }}
                          className="absolute top-1 right-1 p-0.5 bg-black/60 hover:bg-red-500 text-slate-400 hover:text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <div className="p-1 text-[8px] truncate font-medium text-slate-400 select-none bg-slate-950/20">
                        {asset.name}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: THEME SETTINGS */}
        {leftPanelTab === 'theme' && (
          <div className="flex-1 overflow-y-auto p-2.5 space-y-4 pb-24 text-[9px]">
            {/* Theme presets block */}
            <div className="space-y-1.5">
              <span className="text-slate-500 uppercase tracking-widest font-extrabold text-[8px]">Design Presets</span>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => applyPresetTheme('light')}
                  className="py-1 px-1.5 rounded border border-slate-800 bg-[#090d16]/30 text-white font-semibold hover:border-indigo-500"
                >
                  Light Theme
                </button>
                <button
                  onClick={() => applyPresetTheme('dark')}
                  className="py-1 px-1.5 rounded border border-slate-800 bg-[#090d16]/30 text-white font-semibold hover:border-indigo-500"
                >
                  Dark Theme
                </button>
                <button
                  onClick={() => applyPresetTheme('saas')}
                  className="py-1 px-1.5 rounded border border-slate-800 bg-[#090d16]/30 text-white font-semibold hover:border-indigo-500"
                >
                  SaaS Theme
                </button>
                <button
                  onClick={() => applyPresetTheme('corporate')}
                  className="py-1 px-1.5 rounded border border-slate-800 bg-[#090d16]/30 text-white font-semibold hover:border-indigo-500"
                >
                  Corporate
                </button>
                <button
                  onClick={() => applyPresetTheme('ecommerce')}
                  className="py-1 px-1.5 rounded border border-slate-800 bg-[#090d16]/30 text-white font-semibold hover:border-indigo-500"
                >
                  E-Commerce
                </button>
                <button
                  onClick={() => applyPresetTheme('creative')}
                  className="py-1 px-1.5 rounded border border-slate-800 bg-[#090d16]/30 text-white font-semibold hover:border-indigo-500"
                >
                  Creative
                </button>
              </div>
            </div>

            {/* Colors block */}
            <div className="space-y-1.5">
              <span className="text-slate-500 uppercase tracking-widest font-extrabold text-[8px]">Theme Colors</span>
              <div className="space-y-0.5">
                <ThemeColorPicker
                  label="Primary"
                  value={globalTheme.primaryColor}
                  onChange={val => updateGlobalTheme({ primaryColor: val })}
                />
                <ThemeColorPicker
                  label="Secondary"
                  value={globalTheme.secondaryColor}
                  onChange={val => updateGlobalTheme({ secondaryColor: val })}
                />
                <ThemeColorPicker
                  label="Accent"
                  value={globalTheme.accentColor}
                  onChange={val => updateGlobalTheme({ accentColor: val })}
                />
                <ThemeColorPicker
                  label="Background"
                  value={globalTheme.backgroundColor}
                  onChange={val => updateGlobalTheme({ backgroundColor: val })}
                />
                <ThemeColorPicker
                  label="Text Color"
                  value={globalTheme.textColor}
                  onChange={val => updateGlobalTheme({ textColor: val })}
                />
              </div>
            </div>

            {/* Typography block */}
            <div className="space-y-1.5">
              <span className="text-slate-500 uppercase tracking-widest font-extrabold text-[8px]">Typography</span>
              <div className="space-y-2">
                <div className="flex flex-col gap-0.5">
                  <label htmlFor="fontFamily" className="text-slate-500">Font Family</label>
                  <select
                  id="fontFamily"
                    value={globalTheme.fontFamily}
                    onChange={e => updateGlobalTheme({ fontFamily: e.target.value })}
                    className="w-full p-1 rounded border border-slate-800 bg-[#090d16]/40 outline-none text-white text-[9px]"
                  >
                    <option value="sans-serif">System Sans</option>
                    <option value="'Inter', sans-serif">Inter</option>
                    <option value="'Outfit', sans-serif">Outfit</option>
                    <option value="serif">System Serif</option>
                    <option value="monospace">Monospace</option>
                  </select>
                </div>
                <div className="flex flex-col gap-0.5">
                  <label htmlFor="fontFamily" className="text-slate-500">Size Preset</label>
                  <select
                    id="fontFamily"
                    value={globalTheme.fontSizePreset}
                    onChange={e => updateGlobalTheme({ fontSizePreset: e.target.value })}
                    className="w-full p-1 rounded border border-slate-800 bg-[#090d16]/40 outline-none text-white text-[9px]"
                  >
                    <option value="sm">Small (12px)</option>
                    <option value="md">Medium (14px)</option>
                    <option value="lg">Large (16px)</option>
                    <option value="xl">X-Large (18px)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Canvas styling controls */}
            <div className="space-y-1.5">
              <span className="text-slate-500 uppercase tracking-widest font-extrabold text-[8px]">Canvas Styling</span>
              <div className="space-y-2">
                <div className="flex flex-col gap-0.5">
                  <label className="text-slate-500">Global Radius (px)</label>
                  <input
                    type="text"
                    value={globalTheme.borderRadius}
                    onChange={e => updateGlobalTheme({ borderRadius: e.target.value })}
                    className="w-full p-1 rounded border border-slate-800 bg-[#090d16]/40 outline-none text-white text-[9px]"
                    placeholder="e.g. 8px"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label htmlFor="boxShadow" className="text-slate-500">Global Shadows</label>
                  <select
                    id="boxShadow"
                    value={globalTheme.boxShadow}
                    onChange={e => updateGlobalTheme({ boxShadow: e.target.value })}
                    className="w-full p-1 rounded border border-slate-800 bg-[#090d16]/40 outline-none text-white text-[9px]"
                  >
                    <option value="none">None</option>
                    <option value="0 1px 3px rgba(0,0,0,0.1)">Small Shadow</option>
                    <option value="0 4px 6px rgba(0,0,0,0.15)">Medium Shadow</option>
                    <option value="0 10px 25px rgba(0,0,0,0.3)">Large Shadow</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Apply triggers */}
            <div className="pt-2 border-t border-slate-850 flex flex-col gap-1.5">
              <button
                onClick={handleApplyThemeToSelection}
                className="w-full py-1.5 rounded bg-indigo-650 hover:bg-indigo-500 text-white font-bold transition-all shadow"
              >
                Apply Theme to Selection
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: PAGES MANAGER */}
        {leftPanelTab === 'pages' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-2 border-b border-slate-850 flex items-center justify-between shrink-0">
              <span className="text-[9px] font-bold text-slate-500">Canvas Pages ({pages.length})</span>
              <button
                onClick={handleCreatePage}
                className="p-1 rounded bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors"
                title="Add Page"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 pb-24">
              {pages.map(page => {
                const isSelected = activePageId === page.id;
                const isRenaming = renamingPageId === page.id;

                return (
                  <div
                    key={page.id}
                    onClick={() => {
                      if (!isRenaming) setActivePageId(page.id);
                    }}
                    className={`group w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-500/10 border-indigo-500/35 text-indigo-400 font-semibold'
                        : 'border-transparent text-slate-400 hover:bg-slate-850/40'
                    }`}
                  >
                    {isRenaming ? (
                      <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                        <input
                        id="renamePage"
                          type="text"
                          value={renamePageValue}
                          onChange={e => setRenamePageValue(e.target.value)}
                          aria-label="RenamePage"
                          className="bg-black/60 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-white flex-1 outline-none"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveRenamePage(page.id);
                            if (e.key === 'Escape') setRenamingPageId(null);
                          }}
                        />
                        <button onClick={() => handleSaveRenamePage(page.id)} className="text-green-500 p-0.5">
                          <Check className="w-3 h-3" />
                          Rename
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="truncate flex-1">📄 {page.name}</span>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleStartRenamePage(page.id, page.name)}
                            className="p-0.5 hover:text-white"
                            title="Rename"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => duplicatePage(page.id)}
                            className="p-0.5 hover:text-white"
                            title="Duplicate"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          {pages.length > 1 && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${page.name}"?`)) deletePage(page.id);
                              }}
                              className="p-0.5 hover:text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: GENERAL SETTINGS */}
        {leftPanelTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-3 space-y-4 pb-24 text-[9px] text-slate-300">
            <div className="space-y-2">
              <span className="text-slate-500 uppercase tracking-widest font-extrabold text-[8px]">Canvas Options</span>
              <label className="flex items-center gap-2 cursor-pointer py-1 text-slate-300 hover:text-white select-none">
                <input 
                  type="checkbox" 
                  checked={snapToGrid} 
                  onChange={(e) => setSnapToGrid(e.target.checked)} 
                  className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 bg-black/35 cursor-pointer"
                />
                <span className="font-semibold">Snap to Grid</span>
              </label>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Layout Zoom:</span>
                <span className="font-mono text-indigo-400 font-bold">{zoom}%</span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setZoom(100)}
                  className="flex-1 py-1 rounded border border-slate-800 hover:border-indigo-500 bg-[#090d16]/30 text-white font-bold text-center"
                >
                  Reset (100%)
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-850 pt-3">
              <span className="text-slate-500 uppercase tracking-widest font-extrabold text-[8px]">System Settings</span>
              <button
                onClick={toggleTheme}
                className="w-full py-1.5 rounded border border-slate-800 hover:border-indigo-500 bg-[#090d16]/30 text-white font-bold flex items-center justify-center gap-1.5"
              >
                <span>Theme: {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear the entire canvas components?')) clearCanvas();
                }}
                className="w-full py-1.5 rounded border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 font-bold"
              >
                Clear Active Page
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
