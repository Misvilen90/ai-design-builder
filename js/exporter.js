// js/exporter.js
import { renderComponentHTML, styleObjectToCss } from './components.js';

export class CodeExporter {
    constructor(store) {
        this.store = store;
    }

    exportHTML(pageId) {
        const page = this.store.state.pages.find(p => p.id === pageId) || this.store.state.pages[0];
        if (!page) return '';

        const isCanva = this.store.state.activeMode === 'canva';
        let bodyContent = '';

        if (isCanva) {
            bodyContent = `
    <!-- Canva Coordinate Absolute Layout -->
    <div class="canvas-wrapper" style="position: relative; width: 100%; min-height: 1200px; overflow: hidden; background: #0b0f19;">
        ${page.components.map(comp => {
            const p = comp.position || { left: 50, top: 100, width: 350, height: 120, rotate: 0, zIndex: 1 };
            const styleStr = styleObjectToCss(comp.style);
            const contentHTML = this.getCleanComponentInner(comp);
            
            return `
        <div style="position: absolute; left: ${p.left}px; top: ${p.top}px; width: ${p.width}px; height: ${p.height}px; transform: rotate(${p.rotate}deg); z-index: ${p.zIndex}; ${styleStr}">
            ${contentHTML}
        </div>`;
        }).join('')}
    </div>`;
        } else {
            bodyContent = `
    <!-- Section Stack Stacked Layout -->
    <div class="sections-wrapper" style="display: flex; flex-direction: column; width: 100%; gap: 20px; background: #0f172a; padding: 20px;">
        ${page.components.map(comp => {
            const styleStr = styleObjectToCss(comp.style);
            const contentHTML = this.getCleanComponentInner(comp);
            
            return `
        <section style="${styleStr}">
            <div class="container" style="max-width: 1200px; margin: 0 auto; width:100%;">
                ${contentHTML}
            </div>
        </section>`;
        }).join('')}
    </div>`;
        }

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.name} - AI Generated</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --accent: #a855f7;
            --border-color: #1e293b;
            --text-main: #f1f5f9;
            --text-muted: #94a3b8;
            --card-bg: #101726;
            --panel-bg: rgba(16, 23, 38, 0.75);
        }
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background-color: #090d16;
            color: #f1f5f9;
        }
    </style>
</head>
<body>
    ${bodyContent}
</body>
</html>`;
    }

    exportCSS(pageId) {
        const page = this.store.state.pages.find(p => p.id === pageId) || this.store.state.pages[0];
        if (!page) return '';

        let css = `/* Global Stylesheet for ${page.name} */\n\n`;
        page.components.forEach((comp, idx) => {
            const styleStr = Object.entries(comp.style || {})
                .map(([key, val]) => {
                    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    return `    ${cssKey}: ${val};`;
                })
                .join('\n');
            
            css += `.element-${comp.id || idx} {\n${styleStr}\n}\n\n`;
        });
        return css;
    }

    exportReact(pageId) {
        const page = this.store.state.pages.find(p => p.id === pageId) || this.store.state.pages[0];
        if (!page) return '';

        const isCanva = this.store.state.activeMode === 'canva';
        let bodyContent = '';

        if (isCanva) {
            bodyContent = `
    return (
        <div className="canvas-wrapper" style={{ position: 'relative', width: '100%', minHeight: '1200px', overflow: 'hidden', background: '#0b0f19' }}>
            {/* Canva Coordinate Layout */}
            ${page.components.map(comp => {
                const p = comp.position || { left: 50, top: 100, width: 350, height: 120, rotate: 0, zIndex: 1 };
                const reactStyle = this.getReactStyleObject(comp.style);
                const contentHTML = this.getReactCleanInner(comp);
                
                return `
            <div style={{ position: 'absolute', left: '${p.left}px', top: '${p.top}px', width: '${p.width}px', height: '${p.height}px', transform: 'rotate(${p.rotate}deg)', zIndex: ${p.zIndex}, ...${JSON.stringify(reactStyle)} }}>
                ${contentHTML}
            </div>`;
            }).join('')}
        </div>
    );`;
        } else {
            bodyContent = `
    return (
        <div className="sections-wrapper" style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '20px', background: '#0f172a', padding: '20px' }}>
            {/* Stacked block layout */}
            ${page.components.map(comp => {
                const reactStyle = this.getReactStyleObject(comp.style);
                const contentHTML = this.getReactCleanInner(comp);
                
                return `
            <section style={${JSON.stringify(reactStyle)}}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                    ${contentHTML}
                </div>
            </section>`;
            }).join('')}
        </div>
    );`;
        }

        const componentName = page.name.replace(/[^a-zA-Z0-9]/g, '');

        return `import React from 'react';

