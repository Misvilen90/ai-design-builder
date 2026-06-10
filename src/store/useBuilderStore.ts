import { create } from 'zustand';
import { TEMPLATES_LIST } from './templatesData';


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
  activePageId: string;
}

export interface SavedProject {
  id: string;
  name: string;
  pages: Page[];
  createdAt: string;
  updatedAt: string;
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
  
  // Projects Management
  projects: SavedProject[];
  activeProjectId: string | null;
  loadProject: (id: string) => void;
  saveCurrentProject: (name?: string) => void;
  deleteProject: (id: string) => void;
  createNewProject: (name: string) => void;
  updateComponentName: (id: string, name: string) => void;
  
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
  selectedComponentIds: string[];
  setSelectionIds: (ids: string[]) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  reorderComponents: (draggedId: string, targetId: string) => void;
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
  leftPanelTab: 'components' | 'media' | 'theme' | 'pages' | 'settings';
  setLeftPanelTab: (tab: 'components' | 'media' | 'theme' | 'pages' | 'settings') => void;
  globalTheme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    fontSizePreset: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    borderRadius: string;
    boxShadow: string;
    buttonStyle: Record<string, any>;
    cardStyle: Record<string, any>;
    sectionSpacing: string;
  };
  updateGlobalTheme: (theme: Partial<BuilderState['globalTheme']>) => void;
  mediaAssets: Array<{ id: string; type: 'image' | 'video'; name: string; url: string }>;
  addMediaAsset: (asset: { type: 'image' | 'video'; name: string; url: string }) => void;
  deleteMediaAsset: (id: string) => void;
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
          subtitle: 'Create responsive, professional websites with GenovaX. Edit inline, drag elements, and publish instantly.',
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

