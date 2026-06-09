import React, { useState, useEffect, useRef } from 'react';
import { useBuilderStore } from '../store/useBuilderStore';
import { 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Sliders, 
  Layers, 
  History, 
  ChevronLeft,
  Trash2,
  Edit3
} from 'lucide-react';

// Compact Custom Floating Color Swatch Component
interface ColorPickerRowProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const ColorPickerRow: React.FC<ColorPickerRowProps> = ({ label, value, onChange, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="flex items-center justify-between text-[9px] py-0.5 border-b border-slate-800/10">
      <span className="text-slate-500">{label}</span>
      <div className="flex items-center gap-1">
        <button
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="w-3.5 h-3.5 rounded-full border border-slate-700 hover:border-indigo-500 transition-colors shadow-sm cursor-pointer"
          style={{ backgroundColor: value || 'transparent' }}
          title="Click to select color"
        />
        <span 
          onClick={() => !disabled && inputRef.current?.click()}
          className="font-mono text-[8px] text-slate-400 cursor-pointer select-all hover:text-white hover:underline"
        >
          {value ? value.toUpperCase() : '#NONE'}
        </span>
        <input
          ref={inputRef}
          type="color"
          value={value && value.startsWith('#') ? value : '#ffffff'}
          disabled={disabled}
          onChange={e => onChange(e.target.value)}
          className="hidden"
        />
      </div>
    </div>
  );
};

