const http = require('http');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMzA0ZTNjZjI2YjEyNzUzZjliZGY5NCIsImlhdCI6MTc4MTU1MjgzOSwiZXhwIjoxNzgyMTU3NjM5fQ.YFaoG_XB14cZkiLOA9ZNMAIWMyb5gIEqxUjBkppLkdg';

const payload = JSON.stringify({
  prompt: 'You are a layout AI. Return ONLY this JSON object, no markdown:\n{"pageName":"Test Page","description":"A test","components":[{"type":"nav-navbar","name":"Navigation","x":50,"y":0,"width":900,"height":64,"zIndex":1,"contentOverrides":{"brand":"TestBrand"}}],"imageKeywords":["test"]}',
  provider: 'gemini'
});

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
    console.log('STATUS:', res.statusCode);
    try {
      const j = JSON.parse(body);
      console.log('SUCCESS:', j.success);
      console.log('PROVIDER:', j.provider || 'N/A');
      if (j.error) console.log('ERROR:', j.error.substring(0, 500));
      if (j.plan) console.log('PLAN KEYS:', Object.keys(j.plan));
      if (j.plan && j.plan.components) console.log('COMPONENTS:', j.plan.components.length);
      console.log('RAW BODY:', body);
    } catch (e) {
      console.log('PARSE ERROR:', e.message);
      console.log('RAW BODY:', body.substring(0, 500));
    }
  });
});

req.on('error', (e) => console.log('REQUEST ERROR:', e.message));
req.write(payload);
req.end();