export const useBuilderStore = create<BuilderState>((set, get) => {
  const defaultProjects: SavedProject[] = TEMPLATES_LIST.map((t, idx) => ({
    id: t.id,
    name: t.name,
    createdAt: new Date(Date.now() - (4 - idx) * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - (4 - idx) * 12 * 3600 * 1000).toISOString(),
    pages: [
      {
        id: 'home',
        name: 'Home Page',
        components: t.components
      }
    ]
  }));

  const getInitialProjects = (): SavedProject[] => {
    const local = localStorage.getItem('genovax_projects_list');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse projects list from LocalStorage:', e);
      }
    }
    return defaultProjects;
  };

  const initialProjs = getInitialProjects();

  return {
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
    selectedComponentIds: [],
    snapToGrid: true,
    projects: initialProjs,
    activeProjectId: initialProjs[0]?.id || null,
    leftPanelTab: 'components',
    globalTheme: {
      primaryColor: '#6366f1',
      secondaryColor: '#475569',
      accentColor: '#818cf8',
      backgroundColor: '#090d16',
      textColor: '#f8fafc',
      fontFamily: "'Inter', sans-serif",
      fontSizePreset: 'md',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
      buttonStyle: { backgroundColor: '#6366f1', color: '#ffffff', borderRadius: '6px' },
      cardStyle: { backgroundColor: 'rgba(16, 23, 38, 0.4)', borderColor: '#1e293b', borderWidth: '1px' },
      sectionSpacing: '24px'
    },
    mediaAssets: [
      { id: 'm-1', type: 'image', name: 'Dashboard Design Preview', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80' },
      { id: 'm-2', type: 'image', name: 'MacBook Workspace Desk', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80' },
      { id: 'm-3', type: 'image', name: 'Modern Coding Screen', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80' },
      { id: 'm-4', type: 'image', name: 'Creative Abstract Shapes', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80' },
      { id: 'm-5', type: 'video', name: 'Nature Forest Video Loop', url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4' }
    ],


  saveToHistory: () => {
    const { pages, selectedComponentId, activePageId } = get();

const snapshot: HistorySnapshot = {
  pages: JSON.parse(JSON.stringify(pages)),
  selectedComponentId,
  activePageId,
};

set((state) => ({
  history: [...state.history, snapshot],
  redoHistory: [],
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
      activePageId: prevSnapshot.activePageId,
      pages: prevSnapshot.pages,
      selectedComponentId: prevSnapshot.selectedComponentId,
      history: newHistory,
      redoHistory: [...get().redoHistory, {
  activePageId: get().activePageId,
  pages: currentClone,
  selectedComponentId
}]
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
      activePageId: nextSnapshot.activePageId,
      pages: nextSnapshot.pages,
      selectedComponentId: nextSnapshot.selectedComponentId,
      redoHistory: newRedoHistory,
      history: [...get().history, {
  activePageId: get().activePageId,
  pages: currentClone,
  selectedComponentId
}]
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

  setActivePageId: (id) => {
  set({
    activePageId: id,
    selectedComponentId: null,
    selectedComponentIds: [],
  });
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
    const { selectedComponentIds } = get();
    const idsToDelete = selectedComponentIds.includes(id) ? selectedComponentIds : [id];
    set(state => ({
      pages: state.pages.map(page => {
        if (page.id !== state.activePageId) return page;
        return {
          ...page,
          components: page.components.filter(c => !idsToDelete.includes(c.id))
        };
      }),
      selectedComponentId: idsToDelete.includes(state.selectedComponentId || '') ? null : state.selectedComponentId,
      selectedComponentIds: state.selectedComponentIds.filter(x => !idsToDelete.includes(x))
    }));
  },

  duplicateComponent: (id) => {
    get().saveToHistory();
    const page = get().pages.find(p => p.id === get().activePageId);
    if (!page) return;
    
    const { selectedComponentIds } = get();
    const idsToDuplicate = selectedComponentIds.includes(id) ? selectedComponentIds : [id];
    
    const duplicatedComps: BuilderComponent[] = [];
    const newSelectedIds: string[] = [];
    
    idsToDuplicate.forEach(targetId => {
      const comp = page.components.find(c => c.id === targetId);
      if (!comp) return;
      
      const copyComp: BuilderComponent = JSON.parse(JSON.stringify(comp));
      const newId = `${comp.type}-${Math.random().toString(36).substr(2, 9)}`;
      copyComp.id = newId;
      copyComp.name = `${comp.name} Copy`;
      copyComp.position.left += 20;
      copyComp.position.top += 20;
      copyComp.position.zIndex = page.components.length + duplicatedComps.length + 1;
      
      duplicatedComps.push(copyComp);
      newSelectedIds.push(newId);
    });
    
    if (duplicatedComps.length === 0) return;
    
    set(state => ({
      pages: state.pages.map(p => {
        if (p.id !== state.activePageId) return p;
        return { ...p, components: [...p.components, ...duplicatedComps] };
      }),
      selectedComponentId: newSelectedIds[newSelectedIds.length - 1],
      selectedComponentIds: newSelectedIds
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
    set({ 
      selectedComponentId,
      selectedComponentIds: selectedComponentId ? [selectedComponentId] : []
    });
  },

  setSelectionIds: (selectedComponentIds) => {
    set({
      selectedComponentIds,
      selectedComponentId: selectedComponentIds.length > 0 ? selectedComponentIds[selectedComponentIds.length - 1] : null
    });
  },

  setSnapToGrid: (snapToGrid) => {
    set({ snapToGrid });
  },

  reorderComponents: (draggedId, targetId) => {
    get().saveToHistory();
    set(state => ({
      pages: state.pages.map(page => {
        if (page.id !== state.activePageId) return page;
        const comps = [...page.components];
        const dragIdx = comps.findIndex(c => c.id === draggedId);
        const targetIdx = comps.findIndex(c => c.id === targetId);
        if (dragIdx === -1 || targetIdx === -1) return page;
        
        const [draggedComp] = comps.splice(dragIdx, 1);
        comps.splice(targetIdx, 0, draggedComp);
        
        const updatedComps = comps.map((c, index) => ({
          ...c,
          position: { ...c.position, zIndex: index + 1 }
        }));
        
        return {
          ...page,
          components: updatedComps
        };
      })
    }));
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
  },

  loadProject: (id) => {
    const project = get().projects.find(p => p.id === id);
    if (!project) return;
    set({
      pages: project.pages,
      activePageId: project.pages[0]?.id || 'home',
      activeProjectId: id,
      selectedComponentId: null,
      history: [],
      redoHistory: []
    });
  },

  saveCurrentProject: (name) => {
    const { pages, activeProjectId, projects } = get();
    const now = new Date().toISOString();
    
    if (activeProjectId) {
      const updatedProjects = projects.map(p => {
        if (p.id === activeProjectId) {
          return {
            ...p,
            pages: JSON.parse(JSON.stringify(pages)),
            updatedAt: now
          };
        }
        return p;
      });
      set({ projects: updatedProjects });
      localStorage.setItem('genovax_projects_list', JSON.stringify(updatedProjects));
    } else {
      const projName = name || 'Untitled Project';
      const newId = `project-${Date.now()}`;
      const newProject: SavedProject = {
        id: newId,
        name: projName,
        pages: JSON.parse(JSON.stringify(pages)),
        createdAt: now,
        updatedAt: now
      };
      const updatedProjects = [...projects, newProject];
      set({
        projects: updatedProjects,
        activeProjectId: newId
      });
      localStorage.setItem('genovax_projects_list', JSON.stringify(updatedProjects));
    }
  },

  deleteProject: (id) => {
    const updatedProjects = get().projects.filter(p => p.id !== id);
    set({ 
      projects: updatedProjects,
      activeProjectId: get().activeProjectId === id ? null : get().activeProjectId
    });
    localStorage.setItem('genovax_projects_list', JSON.stringify(updatedProjects));
  },

  createNewProject: (name) => {
    const now = new Date().toISOString();
    const newId = `project-${Date.now()}`;
    const newProject: SavedProject = {
      id: newId,
      name: name.trim(),
      pages: [
        {
          id: 'home',
          name: 'Home Page',
          components: []
        }
      ],
      createdAt: now,
      updatedAt: now
    };
    const updatedProjects = [...get().projects, newProject];
    set({
      projects: updatedProjects,
      activeProjectId: newId,
      pages: newProject.pages,
      activePageId: 'home',
      selectedComponentId: null,
      history: [],
      redoHistory: []
    });
    localStorage.setItem('genovax_projects_list', JSON.stringify(updatedProjects));
  },

  updateComponentName: (id, name) => {
    get().saveToHistory();
    set(state => ({
      pages: state.pages.map(page => {
        if (page.id !== state.activePageId) return page;
        return {
          ...page,
          components: page.components.map(c => 
            c.id === id ? { ...c, name: name.trim() } : c
          )
        };
      })
    }));
  },

  setLeftPanelTab: (leftPanelTab) => set({ leftPanelTab }),
  updateGlobalTheme: (themeUpdates) => set(state => ({
    globalTheme: { ...state.globalTheme, ...themeUpdates }
  })),
  addMediaAsset: (asset) => set(state => ({
    mediaAssets: [...state.mediaAssets, { ...asset, id: `m-${Date.now()}` }]
  })),
  deleteMediaAsset: (id) => set(state => ({
    mediaAssets: state.mediaAssets.filter(asset => asset.id !== id)
  }))
};
});

