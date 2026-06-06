import { create } from 'zustand';

export interface ComponentStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  opacity?: number;
  [key: string]: any;
}

export interface ComponentPosition {
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
  zIndex: number;
}

export interface BuilderComponent {
  id: string;
  type: string;
  name: string;
  category: string;
  icon: string;
  content: {
    text?: string;
    html?: string;
    src?: string;
    label?: string;
    [key: string]: any;
  };
  style: ComponentStyle;
  position: ComponentPosition;
  locked?: boolean;
  visible?: boolean;
}

export interface Page {
  id: string;
  name: string;
  components: BuilderComponent[];
}

interface HistorySnapshot {
  pages: Page[];
  selectedComponentId: string | null;
}

interface BuilderState {
  pages: Page[];
  activePageId: string;
  activeMode: 'canva' | 'sections';
  selectedComponentId: string | null;
  zoom: number;
  viewport: 'desktop' | 'tablet' | 'mobile';
  theme: 'dark' | 'light';
  history: HistorySnapshot[];
  redoHistory: HistorySnapshot[];
  
  // Actions
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  
  // Pages Management
  addPage: (name: string) => boolean;
  deletePage: (id: string) => boolean;
  duplicatePage: (id: string) => void;
  renamePage: (id: string, name: string) => void;
  setPages: (pages: Page[]) => void;
  setActivePageId: (id: string) => void;
  
  // Component Actions
  addComponent: (schema: Omit<BuilderComponent, 'id'>) => void;
  updateComponentStyle: (id: string, style: Partial<ComponentStyle>) => void;
  updateComponentPosition: (id: string, position: Partial<ComponentPosition>) => void;
  updateComponentContent: (id: string, content: Record<string, any>) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  toggleComponentLock: (id: string) => void;
  toggleComponentVisibility: (id: string) => void;
  moveComponentOrder: (id: string, direction: number) => void;
  
  // UI States
  setSelection: (id: string | null) => void;
  setMode: (mode: 'canva' | 'sections') => void;
  setZoom: (zoom: number) => void;
  setViewport: (viewport: 'desktop' | 'tablet' | 'mobile') => void;
  toggleTheme: () => void;
  clearCanvas: () => void;
  rightPanelWidth: number;
  rightPanelCollapsed: boolean;
  setRightPanelWidth: (width: number) => void;
  setRightPanelCollapsed: (collapsed: boolean) => void;
  leftPanelExpanded: boolean;
  setLeftPanelExpanded: (expanded: boolean) => void;
}

const initialPages: Page[] = [
  {
    id: 'home',
    name: 'Home Page',
    components: [
      {
        id: 'hero-1',
        type: 'hero-section',
        name: 'Hero Section',
        category: 'marketing',
        icon: '⚡',
        content: {
          title: 'Design at the Speed of Thought',
          subtitle: 'Create responsive, professional websites with GenovaX AI UI Builder. Edit inline, drag elements, and publish instantly.',
          btnText: 'Start Building'
        },
        style: {
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          color: '#ffffff',
          borderColor: '#1e293b',
          borderRadius: '16px',
          padding: '24px',
          borderStyle: 'solid',
          borderWidth: '1px'
        },
        position: {
          left: 50,
          top: 60,
          width: 900,
          height: 380,
          rotate: 0,
          zIndex: 1
        }
      },
      {
        id: 'heading-1',
        type: 'heading',
        name: 'Main Heading',
        category: 'content',
        icon: '🔤',
        content: { text: '⚡ AI-Powered Canvas Editor' },
        style: {
          fontFamily: "'Outfit', sans-serif",
          fontSize: '32px',
          fontWeight: '800',
          color: '#818cf8',
          textAlign: 'center'
        },
        position: {
          left: 200,
          top: 480,
          width: 600,
          height: 50,
          rotate: 0,
          zIndex: 2
        }
      },
      {
        id: 'paragraph-1',
        type: 'paragraph',
        name: 'Subtext Paragraph',
        category: 'content',
        icon: '📝',
        content: { text: 'GenovaX enables pixel-perfect alignment guides, snap-to-grid accuracy, responsive canvas ratios, and Figma-style nested absolute positioning.' },
        style: {
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          fontWeight: '400',
          color: '#94a3b8',
          textAlign: 'center'
        },
        position: {
          left: 250,
          top: 540,
          width: 500,
          height: 70,
          rotate: 0,
          zIndex: 3
        }
      },
      {
        id: 'btn-cta',
        type: 'primary-button',
        name: 'CTA Button',
        category: 'buttons',
        icon: '🔘',
        content: { label: 'Explore Features 🚀' },
        style: {
          backgroundColor: '#6366f1',
          color: '#ffffff',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          padding: '10px 20px',
          textAlign: 'center'
        },
        position: {
          left: 410,
          top: 630,
          width: 180,
          height: 42,
          rotate: 0,
          zIndex: 4
        }
      }
    ]
  }
];

