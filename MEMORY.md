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

5. **Obsidian Context Mandate (NEW):**
   - **Rule:** Whenever DaWizKid or Dot Com asks about prior discussions, ideas, or active contexts, Nova MUST use `exec` with `rg` or `find` to search the Obsidian Vault (`~/Documents/Obsidian/Cool Vibe Coding OS`) *in addition* to standard memory files. Obsidian is the true "Central Brain" and must always be referenced in chat.

4. **The Mission Interrogation Rule:**
   - Before moving forward with any idea, Nova MUST ask clarifying questions to tighten up the mission.

4. **External Coding Agents:**
   - Use Claude Code, OpenCode, Codex CLI, Gemini CLI simultaneously for coding tasks.

## Active Projects
- **SoDoATL 2026** — ⭐ TOP PRIORITY - World Cup 2026 + South Downtown Atlanta
  - **Status:** 🟢 LIVE IN PRODUCTION
  - **Source:** `/Users/coolvibecoding/Desktop/Projects/Dot/SoDoATL_Project_Clean`
  - **Prod URL:** https://sodoatl.vercel.app
  - **Vercel Project:** `sodoatl` (coolvibecoding-3642s-projects)
  - **Tech:** Expo/React Native with Firebase
  - **Firebase:** ✅ Configured (sodoatl project)
    - Auth: Email/Password + Google
    - Firestore: Enabled (test mode)
    - Storage: Enabled
  - **Google APIs:** ✅ Configured (sodoatl-community project)
    - Places API
    - Maps JavaScript API
    - Geocoding API
  - **Features:** Map, Events, Directory, Galleries, World Cup section
  - **Last Deployed:** Mar 16, 2026 10:26 PM
- **Whats Up [City] Ecosystem** — Secondary, pivot-ready version of SoDoATL concept
- **AI Mixer Pro** - Audio AI SaaS

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
| Night Shift Sentinel | 0 2 * * * | night-shift-agent.js |
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

## Daily Reports Preference & Quality Standard
- **DaWizKid explicitly wants daily reports remembered and not forgotten.**
- **QUALITY STANDARD (NON-NEGOTIABLE):** No more half-baked summaries. 
  - ALL stories and intel MUST be super detailed.
  - Organization MUST be tight, properly formatted, and easy to read.
  - Source links MUST be included for every story.
  - No generic placeholder text (e.g., generator text instead of actual hashtags).
- **DUAL-SYNC REQUIRED:** Every summary and brief MUST be updated and synced to BOTH Obsidian and Notion notes automatically.
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

---

## 💡 IDEA-TO-EXECUTION PIPELINE (MANDATORY)

### The Process (Effective March 15, 2026)

**ALL ideas and apps MUST follow this workflow:**

### Step 1: Intel Gathering
- Run `mega-intel-scraper.js` to fetch from ALL sources:
  - Perplexity (AI, startups, tools, crypto, robotics, health, enterprise, funding, trends, research)
  - Hacker News
  - Reddit (r/artificial, r/SaaS, r/indiehackers, r/MachineLearning, r/startups)
  - Product Hunt
  - X/Twitter
  - YouTube
  - Funding rounds

### Step 2: Idea Generation
- AI generates 10 wild money-making opportunities
- Each idea includes: Why Now, 30-Day Build Plan, Revenue Model, First Users, Viral Loop, Tech Stack, Risks

### Step 3: VALIDATION RESEARCH (NEW - Mandatory)
**Before BMAD, validate each idea with deep research:**
- Market size verification (TAM/SAM/SOM)
- Competitor analysis (direct + indirect)
- Recent funding in the space
- Customer pain point validation
- Technical feasibility check
- Revenue model benchmarks
- **Kill bad ideas early** - if validation fails, drop it

**Validation Sources:**
- Perplexity: "[Idea] market size 2026"
- Crunchbase: Recent funding in space
- G2/Capterra: Competitor reviews
- Reddit/HN: "Is anyone building [X]?"
- Twitter: What are users complaining about?

**Output:** Validation score (1-10) for each idea
**Gate:** Only ideas scoring 7+ proceed to BMAD
Create folder at `~/clawd/opportunities/[idea-name]/` with:
1. **prd.md** - Product Requirements Document
   - Problem statement
   - Target users
   - Core features
   - User stories
   - Acceptance criteria
   - Roadmap
   - Pricing

2. **implementation.md** - Technical Architecture
   - System architecture diagram
   - Database schema
   - API endpoints
   - LangChain agents
   - File structure
   - Deployment config
   - Security measures

3. **design.md** - UX/UI Specifications
   - Design principles
   - User flows
   - Wireframes (ASCII)
   - Component specs
   - Interactions
   - Responsive breakpoints
   - Accessibility

