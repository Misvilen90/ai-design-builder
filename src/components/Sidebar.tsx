import React, { useState } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Palette, 
  Wrench, 
  Sparkles, 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Paintbrush, 
  Download, 
  Settings, 
  Plus, 
  Trash2, 
  Copy, 
  Edit3, 
  Check, 
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate,
  currentView
}) => {
  const { 
    pages, 
    activePageId, 
    addPage, 
    deletePage, 
    duplicatePage, 
    renamePage, 
    setActivePageId, 
    theme 
  } = useBuilderStore();

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'templates', name: 'Templates', icon: <Palette className="w-4 h-4" /> },
    { id: 'builder', name: 'Canva Builder', icon: <Wrench className="w-4 h-4" /> },
    { id: 'generator', name: 'AI UI Generator', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'projects', name: 'My Projects', icon: <Folder className="w-4 h-4" /> },
    { id: 'pages', name: 'Pages', icon: <FileText className="w-4 h-4" /> },
    { id: 'media', name: 'Media Library', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'theme', name: 'Theme Settings', icon: <Paintbrush className="w-4 h-4" /> },
    { id: 'export', name: 'Export Center', icon: <Download className="w-4 h-4" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const handleCreatePage = () => {
    const pageName = prompt('Enter new page name:');
    if (pageName && pageName.trim()) {
      const success = addPage(pageName.trim());
      if (!success) {
        alert('A page with this name already exists or is invalid.');
      }
    }
  };

  const handleStartRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setRenameValue(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (renameValue.trim()) {
      renamePage(id, renameValue.trim());
    }
    setRenamingId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Sidebar Drawer */}
          <motion.aside 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            className={`fixed left-0 top-0 h-full w-64 z-50 flex flex-col border-r shadow-2xl ${
              theme === 'dark' 
                ? 'bg-[#101726]/95 border-[#1e293b] text-[#f1f5f9]' 
                : 'bg-white/95 border-[#e2e8f0] text-[#0f172a]'
            }`}
          >
            {/* Header */}
            <div className="h-14 border-b border-inherit px-4 flex items-center justify-between">
              <span className="font-extrabold text-sm tracking-wide uppercase text-indigo-400 flex items-center gap-2">
                <span>⚡</span> Menu Options
              </span>
              <button 
                onClick={onClose}
                className={`p-1 rounded-md text-xs font-bold ${
                  theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Menu scrollable */}
            <div className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
              <nav className="flex flex-col gap-0.5">
                {menuItems.map(item => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all text-left ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                          : theme === 'dark' 
                            ? 'hover:bg-slate-800 text-slate-300 hover:text-white' 
                            : 'hover:bg-slate-100 text-slate-700 hover:text-[#0f172a]'
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </button>
                  );
                })}
              </nav>

              {/* Pages Section */}
              <div className="border-t border-inherit pt-4 px-1">
                <div className="flex justify-between items-center mb-2 px-2">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-textMuted-dark">
                    Pages list
                  </span>
                  <button 
                    onClick={handleCreatePage}
                    className="p-1 rounded text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                    title="Add Page"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {pages.map(page => {
                    const isSelected = activePageId === page.id;
                    const isRenaming = renamingId === page.id;

                    return (
                      <div
                        key={page.id}
                        onClick={() => {
                          if (!isRenaming) {
                            setActivePageId(page.id);
                            onNavigate('builder');
                            onClose();
                          }
                        }}
                        className={`group w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/25'
                            : theme === 'dark' 
                              ? 'text-slate-300 hover:bg-slate-800/60' 
                              : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {isRenaming ? (
                          <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={renameValue}
                              onChange={e => setRenameValue(e.target.value)}
                              className="bg-black/40 border border-border-dark rounded px-1.5 py-0.5 text-xs text-white flex-1 outline-none"
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveRename(page.id);
                                if (e.key === 'Escape') setRenamingId(null);
                              }}
                            />
                            <button 
                              onClick={() => handleSaveRename(page.id)}
                              className="text-green-500 p-0.5"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => setRenamingId(null)}
                              className="text-red-500 p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="truncate flex-1">📄 {page.name}</span>
                            
                            {/* Action icons */}
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartRename(page.id, page.name);
                                }}
                                className="p-0.5 hover:text-white transition-colors"
                                title="Rename Page"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicatePage(page.id);
                                }}
                                className="p-0.5 hover:text-white transition-colors"
                                title="Duplicate Page"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              {pages.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Are you sure you want to delete "${page.name}"?`)) {
                                      deletePage(page.id);
                                    }
                                  }}
                                  className="p-0.5 hover:text-red-400 transition-colors"
                                  title="Delete Page"
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
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