export const RightPanel: React.FC = () => {
  const { 
    pages, 
    activePageId, 
    selectedComponentId, 
    selectedComponentIds,
    setSelectionIds,
    updateComponentStyle, 
    updateComponentPosition, 
    updateComponentContent,
    toggleComponentLock,
    toggleComponentVisibility,
    moveComponentOrder,
    theme,
    rightPanelWidth,
    rightPanelCollapsed,
    setRightPanelWidth,
    setRightPanelCollapsed,
    setSelection,
    deleteComponent,
    updateComponentName
  } = useBuilderStore();

  const [renamingLayerId, setRenamingLayerId] = useState<string | null>(null);
  const [renameLayerValue, setRenameLayerValue] = useState('');
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);

  const handleLayerDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLayerId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleLayerDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleLayerDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain') || draggedLayerId;
    if (draggedId && draggedId !== targetId) {
      useBuilderStore.getState().reorderComponents(draggedId, targetId);
    }
    setDraggedLayerId(null);
  };

  const activePage = pages.find(p => p.id === activePageId);
  const selectedComponent = activePage 
    ? activePage.components.find(c => c.id === selectedComponentId) 
    : null;

  // Tabs state: properties, layers, history
  const [activeTab, setActiveTab] = useState<'properties' | 'layers' | 'history'>('properties');

  // Single-expanded accordion section in Properties tab
  const [activeSection, setActiveSection] = useState<'settings' | 'layout' | 'typography' | 'colors' | 'effects' | null>('settings');

  // Advanced options toggle states
  const [showAdvanced, setShowAdvanced] = useState({
    settings: false,
    layout: false,
    typography: false,
    colors: false,
    effects: false
  });

  // Reset accordion and active tab when selection changes
  useEffect(() => {
    if (selectedComponentId) {
      setActiveTab('properties');
      setActiveSection('settings');
      setShowAdvanced({
        settings: false,
        layout: false,
        typography: false,
        colors: false,
        effects: false
      });
    }
  }, [selectedComponentId]);

  // Listen for tab switching events from the left toolbar
  useEffect(() => {
    const handleSetRightTab = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === 'layers' || customEvent.detail === 'properties' || customEvent.detail === 'history') {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener('set-right-tab', handleSetRightTab);
    return () => window.removeEventListener('set-right-tab', handleSetRightTab);
  }, []);

  // Handle panel resizing
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const startWidth = rightPanelWidth;
    const startX = e.clientX;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      // Moving left increases right sidebar width
      const newWidth = startWidth - deltaX;
      // Constrained between 130px and 180px maximum
      const constrainedWidth = Math.max(130, Math.min(180, newWidth));
      setRightPanelWidth(constrainedWidth);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Render when collapsed
  if (rightPanelCollapsed) {
    return (
      <button 
        onClick={() => setRightPanelCollapsed(false)}
        className={`fixed top-16 right-0 z-40 p-2 rounded-l-md border border-r-0 shadow-lg transition-all ${
          theme === 'dark' 
            ? 'bg-[#101726]/90 border-slate-800 text-indigo-400 hover:text-white hover:bg-[#1a2333]' 
            : 'bg-white/95 border-slate-200 text-indigo-505 hover:bg-slate-50'
        }`}
        title="Expand Properties Panel"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    );
  }

  // Properties Tab Renderer
  const renderPropertiesTab = () => {
    if (!selectedComponent) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-3 mt-12 opacity-60 select-none">
          <Sliders className="w-8 h-8 mb-2 text-indigo-500" />
          <h4 className="text-[10px] font-bold text-slate-400">No Selection</h4>
          <p className="text-[9px] text-slate-500 mt-1 max-w-[130px] leading-relaxed">
            Select an element on canvas to configure.
          </p>
        </div>
        
      );
      return (
  <div className="space-y-2 p-2">
    <div>
      <label className="text-[10px] text-slate-400">Name</label>
      <input
        className="w-full text-[10px] p-1 bg-slate-800 text-white rounded"
        value={selectedComponent.name}
        onChange={(e) =>
          updateComponentName(selectedComponent.id, e.target.value)
        }
      />
    </div>

  </div>
);
};
   return (
      <div className="space-y-1">
        {renderAccordionSection('settings', '⚙️ Settings', renderSettingsContent)}
        {renderAccordionSection('layout', '📐 Layout', renderLayoutContent)}
        {renderAccordionSection('typography', '🔤 Typography', renderTypographyContent)}
        {renderAccordionSection('colors', '🎨 Colors', renderColorsContent)}
        {renderAccordionSection('effects', '📏 Effects & spacing', renderEffectsContent)}
      </div>
    );
  };

  // Helper to render an accordion section
  const renderAccordionSection = (
    id: 'settings' | 'layout' | 'typography' | 'colors' | 'effects', 
    label: string, 
    contentRenderer: (comp: any, isLocked: boolean, isVisible: boolean) => React.ReactNode
  ) => {
    const isOpen = activeSection === id;
    const isLocked = selectedComponent?.locked === true;
    const isVisible = selectedComponent?.visible !== false;

    return (
      <div className={`border rounded overflow-hidden select-none transition-all ${
        theme === 'dark' ? 'border-slate-800/80 bg-black/10' : 'border-slate-200 bg-slate-50/50'
      }`}>
        <button
          onClick={() => setActiveSection(isOpen ? null : id)}
          className={`w-full flex items-center justify-between px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
            theme === 'dark' 
              ? 'bg-slate-800/25 hover:bg-slate-800/50 text-slate-400' 
              : 'bg-slate-100 hover:bg-slate-200/50 text-slate-600'
          }`}
        >
          <span>{label}</span>
          {isOpen ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
        </button>
        {isOpen && selectedComponent && (
          <div className="p-1.5 space-y-1.5 bg-black/5 text-[9px]">
            {contentRenderer(selectedComponent, isLocked, isVisible)}
          </div>
        )}
      </div>
    );
  };

  // Settings Content Renderer
  const renderSettingsContent = (comp: any, isLocked: boolean, isVisible: boolean) => {
    const showAdv = showAdvanced.settings;
    return (
      <div className="space-y-1.5">
        <div className="flex flex-col gap-0.5">
          <label className="text-slate-500">Name</label>
          <input
            type="text"
            value={comp.name}
            disabled={isLocked}
            onChange={e => {
              updateComponentName(comp.id, e.target.value);
            }}
            className={`w-full text-[9px] p-1 rounded border outline-none bg-black/25 ${
              theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
            }`}
          />
        </div>

        {comp.content.text !== undefined && (
          <div className="flex flex-col gap-0.5">
            <label className="text-slate-500">Text Content</label>
            <textarea
              value={comp.content.text}
              disabled={isLocked}
              onChange={e => updateComponentContent(comp.id, { text: e.target.value })}
              className={`w-full text-[9px] p-1 rounded border outline-none h-10 bg-black/25 resize-none ${
                theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
              }`}
            />
          </div>
        )}

        {comp.content.label !== undefined && (
          <div className="flex flex-col gap-0.5">
            <label className="text-slate-500">Btn Label</label>
            <input
              type="text"
              value={comp.content.label}
              disabled={isLocked}
              onChange={e => updateComponentContent(comp.id, { label: e.target.value })}
              className={`w-full text-[9px] p-1 rounded border outline-none bg-black/25 ${
                theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
              }`}
            />
          </div>
        )}

        <div className="pt-0.5">
          <button
            onClick={() => setShowAdvanced(prev => ({ ...prev, settings: !prev.settings }))}
            className="text-[8px] text-indigo-400 hover:underline flex items-center gap-0.5 font-bold"
          >
            {showAdv ? 'Hide Options' : 'Show Options'}
          </button>
          
          {showAdv && (
            <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-slate-800/40">
              <button
                onClick={() => toggleComponentLock(comp.id)}
                className={`flex-1 flex items-center justify-center gap-0.5 py-0.5 px-1 border rounded text-[8px] font-semibold transition-colors ${
                  isLocked 
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' 
                    : theme === 'dark' ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isLocked ? <Lock className="w-2.5 h-2.5 text-indigo-400" /> : <Unlock className="w-2.5 h-2.5" />}
                <span>{isLocked ? 'Locked' : 'Lock'}</span>
              </button>
              <button
                onClick={() => toggleComponentVisibility(comp.id)}
                className={`flex-1 flex items-center justify-center gap-0.5 py-0.5 px-1 border rounded text-[8px] font-semibold transition-colors ${
                  !isVisible 
                    ? 'border-red-500 text-red-400 bg-red-500/10' 
                    : theme === 'dark' ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {!isVisible ? <EyeOff className="w-2.5 h-2.5 text-red-400" /> : <Eye className="w-2.5 h-2.5" />}
                <span>{isVisible ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Layout Content Renderer
  const renderLayoutContent = (comp: any, isLocked: boolean) => {
    const showAdv = showAdvanced.layout;
    return (
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-1">
          <div className="flex flex-col gap-0.5">
            <label className="text-slate-500">Width (px)</label>
            <input
              type="number"
              value={comp.position.width}
              disabled={isLocked}
              onChange={e => updateComponentPosition(comp.id, { width: parseInt(e.target.value) || 0 })}
              className={`w-full text-[9px] p-0.5 px-1 rounded border outline-none bg-black/25 ${
                theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
              }`}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-slate-500">Height (px)</label>
            <input
              type="number"
              value={comp.position.height}
              disabled={isLocked}
              onChange={e => updateComponentPosition(comp.id, { height: parseInt(e.target.value) || 0 })}
              className={`w-full text-[9px] p-0.5 px-1 rounded border outline-none bg-black/25 ${
                theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
              }`}
            />
          </div>
        </div>

        <div className="pt-0.5">
          <button
            onClick={() => setShowAdvanced(prev => ({ ...prev, layout: !prev.layout }))}
            className="text-[8px] text-indigo-400 hover:underline flex items-center gap-0.5 font-bold"
          >
            {showAdv ? 'Hide Coordinates' : 'Show Coordinates'}
          </button>

          {showAdv && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-800/40 space-y-1">
              <div className="grid grid-cols-2 gap-1">
                <div className="flex flex-col gap-0.5">
                  <label className="text-slate-500">X Position (L)</label>
                  <input
                    type="number"
                    value={comp.position.left}
                    disabled={isLocked}
                    onChange={e => updateComponentPosition(comp.id, { left: parseInt(e.target.value) || 0 })}
                    className={`w-full text-[9px] p-0.5 px-1 rounded border outline-none bg-black/25 ${
                      theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-slate-500">Y Position (T)</label>
                  <input
                    type="number"
                    value={comp.position.top}
                    disabled={isLocked}
                    onChange={e => updateComponentPosition(comp.id, { top: parseInt(e.target.value) || 0 })}
                    className={`w-full text-[9px] p-0.5 px-1 rounded border outline-none bg-black/25 ${
                      theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div className="flex flex-col gap-0.5">
                  <label className="text-slate-500">Rotation (°)</label>
                  <input
                    type="number"
                    value={comp.position.rotate || 0}
                    disabled={isLocked}
                    onChange={e => updateComponentPosition(comp.id, { rotate: parseInt(e.target.value) || 0 })}
                    className={`w-full text-[9px] p-0.5 px-1 rounded border outline-none bg-black/25 ${
                      theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-slate-500">Z-Index</label>
                  <input
                    type="number"
                    value={comp.position.zIndex}
                    disabled={isLocked}
                    onChange={e => updateComponentPosition(comp.id, { zIndex: parseInt(e.target.value) || 0 })}
                    className={`w-full text-[9px] p-0.5 px-1 rounded border outline-none bg-black/25 ${
                      theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-between gap-1 pt-1.5 border-t border-slate-850/50">
                <button
                  onClick={() => moveComponentOrder(comp.id, 1)}
                  className={`flex-1 py-0.5 rounded text-[8px] font-bold border ${
                    theme === 'dark' ? 'border-slate-800 bg-slate-800/30 text-slate-300' : 'border-slate-200 bg-slate-100 text-slate-600'
                  }`}
                >
                  Forward
                </button>
                <button
                  onClick={() => moveComponentOrder(comp.id, -1)}
                  className={`flex-1 py-0.5 rounded text-[8px] font-bold border ${
                    theme === 'dark' ? 'border-slate-800 bg-slate-800/30 text-slate-300' : 'border-slate-200 bg-slate-100 text-slate-600'
                  }`}
                >
                  Backward
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Typography Content Renderer
  const renderTypographyContent = (comp: any, isLocked: boolean) => {
    const showAdv = showAdvanced.typography;
    return (
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-1">
          <div className="flex flex-col gap-0.5">
            <label className="text-slate-500">Size</label>
            <input
              type="text"
              value={comp.style.fontSize || '16px'}
              disabled={isLocked}
              onChange={e => updateComponentStyle(comp.id, { fontSize: e.target.value })}
              className={`w-full text-[9px] p-0.5 px-1 rounded border outline-none bg-black/25 ${
                theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
              }`}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-slate-500">Weight</label>
            <select
              value={comp.style.fontWeight || '400'}
              disabled={isLocked}
              onChange={e => updateComponentStyle(comp.id, { fontWeight: e.target.value })}
              className={`w-full text-[9px] p-0.5 rounded border outline-none bg-[#101726]/60 ${
                theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
              }`}
            >
              <option value="300">Light</option>
              <option value="400">Normal</option>
              <option value="600">Semi</option>
              <option value="700">Bold</option>
              <option value="900">Black</option>
            </select>
          </div>
        </div>

        <div className="pt-0.5">
          <button
            onClick={() => setShowAdvanced(prev => ({ ...prev, typography: !prev.typography }))}
            className="text-[8px] text-indigo-400 hover:underline flex items-center gap-0.5 font-bold"
          >
            {showAdv ? 'Hide Typography' : 'Show Typography'}
          </button>

          {showAdv && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-800/40 space-y-1">
              <div className="flex flex-col gap-0.5">
                <label className="text-slate-500">Font Family</label>
                <select
                  value={comp.style.fontFamily || 'sans-serif'}
                  disabled={isLocked}
                  onChange={e => updateComponentStyle(comp.id, { fontFamily: e.target.value })}
                  className={`w-full text-[9px] p-0.5 rounded border outline-none bg-[#101726]/60 ${
                    theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="sans-serif">System Sans</option>
                  <option value="'Inter', sans-serif">Inter</option>
                  <option value="'Outfit', sans-serif">Outfit</option>
                  <option value="monospace">Monospace</option>
                </select>
              </div>

              <div className="flex flex-col gap-0.5">
                <label className="text-slate-500">Alignment</label>
                <select
                  value={comp.style.textAlign || 'left'}
                  disabled={isLocked}
                  onChange={e => updateComponentStyle(comp.id, { textAlign: e.target.value as any })}
                  className={`w-full text-[9px] p-0.5 rounded border outline-none bg-[#101726]/60 ${
                    theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Colors Content Renderer
  const renderColorsContent = (comp: any, isLocked: boolean) => {
    const showAdv = showAdvanced.colors;
    return (
      <div className="space-y-1">
        <ColorPickerRow
          label="Bg Color"
          value={comp.style.backgroundColor?.startsWith('rgba') ? '#101726' : (comp.style.backgroundColor || '#000000')}
          disabled={isLocked}
          onChange={val => updateComponentStyle(comp.id, { backgroundColor: val })}
        />
        <ColorPickerRow
          label="Text Color"
          value={comp.style.color || '#ffffff'}
          disabled={isLocked}
          onChange={val => updateComponentStyle(comp.id, { color: val })}
        />

        <div className="pt-0.5">
          <button
            onClick={() => setShowAdvanced(prev => ({ ...prev, colors: !prev.colors }))}
            className="text-[8px] text-indigo-400 hover:underline flex items-center gap-0.5 font-bold"
          >
            {showAdv ? 'Hide Border' : 'Show Border'}
          </button>

          {showAdv && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-800/40 space-y-1">
              <ColorPickerRow
                label="Border Color"
                value={comp.style.borderColor || '#1e293b'}
                disabled={isLocked}
                onChange={val => updateComponentStyle(comp.id, { borderColor: val })}
              />
              <div className="flex flex-col gap-0.5">
                <label className="text-slate-500">Border Width</label>
                <input
                  type="text"
                  value={comp.style.borderWidth || '0px'}
                  disabled={isLocked}
                  onChange={e => updateComponentStyle(comp.id, { borderWidth: e.target.value })}
                  className={`w-full text-[9px] p-0.5 px-1 rounded border outline-none bg-black/25 ${
                    theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
                  }`}
                  placeholder="e.g. 1px"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-slate-500">Border Style</label>
                <select
                  value={comp.style.borderStyle || 'none'}
                  disabled={isLocked}
                  onChange={e => updateComponentStyle(comp.id, { borderStyle: e.target.value })}
                  className={`w-full text-[9px] p-0.5 rounded border outline-none bg-[#101726]/60 ${
                    theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="none">None</option>
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Effects & Spacing Content Renderer
  const renderEffectsContent = (comp: any, isLocked: boolean) => {
    const showAdv = showAdvanced.effects;
    return (
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-1">
          <div className="flex flex-col gap-0.5">
            <label className="text-slate-500">Padding</label>
            <input
              type="text"
              value={comp.style.padding || '0px'}
              disabled={isLocked}
              onChange={e => updateComponentStyle(comp.id, { padding: e.target.value })}
              className={`w-full text-[9px] p-0.5 px-1 rounded border outline-none bg-black/25 ${
                theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
              }`}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-slate-500">Radius</label>
            <input
              type="text"
              value={comp.style.borderRadius || '0px'}
              disabled={isLocked}
              onChange={e => updateComponentStyle(comp.id, { borderRadius: e.target.value })}
              className={`w-full text-[9px] p-0.5 px-1 rounded border outline-none bg-black/25 ${
                theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
              }`}
            />
          </div>
        </div>

        <div className="pt-0.5">
          <button
            onClick={() => setShowAdvanced(prev => ({ ...prev, effects: !prev.effects }))}
            className="text-[8px] text-indigo-400 hover:underline flex items-center gap-0.5 font-bold"
          >
            {showAdv ? 'Hide Spacing/Opacity' : 'Show Spacing/Opacity'}
          </button>

          {showAdv && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-800/40 space-y-1.5">
              <div className="flex flex-col gap-0.5">
                <label className="text-slate-500">Margin</label>
                <input
                  type="text"
                  value={comp.style.margin || '0px'}
                  disabled={isLocked}
                  onChange={e => updateComponentStyle(comp.id, { margin: e.target.value })}
                  className={`w-full text-[9px] p-0.5 px-1 rounded border outline-none bg-black/25 ${
                    theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center text-[8px] text-slate-500">
                  <span>Opacity</span>
                  <span className="font-mono">
                    {Math.round((comp.style.opacity !== undefined ? comp.style.opacity : 1) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={comp.style.opacity !== undefined ? comp.style.opacity : 1}
                  disabled={isLocked}
                  onChange={e => updateComponentStyle(comp.id, { opacity: parseFloat(e.target.value) })}
                  className="w-full cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none accent-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-0.5 mt-1 border-t border-slate-800/40 pt-1.5">
                <label className="text-slate-500">Box Shadow</label>
                <select
                  value={
                    ['none', 
                     '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                     '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                     '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                     '0 0 15px rgba(99, 102, 241, 0.4)',
                     '0 0 15px rgba(236, 72, 153, 0.4)',
                     'inset 0 2px 4px 0 rgba(0,0,0,0.06)'
                    ].includes(comp.style.boxShadow || 'none') ? (comp.style.boxShadow || 'none') : 'custom'
                  }
                  disabled={isLocked}
                  onChange={e => {
                    const val = e.target.value;
                    if (val !== 'custom') {
                      updateComponentStyle(comp.id, { boxShadow: val });
                    } else {
                      updateComponentStyle(comp.id, { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' });
                    }
                  }}
                  className={`w-full text-[9px] p-0.5 rounded border outline-none bg-[#101726]/60 ${
                    theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="none">None</option>
                  <option value="0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)">Small</option>
                  <option value="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)">Medium</option>
                  <option value="0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)">Large</option>
                  <option value="0 0 15px rgba(99, 102, 241, 0.4)">Indigo Glow</option>
                  <option value="0 0 15px rgba(236, 72, 153, 0.4)">Pink Glow</option>
                  <option value="inset 0 2px 4px 0 rgba(0,0,0,0.06)">Inner Shadow</option>
                  <option value="custom">Custom...</option>
                </select>
                {(comp.style.boxShadow && !['none', 
                     '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                     '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                     '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                     '0 0 15px rgba(99, 102, 241, 0.4)',
                     '0 0 15px rgba(236, 72, 153, 0.4)',
                     'inset 0 2px 4px 0 rgba(0,0,0,0.06)'
                ].includes(comp.style.boxShadow)) && (
                  <input
                    type="text"
                    value={comp.style.boxShadow}
                    disabled={isLocked}
                    onChange={e => updateComponentStyle(comp.id, { boxShadow: e.target.value })}
                    className={`w-full text-[9px] mt-1 p-0.5 px-1 rounded border outline-none bg-black/25 ${
                      theme === 'dark' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'
                    }`}
                    placeholder="e.g. 0 4px 6px rgba(0,0,0,0.1)"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Layers Tab Renderer
  const renderLayersTab = () => {
    const components = activePage ? activePage.components : [];
    
    if (components.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-3 mt-12 opacity-60 select-none">
          <Layers className="w-8 h-8 mb-2 text-indigo-500" />
          <h4 className="text-[10px] font-bold text-slate-400">No Layers</h4>
          <p className="text-[9px] text-slate-500 mt-1 max-w-[130px] leading-relaxed">
            Drag elements from components panel to start.
          </p>
        </div>
      );
    }

    const sortedComponents = [...components].sort((a, b) => b.position.zIndex - a.position.zIndex);

    return (
      <div className="space-y-1.5">
        <div className="text-[8px] uppercase font-bold text-slate-500 px-1 py-0.5 tracking-wider select-none">
          Layers ({components.length})
        </div>
        <div className="space-y-0.5">
          {sortedComponents.map(comp => {
            const isSelected = selectedComponentIds.includes(comp.id);
            const isLocked = comp.locked === true;
            const isVisible = comp.visible !== false;

            return (
              <div
                key={comp.id}
                draggable={!renamingLayerId}
                onDragStart={(e) => handleLayerDragStart(e, comp.id)}
                onDragOver={handleLayerDragOver}
                onDrop={(e) => handleLayerDrop(e, comp.id)}
                onClick={(e) => {
                  if (e.shiftKey || e.ctrlKey) {
                    const isAlreadySelected = selectedComponentIds.includes(comp.id);
                    let nextIds = [...selectedComponentIds];
                    if (isAlreadySelected) {
                      nextIds = nextIds.filter(id => id !== comp.id);
                    } else {
                      nextIds.push(comp.id);
                    }
                    setSelectionIds(nextIds);
                  } else {
                    setSelection(comp.id);
                  }
                }}
                className={`flex items-center justify-between p-1 rounded cursor-grab active:cursor-grabbing transition-all border ${
                  isSelected 
                    ? 'bg-indigo-500/15 border-indigo-500/40 text-white font-semibold' 
                    : theme === 'dark'
                      ? 'bg-[#101726]/30 border-slate-900/40 hover:bg-slate-800/20 text-slate-300'
                      : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100 text-slate-700'
                } ${draggedLayerId === comp.id ? 'opacity-40 border-dashed border-indigo-500' : ''}`}
              >
                {renamingLayerId === comp.id ? (
                  <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                    <input
                      type="text"
                      value={renameLayerValue}
                      onChange={e => setRenameLayerValue(e.target.value)}
                      className="bg-black/60 border border-indigo-500 rounded px-1.5 py-0.5 text-[9px] text-white flex-1 outline-none font-medium"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (renameLayerValue.trim()) {
                            updateComponentName(comp.id, renameLayerValue.trim());
                          }
                          setRenamingLayerId(null);
                        }
                        if (e.key === 'Escape') {
                          setRenamingLayerId(null);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <div 
                      className="flex items-center gap-1 min-w-0 flex-1 select-none"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setRenamingLayerId(comp.id);
                        setRenameLayerValue(comp.name);
                      }}
                    >
                      <span className="text-xs shrink-0">{comp.icon}</span>
                      <span className="truncate text-[9px] leading-none" title="Double click to rename">
                        {comp.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-0.5 shrink-0 pl-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setRenamingLayerId(comp.id);
                          setRenameLayerValue(comp.name);
                        }}
                        className="p-0.5 rounded hover:bg-slate-800/60 text-slate-400 hover:text-white"
                        title="Rename Layer"
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={() => toggleComponentVisibility(comp.id)}
                        className={`p-0.5 rounded hover:bg-slate-800/60 ${!isVisible ? 'text-red-400' : 'text-slate-400 hover:text-white'}`}
                        title={isVisible ? 'Hide' : 'Show'}
                      >
                        {isVisible ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                      </button>
                      <button
                        onClick={() => toggleComponentLock(comp.id)}
                        className={`p-0.5 rounded hover:bg-slate-800/60 ${isLocked ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                        title={isLocked ? 'Unlock' : 'Lock'}
                      >
                        {isLocked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete component "${comp.name}"?`)) {
                            deleteComponent(comp.id);
                          }
                        }}
                        className="p-0.5 rounded hover:bg-slate-800/60 text-slate-500 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // History Tab Renderer
  const renderHistoryTab = () => {
    const storeState = useBuilderStore.getState();
    const historyList = storeState.history;

    if (!historyList || historyList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-3 mt-12 opacity-60 select-none">
          <History className="w-8 h-8 mb-2 text-indigo-500" />
          <h4 className="text-[10px] font-bold text-slate-400">No History</h4>
          <p className="text-[9px] text-slate-500 mt-1 max-w-[130px] leading-relaxed">
            Changes you make on canvas will list here.
          </p>
        </div>
      );
    }

    const jumpToHistory = (index: number) => {
      const state = useBuilderStore.getState();
      const targetSnapshot = state.history[index];
      if (!targetSnapshot) return;
      
      const currentClone = JSON.parse(JSON.stringify(state.pages));
      
      useBuilderStore.setState({
        pages: targetSnapshot.pages,
        selectedComponentId: targetSnapshot.selectedComponentId,
        history: state.history.slice(0, index),
        redoHistory: [...state.redoHistory, { pages: currentClone, selectedComponentId: state.selectedComponentId }]
      });
    };

    return (
      <div className="space-y-1.5">
        <div className="text-[8px] uppercase font-bold text-slate-500 px-1 py-0.5 tracking-wider select-none">
          Action History ({historyList.length})
        </div>
        <div className="space-y-0.5 max-h-[350px] overflow-y-auto pr-1">
          {historyList.map((snapshot, idx) => {
            const pageSnapshot = snapshot.pages.find(p => p.id === activePageId);
            const compCount = pageSnapshot ? pageSnapshot.components.length : 0;
            return (
              <div
                key={idx}
                onClick={() => jumpToHistory(idx)}
                className={`p-1 text-[9px] rounded border cursor-pointer transition-colors flex items-center justify-between ${
                  theme === 'dark'
                    ? 'bg-[#101726]/30 border-slate-900/60 hover:bg-slate-800/40 text-slate-300 hover:text-white hover:border-slate-800'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="font-semibold select-none">Snapshot #{idx + 1}</span>
                <span className="text-[8px] bg-slate-800/50 text-indigo-400 px-1 py-0.2 rounded font-mono shrink-0 select-none">
                  {compCount} elements
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside 
      style={{ width: `${rightPanelWidth}px` }}
      className={`h-full flex flex-col border-l z-30 fixed top-14 right-0 select-none transition-all ${
        theme === 'dark' 
          ? 'bg-[#101726]/75 border-[#1e293b] text-[#f1f5f9] backdrop-blur-xl' 
          : 'bg-white/85 border-[#e2e8f0] text-[#0f172a] backdrop-blur-xl'
      }`}
    >
      {/* Resizable Divider Left Edge */}
      <div 
        onMouseDown={handleResizeStart}
        className="absolute top-0 left-0 bottom-0 w-1 hover:w-1.5 cursor-ew-resize bg-transparent hover:bg-indigo-500/50 z-40 transition-colors"
      />

      {/* Tabs Header Row & Collapse Trigger */}
      <div className="flex items-center justify-between border-b border-inherit px-1 py-1 bg-black/10">
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setActiveTab('properties')}
            className={`p-1 rounded text-[9px] transition-colors flex items-center gap-1 ${
              activeTab === 'properties'
                ? 'bg-indigo-500/15 text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Properties"
          >
            <Sliders className="w-3 h-3" />
            <span>Props</span>
          </button>
          <button
            onClick={() => setActiveTab('layers')}
            className={`p-1 rounded text-[9px] transition-colors flex items-center gap-1 ${
              activeTab === 'layers'
                ? 'bg-indigo-500/15 text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Layers"
          >
            <Layers className="w-3 h-3" />
            <span>Layers</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`p-1 rounded text-[9px] transition-colors flex items-center gap-1 ${
              activeTab === 'history'
                ? 'bg-indigo-500/15 text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="History"
          >
            <History className="w-3 h-3" />
            <span>Hist</span>
          </button>
        </div>
        <button
          onClick={() => setRightPanelCollapsed(true)}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/40"
          title="Collapse Panel"
        >
          <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
        </button>
      </div>

      {/* Tab Panels Contents */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1.5 pb-24">
        {activeTab === 'properties' && renderPropertiesTab()}
        {activeTab === 'layers' && renderLayersTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </div>
    </aside>
  );
};
