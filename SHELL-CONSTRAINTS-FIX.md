# Shell Constraints - Fix Guide

## Problem

`crontab` command hangs/times out in this environment due to sandbox restrictions.

## Solution: Use launchd (macOS native)

### Step 1: Copy plist files to LaunchAgents

The plist files are already created in `~/Library/LaunchAgents/`:

- `com.coolvibecoding.morning-briefing.plist`
- `com.coolvibecoding.evening-summary.plist`
- `com.coolvibecoding.weekly-summary.plist`

### Step 2: Load the agents

```bash
# Load all three
launchctl load ~/Library/LaunchAgents/com.coolvibecoding.morning-briefing.plist
launchctl load ~/Library/LaunchAgents/com.coolvibecoding.evening-summary.plist
launchctl load ~/Library/LaunchAgents/com.coolvibecoding.weekly-summary.plist

# Or load all at once:
for f in ~/Library/LaunchAgents/com.coolvibecoding.*.plist; do
  launchctl load "$f"
done
```

### Step 3: Verify they're loaded

```bash
launchctl list | grep coolvibecoding
```

Expected output:
```
-   0   com.coolvibecoding.morning-briefing
-   0   com.coolvibecoding.evening-summary
-   0   com.coolvibecoding.weekly-summary
```

### Step 4: Test run immediately (optional)

```bash
# Run morning briefing now
launchctl start com.coolvibecoding.morning-briefing

# Run evening summary now
launchctl start com.coolvibecoding.evening-summary

# Run weekly summary now
launchctl start com.coolvibecoding.weekly-summary
```

Check logs:
```bash
tail -f /tmp/morning-briefing.log
tail -f /tmp/evening-summary.log
tail -f /tmp/weekly-summary.log
```

### Step 5: Unload/remove if needed

```bash
# Unload (stops scheduled runs)
launchctl unload ~/Library/LaunchAgents/com.coolvibecoding.morning-briefing.plist

# Remove plist file
rm ~/Library/LaunchAgents/com.coolvibecoding.morning-briefing.plist
```

---

## Why crontab fails

The `crontab` command uses setuid to manipulate `/usr/lib/cron` tables. In sandboxed environments (including some CI/CD, containers, and restricted shells), this can hang due to:

- Permission checks that block setuid operations
- PAM authentication modules that can't complete
- File descriptor limits
- System integrity protection (SIP) restrictions

**launchd** is the modern macOS replacement for cron and works reliably without these issues.

---

## About Subagent Restrictions

The error `"agentId is not allowed for sessions_spawn"` means your OpenClaw configuration only allows `main` agent. That's fine - we don't need subagents for this task. I'll handle everything directly.

The `"model not allowed"` error is also a config restriction. Again, we can work with the default model.

---

## Complete Activation Checklist

1. ✅ Scripts created & syntax validated
2. ✅ `.env` template created (needs your Telegram/Notion keys)
3. ✅ LaunchAgents plists created
4. ⬜ **Load launch agents** (you do this):
   ```bash
   launchctl load ~/Library/LaunchAgents/com.coolvibecoding.morning-briefing.plist
   launchctl load ~/Library/LaunchAgents/com.coolvibecoding.evening-summary.plist
   launchctl load ~/Library/LaunchAgents/com.coolvibecoding.weekly-summary.plist
   ```
5. ⬜ **Configure `.env`** with:
   - `TELEGRAM_BOT_TOKEN`
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
6. ⬜ **Test run** each script manually:
   ```bash
   node scripts/morning-briefing-enhanced.js
   ```
7. ⬜ **Verify Notion connection**: `node scripts/notion-setup-helper.js`

---

## Quick Commands

```bash
# Load all agents
for f in ~/Library/LaunchAgents/com.coolvibecoding.*.plist; do launchctl load "$f"; done

# Check status
launchctl list | grep coolvibecoding

# Test morning briefing
launchctl start com.coolvibecoding.morning-briefing && tail -f /tmp/morning-briefing.log
```

---

**All set!** The shell constraint issue is bypassed using launchd instead of crontab.
