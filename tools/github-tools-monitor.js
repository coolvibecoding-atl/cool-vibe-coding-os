#!/usr/bin/env node
/**
 * GitHub New Tools Monitor
 * Tracks new repositories tagged with AI, LLM, agents, etc.
 * Focuses on tools, frameworks, SDKs - not tutorials
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

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
  stateFile: path.join(__dirname, 'state', 'github-tools-state.json'),
  tags: ['ai', 'llm', 'agents', 'openai', 'anthropic', 'gpt', 'rag', 'fine-tuning'],
  maxRepos: 10,
  excludeWords: ['tutorial', 'example', 'learn', 'course', 'demo', 'blog', 'doc', 'scratch']
};

// Ensure state directory
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
  return { seenRepos: new Set(), lastRun: null, trending: [] };
}

// Save state
function saveState(state) {
  fs.writeFileSync(CONFIG.stateFile, JSON.stringify(state, null, 2));
}

// Rate limiting
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// GitHub API fetch
async function githubFetch(endpoint, delayMs = 1500) {
  await delay(delayMs);
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: endpoint,
      method: 'GET',
      headers: {
        'User-Agent': 'GitHub-Tools-Monitor/1.0',
        'Accept': 'application/vnd.github.v3+json'
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
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => req.destroy());
    req.end();
  });
}

// Get date N months ago
function getDateMonthsAgo(months) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().split('T')[0];
}

// Search GitHub repos by topic
async function searchByTopic(topic) {
  console.log(`Searching GitHub for topic: ${topic}...`);
  try {
    const query = encodeURIComponent(`topic:${topic} stars:>5 created:>${getDateMonthsAgo(3)}`);
    const data = await githubFetch(`/search/repositories?q=${query}&sort=stars&order=desc&per_page=20`, 2000);
    
    return (data.items || []).map(repo => ({
      name: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      language: repo.language,
      topics: repo.topics,
      created: repo.created_at,
      updated: repo.updated_at
    }));
  } catch (e) {
    console.error(`GitHub API error for ${topic}:`, e.message);
    return [];
  }
}

// Filter out tutorials and non-tools
function filterTools(repos) {
  return repos.filter(repo => {
    const text = (repo.name + ' ' + (repo.description || '') + ' ' + (repo.topics || []).join(' ')).toLowerCase();
    return !CONFIG.excludeWords.some(w => text.includes(w));
  });
}

// Analyze trends
function analyzeTrends(repos) {
  const languageCounts = {};
  const topicCounts = {};
  const avgStars = repos.reduce((sum, r) => sum + r.stars, 0) / repos.length;
  
  repos.forEach(repo => {
    if (repo.language) languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    (repo.topics || []).forEach(t => {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    });
  });
  
  return {
    topLanguages: Object.entries(languageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
    topTopics: Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
    avgStars: Math.round(avgStars),
    totalRepos: repos.length
  };
}

// Write to Obsidian
async function writeToObsidian(toolsData) {
  const today = new Date().toISOString().split('T')[0];
  const filename = path.join(CONFIG.obsidianPath, `${today}.md`);
  
  const analysis = toolsData.analysis;
  const repos = toolsData.repos;
  
  const content = `# GitHub AI Tools - ${today}

## Top New Tools

${repos.slice(0, 10).map((r, i) => `${i + 1}. **${r.name}** ⭐ ${r.stars} - ${r.description || 'No description'}`).join('\n')}

## Technology Trends

**Languages:** ${analysis.topLanguages.map(([l, c]) => `${l} (${c})`).join(', ')}

**Topics:** ${analysis.topTopics.map(([t, c]) => `${t} (${c})`).join(', ')}

## Stats

- Average stars: ${analysis.avgStars}
- Total new tools: ${analysis.totalRepos}

---
*Generated by GitHub Tools Monitor*
`;

  if (!fs.existsSync(CONFIG.obsidianPath)) {
    fs.mkdirSync(CONFIG.obsidianPath, { recursive: true });
  }
  
  let existingContent = '';
  if (fs.existsSync(filename)) {
    existingContent = fs.readFileSync(filename, 'utf8');
  }
  
  fs.writeFileSync(filename, existingContent + '\n\n' + content);
  console.log(`Wrote to Obsidian: ${filename}`);
}

// Write to Notion
async function writeToNotion(toolsData) {
  if (!CONFIG.notionApiKey || !CONFIG.notionDatabaseId) {
    console.log('Notion credentials not configured, skipping...');
    return;
  }
  
  const state = loadState();
  
  for (const repo of toolsData.repos) {
    if (state.seenRepos.has(repo.url)) continue;
    
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
            Name: { title: [{ text: { content: repo.name } }] },
            Description: { rich_text: [{ text: { content: repo.description || '' } }] },
            Stars: { number: repo.stars },
            Language: { rich_text: [{ text: { content: repo.language || 'N/A' } }] },
            URL: { url: repo.url },
            Type: { select: { name: 'GitHub Tool' } },
            Date: { date: { start: new Date().toISOString().split('T')[0] } }
          }
        })
      });
      
      if (response.ok) state.seenRepos.add(repo.url);
      await delay(500);
    } catch (e) {
      console.error('Notion write error:', e.message);
    }
  }
  
  saveState(state);
}

// Main
async function main() {
  console.log('=== GitHub Tools Monitor Starting ===');
  
  const state = loadState();
  state.lastRun = new Date().toISOString();
  
  // Search multiple topics
  const allRepos = [];
  for (const tag of CONFIG.tags) {
    const repos = await searchByTopic(tag);
    allRepos.push(...repos);
  }
  
  // Deduplicate
  const uniqueRepos = [];
  const seen = new Set();
  allRepos.forEach(repo => {
    if (!seen.has(repo.url)) {
      seen.add(repo.url);
      uniqueRepos.push(repo);
    }
  });
  
  const filteredRepos = filterTools(uniqueRepos)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, CONFIG.maxRepos);
  
  const analysis = analyzeTrends(filteredRepos);
  const toolsData = { repos: filteredRepos, analysis };
  
  console.log('\n--- TOOLS JSON ---\n');
  console.log(JSON.stringify(toolsData, null, 2));
  
  await Promise.all([
    writeToObsidian(toolsData),
    writeToNotion(toolsData)
  ]);
  
  saveState(state);
  console.log('\n=== GitHub Tools Monitor Complete ===');
}

main().catch(console.error);