// ---------------------------------------------------------------------------
// Groq Provider — OpenAI-compatible REST API (no extra npm dependency)
// ---------------------------------------------------------------------------

import type { AIProvider } from '../types';
import { useAIStore } from '../../../store/useAIStore';
import { callWithRetryAndTimeout } from './utils';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export function createGroqProvider(): AIProvider {
  return {
    name: 'Groq',

    async generate(prompt: string): Promise<string> {
      const store = useAIStore.getState();
      const apiKey = store.getActiveGroqKey();
      if (!apiKey) throw new Error('No Groq API key configured.');

      const model = store.groqModel || 'llama-3.3-70b-versatile';

      const result = await callWithRetryAndTimeout(async () => {
        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 8192,
            response_format: { type: 'json_object' },
          }),
        });

        if (!response.ok) {
          const status = response.status;
          const body = await response.text().catch(() => '');
          if (status === 401) throw new Error('Invalid Groq API key.');
          if (status === 429) throw new Error('Groq rate limit exceeded.');
          throw new Error(`Groq API error ${status}: ${body.substring(0, 200)}`);
        }

        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content?.trim() || '';
        if (!text) throw new Error('Groq returned an empty response.');
        return text;
      });

      return result;
    },

    async testConnection(): Promise<boolean> {
      const store = useAIStore.getState();
      const apiKey = store.getActiveGroqKey();
      if (!apiKey) return false;

      try {
        const result = await callWithRetryAndTimeout(async () => {
          const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: store.groqModel || 'llama-3.3-70b-versatile',
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
        console.error('[Groq testConnection] Error:', err);
        return false;
      }
    },
  };
}
