# Rig Setup & Flight Manual

## Current Status

### Phase 20 Complete - Devbox Ready

---

## 1. API Keys Needed

### Required Keys
- `OPENROUTER_API_KEY` - For model routing
- `ANTHROPIC_API_KEY` - Claude access
- `BRAVE_API_KEY` - Web search

### Location
Create `.env` file in rig folder with keys.

---

## 2. Docker Containers

### To Start
```bash
cd /Users/coolvibecoding/agentic-devbox-setup/multi-agent-rig
docker-compose up -d --build
```

### Containers
| Service | Port | Purpose |
|---------|------|---------|
| openclaw | 18789 | CEO Gateway |
| agent-zero | 8080 | Heavy Coder |
| chromadb | 8001 | Semantic Memory |
| neo4j | 7687 | Graph Memory |
| prometheus | 9090 | Metrics |
| grafana | 3000 | Dashboards |
| agent-desktop | 5900 | VNC Control |

---

## 3. Test Protocols

### Test A: Cinematic Landing Page
- Use antigravity with GEMINI.md
- Generate 3D content
- Use Preset D (Vapor Clinic)

### Test B: J.A.R.V.I.S. Voice
- Run `./voice-os.sh`
- Voice control entire rig

### Test C: Night Shift
- Run `node scripts/night-shift.js`
- Autonomous bug fixing

---

## 4. Daily Workflow

### How to Use
1. Drop into project folder
2. Write markdown requirements
3. Let agents execute
4. Review output

### Current Project
- **SoDoATL-2026** - World Cup app

---

## Status: Ready to Power On

Waiting for:
- [ ] API keys configured
- [ ] Docker containers started

---

*Manual Updated: March 6, 2026*
