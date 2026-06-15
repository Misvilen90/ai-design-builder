export interface ClarifyingQuestion {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

const INDUSTRIES = [
  { value: 'tech-saas', label: 'Tech / SaaS' },
  { value: 'ecommerce', label: 'E-Commerce / Retail' },
  { value: 'creative', label: 'Creative / Portfolio' },
  { value: 'healthcare', label: 'Healthcare / Wellness' },
  { value: 'education', label: 'Education / Training' },
  { value: 'food', label: 'Restaurant / Food' },
  { value: 'agency', label: 'Agency / Consulting' },
  { value: 'other', label: 'Other' },
];

const THEMES = [
  { value: 'dark', label: '🌙 Dark' },
  { value: 'light', label: '☀️ Light' },
  { value: 'auto', label: 'Auto (AI decides)' },
];

const PAGES = [
  { value: 'single', label: 'Single page' },
  { value: 'multi-3', label: '3 pages' },
  { value: 'multi-5', label: '5 pages' },
  { value: 'multi-full', label: 'Full prototype' },
];

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'playful', label: 'Playful / Creative' },
  { value: 'minimal', label: 'Minimal / Clean' },
  { value: 'bold', label: 'Bold / Impactful' },
];

export function analyzePrompt(prompt: string): ClarifyingQuestion[] {
  const questions: ClarifyingQuestion[] = [];
  const hasPages = /(\d\s*page)|(multi.?page)|(prototype)|(website)|(site)|(landing)/i.test(prompt);
  const hasIndustry = /(saas|ecommerce|portfolio|restaurant|healthcare|education|agency|store|shop|blog|app)/i.test(prompt);
  const hasTheme = /(dark|light|theme|color)/i.test(prompt);
  const hasTone = /(modern|minimal|bold|playful|professional|fun|elegant)/i.test(prompt);

  if (!hasIndustry && !hasPages) {
    questions.push({
      id: 'industry',
      label: 'What industry or type of website?',
      options: INDUSTRIES,
    });
  }

  if (!hasTheme) {
    questions.push({
      id: 'theme',
      label: 'Color theme preference?',
      options: THEMES,
    });
  }

  if (!hasPages) {
    questions.push({
      id: 'pages',
      label: 'How many pages?',
      options: PAGES,
    });
  }

  if (!hasTone) {
    questions.push({
      id: 'tone',
      label: 'Design style?',
      options: TONES,
    });
  }

  return questions.slice(0, 3);
}

export function enrichPrompt(prompt: string, answers: Record<string, string>): string {
  const parts = [prompt.trim()];
  const extras: string[] = [];

  if (answers.industry) {
    const industry = INDUSTRIES.find(i => i.value === answers.industry);
    extras.push(`Industry: ${industry?.label || answers.industry}`);
  }
  if (answers.theme && answers.theme !== 'auto') {
    extras.push(`Theme: ${answers.theme === 'dark' ? 'Dark mode' : 'Light mode'}`);
  }
  if (answers.pages) {
    const pageMap: Record<string, string> = {
      'single': 'a single-page layout',
      'multi-3': 'a 3-page website',
      'multi-5': 'a 5-page website',
      'multi-full': 'a complete multi-page prototype',
    };
    extras.push(`Format: ${pageMap[answers.pages] || answers.pages}`);
  }
  if (answers.tone) {
    const toneLabels: Record<string, string> = {
      'professional': 'professional and corporate style',
      'playful': 'playful and creative style',
      'minimal': 'minimal and clean style',
      'bold': 'bold and impactful style',
    };
    extras.push(`Style: ${toneLabels[answers.tone] || answers.tone}`);
  }

  if (extras.length > 0) {
    parts.push('---');
    parts.push('Additional context:');
    parts.push(extras.join('. ') + '.');
  }

  return parts.join('\n');
}
