# Opportunity Trackers

Three standalone micro-tools for tracking AI opportunities:

1. **AI News Trend Tracker** - Scrapes Hacker News, Reddit r/LocalLLaMA, Twitter
2. **Job Opportunity Radar** - Monitors LinkedIn, Indeed, WeWorkRemotely
3. **GitHub New Tools Monitor** - Tracks new AI/LLM/agent repos

## Quick Start

```bash
# Clone and setup
cd tools
cp .env.example .env

# Edit .env with your credentials
nano .env

# Run locally (Node.js 18+ required)
node ai-trend-tracker.js
node job-opportunity-radar.js
node github-tools-monitor.js
```

## Docker Deployment

```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker logs ai-trend-tracker
docker logs job-opportunity-radar
docker logs github-tools-monitor

# Stop all
docker-compose down
```

## Agent Zero Deployment (Port 55025)

### Option 1: Docker-in-Docker

```bash
# Copy tools to Agent Zero container
docker cp tools/ agent-zero:/app/tools

# SSH into Agent Zero
ssh agent-zero

# Run tools inside container
cd /app/tools
docker build -t trackers .
docker run -d --name ai-tracker -v $(pwd)/state:/app/state trackers node ai-trend-tracker.js
```

### Option 2: Direct Execution (if Node.js available on Agent Zero)

```bash
# Copy files
scp -r tools/ agent-zero:~/

# SSH and run
ssh agent-zero "cd tools && npm install && node ai-trend-tracker.js"
```

### Cron Setup on Agent Zero

```bash
# Add to crontab (crontab -e)
# AI News - 6 AM daily
0 6 * * * cd /path/to/tools && node ai-trend-tracker.js >> /var/log/tracker-ai.log 2>&1

# Job Radar - 8 AM daily
0 8 * * * cd /path/to/tools && node job-opportunity-radar.js >> /var/log/tracker-jobs.log 2>&1

# GitHub Tools - 10 AM daily
0 10 * * * cd /path/to/tools && node github-tools-monitor.js >> /var/log/tracker-gh.log 2>&1
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OBSIDIAN_PATH` | Yes | Path to Obsidian Daily folder |
| `NOTION_API_KEY` | No | Integration token |
| `NOTION_DATABASE_ID` | No | Database for entries |

## Output

Each tool:
- Writes JSON output to stdout
- Appends to Obsidian daily notes
- Creates entries in Notion database (if configured)
- Maintains state to avoid re-processing items

## State Files

State is stored in `state/` directory:
- `ai-trends-state.json`
- `job-radar-state.json`  
- `github-tools-state.json`

These track processed items to avoid duplicates.

## Rate Limiting

All tools include polite delays:
- 1-2 seconds between API calls
- 500ms between Notion writes
- Respects GitHub rate limits