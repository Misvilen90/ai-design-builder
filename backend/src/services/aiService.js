const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const PROVIDER_ORDER = ['gemini', 'groq', 'openrouter', 'openai'];

function getApiKeys() {
  return {
    gemini: process.env.GEMINI_API_KEY || '',
    groq: process.env.GROQ_API_KEY || '',
    openrouter: process.env.OPENROUTER_API_KEY || '',
    openai: process.env.OPENAI_API_KEY || '',
  };
}

function getConfiguredProviders() {
  const keys = getApiKeys();
  return PROVIDER_ORDER.filter(name => keys[name]);
}

async function callWithRetryAndTimeout(fn, maxRetries = 3, delayMs = 2000, timeoutMs = 30000) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
        ),
      ]);
      return result;
    } catch (err) {
      lastError = err;
      console.warn(`[AI Service] Attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured on server.');

  const configuredModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const fallbackModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
  const modelsToTry = Array.from(new Set([configuredModel, ...fallbackModels]));

  let lastError;
  for (const model of modelsToTry) {
    try {
      console.log(`[AI Service] Trying Gemini model: ${model}`);
      const text = await callWithRetryAndTimeout(async () => {
        const response = await fetch(
          `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4000,
              },
            }),
          }
        );

        if (!response.ok) {
          const body = await response.text().catch(() => '');
          throw new Error(`Gemini API error ${response.status}: ${body.substring(0, 200)}`);
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!text) throw new Error('Gemini returned an empty response.');
        return text;
      }, 2, 1500, 15000);
      return text;
    } catch (err) {
      lastError = err;
      console.warn(`[AI Service] Gemini model ${model} failed: ${err.message}`);
    }
  }
  throw lastError || new Error('All Gemini models failed.');
}

async function callGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('Groq API key not configured on server.');

  const configuredModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const fallbackModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it'];
  const modelsToTry = Array.from(new Set([configuredModel, ...fallbackModels]));

  let lastError;
  for (const model of modelsToTry) {
    try {
      console.log(`[AI Service] Trying Groq model: ${model}`);
      const text = await callWithRetryAndTimeout(async () => {
        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 3000,
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
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (!text) throw new Error('Groq returned an empty response.');
        return text;
      }, 2, 1500, 15000);
      return text;
    } catch (err) {
      lastError = err;
      console.warn(`[AI Service] Groq model ${model} failed: ${err.message}`);
    }
  }
  throw lastError || new Error('All Groq models failed.');
}

async function callOpenRouter(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OpenRouter API key not configured on server.');

  const configuredModel = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash:free';
  const fallbackModels = [
    'google/gemini-2.5-flash:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'qwen/qwen-2.5-72b-instruct:free',
    'deepseek/deepseek-chat'
  ];
  const modelsToTry = Array.from(new Set([configuredModel, ...fallbackModels]));

  let lastError;
  for (const model of modelsToTry) {
    try {
      console.log(`[AI Service] Trying OpenRouter model: ${model}`);
      const text = await callWithRetryAndTimeout(async () => {
        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': process.env.APP_URL || 'https://genovax.app',
            'X-Title': 'GenovaX AI Builder',
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 3000,
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
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (!text) throw new Error('OpenRouter returned an empty response.');
        return text;
      }, 2, 1500, 20000);
      return text;
    } catch (err) {
      lastError = err;
      console.warn(`[AI Service] OpenRouter model ${model} failed: ${err.message}`);
    }
  }
  throw lastError || new Error('All OpenRouter models failed.');
}

async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key not configured on server.');

  const configuredModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const fallbackModels = ['gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'];
  const modelsToTry = Array.from(new Set([configuredModel, ...fallbackModels]));

  let lastError;
  for (const model of modelsToTry) {
    try {
      console.log(`[AI Service] Trying OpenAI model: ${model}`);
      const text = await callWithRetryAndTimeout(async () => {
        const response = await fetch(OPENAI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 3000,
          }),
        });

        if (!response.ok) {
          const status = response.status;
          const body = await response.text().catch(() => '');
          if (status === 401) throw new Error('Invalid OpenAI API key.');
          if (status === 429) throw new Error('OpenAI rate limit exceeded.');
          throw new Error(`OpenAI API error ${status}: ${body.substring(0, 200)}`);
        }

        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (!text) throw new Error('OpenAI returned an empty response.');
        return text;
      }, 2, 1500, 20000);
      return text;
    } catch (err) {
      lastError = err;
      console.warn(`[AI Service] OpenAI model ${model} failed: ${err.message}`);
    }
  }
  throw lastError || new Error('All OpenAI models failed.');
}

const PROVIDER_CALLS = {
  gemini: callGemini,
  groq: callGroq,
  openrouter: callOpenRouter,
  openai: callOpenAI,
};

async function generateText(prompt, provider = 'auto') {
  let providerNames;

  if (provider === 'auto') {
    providerNames = getConfiguredProviders();
    if (providerNames.length === 0) {
      throw new Error('No AI provider is configured on the server. Contact the administrator.');
    }
  } else {
    if (!PROVIDER_CALLS[provider]) throw new Error(`Unknown provider: ${provider}`);
    if (!getApiKeys()[provider]) throw new Error(`${provider} API key not configured on server.`);
    providerNames = [provider];
  }

  const errors = [];

  for (const name of providerNames) {
    console.log(`[AI Service] Trying ${name}...`);
    try {
      const text = await PROVIDER_CALLS[name](prompt);
      console.log(`[AI Service] ${name} Success`);
      return { text, provider: name };
    } catch (err) {
      console.log(`[AI Service] ${name} Failed (${err.message})`);
      errors.push(`${name}: ${err.message}`);
      if (provider !== 'auto') break;
    }
  }

  throw new Error(`All providers failed:\n${errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}`);
}

async function testConnection(providerName) {
  try {
    const fn = PROVIDER_CALLS[providerName];
    if (!fn) throw new Error(`Unknown provider: ${providerName}`);
    if (!getApiKeys()[providerName]) throw new Error('No API key configured on server.');

    const testPrompt = 'Respond with a JSON object: {"status": "ok"}';
    const text = await fn(testPrompt);
    if (!text) throw new Error('Empty response');

    return true;
  } catch (err) {
    console.error(`[AI Service] ${providerName} testConnection error:`, err.message);
    return false;
  }
}

module.exports = { generateText, testConnection, getConfiguredProviders };
