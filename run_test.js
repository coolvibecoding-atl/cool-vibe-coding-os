const fs = require('fs');
const envPath = '/Users/coolvibecoding/.openclaw/workspace/.env';
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
}
const SKILLBOSS_KEY = process.env.SKILLBOSS_API_KEY;
fetch('https://api.heybossai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SKILLBOSS_KEY}`
  },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    messages: [{ role: 'user', content: 'Say hi' }]
  })
}).then(r => r.text()).then(console.log);
