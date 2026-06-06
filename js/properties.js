// js/properties.js
import { COMPONENT_SCHEMAS } from './components.js';

export class PropertiesPanel {
    constructor(store) {
        this.store = store;
        this.container = null;
        this.activeTab = 'properties'; // 'properties' or 'layers'
        this.activeCompId = null;
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        this.store.subscribe(state => this.handleStateChange(state));
        this.bindTabEvents();
    }

    bindTabEvents() {
        this.container.addEventListener('click', e => {
            const tabBtn = e.target.closest('.panel-tab-btn');
            if (!tabBtn) return;

            const tab = tabBtn.getAttribute('data-tab');
            this.activeTab = tab;
            this.render();
        });
    }

    handleStateChange(state) {
        const selectedId = state.selectedComponentId;
        
        // If selection changes, re-render
        if (selectedId !== this.activeCompId) {
            this.activeCompId = selectedId;
            this.render();
        } else {
            // Otherwise, just update inputs to prevent focus loss during typing
            this.syncValues();
        }
    }

    render() {
        if (!this.container) return;

        const state = this.store.state;
        const page = state.pages.find(p => p.id === state.activePageId);
        const comp = page ? page.components.find(c => c.id === this.activeCompId) : null;

        // Render Panel structure with tabs
        let html = `
        <div class="panel-tabs" style="display:flex; border-bottom:1px solid var(--border-color); background:rgba(0,0,0,0.15);">
            <button class="panel-tab-btn ${this.activeTab === 'properties' ? 'active' : ''}" data-tab="properties" style="flex:1; padding:12px; border:none; background:transparent; font-size:12px; font-weight:700; color:var(--text-muted); cursor:pointer; text-transform:uppercase; border-bottom: 2px solid ${this.activeTab === 'properties' ? 'var(--primary)' : 'transparent'};">⚙️ Properties</button>
            <button class="panel-tab-btn ${this.activeTab === 'layers' ? 'active' : ''}" data-tab="layers" style="flex:1; padding:12px; border:none; background:transparent; font-size:12px; font-weight:700; color:var(--text-muted); cursor:pointer; text-transform:uppercase; border-bottom: 2px solid ${this.activeTab === 'layers' ? 'var(--primary)' : 'transparent'};">🥞 Layers (${page ? page.components.length : 0})</button>
        </div>
        <div class="panel-body-content" style="padding:20px; overflow-y:auto; height:calc(100% - 43px);">
        `;

        if (this.activeTab === 'properties') {
            if (!comp) {
                html += `
                <div class="empty-properties-panel" style="text-align:center; padding:40px 0;">
                    <div style="font-size: 2rem; margin-bottom: 15px; opacity: 0.6;">🎛️</div>
                    <h3>No Selection</h3>
                    <p style="color: var(--text-muted); font-size: 0.85rem; max-width: 220px; margin: 8px auto 0; line-height:1.4;">Select a component on the canvas or drag one from the library to configure its layout, fonts, and borders.</p>
                </div>`;
            } else {
                html += this.renderPropertiesForm(comp, state.activeMode === 'canva');
            }
        } else {
            // Layers tab
            html += this.renderLayersList(page, selectedId);
        }

        html += `</div>`;
        this.container.innerHTML = html;

        if (this.activeTab === 'properties' && comp) {
            this.bindPropertyInputs(comp.id);
        } else if (this.activeTab === 'layers' && page) {
            this.bindLayersListEvents();
        }
    }

