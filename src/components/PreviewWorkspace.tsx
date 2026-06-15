import React, { useState, useEffect } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { 
  Laptop, 
  Tablet, 
  Smartphone, 
  Sparkles, 
  X, 
  Sun, 
  Moon
} from 'lucide-react';

export const PreviewWorkspace: React.FC = () => {
  const { 
    pages, 
    activePageId, 
    setActivePageId,
    theme, 
    toggleTheme,
    globalTheme 
  } = useBuilderStore();

  const [localViewport, setLocalViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Resolve active page, fallback to first page if activePageId not found
  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const components = activePage ? activePage.components : [];

  // Hot reload preview when editor changes localStorage data
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'genovax_builder_pages') {
        try {
          const parsed = JSON.parse(e.newValue || '[]');
          if (Array.isArray(parsed) && parsed.length > 0) {
            useBuilderStore.setState({ pages: parsed });
          }
        } catch (err) {
          console.error('Failed to parse updated pages from localStorage:', err);
        }
      }
      if (e.key === 'genovax_builder_active_page') {
        if (e.newValue) {
          setActivePageId(e.newValue);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [setActivePageId]);

  // Adjust theme on body for dark/light mode classes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Viewport Width Mapping
  const getViewportWidth = () => {
    if (localViewport === 'tablet') return 'w-[768px] border-x border-[#1e293b] min-h-screen shadow-2xl';
    if (localViewport === 'mobile') return 'w-[375px] border-x border-[#1e293b] min-h-screen shadow-2xl';
    return 'w-[1000px] border-x border-[#1e293b] min-h-screen shadow-2xl';
  };

  const handleClose = () => {
    window.close();
  };

  return (
    <div className={`min-h-screen w-screen flex flex-col overflow-x-hidden select-text ${
      theme === 'dark' ? 'bg-[#090d16] text-[#f1f5f9]' : 'bg-[#f8fafc] text-[#0f172a]'
    }`}>
      {/* 1. Glassmorphic Preview Header Bar */}
      <header className={`h-14 w-full border-b flex items-center justify-between px-6 z-50 fixed top-0 left-0 backdrop-blur-md transition-colors ${
        theme === 'dark' 
          ? 'bg-[#101726]/85 border-[#1e293b] text-[#f1f5f9]' 
          : 'bg-white/85 border-[#e2e8f0] text-[#0f172a]'
      }`}>
        {/* Left branding & badge */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-1.5">
            <Sparkles className="w-4.5 h-4.5 text-indigo-500 fill-indigo-500/20" />
            GenovaX
          </span>
          <div className="h-4 w-px bg-slate-700/40 hidden sm:block"></div>
          <div className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1.5 border ${
            theme === 'dark' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-emerald-50 border-emerald-100 text-emerald-600'
          }`}>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Live Preview
          </div>
        </div>

        {/* Middle Viewport Selection */}
        <div className={`flex items-center gap-1 border p-1 rounded-full ${
          theme === 'dark' ? 'bg-black/25 border-[#1e293b]' : 'bg-slate-100 border-[#e2e8f0]'
        }`}>
          <button
            onClick={() => setLocalViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              localViewport === 'desktop'
                ? 'bg-indigo-600 text-white shadow-sm'
                : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Desktop view"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setLocalViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              localViewport === 'tablet'
                ? 'bg-indigo-600 text-white shadow-sm'
                : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Tablet view"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setLocalViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              localViewport === 'mobile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Mobile view"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right tools and dropdown */}
        <div className="flex items-center gap-3">
          {/* Page Selector Dropdown */}
          {pages.length > 1 && (
            <select
              value={activePage?.id || ''}
              onChange={(e) => setActivePageId(e.target.value)}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border outline-none bg-transparent transition-colors cursor-pointer ${
                theme === 'dark' 
                  ? 'border-[#1e293b] text-white hover:bg-slate-800' 
                  : 'border-[#e2e8f0] text-slate-700 hover:bg-slate-50'
              }`}
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id} className={theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-800'}>
                  📄 {p.name}
                </option>
              ))}
            </select>
          )}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-1.5 rounded-md border transition-colors ${
              theme === 'dark' 
                ? 'border-[#1e293b] hover:bg-slate-800 text-yellow-400' 
                : 'border-[#e2e8f0] hover:bg-slate-50 text-slate-600'
            }`}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Close Tab Button */}
          <button
            onClick={handleClose}
            className={`flex items-center gap-1 text-xs font-semibold border px-3 py-1.5 rounded-md transition-colors ${
              theme === 'dark' 
                ? 'border-[#1e293b] hover:bg-slate-800 text-white' 
                : 'border-[#e2e8f0] hover:bg-slate-50 text-slate-700'
            }`}
            title="Close Preview Tab"
          >
            <X className="w-3.5 h-3.5" />
            Close
          </button>
        </div>
      </header>

      {/* 2. Scrollable Canvas Area */}
      <main className="flex-1 flex justify-center items-start pt-14 overflow-y-auto">
        <div 
          className={`relative min-h-[1200px] transition-all duration-300 ${getViewportWidth()}`}
          style={{
            backgroundColor: globalTheme.backgroundColor,
            color: globalTheme.textColor,
            fontFamily: globalTheme.fontFamily,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
          }}
        >
          {components.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-8">
              <div className="text-4xl mb-3">📭</div>
              <h2 className="text-lg font-bold">This page is empty</h2>
              <p className="text-xs text-slate-500 max-w-[300px] mt-1">
                Go back to the builder canvas to add layout structures, typography, and interactive components.
              </p>
            </div>
          ) : (
            components.map((comp) => {
              if (comp.visible === false) return null;

              return (
                <div
                  key={comp.id}
                  id={`comp-preview-${comp.id}`}
                  onClick={(e) => {
                    if (comp.prototypeDestination) {
                      e.preventDefault();
                      e.stopPropagation();
                      setActivePageId(comp.prototypeDestination);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: `${comp.position.left}px`,
                    top: `${comp.position.top}px`,
                    width: `${comp.position.width}px`,
                    height: `${comp.position.height}px`,
                    transform: `rotate(${comp.position.rotate || 0}deg)`,
                    zIndex: comp.position.zIndex,
                    cursor: comp.prototypeDestination ? 'pointer' : undefined
                  }}
                  className={`transition-all ${comp.prototypeDestination ? 'hover:scale-[1.015] hover:shadow-lg active:scale-[0.995]' : ''}`}
                >
                  <div 
                    className={`w-full h-full overflow-hidden relative select-text ${comp.prototypeDestination ? 'pointer-events-none' : ''}`}
                    style={{
                      ...comp.style,
                      backgroundColor: comp.style.backgroundColor || 'transparent'
                    }}
                  >
                    {comp.content.html ? (
                      <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: comp.content.html }} />
                    ) : comp.content.src ? (
                      <img 
                        src={comp.content.src} 
                        alt={comp.content.alt || 'media'} 
                        className="w-full h-full object-cover" 
                        draggable="false"
                      />
                    ) : comp.content.text ? (
                      <div className="w-full h-full p-2 whitespace-pre-wrap">{comp.content.text}</div>
                    ) : comp.content.label ? (
                      <div className="w-full h-full flex items-center justify-center font-semibold">{comp.content.label}</div>
                    ) : (
                      <div className="p-3 text-[10px] text-slate-500">🧱 {comp.name}</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};
