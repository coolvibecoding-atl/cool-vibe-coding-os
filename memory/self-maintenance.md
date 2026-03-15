# Self-Maintenance System

## Overview
Daily automated maintenance: updates and backups

## Schedule
- **4:00 AM** - Auto-update OpenClaw
- **4:30 AM** - Backup to GitHub

---

## 1. Auto-Update (4:00 AM)

### What It Does
1. Run OpenClaw update command
2. Restart gateway after update
3. Report to Telegram

### Script Location
`scripts/auto-update.sh`

---

## 2. Full Backup (4:30 AM)

### What It Does
1. Scan for secrets → replace with placeholders
2. Commit to GitHub
3. Push to repo: `https://github.com/coolvibecoding-atl/agentic-devbox-setup.git`
4. Report to Telegram

### Files to Backup
- `SOUL.md` - Core personality
- `MEMORY.md` - All memories
- `memory/` - All memory files
- `AGENTS.md` - Agent config
- `USER.md` - User profile
- `TOOLS.md` - Tools config
- All skills in `~/.nvm/.../openclaw/skills/`
- `workspace/` files

### Secret Patterns to Scan
- API keys: `[API_KEY]`, `[TOKEN]`
- Passwords: `[PASSWORD]`
- Private URLs: `[PRIVATE_URL]`

---

## Status
✅ Scripts created in: `/Users/coolvibecoding/Desktop/agentic-devbox-setup/scripts/`

### Files
- `auto-update.sh` - Updates OpenClaw
- `backup.sh` - Backs up to GitHub

### To Set Up Cron
```bash
# Add to crontab:
0 4 * * * /Users/coolvibecoding/Desktop/agentic-devbox-setup/scripts/auto-update.sh
0 4 * * * /Users/coolvibecoding/Desktop/agentic-devbox-setup/scripts/backup.sh
```

## Telegram Reporting
- Send to this chat after each job
- Success: confirmation
- Failure: error details + fix suggestions