    renderPropertiesForm(comp, isCanva) {
        const style = comp.style || {};
        const pos = comp.position || { left: 50, top: 100, width: 400, height: 100, rotate: 0, zIndex: 1 };
        const isLocked = comp.locked === true;

        return `
        <div class="properties-form" style="display:flex; flex-direction:column; gap:24px;">
            <div class="prop-group">
                <h4 style="margin:0 0 10px 0; font-size:12px; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.05em;">Component Settings</h4>
                <div class="prop-row" style="display:flex; flex-direction:column; gap:10px;">
                    <label style="font-size:12px;">Component Name</label>
                    <input type="text" id="prop-comp-name" class="prop-input" value="${comp.name || ''}" style="width:100%; padding:8px; background:rgba(0,0,0,0.2); border:1px solid var(--border-color); border-radius:6px;" ${isLocked ? 'disabled' : ''}>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; gap:8px;">
                    <button id="prop-btn-lock" class="btn btn-outline" style="flex:1; padding:6px; font-size:11px; border-color:${isLocked ? 'var(--primary)' : 'var(--border-color)'}; color:${isLocked ? 'var(--primary)' : 'var(--text-main)'};">${isLocked ? '🔒 Locked' : '🔓 Unlock'}</button>
                    <button id="prop-btn-visible" class="btn btn-outline" style="flex:1; padding:6px; font-size:11px; border-color:${comp.visible === false ? 'var(--danger)' : 'var(--border-color)'}; color:${comp.visible === false ? 'var(--danger)' : 'var(--text-main)'};">${comp.visible !== false ? '👁️ Visible' : '👁️‍🗨️ Hidden'}</button>
                </div>
            </div>

            <!-- Canva position values -->
            ${isCanva ? `
            <div class="prop-group">
                <h4 style="margin:0 0 10px 0; font-size:12px; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.05em;">Layout Coordinates</h4>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-size:11px;">X position (left)</label>
                        <input type="number" id="prop-pos-left" class="prop-input" value="${pos.left}" ${isLocked ? 'disabled' : ''}>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-size:11px;">Y position (top)</label>
                        <input type="number" id="prop-pos-top" class="prop-input" value="${pos.top}" ${isLocked ? 'disabled' : ''}>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-size:11px;">Width (px)</label>
                        <input type="number" id="prop-pos-width" class="prop-input" value="${pos.width}" ${isLocked ? 'disabled' : ''}>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-size:11px;">Height (px)</label>
                        <input type="number" id="prop-pos-height" class="prop-input" value="${pos.height}" ${isLocked ? 'disabled' : ''}>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-size:11px;">Rotate (deg)</label>
                        <input type="number" id="prop-pos-rotate" class="prop-input" value="${pos.rotate || 0}" ${isLocked ? 'disabled' : ''}>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-size:11px;">Z-Index (Layer)</label>
                        <input type="number" id="prop-pos-zindex" class="prop-input" value="${pos.zIndex || 1}" ${isLocked ? 'disabled' : ''}>
                    </div>
                </div>
            </div>` : ''}

            <div class="prop-group">
                <h4 style="margin:0 0 10px 0; font-size:12px; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.05em;">Typography</h4>
                <div class="prop-row" style="display:flex; flex-direction:column; gap:10px;">
                    <div style="display:flex; gap:10px;">
                        <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
                            <label style="font-size:11px;">Font Family</label>
                            <select id="prop-font-family" class="prop-input" ${isLocked ? 'disabled' : ''}>
                                <option value="sans-serif" ${style.fontFamily === 'sans-serif' ? 'selected' : ''}>System Sans</option>
                                <option value="'Inter', sans-serif" ${style.fontFamily === "'Inter', sans-serif" ? 'selected' : ''}>Inter</option>
                                <option value="'Outfit', sans-serif" ${style.fontFamily === "'Outfit', sans-serif" ? 'selected' : ''}>Outfit</option>
                                <option value="monospace" ${style.fontFamily === 'monospace' ? 'selected' : ''}>Monospace</option>
                            </select>
                        </div>
                        <div style="width:80px; display:flex; flex-direction:column; gap:6px;">
                            <label style="font-size:11px;">Font Size</label>
                            <input type="text" id="prop-font-size" class="prop-input" value="${style.fontSize || '16px'}" ${isLocked ? 'disabled' : ''}>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
                            <label style="font-size:11px;">Font Weight</label>
                            <select id="prop-font-weight" class="prop-input" ${isLocked ? 'disabled' : ''}>
                                <option value="300" ${style.fontWeight === '300' ? 'selected' : ''}>Light</option>
                                <option value="400" ${style.fontWeight === '400' ? 'selected' : ''}>Normal</option>
                                <option value="600" ${style.fontWeight === '600' ? 'selected' : ''}>Semi-Bold</option>
                                <option value="700" ${style.fontWeight === '700' ? 'selected' : ''}>Bold</option>
                                <option value="900" ${style.fontWeight === '900' ? 'selected' : ''}>Black</option>
                            </select>
                        </div>
                        <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
                            <label style="font-size:11px;">Text Align</label>
                            <select id="prop-text-align" class="prop-input" ${isLocked ? 'disabled' : ''}>
                                <option value="left" ${style.textAlign === 'left' ? 'selected' : ''}>Left</option>
                                <option value="center" ${style.textAlign === 'center' ? 'selected' : ''}>Center</option>
                                <option value="right" ${style.textAlign === 'right' ? 'selected' : ''}>Right</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="prop-group">
                <h4 style="margin:0 0 10px 0; font-size:12px; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.05em;">Colors</h4>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <label style="font-size:12px;">Background Color</label>
                        <input type="color" id="prop-color-bg" value="${style.backgroundColor ? this.rgbaToHex(style.backgroundColor) : '#000000'}" ${isLocked ? 'disabled' : ''}>
                    </div>
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <label style="font-size:12px;">Text Color</label>
                        <input type="color" id="prop-color-text" value="${style.color ? this.rgbaToHex(style.color) : '#ffffff'}" ${isLocked ? 'disabled' : ''}>
                    </div>
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <label style="font-size:12px;">Border Color</label>
                        <input type="color" id="prop-color-border" value="${style.borderColor ? this.rgbaToHex(style.borderColor) : '#1e293b'}" ${isLocked ? 'disabled' : ''}>
                    </div>
                </div>
            </div>

            <div class="prop-group">
                <h4 style="margin:0 0 10px 0; font-size:12px; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.05em;">Spacing & Borders</h4>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-size:11px;">Padding</label>
                        <input type="text" id="prop-padding" class="prop-input" value="${style.padding || '0px'}" ${isLocked ? 'disabled' : ''}>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-size:11px;">Margin</label>
                        <input type="text" id="prop-margin" class="prop-input" value="${style.margin || '0px'}" ${isLocked ? 'disabled' : ''}>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-size:11px;">Border Radius</label>
                        <input type="text" id="prop-border-radius" class="prop-input" value="${style.borderRadius || '0px'}" ${isLocked ? 'disabled' : ''}>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-size:11px;">Opacity</label>
                        <input type="range" id="prop-opacity" min="0" max="1" step="0.1" value="${style.opacity !== undefined ? style.opacity : 1}" ${isLocked ? 'disabled' : ''}>
                    </div>
                </div>
            </div>
        </div>`;
    }

