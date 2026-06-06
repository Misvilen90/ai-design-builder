// js/store.js

export class Store {
    constructor() {
        this.state = {
            activeMode: 'canva', // 'sections' or 'canva'
            activePageId: 'home',
            selectedComponentId: null,
            zoom: 100,
            theme: 'dark',
            pages: [
                { id: 'home', name: 'Home Page', components: [] },
                { id: 'about', name: 'About Page', components: [] },
                { id: 'services', name: 'Services Page', components: [] },
                { id: 'contact', name: 'Contact Page', components: [] },
                { id: 'blog', name: 'Blog Page', components: [] },
                { id: 'landing', name: 'Landing Page', components: [] },
                { id: 'portfolio', name: 'Portfolio Page', components: [] },
                { id: 'pricing', name: 'Pricing Page', components: [] },
                { id: 'custom', name: 'Custom Page', components: [] }
            ],
            history: [],
            historyIndex: -1
        };

        this.listeners = [];
        this.initTheme();
        this.saveHistory();
    }

    initTheme() {
        const savedTheme = localStorage.getItem('ai-ui-builder-theme') || 'dark';
        this.state.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    setTheme(theme) {
        this.state.theme = theme;
        localStorage.setItem('ai-ui-builder-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        this.notify();
    }

    toggleTheme() {
        const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(nextTheme);
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // Page Actions
    addPage(name) {
        const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (this.state.pages.some(p => p.id === id)) return false;
        
        this.state.pages.push({ id, name, components: [] });
        this.state.activePageId = id;
        this.state.selectedComponentId = null;
        this.saveHistory();
        this.notify();
        return true;
    }

    deletePage(id) {
        if (this.state.pages.length <= 1) return false;
        const index = this.state.pages.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.state.pages.splice(index, 1);
        if (this.state.activePageId === id) {
            this.state.activePageId = this.state.pages[0].id;
        }
        this.state.selectedComponentId = null;
        this.saveHistory();
        this.notify();
        return true;
    }

    duplicatePage(id) {
        const page = this.state.pages.find(p => p.id === id);
        if (!page) return false;

        const newId = `${page.id}-copy-${Date.now()}`;
        const newName = `${page.name} (Copy)`;
        const newComponents = JSON.parse(JSON.stringify(page.components)).map(c => {
            c.id = `comp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            return c;
        });

        this.state.pages.push({ id: newId, name: newName, components: newComponents });
        this.state.activePageId = newId;
        this.state.selectedComponentId = null;
        this.saveHistory();
        this.notify();
        return true;
    }

    renamePage(id, newName) {
        const page = this.state.pages.find(p => p.id === id);
        if (!page) return false;
        page.name = newName;
        this.saveHistory();
        this.notify();
        return true;
    }

    setActivePage(id) {
        if (!this.state.pages.some(p => p.id === id)) return;
        this.state.activePageId = id;
        this.state.selectedComponentId = null;
        this.notify();
    }

    // Canvas Mode Action
    setMode(mode) {
        if (mode !== 'canva' && mode !== 'sections') return;
        this.state.activeMode = mode;
        this.state.selectedComponentId = null;
        this.saveHistory();
        this.notify();
    }

    // Component Actions
    addComponent(compData) {
        const page = this.state.pages.find(p => p.id === this.state.activePageId);
        if (!page) return;

        const id = compData.id || `comp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const newComp = {
            id,
            type: compData.type,
            name: compData.name || 'Component',
            style: compData.style || {},
            content: compData.content || {},
            position: compData.position || { left: 50, top: 100, width: 400, height: 100, rotate: 0, zIndex: page.components.length + 1 },
            locked: false,
            visible: true
        };

        page.components.push(newComp);
        this.state.selectedComponentId = id;
        this.saveHistory();
        this.notify();
        return id;
    }

    deleteComponent(id) {
        const page = this.state.pages.find(p => p.id === this.state.activePageId);
        if (!page) return;

        const comp = page.components.find(c => c.id === id);
        if (comp && comp.locked) return;

        page.components = page.components.filter(c => c.id !== id);
        if (this.state.selectedComponentId === id) {
            this.state.selectedComponentId = null;
        }
        this.saveHistory();
        this.notify();
    }

    duplicateComponent(id) {
        const page = this.state.pages.find(p => p.id === this.state.activePageId);
        if (!page) return;

        const comp = page.components.find(c => c.id === id);
        if (!comp) return;

        const clone = JSON.parse(JSON.stringify(comp));
        clone.id = `comp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        clone.locked = false; // duplicate is unlocked
        if (clone.position) {
            clone.position.left += 30;
            clone.position.top += 30;
            clone.position.zIndex = page.components.length + 1;
        }
        page.components.push(clone);
        this.state.selectedComponentId = clone.id;
        this.saveHistory();
        this.notify();
    }

    updateComponentStyle(id, styles) {
        const page = this.state.pages.find(p => p.id === this.state.activePageId);
        if (!page) return;

        const comp = page.components.find(c => c.id === id);
        if (!comp || comp.locked) return;

        comp.style = { ...comp.style, ...styles };
        this.saveHistory();
        this.notify();
    }

    updateComponentContent(id, content) {
        const page = this.state.pages.find(p => p.id === this.state.activePageId);
        if (!page) return;

        const comp = page.components.find(c => c.id === id);
        if (!comp || comp.locked) return;

        // Parse dash-separated keys for array or nested property updates (e.g. features-0 or steps-0-title)
        Object.entries(content).forEach(([key, val]) => {
            if (key.includes('-')) {
                const parts = key.split('-');
                const arrName = parts[0];
                
                if (parts.length === 2) {
                    const idx = parseInt(parts[1]);
                    if (comp.content[arrName] && Array.isArray(comp.content[arrName])) {
                        comp.content[arrName][idx] = val;
                    } else if (comp.content[arrName] && typeof comp.content[arrName] === 'object') {
                        comp.content[arrName][parts[1]] = val;
                    } else {
                        comp.content[key] = val;
                    }
                } else if (parts.length === 3) {
                    const idx = parseInt(parts[1]);
                    const subProp = parts[2];
                    if (comp.content[arrName] && Array.isArray(comp.content[arrName]) && comp.content[arrName][idx]) {
                        comp.content[arrName][idx][subProp] = val;
                    } else if (comp.content[arrName] && comp.content[arrName][parts[1]]) {
                        comp.content[arrName][parts[1]][subProp] = val;
                    } else {
                        comp.content[key] = val;
                    }
                }
            } else {
                comp.content[key] = val;
            }
        });

        this.saveHistory();
        this.notify();
    }

    updateComponentPosition(id, pos) {
        const page = this.state.pages.find(p => p.id === this.state.activePageId);
        if (!page) return;

        const comp = page.components.find(c => c.id === id);
        if (!comp || comp.locked) return;

        comp.position = { ...comp.position, ...pos };
        this.saveHistory();
        this.notify();
    }

    toggleComponentLock(id) {
        const page = this.state.pages.find(p => p.id === this.state.activePageId);
        if (!page) return;
        const comp = page.components.find(c => c.id === id);
        if (!comp) return;
        comp.locked = !comp.locked;
        this.saveHistory();
        this.notify();
    }

    toggleComponentVisibility(id) {
        const page = this.state.pages.find(p => p.id === this.state.activePageId);
        if (!page) return;
        const comp = page.components.find(c => c.id === id);
        if (!comp) return;
        comp.visible = comp.visible === undefined ? false : !comp.visible;
        this.saveHistory();
        this.notify();
    }

    moveComponentOrder(id, delta) {
        const page = this.state.pages.find(p => p.id === this.state.activePageId);
        if (!page) return;
        
        const idx = page.components.findIndex(c => c.id === id);
        if (idx === -1) return;

        const nextIdx = idx + delta;
        if (nextIdx >= 0 && nextIdx < page.components.length) {
            const temp = page.components[idx];
            page.components[idx] = page.components[nextIdx];
            page.components[nextIdx] = temp;

            // Sync zIndex values
            page.components.forEach((c, i) => {
                if (c.position) c.position.zIndex = i + 1;
            });
            this.saveHistory();
            this.notify();
        }
    }

    setSelection(id) {
        this.state.selectedComponentId = id;
        this.notify();
    }

    setZoom(val) {
        this.state.zoom = Math.max(20, Math.min(200, val));
        this.notify();
    }

    // History (Undo / Redo)
    saveHistory() {
        const snapshot = JSON.stringify(this.state.pages);
        // Truncate forward history if we are in the middle of undo stack
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
        }
        
        this.state.history.push(snapshot);
        // Limit history to 30 states
        if (this.state.history.length > 30) {
            this.state.history.shift();
        }
        this.state.historyIndex = this.state.history.length - 1;
    }

    undo() {
        if (this.state.historyIndex <= 0) return;
        this.state.historyIndex--;
        this.state.pages = JSON.parse(this.state.history[this.state.historyIndex]);
        this.state.selectedComponentId = null;
        this.notify();
    }

    redo() {
        if (this.state.historyIndex >= this.state.history.length - 1) return;
        this.state.historyIndex++;
        this.state.pages = JSON.parse(this.state.history[this.state.historyIndex]);
        this.state.selectedComponentId = null;
        this.notify();
    }
}

export const store = new Store();
