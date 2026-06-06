// js/app.js
import { store } from './store.js';
import { COMPONENT_SCHEMAS, COMPONENT_CATEGORIES } from './components.js';
import { CanvasEditor } from './canvas.js';
import { PropertiesPanel } from './properties.js';
import { AILayoutGenerator } from './generator.js';
import { CodeExporter } from './exporter.js';

const STOCK_PHOTOS = [
    { name: 'Office Coding', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80' },
    { name: 'Modern Desk', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&q=80' },
    { name: 'Creative Team', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80' },
    { name: 'SaaS Dashboard Mockup', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80' },
    { name: 'Mobile App Wireframe', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80' },
    { name: 'Lo-Fi Chill Beats Artwork', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80' },
    { name: 'Glow Neon Lights', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80' },
    { name: 'Gourmet Bistro Plate', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' }
];

const TEMPLATES_LIST = [
    {
        name: 'SaaS Dashboard Console',
        icon: '📊',
        prompt: 'saas dashboard',
        desc: 'Navbar, Stats counters, Progress metrics, Changelog Timeline, Glassmorphism and Footer.',
        bg: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.15) 100%)',
        badge: 'Popular'
    },
    {
        name: 'Creative Agency Portfolio',
        icon: '🎨',
        prompt: 'creative agency',
        desc: 'Navbar, Awwwards badge, neon quotes, Glass/Glow boxes, Work showcase and footer.',
        bg: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.15) 100%)',
        badge: 'Agency'
    },
    {
        name: 'Le Parisien French Bistro',
        icon: '🍽️',
        prompt: 'restaurant',
        desc: 'Bespoke navbar, golden headings, menu photo grid, booking contact form, and footer.',
        bg: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(239,68,68,0.15) 100%)',
        badge: 'Food'
    },
    {
        name: 'Subscription Pricing Plans',
        icon: '💳',
        prompt: 'pricing',
        desc: 'Bold headings, Free Tier and Pro pricing cards (glowing border), and Server usage progress.',
        bg: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(99,102,241,0.15) 100%)',
        badge: 'SaaS'
    },
    {
        name: 'E-Commerce Electronics Shop',
        icon: '🛒',
        prompt: 'ecommerce store',
        desc: 'Product cards grid, inline shopping cart totals, checkout options, and promo alert bars.',
        bg: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(245,158,11,0.15) 100%)',
        badge: 'Store'
    },
    {
        name: 'Default SaaS Product Landing',
        icon: '🚀',
        prompt: 'landing page',
        desc: 'Product navbar, product header tagline, descriptive list paragraph, CTA and feature callouts.',
        bg: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(16,185,129,0.15) 100%)',
        badge: 'Default'
    }
];

class App {
    constructor() {
        this.canvasEditor = new CanvasEditor(store);
        this.propertiesPanel = new PropertiesPanel(store);
        this.generator = new AILayoutGenerator(store);
        this.exporter = new CodeExporter(store);

        this.activeCategory = 'layout'; // active left component category
        this.isLibraryOpen = false; // component library state
        this.isNavSidebarOpen = false; // global hamburger menu sidebar state
    }

