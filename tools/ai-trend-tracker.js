#!/usr/bin/env node
/**
 * AI News Trend Tracker
 * Scrapes Hacker News, Reddit r/LocalLLaMA, Twitter AI accounts
 * Outputs trending topics with analysis to Obsidian and Notion
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Load .env if exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
}

// Configuration
const CONFIG = {
  obsidianPath: process.env.OBSIDIAN_PATH || '/Users/coolvibecoding/Documents/Obsidian/Daily',
  notionApiKey: process.env.NOTION_API_KEY,
  notionDatabaseId: process.env.NOTION_DATABASE_ID,
  stateFile: path.join(__dirname, 'state', 'ai-trends-state.json'),
  keywords: ['AI', 'LLM', 'agents', 'GPT', 'Claude', 'Gemini', 'fine-tuning', 'RAG'],
  maxItems: 10
};

// Ensure state directory exists
const stateDir = path.dirname(CONFIG.stateFile);
if (!fs.existsSync(stateDir)) {
  fs.mkdirSync(stateDir, { recursive: true });
}

// Load state
function loadState() {
  try {
    if (fs.existsSync(CONFIG.stateFile)) {
      return JSON.parse(fs.readFileSync(CONFIG.stateFile, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading state:', e.message);
  }
  return { seenItems: new Set(), lastRun: null };
}

// Save state
function saveState(state) {
  fs.writeFileSync(CONFIG.stateFile, JSON.stringify(state, null, 2));
}

// Rate limiting helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch HTML page
async function fetchPage(url, delayMs = 1000) {
  await delay(delayMs);
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      timeout: 15000
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => req.destroy());
    req.end();
  });
}

// Fetch JSON API
async function fetchJSON(url, delayMs = 1500) {
  await delay(delayMs);
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'AI-News-Tracker/1.0',
        'Accept': 'application/json',
      },
      timeout: 15000
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON'));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => req.destroy());
    req.end();
  });
}

// Parse HN stories from HTML
function parseHNStories(html) {
  const stories = [];
  const titleRegex = /<td class="title"><a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>(?:<span class="sitebit"><a[^>]*>\(([^)]+)\))?/g;
  const subtextRegex = /<td class="subtext">[^)]*?(\d+) points?/g;
  
  const titles = [];
  let match;
  while ((match = titleRegex.exec(html)) !== null) {
    titles.push({ url: match[1], title: match[2], domain: match[3] || '' });
  }
  
  const points = [];
  while ((match = subtextRegex.exec(html)) !== null) {
    points.push(parseInt(match[1]));
  }
  
  titles.forEach((t, i) => {
    if (i < points.length) {
      stories.push({ url: t.url, title: t.title, domain: t.domain, points: points[i] });
    }
  });
  
  return stories;
}

// Scrape Hacker News
async function scrapeHN() {
  console.log('Scraping Hacker News...');
  const html = await fetchPage('https://news.ycombinator.com/', 1500);
  const stories = parseHNStories(html);
  
  const aiStories = stories.filter(s => {
    const text = (s.title + ' ' + s.url).toLowerCase();
    return CONFIG.keywords.some(k => text.includes(k.toLowerCase()));
  }).slice(0, CONFIG.maxItems);
  
  return aiStories.map(s => ({
    source: 'Hacker News',
    title: s.title,
    url: s.url,
    points: s.points,
    domain: s.domain
  }));
}

// Scrape Reddit r/LocalLLaMA
async function scrapeReddit() {
  console.log('Scraping Reddit r/LocalLLaMA...');
  
  try {
    const data = await fetchJSON('https://www.reddit.com/r/LocalLLaMA/hot.json?limit=25', 2000);
    
    const posts = data.data.children
      .filter(post => {
        const title = post.data.title.toLowerCase();
        return CONFIG.keywords.some(k => title.includes(k.toLowerCase()));
      })
      .slice(0, CONFIG.maxItems);
    
    return posts.map(p => ({
      source: 'Reddit r/LocalLLaMA',
      title: p.data.title,
      url: `https://reddit.com${p.data.permalink}`,
      score: p.data.score,
      comments: p.data.num_comments
    }));
  } catch (e) {
    console.error('Reddit scrape error:', e.message);
    return [];
  }
}

// Scrape Twitter (placeholder - requires API)
async function scrapeTwitter() {
  console.log('Note: Twitter scraping requires API keys. Using mock data.');
  return [
    { source: 'Twitter', title: 'OpenAI announces new model updates', url: '#', engagements: 0 },
    { source: 'Twitter', title: 'Claude 4 reasoning capabilities revealed', url: '#', engagements: 0 }
  ];
}

// Analyze trends
function analyzeTrends(items) {
  const keywordCounts = {};
  CONFIG.keywords.forEach(k => keywordCounts[k] = 0);
  
  items.forEach(item => {
    const text = item.title.toLowerCase();
    CONFIG.keywords.forEach(k => {
      if (text.includes(k.toLowerCase())) {
        keywordCounts[k]++;
      }
    });
  });
  
  return {
    topKeywords: Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
    totalItems: items.length,
    sources: [...new Set(items.map(i => i.source))]
  };
}

// Write to Obsidian daily notes
async function writeToObsidian(trends) {
  const today = new Date().toISOString().split('T')[0];
  const filename = path.join(CONFIG.obsidianPath, `${today}.md`);
  
  const content = `# AI News Trends - ${today}

## Top Trending Topics

${trends.items.map((item, i) => `${i + 1}. **${item.title}** (${item.source})`).join('\n')}

## Keyword Analysis

${trends.analysis.topKeywords.map(([k, v]) => `- ${k}: ${v} mentions`).join('\n')}

## Sources
${trends.analysis.sources.join(', ')}

---
*Generated by AI News Trend Tracker*
`;

  if (!fs.existsSync(CONFIG.obsidianPath)) {
    fs.mkdirSync(CONFIG.obsidianPath, { recursive: true });
  }
  
  fs.writeFileSync(filename, content);
  console.log(`Wrote to Obsidian: ${filename}`);
}

// Write to Notion database
async function writeToNotion(trends) {
  if (!CONFIG.notionApiKey || !CONFIG.notionDatabaseId) {
    console.log('Notion credentials not configured, skipping...');
    return;
  }
  
  const state = loadState();
  
  for (const item of trends.items) {
    if (state.seenItems.has(item.url)) continue;
    
    try {
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CONFIG.notionApiKey}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
          parent: { database_id: CONFIG.notionDatabaseId },
          properties: {
            Name: { title: [{ text: { content: item.title } }] },
            Source: { rich_text: [{ text: { content: item.source } }] },
            URL: { url: item.url },
            Type: { select: { name: 'AI News' } },
            Date: { date: { start: new Date().toISOString().split('T')[0] } }
          }
        })
      });
      
      if (response.ok) {
        state.seenItems.add(item.url);
      }
      await delay(500);
    } catch (e) {
      console.error('Notion write error:', e.message);
    }
  }
  
  saveState(state);
}

// Main execution
async function main() {
  console.log('=== AI News Trend Tracker Starting ===');
  
  const state = loadState();
  state.lastRun = new Date().toISOString();
  
  const [hn, reddit, twitter] = await Promise.all([
    scrapeHN(),
    scrapeReddit(),
    scrapeTwitter()
  ]);
  
  const items = [...hn, ...reddit, ...twitter].slice(0, CONFIG.maxItems);
  const analysis = analyzeTrends(items);
  
  const trends = { items, analysis };
  
  // Output JSON
  const jsonOutput = JSON.stringify(trends, null, 2);
  console.log('\n--- TRENDS JSON ---\n');
  console.log(jsonOutput);
  
  await Promise.all([
    writeToObsidian(trends),
    writeToNotion(trends)
  ]);
  
  saveState(state);
  console.log('\n=== AI News Trend Tracker Complete ===');
}

main().catch(console.error);