export default function ${componentName}Page() {
${bodyContent}
}`;
    }

    exportTailwind(pageId) {
        const page = this.store.state.pages.find(p => p.id === pageId) || this.store.state.pages[0];
        if (!page) return '';

        const isCanva = this.store.state.activeMode === 'canva';
        let bodyContent = '';

        if (isCanva) {
            bodyContent = `
    <!-- Canva Coordinate Absolute Layout -->
    <div class="relative w-full min-h-[1200px] overflow-hidden bg-slate-950">
        ${page.components.map(comp => {
            const p = comp.position || { left: 50, top: 100, width: 350, height: 120, rotate: 0, zIndex: 1 };
            const tailwindClass = this.cssToTailwind(comp.style);
            const contentHTML = this.getCleanComponentInner(comp);
            
            // Retain coordinate styles because coordinates are absolute values
            return `
        <div class="absolute ${tailwindClass}" style="left: ${p.left}px; top: ${p.top}px; width: ${p.width}px; height: ${p.height}px; transform: rotate(${p.rotate}deg); z-index: ${p.zIndex};">
            ${contentHTML}
        </div>`;
        }).join('')}
    </div>`;
        } else {
            bodyContent = `
    <!-- Section Stack Stacked Layout -->
    <div class="flex flex-col w-full gap-5 bg-slate-900 p-5">
        ${page.components.map(comp => {
            const tailwindClass = this.cssToTailwind(comp.style);
            const contentHTML = this.getCleanComponentInner(comp);
            
            return `
        <section class="${tailwindClass}">
            <div class="max-w-[1200px] mx-auto w-full">
                ${contentHTML}
            </div>
        </section>`;
        }).join('')}
    </div>`;
        }

        return bodyContent;
    }

    exportJSON() {
        return JSON.stringify(this.store.state.pages, null, 2);
    }

    // UTILITIES
    getCleanComponentInner(comp) {
        // Strip text editing tags and helper markers
        let rawHtml = renderComponentHTML(comp);
        rawHtml = rawHtml.replace(/class="editable-text"/g, '');
        rawHtml = rawHtml.replace(/data-prop="[^"]*"/g, '');
        rawHtml = rawHtml.replace(/contenteditable="[^"]*"/g, '');
        return rawHtml;
    }

    getReactCleanInner(comp) {
        let clean = this.getCleanComponentInner(comp);
        // Replace HTML tags with React JSX attributes
        clean = clean.replace(/class=/g, 'className=');
        clean = clean.replace(/style="([^"]*)"/g, (match, p1) => {
            const inlineStyles = p1.split(';').filter(Boolean);
            const obj = {};
            inlineStyles.forEach(s => {
                const [k, v] = s.split(':');
                const key = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                obj[key] = v.trim();
            });
            return `style={${JSON.stringify(obj)}}`;
        });
        return clean;
    }

    getReactStyleObject(styleObj) {
        const reactStyle = {};
        Object.entries(styleObj || {}).forEach(([k, v]) => {
            // keep standard keys
            reactStyle[k] = v;
        });
        return reactStyle;
    }

    cssToTailwind(styleObj) {
        if (!styleObj) return '';

        const classes = [];
        
        // Map common properties to Tailwind
        if (styleObj.backgroundColor) {
            const bg = styleObj.backgroundColor;
            if (bg.includes('rgba(99, 102, 241')) classes.push('bg-indigo-600/10');
            else if (bg.includes('rgba(255, 255, 255')) classes.push('bg-white/5');
            else if (bg === 'transparent') classes.push('bg-transparent');
            else if (bg.startsWith('#')) classes.push(`bg-[${bg}]`);
        }

        if (styleObj.background) {
            const bg = styleObj.background;
            if (bg.includes('linear-gradient')) {
                classes.push('bg-gradient-to-r from-purple-500 to-pink-500');
            } else if (bg.startsWith('#')) {
                classes.push(`bg-[${bg}]`);
            }
        }

        if (styleObj.color) {
            const color = styleObj.color;
            if (color === 'var(--text-main)') classes.push('text-slate-100');
            else if (color === 'var(--text-muted)') classes.push('text-slate-400');
            else if (color.startsWith('#')) classes.push(`text-[${color}]`);
        }

        if (styleObj.padding) {
            const p = styleObj.padding;
            if (p === '24px') classes.push('p-6');
            else if (p === '20px') classes.push('p-5');
            else if (p === '16px') classes.push('p-4');
            else if (p === '12px') classes.push('p-3');
            else if (p.includes(' ')) classes.push(`p-[${p}]`);
        }

        if (styleObj.borderRadius) {
            const br = styleObj.borderRadius;
            if (br === '8px') classes.push('rounded-lg');
            else if (br === '12px') classes.push('rounded-xl');
            else if (br === '16px') classes.push('rounded-2xl');
            else if (br === '30px') classes.push('rounded-full');
        }

        if (styleObj.fontSize) {
            const fs = styleObj.fontSize;
            if (fs === '36px') classes.push('text-4xl');
            else if (fs === '32px') classes.push('text-3xl');
            else if (fs === '16px') classes.push('text-base');
            else if (fs === '14px') classes.push('text-sm');
            else if (fs === '12px') classes.push('text-xs');
        }

        if (styleObj.fontWeight) {
            const fw = styleObj.fontWeight;
            if (fw === '700' || fw === 'bold') classes.push('font-bold');
            else if (fw === '800') classes.push('font-extrabold');
            else if (fw === '600') classes.push('font-semibold');
            else if (fw === '300') classes.push('font-light');
        }

        if (styleObj.textAlign) {
            classes.push(`text-${styleObj.textAlign}`);
        }

        if (styleObj.borderStyle && styleObj.borderStyle !== 'none') {
            classes.push('border');
            if (styleObj.borderStyle === 'dashed') classes.push('border-dashed');
            if (styleObj.borderStyle === 'dotted') classes.push('border-dotted');
        }

        if (styleObj.opacity !== undefined) {
            classes.push(`opacity-[${styleObj.opacity}]`);
        }

        return classes.join(' ');
    }
}
