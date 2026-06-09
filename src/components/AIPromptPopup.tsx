import React, { useState } from 'react';
import { useBuilderStore, Page } from '../store/useBuilderStore';
import { useAIStore } from '../store/useAIStore';
import { generateUILayout } from '../services/ai/aiRouter';
import { 
  Sparkles, 
  X, 
  Lightbulb, 
  AlertCircle, 
  RefreshCw,
  Zap,
  Replace,
  PlusCircle,
  XCircle,
  CheckCircle2
} from 'lucide-react';

interface AIPromptPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onShowLoading: (loading: boolean) => void;
}

export const AIPromptPopup: React.FC<AIPromptPopupProps> = ({ 
  isOpen, 
  onClose,
  onShowLoading
}) => {
  const { setPages, activePageId, pages, theme } = useBuilderStore();
  const { provider, getActiveGeminiKey, getActiveGroqKey, getActiveOpenRouterKey } = useAIStore();

  const [promptValue, setPromptValue] = useState('');
  const [mode, setMode] = useState<'replace' | 'append'>('replace');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRawResponse, setLastRawResponse] = useState<string | null>(null);
  const [lastProvider, setLastProvider] = useState<string | null>(null);
  const [generatedCount, setGeneratedCount] = useState<number>(0);
  
  const suggestions = [
    { 
      title: '☕ Coffee Shop', 
      text: 'Create a modern coffee shop website with a hero banner, specialty drinks menu section, an about section with interior photo, customer testimonials, and a contact form' 
    },
    { 
      title: '🚀 SaaS Platform', 
      text: 'Build a SaaS landing page for a project management tool with hero section, 3 feature cards, pricing table with Free and Pro tiers, testimonials, and CTA section' 
    },
    { 
      title: '🛍️ E-Commerce Store', 
      text: 'Create an e-commerce homepage for fashion products with navigation, hero banner with seasonal sale, product grid showing items with prices, testimonials, and newsletter signup' 
    },
    { 
      title: '💼 Creative Portfolio', 
      text: 'Design a creative portfolio for a UI designer with hero intro, skills/services section, project gallery, about section, and contact form' 
    },
    { 
      title: '🔌 Electronics Store', 
      text: 'Create a modern electronics store for Arduino and Raspberry Pi products with navbar, hero banner, category section, featured product grid, testimonials, and newsletter' 
    },
    { 
      title: '🏥 Healthcare Clinic', 
      text: 'Build a medical clinic website with professional hero section, services grid, doctors team section, patient testimonials, appointment booking form, and footer' 
    }
  ];

  const hasAnyKey = !!(getActiveGeminiKey() || getActiveGroqKey() || getActiveOpenRouterKey());

  const handleGenerate = async () => {
    if (!promptValue.trim()) return;

    if (!hasAnyKey) {
      setError('No AI provider API key configured. Go to the left sidebar → Settings (⚙️) → AI Configuration to add at least one key.');
      return;
    }

    setError(null);
    setLastRawResponse(null);
    setLastProvider(null);
    setGeneratedCount(0);
    setIsGenerating(true);
    onShowLoading(true);
    onClose();

    try {
      const result = await generateUILayout(promptValue);

      if (!result.success) {
        setError(result.error || 'Unknown error occurred.');
        setLastRawResponse(result.rawResponse || null);
        onShowLoading(false);
        setIsGenerating(false);
        return;
      }

      const generatedComps = result.components;
      setLastProvider(result.provider);
      setGeneratedCount(generatedComps.length);

      if (mode === 'replace') {
        const updatedPages: Page[] = pages.map(page =>
          page.id === activePageId ? { ...page, components: generatedComps } : page
        );
        setPages(updatedPages);
      } else {
        // Append mode
        const activePage = pages.find(p => p.id === activePageId);
        const existingComps = activePage ? activePage.components : [];
        
        const maxBottom = existingComps.reduce((max, c) => {
          const bottom = c.position.top + c.position.height;
          return bottom > max ? bottom : max;
        }, 0);
        
        const offsetComps = generatedComps.map(c => ({
          ...c,
          position: {
            ...c.position,
            top: c.position.top + maxBottom + 40,
            zIndex: c.position.zIndex + existingComps.length
          }
        }));

        const updatedPages: Page[] = pages.map(page =>
          page.id === activePageId
            ? { ...page, components: [...existingComps, ...offsetComps] }
            : page
        );
        setPages(updatedPages);
      }

      onShowLoading(false);
      setIsGenerating(false);
      setPromptValue('');
    } catch (err: any) {
      setError(`Unexpected error: ${err?.message || String(err)}`);
      onShowLoading(false);
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  if (!isOpen) return null;

  const providerLabel = provider === 'auto' ? 'Auto (failover)' :
    provider === 'gemini' ? 'Gemini' :
    provider === 'groq' ? 'Groq' : 'OpenRouter';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm select-none">
      <div className={`w-[560px] max-h-[85vh] border rounded-xl shadow-2xl flex flex-col overflow-hidden ${
        theme === 'dark' ? 'bg-[#101726] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3.5 border-b border-inherit shrink-0">
          <h3 className="text-sm font-extrabold flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Sparkles className="w-4 h-4 text-white fill-white/20" />
            </div>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AI Layout Engine
            </span>
            <span className="text-[8px] font-mono text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded-full">
              {providerLabel}
            </span>
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* No API Key Warning */}
          {!hasAnyKey && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[10px] leading-relaxed space-y-1">
                <p className="font-bold text-xs">API Key Required</p>
                <p>Go to <strong>Settings (⚙️)</strong> → <strong>AI Configuration</strong> to add at least one provider API key (Gemini, Groq, or OpenRouter).</p>
              </div>
            </div>
          )}

          {/* Success indicator */}
          {lastProvider && generatedCount > 0 && !error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[10px] leading-relaxed">
                <p className="font-bold text-xs">Layout Generated Successfully</p>
                <p>Generated by <strong>{lastProvider}</strong> ({generatedCount} components created).</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400">
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[10px] leading-relaxed space-y-1">
                <p className="font-bold text-xs">Generation Failed</p>
                <p className="whitespace-pre-line">{error}</p>
                {lastRawResponse && (
                  <details className="mt-1">
                    <summary className="cursor-pointer text-[9px] text-slate-500 hover:text-slate-300">Show raw response</summary>
                    <pre className="text-[8px] text-slate-500 mt-1 p-2 bg-black/20 rounded max-h-24 overflow-auto whitespace-pre-wrap break-all">{lastRawResponse}</pre>
                  </details>
                )}
              </div>
            </div>
          )}

          {/* Prompt Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Describe the website you want to build
            </label>
            <textarea
              value={promptValue}
              onChange={e => setPromptValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Create a modern e-commerce website for Arduino and Raspberry Pi products with hero section, product categories, featured items, and newsletter..."
              className={`w-full h-28 p-3 text-xs rounded-lg border outline-none resize-none transition-colors ${
                theme === 'dark' 
                  ? 'border-slate-800 bg-[#090d16] text-white focus:border-indigo-500/50 placeholder:text-slate-600' 
                  : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-indigo-400'
              }`}
            />
            <span className="text-[9px] text-slate-600 font-mono">
              Ctrl+Enter to generate • Uses existing components — no raw HTML
            </span>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mode:</span>
            <button
              onClick={() => setMode('replace')}
              className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md border transition-all ${
                mode === 'replace'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Replace className="w-3 h-3" />
              Replace Page
            </button>
            <button
              onClick={() => setMode('append')}
              className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md border transition-all ${
                mode === 'append'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <PlusCircle className="w-3 h-3" />
              Add to Page
            </button>
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/10" />
              Quick Prompts
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setPromptValue(s.text)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all group ${
                    theme === 'dark' 
                      ? 'border-slate-800/80 bg-[#090d16]/60 hover:bg-slate-800/40 hover:border-indigo-500/30' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[10px] font-bold text-indigo-400 group-hover:text-indigo-300">{s.title}</div>
                  <div className="text-[8px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{s.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-3 border-t border-inherit bg-black/15 shrink-0">
          <span className="text-[9px] text-slate-500 flex items-center gap-1">
            <Zap className="w-3 h-3 text-indigo-400" />
            Component-based AI • No raw HTML
          </span>
          <button
            onClick={handleGenerate}
            disabled={!promptValue.trim() || isGenerating}
            className="text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2 rounded-lg flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 fill-white/20" />
                Generate Layout
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
