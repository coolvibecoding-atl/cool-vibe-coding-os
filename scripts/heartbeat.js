#!/usr/bin/env node

// Cool Vibe Coding - Heartbeat System
// Runs every 15 minutes to check system health and daily report pipeline health.

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const WORKSPACE_ROOT = '/Users/coolvibecoding/.openclaw/workspace';
const LOG_FILE = '/tmp/heartbeat.log';
const STATUS_FILE = path.join(WORKSPACE_ROOT, 'system-status.json');
const MORNING_STATUS_FILE = path.join(WORKSPACE_ROOT, '.openclaw', 'state', 'morning-briefing-status.json');
const AGENT_ZERO_WEB_PORT = 55025;
const AGENT_ZERO_CONTAINER = 'agent-zero';
const EXPECTED_MORNING_SCRIPT = path.join(WORKSPACE_ROOT, 'scripts', 'morning-briefing-enhanced.js');

loadEnvFile(path.join(WORKSPACE_ROOT, '.env'));

function log(message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, entry);
  console.log(entry.trim());
}

function run(command, options = {}) {
  return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options }).trim();
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

function checkDockerDaemon() {
  try {
    run('docker info');
    return { status: 'running', color: '🟢' };
  } catch {
    return { status: 'down', color: '🔴' };
  }
}

function getDockerContainerStatus(containerName) {
  try {
    const output = run(`docker inspect -f '{{.State.Status}}' ${containerName}`);
    return output || 'missing';
  } catch {
    return 'missing';
  }
}

function checkHttp(url) {
  try {
    const code = run(`curl -s -o /dev/null -w "%{http_code}" ${url}`);
    return ['200', '301', '302', '401', '403'].includes(code)
      ? { status: 'healthy', color: '🟢', code }
      : { status: 'unhealthy', color: '🔴', code };
  } catch {
    return { status: 'down', color: '🔴', code: '000' };
  }
}

function loadMorningStatus() {
  try {
    return JSON.parse(fs.readFileSync(MORNING_STATUS_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function getCrontab() {
  try {
    return run('crontab -l');
  } catch {
    return '';
  }
}

function getLaunchctlList() {
  try {
    return run('launchctl list');
  } catch {
    return '';
  }
}

function getMorningPipelineStatus() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const morningDeadlinePassed = minutes >= (8 * 60);
  const state = loadMorningStatus();
  const crontab = getCrontab();
  const launchList = getLaunchctlList();

  const cronScheduled = crontab.includes(EXPECTED_MORNING_SCRIPT);
  const launchLoaded = launchList.includes('com.coolvibecoding.morning-briefing');
  const scriptExists = fs.existsSync(EXPECTED_MORNING_SCRIPT);
  const deliveredToday = !!(state && state.today === today && state.telegramDelivered === true);

  const alerts = [];
  if (!scriptExists) alerts.push('morning script missing');
  if (!cronScheduled && !launchLoaded) alerts.push('no active morning scheduler found');
  if (morningDeadlinePassed && !deliveredToday) alerts.push('morning briefing missing Telegram send after 8:00 AM');
  if (state?.lastErrorAt && (!state.today || state.today === today) && !deliveredToday) alerts.push(`last morning error: ${state.lastError || 'unknown error'}`);

  return {
    status: alerts.length ? 'alert' : 'ok',
    color: alerts.length ? '🔴' : '🟢',
    scriptExists,
    cronScheduled,
    launchLoaded,
    deliveredToday,
    state,
    alerts
  };
}

async function sendTelegramAlert(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const payload = JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true });
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve(res.statusCode === 200));
    });
    req.on('error', () => resolve(false));
    req.write(payload);
    req.end();
  });
}

async function maybeAlertMorningFailure(morning) {
  if (morning.status !== 'alert' || !morning.alerts.length) return;
  const alertKey = `${new Date().toISOString().slice(0, 10)}:${morning.alerts.join('|')}`;
  const state = morning.state || {};
  if (state.lastHeartbeatAlertKey === alertKey) return;

  const sent = await sendTelegramAlert(`🚨 Morning briefing monitor\n\n${morning.alerts.join('\n')}`);
  try {
    const next = { ...(state || {}), lastHeartbeatAlertKey: alertKey, lastHeartbeatAlertAt: new Date().toISOString(), heartbeatAlertSent: sent };
    fs.mkdirSync(path.dirname(MORNING_STATUS_FILE), { recursive: true });
    fs.writeFileSync(MORNING_STATUS_FILE, JSON.stringify(next, null, 2));
  } catch {}
}

async function runHeartbeat() {
  log('🫀 HEARTBEAT CHECK');

  const status = {
    timestamp: new Date().toISOString(),
    services: {},
    summary: 'All systems operational'
  };

  status.services.gateway = checkHttp('http://127.0.0.1:18789');
  if (status.services.gateway.status !== 'healthy') {
    status.summary = 'Gateway DOWN - needs restart';
    log('🔴 Gateway is DOWN!');
  }

  status.services.docker = checkDockerDaemon();

  const dockerUp = status.services.docker.status === 'running';
  const containerStatus = dockerUp ? getDockerContainerStatus(AGENT_ZERO_CONTAINER) : 'docker-down';
  const webStatus = dockerUp && containerStatus === 'running'
    ? checkHttp(`http://127.0.0.1:${AGENT_ZERO_WEB_PORT}`)
    : { status: 'down', color: '🔴', code: '000' };

  status.services.agentZero = {
    container: containerStatus,
    web: webStatus.status,
    code: webStatus.code,
    color: containerStatus === 'running' && webStatus.status === 'healthy' ? '🟢' : '🔴'
  };

  try {
    run('/Users/coolvibecoding/.nvm/versions/node/v22.22.0/bin/node -v');
    status.services.node = { status: 'available', color: '🟢' };
  } catch {
    status.services.node = { status: 'not found', color: '🔴' };
  }

  try {
    run('curl -s https://api.inference.sh/v1 -o /dev/null -w "%{http_code}"');
    status.services.inferenceSh = { status: 'connected', color: '🟢' };
  } catch {
    status.services.inferenceSh = { status: 'offline', color: '🟡' };
  }

  status.services.morningBriefing = getMorningPipelineStatus();
  await maybeAlertMorningFailure(status.services.morningBriefing);

  if (status.services.docker.status !== 'running') {
    status.summary = 'Docker DOWN - Agent Zero unavailable';
  } else if (containerStatus !== 'running') {
    status.summary = `Agent Zero ${containerStatus}`;
  } else if (webStatus.status !== 'healthy') {
    status.summary = `Agent Zero web unhealthy (${webStatus.code})`;
  }

  if (status.services.morningBriefing.status === 'alert') {
    status.summary = `Morning briefing alert: ${status.services.morningBriefing.alerts.join('; ')}`;
  }

  fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));

  log(`Gateway: ${status.services.gateway.color} | Docker: ${status.services.docker.color} | Agent Zero: ${status.services.agentZero.color} | Node: ${status.services.node.color} | inference.sh: ${status.services.inferenceSh.color} | Morning: ${status.services.morningBriefing.color}`);
  log(`Summary: ${status.summary}`);

  return status;
}

runHeartbeat().catch(e => log(`Error: ${e.message}`));
