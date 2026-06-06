import React, { useRef, useState, useEffect } from 'react';
import { useBuilderStore, BuilderComponent } from '../store/useBuilderStore';
import { COMPONENT_SCHEMAS } from '../store/schemas';
import { RefreshCw, Trash2, Copy, Lock } from 'lucide-react';

export const CanvasWorkspace: React.FC = () => {
  const { 
    pages, 
    activePageId, 
    selectedComponentId, 
    setSelection,
    updateComponentPosition,
    updateComponentContent,
    duplicateComponent,
    deleteComponent,
    addComponent,
    zoom,
    setZoom,
    viewport,
    theme,
    rightPanelWidth,
    rightPanelCollapsed
  } = useBuilderStore();

  const activePage = pages.find(p => p.id === activePageId);
  const components = activePage ? activePage.components : [];

  const canvasRef = useRef<HTMLDivElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  // Dragging states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, left: 0, top: 0 });
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Resizing states
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 });
  const [activeResizeId, setActiveResizeId] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  // Rotation states
  const [isRotating, setIsRotating] = useState(false);
  const [rotateStart, setRotateStart] = useState({ centerX: 0, centerY: 0, startAngle: 0, currentAngle: 0 });
  const [activeRotateId, setActiveRotateId] = useState<string | null>(null);

  // Text Inline Editing states
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextVal, setEditingTextVal] = useState('');

  // Drop handler for Left Panel drag-and-drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const componentType = e.dataTransfer.getData('text/plain');
    const schema = COMPONENT_SCHEMAS[componentType];
    if (!schema) return;

    const rect = canvasRef.current.getBoundingClientRect();
    // Calculate drop position relative to canvas, adjusting for zoom
    const zoomScale = zoom / 100;
    const dropX = Math.round((e.clientX - rect.left) / zoomScale - schema.defaultPosition.width / 2);
    const dropY = Math.round((e.clientY - rect.top) / zoomScale - schema.defaultPosition.height / 2);

    // Apply grid snap
    const snapX = Math.round(dropX / 10) * 10;
    const snapY = Math.round(dropY / 10) * 10;

    addComponent({
      type: schema.type,
      name: schema.name,
      category: schema.category,
      icon: schema.icon,
      content: { ...schema.defaultContent },
      style: { ...schema.defaultStyle },
      position: {
        left: Math.max(0, snapX),
        top: Math.max(0, snapY),
        width: schema.defaultPosition.width,
        height: schema.defaultPosition.height,
        rotate: 0,
        zIndex: components.length + 1
      }
    });
  };

  // Mouse Move Master Handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const zoomScale = zoom / 100;

      // 1. Handle element dragging
      if (isDragging && activeDragId) {
        const comp = components.find(c => c.id === activeDragId);
        if (!comp || comp.locked) return;

        const dx = (e.clientX - dragStart.x) / zoomScale;
        const dy = (e.clientY - dragStart.y) / zoomScale;

        let newLeft = dragStart.left + dx;
        let newTop = dragStart.top + dy;

        // Snap to 10px grid
        newLeft = Math.round(newLeft / 10) * 10;
        newTop = Math.round(newTop / 10) * 10;

        updateComponentPosition(activeDragId, {
          left: Math.max(0, newLeft),
          top: Math.max(0, newTop)
        });
      }

      // 2. Handle element resizing
      if (isResizing && activeResizeId && resizeHandle) {
        const comp = components.find(c => c.id === activeResizeId);
        if (!comp || comp.locked) return;

        const dx = (e.clientX - resizeStart.x) / zoomScale;
        const dy = (e.clientY - resizeStart.y) / zoomScale;

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newLeft = resizeStart.left;
        let newTop = resizeStart.top;

        if (resizeHandle.includes('e')) newWidth = Math.max(30, Math.round((resizeStart.width + dx) / 10) * 10);
        if (resizeHandle.includes('s')) newHeight = Math.max(20, Math.round((resizeStart.height + dy) / 10) * 10);
        if (resizeHandle.includes('w')) {
          const wDiff = Math.round(dx / 10) * 10;
          newWidth = Math.max(30, resizeStart.width - wDiff);
          if (newWidth > 30) newLeft = resizeStart.left + wDiff;
        }
        if (resizeHandle.includes('n')) {
          const hDiff = Math.round(dy / 10) * 10;
          newHeight = Math.max(20, resizeStart.height - hDiff);
          if (newHeight > 20) newTop = resizeStart.top + hDiff;
        }

        updateComponentPosition(activeResizeId, {
          width: newWidth,
          height: newHeight,
          left: newLeft,
          top: newTop
        });
      }

      // 3. Handle element rotating
      if (isRotating && activeRotateId) {
        const comp = components.find(c => c.id === activeRotateId);
        if (!comp || comp.locked) return;

        const dx = e.clientX - rotateStart.centerX;
        const dy = e.clientY - rotateStart.centerY;
        
        let angle = Math.atan2(dy, dx) * (180 / Math.PI) - 90; // offset by 90 to align upright
        
        // Snapping: if Shift key is held, snap to 15 degree increments
        if (e.shiftKey) {
          angle = Math.round(angle / 15) * 15;
        } else {
          angle = Math.round(angle);
        }

        if (angle < 0) angle += 360;

        updateComponentPosition(activeRotateId, { rotate: angle });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setActiveDragId(null);
      setIsResizing(false);
      setActiveResizeId(null);
      setResizeHandle(null);
      setIsRotating(false);
      setActiveRotateId(null);
    };

    if (isDragging || isResizing || isRotating) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, activeDragId, dragStart, isResizing, activeResizeId, resizeHandle, resizeStart, isRotating, activeRotateId, rotateStart, components, zoom]);

  const handleElementMouseDown = (e: React.MouseEvent, comp: BuilderComponent) => {
    if (comp.locked) return;
    if (editingTextId === comp.id) return;
    
    // Check if clicked buttons or inputs inside element
    const target = e.target as HTMLElement;
    if (target.closest('.resize-handle') || target.closest('.rotate-handle') || target.closest('.action-btn')) {
      return; 
    }

    e.stopPropagation();
    setSelection(comp.id);
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      left: comp.position.left,
      top: comp.position.top
    });
    setActiveDragId(comp.id);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, comp: BuilderComponent, handle: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: comp.position.width,
      height: comp.position.height,
      left: comp.position.left,
      top: comp.position.top
    });
    setActiveResizeId(comp.id);
  };

  const handleRotateMouseDown = (e: React.MouseEvent, comp: BuilderComponent) => {
    e.stopPropagation();
    setIsRotating(true);
    setActiveRotateId(comp.id);

    // Calculate center of target element
    const el = document.getElementById(`comp-wrapper-${comp.id}`);
    if (el) {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const startAngle = Math.atan2(dy, dx) * (180 / Math.PI);

      setRotateStart({
        centerX,
        centerY,
        startAngle,
        currentAngle: comp.position.rotate || 0
      });
    }
  };

  const handleDoubleClick = (e: React.MouseEvent, comp: BuilderComponent) => {
    e.stopPropagation();
    if (comp.locked) return;
    if (comp.content.text !== undefined) {
      setEditingTextId(comp.id);
      setEditingTextVal(comp.content.text || '');
    } else if (comp.content.label !== undefined) {
      setEditingTextId(comp.id);
      setEditingTextVal(comp.content.label || '');
    }
  };

  const handleSaveTextEdit = () => {
    if (!editingTextId) return;
    const comp = components.find(c => c.id === editingTextId);
    if (comp) {
      if (comp.content.text !== undefined) {
        updateComponentContent(editingTextId, { text: editingTextVal });
      } else if (comp.content.label !== undefined) {
        updateComponentContent(editingTextId, { label: editingTextVal });
      }
    }
    setEditingTextId(null);
  };

  // Viewport Width Mapping
  const getViewportWidth = () => {
    if (viewport === 'tablet') return 'w-[768px] border-x border-[#1e293b]';
    if (viewport === 'mobile') return 'w-[375px] border-x border-[#1e293b]';
    return 'w-[1000px] border border-[#1e293b] rounded-lg'; // expanded to 1000px
  };

  // Zoom Styles
  const getZoomStyle = () => {
    return {
      transform: `scale(${zoom / 100})`,
      transformOrigin: 'top center'
    };
  };

  const handleFitScreen = () => {
    if (!zoomContainerRef.current) return;
    const containerWidth = zoomContainerRef.current.clientWidth - 80;
    const canvasWidth = viewport === 'desktop' ? 1000 : (viewport === 'tablet' ? 768 : 375);
    const scale = (containerWidth / canvasWidth) * 100;
    setZoom(Math.max(50, Math.min(150, Math.round(scale))));
  };

  // Pixel ticks rendering for horizontal and vertical rulers
  const renderRulerTicksX = () => {
    const ticks = [];
    for (let i = 0; i < 2000; i += 50) {
      ticks.push(
        <div 
          key={i} 
          className="absolute top-0 text-[8px] text-slate-500 font-semibold border-l border-slate-800 h-full pl-0.5 select-none" 
          style={{ left: `${i}px` }}
        >
          {i % 100 === 0 ? i : ''}
        </div>
      );
    }
    return ticks;
  };

  const renderRulerTicksY = () => {
    const ticks = [];
    for (let i = 0; i < 2000; i += 50) {
      ticks.push(
        <div 
          key={i} 
          className="absolute left-0 text-[8px] text-slate-500 font-semibold border-t border-slate-800 w-full pt-0.5 pl-0.5 select-none" 
          style={{ top: `${i}px` }}
        >
          {i % 100 === 0 ? i : ''}
        </div>
      );
    }
    return ticks;
  };

  return (
    <main 
      style={{
        paddingRight: rightPanelCollapsed ? '0px' : `${rightPanelWidth}px`
      }}
      className={`flex-1 h-full flex flex-col relative overflow-hidden transition-all pt-14 pl-[220px] ${
        theme === 'dark' ? 'bg-[#0f1118]' : 'bg-[#f1f5f9]'
      }`}
    >
      {/* 1. Figma rulers (absolute elements inside viewport) */}
      <div 
        style={{
          right: rightPanelCollapsed ? '0px' : `${rightPanelWidth}px`
        }}
        className="absolute top-14 left-[220px] h-5 border-b border-border-dark bg-[#090d16] z-25 overflow-hidden select-none"
      >
        {/* Rulers corner cover */}
        <div className="absolute top-0 left-0 w-5 h-5 bg-[#090d16] border-r border-border-dark z-30"></div>
        {/* Ticks X */}
        <div className="absolute top-0 left-5 right-0 h-full relative" style={{ transform: `translateX(-${zoomContainerRef.current?.scrollLeft || 0}px)` }}>
          {renderRulerTicksX()}
        </div>
      </div>
      <div className="absolute top-[76px] left-[220px] bottom-10 w-5 border-r border-border-dark bg-[#090d16] z-25 overflow-hidden select-none">
        {/* Ticks Y */}
        <div className="absolute top-0 left-0 bottom-0 w-full relative" style={{ transform: `translateY(-${zoomContainerRef.current?.scrollTop || 0}px)` }}>
          {renderRulerTicksY()}
        </div>
      </div>

      {/* Zoom / Canvas container */}
      <div 
        ref={zoomContainerRef}
        className="flex-1 overflow-auto mt-5 ml-5 p-10 flex justify-center items-start"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div 
          className={`relative min-h-[1400px] shadow-2xl transition-all duration-300 ${getViewportWidth()} ${
            theme === 'dark' 
              ? 'bg-[#090d16] grid-bg-overlay' 
              : 'bg-white grid-bg-overlay-light'
          }`}
          style={getZoomStyle()}
          ref={canvasRef}
          onClick={() => {
            setSelection(null);
          }}
        >
          {/* Render component layer nodes */}
          {components.map((comp) => {
            const isSelected = selectedComponentId === comp.id;
            const isCompLocked = comp.locked === true;
            const isCompVisible = comp.visible !== false;

            if (!isCompVisible) return null;

            return (
              <div
                key={comp.id}
                id={`comp-wrapper-${comp.id}`}
                onMouseDown={(e) => handleElementMouseDown(e, comp)}
                onDoubleClick={(e) => handleDoubleClick(e, comp)}
                style={{
                  position: 'absolute',
                  left: `${comp.position.left}px`,
                  top: `${comp.position.top}px`,
                  width: `${comp.position.width}px`,
                  height: `${comp.position.height}px`,
                  transform: `rotate(${comp.position.rotate || 0}deg)`,
                  zIndex: comp.position.zIndex,
                  cursor: isCompLocked ? 'not-allowed' : 'grab'
                }}
                className={`group ${
                  isSelected ? 'ring-1.5 ring-indigo-500' : 'hover:ring-1 hover:ring-indigo-500/40'
                }`}
              >
                {/* Element Inner Content Renderer */}
                <div 
                  className="w-full h-full overflow-hidden relative select-text"
                  style={{
                    ...comp.style,
                    backgroundColor: comp.style.backgroundColor || 'transparent'
                  }}
                >
                  {/* Inline Text Editor Overlay */}
                  {editingTextId === comp.id ? (
                    <div className="absolute inset-0 z-40 bg-black/60 p-2 flex items-center justify-center" onClick={e => e.stopPropagation()}>
                      <textarea
                        value={editingTextVal}
                        onChange={e => setEditingTextVal(e.target.value)}
                        className="w-full h-full p-2 bg-[#090d16] border border-indigo-500 rounded text-xs text-white outline-none resize-none"
                        autoFocus
                        onBlur={handleSaveTextEdit}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSaveTextEdit();
                          }
                        }}
                      />
                    </div>
                  ) : null}

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

                {/* Selection Outlines and resize/rotate handles */}
                {isSelected && !isCompLocked && (
                  <>
                    {/* Corners resizing handles */}
                    <div onMouseDown={e => handleResizeMouseDown(e, comp, 'nw')} className="resize-handle absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-indigo-600 rounded-sm cursor-nwse-resize z-50"></div>
                    <div onMouseDown={e => handleResizeMouseDown(e, comp, 'ne')} className="resize-handle absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-indigo-600 rounded-sm cursor-nesw-resize z-50"></div>
                    <div onMouseDown={e => handleResizeMouseDown(e, comp, 'sw')} className="resize-handle absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-indigo-600 rounded-sm cursor-nesw-resize z-50"></div>
                    <div onMouseDown={e => handleResizeMouseDown(e, comp, 'se')} className="resize-handle absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-indigo-600 rounded-sm cursor-nwse-resize z-50"></div>
                    
                    {/* Side resizing handles */}
                    <div onMouseDown={e => handleResizeMouseDown(e, comp, 'e')} className="resize-handle absolute top-1/2 -right-1 w-2 h-4 -translate-y-1/2 bg-white border border-indigo-600 rounded-sm cursor-ew-resize z-50"></div>
                    <div onMouseDown={e => handleResizeMouseDown(e, comp, 's')} className="resize-handle absolute -bottom-1 left-1/2 w-4 h-2 -translate-x-1/2 bg-white border border-indigo-600 rounded-sm cursor-ns-resize z-50"></div>

                    {/* Rotation Lollipop Handle */}
                    <div 
                      onMouseDown={e => handleRotateMouseDown(e, comp)} 
                      className="rotate-handle absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer z-50"
                      title="Drag to rotate (Shift snaps 15°)"
                    >
                      <div className="w-3 h-3 bg-white border border-indigo-600 rounded-full flex items-center justify-center">
                        <RefreshCw className="w-2.5 h-2.5 text-indigo-600" />
                      </div>
                      <div className="w-0.5 h-5 bg-indigo-600"></div>
                    </div>

                    {/* Small Quick Actions Bar */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#101726] border border-border-dark px-1.5 py-0.5 rounded shadow-lg flex items-center gap-1.5 z-40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); duplicateComponent(comp.id); }} 
                        className="action-btn text-slate-400 hover:text-white p-0.5" 
                        title="Duplicate"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteComponent(comp.id); }} 
                        className="action-btn text-slate-400 hover:text-red-400 p-0.5" 
                        title="Delete"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </>
                )}

                {/* Locked indicators */}
                {isSelected && isCompLocked && (
                  <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full shadow z-40">
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer zoom controls */}
      <footer className={`h-10 w-full border-t flex items-center justify-between px-4 text-xs z-30 select-none ${
        theme === 'dark' ? 'bg-[#101726]/85 border-[#1e293b]' : 'bg-white border-[#e2e8f0]'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold text-[10px]">Zoom:</span>
            <select
              value={['50', '75', '100', '125', '150'].includes(zoom.toString()) ? zoom.toString() : 'custom'}
              onChange={e => {
                const val = e.target.value;
                if (val === 'fit') {
                  handleFitScreen();
                } else if (val !== 'custom') {
                  setZoom(parseInt(val));
                }
              }}
              className={`text-[10px] font-bold py-0.5 px-1.5 rounded border border-border-dark outline-none bg-black/35 ${
                theme === 'dark' ? 'text-white border-slate-800' : 'text-slate-800 border-slate-200'
              }`}
            >
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="100">100%</option>
              <option value="125">125%</option>
              <option value="150">150%</option>
              <option value="fit">Fit Screen</option>
              {!['50', '75', '100', '125', '150'].includes(zoom.toString()) && (
                <option value="custom">{zoom}%</option>
              )}
            </select>
          </div>
          <button 
            onClick={() => setZoom(100)}
            className="text-[10px] text-indigo-400 font-semibold hover:underline"
          >
            100% Reset
          </button>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-slate-500">
          <span>📐 Drag edges to resize</span>
          <span>💡 Double click text to edit</span>
          <span>🔄 Shift + Drag rotation snaps to 15°</span>
        </div>
      </footer>
    </main>
  );
};