    renderLayersList(page, selectedId) {
        if (!page || page.components.length === 0) {
            return `<div style="color:var(--text-muted); text-align:center; padding:20px 0; font-size:13px;">No layers added yet. Components added to the canvas will appear here.</div>`;
        }

        let layersHtml = `
        <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="font-size:11px; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px; font-weight:700;">Layers Stack</div>
        `;
        
        const compsReversed = [...page.components].reverse();

        compsReversed.forEach(comp => {
            const isSelected = comp.id === selectedId;
            const selectStyle = isSelected ? 'background: var(--primary); color: white;' : 'background: rgba(255,255,255,0.03);';
            const icon = COMPONENT_SCHEMAS[comp.type] ? COMPONENT_SCHEMAS[comp.type].icon : '🧩';

            layersHtml += `
            <div class="layer-item-row" data-id="${comp.id}" style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-radius:8px; border:1px solid var(--border-color); cursor:pointer; ${selectStyle} transition:background 0.2s;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:13px;">${icon}</span>
                    <span style="font-size:12.5px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:85px;" title="${comp.name || comp.type}">${comp.name || comp.type}</span>
                </div>
                <div style="display:flex; gap:4px; align-items:center;">
                    <button class="layer-action-btn layer-lock-btn" title="Toggle Lock" style="background:none; border:none; color:inherit; cursor:pointer; font-size:11px; padding:2px;">${comp.locked ? '🔒' : '🔓'}</button>
                    <button class="layer-action-btn layer-visible-btn" title="Toggle Visibility" style="background:none; border:none; color:inherit; cursor:pointer; font-size:11px; padding:2px;">${comp.visible !== false ? '👁️' : '👁️‍🗨️'}</button>
                    <button class="layer-action-btn layer-up-btn" title="Bring Forward" style="background:none; border:none; color:inherit; cursor:pointer; font-size:11px; padding:2px;">▲</button>
                    <button class="layer-action-btn layer-down-btn" title="Send Backward" style="background:none; border:none; color:inherit; cursor:pointer; font-size:11px; padding:2px;">▼</button>
                    <button class="layer-action-btn layer-delete-btn" title="Delete Layer" style="background:none; border:none; color:inherit; cursor:pointer; font-size:11px; padding:2px;" ${comp.locked ? 'disabled' : ''}>🗑️</button>
                </div>
            </div>`;
        });

        layersHtml += `</div>`;
        return layersHtml;
    }

    bindPropertyInputs(compId) {
        const updateStyle = (key, val) => {
            this.store.updateComponentStyle(compId, { [key]: val });
        };
        const updatePos = (key, val) => {
            this.store.updateComponentPosition(compId, { [key]: parseInt(val) || 0 });
        };

        const addListener = (id, eventType, callback) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(eventType, callback);
        };

        // Settings toggles lock & visibility
        addListener('prop-btn-lock', 'click', () => {
            this.store.toggleComponentLock(compId);
        });
        addListener('prop-btn-visible', 'click', () => {
            this.store.toggleComponentVisibility(compId);
        });

        addListener('prop-comp-name', 'input', e => {
            const page = this.store.state.pages.find(p => p.id === this.store.state.activePageId);
            if (!page) return;
            const comp = page.components.find(c => c.id === compId);
            if (comp) comp.name = e.target.value;
            this.store.notify();
        });

