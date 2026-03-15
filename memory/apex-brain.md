# The Apex Brain - AI Orchestration Rig

## Overview
Advanced multi-model AI orchestration system with dynamic routing, vision, OS control, and autonomous operations.

---

## 🧠 1. Model Routing & Specialization

### Primary Models

| Role | Model | Task Type |
|------|-------|-----------|
| CEO Orchestrator | moonshotai/kimi-k2.5 | Task decomposition, context management, agent coordination |
| Frontend Lead | google/gemini-1.5-pro + Antigravity | UI, CSS, React, animations, design-to-code |
| Backend Heavy | openai/gpt-4o (Codex) | Core logic, debugging, database schemas |
| Escape Hatch | anthropic/claude-3.7-sonnet | Stuck loops, complex reasoning |
| Local Fallback | deepseek-r1:32b / qwen2.5-coder:32b | Offline mode (96GB RAM) |

### Routing Rules

```
Task → CEO (Kimi 2.5)
  ↓
  ├─ UI/Frontend → Gemini CLI / Antigravity
  ├─ Backend/Logic → Codex (GPT-4o)
  ├─ Stuck in loop → Claude 3.7 Sonnet
  └─ No internet → Ollama (local 32B)
```

---

## 👁️ 2. Vision & OS Control

### Capabilities
- **Browser Control:** Full Chrome automation via OpenClaw
- **Design-to-Code:** Figma URL → Gemini Vision → React/Tailwind
- **Visual QA:** Screenshot → Vision model → CSS/alignment checks
- **DevTools Inspection:** Real-time debugging

### Implementation
- Headless VNC for OS control
- Browser automation via OpenClaw browser tool
- Screenshot + analysis pipeline
- Design asset extraction

---

## ♾️ 3. Autonomous Operations

### Night Shift Sentinel
- **Trigger:** 3:00 AM daily
- **Actions:**
  1. Scan GitHub for open bug reports
  2. Write fix code
  3. Run tests
  4. Open PRs automatically

### Self-Healing CI/CD
- **Trigger:** GitHub Action / Vercel build failure
- **Webhook:** Alert agent
- **Actions:**
  1. Download error logs
  2. Analyze failure
  3. Patch code
  4. Push fix

### Temporal.io Durable Execution
- **Purpose:** Long-running tasks survive restarts
- **Resume:** Agent state persisted, resumes exactly where left off

### Hot-Swap Model Routing
- **Monitor:** OpenRouter for new model releases
- **Action:** Auto-update config, zero downtime

---

## 🕸️ 4. Persistent Memory

### ChromaDB Vector Store
- Semantic search across all sessions
- Code patterns, decisions, architecture

### Session Continuity
- Full history per agent
- Cross-agent context sharing
- Learning from QA reports

---

## 🔧 Implementation

### Required Services

| Service | Port | Purpose |
|---------|------|---------|
| OpenClaw Gateway | 18789 | Main orchestration |
| ChromaDB | 8001 | Vector memory |
| Postgres | 5433 | Session logs |
| Ollama | 11434 | Local AI |
| LLM Circuit Breaker | 8002 | Rate limiting |

### Fallback Chain

| Agent | Primary | Fallback 1 | Fallback 2 |
|-------|---------|------------|------------|
| CEO | kimi-k2.5 | gemma-2-9b-it | local (Ollama) |
| Frontend | gemini-1.5-pro | claude-3.7 | local |
| Backend | gpt-4o | qwen-2.5-coder | local |
| QA | minimax-m2.5 | gemma-2-9b-it | local |

---

## 📋 System Prompt Integration

Each agent has:
- **README.md** - Overview
- **system-prompt.md** - Full knowledge

Agents auto-invoke skills based on task type.

---

*Created: March 6, 2026*
*For: Cool Vibe Coding*
