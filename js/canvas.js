// js/canvas.js
import { renderComponentHTML, COMPONENT_SCHEMAS } from './components.js';

export class CanvasEditor {
    constructor(store) {
        this.store = store;
        this.canvas = null;
        this.zoomContainer = null;
        this.dragState = null;
        this.activeGuides = { x: [], y: [] };
    }

    init(canvasId, zoomContainerId) {
        this.canvas = document.getElementById(canvasId);
        this.zoomContainer = document.getElementById(zoomContainerId);
        
        this.store.subscribe(state => this.render(state));
        this.bindEvents();
    }

    bindEvents() {
        // Drag over container for library drag-drop
        this.canvas.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        this.canvas.addEventListener('drop', e => {
            e.preventDefault();
            const photoUrl = e.dataTransfer.getData('image-src');
            const type = e.dataTransfer.getData('text/plain');

            const rect = this.canvas.getBoundingClientRect();
            const scale = (this.store.state.zoom || 100) / 100;
            const left = Math.round((e.clientX - rect.left) / scale);
            const top = Math.round((e.clientY - rect.top) / scale);

            // 1. Drag-to-replace check: Check if dropped directly on an existing <img> or element inside a media component
            const targetItem = e.target.closest('.canvas-item, .section-item');
            if (photoUrl && targetItem) {
                const compId = targetItem.getAttribute('data-id');
                const page = this.store.state.pages.find(p => p.id === this.store.state.activePageId);
                const comp = page ? page.components.find(c => c.id === compId) : null;
                
                if (comp) {
                    const updates = {};
                    if ('src' in comp.content) updates.src = photoUrl;
                    if ('imgUrl' in comp.content) updates.imgUrl = photoUrl;
                    
                    if (Object.keys(updates).length > 0) {
                        this.store.updateComponentContent(compId, updates);
                        return;
                    }
                }
            }

            // 2. Drag-to-instantiate a new component
            if (photoUrl) {
                const schema = COMPONENT_SCHEMAS['media-image'];
                this.store.addComponent({
                    type: 'media-image',
                    name: 'Stock Photo',
                    style: JSON.parse(JSON.stringify(schema.defaultStyle)),
                    content: {
                        src: photoUrl,
                        alt: 'Dropped stock photo'
                    },
                    position: {
                        left: Math.max(0, left - 160),
                        top: Math.max(0, top - 100),
                        width: 320,
                        height: 200,
                        rotate: 0,
                        zIndex: 10
                    }
                });
            } else if (type && COMPONENT_SCHEMAS[type]) {
                const schema = COMPONENT_SCHEMAS[type];
                this.store.addComponent({
                    type: type,
                    name: schema.name,
                    style: JSON.parse(JSON.stringify(schema.defaultStyle)),
                    content: JSON.parse(JSON.stringify(schema.defaultContent)),
                    position: {
                        left: Math.max(0, left - 175),
                        top: Math.max(0, top - 60),
                        width: schema.defaultStyle.width ? parseInt(schema.defaultStyle.width) || 350 : 350,
                        height: schema.defaultStyle.height ? parseInt(schema.defaultStyle.height) || 120 : 120,
                        rotate: 0,
                        zIndex: 10
                    }
                });
            }
        });

        // Click selection and dragging triggers
        this.canvas.addEventListener('mousedown', e => {
            const itemEl = e.target.closest('.canvas-item, .section-item');
            if (!itemEl) {
                if (e.target === this.canvas || e.target === this.zoomContainer) {
                    this.store.setSelection(null);
                }
                return;
            }

            const compId = itemEl.getAttribute('data-id');
            const state = this.store.state;
            const page = state.pages.find(p => p.id === state.activePageId);
            let comp = page ? page.components.find(c => c.id === compId) : null;

            if (!comp) return;

            // Handle lock selection
            if (comp.locked) {
                if (state.selectedComponentId !== compId) {
                    this.store.setSelection(compId);
                }
                
                // Allow delete/unlock click even if locked
                const deleteBtn = e.target.closest('.delete-btn');
                if (deleteBtn) {
                    // Lock toggle is done via properties panel, delete button is ignored for locked components
                }
                return;
            }

            // Select
            if (state.selectedComponentId !== compId) {
                this.store.setSelection(compId);
            }

            // Check if user clicked a handle
            const handleEl = e.target.closest('.resize-handle, .rotation-handle, .duplicate-btn, .delete-btn, .move-up-btn, .move-down-btn');
            
            if (handleEl) {
                if (handleEl.classList.contains('duplicate-btn')) {
                    this.store.duplicateComponent(compId);
                    return;
                }
                if (handleEl.classList.contains('delete-btn')) {
                    this.store.deleteComponent(compId);
                    return;
                }
                if (handleEl.classList.contains('move-up-btn')) {
                    // Move component up in order (towards index 0)
                    this.store.moveComponentOrder(compId, -1);
                    return;
                }
                if (handleEl.classList.contains('move-down-btn')) {
                    // Move component down in order
                    this.store.moveComponentOrder(compId, 1);
                    return;
                }
                
                // Resize or Rotate dragging
                e.preventDefault();
                const isResize = handleEl.classList.contains('resize-handle');
                const handleDir = isResize ? handleEl.className.replace('resize-handle ', '') : 'rotate';
                
                this.dragState = {
                    type: isResize ? 'resize' : 'rotate',
                    compId,
                    handleDir,
                    startX: e.clientX,
                    startY: e.clientY,
                    startPos: { ...comp.position }
                };
            } else {
                // Drag move (Canva mode)
                if (state.activeMode === 'canva') {
                    if (e.target.classList.contains('editable-text') && e.target.getAttribute('contenteditable') === 'true') {
                        return; // Edit inline text, don't drag
                    }
                    
                    e.preventDefault();

                    // Option/Alt Drag Duplication (Figma standard)
                    if (e.altKey) {
                        this.store.duplicateComponent(compId);
                        const nextState = this.store.state;
                        const dupeId = nextState.selectedComponentId;
                        const dupeComp = page.components.find(c => c.id === dupeId);
                        
                        this.dragState = {
                            type: 'move',
                            compId: dupeId,
                            startX: e.clientX,
                            startY: e.clientY,
                            startPos: { ...dupeComp.position }
                        };
                    } else {
                        this.dragState = {
                            type: 'move',
                            compId,
                            startX: e.clientX,
                            startY: e.clientY,
                            startPos: { ...comp.position }
                        };
                    }
                }
            }
        });

        // Double click inline editing (Text & Images)
        this.canvas.addEventListener('dblclick', e => {
            const imgEl = e.target.closest('img');
            if (imgEl) {
                const itemEl = imgEl.closest('.canvas-item, .section-item');
                if (!itemEl) return;
                const compId = itemEl.getAttribute('data-id');
                const src = prompt('Enter Image Source URL:', imgEl.getAttribute('src'));
                if (src && src.trim() && src.trim() !== imgEl.getAttribute('src')) {
                    this.store.updateComponentContent(compId, { src: src.trim(), imgUrl: src.trim() });
                }
                return;
            }

            const textEl = e.target.closest('.editable-text');
            if (!textEl) return;

            const itemEl = textEl.closest('.canvas-item, .section-item');
            if (!itemEl) return;

            const compId = itemEl.getAttribute('data-id');
            const prop = textEl.getAttribute('data-prop');
            
            textEl.setAttribute('contenteditable', 'true');
            textEl.focus();

            const range = document.createRange();
            range.selectNodeContents(textEl);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

            const onBlur = () => {
                textEl.removeAttribute('contenteditable');
                textEl.removeEventListener('blur', onBlur);
                textEl.removeEventListener('keydown', onKeydown);
                
                const val = textEl.innerText.trim();
                this.store.updateComponentContent(compId, { [prop]: val });
            };

            const onKeydown = evt => {
                if (evt.key === 'Enter' && !evt.shiftKey) {
                    evt.preventDefault();
                    textEl.blur();
                }
            };

            textEl.addEventListener('blur', onBlur);
            textEl.addEventListener('keydown', onKeydown);
        });

        // Global mouse moves for active drags
        window.addEventListener('mousemove', e => {
            if (!this.dragState) return;

            const scale = (this.store.state.zoom || 100) / 100;
            const dx = (e.clientX - this.dragState.startX) / scale;
            const dy = (e.clientY - this.dragState.startY) / scale;
            const compId = this.dragState.compId;
            const startPos = this.dragState.startPos;

            const page = this.store.state.pages.find(p => p.id === this.store.state.activePageId);
            if (!page) return;
            const comp = page.components.find(c => c.id === compId);
            if (!comp) return;

            if (this.dragState.type === 'move') {
                let left = startPos.left + dx;
                let top = startPos.top + dy;
                
                // Snapping
                const snapSize = 10;
                left = Math.round(left / snapSize) * snapSize;
                top = Math.round(top / snapSize) * snapSize;

                // Alignment Guides
                const guides = this.calculateAlignment(compId, left, top, startPos.width, startPos.height, page.components);
                if (guides.snapX !== null) left = guides.snapX;
                if (guides.snapY !== null) top = guides.snapY;

                this.store.updateComponentPosition(compId, { left, top });
                this.updateHUDCoordinates(left, top, startPos.width, startPos.height);
            }
            
            else if (this.dragState.type === 'resize') {
                const dir = this.dragState.handleDir;
                let left = startPos.left;
                let top = startPos.top;
                let width = startPos.width;
                let height = startPos.height;

                if (dir.includes('e')) width = Math.max(50, startPos.width + dx);
                if (dir.includes('s')) height = Math.max(20, startPos.height + dy);
                
                if (dir.includes('w')) {
                    const possibleWidth = startPos.width - dx;
                    if (possibleWidth > 50) {
                        width = possibleWidth;
                        left = startPos.left + dx;
                    }
                }
                if (dir.includes('n')) {
                    const possibleHeight = startPos.height - dy;
                    if (possibleHeight > 20) {
                        height = possibleHeight;
                        top = startPos.top + dy;
                    }
                }

                this.store.updateComponentPosition(compId, { left, top, width, height });
                this.updateHUDCoordinates(left, top, width, height);
            }
            
            else if (this.dragState.type === 'rotate') {
                const itemEl = this.canvas.querySelector(`[data-id="${compId}"]`);
                if (!itemEl) return;
                
                const itemRect = itemEl.getBoundingClientRect();
                const centerX = itemRect.left + itemRect.width / 2;
                const centerY = itemRect.top + itemRect.height / 2;
                
                const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                let angleDeg = Math.round(angleRad * (180 / Math.PI)) + 90; // offset top anchor
                
                if (e.shiftKey) {
                    angleDeg = Math.round(angleDeg / 15) * 15;
                }
                
                if (angleDeg < 0) angleDeg += 360;
                angleDeg = angleDeg % 360;

                this.store.updateComponentPosition(compId, { rotate: angleDeg });
            }
        });

        window.addEventListener('mouseup', () => {
            if (this.dragState) {
                this.dragState = null;
                this.activeGuides = { x: [], y: [] };
                this.removeAlignmentLines();
                
                const hud = document.getElementById('figma-coords-hud');
                if (hud) hud.style.display = 'none';
            }
        });

        // Sync horizontal and vertical Rulers scrolling offsets
        this.zoomContainer.addEventListener('scroll', () => {
            const rulerX = document.getElementById('figma-ruler-x');
            const rulerY = document.getElementById('figma-ruler-y');
            if (rulerX) rulerX.scrollLeft = this.zoomContainer.scrollLeft;
            if (rulerY) rulerY.scrollTop = this.zoomContainer.scrollTop;
        });

        // Keyboard Selection Nudges (Arrow keys movement)
        window.addEventListener('keydown', e => {
            const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.getAttribute('contenteditable') === 'true';
            if (isInput) return;

            const selectedId = this.store.state.selectedComponentId;
            if (!selectedId) return;

            const page = this.store.state.pages.find(p => p.id === this.store.state.activePageId);
            const comp = page ? page.components.find(c => c.id === selectedId) : null;
            if (!comp || comp.locked) return;

            const step = e.shiftKey ? 10 : 1;

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.store.updateComponentPosition(selectedId, { left: comp.position.left - step });
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.store.updateComponentPosition(selectedId, { left: comp.position.left + step });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.store.updateComponentPosition(selectedId, { top: comp.position.top - step });
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.store.updateComponentPosition(selectedId, { top: comp.position.top + step });
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.store.setSelection(null);
            }
        });
    }

    calculateAlignment(activeId, left, top, width, height, allComps) {
        const threshold = 5;
        const result = { snapX: null, snapY: null };
        this.activeGuides = { x: [], y: [] };

        const targetRight = left + width;
        const targetBottom = top + height;
        const targetCenterX = left + width / 2;
        const targetCenterY = top + height / 2;

        allComps.forEach(comp => {
            if (comp.id === activeId || !comp.position || comp.visible === false) return;

            const p = comp.position;
            const compRight = p.left + p.width;
            const compBottom = p.top + p.height;
            const compCenterX = p.left + p.width / 2;
            const compCenterY = p.top + p.height / 2;

            // X-AXIS ALIGNMENTS
            if (Math.abs(left - p.left) < threshold) {
                result.snapX = p.left;
                this.activeGuides.x.push(p.left);
            } else if (Math.abs(targetRight - compRight) < threshold) {
                result.snapX = compRight - width;
                this.activeGuides.x.push(compRight);
            } else if (Math.abs(left - compRight) < threshold) {
                result.snapX = compRight;
                this.activeGuides.x.push(compRight);
            } else if (Math.abs(targetRight - p.left) < threshold) {
                result.snapX = p.left - width;
                this.activeGuides.x.push(p.left);
            } else if (Math.abs(targetCenterX - compCenterX) < threshold) {
                result.snapX = compCenterX - width / 2;
                this.activeGuides.x.push(compCenterX);
            }

            // Y-AXIS ALIGNMENTS
            if (Math.abs(top - p.top) < threshold) {
                result.snapY = p.top;
                this.activeGuides.y.push(p.top);
            } else if (Math.abs(targetBottom - compBottom) < threshold) {
                result.snapY = compBottom - height;
                this.activeGuides.y.push(compBottom);
            } else if (Math.abs(top - compBottom) < threshold) {
                result.snapY = compBottom;
                this.activeGuides.y.push(compBottom);
            } else if (Math.abs(targetBottom - p.top) < threshold) {
                result.snapY = p.top - height;
                this.activeGuides.y.push(p.top);
            } else if (Math.abs(targetCenterY - compCenterY) < threshold) {
                result.snapY = compCenterY - height / 2;
                this.activeGuides.y.push(compCenterY);
            }
        });

        this.renderAlignmentLines();
        return result;
    }

    renderAlignmentLines() {
        this.removeAlignmentLines();
        
        this.activeGuides.x.forEach(xPos => {
            const line = document.createElement('div');
            line.className = 'alignment-guide vertical';
            line.style.left = `${xPos}px`;
            this.canvas.appendChild(line);
        });

        this.activeGuides.y.forEach(yPos => {
            const line = document.createElement('div');
            line.className = 'alignment-guide horizontal';
            line.style.top = `${yPos}px`;
            this.canvas.appendChild(line);
        });
    }

    removeAlignmentLines() {
        const lines = this.canvas.querySelectorAll('.alignment-guide');
        lines.forEach(l => l.remove());
    }

    renderRulers(zoom) {
        const rulerX = document.getElementById('figma-ruler-x');
        const rulerY = document.getElementById('figma-ruler-y');
        if (!rulerX || !rulerY) return;

        rulerX.innerHTML = '<div style="width: 3000px; height: 100%; position: relative;"></div>';
        rulerY.innerHTML = '<div style="height: 3000px; width: 100%; position: relative;"></div>';

        const rxContainer = rulerX.firstElementChild;
        const ryContainer = rulerY.firstElementChild;

        const scale = zoom / 100;
        const limit = 2000;

        // Render horizontal ticks every 10px, numbers every 100px
        for (let i = 0; i <= limit; i += 10) {
            const scaled = i * scale;
            const tick = document.createElement('div');
            tick.className = `ruler-tick ${i % 100 === 0 ? 'major' : i % 50 === 0 ? 'medium' : 'minor'}`;
            tick.style.left = `${scaled}px`;
            rxContainer.appendChild(tick);

            if (i % 100 === 0) {
                const val = document.createElement('span');
                val.className = 'ruler-val';
                val.style.left = `${scaled + 4}px`;
                val.innerText = i;
                rxContainer.appendChild(val);
            }
        }

        // Render vertical ticks
        for (let i = 0; i <= limit; i += 10) {
            const scaled = i * scale;
            const tick = document.createElement('div');
            tick.className = `ruler-tick ${i % 100 === 0 ? 'major' : i % 50 === 0 ? 'medium' : 'minor'}`;
            tick.style.top = `${scaled}px`;
            ryContainer.appendChild(tick);

            if (i % 100 === 0) {
                const val = document.createElement('span');
                val.className = 'ruler-val';
                val.style.top = `${scaled + 2}px`;
                val.innerText = i;
                ryContainer.appendChild(val);
            }
        }

        // Sync scrolled position immediately
        rulerX.scrollLeft = this.zoomContainer.scrollLeft;
        rulerY.scrollTop = this.zoomContainer.scrollTop;
    }

    updateHUDCoordinates(left, top, w, h) {
        let hud = document.getElementById('figma-coords-hud');
        if (!hud) {
            hud = document.createElement('div');
            hud.id = 'figma-coords-hud';
            hud.className = 'coords-hud-tooltip';
            this.canvas.appendChild(hud);
        }
        hud.style.display = 'block';
        hud.style.left = `${left}px`;
        hud.style.top = `${top - 28}px`;
        hud.innerText = `X: ${left}  Y: ${top}  W: ${w}  H: ${h}`;
    }

    render(state) {
        if (!this.canvas) return;

        this.canvas.setAttribute('data-mode', state.activeMode);

        const scaleVal = state.zoom / 100;
        this.zoomContainer.style.transform = `scale(${scaleVal})`;
        
        // Draw Figma rulers
        this.renderRulers(state.zoom);
        
        const page = state.pages.find(p => p.id === state.activePageId);
        if (!page) {
            this.canvas.innerHTML = '';
            return;
        }

        const selectedId = state.selectedComponentId;
        const isCanva = state.activeMode === 'canva';

        if (isCanva) {
            this.canvas.classList.add('canva-mode');
            this.canvas.classList.remove('sections-mode');
            this.canvas.style.minHeight = '1400px';
        } else {
            this.canvas.classList.remove('canva-mode');
            this.canvas.classList.add('sections-mode');
            this.canvas.style.minHeight = '100%';
        }

        let htmlContent = '';
        page.components.forEach(comp => {
            const styleStr = Object.entries(comp.style || {})
                .map(([key, val]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${val};`)
                .join(' ');
            
            const contentHTML = renderComponentHTML(comp);
            const isSelected = comp.id === selectedId;
            const selectClass = isSelected ? 'selected' : '';
            const idAttr = `data-id="${comp.id}"`;
            
            // Locked & Visibility classes
            const isLocked = comp.locked === true;
            const isHidden = comp.visible === false;
            
            const lockClass = isLocked ? 'locked-item' : '';
            const hiddenClass = isHidden ? 'hidden-item' : '';

            if (isCanva) {
                const pos = comp.position || { left: 50, top: 100, width: 400, height: 100, rotate: 0, zIndex: 1 };
                const posStr = `position: absolute; left: ${pos.left}px; top: ${pos.top}px; width: ${pos.width}px; height: ${pos.height}px; transform: rotate(${pos.rotate}deg); z-index: ${pos.zIndex};`;
                
                htmlContent += `
                <div class="canvas-item ${selectClass} ${lockClass} ${hiddenClass}" ${idAttr} style="${posStr} ${styleStr}">
                    <div class="canvas-item-wrapper" style="width: 100%; height: 100%;">
                        ${contentHTML}
                    </div>
                    
                    <!-- Locked indicator badge overlays -->
                    ${isLocked ? `<div class="lock-indicator-badge">🔒 Locked</div>` : ''}
                    ${isHidden ? `<div class="hidden-indicator-badge">👁️‍🗨️ Hidden in Build</div>` : ''}
                    
                    <div class="item-outline"></div>

                    <!-- Only show handles if unlocked -->
                    ${!isLocked ? `
                    <div class="resize-handle n"></div>
                    <div class="resize-handle s"></div>
                    <div class="resize-handle e"></div>
                    <div class="resize-handle w"></div>
                    <div class="resize-handle ne"></div>
                    <div class="resize-handle nw"></div>
                    <div class="resize-handle se"></div>
                    <div class="resize-handle sw"></div>
                    <div class="rotation-handle" title="Rotate element"></div>
                    ` : ''}

                    <div class="item-mini-actions">
                        <button class="mini-btn duplicate-btn" title="Duplicate">📑</button>
                        <button class="mini-btn delete-btn" title="Delete">🗑️</button>
                    </div>
                </div>`;
            } else {
                // WordPress Block / Section Mode
                htmlContent += `
                <div class="section-item ${selectClass} ${lockClass} ${hiddenClass}" ${idAttr}>
                    <div class="section-item-wrapper" style="${styleStr}">
                        ${contentHTML}
                    </div>
                    
                    ${isLocked ? `<div class="lock-indicator-badge">🔒 Locked Block</div>` : ''}
                    ${isHidden ? `<div class="hidden-indicator-badge">👁️‍🗨️ Hidden Block</div>` : ''}

                    <div class="item-outline"></div>

                    <!-- Action buttons (includes Block Move buttons) -->
                    <div class="item-mini-actions">
                        <button class="mini-btn move-up-btn" title="Move Block Up">▲</button>
                        <button class="mini-btn move-down-btn" title="Move Block Down">▼</button>
                        <button class="mini-btn duplicate-btn" title="Duplicate">📑</button>
                        <button class="mini-btn delete-btn" title="Delete" ${isLocked ? 'disabled' : ''}>🗑️</button>
                    </div>
                </div>`;
            }
        });

        if (page.components.length === 0) {
            htmlContent = `
            <div class="canvas-empty-state">
                <div style="font-size: 3.5rem; margin-bottom: 20px; animation: bounce 2s infinite;">⚡</div>
                <h2>Your Workspace Canvas is Ready</h2>
                <p>Use the floating generator button, describe what you want, or drag layouts from the icon sidebar panels directly.</p>
                <div style="display:flex; gap:12px; margin-top:20px; justify-content:center;">
                    <button class="btn btn-outline" id="empty-state-suggest-btn">💡 Load Sample Template</button>
                </div>
            </div>`;
        }

        this.canvas.innerHTML = htmlContent;

        const suggestBtn = this.canvas.querySelector('#empty-state-suggest-btn');
        if (suggestBtn) {
            suggestBtn.addEventListener('click', () => {
                if (window.appInstance) {
                    window.appInstance.openTemplatesModal();
                }
            });
        }
    }
}
