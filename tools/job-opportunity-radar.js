#!/usr/bin/env node
/**
 * Job Opportunity Radar
 * Tracks AI/ML job postings from multiple sources
 * Identifies hiring signals and opportunity gaps
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
  stateFile: path.join(__dirname, '.state', 'job-radar.json')
};

const SEARCH_TERMS = [
  'AI engineer', 'LLM engineer', 'Machine learning engineer',
  'AI product manager', 'ML researcher', 'AI infrastructure',
  'fine-tuning', 'RAG engineer', 'AI ops'
];

// State management
function loadState() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG.stateFile, 'utf8'));
  } catch {
    return { lastRun: null, seenJobs: [], companies: {} };
  }
}

function saveState(state) {
  fs.mkdirSync(path.dirname(CONFIG.stateFile), { recursive: true });
  fs.writeFileSync(CONFIG.stateFile, JSON.stringify(state, null, 2));
}

// RemoteOK API
async function fetchRemoteOK() {
  try {
    const response = await axios.get('https://remoteok.com/api', {
      headers: { 'User-Agent': 'CVB-JobBot/1.0' }
    });
    
    return response.data
      .filter(job => job && job.position)
      .map(job => ({
        id: `remoteok-${job.id}`,
        title: job.position,
        company: job.company,
        location: job.location || 'Remote',
        tags: job.tags || [],
        url: job.apply_url || job.url,
        salary: job.salary || 'Not listed',
        source: 'RemoteOK'
      }));
  } catch (error) {
    console.error('RemoteOK fetch failed:', error.message);
    return [];
  }
}

// WeWorkRemotely scraping
async function fetchWeWorkRemotely() {
  try {
    const response = await axios.get('https://weworkremotely.com/remote-jobs.json', {
      headers: { 'User-Agent': 'CVB-JobBot/1.0' }
    });
    
    return response.data.map(job => ({
      id: `wework-${job.id}`,
      title: job.title,
      company: job.company_name,
      location: 'Remote',
      category: job.category,
      url: job.url,
      salary: 'Not listed',
      source: 'WeWorkRemotely'
    }));
  } catch (error) {
    console.error('WeWorkRemotely fetch failed:', error.message);
    return [];
  }
}

// Filter AI-related jobs
function filterAIJobs(jobs) {
  return jobs.filter(job => {
    const text = `${job.title} ${job.tags?.join(' ') || ''}`.toLowerCase();
    return SEARCH_TERMS.some(term => text.includes(term.toLowerCase()));
  });
}

// Analyze hiring signals
function analyzeSignals(jobs, state) {
  const companies = {};
  
  jobs.forEach(job => {
    if (!companies[job.company]) {
      companies[job.company] = {
        name: job.company,
        jobCount: 0,
        roles: [],
        signals: []
      };
    }
    companies[job.company].jobCount++;
    companies[job.company].roles.push(job.title);
  });
  
  // Flag aggressive hiring (3+ open roles)
  Object.values(companies).forEach(c => {
    if (c.jobCount >= 3) {
      c.signals.push('🔥 Aggressive hiring (3+ roles)');
    }
    if (c.roles.some(r => r.toLowerCase().includes('senior') || r.toLowerCase().includes('staff'))) {
      c.signals.push('💎 Senior-level focus');
    }
  });
  
  return companies;
}

// Write to Obsidian
function writeToObsidian(jobs, companies) {
  const today = new Date().toISOString().split('T')[0];
  const filename = path.join(CONFIG.obsidianDir, `${today}.md`);
  
  let content = `\n\n## 💼 Job Market Intelligence - ${today}\n\n`;
  content += `*Tracked: ${new Date().toLocaleString()}*\n\n`;
  
  // Hot companies
  const hotCompanies = Object.values(companies).filter(c => c.signals.length > 0);
  if (hotCompanies.length > 0) {
    content += `### 🔥 Hot Companies\n\n`;
    hotCompanies.forEach(c => {
      content += `**${c.name}** - ${c.jobCount} open roles\n`;
      content += `- ${c.signals.join(', ')}\n`;
      content += `- Roles: ${c.roles.slice(0, 3).join(', ')}${c.roles.length > 3 ? '...' : ''}\n\n`;
    });
  }
  
  // Recent jobs
  content += `### 📋 Recent AI/ML Jobs (${jobs.length} found)\n\n`;
  jobs.slice(0, 10).forEach((job, i) => {
    content += `${i + 1}. **${job.title}** @ ${job.company}\n`;
    content += `   - [Apply](${job.url}) | ${job.location} | ${job.salary}\n\n`;
  });
  
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
  console.log('💼 Starting Job Opportunity Radar...');
  
  const state = loadState();
  
  const [remoteJobs, weworkJobs] = await Promise.all([
    fetchRemoteOK(),
    fetchWeWorkRemotely()
  ]);
  
  const allJobs = [...remoteJobs, ...weworkJobs];
  const aiJobs = filterAIJobs(allJobs);
  const newJobs = aiJobs.filter(j => !state.seenJobs.includes(j.id));
  
  if (newJobs.length === 0) {
    console.log('📭 No new AI/ML jobs found');
    return;
  }
  
  console.log(`📊 Found ${newJobs.length} new AI/ML jobs`);
  
  const companies = analyzeSignals(newJobs, state);
  
  writeToObsidian(newJobs, companies);
  
  state.seenJobs.push(...newJobs.map(j => j.id));
  state.companies = companies;
  state.lastRun = new Date().toISOString();
  saveState(state);
  
  const hotCount = Object.values(companies).filter(c => c.signals.length > 0).length;
  const summary = `💼 *Job Radar Update*\n\nFound ${newJobs.length} new AI/ML jobs\n🔥 ${hotCount} companies hiring aggressively`;
  await sendTelegram(summary);
  
  console.log('✅ Complete');
}

main().catch(async (err) => {
  console.error('❌ Error:', err);
  await sendTelegram(`🚨 Job Radar Error: ${err.message}`);
  process.exit(1);
});
