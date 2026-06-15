import React, { useState } from 'react';
import { useBuilderStore, BuilderComponent } from '../store/useBuilderStore';
import { X, Copy, Download, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { pages, activePageId, theme } = useBuilderStore();
  const [activeFormat, setActiveFormat] = useState<'html' | 'css' | 'react' | 'tailwind' | 'json'>('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activePage = pages.find(p => p.id === activePageId);
  const components = activePage ? activePage.components : [];

  // 1. Generate HTML Output
  const generateHTML = (comps: BuilderComponent[]) => {
    let htmlStr = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GenovaX Export</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  
  <style>
  *{
    box-sizing:border-box;
  }
  
  body{
    margin:0;
    padding:20px;
    background:#090d16;
    display:flex;
    justify-content:center;
    align-items:flex-start;
    min-height:100vh;
    font-family:Inter,Arial,sans-serif;
  }
  
  #genovax-root{
    position:relative;
    width:1000px;
    min-height:900px;
    background:#090d16;
    overflow:hidden;
    border-radius:8px;
  }
  </style>
  
  </head>
  <body>
  
  <div id="genovax-root">
  `;
  
    comps.forEach((c) => {
      const styles = Object.entries(c.style)
        .map(
          ([k, v]) =>
            `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}: ${v}`
        )
        .join("; ");
  
      const posStyles = `
        position:absolute;
        left:${c.position.left}px;
        top:${c.position.top}px;
        width:${c.position.width}px;
        height:${c.position.height}px;
        transform:rotate(${c.position.rotate}deg);
        z-index:${c.position.zIndex};
      `;
  
      htmlStr += `
  <div id="${c.id}" style="${posStyles}; ${styles}">
  `;
  
      if (c.content.html) {
        htmlStr += `${c.content.html}\n`;
      } else if (c.content.src) {
        htmlStr += `
  <img
    src="${c.content.src}"
    alt="${c.content.alt || "media"}"
    style="
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
    "
  />
  `;
      } else if (c.content.text) {
        htmlStr += `
  <div style="padding:8px;">
    ${c.content.text}
  </div>
  `;
      } else if (c.content.label) {
        htmlStr += `
  <div
    style="
      width:100%;
      height:100%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:600;
    "
  >
    ${c.content.label}
  </div>
  `;
      }
  
      htmlStr += `
  </div>
  `;
    });
  
    htmlStr += `
  </div>
  
  </body>
  </html>
  `;
  
    return htmlStr;
  };
  // 2. Generate CSS Output
const generateCSS = (comps: BuilderComponent[]) => {
  let cssStr = `/* GenovaX Exported Stylesheet */\n\n`;

  comps.forEach(c => {
    const styles = Object.entries(c.style)
      .map(
        ([k, v]) =>
          `  ${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${v};`
      )
      .join('\n');

    cssStr += `#${c.id} {
  position: absolute;
  left: ${c.position.left}px;
  top: ${c.position.top}px;
  width: ${c.position.width}px;
  height: ${c.position.height}px;
  transform: rotate(${c.position.rotate}deg);
  z-index: ${c.position.zIndex};
${styles}
}

`;
  });

  return cssStr;
};

  // 3. Generate React Output
  const generateReact = (comps: BuilderComponent[]) => {
    const pageName = activePageId.charAt(0).toUpperCase() + activePageId.slice(1);
    let reactStr = `import React from 'react';\n\nexport const ${pageName}Page = () => {\n  return (\n    <div style={{ position: 'relative', width: '1000px', minHeight: '800px', backgroundColor: '#090d16', overflow: 'hidden', borderRadius: '8px' }}>\n`;
    
    comps.forEach(c => {
      const camelStyles = JSON.stringify(c.style, null, 4)
        .split('\n')
        .map(line => `      ${line}`)
        .join('\n');

        const posStyles = `position: 'absolute', left: ${c.position.left}, top: ${c.position.top}, width: ${c.position.width}, minHeight: ${c.position.height}, transform: 'rotate(${c.position.rotate}deg)', zIndex: ${c.position.zIndex}`;

      reactStr += `      {/* ${c.name} */}\n      <div style={{\n        ${posStyles},\n        ...${camelStyles.trim()}\n      }}>\n`;

      if (c.content.html) {
        reactStr += `        <div dangerouslySetInnerHTML={{ __html: \`${c.content.html.replace(/`/g, '\\`').trim()}\` }} />\n`;
      } else if (c.content.src) {
        reactStr += `        <img src="${c.content.src}" alt="${c.content.alt || 'media'}" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />\n`;
      } else if (c.content.text) {
        reactStr += `        <div style={{ padding: '8px' }}>${c.content.text}</div>\n`;
      } else if (c.content.label) {
        reactStr += `        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>${c.content.label}</div>\n`;
      }
      reactStr += `      </div>\n\n`;
    });

    reactStr += `    </div>\n  );\n};\n`;
    return reactStr;
  };

  // 4. Generate Tailwind Code
  const generateTailwind = (comps: BuilderComponent[]) => {
    let tailwindStr = `<!-- Tailwind UI Export -->\n<div class="relative w-[1000px] min-h-[800px] bg-slate-950 overflow-hidden border border-slate-800 rounded-lg">\n`;
    
    comps.forEach(c => {
      const styles = `style="left: ${c.position.left}px; top: ${c.position.top}px; width: ${c.position.width}px; height: ${c.position.height}px; transform: rotate(${c.position.rotate}deg); z-index: ${c.position.zIndex};"`;

      tailwindStr += `  <div class="absolute" ${styles}>\n`;
      if (c.content.html) {
        tailwindStr += `    ${c.content.html.trim()}\n`;
      } else if (c.content.src) {
        tailwindStr += `    <img src="${c.content.src}" alt="${c.content.alt || 'media'}" class="w-full h-full object-cover rounded" />\n`;
      } else if (c.content.text) {
        tailwindStr += `    <div class="p-2 text-slate-300 font-sans text-xs">${c.content.text}</div>\n`;
      } else if (c.content.label) {
        tailwindStr += `    <div class="w-full h-full flex justify-center items-center font-bold text-white text-xs">${c.content.label}</div>\n`;
      }
      tailwindStr += `  </div>\n`;
    });

    tailwindStr += `</div>`;
    return tailwindStr;
  };

  const getCode = () => {
    switch (activeFormat) {
      case 'css': return generateCSS(components);
      case 'react': return generateReact(components);
      case 'tailwind': return generateTailwind(components);
      case 'json': return JSON.stringify(components, null, 2);
      default: return generateHTML(components);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = getCode();
    let filename = `layout-${activePageId}.${activeFormat === 'react' ? 'jsx' : activeFormat === 'tailwind' ? 'html' : activeFormat}`;
    
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm select-none">
      <div className={`w-[700px] border rounded-lg shadow-2xl flex flex-col h-[550px] ${
        theme === 'dark' ? 'bg-[#101726] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-inherit">
          <h3 className="text-sm font-extrabold flex items-center gap-1.5 text-indigo-400">
            <span>📤</span> Export Code Center
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-inherit bg-black/10 text-xs px-2">
          {(['html', 'css', 'react', 'tailwind', 'json'] as const).map(fmt => (
            <button
              key={fmt}
              onClick={() => setActiveFormat(fmt)}
              className={`px-4 py-3 font-semibold uppercase tracking-wider border-b-2 transition-all ${
                activeFormat === fmt 
                  ? 'border-indigo-600 text-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {fmt === 'react' ? 'React JSX' : fmt === 'tailwind' ? 'Tailwind HTML' : fmt}
            </button>
          ))}
        </div>

        {/* Text Code Block */}
        <div className="flex-1 p-4 overflow-hidden">
          <textarea
            value={getCode()}
            readOnly
            className={`w-full h-full font-mono text-[10px] p-3 rounded border outline-none bg-black/45 resize-none leading-relaxed select-text ${
              theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'
            }`}
          />
        </div>

        {/* Footer actions */}
        <div className="flex justify-end items-center px-4 py-3 border-t border-inherit bg-black/10 gap-2">
          <button
            onClick={handleCopy}
            className="text-xs font-bold border border-border-dark hover:bg-slate-800 text-white px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download File
          </button>
        </div>
      </div>
    </div>
  );
};
