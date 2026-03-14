#!/usr/bin/env node
/**
 * GitHub New Tools Monitor
 * Tracks new AI/LLM repositories and trending tools
 * Identifies emerging frameworks and SDKs
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const CONFIG = {
  obsidianDir: process.env.OBSIDIAN_DAILY_DIR,
  notionKey: process.env.NOTION_API_KEY,
  telegramToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChat: process.env.TELEGRAM_CHAT_ID,
  stateFile: path.join(__dirname, '.state', 'github-monitor.json'),
  githubToken: process.env.GITHUB_TOKEN
};

const TOPICS = ['ai', 'llm', 'agents', 'openai', 'anthropic', 'langchain', 'llama', 'gpt', 'claude'];

// State management
function loadState() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG.stateFile, 'utf8'));
  } catch {
    return { lastRun: null, seenRepos: [], trending: [] };
  }
}

function saveState(state) {
  fs.mkdirSync(path.dirname(CONFIG.stateFile), { recursive: true });
  fs.writeFileSync(CONFIG.stateFile, JSON.stringify(state, null, 2));
}

// GitHub API with auth
async function githubAPI(endpoint) {
  const headers = {
    'User-Agent': 'CVB-GitHubBot/1.0',
    'Accept': 'application/vnd.github.v3+json'
  };
  if (CONFIG.githubToken) {
    headers['Authorization'] = `token ${CONFIG.githubToken}`;
  }
  
  try {
    const response = await axios.get(`https://api.github.com${endpoint}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`GitHub API error (${endpoint}):`, error.message);
    return null;
  }
}

// Search new repos by topic
async function searchNewRepos(topic) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const dateStr = oneWeekAgo.toISOString().split('T')[0];
  
  const data = await githubAPI(`/search/repositories?q=topic:${topic}+created:>${dateStr}&sort=stars&order=desc&per_page=10`);
  
  if (!data || !data.items) return [];
  
  return data.items.map(repo => ({
    id: repo.full_name,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || 'No description',
    url: repo.html_url,
    stars: repo.stargazers_count,
    language: repo.language,
    topics: repo.topics || [],
    created: repo.created_at,
    updated: repo.updated_at,
    topic
  }));
}

// Get trending repos (starred recently)
async function getTrendingRepos() {
  const data = await githubAPI('/search/repositories?q=stars:>100+pushed:>2024-01-01&sort=stars&order=desc&per_page=20');
  
  if (!data || !data.items) return [];
  
  // Filter for AI-related
  return data.items
    .filter(repo => {
      const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
      return TOPICS.some(t => text.includes(t.toLowerCase()));
    })
    .map(repo => ({
      id: repo.full_name,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || 'No description',
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      topics: repo.topics || [],
      trending: true
    }));
}

// Filter tools (not tutorials/examples)
function filterTools(repos) {
  const tutorialKeywords = ['tutorial', 'example', 'course', 'learn', 'awesome-list', 'curated'];
  
  return repos.filter(repo => {
    const text = `${repo.name} ${repo.description}`.toLowerCase();
    return !tutorialKeywords.some(kw => text.includes(kw.toLowerCase()));
  });
}

// Categorize repos
function categorizeRepo(repo) {
  const text = `${repo.name} ${repo.description} ${repo.topics.join(' ')}`.toLowerCase();
  
  if (text.includes('framework') || text.includes('sdk')) return 'Framework/SDK';
  if (text.includes('library') || text.includes('package')) return 'Library';
  if (text.includes('tool') || text.includes('cli')) return 'Tool/CLI';
  if (text.includes('model') || text.includes('checkpoint')) return 'Model/Weights';
  if (text.includes('app') || text.includes('application')) return 'Application';
  return 'Other';
}

// Write to Obsidian
function writeToObsidian(newRepos, trending) {
  const today = new Date().toISOString().split('T')[0];
  const filename = path.join(CONFIG.obsidianDir, `${today}.md`);
  
  let content = `\n\n## 🛠️ GitHub Tools Monitor - ${today}\n\n`;
  content += `*Tracked: ${new Date().toLocaleString()}*\n\n`;
  
  // New discoveries
  if (newRepos.length > 0) {
    content += `### 🆕 New AI/LLM Tools\n\n`;
    
    const byCategory = {};
    newRepos.forEach(repo => {
      const cat = categorizeRepo(repo);
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(repo);
    });
    
    Object.entries(byCategory).forEach(([cat, repos]) => {
      content += `#### ${cat}\n\n`;
      repos.forEach(repo => {
        content += `- **${repo.name}** ([${repo.fullName}](${repo.url}))\n`;
        content += `  ${repo.description.slice(0, 100)}${repo.description.length > 100 ? '...' : ''}\n`;
        content += `  ⭐ ${repo.stars} | ${repo.language || 'N/A'} | Topic: ${repo.topic}\n\n`;
      });
    });
  }
  
  // Trending
  if (trending.length > 0) {
    content += `### 🔥 Trending AI Tools\n\n`;
    trending.slice(0, 5).forEach(repo => {
      content += `- **${repo.name}** ([${repo.fullName}](${repo.url})) - ⭐ ${repo.stars}\n`;
    });
    content += '\n';
  }
  
  fs.mkdirSync(CONFIG.obsidianDir, { recursive: true });
  
  if (fs.existsSync(filename)) {
    fs.appendFileSync(filename, content);
  } else {
    fs.writeFileSync(filename, `# Daily Notes - ${today}\n\n${content}`);
  }
  
  console.log(`✅ Written to Obsidian: ${filename}`);
}

// Telegram alert
async function sendTelegram(message) {
  if (!CONFIG.telegramToken || !CONFIG.telegramChat) return;
  
  const chatId = CONFIG.telegramChat.replace('telegram:', '');
  const url = `https://api.telegram.org/bot${CONFIG.telegramToken}/sendMessage`;
  
  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });
  } catch (e) {
    console.error('Telegram failed:', e.message);
  }
}

// Main
async function main() {
  console.log('🛠️ Starting GitHub Tools Monitor...');
  
  const state = loadState();
  const allNewRepos = [];
  
  // Search each topic
  for (const topic of TOPICS) {
    console.log(`🔍 Searching topic: ${topic}...`);
    const repos = await searchNewRepos(topic);
    allNewRepos.push(...repos);
    
    // Rate limit protection
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // Filter new repos only
  const newRepos = allNewRepos.filter(r => !state.seenRepos.includes(r.id));
  const filteredRepos = filterTools(newRepos);
  
  // Get trending
  const trending = await getTrendingRepos();
  
  console.log(`📊 Found ${filteredRepos.length} new tools (${newRepos.length - filteredRepos.length} filtered as tutorials)`);
  
  if (filteredRepos.length > 0 || trending.length > 0) {
    writeToObsidian(filteredRepos, trending);
    
    state.seenRepos.push(...newRepos.map(r => r.id));
    state.trending = trending.map(r => r.id);
    state.lastRun = new Date().toISOString();
    saveState(state);
    
    const summary = `🛠️ *GitHub Tools Update*\n\nFound ${filteredRepos.length} new AI/LLM tools\n🔥 ${trending.length} trending repos`;
    await sendTelegram(summary);
  } else {
    console.log('📭 No new tools found');
  }
  
  console.log('✅ Complete');
}

main().catch(async (err) => {
  console.error('❌ Error:', err);
  await sendTelegram(`🚨 GitHub Monitor Error: ${err.message}`);
  process.exit(1);
});
