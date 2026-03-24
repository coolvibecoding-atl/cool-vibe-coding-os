#!/usr/bin/env node

/**
 * Enhanced Morning Briefing
 * Reliable daily briefing with Telegram delivery, state tracking, duplicate protection,
 * and failure metadata for heartbeat monitoring.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(WORKSPACE_ROOT, '.env');
const STATE_DIR = path.join(WORKSPACE_ROOT, '.openclaw', 'state');
const STATE_FILE = path.join(STATE_DIR, 'morning-briefing-status.json');
const LOCK_FILE = path.join(STATE_DIR, 'morning-briefing.lock');

loadEnvFile(ENV_FILE);
try {
  require('dotenv').config({ path: ENV_FILE, quiet: true });
} catch {
  // dotenv is optional; manual loader above is enough.
}

const CONFIG = {
  workspaceRoot: WORKSPACE_ROOT,
  obsidianDailyDir: process.env.OBSIDIAN_DAILY_DIR || '/Users/coolvibecoding/Documents/Obsidian/Daily/',
  obsidianArchiveDir: process.env.OBSIDIAN_ARCHIVE_DIR || '/Users/coolvibecoding/Documents/Obsidian/Daily/Archive/',
  videoIdeasFile: process.env.VIDEO_IDEAS_FILE || '/Users/coolvibecoding/Desktop/Projects/video-ideas.md',
  telegram: {
    enabled: true,
    chatId: process.env.TELEGRAM_CHAT_ID || '-1003713071598',
    botToken: process.env.TELEGRAM_BOT_TOKEN || ''
  },
  notion: {
    enabled: true,
    databaseId: process.env.NOTION_DATABASE_ID,
    apiKey: process.env.NOTION_API_KEY
  },
  twitter: { enabled: true, topN: 10 },
  reddit: {
    enabled: true,
    subreddits: ['artificial', 'MachineLearning', 'technology', 'indiehackers', 'SaaS'],
    postsPerSub: 10
  },
  hackerNews: { enabled: true, topStories: 30 },
  rss: {
    enabled: true,
    feeds: [
      // REMOVED: techmeme.com - it's a link aggregator, not a primary source
      'https://techcrunch.com/feed/',
      'https://www.theverge.com/rss/index.xml',
      'https://blog.google/technology/ai/rss/',
      'https://www.technologyreview.com/feed/'
    ]
  },
  // Block known spam/SEO-bait domains that pollute RSS feeds
  // Includes link aggregators (Techmeme) that don't link to original articles
  spamDomains: [
    'techncruncher.blogspot.com',
    'techncruncher.blogspot.co.uk',
    'techmeme.com',
    'www.techmeme.com'
  ],
  interests: {
    'AI news': ['ai', 'artificial intelligence', 'machine learning', 'llm', 'gpt', 'openai', 'anthropic', 'claude', 'gemini', 'deepseek', 'kimi', 'perplexity', 'mistral', 'qwen'],
    'Developer tools': ['developer', 'developer tools', 'programming', 'coding', 'software', 'api', 'github', 'git', 'vscode', 'ide', 'cli', 'framework', 'library', 'npm', 'pip', 'docker', 'kubernetes'],
    'Indie hacking': ['indie hacker', 'indiehacker', 'bootstrapping', 'startup', 'saas', 'side project', 'solopreneur', 'bootstrapped', 'revenue', 'profit'],
    'Content creation': ['content creation', 'creator', 'youtube', 'video', 'podcast', 'newsletter', 'writing', 'blogging', 'seo', 'social media'],
    'Tech business': ['tech business', 'funding', 'investment', 'acquired', 'ipo', 'revenue', 'profit', 'growth', 'market']
  }
};

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

function ensureStateDir() {
  fs.mkdirSync(STATE_DIR, { recursive: true });
}

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getTodayFilename() {
  return `${todayKey()}-briefing.md`;
}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeState(patch) {
  ensureStateDir();
  const next = { ...readState(), ...patch, updatedAt: new Date().toISOString() };
  fs.writeFileSync(STATE_FILE, JSON.stringify(next, null, 2));
  return next;
}

function withLock(fn) {
  ensureStateDir();
  
  // Check for stale lock file (older than 30 minutes)
  try {
    const stat = fs.statSync(LOCK_FILE);
    const lockAge = Date.now() - stat.mtimeMs;
    const MAX_LOCK_AGE = 30 * 60 * 1000; // 30 minutes
    if (lockAge > MAX_LOCK_AGE) {
      log(`⚠️ Removing stale lock file (${Math.round(lockAge/60000)} minutes old)`);
      fs.unlinkSync(LOCK_FILE);
    }
  } catch {
    // Lock file doesn't exist, that's fine
  }
  
  try {
    const fd = fs.openSync(LOCK_FILE, 'wx');
    fs.closeSync(fd);
  } catch {
    throw new Error(`Another morning briefing run is already in progress (${LOCK_FILE})`);
  }

  return Promise.resolve()
    .then(fn)
    .finally(() => {
      try { fs.unlinkSync(LOCK_FILE); } catch {}
    });
}

function scoreContent(text, interests) {
  const lower = (text || '').toLowerCase();
  let score = 0;
  const matchedCategories = [];
  for (const [category, keywords] of Object.entries(interests)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        score += 1;
        if (!matchedCategories.includes(category)) matchedCategories.push(category);
      }
    }
  }
  return { score, matchedCategories };
}

function fetchUrl(url, headers = {}, redirects = 0) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'CoolVibeCodingMorningBriefing/1.0',
        'Accept': '*/*',
        ...headers
      }
    }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 3) {
        res.resume();
        const nextUrl = new URL(res.headers.location, url).toString();
        resolve(fetchUrl(nextUrl, headers, redirects + 1));
        return;
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
      res.on('error', reject);
    });
    req.on('timeout', () => req.destroy(new Error(`Timeout fetching ${url}`)));
    req.on('error', reject);
  });
}