4. **branding.md** - Brand Identity
   - Name options
   - Tagline
   - Color palette
   - Typography
   - Logo concepts
   - Iconography
   - Digital assets needed
   - Brand voice

### Step 4: Master Index
- Update `~/clawd/opportunities/README.md`
- Update Obsidian: `~/Documents/Obsidian/Daily/YYYY-MM-DD-Opportunity-Pipeline.md`
- Update Memory: `~/memory/opportunities.md`

### Step 5: Prioritization
- **Phase 1 (Quick Wins):** Low barrier, fast revenue
- **Phase 2 (High Impact):** Proven models, scaling
- **Phase 3 (Moonshots):** Complex, high reward

### Step 6: Pick ONE & Build
- Select from Phase 1
- Set up repo
- Sprint 1-2 (Weeks 1-4)
- Ship MVP in 30 days

### Tech Stack (Standard)
**Frontend:** Next.js 15 • React 19 • TypeScript • Tailwind CSS • shadcn/ui  
**Backend:** Supabase • Vercel AI SDK • FastAPI (Python)  
**AI:** Claude 4 • GPT-5-mini • Gemini 2.5 Flash • LangChain  
**Data:** Pinecone • Supabase • PostgreSQL

### File Locations
```
~/clawd/opportunities/
├── README.md (master index)
├── [idea-name]/
│   ├── prd.md
│   ├── implementation.md
│   ├── design.md
│   └── branding.md
```

**This process is NON-NEGOTIABLE for all future ideas.**

---

## 🔄 AUTOMATED PIPELINE SCHEDULE

**Runs Every Other Day (Mon, Wed, Fri) at 7:00 AM**

**Automated Tasks:**
1. ✅ Intel Gathering - Fetch from 12+ sources
2. ✅ Idea Generation - 10 wild opportunities
3. ✅ Validation Research - Market/competitor/pain points
4. ✅ Save to Obsidian + Memory

**Logs:** `/tmp/idea-pipeline.log`
**LaunchAgent:** `com.coolvibecoding.idea-pipeline.plist`

**Manual Run:**
```bash
cd ~/.openclaw/workspace/scripts
node mega-intel-scraper.js
```

---

## Current Opportunity Pipeline

### Phase 1 (Build First)
1. **Patent Agent (Stilta)** - $600K-$2M ARR - AI patent drafting
2. **CloudSage** - $4M ARR - Cloud cost optimization
3. **DeepBrief** - $5M+ ARR - Research agents

### Phase 2 (High Impact)
4. **TreasuryPilot** - $1.45M ARR - DAO treasury management
5. **DevinWorks** - $594K ARR - DevOps automation
6. **Persona Studio** - $250K/mo - AI character factory

### Phase 3 (Moonshots)
7. **Tangent** - $3M ARR - Robot fleet orchestration
8. **SimLab** - $9M/yr - Biotech lab automation
9. **AgentSwap** - $300K+ - NFT agent marketplace
10. **AgentShield** - $1-3M ARR - Agent security suite

**Total Potential Revenue: $18M+ ARR**

## Core Capabilities Update (2026-03-18)
- **Agent Architect Pro:** Nova has digested the definitive 34-resource Agentic AI curriculum (Stanford, Anthropic, Google, ReAct, Reflexion, Toolformer). All future agent orchestration, sub-agent creation, and AI workflow design must utilize the Advanced Cognitive Architectures (Routing, Parallelization, Orchestrator-Worker, Evaluator-Optimizer) and MCP tool principles.

## 🌙 Night Shift Sentinel (Active)
- **Schedule:** Runs every night at 2:00 AM via launchd (com.coolvibecoding.night-shift).
- **Function:** Drives Tandem Browser and SkillBoss APIs to deep-scrape Product Hunt, Hacker News, X/Twitter, YouTube, and Google Trends.
- **Output:** Generates THREE (3) massive B2B SaaS/AI wrapper opportunities, validates them, and writes fully-formatted PRDs for each.
- **Location:** Saves the final intel brief directly to Obsidian (`YYYY-MM-DD-Night-Shift-Brief.md`) so it is ready by morning.

## The 15-Minute Detailed Heartbeat
- DaWizKid mandates a hyper-detailed, system-wide status report every 15 minutes.
- The script runs natively via `com.coolvibecoding.detailed-heartbeat.plist` every 900 seconds, checking all subagents (Gemini, Codex, etc.), project statuses, and returning actionable productivity suggestions.
- When a heartbeat prompt triggers, read `/Users/coolvibecoding/.openclaw/workspace/system-status-detailed.json` and echo it directly back to the chat.
