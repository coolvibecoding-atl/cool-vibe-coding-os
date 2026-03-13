# HEARTBEAT.md - 15-Minute System Status

## Overview
This file defines the automated heartbeat system that runs every 15 minutes to check all Cool Vibe Coding services.
It must also verify that the daily report pipeline is not being forgotten.

## How It Works
- **Interval:** Every 15 minutes (900 seconds)
- **Script:** `/Users/coolvibecoding/.openclaw/workspace/scripts/heartbeat.js`
- **LaunchAgent:** `com.coolvibecoding.heartbeat.plist`
- **Status File:** `/Users/coolvibecoding/.openclaw/workspace/system-status.json`

## Services Monitored

| Service | Check Command | Port |
|---------|----------------|------|
| OpenClaw Gateway | curl to 127.0.0.1:18789 | 18789 |
| Agent Zero (Docker) | docker ps filter | 55025 |
| Node.js | which node | N/A |
| inference.sh | curl to API | N/A |

## Status Output
When heartbeat runs, it logs:
```
🫀 HEARTBEAT - [TIMESTAMP]
- Gateway: 🟢/🔴
- Agent Zero: 🟢/🔴
- Node: 🟢/🔴
- inference.sh: 🟢/🟡
```

## Commands

### Start Heartbeat
```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.coolvibecoding.heartbeat.plist
```

### Stop Heartbeat
```bash
launchctl bootout gui/$(id -u) com.coolvibecoding.heartbeat
```

### View Logs
```bash
tail -f /tmp/heartbeat.log
```

### View Current Status
```bash
cat /Users/coolvibecoding/.openclaw/workspace/system-status.json
```

## Other Scheduled Tasks

### Morning Briefing (7:00 AM daily)
- Script: `morning-briefing-enhanced.js`
- LaunchAgent: `com.coolvibecoding.morning-briefing.plist`

### Midday Check-in (12:00 PM daily)
- Script: `heartbeat.js` or current midday report script
- Expectation: send a visible midday status/report so DaWizKid does not have to ask for it

### Evening Summary (6:00 PM daily)
- Script: `evening-summary.js`
- LaunchAgent: `com.coolvibecoding.evening-summary.plist`

### Weekly Summary (Sunday 6:00 PM)
- Script: `weekly-summary.js`
- LaunchAgent: `com.coolvibecoding.weekly-summary.plist`

## Daily Report Verification Rules
On each heartbeat, verify and surface:
1. Morning briefing schedule exists and is loaded correctly
2. Midday check-in path is still valid
3. Evening summary schedule exists and is loaded correctly
4. Weekly summary schedule exists and is loaded correctly
5. If any report job is missing, stale, unloaded, or failed, raise an alert instead of silently passing
6. Treat "daily reports" as a priority memory item for DaWizKid

## Troubleshooting

If heartbeat isn't running:
1. Check logs: `tail /tmp/heartbeat.log`
2. Restart: `launchctl bootout` then `launchctl bootstrap`
3. Check Node path in plist matches your installation
