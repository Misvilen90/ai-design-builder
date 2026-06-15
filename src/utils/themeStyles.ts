export function getThemeStylesheet(globalTheme: any): string {
  if (!globalTheme) return '';

  const primary = globalTheme.primaryColor || '#6366f1';
  const secondary = globalTheme.secondaryColor || '#475569';
  const accent = globalTheme.accentColor || '#818cf8';
  const bg = globalTheme.backgroundColor || '#090d16';
  const text = globalTheme.textColor || '#f8fafc';
  const font = globalTheme.fontFamily || "'Inter', sans-serif";
  const radius = globalTheme.borderRadius || '8px';
  const shadow = globalTheme.boxShadow || 'none';

  return `
    .canvas-theme-scope {
      font-family: ${font} !important;
    }

    /* Primary Color Overrides */
    .canvas-theme-scope .bg-indigo-600,
    .canvas-theme-scope .bg-indigo-700,
    .canvas-theme-scope .bg-indigo-500,
    .canvas-theme-scope button.bg-indigo-600,
    .canvas-theme-scope button.bg-indigo-700,
    .canvas-theme-scope button.bg-indigo-500 {
      background-color: ${primary} !important;
    }

    .canvas-theme-scope .text-indigo-400,
    .canvas-theme-scope .text-indigo-300,
    .canvas-theme-scope .text-indigo-500,
    .canvas-theme-scope .text-indigo-600,
    .canvas-theme-scope .group-hover\\:text-indigo-400:hover,
    .canvas-theme-scope a:hover {
      color: ${primary} !important;
    }

    .canvas-theme-scope .border-indigo-500,
    .canvas-theme-scope .border-indigo-600 {
      border-color: ${primary} !important;
    }

    .canvas-theme-scope .focus\\:border-indigo-500:focus,
    .canvas-theme-scope .focus\\:ring-indigo-500:focus {
      border-color: ${primary} !important;
      --tw-ring-color: ${primary} !important;
    }

    /* Secondary / Accent Overrides */
    .canvas-theme-scope .bg-slate-800,
    .canvas-theme-scope .bg-slate-800\\/40,
    .canvas-theme-scope .bg-slate-900\\/30 {
      background-color: ${secondary}22 !important; /* Adding opacity */
    }

    .canvas-theme-scope .border-slate-800,
    .canvas-theme-scope .border-slate-700,
    .canvas-theme-scope .border-\\[\\#1e293b\\],
    .canvas-theme-scope .border-slate-800\\/40,
    .canvas-theme-scope .border-slate-800\\/80,
    .canvas-theme-scope .border-indigo-500\\/20,
    .canvas-theme-scope .border-indigo-500\\/30 {
      border-color: ${secondary}44 !important;
    }

    .canvas-theme-scope .text-slate-400,
    .canvas-theme-scope .text-slate-500,
    .canvas-theme-scope .text-textMuted-dark {
      color: ${text}b2 !important; /* 70% opacity */
    }

    /* Background Overrides */
    .canvas-theme-scope .bg-slate-900,
    .canvas-theme-scope .bg-slate-950,
    .canvas-theme-scope .bg-card-dark\\/40,
    .canvas-theme-scope .bg-\\[\\#101726\\],
    .canvas-theme-scope .bg-\\[\\#090d16\\],
    .canvas-theme-scope .bg-\\[\\#0f172a\\],
    .canvas-theme-scope .bg-slate-950\\/20 {
      background-color: ${bg} !important;
    }

    /* Text Overrides */
    .canvas-theme-scope .text-white,
    .canvas-theme-scope .text-slate-200,
    .canvas-theme-scope .text-slate-300,
    .canvas-theme-scope .text-slate-100 {
      color: ${text} !important;
    }

    /* Border Radius & Shadow Overrides */
    .canvas-theme-scope .rounded-md,
    .canvas-theme-scope .rounded-lg,
    .canvas-theme-scope .rounded-xl,
    .canvas-theme-scope .rounded-2xl {
      border-radius: ${radius} !important;
    }

    .canvas-theme-scope .shadow-md,
    .canvas-theme-scope .shadow-lg,
    .canvas-theme-scope .shadow-2xl,
    .canvas-theme-scope .shadow-glow {
      box-shadow: ${shadow} !important;
    }
  `;
}
