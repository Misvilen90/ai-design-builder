// ---------------------------------------------------------------------------
// Gemini Provider — uses @google/genai SDK
// ---------------------------------------------------------------------------

import { GoogleGenAI } from '@google/genai';
import type { AIProvider } from '../types';
import { useAIStore } from '../../../store/useAIStore';
import { callWithRetryAndTimeout } from './utils';

export function createGeminiProvider(): AIProvider {
  return {
    name: 'Gemini',

    async generate(prompt: string): Promise<string> {
      const store = useAIStore.getState();
      const apiKey = store.getActiveGeminiKey();
      if (!apiKey) throw new Error('No Gemini API key configured.');

      const model = store.geminiModel || 'gemini-2.5-flash';
      const ai = new GoogleGenAI({ apiKey });

      const result = await callWithRetryAndTimeout(async () => {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        });
        const text = response.text?.trim() || '';
        if (!text) throw new Error('Gemini returned an empty response.');
        return text;
      });

      return result;
    },

    async testConnection(): Promise<boolean> {
      const store = useAIStore.getState();
      const apiKey = store.getActiveGeminiKey();
      if (!apiKey) return false;

      try {
        const ai = new GoogleGenAI({ apiKey });
        const result = await callWithRetryAndTimeout(async () => {
          const response = await ai.models.generateContent({
            model: store.geminiModel || 'gemini-2.5-flash',
            contents: 'Respond with exactly: "GenovaX AI connected!"',
            config: { maxOutputTokens: 50 },
          });
          const text = response.text?.trim() || '';
          if (!text) throw new Error('Empty response');
          return text;
        });
        return !!result;
      } catch (err) {
        console.error('[Gemini testConnection] Error:', err);
        return false;
      }
    },
  };
}
