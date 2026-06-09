// ---------------------------------------------------------------------------
// OpenRouter Provider — OpenAI-compatible REST API
// ---------------------------------------------------------------------------

import type { AIProvider } from '../types';
import { useAIStore } from '../../../store/useAIStore';
import { callWithRetryAndTimeout } from './utils';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export function createOpenRouterProvider(): AIProvider {
  return {
    name: 'OpenRouter',

    async generate(prompt: string): Promise<string> {
      const store = useAIStore.getState();
      const apiKey = store.getActiveOpenRouterKey();
      if (!apiKey) throw new Error('No OpenRouter API key configured.');

      const model = store.openRouterModel || 'nvidia/nemotron-3-ultra-550b-a55b:free';

      const result = await callWithRetryAndTimeout(async () => {
        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin || 'https://genovax.ai',
            'X-Title': 'GenovaX AI Builder',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 8192,
          }),
        });

        if (!response.ok) {
          const status = response.status;
          const body = await response.text().catch(() => '');
          if (status === 401) throw new Error('Invalid OpenRouter API key.');
          if (status === 429) throw new Error('OpenRouter rate limit exceeded.');
          throw new Error(`OpenRouter API error ${status}: ${body.substring(0, 200)}`);
        }

        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content?.trim() || '';
        if (!text) throw new Error('OpenRouter returned an empty response.');
        return text;
      });

      return result;
    },

    async testConnection(): Promise<boolean> {
      const store = useAIStore.getState();
      const apiKey = store.getActiveOpenRouterKey();
      if (!apiKey) return false;

      try {
        const result = await callWithRetryAndTimeout(async () => {
          const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'HTTP-Referer': window.location.origin || 'https://genovax.ai',
              'X-Title': 'GenovaX AI Builder',
            },
            body: JSON.stringify({
              model: store.openRouterModel || 'nvidia/nemotron-3-ultra-550b-a55b:free',
              messages: [
                { role: 'user', content: 'Respond with exactly: "GenovaX AI connected!"' },
              ],
              max_tokens: 50,
            }),
          });

          if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
          }

          const data = await response.json();
          const text = data?.choices?.[0]?.message?.content?.trim() || '';
          if (!text) throw new Error('Empty response');
          return text;
        });

        return !!result;
      } catch (err) {
        console.error('[OpenRouter testConnection] Error:', err);
        return false;
      }
    },
  };
}
