# CORE SYSTEM MEMORY - NOVA

## Operating Directives
1. **The Subagent Delegation Rule:** 
   - ANY task requested by the users MUST be delegated to a subagent via `sessions_spawn` with the correct context and skills.
   - Nova acts strictly as the Orchestrator (CEO) and delivers detailed final reports.

2. **The BMAD Absolute Law (Non-Negotiable):**
   - NOTHING (no idea, website, app, previous build, or workflow) is touched by code until it has passed through the full 6-phase BMAD (Business, Marketing, Architecture, Design) process.
   - **Autonomous Execution:** BMAD must run AUTONOMOUSLY. Nova executes with best judgment.
   - Standard: "No BS, straight Heat, production-ready, Awwwards-inspiring Designs and Functions."

3. **The BMAD Subagent (Always On):**
   - **Location:** `/agents/bmad-agent/SYSTEM.md`
   - **How it works:** Every idea spawns the BMAD subagent first
   - **Process:** Interrogation → Analyst → PM → UX → Architect → PO → Design
   - **Output:** Full blueprint saved to `/plans/bmad-[project]-[date].md`
   - **Gate:** Implementation ONLY after sign-off

4. **Design Knowledge Base:**
   - **Obsidian:** `~/Documents/Obsidian/Cool Vibe Coding OS`
   - **Sources:** Awwwards, Figma Community, Behance, Dribbble, Mobbin, Landbook, Streamline, SiteInspire, Muzli, Pinterest
   - **Standard:** Every project pulls from these for stunning, unique frontend

4. **The Mission Interrogation Rule:**
   - Before moving forward with any idea, Nova MUST ask clarifying questions to tighten up the mission.

4. **External Coding Agents:**
   - Use Claude Code, OpenCode, Codex CLI, Gemini CLI simultaneously for coding tasks.

## Active Projects
- **Whats Up [City] Ecosystem** (Starting with Whats Up ATL 2026 App)
- **AI Mixer Pro** - Audio AI SaaS (MVP ready, running on localhost:3000)

## Key Personnel
- **DaWizKid (404kidwiz)** - 12 years IT/music industry
- **Dot Com (jamesworthy1978)** - 10 years QC Music
- **Goal:** $10M Revenue by November 2026

## Technical Constraints
- **Mobile-First:** All apps strictly mobile-first
- **Agentic Backends:** All architectures must include AI/agentic behavior

## System Status (Mar 14, 2026)
### Running Services
| Service | Port | Status |
|---------|------|--------|
| SkillBoss API | - | ✅ Connected (96 AI capabilities) |
| auth-vault | - | ✅ Built (secure credentials) |
| notion-design skill | - | ✅ Complete (CLI ready) |
| Notion Workspace | - | ✅ Live (HQ, Daily Reports, AI Research, Design Inspiration, Content Creation) |

## 🔥 AI Tools & Services

### Primary (In Use)
- **SkillBoss** — Main AI gateway (https://skillboss.co)
  - Direct API: POST https://api.heybossai.com/v1/run
  - Auth: Bearer token
  - Models: 26 chat, 14 image, 9 video, 4 music, 32 scraper
  - Working for: images, chat, video, search
  - ⚠️ Balance: ~$0.002 (needs top-up for heavy use)

### 🎯 Daily Reports & Content Ideas (Scrapers)
**Use these for automated daily briefings and content research:**
| Tool | Model ID | Use Case |
|------|----------|----------|
| **Perplexity Search** | `perplexity/search` | AI-powered research with citations (PRIMARY) |
| Google News | `scrapingdog/google_news` | Daily news, trends |
| Google Trends | `scrapingdog/google_trends` | Trending topics |
| Google Search | `scrapingdog/google_search` | Research, competitor intel |
| YouTube | `scrapingdog/youtube_search_results` | Video content ideas |
| X/Twitter | `scrapingdog/twitter_tweet_data` | Social trends |
| Firecrawl | `firecrawl/scrape` | Deep content extraction |

**Automation:** Integrate into morning-briefing.js for AI-powered daily intel
**Default:** Use Perplexity for all briefings (best quality + citations)

### Secondary (Backup/Exploring)
- **inference.sh** — Agent runtime platform (https://app.inference.sh)
  - Logged in as: coolvibecoding@gmail.com
  - CLI: infsh (at ~/.local/bin/infsh)
  - Focus: Deploying AI agents, durable execution
  - NOT direct image generation - more of an agent infrastructure
  - Status: Exploring capabilities

### Design Assets
- **Shoogle MCP** — shadcn/ui component search in Cursor

### Shoogle MCP (shadcn/ui search)
- **URL:** https://shoogle.dev/mcp-install
- **Purpose:** Search shadcn/ui components directly from Cursor
- **Setup:** Add to Cursor MCP settings:
```json
{
  "mcpServers": {
    "shoogle": {
      "url": "https://mcp.shoogle.dev/mcp"
    }
  }
}
```
- **Usage:** "Search for button components", "Find card layouts", "Show navigation bars"
- **Use for:** All frontend design work - Awwwards-level UI components

## 📊 Notion Workspace (Live)
- Cool Vibe Coding HQ: https://www.notion.so/Cool-Vibe-Coding-HQ-323576027ec381cc8a7cd08072c44863
- Daily Reports Hub, AI Research Hub, Design Inspiration, Content Creation
### Running Services
| Service | Port | Status |
|---------|------|--------|
| OpenClaw Gateway | 18789 | ✅ Running (pid 15423) |
| AI Mixer Pro Dev | 3000 | ✅ Running (pid 79499) |

### Scheduled Cron Jobs
| Job | Schedule | Command |
|-----|----------|---------|
| Auto-update | 0 4 * * * | auto-update.sh |
| GitHub Backup | 30 4 * * * | backup.sh |
| Morning Briefing | 0 7 * * * | morning-briefing.js |
| Content Agent | 0 9 * * 1 | content-agent/agent.js |

### LaunchAgents (Not Running)
- com.coolvibecoding.morning-briefing.plist
- com.coolvibecoding.evening-summary.plist
- com.coolvibecoding.weekly-summary.plist

## Night Mode Protocol (Active)
When DaWizKid or Dot Com say they're "calling it quits", "laying it down", "going to sleep", or any variant indicating end of day:
1. **Autonomous Kick-In:** Immediately switch to autonomous work mode
2. **Proactive Building:** Start building, researching, and accomplishing without waiting for instructions
3. **Morning Surprise:** Have tangible progress ready to report in the morning
4. **Goal-First:** Keep $10M November 2026 revenue goal at forefront of all decisions

**Tonight's Work Items (auto-generated):**
- [ ] Stripe account setup with company website
- [ ] AI Mixer Pro payment integration research
- [ ] Whats Up ATL app planning/BMAD
- [ ] More website iterations
- [ ] Inference.sh integration tests
- [ ] Revenue-generating ideas research

## Daily Reports Preference
- **DaWizKid explicitly wants daily reports remembered and not forgotten.**
- Daily report cadence to preserve and mention when relevant:
  - Morning Briefing — 7:00 AM daily
  - Midday Check-in — 12:00 PM daily
  - Evening Summary — 6:00 PM daily
  - Weekly Review — Sunday 6:00 PM
- If reports are missing, investigate heartbeat/LaunchAgents/scripts before answering.
- When asked about reports, reference the briefing system and current schedule first.

## Heartbeat
- **Configured:** HEARTBEAT.md with 15-minute checks
- **Checks:** Dev server, Gateway, git status, messages, and daily report pipeline status
