const http = require('http');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMzA0ZTNjZjI2YjEyNzUzZjliZGY5NCIsImlhdCI6MTc4MTU1MjgzOSwiZXhwIjoxNzgyMTU3NjM5fQ.YFaoG_XB14cZkiLOA9ZNMAIWMyb5gIEqxUjBkppLkdg';

// Simulate what the frontend sends — system prompt + user request
const systemPrompt = `You are a layout AI. Generate a layout plan as a JSON object.

## Output Format (RETURN ONLY THIS JSON — no markdown, no backticks)
{
  "pageName": "Page Name",
  "description": "Brief description",
  "components": [
    {
      "type": "nav-navbar",
      "name": "Main Navigation",
      "x": 50,
      "y": 0,
      "width": 900,
      "height": 64,
      "zIndex": 1,
      "contentOverrides": { "brand": "CoffeeBrand" }
    },
    {
      "type": "marketing-hero",
      "name": "Hero Section",
      "x": 50,
      "y": 84,
      "width": 900,
      "height": 360,
      "zIndex": 2,
      "contentOverrides": { "title": "Welcome", "text": "Description" }
    },
    {
      "type": "footer-simple",
      "name": "Footer",
      "x": 50,
      "y": 464,
      "width": 900,
      "height": 120,
      "zIndex": 3,
      "contentOverrides": { "brand": "CoffeeBrand" }
    }
  ],
  "imageKeywords": ["coffee"]
}

IMPORTANT: Use ONLY these component types: nav-navbar, marketing-hero, business-services, business-about, marketing-testimonials, marketing-newsletter, marketing-cta, card-pricing, footer-block, footer-simple, form-contact, business-team, media-gallery, ecommerce-grid.
`;

const userRequest = 'Create a modern coffee shop website';
const combinedPrompt = `${systemPrompt}\n\nUser Request: ${userRequest}\n\nGenerate the layout plan now. Return ONLY the JSON object.`;

const payload = JSON.stringify({
  prompt: combinedPrompt,
  provider: 'openai'
});

console.log('Sending request to /api/ai/generate...');
console.log('Prompt length:', combinedPrompt.length, 'chars');

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/ai/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'Authorization': `Bearer ${TOKEN}`
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('\n=== RESPONSE ===');
    console.log('STATUS:', res.statusCode);
    try {
      const j = JSON.parse(body);
      console.log('SUCCESS:', j.success);
      console.log('PROVIDER:', j.provider || 'N/A');
      if (j.error) console.log('ERROR:', j.error.substring(0, 500));
      if (j.plan) {
        console.log('PAGE NAME:', j.plan.pageName);
        console.log('COMPONENTS:', j.plan.components.length);
        j.plan.components.forEach((c, i) => {
          console.log(`  [${i}] type="${c.type}" name="${c.name}" pos=(${c.x},${c.y}) size=${c.width}x${c.height}`);
        });
      }
    } catch (e) {
      console.log('PARSE ERROR:', e.message);
      console.log('RAW:', body.substring(0, 800));
    }
  });
});

req.on('error', (e) => console.log('REQUEST ERROR:', e.message));
req.write(payload);
req.end();