function findExecutable(name) {
  const candidates = [
    `/Users/coolvibecoding/.nvm/versions/node/v22.22.0/bin/${name}`,
    `/Users/coolvibecoding/.nvm/versions/node/v24.14.0/bin/${name}`,
    `/usr/local/bin/${name}`,
    `/opt/homebrew/bin/${name}`,
    path.join(process.env.HOME || '', '.local', 'bin', name),
    path.join(process.env.HOME || '', '.bun', 'bin', name)
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      fs.accessSync(candidate, fs.constants.X_OK);
      return candidate;
    } catch {}
  }
  return name;
}

async function sendTelegramMessage(text) {
  if (!CONFIG.telegram.botToken || !CONFIG.telegram.chatId) {
    log('⚠️ Telegram credentials unavailable; skipping Telegram delivery');
    return { ok: false, skipped: true, reason: 'missing_credentials' };
  }

  const payload = JSON.stringify({
    chat_id: CONFIG.telegram.chatId,
    text,
    parse_mode: 'Markdown',
    disable_web_page_preview: true
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${CONFIG.telegram.botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let response = '';
      res.on('data', chunk => { response += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          log('✅ Telegram message sent');
          resolve({ ok: true });
        } else {
          log(`❌ Telegram send failed: ${res.statusCode}`);
          resolve({ ok: false, statusCode: res.statusCode, body: response.slice(0, 500) });
        }
      });
    });

    req.on('error', (err) => {
      log(`❌ Telegram request error: ${err.message}`);
      resolve({ ok: false, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

// HTML version for clickable links
async function sendTelegramMessageHTML(text) {
  if (!CONFIG.telegram.botToken || !CONFIG.telegram.chatId) {
    log('⚠️ Telegram credentials unavailable; skipping Telegram delivery');
    return { ok: false, skipped: true, reason: 'missing_credentials' };
  }

  const payload = JSON.stringify({
    chat_id: CONFIG.telegram.chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: false
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${CONFIG.telegram.botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let response = '';
      res.on('data', chunk => { response += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          log('✅ Telegram HTML message sent');
          resolve({ ok: true });
        } else {
          log(`❌ Telegram HTML send failed: ${res.statusCode} ${response.slice(0,200)}`);
          resolve({ ok: false, statusCode: res.statusCode, body: response.slice(0, 500) });
        }
      });
    });

    req.on('error', (err) => {
      log(`❌ Telegram request error: ${err.message}`);
      resolve({ ok: false, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

async function errorAlert(msg) {
  log(`🚨 ALERT: ${msg}`);
  writeState({
    lastErrorAt: new Date().toISOString(),
    lastError: msg,
    today: todayKey(),
    ok: false
  });
  return sendTelegramMessage(`🚨 *Morning Briefing Alert*\n\n${escapeTelegramMarkdown(msg)}`);
}

function escapeTelegramMarkdown(text) {
  return String(text || '').replace(/([_\*\[\]\(\)~`>#+\-=|{}.!])/g, '\\$1');
}

// SkillBoss API caller
async function skillbossRun(modelId, inputs) {
  const apiKey = process.env.SKILLBOSS_API_KEY;
  if (!apiKey) {
    throw new Error('SKILLBOSS_API_KEY not configured');
  }
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ model: modelId, inputs });
    const req = https.request({
      hostname: 'api.heybossai.com',
      path: '/v1/run',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 90000
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(e); }
        } else { reject(new Error(`API error ${res.statusCode}: ${data.slice(0, 200)}`)); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(payload);
    req.end();
  });
}

/**
 * Dedicated Tech Twitter Pulse fetcher
 * Uses Perplexity to search specifically for:
 * - Tech/AI startup hashtags (#AI #MachineLearning #SaaS #IndieHackers #Startup)
 * - Tech founder posts and discussions
 * - Emerging AI tools and platforms
 * - VC/funding news in tech
 */
async function fetchTechTwitterPulse() {
  if (!CONFIG.twitter.enabled) return { items: [], hashtags: [] };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Targeted query for tech-focused Twitter content
  const techQuery = `${today}. Search Twitter/X for: trending #AI #MachineLearning #SaaS #IndieHackers #Startups hashtags right now. What are tech founders, AI researchers, indie hackers discussing? Emerging AI tools, GPT alternatives, new developer tools launching. VC funding announcements, startup launches, Product Hunt trending. Tech twitter viral posts today. Include specific tweet examples with hashtag counts where available.`;

  try {
    log(`📥 Fetching Tech Twitter Pulse via SkillBoss Perplexity...`);
    const result = await skillbossRun('perplexity/search', {
      query: techQuery,
      count: 10
    });

    // SkillBoss returns result.results as array of {date, last_updated, snippet, title, url}
    const rawResults = result.results || [];
    log(`📥 Perplexity returned ${rawResults.length} raw results`);

    // Extract hashtags from results for the pulse section
    const hashtagRegex = /#[A-Za-z][A-Za-z0-9_]*/g;
    const hashtagCounts = {};
    rawResults.forEach(r => {
      const text = `${r.title || ''} ${r.snippet || ''}`;
      const hashtags = text.match(hashtagRegex) || [];
      hashtags.forEach(tag => {
        const normalized = tag.toLowerCase();
        hashtagCounts[normalized] = (hashtagCounts[normalized] || 0) + 1;
      });
    });

    // Sort and take top hashtags (filter to tech-relevant ones)
    const techHashtags = ['ai', 'machinelearning', 'saas', 'startup', 'indiehackers', 'startups', 'bootstrapped', 'buildinpublic', 'devtools', 'cloud', 'api', 'gpt', 'llm', 'opensource', 'webdev', 'programming', 'coding', 'tech', 'aito', 'tools', 'platform'];
    const topHashtags = Object.entries(hashtagCounts)
      .filter(([tag]) => {
        const base = tag.replace(/^#/, '').toLowerCase();
        return techHashtags.some(t => base.includes(t)) || /^(ai|ml|saas|llm|gpt|api)$/i.test(base);
      })
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag: tag.startsWith('#') ? tag : `#${tag}`, count }));

    const scored = rawResults
      .map((r, idx) => {
        const text = `${r.title || ''} ${r.snippet || ''}`.trim();
        const { score, matchedCategories } = scoreContent(text, CONFIG.interests);
        return {
          source: 'Tech Twitter Pulse',
          score: score + 5, // Boost perplexity results
          matchedCategories,
          text,
          title: (r.title || text).slice(0, 200),
          url: r.url || `https://x.com/search?q=trending+tech`,
          id: `techtwitter-${idx}`,
          pubDate: r.date || null
        };
      })
      .filter(item => item.score > 0 && !isSpamDomain(item.url))
      .sort((a, b) => b.score - a.score)
      .slice(0, CONFIG.twitter.topN);

    log(`✅ Tech Twitter Pulse: ${scored.length} relevant items`);
    if (scored.length > 0) {
      scored.forEach(item => log(`   [${item.score}] ${item.title.slice(0, 80)} | ${item.url.slice(0, 60)}`));
    }
    if (topHashtags.length > 0) {
      log(`   Top hashtags: ${topHashtags.map(h => `${h.tag} (${h.count})`).join(', ')}`);
    }

    return { items: scored, hashtags: topHashtags };
  } catch (err) {
    log(`⚠️ Tech Twitter Pulse fetch failed: ${err.message}`);
    return { items: [], hashtags: [] };
  }
}

// Legacy wrapper for backward compatibility
async function fetchTwitterTimeline() {
  const result = await fetchTechTwitterPulse();
  return result.items;
}

async function fetchRedditPosts() {
  if (!CONFIG.reddit.enabled) return [];

  try {
    log('📥 Fetching Reddit posts...');
    const results = [];
    for (const subreddit of CONFIG.reddit.subreddits) {
      const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${CONFIG.reddit.postsPerSub}`;
      const { status, data } = await fetchUrl(url, { 'User-Agent': 'Mozilla/5.0 CoolVibeCodingMorningBriefing/1.0' });
      if (status !== 200) {
        log(`⚠️ Reddit r/${subreddit} returned ${status}`);
        continue;
      }
      const json = JSON.parse(data);
      const posts = (json.data?.children || []).map(child => {
        const post = child.data || {};
        const { score, matchedCategories } = scoreContent(`${post.title || ''} ${post.selftext || ''}`, CONFIG.interests);
        return {
          source: 'Reddit',
          subreddit,
          title: post.title || 'Untitled Reddit post',
          text: post.selftext || '',
          score,
          matchedCategories,
          url: post.permalink ? `https://reddit.com${post.permalink}` : `https://reddit.com/r/${subreddit}`,
          upvotes: post.ups,
          comments: post.num_comments
        };
      }).filter(post => post.score > 0);
      results.push(...posts);
    }

    const unique = dedupeByUrl(results).sort((a, b) => b.score - a.score).slice(0, 15);
    log(`✅ Reddit: ${unique.length} relevant items`);
    return unique;
  } catch (err) {
    await errorAlert(`Reddit fetch failed: ${err.message}`);
    return [];
  }
}

async function fetchHackerNews() {
  if (!CONFIG.hackerNews.enabled) return [];

  try {
    log('📥 Fetching Hacker News...');
    const { status, data } = await fetchUrl('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (status !== 200) return [];

    const storyIds = JSON.parse(data).slice(0, CONFIG.hackerNews.topStories);
    const stories = [];
    for (let i = 0; i < storyIds.length; i += 5) {
      const batch = storyIds.slice(i, i + 5);
      await Promise.all(batch.map(async (id) => {
        try {
          const item = await fetchUrl(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          if (item.status !== 200) return;
          const story = JSON.parse(item.data);
          if (!story?.title) return;
          const { score, matchedCategories } = scoreContent(`${story.title} ${story.text || ''}`, CONFIG.interests);
          if (score > 0) {
            stories.push({
              source: 'Hacker News',
              title: story.title,
              text: story.text || '',
              score,
              matchedCategories,
              url: story.url || `https://news.ycombinator.com/item?id=${id}`,
              points: story.score,
              comments: story.descendants
            });
          }
        } catch {}
      }));
    }
    const top = stories.sort((a, b) => b.score - a.score).slice(0, 15);
    log(`✅ Hacker News: ${top.length} relevant items`);
    return top;
  } catch (err) {
    await errorAlert(`Hacker News fetch failed: ${err.message}`);
    return [];
  }
}

async function fetchRSSFeeds() {
  if (!CONFIG.rss.enabled) return [];
  try {
    log('📥 Fetching RSS feeds...');
    const results = [];
    await Promise.all(CONFIG.rss.feeds.map(async (feedUrl) => {
      try {
        const { status, data } = await fetchUrl(feedUrl);
        if (status !== 200) {
          log(`⚠️ RSS feed ${feedUrl} returned ${status}`);
          return;
        }
        results.push(...parseRSS(data));
      } catch (err) {
        log(`⚠️ RSS fetch error for ${feedUrl}: ${err.message}`);
      }
    }));
    const top = dedupeByUrl(results).sort((a, b) => b.score - a.score).slice(0, 20);
    log(`✅ RSS: ${top.length} relevant items`);
    return top;
  } catch (err) {
    await errorAlert(`RSS fetch failed: ${err.message}`);
    return [];
  }
}

// Known spam/SEO-bait domains to exclude from all sources
// Includes link aggregators (Techmeme) that don't link to original articles
const SPAM_DOMAINS = new Set([
  'techncruncher.blogspot.com',
  'techncruncher.blogspot.co.uk',
  'techmeme.com',
  'www.techmeme.com'
]);

function isSpamDomain(url) {
  if (!url) return false;
  try {
    const domain = new URL(url).hostname.toLowerCase();
    return SPAM_DOMAINS.has(domain) || SPAM_DOMAINS.has(domain.replace(/^www\./, ''));
  } catch { return false; }
}

// Parse various RSS date formats into a Date object
function parseRSSDate(dateStr) {
  if (!dateStr) return null;
  const cleaned = dateStr.replace(/^\s+|\s+$/g, '');
  // Try RFC 822 / RFC 2822 formats first (most common in RSS)
  const d = new Date(cleaned);
  if (!isNaN(d.getTime())) return d;
  // Try ISO 8601
  const isoMatch = cleaned.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const d2 = new Date(cleaned);
    if (!isNaN(d2.getTime())) return d2;
  }
  return null;
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  const titleRegex = /<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title[^>]*>([^<]+)<\/title>/i;
  const linkRegex = /<link[^>]*>([^<]+)<\/link>|<link[^>]*href=["']([^"']+)["'][^>]*>/i;
  const descRegex = /<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description[^>]*>([\s\S]*?)<\/description>/i;
  const pubDateRegex = /<pubDate[^>]*>([^<]+)<\/pubDate>/i;
  // Max age: 7 days for fresh content
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - maxAgeMs;
  let match;
  let globalDateMatch = pubDateRegex.exec(xml);
  let globalDate = globalDateMatch ? parseRSSDate(globalDateMatch[1]) : null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const titleMatch = titleRegex.exec(itemXml);
    const linkMatch = linkRegex.exec(itemXml);
    const descMatch = descRegex.exec(itemXml);
    const itemDateMatch = pubDateRegex.exec(itemXml);

    const title = (titleMatch?.[1] || titleMatch?.[2] || '').replace(/<[^>]+>/g, '').trim();
    const link = (linkMatch?.[1] || linkMatch?.[2] || '').trim();
    const text = (descMatch?.[1] || descMatch?.[2] || '').replace(/<[^>]+>/g, '').trim();

    if (!title || !link) continue;

    // Block spam domains
    if (isSpamDomain(link)) {
      log(`  🚫 SPAM blocked: ${link.slice(0, 80)}`);
      continue;
    }

    // Parse item-level pubDate; fall back to feed-level date if missing
    const itemDate = itemDateMatch ? parseRSSDate(itemDateMatch[1]) : globalDate;
    if (itemDate && itemDate.getTime() < cutoff) {
      log(`  🗓️ Old item skipped (${itemDate.toISOString().slice(0,10)}): ${title.slice(0, 60)}`);
      continue;
    }

    const { score, matchedCategories } = scoreContent(`${title} ${text}`, CONFIG.interests);
    if (score > 0) {
      items.push({ source: 'RSS', title, text, score, matchedCategories, url: link, pubDate: itemDate ? itemDate.toISOString() : null });
    }
  }
  return items;
}

function dedupeByUrl(items) {
  const seen = new Set();
  const unique = [];
  for (const item of items) {
    if (!item?.url || seen.has(item.url)) continue;
    seen.add(item.url);
    unique.push(item);
  }
  return unique;
}

function archiveOldBriefings() {
  try {
    if (!fs.existsSync(CONFIG.obsidianDailyDir)) return;
    const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const files = fs.readdirSync(CONFIG.obsidianDailyDir).filter(file => file.endsWith('-briefing.md'));
    let archived = 0;
    for (const file of files) {
      const src = path.join(CONFIG.obsidianDailyDir, file);
      const stats = fs.statSync(src);
      if (stats.mtimeMs >= cutoff) continue;
      fs.mkdirSync(CONFIG.obsidianArchiveDir, { recursive: true });
      fs.renameSync(src, path.join(CONFIG.obsidianArchiveDir, file));
      archived += 1;
    }
    if (archived) log(`📦 Archived ${archived} old briefings`);
  } catch (err) {
    log(`⚠️ Archive skipped: ${err.message}`);
  }
}

function shellEscape(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

async function createNotionPage(title, content) {
  if (!CONFIG.notion.apiKey || !CONFIG.notion.databaseId) {
    log('⚠️ Notion not configured, skipping');
    return { ok: false, skipped: true };
  }

  const payload = JSON.stringify({
    parent: { database_id: CONFIG.notion.databaseId },
    properties: {
      title: { title: [{ text: { content: title } }] }
    },
    children: [{
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: content.slice(0, 1900) } }]
      }
    }]
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.notion.com',
      path: '/v1/pages',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CONFIG.notion.apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let response = '';
      res.on('data', chunk => { response += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          log('✅ Notion page created');
          resolve({ ok: true });
        } else {
          log(`⚠️ Notion create failed: ${res.statusCode}`);
          resolve({ ok: false, statusCode: res.statusCode, body: response.slice(0, 500) });
        }
      });
    });
    req.on('error', (err) => resolve({ ok: false, error: err.message }));
    req.write(payload);
    req.end();
  });
}

async function generateBriefing({ force = false } = {}) {
  const state = readState();
  const today = todayKey();
  if (!force && state.today === today && state.telegramDelivered === true) {
    log('ℹ️ Morning briefing already sent successfully today; skipping duplicate run');
    return { skipped: true, reason: 'already_sent', state };
  }

  writeState({
    today,
    startedAt: new Date().toISOString(),
    ok: false,
    telegramDelivered: false,
    lastError: null,
    lastErrorAt: null
  });

  log('🚀 Starting enhanced morning briefing...');

  const [twitterPulse, redditPosts, hnStories, rssItems] = await Promise.all([
    fetchTechTwitterPulse(),
    fetchRedditPosts(),
    fetchHackerNews(),
    fetchRSSFeeds()
  ]);

  const tweets = twitterPulse.items;
  const techHashtags = twitterPulse.hashtags;

  const topItems = dedupeByUrl([...tweets, ...redditPosts, ...hnStories, ...rssItems])
    .sort((a, b) => b.score - a.score)
    .slice(0, 25);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  let markdown = `# Morning Briefing - ${dateStr}\n\n`;
  markdown += `## Top Stories (${topItems.length})\n\n`;
  if (topItems.length === 0) {
    markdown += '- No highly relevant content today.\n';
  } else {
    topItems.forEach((item, idx) => {
      markdown += `${idx + 1}. [${(item.title || item.text || 'Untitled').replace(/\]/g, '')}](${item.url})\n`;
      markdown += `   _Source: ${item.source} | Categories: ${(item.matchedCategories || []).join(', ')} | Score: ${item.score}_\n\n`;
    });
  }

  markdown += '## By Source\n\n';
  const bySource = {};
  topItems.forEach(item => { bySource[item.source] = (bySource[item.source] || 0) + 1; });
  for (const [source, count] of Object.entries(bySource)) {
    markdown += `- **${source}**: ${count} items\n`;
  }

  markdown += '\n## Video Ideas\n\n';
  const videoItems = topItems.filter(item => {
    const text = `${item.title || ''} ${item.text || ''}`.toLowerCase();
    return text.includes('how to') || text.includes('tutorial') || text.includes('explain') || text.includes('why') || text.includes('?') || (item.matchedCategories || []).includes('Content creation');
  }).slice(0, 8);
  if (videoItems.length === 0) {
    markdown += '- No clear video ideas extracted.\n';
  } else {
    videoItems.forEach((item, idx) => {
      markdown += `${idx + 1}. **${(item.title || item.text || '').slice(0, 90)}**\n`;
      markdown += `   Source: ${item.source} | ${item.url}\n\n`;
    });
  }

  // Tech Twitter Pulse section with hashtags
  if (techHashtags.length > 0) {
    markdown += '## Tech Twitter Pulse\n\n';
    markdown += '_Targeted tech/AI/startup trends from Twitter/X_\n\n';
    markdown += '**Trending Hashtags:**\n';
    techHashtags.forEach(h => {
      markdown += `- ${h.tag} (${h.count}+ mentions)\n`;
    });
    markdown += '\n';
  }

  markdown += '## Quick Hits\n\n';
  const quickHits = topItems.filter(item => `${item.title || item.text || ''}`.length < 150).slice(0, 5);
  if (quickHits.length === 0) {
    markdown += '- No quick hits.\n';
  } else {
    quickHits.forEach((item, idx) => {
      markdown += `${idx + 1}. ${(item.title || item.text || '').slice(0, 120)}...\n`;
    });
  }

  fs.mkdirSync(CONFIG.obsidianDailyDir, { recursive: true });
  const filename = getTodayFilename();
  const dailyPath = path.join(CONFIG.obsidianDailyDir, filename);
  fs.writeFileSync(dailyPath, markdown, 'utf8');
  log(`💾 Saved briefing to: ${dailyPath}`);

  archiveOldBriefings();

  if (videoItems.length > 0) {
    fs.mkdirSync(path.dirname(CONFIG.videoIdeasFile), { recursive: true });
    const section = `\n## ${dateStr} - Extracted Ideas\n\n` + videoItems.map((item, i) => `${i + 1}. ${item.title || item.text}\n   Source: ${item.source} | ${item.url}\n`).join('\n') + '\n';
    fs.appendFileSync(CONFIG.videoIdeasFile, section, 'utf8');
    log(`📹 Appended ${videoItems.length} video ideas`);
  }

  // Build detailed Telegram message with clickable links
  const topForTelegram = topItems.slice(0, 12);
  const telegramLines = [
    `🌅 <b>Morning Briefing - ${dateStr}</b>`,
    ''
  ];

  // Tech Twitter Pulse section
  if (techHashtags.length > 0 || tweets.length > 0) {
    telegramLines.push('🐦 <b>Tech Twitter Pulse</b>');
    telegramLines.push('<i>Targeted #AI #Startups #SaaS trends</i>');
    telegramLines.push('');
    if (techHashtags.length > 0) {
      telegramLines.push('<b>Trending:</b> ' + techHashtags.map(h => `${h.tag} (${h.count}+)`).join(' • '));
      telegramLines.push('');
    }
  }

  telegramLines.push(`📰 <b>${topItems.length} Stories</b> from ${Object.keys(bySource).length} sources`);
  telegramLines.push('');
  telegramLines.push('<b>━━━━ TOP STORIES ━━━━</b>');
  telegramLines.push('');

  topForTelegram.forEach((item, idx) => {
    const title = (item.title || item.text || 'Untitled').replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 80);
    const source = item.source || 'Unknown';
    const score = item.score || 0;
    telegramLines.push(`<b>${idx + 1}.</b> <a href="${item.url}">${title}</a>`);
    telegramLines.push(`   <i>${source}</i> • Score: ${score}`);
    telegramLines.push('');
  });

  if (videoItems.length > 0) {
    telegramLines.push('<b>━━━━ VIDEO IDEAS ━━━━</b>');
    telegramLines.push('');
    videoItems.slice(0, 5).forEach((item, idx) => {
      const title = (item.title || item.text || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 70);
      telegramLines.push(`<b>${idx + 1}.</b> <a href="${item.url}">${title}</a>`);
    });
    telegramLines.push('');
  }

  telegramLines.push('<b>━━━━━━━━━━━━━━━━━━━━</b>');
  telegramLines.push('');
  telegramLines.push(`<b>Sources:</b> ${Object.entries(bySource).map(([s, c]) => `${s} (${c})`).join(' • ')}`);
  telegramLines.push('');
  telegramLines.push(`<i>💾 Full report: Obsidian/Daily/${filename}</i>`);

  const telegramMsg = telegramLines.join('\n');

  // Send with HTML parse mode for clickable links
  const telegramResult = await sendTelegramMessageHTML(telegramMsg);
  const notionResult = await createNotionPage(`Morning Briefing - ${dateStr}`, markdown);

  const nextState = writeState({
    today,
    completedAt: new Date().toISOString(),
    briefingPath: dailyPath,
    itemsCount: topItems.length,
    videoIdeasCount: videoItems.length,
    telegramDelivered: telegramResult.ok === true,
    telegramLastAttemptAt: new Date().toISOString(),
    notionCreated: notionResult.ok === true,
    ok: telegramResult.ok === true,
    sources: bySource,
    runMode: force ? 'forced' : 'scheduled_or_manual'
  });

  if (!telegramResult.ok) {
    const reason = telegramResult.reason || telegramResult.error || telegramResult.statusCode || 'unknown error';
    await errorAlert(`Briefing generated but Telegram delivery failed: ${reason}`);
  }

  log('✅ Morning briefing complete!');
  return { filename, dailyPath, itemsCount: topItems.length, videoIdeasCount: videoItems.length, telegramDelivered: nextState.telegramDelivered };
}

if (require.main === module) {
  const force = process.argv.includes('--force');
  withLock(() => generateBriefing({ force }))
    .catch(async (err) => {
      log(`💥 Fatal error: ${err.stack || err.message}`);
      await errorAlert(`Morning briefing crashed: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { generateBriefing, STATE_FILE, ENV_FILE };
// test
