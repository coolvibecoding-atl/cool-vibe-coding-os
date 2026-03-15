# Enhanced Briefing System - Setup Guide

## What's Been Built

✅ **Three new briefing scripts** with advanced features:

1. **morning-briefing-enhanced.js** - Multi-source daily digest
2. **evening-summary.js** - 9 PM project & news recap
3. **weekly-summary.js** - Sunday week-in-review

✅ **Features Implemented:**
- ✅ Telegram delivery via Bot API
- ✅ Error notifications (alerts on failures)
- ✅ Multiple sources: Twitter, Reddit, Hacker News, RSS
- ✅ Automatic archiving (>30 days)
- ✅ Weekly summary compilation
- ✅ Notion integration (detailed notes)
- ✅ Evening summary with project updates & YouTube

---

## Setup Steps

### 1. Install Dependencies

The scripts use built-in Node modules only (no npm packages needed). Ensure Node.js is available:

```bash
node --version  # Should be v22.x
```

### 2. Configure Environment Variables

```bash
cd /Users/coolvibecoding/.openclaw/workspace/content-agency-pro
cp .env.briefing ../.env  # Copy to workspace root .env
```

Edit `.env` and fill in:

- `TELEGRAM_BOT_TOKEN` - Get from @BotFather on Telegram
- `NOTION_API_KEY` - Create integration at notion.so/my-integrations
- `NOTION_DATABASE_ID` - Create a database, copy ID from URL
- Verify paths are correct (defaults should work)

### 3. Create Notion Database

In Notion:
1. Create a new database (table view)
2. Properties needed:
   - `Title` (title) - auto-created
   - `date` (date) - auto-created
   - `type` (select) - options: "Morning Briefing", "Evening Summary", "Weekly Summary"
3. Copy the database ID from the URL: `https://www.notion.so/yourworkspace/{DATABASE_ID}?v=...`
4. Paste into `.env` as `NOTION_DATABASE_ID`

### 4. Set Up Telegram Bot

```bash
# In Telegram, message @BotFather:
# /newbot - give it a name
# /setcommands - add: "briefing - get morning briefing"
# /setdescription - describe what it does
```

### 5. Install Crontab Entries

**Manual Installation** (since automated crontab install is timing out):

```bash
# Open your crontab for editing
crontab -e

# Add these lines at the end:
0 7 * * * /Users/coolvibecoding/.nvm/versions/node/v22.22.0/bin/node /Users/coolvibecoding/.openclaw/workspace/scripts/morning-briefing-enhanced.js >> /tmp/morning-briefing.log 2>&1
0 21 * * * /Users/coolvibecoding/.nvm/versions/node/v22.22.0/bin/node /Users/coolvibecoding/.openclaw/workspace/scripts/evening-summary.js >> /tmp/evening-summary.log 2>&1
0 8 * * 0 /Users/coolvibecoding/.nvm/versions/node/v22.22.0/bin/node /Users/coolvibecoding/.openclaw/workspace/scripts/weekly-summary.js >> /tmp/weekly-summary.log 2>&1

# Save and exit
```

**Verify installation:**

```bash
crontab -l
```

### 6. Make Scripts Executable

```bash
chmod +x scripts/morning-briefing-enhanced.js
chmod +x scripts/evening-summary.js
chmod +x scripts/weekly-summary.js
```

### 7. Test Run Each Script

```bash
# Test morning briefing
node scripts/morning-briefing-enhanced.js

# Test evening summary
node scripts/evening-summary.js

# Force run weekly summary (today)
node scripts/weekly-summary.js
```

Check output:
- `/tmp/morning-briefing.log`
- `/tmp/evening-summary.log`
- `/tmp/weekly-summary.log`

### 8. Verify Telegram Delivery

After running morning briefing, you should receive a message in your group chat.

### 9. Verify Notion Pages

Check your Notion database - new pages should be created with the full content.

---

## File Structure

```
workspace/
├── scripts/
│   ├── morning-briefing-enhanced.js  # 7:00 AM daily
│   ├── evening-summary.js            # 9:00 PM daily
│   └── weekly-summary.js             # Sundays 8:00 AM
├── .env                              # Configuration
├── .env.briefing                     # Template (backup)
└── README-BRIEFING.md               # This guide
```

---

## Customization

### Add More RSS Feeds

Edit `scripts/morning-briefing-enhanced.js` → `CONFIG.rss.feeds` array.

### Change Telegram Timing

Edit crontab entries. Format: `minute hour day month weekday command`

### Add More Sources

Script is modular. Add new functions in `fetch*` style and include in `generateBriefing()`.

### Adjust Archive Retention

In `morning-briefing-enhanced.js` → `THIRTY_DAYS_MS` constant.

---

## Troubleshooting

### Telegram messages not sending
- Check `TELEGRAM_BOT_TOKEN` is correct
- Ensure bot has been added to the group chat
- Check logs: `tail -f /tmp/morning-briefing.log`
- Test manually: `curl "https://api.telegram.org/bot<token>/sendMessage?chat_id=-1003713071598&text=test"`

### Notion pages not created
- Check `NOTION_API_KEY` and `NOTION_DATABASE_ID`
- Ensure integration is connected to your workspace
- Database must have the properties: Title, date, type (select)
- Check API response in logs

### Scripts failing silently
- Logs are at `/tmp/*.log`
- Crontab redirects stdout/stderr to logs
- Check file permissions on scripts

### xurl not found (Twitter fetch)
- Ensure `xurl` is in PATH: `which xurl`
- If not, install xurl CLI or adjust script to use another Twitter access method
- Twitter fetch is optional - errors are caught and reported via Telegram alert

---

## Future Enhancements

- Add OpenSignal RSS integration for developer signal
- Add Discord delivery option
- Auto-generate action items from notes
- Sentiment analysis of content
- Integration with HEARTBEAT.md for health checks

---

**All systems go!** 🚀
