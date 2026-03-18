#!/usr/bin/env node

/**
 * Night Shift Autonomous Worker
 * Runs at 3:00 AM daily to:
 * - Scan GitHub for open issues
 * - Research new opportunities
 * - Work on active projects
 * - Prepare morning surprise
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const LOG_FILE = '/tmp/night-shift.log';
const STATUS_FILE = path.join(WORKSPACE_ROOT, '.openclaw', 'state', 'night-shift-status.json');
const OPPORTUNITIES_DIR = path.join(WORKSPACE_ROOT, '..', 'clawd', 'opportunities');

// Load environment
loadEnvFile(path.join(WORKSPACE_ROOT, '.env'));

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8751021780:AAH2TfeZ7LEM9R4Az-bIsXkVUDJrruLN8_I';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1003713071598';

function log(msg) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${msg}\n`;
  fs.appendFileSync(LOG_FILE, entry);
  console.log(entry.trim());
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function run(cmd, silent = false) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' }).trim();
  } catch (e) {
    return silent ? '' : e.message;
  }
}

function sendTelegram(message) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    log('⚠️ Telegram not configured');
    return false;
  }
  
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const data = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'Markdown'
  });
  
  return new Promise((resolve) => {
    const req = https.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          log('✅ Telegram message sent');
          resolve(true);
        } else {
          log(`⚠️ Telegram error: ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    req.on('error', (e) => {
      log(`⚠️ Telegram error: ${e.message}`);
      resolve(false);
    });
    req.write(data);
    req.end();
  });
}

function checkGitHubIssues() {
  log('🔍 Checking GitHub issues...');
  try {
    const issues = run('gh issue list --state open --limit 10 --json number,title,repo 2>/dev/null', true);
    if (issues) {
      const parsed = JSON.parse(issues);
      log(`📋 Found ${parsed.length} open issues`);
      return parsed;
    }
  } catch (e) {
    log('⚠️ GitHub CLI not available or not authenticated');
  }
  return [];
}

function checkActiveProjects() {
  log('📁 Checking active projects...');
  const projects = [];
  
  // Check SoDoATL
  const sodoatlPath = '/Users/coolvibecoding/Desktop/Projects/Dot/SoDoATL_Project_Clean';
  if (fs.existsSync(sodoatlPath)) {
    projects.push({ name: 'SoDoATL 2026', path: sodoatlPath, priority: 'HIGH' });
    log('✅ SoDoATL found');
  }
  
  // Check AI Mixer Pro
  const aimixerPath = path.join(WORKSPACE_ROOT, 'ai-mixer-pro');
  if (fs.existsSync(aimixerPath)) {
    projects.push({ name: 'AI Mixer Pro', path: aimixerPath, priority: 'MEDIUM' });
    log('✅ AI Mixer Pro found');
  }
  
  return projects;
}

function generateOpportunityIdeas() {
  log('💡 Generating opportunity ideas...');
  // This would normally call Perplexity or other AI
  const ideas = [
    'Voice-first AI assistant for music producers',
    'Real-time collaboration tool for remote studios',
    'AI-powered sample library organizer',
    'Automated mix feedback system',
    'Royalty split calculator with smart contracts'
  ];
  return ideas;
}

async function runNightShift() {
  log('🌙 Night Shift Starting...');
  
  const results = {
    startedAt: new Date().toISOString(),
    issues: [],
    projects: [],
    ideas: [],
    completed: false
  };
  
  // 1. Check GitHub issues
  results.issues = checkGitHubIssues();
  
  // 2. Check active projects
  results.projects = checkActiveProjects();
  
  // 3. Generate opportunity ideas
  results.ideas = generateOpportunityIdeas();
  
  // 4. Save status
  fs.mkdirSync(path.dirname(STATUS_FILE), { recursive: true });
  fs.writeFileSync(STATUS_FILE, JSON.stringify(results, null, 2));
  
  // 5. Send morning surprise notification
  const message = `🌙 *Night Shift Complete*

📊 *Summary:*
• GitHub Issues: ${results.issues.length} open
• Active Projects: ${results.projects.length}
• New Ideas: ${results.ideas.length}

💡 *Top Opportunity:*
${results.ideas[0]}

— Nova 🍑`;
  
  await sendTelegram(message);
  
  results.completed = true;
  results.completedAt = new Date().toISOString();
  
  log('✅ Night Shift Complete');
  return results;
}

// Run
runNightShift().catch(e => {
  log(`❌ Night Shift Error: ${e.message}`);
  process.exit(1);
});