export const useBuilderStore = create<BuilderState>((set, get) => ({
  pages: initialPages,
  activePageId: 'home',
  activeMode: 'canva',
  selectedComponentId: null,
  zoom: 100,
  viewport: 'desktop',
  theme: 'dark',
  history: [],
  redoHistory: [],
  rightPanelWidth: 180,
  rightPanelCollapsed: false,
  leftPanelExpanded: false,

  saveToHistory: () => {
    const { pages, selectedComponentId } = get();
    // Deep clone pages
    const pagesClone = JSON.parse(JSON.stringify(pages));
    set((state) => ({
      history: [...state.history, { pages: pagesClone, selectedComponentId }],
      redoHistory: [] // Clear redo stack on new action
    }));
  },

  undo: () => {
    const { history, pages, selectedComponentId } = get();
    if (history.length === 0) return;
    
    const prevSnapshot = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    
    // Save current state for redo
    const currentClone = JSON.parse(JSON.stringify(pages));
    
    set({
      pages: prevSnapshot.pages,
      selectedComponentId: prevSnapshot.selectedComponentId,
      history: newHistory,
      redoHistory: [...get().redoHistory, { pages: currentClone, selectedComponentId }]
    });
  },

  redo: () => {
    const { redoHistory, pages, selectedComponentId } = get();
    if (redoHistory.length === 0) return;
    
    const nextSnapshot = redoHistory[redoHistory.length - 1];
    const newRedoHistory = redoHistory.slice(0, -1);
    
    // Save current state for undo
    const currentClone = JSON.parse(JSON.stringify(pages));
    
    set({
      pages: nextSnapshot.pages,
      selectedComponentId: nextSnapshot.selectedComponentId,
      redoHistory: newRedoHistory,
      history: [...get().history, { pages: currentClone, selectedComponentId }]
    });
  },

  addPage: (name) => {
    const id = name.trim().toLowerCase().replace(/\s+/g, '-');
    if (!id) return false;
    
    const exists = get().pages.some(p => p.id === id);
    if (exists) return false;
    
    get().saveToHistory();
    const newPage: Page = { id, name: name.trim(), components: [] };
    set(state => ({
      pages: [...state.pages, newPage],
      activePageId: id
    }));
    return true;
  },

  deletePage: (id) => {
    if (get().pages.length <= 1) return false;
    
    get().saveToHistory();
    const newPages = get().pages.filter(p => p.id !== id);
    const fallbackActive = get().activePageId === id ? newPages[0].id : get().activePageId;
    
    set({
      pages: newPages,
      activePageId: fallbackActive,
      selectedComponentId: null
    });
    return true;
  },

  duplicatePage: (id) => {
    const sourcePage = get().pages.find(p => p.id === id);
    if (!sourcePage) return;
    
    get().saveToHistory();
    const newId = `${id}-copy-${Date.now().toString().slice(-4)}`;
    const newName = `${sourcePage.name} (Copy)`;
    
    // Clone components list
    const componentsClone = JSON.parse(JSON.stringify(sourcePage.components));
    // Assign new IDs
    componentsClone.forEach((c: BuilderComponent) => {
      c.id = `${c.type}-${Math.random().toString(36).substr(2, 9)}`;
    });
    
    const duplicatedPage: Page = {
      id: newId,
      name: newName,
      components: componentsClone
    };
    
    set(state => ({
      pages: [...state.pages, duplicatedPage],
      activePageId: newId
    }));
  },

  renamePage: (id, name) => {
    get().saveToHistory();
    set(state => ({
      pages: state.pages.map(p => p.id === id ? { ...p, name: name.trim() } : p)
    }));
  },

  setPages: (pages) => {
    get().saveToHistory();
    set({ pages });
  },

  setActivePageId: (activePageId) => {
    set({ activePageId, selectedComponentId: null });
  },

  addComponent: (schema) => {
    get().saveToHistory();
    const newComponent: BuilderComponent = {
      ...schema,
      id: `${schema.type}-${Math.random().toString(36).substring(2, 9)}`,
    };
    
    set(state => ({
      pages: state.pages.map(page => {
        if (page.id !== state.activePageId) return page;
        return {
          ...page,
          components: [...page.components, newComponent]
        };
      }),
      selectedComponentId: newComponent.id
    }));
  },

  updateComponentStyle: (id, styleUpdates) => {
    // Avoid full history snapshots on tiny inputs (e.g. typing colors), save only key changes or let caller handle it.
    // In our case we just update values, and verify selection
    set(state => ({
      pages: state.pages.map(page => {
        if (page.id !== state.activePageId) return page;
        return {
          ...page,
          components: page.components.map(c => 
            c.id === id ? { ...c, style: { ...c.style, ...styleUpdates } } : c
          )
        };
      })
    }));
  },

  updateComponentPosition: (id, positionUpdates) => {
    set(state => ({
      pages: state.pages.map(page => {
        if (page.id !== state.activePageId) return page;
        return {
          ...page,
          components: page.components.map(c => 
            c.id === id ? { ...c, position: { ...c.position, ...positionUpdates } } : c
          )
        };
      })
    }));
  },

  updateComponentContent: (id, contentUpdates) => {
    set(state => ({
      pages: state.pages.map(page => {
        if (page.id !== state.activePageId) return page;
        return {
          ...page,
          components: page.components.map(c => 
            c.id === id ? { ...c, content: { ...c.content, ...contentUpdates } } : c
          )
        };
      })
    }));
  },

  deleteComponent: (id) => {
    get().saveToHistory();
    set(state => ({
      pages: state.pages.map(page => {
        if (page.id !== state.activePageId) return page;
        return {
          ...page,
          components: page.components.filter(c => c.id !== id)
        };
      }),
      selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId
    }));
  },

  duplicateComponent: (id) => {
    get().saveToHistory();
    const page = get().pages.find(p => p.id === get().activePageId);
    if (!page) return;
    
    const comp = page.components.find(c => c.id === id);
    if (!comp) return;
    
    const copyComp: BuilderComponent = JSON.parse(JSON.stringify(comp));
    copyComp.id = `${comp.type}-${Math.random().toString(36).substr(2, 9)}`;
    copyComp.name = `${comp.name} Copy`;
    copyComp.position.left += 20; // offset slightly
    copyComp.position.top += 20;
    
    set(state => ({
      pages: state.pages.map(p => {
        if (p.id !== state.activePageId) return p;
        return { ...p, components: [...p.components, copyComp] };
      }),
      selectedComponentId: copyComp.id
    }));
  },

  toggleComponentLock: (id) => {
    set(state => ({
      pages: state.pages.map(page => {
        if (page.id !== state.activePageId) return page;
        return {
          ...page,
          components: page.components.map(c => 
            c.id === id ? { ...c, locked: !c.locked } : c
          )
        };
      })
    }));
  },

  toggleComponentVisibility: (id) => {
    set(state => ({
      pages: state.pages.map(page => {
        if (page.id !== state.activePageId) return page;
        return {
          ...page,
          components: page.components.map(c => 
            c.id === id ? { ...c, visible: c.visible === false ? true : false } : c
          )
        };
      })
    }));
  },

  moveComponentOrder: (id, direction) => {
    get().saveToHistory();
    set(state => ({
      pages: state.pages.map(page => {
        if (page.id !== state.activePageId) return page;
        const comps = [...page.components];
        const index = comps.findIndex(c => c.id === id);
        if (index === -1) return page;
        
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= comps.length) return page;
        
        // Swap
        const temp = comps[index];
        comps[index] = comps[newIndex];
        comps[newIndex] = temp;
        
        return {
          ...page,
          components: comps
        };
      })
    }));
  },

  setSelection: (selectedComponentId) => {
    set({ selectedComponentId });
  },

  setMode: (activeMode) => {
    set({ activeMode });
  },

  setZoom: (zoom) => {
    set({ zoom: Math.max(50, Math.min(150, zoom)) });
  },

  setViewport: (viewport) => {
    set({ viewport });
  },

  toggleTheme: () => {
    set(state => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      const root = window.document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      return { theme: newTheme };
    });
  },

  clearCanvas: () => {
    get().saveToHistory();
    set(state => ({
      pages: state.pages.map(page => 
        page.id === state.activePageId ? { ...page, components: [] } : page
      ),
      selectedComponentId: null
    }));
  },

  setRightPanelWidth: (rightPanelWidth) => {
    set({ rightPanelWidth });
  },

  setRightPanelCollapsed: (rightPanelCollapsed) => {
    set({ rightPanelCollapsed });
  },

  setLeftPanelExpanded: (leftPanelExpanded) => {
    set({ leftPanelExpanded });
  }
}));
