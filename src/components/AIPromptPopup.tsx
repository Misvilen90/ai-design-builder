import React, { useState, useCallback } from 'react';
import { useBuilderStore, Page } from '../store/useBuilderStore';
import { useAIStore } from '../store/useAIStore';
import { generateUILayout, generatePrototype, refineLayout, describeCurrentLayout } from '../services/ai/aiRouter';
import { analyzePrompt, enrichPrompt, type ClarifyingQuestion } from '../services/ai/promptExpander';
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
  CheckCircle2,
  Link2,
  Layers,
  Wand2,
  HelpCircle,
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
  const { setPages, setActivePageId, activePageId, pages, theme } = useBuilderStore();
  const { provider } = useAIStore();

  const [promptValue, setPromptValue] = useState('');
  const [mode, setMode] = useState<'replace' | 'append' | 'prototype'>('replace');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRawResponse, setLastRawResponse] = useState<string | null>(null);
  const [lastProvider, setLastProvider] = useState<string | null>(null);
  const [generatedCount, setGeneratedCount] = useState<number>(0);
  const [generatedPages, setGeneratedPages] = useState<number>(0);
  const [generatedLinks, setGeneratedLinks] = useState<number>(0);
  const [showProtoWarning, setShowProtoWarning] = useState(false);

  // Prompt expansion state
  const [showExpansion, setShowExpansion] = useState(false);
  const [expansionQuestions, setExpansionQuestions] = useState<ClarifyingQuestion[]>([]);
  const [expansionAnswers, setExpansionAnswers] = useState<Record<string, string>>({});

  // Iterative refinement state
  const [refineMode, setRefineMode] = useState(false);

  const layoutSuggestions = [
    { 
      title: '☕ Coffee Shop', 
      text: 'Create a modern coffee shop website with a hero banner, specialty drinks menu section, an about section with interior photo, customer testimonials, and a contact form',
      mode: 'replace' as const
    },
    { 
      title: '🚀 SaaS Platform', 
      text: 'Build a SaaS landing page for a project management tool with hero section, 3 feature cards, pricing table with Free and Pro tiers, testimonials, and CTA section',
      mode: 'replace' as const
    },
    { 
      title: '🛍️ E-Commerce Store', 
      text: 'Create an e-commerce homepage for fashion products with navigation, hero banner with seasonal sale, product grid showing items with prices, testimonials, and newsletter signup',
      mode: 'replace' as const
    },
    { 
      title: '💼 Creative Portfolio', 
      text: 'Design a creative portfolio for a UI designer with hero intro, skills/services section, project gallery, about section, and contact form',
      mode: 'replace' as const
    },
  ];

  const prototypeSuggestions = [
    {
      title: '🛍️ E-Commerce Prototype',
      text: 'Create a full e-commerce website with Home, Products, Product Detail, Cart, and Contact pages, all linked together through navbar and buttons',
      mode: 'prototype' as const
    },
    {
      title: '🚀 SaaS Prototype',
      text: 'Create a complete SaaS website prototype with Home, Features, Pricing, Blog, and Contact pages all linked through the navbar and CTA buttons',
      mode: 'prototype' as const
    },
    {
      title: '🏥 Healthcare Prototype',
      text: 'Build a medical clinic website with Home, Services, Doctors, Appointments, and Contact pages linked for easy navigation',
      mode: 'prototype' as const
    },
    {
      title: '💼 Agency Prototype',
      text: 'Design a creative agency website with Home, Services, Portfolio, Team, and Contact pages linked through the navigation',
      mode: 'prototype' as const
    },
  ];

  const checkPromptExpansion = useCallback(() => {
    if (mode === 'prototype' || promptValue.trim().length < 15) return false;
    const questions = analyzePrompt(promptValue);
    if (questions.length > 0 && !showExpansion) {
      setExpansionQuestions(questions);
      setExpansionAnswers({});
      setShowExpansion(true);
      return true;
    }
    return false;
  }, [promptValue, mode, showExpansion]);

  const handleGenerate = async () => {
    if (!promptValue.trim()) return;

    // Check if we should show clarifying questions first
    if (!refineMode && checkPromptExpansion()) return;

    // Prototype mode: show confirmation if there are existing pages
    if (mode === 'prototype' && pages.length > 0 && !showProtoWarning) {
      setShowProtoWarning(true);
      return;
    }

    setShowProtoWarning(false);
    setError(null);
    setLastRawResponse(null);
    setLastProvider(null);
    setGeneratedCount(0);
    setGeneratedPages(0);
    setGeneratedLinks(0);
    setShowExpansion(false);
    setIsGenerating(true);
    onShowLoading(true);
    onClose();

    try {
      const finalPrompt = Object.keys(expansionAnswers).length > 0
        ? enrichPrompt(promptValue, expansionAnswers)
        : promptValue;

      if (mode === 'prototype') {
        const result = await generatePrototype(finalPrompt);

        if (!result.success) {
          setError(result.error || 'Unknown error occurred.');
          setLastRawResponse(result.rawResponse || null);
          onShowLoading(false);
          setIsGenerating(false);
          return;
        }

        setLastProvider(result.provider);
        setGeneratedPages(result.pages.length);
        setGeneratedLinks(result.linksApplied);
        setGeneratedCount(result.pages.reduce((s, p) => s + p.components.length, 0));

        setPages(result.pages as Page[]);
        if (result.homePageId) {
          setActivePageId(result.homePageId);
        } else if (result.pages.length > 0) {
          setActivePageId(result.pages[0].id);
        }
      } else if (refineMode) {
        const layoutDesc = describeCurrentLayout(pages, activePageId);
        const result = await refineLayout(finalPrompt, layoutDesc);

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

        const updatedPages: Page[] = pages.map(page =>
          page.id === activePageId ? { ...page, components: generatedComps } : page
        );
        setPages(updatedPages);
      } else {
        const result = await generateUILayout(finalPrompt);

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
      }

      setRefineMode(false);
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

  const handleSuggestionClick = (suggestion: { text: string; mode: 'replace' | 'append' | 'prototype' }) => {
    setPromptValue(suggestion.text);
    setMode(suggestion.mode);
    setShowProtoWarning(false);
    setShowExpansion(false);
    setRefineMode(false);
  };

  const handleExpansionAnswer = (id: string, value: string) => {
    setExpansionAnswers(prev => ({ ...prev, [id]: value }));
  };

  const startRefine = () => {
    setRefineMode(true);
    setMode('replace');
    setShowExpansion(false);
    setPromptValue('');
  };

  const resetAll = () => {
    setPromptValue('');
    setError(null);
    setLastRawResponse(null);
    setLastProvider(null);
    setGeneratedCount(0);
    setGeneratedPages(0);
    setGeneratedLinks(0);
    setShowProtoWarning(false);
    setShowExpansion(false);
    setExpansionQuestions([]);
    setExpansionAnswers({});
    setRefineMode(false);
  };

  if (!isOpen) return null;

  const providerLabel = provider === 'auto' ? 'Auto (failover)' :
    provider === 'gemini' ? 'Gemini' :
    provider === 'groq' ? 'Groq' : 'OpenRouter';

  const isPrototype = mode === 'prototype';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm select-none">
      <div className={`w-[580px] max-h-[90vh] border rounded-xl shadow-2xl flex flex-col overflow-hidden ${
        theme === 'dark' ? 'bg-[#101726] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3.5 border-b border-inherit shrink-0">
          <h3 className="text-sm font-extrabold flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${refineMode ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : isPrototype ? 'bg-gradient-to-br from-violet-500 to-fuchsia-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
              {refineMode
                ? <Wand2 className="w-4 h-4 text-white" />
                : isPrototype 
                  ? <Layers className="w-4 h-4 text-white" />
                  : <Sparkles className="w-4 h-4 text-white fill-white/20" />
              }
            </div>
            <span className={`bg-clip-text text-transparent ${refineMode ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : isPrototype ? 'bg-gradient-to-r from-violet-400 to-fuchsia-400' : 'bg-gradient-to-r from-indigo-400 to-purple-400'}`}>
              {refineMode ? 'Refine Layout' : isPrototype ? 'AI Prototype Generator' : 'AI Layout Engine'}
            </span>
            <span className="text-[8px] font-mono text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded-full">
              {providerLabel}
            </span>
          </h3>
          <button 
            onClick={() => { onClose(); resetAll(); }}
            className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Refine mode banner */}
          {refineMode && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-emerald-300">
              <Wand2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[10px] leading-relaxed space-y-1">
                <p className="font-bold text-xs text-emerald-200">Refinement Mode</p>
                <p>Describe the changes you want (e.g., "make the hero blue", "add a contact form", "change to a darker theme"). The AI will modify your existing layout.</p>
              </div>
            </div>
          )}

          {/* Prototype mode info banner */}
          {isPrototype && !refineMode && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-violet-500/30 bg-violet-500/5 text-violet-300">
              <Link2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[10px] leading-relaxed space-y-1">
                <p className="font-bold text-xs text-violet-200">Prototype Mode — Multi-Page Generation</p>
                <p>The AI will design <strong>all pages</strong> of your site and automatically link navigational elements (navbar, buttons, CTAs) between pages. You can click through the prototype in Preview mode.</p>
              </div>
            </div>
          )}

          {/* Prompt Expansion Questions */}
          {showExpansion && !refineMode && (
            <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <HelpCircle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">A few quick questions</span>
              </div>
              {expansionQuestions.map(q => (
                <div key={q.id} className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-300">{q.label}</label>
                  <div className="flex flex-wrap gap-1.5">
                    {q.options.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleExpansionAnswer(q.id, opt.value)}
                        className={`text-[9px] font-semibold px-2.5 py-1 rounded-md border transition-all ${
                          expansionAnswers[q.id] === opt.value
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowExpansion(false)}
                  className="text-[9px] text-slate-500 hover:text-slate-300 px-2 py-1"
                >
                  Skip
                </button>
                <button
                  onClick={handleGenerate}
                  className="text-[9px] font-bold px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Prototype overwrite warning */}
          {showProtoWarning && (
            <div className="flex flex-col gap-2 p-3 rounded-lg border border-orange-500/40 bg-orange-500/5 text-orange-300">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-orange-400" />
                <div className="text-[10px] leading-relaxed">
                  <p className="font-bold text-xs text-orange-200">Replace all pages?</p>
                  <p>Prototype mode will <strong>replace all {pages.length} page(s)</strong> in this project with the newly generated prototype. This cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowProtoWarning(false)}
                  className="text-[10px] font-semibold px-3 py-1.5 rounded-md border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  className="text-[10px] font-semibold px-3 py-1.5 rounded-md bg-orange-500 hover:bg-orange-400 text-white transition-all"
                >
                  Yes, Generate Prototype
                </button>
              </div>
            </div>
          )}

          {/* Success indicator */}
          {lastProvider && generatedCount > 0 && !error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[10px] leading-relaxed">
                <p className="font-bold text-xs">
                  {generatedPages > 0 ? 'Prototype Generated Successfully' : 'Layout Generated Successfully'}
                </p>
                {generatedPages > 0 ? (
                  <p>Generated by <strong>{lastProvider}</strong> — <strong>{generatedPages} pages</strong> with <strong>{generatedLinks} prototype links</strong> ({generatedCount} total components).</p>
                ) : (
                  <p>Generated by <strong>{lastProvider}</strong> ({generatedCount} components created).</p>
                )}
                <button
                  onClick={() => { startRefine(); }}
                  className="mt-2 text-[9px] font-bold px-2.5 py-1 rounded-md bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 border border-emerald-500/30 transition-all"
                >
                  <Wand2 className="w-2.5 h-2.5 inline mr-1" />
                  Refine this layout
                </button>
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
              {refineMode
                ? 'What changes do you want to make?'
                : isPrototype
                  ? 'Describe the multi-page website to prototype'
                  : 'Describe the website you want to build'
              }
            </label>
            <textarea
              value={promptValue}
              onChange={e => { setPromptValue(e.target.value); setShowProtoWarning(false); setShowExpansion(false); }}
              onKeyDown={handleKeyDown}
              placeholder={refineMode
                ? 'e.g., Change the hero background to blue, add a contact form at the bottom, make the navbar sticky...'
                : isPrototype
                  ? 'e.g., Create a full e-commerce website with Home, Products, Cart, and Contact pages all linked together...'
                  : 'e.g., Create a modern e-commerce website for Arduino and Raspberry Pi products with hero section, product categories, featured items, and newsletter...'
              }
              className={`w-full h-28 p-3 text-xs rounded-lg border outline-none resize-none transition-colors ${
                theme === 'dark' 
                  ? 'border-slate-800 bg-[#090d16] text-white focus:border-indigo-500/50 placeholder:text-slate-600' 
                  : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-indigo-400'
              }`}
            />
            <span className="text-[9px] text-slate-600 font-mono">
              Ctrl+Enter to generate • {refineMode ? 'Modifies existing layout' : 'Uses existing components — no raw HTML'}
            </span>
          </div>

          {/* Mode Toggle (hidden during refine) */}
          {!refineMode && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mode:</span>
              <button
                onClick={() => { setMode('replace'); setShowProtoWarning(false); setShowExpansion(false); }}
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
                onClick={() => { setMode('append'); setShowProtoWarning(false); setShowExpansion(false); }}
                className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md border transition-all ${
                  mode === 'append'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                    : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <PlusCircle className="w-3 h-3" />
                Add to Page
              </button>
              <button
                onClick={() => { setMode('prototype'); setShowProtoWarning(false); setShowExpansion(false); }}
                className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-md border transition-all ${
                  mode === 'prototype'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 border-violet-500 text-white shadow-sm shadow-violet-500/20'
                    : 'border-slate-800 text-slate-400 hover:text-white hover:border-violet-700'
                }`}
              >
                <Layers className="w-3 h-3" />
                Prototype
              </button>
            </div>
          )}

          {/* Suggestions (hidden during expand and refine) */}
          {!showExpansion && !refineMode && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/10" />
                {isPrototype ? 'Prototype Starters' : 'Quick Prompts'}
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                {(isPrototype ? prototypeSuggestions : layoutSuggestions).map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSuggestionClick(s)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all group ${
                      theme === 'dark' 
                        ? `border-slate-800/80 bg-[#090d16]/60 hover:bg-slate-800/40 ${isPrototype ? 'hover:border-violet-500/30' : 'hover:border-indigo-500/30'}` 
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`text-[10px] font-bold group-hover:text-opacity-80 ${isPrototype ? 'text-violet-400 group-hover:text-violet-300' : 'text-indigo-400 group-hover:text-indigo-300'}`}>{s.title}</div>
                    <div className="text-[8px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{s.text}</div>
                    {s.mode === 'prototype' && (
                      <div className="flex items-center gap-0.5 mt-1">
                        <Link2 className="w-2.5 h-2.5 text-violet-500" />
                        <span className="text-[8px] text-violet-500">Multi-page + auto-links</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-3 border-t border-inherit bg-black/15 shrink-0">
          <span className="text-[9px] text-slate-500 flex items-center gap-1">
            {refineMode
              ? <><Wand2 className="w-3 h-3 text-emerald-400" /> Modifies existing layout</>
              : isPrototype
                ? <><Link2 className="w-3 h-3 text-violet-400" /> Multi-page • Auto-linked prototype</>
                : <><Zap className="w-3 h-3 text-indigo-400" /> Component-based AI • No raw HTML</>
            }
          </span>
          <button
            onClick={handleGenerate}
            disabled={!promptValue.trim() || isGenerating || showProtoWarning}
            className={`text-xs font-bold text-white px-5 py-2 rounded-lg flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg ${
              refineMode
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20'
                : isPrototype
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-violet-500/20 hover:shadow-violet-500/30'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/20 hover:shadow-indigo-500/30'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                {refineMode ? 'Refining...' : isPrototype ? 'Building Prototype...' : 'Generating...'}
              </>
            ) : (
              <>
                {refineMode ? <Wand2 className="w-3.5 h-3.5" /> : isPrototype ? <Layers className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 fill-white/20" />}
                {refineMode ? 'Apply Changes' : isPrototype ? 'Generate Prototype' : 'Generate Layout'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
