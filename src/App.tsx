import React, { useState, useEffect } from 'react';
import { useBuilderStore } from './store/useBuilderStore';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { CanvasWorkspace } from './components/CanvasWorkspace';
import { AIPromptPopup } from './components/AIPromptPopup';
import { ExportModal } from './components/ExportModal';
import { TemplatesModal } from './components/TemplatesModal';
import { TEMPLATES_LIST } from './store/templatesData';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  BarChart3, 
  CheckCircle2, 
  Zap, 
  Flame, 
  Heart,
  Plus
} from 'lucide-react';

const App: React.FC = () => {
  const { 
    theme, 
    projects,
    activeProjectId,
    loadProject,
    deleteProject,
    createNewProject,
    pages,
    activePageId
  } = useBuilderStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  
  // Custom View State: 'dashboard' | 'builder' | 'templates' | 'projects' | 'settings'
  const [currentView, setCurrentView] = useState('builder');
  
  // Canvas AI loading spinner state
  const [showLoading, setShowLoading] = useState(false);
  
  // Autosaved notification status
  const [showAutoSaved, setShowAutoSaved] = useState(false);

  // Global listeners for events dispatched from sidebar icons
  useEffect(() => {
    const handleOpenTemplates = () => setTemplatesOpen(true);
    const handleOpenPrompt = () => setPromptOpen(true);
    const handleOpenSidebar = () => setSidebarOpen(true);
    const handleGoDashboard = () => setCurrentView('dashboard');
    const handleGoBuilder = () => setCurrentView('builder');

    window.addEventListener('open-templates', handleOpenTemplates);
    window.addEventListener('open-ai-prompt', handleOpenPrompt);
    window.addEventListener('open-sidebar', handleOpenSidebar);
    window.addEventListener('go-dashboard', handleGoDashboard);
    window.addEventListener('go-builder', handleGoBuilder);

    return () => {
      window.removeEventListener('open-templates', handleOpenTemplates);
      window.removeEventListener('open-ai-prompt', handleOpenPrompt);
      window.removeEventListener('open-sidebar', handleOpenSidebar);
      window.removeEventListener('go-dashboard', handleGoDashboard);
      window.removeEventListener('go-builder', handleGoBuilder);
    };
  }, []);

  // Keyboard Shortcuts for Undo/Redo (Ctrl+Z / Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        if (e.key === 'z' || e.key === 'Z') {
          e.preventDefault();
          useBuilderStore.getState().undo();
        } else if (e.key === 'y' || e.key === 'Y') {
          e.preventDefault();
          useBuilderStore.getState().redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Restore state on mount
  useEffect(() => {
    const savedPages = localStorage.getItem('genovax_builder_pages');
    const savedActivePage = localStorage.getItem('genovax_builder_active_page');
    if (savedPages) {
      try {
        const parsed = JSON.parse(savedPages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          useBuilderStore.setState({ pages: parsed });
          if (savedActivePage) {
            useBuilderStore.setState({ activePageId: savedActivePage });
          }
        }
      } catch (e) {
        console.error('Failed to restore pages from LocalStorage:', e);
      }
    }
  }, []);

  // Autosave interval every 10 seconds
  useEffect(() => {
    let timeoutId: any;
    const interval = setInterval(() => {
      const { pages, activePageId } = useBuilderStore.getState();
      localStorage.setItem('genovax_builder_pages', JSON.stringify(pages));
      localStorage.setItem('genovax_builder_active_page', activePageId);

      setShowAutoSaved(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowAutoSaved(false);
      }, 2000);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, []);

  // Helper to format date strings
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Unknown date';
    }
  };

  // Helper to load template into active canvas page
  const handleSelectTemplate = (_templateId: string, comps: any[]) => {
    const updatedPages = pages.map(page => 
      page.id === activePageId ? { ...page, components: comps } : page
    );
    useBuilderStore.getState().setPages(updatedPages);
    setCurrentView('builder');
    alert('Template loaded successfully into canvas!');
  };

  // Stats mock data for SaaS dashboard
  const stats = [
    { name: 'Active Pages', value: pages.length.toString(), icon: <Layers className="w-5 h-5 text-indigo-400" /> },
    { name: 'Generated Layers', value: pages.reduce((sum, p) => sum + p.components.length, 0).toString(), icon: <BarChart3 className="w-5 h-5 text-purple-400" /> },
    { name: 'AI Credits Remaining', value: '98%', icon: <Zap className="w-5 h-5 text-yellow-400" /> },
    { name: 'Build Quality Score', value: '100', icon: <CheckCircle2 className="w-5 h-5 text-green-400" /> }
  ];

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'dark bg-[#090d16]' : 'bg-[#f8fafc]'}`}>
      
      {/* 1. Header fixed top */}
      <Header 
        onToggleSidebar={() => setSidebarOpen(true)}
        onOpenExport={() => setExportOpen(true)}
        onOpenPrompt={() => setPromptOpen(true)}
      />

      {/* 2. Global Drawer menu sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(view) => {
          if (view === 'export') {
            setExportOpen(true);
          } else if (view === 'templates') {
            setCurrentView('templates');
          } else if (view === 'generator') {
            setPromptOpen(true);
          } else if (view === 'theme') {
            setCurrentView('builder');
            useBuilderStore.getState().setLeftPanelTab('theme');
            useBuilderStore.getState().setLeftPanelExpanded(true);
          } else if (view === 'components') {
            setCurrentView('builder');
            useBuilderStore.getState().setLeftPanelTab('components');
            useBuilderStore.getState().setLeftPanelExpanded(true);
          } else if (view === 'media') {
            setCurrentView('builder');
            useBuilderStore.getState().setLeftPanelTab('media');
            useBuilderStore.getState().setLeftPanelExpanded(true);
          } else if (view === 'pages') {
            setCurrentView('builder');
            useBuilderStore.getState().setLeftPanelTab('pages');
            useBuilderStore.getState().setLeftPanelExpanded(true);
          } else if (view === 'settings') {
            setCurrentView('builder');
            useBuilderStore.getState().setLeftPanelTab('settings');
            useBuilderStore.getState().setLeftPanelExpanded(true);
          } else if (view === 'builder') {
            setCurrentView('builder');
            useBuilderStore.getState().setLeftPanelExpanded(false);
          } else {
            setCurrentView(view);
          }
        }}
        currentView={currentView}
      />

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex w-full h-full relative pt-14">
        {currentView === 'builder' && (
          <>
            {/* Left elements panel */}
            <LeftPanel />

            {/* Canvas workspace viewport */}
            <CanvasWorkspace />

            {/* Right properties settings panel */}
            <RightPanel />

            {/* Floating Action Button (FAB) for AI UI layout generator */}
            <button 
              onClick={() => setPromptOpen(true)}
              className="fixed bottom-14 right-64 bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition-transform text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-glow flex items-center gap-1.5 z-45"
            >
              <Sparkles className="w-4 h-4 fill-white/20 animate-pulse" />
              Generate Layout UI
            </button>
          </>
        )}

        {currentView === 'templates' && (
          <div className="flex-1 overflow-y-auto p-8 max-w-[1200px] mx-auto space-y-8 pb-24">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 font-bold">Templates Gallery</span>
              <h1 className="text-3xl font-black text-white leading-tight">Premium Layout Templates</h1>
              <p className="text-xs text-textMuted-dark max-w-[600px]">
                Choose a pre-designed layout to overwrite your current canvas. Ideal for portfolios, landing pages, commerce storefronts, and analytics boards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TEMPLATES_LIST.map((template) => (
                <div 
                  key={template.id}
                  className={`p-6 rounded-xl border border-slate-800/80 bg-card-dark/40 flex flex-col justify-between hover:border-indigo-500/50 transition-all group`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl p-2.5 bg-indigo-500/10 rounded-xl group-hover:scale-110 transition-transform">
                        {template.icon}
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                          {template.name}
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded uppercase font-semibold">Ready</span>
                        </h3>
                        <span className="text-[9px] text-slate-500 font-mono">Components count: {template.components.length}</span>
                      </div>
                    </div>
                    <p className="text-xs text-textMuted-dark leading-relaxed">
                      {template.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-800/40 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">Preset Absolute Layout</span>
                    <button
                      onClick={() => handleSelectTemplate(template.id, template.components)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold py-2 px-5 rounded-md text-white flex items-center gap-1 shadow-sm"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'projects' && (
          <div className="flex-1 overflow-y-auto p-8 max-w-[1200px] mx-auto space-y-8 pb-24">
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 font-bold">Workspace Management</span>
                <h1 className="text-3xl font-black text-white leading-tight">My Saved Projects</h1>
              </div>
              <button
                onClick={() => {
                  const name = prompt('Enter a name for the new project:');
                  if (name && name.trim()) {
                    createNewProject(name.trim());
                    setCurrentView('builder');
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold py-2 px-5 rounded-md text-white flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create New Project
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {projects.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-card-dark/20 text-slate-500 text-xs">
                  No saved projects found. Click "Create New Project" to get started!
                </div>
              ) : (
                projects.map((project) => (
                  <div 
                    key={project.id}
                    className={`p-4 rounded-xl border border-slate-800/80 bg-card-dark/40 flex items-center justify-between hover:border-indigo-500/30 transition-all ${
                      activeProjectId === project.id ? 'ring-1 ring-indigo-500/50 border-indigo-500/40' : ''
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-white">{project.name}</h3>
                        {activeProjectId === project.id && (
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.2 rounded font-bold uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 text-[10px] text-textMuted-dark">
                        <span>Created: {formatDate(project.createdAt)}</span>
                        <span>Modified: {formatDate(project.updatedAt)}</span>
                        <span>Pages: {project.pages.length}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          loadProject(project.id);
                          setCurrentView('builder');
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold py-1.5 px-4 rounded text-white"
                      >
                        Open Project
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
                            deleteProject(project.id);
                          }
                        }}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold py-1.5 px-3 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {currentView === 'dashboard' && (
          <div className="flex-1 overflow-y-auto p-8 max-w-[1200px] mx-auto space-y-8 pb-24">
            
            {/* Hero banner */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-600/30 to-purple-600/10 border border-indigo-500/20 shadow-glow shadow-indigo-500/5 flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">GenovaX AI Builder</span>
                <h1 className="text-3xl font-black text-white leading-tight">Create Professional Layouts Instantly</h1>
                <p className="text-xs text-textMuted-dark max-w-[500px]">
                  Use the Canva Builder or describe your layout to let the AI build responsive, modular grid structures that you can edit inline.
                </p>
                <div className="flex items-center gap-3 pt-3">
                  <button 
                    onClick={() => setCurrentView('builder')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold py-2 px-5 rounded-md text-white flex items-center gap-1"
                  >
                    Open Canva Builder
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setPromptOpen(true)}
                    className="bg-[#101726]/60 border border-border-dark text-xs font-bold py-2 px-5 rounded-md text-white flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    AI Prompt
                  </button>
                </div>
              </div>
              <div className="hidden md:block text-8xl opacity-80 filter drop-shadow-[0_0_35px_rgba(99,102,241,0.25)] select-none">
                ⚡
              </div>
            </div>

            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl border border-slate-800/80 bg-card-dark/40 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-[10px] text-textMuted-dark uppercase font-semibold">{s.name}</div>
                    <div className="text-xl font-black text-white">{s.value}</div>
                  </div>
                  <div className="p-2 bg-slate-800/40 rounded-lg">
                    {s.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Content Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Recent Canvas Projects */}
              <div className="md:col-span-2 border border-slate-800/80 bg-card-dark/40 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    📁 Recent Projects
                  </h3>
                  <button 
                    onClick={() => setCurrentView('projects')}
                    className="text-[10px] text-indigo-400 hover:underline font-bold font-mono"
                  >
                    View All Projects
                  </button>
                </div>
                
                <div className="space-y-3">
                  {projects.slice(0, 3).map((p) => (
                    <div 
                      key={p.id}
                      className="p-3.5 rounded-lg border border-slate-800 bg-[#090d16]/30 flex items-center justify-between hover:border-indigo-500/45 transition-colors cursor-pointer"
                      onClick={() => {
                        loadProject(p.id);
                        setCurrentView('builder');
                      }}
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white">{p.name}</h4>
                        <p className="text-[10px] text-textMuted-dark">Modified: {formatDate(p.updatedAt)}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20`}>
                        {activeProjectId === p.id ? 'Active' : 'Saved'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Prompt Ideas Panel */}
              <div className="border border-slate-800/80 bg-card-dark/40 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  💡 Ideas to Try
                </h3>
                
                <div className="space-y-3 text-[10px]">
                  <div 
                    onClick={() => setPromptOpen(true)}
                    className="p-3 border border-slate-800 rounded bg-[#090d16]/30 hover:border-indigo-500/30 transition-colors cursor-pointer space-y-1"
                  >
                    <span className="font-bold text-indigo-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
                      Food Bistro Website
                    </span>
                    <p className="text-slate-500 text-[9px] leading-relaxed">"Create a cozy coffee shop site with specials grid."</p>
                  </div>
                  <div 
                    onClick={() => setPromptOpen(true)}
                    className="p-3 border border-slate-800 rounded bg-[#090d16]/30 hover:border-indigo-500/30 transition-colors cursor-pointer space-y-1"
                  >
                    <span className="font-bold text-indigo-400 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/10" />
                      Creative Portfolio
                    </span>
                    <p className="text-slate-500 text-[9px] leading-relaxed">"Modern dark gallery showing graphic design wireframes."</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* 4. Popups and Modal window overlays */}
      <AIPromptPopup 
        isOpen={promptOpen}
        onClose={() => setPromptOpen(false)}
        onShowLoading={(loading) => setShowLoading(loading)}
      />

      <ExportModal 
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
      />

      <TemplatesModal 
        isOpen={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
      />

      {/* 5. Master Canvas Loading AI layout compiler overlay */}
      {showLoading && (
        <div className="fixed inset-0 z-50 bg-[#090d16]/90 backdrop-blur-md flex flex-col justify-center items-center select-none">
          <div className="flex flex-col items-center gap-4">
            {/* Neon spinner spinner */}
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/10 border-t-indigo-600 animate-spin"></div>
            <span className="text-xs font-extrabold text-white tracking-wider animate-pulse flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
              GenovaX is assembling layout...
            </span>
          </div>
        </div>
      )}

      {/* 6. Auto Saved Notification Toast */}
      {showAutoSaved && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs px-3.5 py-1.5 rounded-full shadow-glow z-50 flex items-center gap-1.5 transition-all animate-bounce">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          Auto Saved
        </div>
      )}

    </div>
  );
};

export default App;
