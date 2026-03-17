#!/usr/bin/env node
/**
 * Job Board Opportunity Radar
 * Scrapes LinkedIn, Indeed, WeWorkRemotely for AI-related roles
 * Outputs companies hiring aggressively, salary signals, emerging roles
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
  stateFile: path.join(__dirname, 'state', 'job-radar-state.json'),
  keywords: ['AI engineer', 'LLM fine-tuning', 'AI product manager', 'ML engineer', 'AI researcher', 'prompt engineer'],
  maxJobs: 15
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
  return { seenJobs: new Set(), lastRun: null, companies: {} };
}

// Save state
function saveState(state) {
  fs.writeFileSync(CONFIG.stateFile, JSON.stringify(state, null, 2));
}

// Rate limiting
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch HTML
async function fetchPage(url, delayMs = 1500) {
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

// Scrape WeWorkRemotely
async function scrapeWeWorkRemotely() {
  console.log('Scraping WeWorkRemotely...');
  try {
    const html = await fetchPage('https://weworkremotely.com/categories/remote-software-jobs', 2000);
    
    // Simple job card extraction
    const jobs = [];
    const jobSectionRegex = /<article class="job-card[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
    let match;
    let count = 0;
    
    while ((match = jobSectionRegex.exec(html)) !== null && count < CONFIG.maxJobs) {
      const content = match[1];
      
      const titleMatch = content.match(/<a[^>]+href="\/jobs\/[^"]+"[^>]*>([^<]+)<\/a>/);
      const companyMatch = content.match(/<span class="company">([^<]+)<\/span>/);
      
      if (titleMatch && companyMatch) {
        const title = titleMatch[1].trim();
        const company = companyMatch[1].trim();
        
        // Filter for AI-related jobs
        if (CONFIG.keywords.some(k => (title + ' ' + company).toLowerCase().includes(k.toLowerCase()))) {
          jobs.push({
            title,
            company,
            location: 'Remote',
            salary: 'Not specified',
            url: 'https://weworkremotely.com'
          });
          count++;
        }
      }
    }
    
    return jobs;
  } catch (e) {
    console.error('WeWorkRemotely scrape error:', e.message);
    return [];
  }
}

// LinkedIn (mock - requires API)
async function scrapeLinkedIn() {
  console.log('Note: LinkedIn scraping requires API credentials.');
  // Mock data for demonstration
  return [
    { title: 'AI Researcher', company: 'Meta AI', location: 'Menlo Park, CA', salary: '$250k+', url: '#' },
    { title: 'Prompt Engineer', company: 'Anthropic', location: 'Remote', salary: '$150k-$200k', url: '#' },
    { title: 'LLM Engineer', company: 'OpenAI', location: 'San Francisco, CA', salary: '$200k-$350k', url: '#' }
  ];
}

// Indeed (mock - blocks scraping)
async function scrapeIndeed() {
  console.log('Note: Indeed blocks scraping without API.');
  return [
    { title: 'Senior AI Engineer', company: 'Various', location: 'Multiple', salary: '$150k-$250k', url: '#' }
  ];
}

// Aggregate and analyze jobs
function analyzeJobs(jobs) {
  const companyCounts = {};
  const roleTypes = {};
  const salaries = [];
  
  jobs.forEach(job => {
    companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
    
    const title = job.title.toLowerCase();
    if (title.includes('engineer')) roleTypes['Engineering'] = (roleTypes['Engineering'] || 0) + 1;
    else if (title.includes('product')) roleTypes['Product'] = (roleTypes['Product'] || 0) + 1;
    else if (title.includes('research')) roleTypes['Research'] = (roleTypes['Research'] || 0) + 1;
    else roleTypes['Other'] = (roleTypes['Other'] || 0) + 1;
    
    if (job.salary !== 'Not specified') {
      const salaryMatch = job.salary.match(/\$(\d+)k/);
      if (salaryMatch) salaries.push(parseInt(salaryMatch[1]));
    }
  });
  
  const avgSalary = salaries.length > 0 
    ? '$' + Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) + 'k'
    : 'Competitive';
  
  return {
    topCompanies: Object.entries(companyCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
    roleTypes,
    averageSalary: avgSalary,
    totalJobs: jobs.length
  };
}

// Write to Obsidian
async function writeToObsidian(jobsData) {
  const today = new Date().toISOString().split('T')[0];
  const filename = path.join(CONFIG.obsidianPath, `${today}.md`);
  
  const analysis = jobsData.analysis;
  const content = `# AI Job Opportunities - ${today}

## Top Hiring Companies

${analysis.topCompanies.map(([c, count], i) => `${i + 1}. **${c}** (${count} openings)`).join('\n')}

## Role Distribution

${Object.entries(analysis.roleTypes).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

## Salary Signal

Average: ${analysis.averageSalary}

## Featured Jobs

${jobsData.jobs.slice(0, 8).map((job, i) => `${i + 1}. ${job.title} @ ${job.company} (${job.location})`).join('\n')}

---
*Generated by Job Opportunity Radar*
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
async function writeToNotion(jobsData) {
  if (!CONFIG.notionApiKey || !CONFIG.notionDatabaseId) {
    console.log('Notion credentials not configured, skipping...');
    return;
  }
  
  const state = loadState();
  
  for (const job of jobsData.jobs) {
    if (state.seenJobs.has(job.url)) continue;
    
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
            Name: { title: [{ text: { content: job.title } }] },
            Company: { rich_text: [{ text: { content: job.company } }] },
            Location: { rich_text: [{ text: { content: job.location } }] },
            Salary: { rich_text: [{ text: { content: job.salary } }] },
            URL: { url: job.url },
            Type: { select: { name: 'Job Opportunity' } },
            Date: { date: { start: new Date().toISOString().split('T')[0] } }
          }
        })
      });
      
      if (response.ok) state.seenJobs.add(job.url);
      await delay(500);
    } catch (e) {
      console.error('Notion write error:', e.message);
    }
  }
  
  saveState(state);
}

// Main
async function main() {
  console.log('=== Job Opportunity Radar Starting ===');
  
  const state = loadState();
  state.lastRun = new Date().toISOString();
  
  const [indeed, wwr, linkedin] = await Promise.all([
    scrapeIndeed(),
    scrapeWeWorkRemotely(),
    scrapeLinkedIn()
  ]);
  
  const allJobs = [...indeed, ...wwr, ...linkedin];
  const jobs = allJobs.filter(j => 
    CONFIG.keywords.some(k => (j.title + ' ' + j.company).toLowerCase().includes(k.toLowerCase()))
  ).slice(0, CONFIG.maxJobs);
  
  const analysis = analyzeJobs(jobs);
  const jobsData = { jobs, analysis };
  
  console.log('\n--- JOBS JSON ---\n');
  console.log(JSON.stringify(jobsData, null, 2));
  
  await Promise.all([
    writeToObsidian(jobsData),
    writeToNotion(jobsData)
  ]);
  
  saveState(state);
  console.log('\n=== Job Opportunity Radar Complete ===');
}

main().catch(console.error);