        // Positions
        addListener('prop-pos-left', 'input', e => updatePos('left', e.target.value));
        addListener('prop-pos-top', 'input', e => updatePos('top', e.target.value));
        addListener('prop-pos-width', 'input', e => updatePos('width', e.target.value));
        addListener('prop-pos-height', 'input', e => updatePos('height', e.target.value));
        addListener('prop-pos-rotate', 'input', e => updatePos('rotate', e.target.value));
        addListener('prop-pos-zindex', 'input', e => updatePos('zIndex', e.target.value));

        // Typography
        addListener('prop-font-family', 'change', e => updateStyle('fontFamily', e.target.value));
        addListener('prop-font-size', 'input', e => updateStyle('fontSize', e.target.value));
        addListener('prop-font-weight', 'change', e => updateStyle('fontWeight', e.target.value));
        addListener('prop-text-align', 'change', e => updateStyle('textAlign', e.target.value));

        // Colors
        addListener('prop-color-bg', 'input', e => updateStyle('backgroundColor', e.target.value));
        addListener('prop-color-text', 'input', e => updateStyle('color', e.target.value));
        addListener('prop-color-border', 'input', e => updateStyle('borderColor', e.target.value));

        // Spacing & opacity
        addListener('prop-padding', 'input', e => updateStyle('padding', e.target.value));
        addListener('prop-margin', 'input', e => updateStyle('margin', e.target.value));
        addListener('prop-border-radius', 'input', e => updateStyle('borderRadius', e.target.value));
        addListener('prop-opacity', 'input', e => updateStyle('opacity', parseFloat(e.target.value)));
    }

    bindLayersListEvents() {
        const listContainer = this.container.querySelector('.panel-body-content');
        if (!listContainer) return;

        listContainer.addEventListener('click', e => {
            const row = e.target.closest('.layer-item-row');
            if (!row) return;

            const compId = row.getAttribute('data-id');
            
            const actionBtn = e.target.closest('.layer-action-btn');
            if (actionBtn) {
                e.stopPropagation();
                
                if (actionBtn.classList.contains('layer-lock-btn')) {
                    this.store.toggleComponentLock(compId);
                }
                else if (actionBtn.classList.contains('layer-visible-btn')) {
                    this.store.toggleComponentVisibility(compId);
                }
                else if (actionBtn.classList.contains('layer-up-btn')) {
                    // Bring forward (+1 in array order)
                    this.store.moveComponentOrder(compId, 1);
                }
                else if (actionBtn.classList.contains('layer-down-btn')) {
                    // Send backward (-1 in array order)
                    this.store.moveComponentOrder(compId, -1);
                }
                else if (actionBtn.classList.contains('layer-delete-btn')) {
                    this.store.deleteComponent(compId);
                }
                return;
            }

            this.store.setSelection(compId);
        });
    }

    syncValues() {
        if (this.activeTab !== 'properties' || !this.activeCompId) return;

        const page = this.store.state.pages.find(p => p.id === this.store.state.activePageId);
        const comp = page ? page.components.find(c => c.id === this.activeCompId) : null;
        if (!comp) return;

        const style = comp.style || {};
        const pos = comp.position || { left: 0, top: 0, width: 0, height: 0, rotate: 0, zIndex: 1 };

        const syncVal = (id, val) => {
            const el = document.getElementById(id);
            if (el && el !== document.activeElement) el.value = val;
        };

        syncVal('prop-comp-name', comp.name || '');
        
        syncVal('prop-pos-left', pos.left);
        syncVal('prop-pos-top', pos.top);
        syncVal('prop-pos-width', pos.width);
        syncVal('prop-pos-height', pos.height);
        syncVal('prop-pos-rotate', pos.rotate);
        syncVal('prop-pos-zindex', pos.zIndex);

        syncVal('prop-font-family', style.fontFamily || 'sans-serif');
        syncVal('prop-font-size', style.fontSize || '16px');
        syncVal('prop-font-weight', style.fontWeight || '400');
        syncVal('prop-text-align', style.textAlign || 'left');

        syncVal('prop-color-bg', this.rgbaToHex(style.backgroundColor));
        syncVal('prop-color-text', this.rgbaToHex(style.color));
        syncVal('prop-color-border', this.rgbaToHex(style.borderColor));

        syncVal('prop-padding', style.padding || '0px');
        syncVal('prop-margin', style.margin || '0px');
        syncVal('prop-border-radius', style.borderRadius || '0px');
        syncVal('prop-opacity', style.opacity !== undefined ? style.opacity : 1);
    }

    rgbaToHex(rgbaStr) {
        if (!rgbaStr) return '#000000';
        if (rgbaStr.startsWith('#')) return rgbaStr;
        
        const parts = rgbaStr.match(/\d+(\.\d+)?/g);
        if (!parts || parts.length < 3) return '#000000';

        const r = parseInt(parts[0]);
        const g = parseInt(parts[1]);
        const b = parseInt(parts[2]);

        const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return hex;
    }
}