    init() {
        // Initialize child visual managers
        this.canvasEditor.init('canvas-editor-body', 'canvas-zoom-container');
        this.propertiesPanel.init('properties-panel-container');

        // Query critical DOM elements
        this.dom = {
            body: document.body,
            hamburger: document.getElementById('hamburger-menu'),
            navSidebar: document.getElementById('nav-sidebar'),
            closeNavSidebar: document.getElementById('close-nav-sidebar'),
            themeToggle: document.getElementById('theme-toggle'),
            themeIcon: document.getElementById('theme-icon'),
            viewport: document.getElementById('workspace-viewport'),
            zoomVal: document.getElementById('zoom-value'),
            zoomIn: document.getElementById('zoom-in'),
            zoomOut: document.getElementById('zoom-out'),
            undoBtn: document.getElementById('action-undo'),
            redoBtn: document.getElementById('action-redo'),
            responsiveBtns: document.querySelectorAll('.resp-btn'),
            
            // Left Component Library Drawer
            leftIconNav: document.getElementById('left-icon-nav'),
            libraryDrawer: document.getElementById('library-drawer'),
            closeLibraryBtn: document.getElementById('close-library'),
            categoryTitle: document.getElementById('library-category-title'),
            searchBar: document.getElementById('library-search'),
            cardsContainer: document.getElementById('library-cards-container'),

            // Pages Section CRUD Panel inside Hamburger Sidebar
            pagesContainer: document.getElementById('sidebar-pages-list'),
            addPageBtn: document.getElementById('btn-add-page'),
            
            // Prompts
            generateFab: document.getElementById('generate-fab'),
            promptPopup: document.getElementById('prompt-popup'),
            closePromptPopup: document.getElementById('close-prompt-popup'),
            promptInput: document.getElementById('ai-prompt-input'),
            btnGenerateRun: document.getElementById('btn-generate-run'),
            promptSuggestions: document.querySelectorAll('.prompt-suggest-item'),

                        // Modals & Exporters
            exportModal: document.getElementById('export-modal'),
            closeExportModal: document.getElementById('close-export-modal'),
            exportTabs: document.querySelectorAll('.export-tab'),
            exportCodearea: document.getElementById('export-codearea'),
            btnCopyCode: document.getElementById('btn-copy-code'),
            btnDownloadCode: document.getElementById('btn-download-code'),
            
            templatesModal: document.getElementById('templates-modal'),
            closeTemplatesModalBtn: document.getElementById('close-templates-modal'),

            // Canvas Mode Toggles
            modeCanvasBtn: document.getElementById('mode-canvas-btn'),
            modeSectionsBtn: document.getElementById('mode-sections-btn')
        };

        this.bindEvents();
        this.renderCategoryIcons();
        this.renderLibraryCards();
        this.renderSidebarPagesList();

        // Subscribe to global store updates
        store.subscribe(state => this.updateGlobalIndicators(state));

        // Initialize manual drag panel resizers
        new PanelResizer('left-resizer', 'library-drawer', true);
        new PanelResizer('right-resizer', 'properties-panel-container', false);
    }

