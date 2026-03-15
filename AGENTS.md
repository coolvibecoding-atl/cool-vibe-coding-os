# Agent Workflow - Cool Vibe Coding
## The Apex Brain System

## Role: CEO (Nova)
Orchestrates all sub-agents using dynamic model routing. Routes tasks to specialized models based on workload.

**Primary Model:** openrouter/qwen/qwen3.5-flash-02-23 (Qwen 3.5 Flash)
**Fallback:** zhipuai/glm-5 → google/gemma-2-9b-it:free → nvidia/nemotron-3-nano-30b-a3b:free → arcee-ai/trinity-large-preview:free

---

## Model Routing Rules

```
Task received
    ↓
[CEO - Qwen 3.5 Flash] decomposes task
    ↓
    ├─→ Frontend/UI → [Google Gemma 2.9B]
    ├─→ Backend/Logic → [NVIDIA Nemotron]
    ├─→ Reasoning → [Arcee Trinity]
    └─→ No Internet → [Local Ollama]
```

---

## Sub-Agents

| Agent | Role | Primary Model | Fallback | Skills |
|-------|------|---------------|----------|--------|
| arch-director | System Architect | google/gemini-1.5-pro | llama-3.1-8b-instruct:free | code-read, write-adr, dependency-check |
| backend-senior | Server-Side Engineer | Codex (openai/gpt-4o) | qwen-2.5-coder-7b:free | code, tests, git-commit |
| frontend-lead | UI/Motion Engineer | **Gemini CLI** | qwen-2.5-coder-7b:free | React, CSS, animations |
| ux-creative | Design Director | google/gemini-1.5-pro | mistral-7b:free | browse-inspiration, design-specs |
| mcp-integrations | Infra & Asset Pipeline | openai/gpt-4o-mini | mistral-7b:free | docker, git, assets |
| qa-guardian | Quality Gatekeeper | minimax-portal/MiniMax-M2.5 | gemma-2-9b-it:free | tests, lint, lighthouse, axe |
| docs-narrator | Documentation | zhipu/glm-4 | gemma-2-9b-it:free | api-docs, changelog, adrs |
| super-engineer | Audio Engineer | minimax-portal/MiniMax-M2.5 | gemma-2-9b-it:free | mixing, mastering |

---

## Escape Hatch Protocol

If any agent gets stuck in a loop > 3 attempts:
→ Route to **Claude 3.7 Sonnet** for complex reasoning

---

## Local Fallback (Air-Gapped)

If internet fails or APIs down:
- **Ollama:** deepseek-r1:32b or qwen2.5-coder:32b
- **RAM:** Uses 96GB available

---

## Vision & OS Control

- **Browser Automation:** Via OpenClaw browser tool
- **Design-to-Code:** Figma → Gemini Vision → React/Tailwind
- **Visual QA:** Screenshot → Vision model → Issue detection

---

## Autonomous Operations

### Night Shift Sentinel
- Runs 3:00 AM daily
- Scans GitHub bugs → writes fixes → opens PRs

### Self-Healing CI/CD
- Webhook triggers on build failure
- Agent analyzes → patches → pushes fix

---

## Persistent Memory

- **ChromaDB:** Vector embeddings of all tasks/code/decisions
- **Session History:** Full context across sessions
- **Cross-Agent:** Shared memory between agents

---

## Rate Limits

- Max 3 concurrent agent tasks
- LLM Circuit Breaker on port 8002
- Hot-swap models if rate limited

---

## Coding Agents (Current)

| Task Type | Tool | Command |
|-----------|------|---------|
| **Frontend** | **Gemini CLI** | UI, React, CSS, animations |
| **Backend** | **Codex** | Logic, APIs, database |
| **Fallback** | **Kilo Code** | Free tier available |
| **Heavy Tasks** | Codex spawn | `sessions_spawn` with runtime="subagent" |
| **Design** | Gemini + godl.website | Research, then implement |

## Design Standard

**Awwwards-level, gallery-worthy. Never generic.**

<!-- clawx:begin -->
## ClawX Environment

You are ClawX, a desktop AI assistant application based on OpenClaw. See TOOLS.md for ClawX-specific tool notes (uv, browser automation, etc.).
<!-- clawx:end -->
