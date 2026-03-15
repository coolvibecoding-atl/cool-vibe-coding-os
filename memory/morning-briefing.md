# Morning Briefing System

## Overview
Automated daily morning briefing that scans Twitter/X, analyzes for relevant content, and delivers a concise summary.

## Setup Required

### 1. Install xurl (Twitter CLI)
```bash
npm install -g @xdevplatform/x 2. Authurl
```

###enticate
```bash
xurl auth oauth2
```

## What It Does

1. **Scan Timeline** - Fetches last 100 tweets
2. **Filter** - Picks top 10 based on interests:
   - AI news
   - Developer tools
   - Indie hacking
   - Content creation
   - Tech business
3. **Save to Obsidian** - `/Users/coolvibecoding/Documents/Obsidian/Daily/YYYY-MM-DD-briefing.md`
4. **Video Ideas** - Append to `/Users/coolvibecoding/Desktop/Projects/video-ideas.md`
5. **Send Summary** - Telegram message to this chat

## Output Format

```markdown
# Morning Briefing - March 6, 2026

## Top Stories
- [Story 1]
- [Story 2]

## Interesting Threads
- [Thread 1]
- [Thread 2]

## Video Ideas
- [Idea 1]

## Quick Hits
- [Quick 1]
- [Quick 2]
```

## Schedule
- **Time:** 7:00 AM daily
- **Trigger:** Cron job or manual

## Status
✅ xurl installed (v0.0.21)
✅ Script created: `/Users/coolvibecoding/.openclaw/workspace/scripts/morning-briefing.js`
✅ Cron job scheduled: `0 7 * * *` daily
✅ Paths configured (Obsidian, video-ideas)
⏳ Awaiting xurl authentication: run `xurl auth oauth2`