    bindEvents() {
        // Toggle Global Hamburger Sidebar
        this.dom.hamburger.addEventListener('click', () => this.toggleNavSidebar(true));
        this.dom.closeNavSidebar.addEventListener('click', () => this.toggleNavSidebar(false));

        // Click outside sidebars closes them
        document.addEventListener('click', e => {
            if (!this.dom.navSidebar.contains(e.target) && !this.dom.hamburger.contains(e.target) && this.isNavSidebarOpen) {
                this.toggleNavSidebar(false);
            }
        });

        // Theme Switch
        this.dom.themeToggle.addEventListener('click', () => {
            store.toggleTheme();
        });

        // Global Nav Sidebar tab links
        this.dom.navSidebar.addEventListener('click', e => {
            const navLink = e.target.closest('.nav-sidebar-link');
            if (!navLink) return;

            e.preventDefault();
            const view = navLink.getAttribute('data-view');
            this.toggleNavSidebar(false);

            if (view === 'export') {
                this.openExportModal();
            } else if (view === 'theme') {
                store.toggleTheme();
            } else if (view === 'builder' || view === 'canva') {
                store.setMode('canva');
            } else if (view === 'dashboard' || view === 'generator') {
                this.openPromptPopup();
            } else if (view === 'templates') {
                this.openTemplatesModal();
            } else if (view === 'projects') {
                alert('My Projects Console:\n- Project 1: AI Landing Page (Saved)\n- Project 2: Bistro Portfolio (Saved)\n- Project 3: SaaS Dashboard (Active)');
            } else if (view === 'pages') {
                this.toggleNavSidebar(true);
                const list = document.getElementById('sidebar-pages-list');
                if (list) list.scrollIntoView({ behavior: 'smooth' });
            } else if (view === 'components') {
                this.activeCategory = 'layout';
                this.toggleLibraryDrawer(true);
                this.renderCategoryIcons();
                this.renderLibraryCards();
            } else if (view === 'media') {
                this.activeCategory = 'media';
                this.toggleLibraryDrawer(true);
                this.renderCategoryIcons();
                this.renderLibraryCards();
            } else if (view === 'settings') {
                alert('Settings Config:\n- Workspace Auto-save: Active (local)\n- Snippets Snap Tolerance: 10px\n- Zoom Interval: 10%');
            }
        });

        // Left Category Icons events
        this.dom.leftIconNav.addEventListener('click', e => {
            const iconItem = e.target.closest('.nav-icon-item');
            if (!iconItem) return;

            const category = iconItem.getAttribute('data-category');
            
            // Toggle drawer if clicking already active category
            if (this.isLibraryOpen && this.activeCategory === category) {
                this.toggleLibraryDrawer(false);
            } else {
                this.activeCategory = category;
                this.toggleLibraryDrawer(true);
                this.renderLibraryCards();
                
                // Highlight icon
                this.dom.leftIconNav.querySelectorAll('.nav-icon-item').forEach(el => el.classList.remove('active'));
                iconItem.classList.add('active');
            }
        });

        this.dom.closeLibraryBtn.addEventListener('click', () => this.toggleLibraryDrawer(false));

        // Library Component cards search
        this.dom.searchBar.addEventListener('input', () => {
            this.renderLibraryCards();
        });

        // Component library card clicks to instantiate on Canvas
        this.dom.cardsContainer.addEventListener('click', e => {
            const card = e.target.closest('.component-card');
            if (!card) return;

            const photoUrl = card.getAttribute('data-photo-url');
            if (photoUrl) {
                this.instantiateStockPhoto(photoUrl);
            } else {
                const type = card.getAttribute('data-type');
                if (type) this.instantiateComponent(type);
            }
        });

        // Draggable setup for library cards
        this.dom.cardsContainer.addEventListener('dragstart', e => {
            const card = e.target.closest('.component-card');
            if (card) {
                const type = card.getAttribute('data-type');
                const photoUrl = card.getAttribute('data-photo-url');
                if (photoUrl) {
                    e.dataTransfer.setData('image-src', photoUrl);
                    e.dataTransfer.setData('text/plain', 'media-image');
                    e.dataTransfer.effectAllowed = 'copy';
                } else if (type) {
                    e.dataTransfer.setData('text/plain', type);
                    e.dataTransfer.effectAllowed = 'copy';
                }
            }
        });

        // Pages CRUD bindings
        this.dom.addPageBtn.addEventListener('click', () => {
            const pageName = prompt('Enter new page name:');
            if (pageName && pageName.trim()) {
                const ok = store.addPage(pageName.trim());
                if (!ok) alert('Page already exists or invalid name.');
            }
        });

        this.dom.pagesContainer.addEventListener('click', e => {
            const btn = e.target.closest('.sidebar-page-action-btn');
            const row = e.target.closest('.sidebar-page-row');
            if (!row) return;

            const pageId = row.getAttribute('data-page-id');

            if (btn) {
                e.stopPropagation();
                if (btn.classList.contains('delete-page')) {
                    if (confirm('Delete page? This cannot be undone.')) {
                        const ok = store.deletePage(pageId);
                        if (!ok) alert('Cannot delete the last page.');
                    }
                } else if (btn.classList.contains('duplicate-page')) {
                    store.duplicatePage(pageId);
                } else if (btn.classList.contains('rename-page')) {
                    const page = store.state.pages.find(p => p.id === pageId);
                    const currentName = page ? page.name : '';
                    const newName = prompt('Enter new page name:', currentName);
                    if (newName && newName.trim() && newName.trim() !== currentName) {
                        store.renamePage(pageId, newName.trim());
                    }
                }
            } else {
                // Switch page
                store.setActivePage(pageId);
                this.toggleNavSidebar(false);
            }
        });

        // Canvas Zoom Controls
        this.dom.zoomIn.addEventListener('click', () => store.setZoom(store.state.zoom + 10));
        this.dom.zoomOut.addEventListener('click', () => store.setZoom(store.state.zoom - 10));

        // Canvas Mode Toggle buttons
        this.dom.modeCanvasBtn.addEventListener('click', () => store.setMode('canva'));
        this.dom.modeSectionsBtn.addEventListener('click', () => store.setMode('sections'));

        // History buttons
        this.dom.undoBtn.addEventListener('click', () => store.undo());
        this.dom.redoBtn.addEventListener('click', () => store.redo());

        // Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Delete)
        window.addEventListener('keydown', e => {
            const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.getAttribute('contenteditable') === 'true';
            if (isInput) return;

            if (e.ctrlKey && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                store.undo();
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                store.redo();
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (store.state.selectedComponentId) {
                    e.preventDefault();
                    store.deleteComponent(store.state.selectedComponentId);
                }
            }
        });

        // Preview Responsive Width switch buttons
        this.dom.responsiveBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.dom.responsiveBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const view = btn.getAttribute('data-view');
                this.dom.viewport.className = `workspace-viewport-wrapper ${view}-view`;
            });
        });

        // AI Prompt popup controls
        this.dom.generateFab.addEventListener('click', () => this.openPromptPopup());
        this.dom.closePromptPopup.addEventListener('click', () => this.closePromptPopup());
        
        this.dom.btnGenerateRun.addEventListener('click', () => {
            const val = this.dom.promptInput.value.trim();
            if (val) {
                this.runAIGenerator(val);
            }
        });

        this.dom.promptInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && e.ctrlKey) {
                const val = this.dom.promptInput.value.trim();
                if (val) this.runAIGenerator(val);
            }
        });

        this.dom.promptSuggestions.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.querySelector('p').innerText.replace(/"/g, '');
                this.dom.promptInput.value = text;
                this.runAIGenerator(text);
            });
        });

        // Exporter modal controls
        this.dom.closeExportModal.addEventListener('click', () => this.closeExportModal());
        this.dom.exportModal.addEventListener('click', e => {
            if (e.target === this.dom.exportModal) this.closeExportModal();
        });

        // Templates modal controls
        this.dom.closeTemplatesModalBtn.addEventListener('click', () => this.closeTemplatesModal());
        this.dom.templatesModal.addEventListener('click', e => {
            if (e.target === this.dom.templatesModal) this.closeTemplatesModal();
        });

        this.dom.exportTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.dom.exportTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.renderExportContent(tab.getAttribute('data-format'));
            });
        });

        this.dom.btnCopyCode.addEventListener('click', () => {
            this.dom.exportCodearea.select();
            document.execCommand('copy');
            this.dom.btnCopyCode.innerText = '✅ Copied!';
            setTimeout(() => {
                this.dom.btnCopyCode.innerText = '📋 Copy Code';
            }, 2000);
        });

        this.dom.btnDownloadCode.addEventListener('click', () => {
            const format = this.dom.exportModal.querySelector('.export-tab.active').getAttribute('data-format');
            const code = this.dom.exportCodearea.value;
            let filename = `layout-${store.state.activePageId}.${format}`;
            if (format === 'react') filename = `${store.state.activePageId.charAt(0).toUpperCase() + store.state.activePageId.slice(1)}Page.jsx`;

            const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        });
    }

    toggleNavSidebar(open) {
        this.isNavSidebarOpen = open;
        this.dom.navSidebar.classList.toggle('open', open);
    }

    toggleLibraryDrawer(open) {
        this.isLibraryOpen = open;
        this.dom.libraryDrawer.classList.toggle('open', open);
        this.dom.body.classList.toggle('library-drawer-open', open);
    }

    renderCategoryIcons() {
        this.dom.leftIconNav.innerHTML = '';
        Object.entries(COMPONENT_CATEGORIES).forEach(([key, value]) => {
            const iconItem = document.createElement('div');
            iconItem.className = `nav-icon-item ${key === this.activeCategory ? 'active' : ''}`;
            iconItem.setAttribute('data-category', key);
            iconItem.setAttribute('title', value.name);
            
            iconItem.innerHTML = `
                <span class="nav-icon">${value.icon}</span>
                <span class="nav-icon-label">${value.name.split(' ')[0]}</span>
            `;
            this.dom.leftIconNav.appendChild(iconItem);
        });
    }

    renderLibraryCards() {
        this.dom.categoryTitle.innerText = COMPONENT_CATEGORIES[this.activeCategory].name;
        this.dom.cardsContainer.innerHTML = '';

        const searchQuery = this.dom.searchBar.value.trim().toLowerCase();

        Object.entries(COMPONENT_SCHEMAS).forEach(([type, schema]) => {
            // Filter by search query or by category tab
            const matchesCategory = schema.category === this.activeCategory;
            const matchesSearch = schema.name.toLowerCase().includes(searchQuery) || type.toLowerCase().includes(searchQuery);

            if (searchQuery ? matchesSearch : matchesCategory) {
                const card = document.createElement('div');
                card.className = 'component-card glass-panel';
                card.setAttribute('data-type', type);
                card.setAttribute('draggable', 'true');
                
                card.innerHTML = `
                    <div class="comp-card-icon">${schema.icon}</div>
                    <div class="comp-card-info">
                        <div class="comp-card-name">${schema.name}</div>
                        <div class="comp-card-category">${schema.category}</div>
                    </div>
                `;
                this.dom.cardsContainer.appendChild(card);
            }
        });

        // Add Unsplash Stock Photos in Media tab if no search query
        if (this.activeCategory === 'media' && !searchQuery) {
            const divider = document.createElement('div');
            divider.style.gridColumn = 'span 2';
            divider.style.margin = '20px 0 10px 0';
            divider.style.borderTop = '1px solid var(--border-color)';
            divider.style.paddingTop = '15px';
            divider.style.fontSize = '11px';
            divider.style.fontWeight = '700';
            divider.style.textTransform = 'uppercase';
            divider.style.color = 'var(--text-muted)';
            divider.innerText = '🖼️ Stock Photos Library';
            this.dom.cardsContainer.appendChild(divider);

            STOCK_PHOTOS.forEach(photo => {
                const card = document.createElement('div');
                card.className = 'component-card glass-panel stock-photo-card';
                card.setAttribute('data-photo-url', photo.url);
                card.setAttribute('draggable', 'true');
                card.style.padding = '0';
                card.style.overflow = 'hidden';
                card.style.aspectRatio = '1.3';
                
                card.innerHTML = `
                    <img src="${photo.url}" style="width:100%; height:100%; object-fit:cover;" draggable="false">
                    <div class="stock-photo-overlay" style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.75); padding:4px; font-size:9px; text-align:center; color:#fff; font-weight:600; opacity:0; transition:opacity 0.2s;">
                        ${photo.name}
                    </div>
                `;
                this.dom.cardsContainer.appendChild(card);
            });
        }

        if (this.dom.cardsContainer.children.length === 0) {
            this.dom.cardsContainer.innerHTML = `
                <div style="color:var(--text-muted); font-size:12px; text-align:center; grid-column:span 2; padding:30px 0;">No matching components found. Try another search.</div>
            `;
        }
    }

    renderSidebarPagesList() {
        this.dom.pagesContainer.innerHTML = '';
        const state = store.state;

        state.pages.forEach(p => {
            const isActive = p.id === state.activePageId;
            const row = document.createElement('div');
            row.className = `sidebar-page-row ${isActive ? 'active' : ''}`;
            row.setAttribute('data-page-id', p.id);

            row.innerHTML = `
                <span class="sidebar-page-name">📄 ${p.name}</span>
                <div style="display:flex; gap:6px;">
                    <button class="sidebar-page-action-btn rename-page" title="Rename">✏️</button>
                    <button class="sidebar-page-action-btn duplicate-page" title="Duplicate">📑</button>
                    <button class="sidebar-page-action-btn delete-page" title="Delete">🗑️</button>
                </div>
            `;
            this.dom.pagesContainer.appendChild(row);
        });
    }

    instantiateComponent(type) {
        const schema = COMPONENT_SCHEMAS[type];
        if (!schema) return;

        // Calculate a centered absolute position on canvas for Canva mode
        const canvasRect = this.canvasEditor.canvas.getBoundingClientRect();
        const left = Math.max(50, Math.round((canvasRect.width / 2 - 175) / 10) * 10);
        
        // Stack elements slightly to avoid overlap when clicking multiple times
        const page = store.state.pages.find(p => p.id === store.state.activePageId);
        const compCount = page ? page.components.length : 0;
        const top = Math.max(80, Math.round((80 + compCount * 40) / 10) * 10);

        const id = store.addComponent({
            type,
            name: schema.name,
            style: JSON.parse(JSON.stringify(schema.defaultStyle)),
            content: JSON.parse(JSON.stringify(schema.defaultContent)),
            position: {
                left,
                top,
                width: schema.defaultStyle.width ? parseInt(schema.defaultStyle.width) || 350 : 350,
                height: schema.defaultStyle.height ? parseInt(schema.defaultStyle.height) || 120 : 120,
                rotate: 0,
                zIndex: compCount + 1
            }
        });

        // Keep properties tab open
        this.propertiesPanel.activeTab = 'layers';
        this.propertiesPanel.render();
    }

    openPromptPopup() {
        this.dom.promptPopup.classList.add('active');
        this.dom.promptInput.focus();
    }

    closePromptPopup() {
        this.dom.promptPopup.classList.remove('active');
    }

    runAIGenerator(promptText) {
        const loadingOverlay = document.getElementById('canvas-loading');
        if (loadingOverlay) loadingOverlay.classList.add('active');

        this.dom.btnGenerateRun.innerText = '✨ Generating...';
        this.dom.btnGenerateRun.disabled = true;

        // Simulate network API delay
        setTimeout(() => {
            try {
                const ok = this.generator.generate(promptText);
                this.dom.btnGenerateRun.innerText = '✨ Generate Layout';
                this.dom.btnGenerateRun.disabled = false;
                
                if (ok) {
                    this.closePromptPopup();
                    // Focus on layers tab to see result
                    this.propertiesPanel.activeTab = 'layers';
                    this.propertiesPanel.render();
                } else {
                    alert('AI Generation failed: Active page not found or template generation error.');
                }
            } catch (err) {
                console.error(err);
                alert('AI Generation encountered an error: ' + err.message);
                this.dom.btnGenerateRun.innerText = '✨ Generate Layout';
                this.dom.btnGenerateRun.disabled = false;
            } finally {
                if (loadingOverlay) loadingOverlay.classList.remove('active');
            }
        }, 1200);
    }

    loadTemplateMockup() {
        // Load default mock landing layout
        this.runAIGenerator("SaaS Dashboard Layout");
    }

    openExportModal() {
        this.dom.exportModal.classList.add('active');
        // Trigger active tab display render
        const activeTab = this.dom.exportModal.querySelector('.export-tab.active');
        this.renderExportContent(activeTab.getAttribute('data-format'));
    }

    closeExportModal() {
        this.dom.exportModal.classList.remove('active');
    }

    openTemplatesModal() {
        this.dom.templatesModal.classList.add('active');
        this.renderTemplatesGallery();
    }

    closeTemplatesModal() {
        this.dom.templatesModal.classList.remove('active');
    }

    renderTemplatesGallery() {
        const grid = document.getElementById('templates-gallery-grid');
        if (!grid) return;
        grid.innerHTML = '';

        TEMPLATES_LIST.forEach(tpl => {
            const card = document.createElement('div');
            card.className = 'template-card glass-panel';
            card.style.background = tpl.bg;
            card.style.padding = '20px';
            card.style.borderRadius = '12px';
            card.style.cursor = 'pointer';
            card.style.position = 'relative';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.justifyContent = 'space-between';
            card.style.height = '180px';
            
            card.innerHTML = `
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:1.8rem;">${tpl.icon}</span>
                        <span style="font-size:9.5px; font-weight:700; text-transform:uppercase; background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:10px; border:1px solid var(--border-color); color:var(--text-main);">${tpl.badge}</span>
                    </div>
                    <h4 style="font-size:14px; font-weight:700; color:var(--text-main); margin:12px 0 6px 0; transition: color 0.2s;">${tpl.name}</h4>
                    <p style="font-size:11.5px; color:var(--text-muted); line-height:1.4; margin:0;">${tpl.desc}</p>
                </div>
                <div style="font-size:11px; font-weight:700; color:var(--primary); text-transform:uppercase; display:flex; align-items:center; gap:4px; margin-top:10px;">
                    Load Template ➔
                </div>
            `;

            card.addEventListener('click', () => {
                this.closeTemplatesModal();
                this.runAIGenerator(tpl.prompt);
            });

            grid.appendChild(card);
        });
    }

    instantiateStockPhoto(photoUrl) {
        const schema = COMPONENT_SCHEMAS['media-image'];
        if (!schema) return;

        const canvasRect = this.canvasEditor.canvas.getBoundingClientRect();
        const left = Math.max(50, Math.round((canvasRect.width / 2 - 175) / 10) * 10);
        const page = store.state.pages.find(p => p.id === store.state.activePageId);
        const compCount = page ? page.components.length : 0;
        const top = Math.max(80, Math.round((80 + compCount * 40) / 10) * 10);

        store.addComponent({
            type: 'media-image',
            name: 'Stock Photo',
            style: JSON.parse(JSON.stringify(schema.defaultStyle)),
            content: {
                src: photoUrl,
                alt: 'Stock Photo'
            },
            position: {
                left,
                top,
                width: 320,
                height: 200,
                rotate: 0,
                zIndex: compCount + 1
            }
        });

        this.propertiesPanel.activeTab = 'layers';
        this.propertiesPanel.render();
    }

    renderExportContent(format) {
        const activePageId = store.state.activePageId;
        let code = '';

        switch (format) {
            case 'html':
                code = this.exporter.exportHTML(activePageId);
                break;
            case 'css':
                code = this.exporter.exportCSS(activePageId);
                break;
            case 'react':
                code = this.exporter.exportReact(activePageId);
                break;
            case 'tailwind':
                code = this.exporter.exportTailwind(activePageId);
                break;
            case 'json':
                code = this.exporter.exportJSON();
                break;
        }
        this.dom.exportCodearea.value = code;
    }

    updateHistoryButtons() {
        const canUndo = store.state.historyIndex > 0;
        const canRedo = store.state.historyIndex < store.state.history.length - 1;

        this.dom.undoBtn.classList.toggle('disabled', !canUndo);
        this.dom.redoBtn.classList.toggle('disabled', !canRedo);
    }

    updateGlobalIndicators(state) {
        // Update Zoom value label
        this.dom.zoomVal.innerText = `${state.zoom}%`;
        this.updateHistoryButtons();

        // Sync header active page display (in case of CRUD)
        const headerPageName = document.getElementById('header-active-page-name');
        const page = state.pages.find(p => p.id === state.activePageId);
        if (headerPageName && page) {
            headerPageName.innerText = page.name;
        }

        // Keep active drawer content refreshed on state updates
        this.renderSidebarPagesList();

        // Mode toggles highlight sync
        const isCanva = state.activeMode === 'canva';
        this.dom.modeCanvasBtn.classList.toggle('active', isCanva);
        this.dom.modeSectionsBtn.classList.toggle('active', !isCanva);

        // Keep properties inputs synced
        this.propertiesPanel.render();
    }
}

