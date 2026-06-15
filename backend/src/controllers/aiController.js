const aiService = require('../services/aiService');
const { validateLayoutResponse, validatePrototypeResponse } = require('../validation/aiResponseSchema');

async function generateLayout(req, res) {
  try {
    const { prompt, provider } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Prompt is required.' });
    }

    const result = await aiService.generateText(prompt, provider || 'auto');

    const raw = result.text;
    const extracted = extractJSON(raw);

    let parsed;
    try {
      parsed = JSON.parse(extracted);
    } catch {
      return res.status(422).json({
        success: false,
        error: 'AI response was not valid JSON. Try again or use a different provider.',
        rawResponse: raw.substring(0, 500),
      });
    }

    const validation = validateLayoutResponse(parsed);
    if (!validation.valid) {
      return res.status(422).json({
        success: false,
        error: `AI response validation failed: ${validation.error}`,
        rawResponse: raw.substring(0, 500),
      });
    }

    res.json({
      success: true,
      provider: result.provider,
      plan: validation.data,
      rawResponse: raw.substring(0, 500),
    });
  } catch (err) {
    console.error('[AI Controller] generateLayout error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

async function generatePrototype(req, res) {
  try {
    const { prompt, provider } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Prompt is required.' });
    }

    const result = await aiService.generateText(prompt, provider || 'auto');

    const raw = result.text;
    const extracted = extractJSON(raw);

    let parsed;
    try {
      parsed = JSON.parse(extracted);
    } catch {
      return res.status(422).json({
        success: false,
        error: 'AI response was not valid JSON. Try again or use a different provider.',
        rawResponse: raw.substring(0, 500),
      });
    }

    const validation = validatePrototypeResponse(parsed);
    if (!validation.valid) {
      return res.status(422).json({
        success: false,
        error: `AI response validation failed: ${validation.error}`,
        rawResponse: raw.substring(0, 500),
      });
    }

    res.json({
      success: true,
      provider: result.provider,
      plan: validation.data,
      rawResponse: raw.substring(0, 500),
    });
  } catch (err) {
    console.error('[AI Controller] generatePrototype error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

async function testConnection(req, res) {
  try {
    const { provider } = req.body;
    if (!provider) {
      return res.status(400).json({ success: false, message: 'Provider name is required.' });
    }

    const connected = await aiService.testConnection(provider);
    res.json({
      success: connected,
      message: connected
        ? `${provider} connected successfully!`
        : `${provider} connection failed.`,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
}

async function getProviders(req, res) {
  const configured = aiService.getConfiguredProviders();
  res.json({ providers: configured });
}

function extractJSON(raw) {
  let text = raw.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) return objMatch[0];
  return text;
}

module.exports = { generateLayout, generatePrototype, testConnection, getProviders };
