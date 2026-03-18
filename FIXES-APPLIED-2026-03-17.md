# Fixes Applied — March 17, 2026

## ✅ COMPLETED

### 1. Model Upgrade (DONE)
- **Before:** zai/glm-5 (budget model)
- **After:** openai/gpt-5.1-codex (top-tier)
- **File:** ~/.openclaw/openclaw.json
- **Note:** Applies on next session restart

### 2. Scheduled Jobs Fixed (DONE)
All jobs now have Telegram tokens:
- ✅ morning-briefing (7:00 AM)
- ✅ midday-checkin (12:00 PM)
- ✅ evening-summary (6:00 PM)
- ✅ weekly-review (Sunday 6:00 PM)
- ✅ night-shift (3:00 AM) — NEW

### 3. BMAD Agent Created (DONE)
- **Location:** ~/.openclaw/agents/bmad-agent/SYSTEM.md
- **Purpose:** Full 6-phase pre-build planning
- **Status:** Ready to use

### 4. Night Shift Autonomous Worker (DONE)
- **Script:** scripts/night-shift.js
- **Schedule:** 3:00 AM daily
- **Tasks:**
  - Check GitHub issues
  - Review active projects
  - Generate opportunity ideas
  - Send morning surprise

## 🟡 IN PROGRESS

### 5. Project Dashboard (NEEDS NOTION API KEY)
- **Status:** Placeholder keys in .env
- **Action Needed:** Add real Notion API key
- **Current:** Notion integration not connected

### 6. Perplexity Integration (NEEDS API KEY)
- **Status:** No Perplexity CLI installed
- **Alternative:** Use SkillBoss API (has Perplexity)
- **Action:** Update briefing script to use SkillBoss

### 7. Heartbeat Monitoring (ENHANCED)
- **Current:** Checks morning briefing only
- **Needed:** Check all scheduled jobs
- **Status:** Partially working

## 📊 CURRENT SCHEDULE

| Time | Job | Status |
|------|-----|--------|
| 3:00 AM | Night Shift | ✅ Loaded |
| 7:00 AM | Morning Briefing | ✅ Fixed |
| 12:00 PM | Midday Check-in | ✅ Fixed |
| 6:00 PM | Evening Summary | ✅ Fixed |
| Sun 6:00 PM | Weekly Review | ✅ Fixed |

## 🔑 NEEDED FROM USER

1. **Notion API Key** — For project dashboard
2. **Confirm Model Upgrade** — Restart session to apply GPT-5.1
3. **Priority Direction** — What's #1 focus?

## NEXT STEPS

1. Restart OpenClaw to apply model upgrade
2. Add real Notion API key to .env
3. Update briefing to use SkillBoss Perplexity
4. Test all scheduled jobs

— Nova 🍑