class PanelResizer {
    constructor(resizerId, panelId, isLeftPanel) {
        this.resizer = document.getElementById(resizerId);
        this.panel = document.getElementById(panelId);
        this.isLeftPanel = isLeftPanel;
        
        if (this.resizer && this.panel) {
            this.init();
        }
    }

    init() {
        let startX, startWidth;

        const onMouseMove = (e) => {
            const dx = e.clientX - startX;
            let newWidth = this.isLeftPanel ? (startWidth + dx) : (startWidth - dx);
            
            // Constrain width boundary limits
            const minWidth = this.isLeftPanel ? 200 : 240;
            const maxWidth = this.isLeftPanel ? 500 : 450;
            newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
            
            // Update CSS custom property on container
            const container = document.querySelector('.main-app-container');
            if (container) {
                const propName = this.isLeftPanel ? '--library-width' : '--properties-width';
                container.style.setProperty(propName, `${newWidth}px`);
            }
            this.resizer.classList.add('dragging');
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            this.resizer.classList.remove('dragging');
            document.body.style.cursor = 'default';
        };

        this.resizer.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            startWidth = parseInt(document.defaultView.getComputedStyle(this.panel).width, 10);
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.body.style.cursor = 'col-resize';
            this.resizer.classList.add('dragging');
            e.preventDefault();
        });
    }
}

// Bootstrap application on load
window.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
    window.appInstance = app; // Expose globally for browser test helpers
});
