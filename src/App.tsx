import React, { useState } from 'react';
import { useBuilderStore } from './store/useBuilderStore';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { CanvasWorkspace } from './components/CanvasWorkspace';
import { AIPromptPopup } from './components/AIPromptPopup';
import { ExportModal } from './components/ExportModal';
import { TemplatesModal } from './components/TemplatesModal';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  BarChart3, 
  CheckCircle2, 
  Zap, 
  Flame, 
  Heart
} from 'lucide-react';

const App: React.FC = () => {
  const { theme, toggleTheme } = useBuilderStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  
  // Custom View State: 'dashboard' | 'builder' | 'templates' | 'projects' | 'settings'
  const [currentView, setCurrentView] = useState('builder');
  
  // Canvas AI loading spinner state
  const [showLoading, setShowLoading] = useState(false);

  // Global listeners for events dispatched from sidebar icons
  React.useEffect(() => {
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

  // Stats mock data for SaaS dashboard
  const stats = [
    { name: 'Active Pages', value: '4', icon: <Layers className="w-5 h-5 text-indigo-400" /> },
    { name: 'Generated Layers', value: '18', icon: <BarChart3 className="w-5 h-5 text-purple-400" /> },
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
            setTemplatesOpen(true);
          } else if (view === 'generator') {
            setPromptOpen(true);
          } else if (view === 'theme') {
            toggleTheme();
          } else {
            setCurrentView(view);
          }
        }}
        currentView={currentView}
      />

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex w-full h-full relative pt-14">
        {currentView === 'builder' ? (
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
        ) : (
          /* SaaS Dashboard View */
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
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  📁 Recent Projects
                </h3>
                
                <div className="space-y-3">
                  {[
                    { name: 'AI SaaS Landing Page', desc: 'Active draft • Last edited 4m ago', status: 'In Progress' },
                    { name: 'Gourmet Restaurant Menu', desc: 'Static page • Last edited 1d ago', status: 'Saved' },
                    { name: 'Apparel Store Front', desc: 'E-commerce • Last edited 1w ago', status: 'Published' }
                  ].map((p, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-lg border border-slate-800 bg-[#090d16]/30 flex items-center justify-between hover:border-indigo-500/45 transition-colors cursor-pointer"
                      onClick={() => setCurrentView('builder')}
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white">{p.name}</h4>
                        <p className="text-[10px] text-textMuted-dark">{p.desc}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        p.status === 'Published' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : p.status === 'Saved' 
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {p.status}
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
              AI UI Builder is assembling layout...
            </span>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
