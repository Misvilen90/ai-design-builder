import React from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { 
  Menu, 
  Laptop, 
  Tablet, 
  Smartphone, 
  Sun, 
  Moon, 
  Bell, 
  Undo2, 
  Redo2, 
  Save, 
  UploadCloud, 
  Code,
  Sparkles,
  Eye
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenExport: () => void;
  onOpenPrompt: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar, 
  onOpenExport,
  onOpenPrompt
}) => {
  const { 
    pages, 
    activePageId, 
    viewport, 
    setViewport, 
    theme, 
    toggleTheme, 
    undo, 
    redo,
    history,
    redoHistory,
    activeProjectId,
    saveCurrentProject
  } = useBuilderStore();

  const activePage = pages.find(p => p.id === activePageId);

  const handleSave = () => {
    if (!activeProjectId) {
      const name = prompt('Enter a name for your new project:');
      if (name && name.trim()) {
        saveCurrentProject(name.trim());
        alert(`Project "${name.trim()}" saved successfully!`);
      }
    } else {
      saveCurrentProject();
      alert('Project saved successfully!');
    }
  };

  const handlePublish = () => {
    alert('Project published successfully! Live URL: https://ai-ui-builder.preview.genovax.app');
  };

  return (
    <header className={`h-14 w-full border-b flex items-center justify-between px-4 z-50 fixed top-0 left-0 ${
      theme === 'dark' 
        ? 'bg-[#101726]/85 border-[#1e293b] text-[#f1f5f9] backdrop-blur-md' 
        : 'bg-white/85 border-[#e2e8f0] text-[#0f172a] backdrop-blur-md'
    }`}>
      {/* Left items */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-md transition-colors ${
            theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
          }`}
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
            GenovaX
          </span>
        </div>

        {activePage && (
          <div className={`text-xs px-2.5 py-1 rounded-full font-medium ml-3 flex items-center gap-1 border ${
            theme === 'dark' 
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
              : 'bg-indigo-50 border-indigo-100 text-indigo-600'
          }`}>
            📄 {activePage.name}
          </div>
        )}
      </div>

      {/* Middle Responsive Controls */}
      <div className={`flex items-center gap-1 border p-1 rounded-full ${
        theme === 'dark' ? 'bg-black/25 border-[#1e293b]' : 'bg-slate-100 border-[#e2e8f0]'
      }`}>
        <button
          onClick={() => setViewport('desktop')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            viewport === 'desktop'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-textMuted-dark hover:text-white'
          }`}
          title="Desktop view"
        >
          <Laptop className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Desktop</span>
        </button>
        <button
          onClick={() => setViewport('tablet')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            viewport === 'tablet'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-textMuted-dark hover:text-white'
          }`}
          title="Tablet view"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tablet</span>
        </button>
        <button
          onClick={() => setViewport('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            viewport === 'mobile'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-textMuted-dark hover:text-white'
          }`}
          title="Mobile view"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mobile</span>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* History Controls */}
        <div className="flex items-center gap-1 border-r pr-3 border-border-dark">
          <button
            onClick={undo}
            disabled={history.length === 0}
            className={`p-1.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={redoHistory.length === 0}
            className={`p-1.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons */}
        <button 
          onClick={onOpenPrompt}
          className="text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1 hover:brightness-110 shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Prompt
        </button>

        <button 
          onClick={onOpenExport}
          className={`text-xs font-semibold border px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors ${
            theme === 'dark' 
              ? 'border-[#1e293b] hover:bg-slate-800 text-white' 
              : 'border-[#e2e8f0] hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          Export Code
        </button>

        <button 
          onClick={() => window.open('/?preview=true', '_blank')}
          className={`text-xs font-semibold border px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors ${
            theme === 'dark' 
              ? 'border-[#1e293b] hover:bg-slate-800 text-white' 
              : 'border-[#e2e8f0] hover:bg-slate-50 text-slate-700'
          }`}
          title="Preview layout in a new tab"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>

        <button 
          onClick={handleSave}
          className={`p-1.5 rounded-md border transition-colors ${
            theme === 'dark' 
              ? 'border-[#1e293b] hover:bg-slate-800 text-white' 
              : 'border-[#e2e8f0] hover:bg-slate-50 text-slate-700'
          }`}
          title="Save Project"
        >
          <Save className="w-4 h-4" />
        </button>

        <button 
          onClick={handlePublish}
          className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-indigo-500 shadow-sm"
          title="Publish live website"
        >
          <UploadCloud className="w-4 h-4" />
          Publish
        </button>

        {/* System buttons */}
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

        <button 
          className={`p-1.5 rounded-md border relative transition-colors ${
            theme === 'dark' 
              ? 'border-[#1e293b] hover:bg-slate-800 text-white' 
              : 'border-[#e2e8f0] hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>

        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80" 
          alt="Profile Avatar" 
          className="w-7 h-7 rounded-full object-cover border border-indigo-500"
        />
      </div>
    </header>
  );
};
