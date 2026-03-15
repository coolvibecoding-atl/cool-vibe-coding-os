# Agent Zero Runbook

## Current Status
Agent Zero exists as a Docker container named `agent-zero` using image `agent0ai/agent-zero`.

Observed states during inspection on 2026-03-12:
- Container was present but had exited initially.
- It was successfully started and logs confirmed: **"Agent Zero is running."**
- Docker daemon accessibility from the host was inconsistent/intermittent during inspection.

## Model Configuration
From live container config during inspection:
- `CHAT_MODEL_PROVIDER=OpenAI`
- `CHAT_MODEL_NAME=gpt-4o`

## Ports
### Original stopped container mapping observed
- `55024 -> 22`
- `55025 -> 80`
- `55026 -> 9000`
- `55027 -> 9001`
- `55028 -> 9002`
- `55029 -> 9003`
- `55030 -> 9004`
- `55031 -> 9005`
- `55032 -> 9006`
- `55033 -> 9007`
- `55034 -> 9008`
- `55035 -> 9009`

### Live restarted mapping observed
- `55000 -> 22`
- `55001 -> 80`
- `55002 -> 9000`
- `55003 -> 9001`
- `55004 -> 9002`
- `55005 -> 9003`
- `55006 -> 9004`
- `55007 -> 9005`
- `55008 -> 9006`
- `55009 -> 9007`
- `55010 -> 9008`
- `55011 -> 9009`

## What That Means
- The Agent Zero web UI should be treated as **dynamic unless the container is recreated with fixed ports**.
- During latest successful start, the likely web entrypoint was **http://127.0.0.1:55001**.
- Historical memory referenced port **55025**, but the live restart changed the bindings.

## Startup Signals Seen in Logs
- `Starting A0...`
- `Initializing framework...`
- `Uvicorn running on http://0.0.0.0:80`
- `Agent Zero is running.`

## Practical Usage Model
OpenClaw + Agent Zero split:
- **OpenClaw** = browser automation, messaging, devices, orchestration
- **Agent Zero** = coding, shell execution, internal reasoning, autonomous agent tasks

## Recommended Next Fixes
1. Lock Agent Zero to a **stable docker compose or docker run config** with fixed ports.
2. Save exact launch command / compose file into versioned docs.
3. Add a small healthcheck script:
   - check docker daemon
   - check container state
   - check active mapped web port
4. Add an Obsidian operations note and memory sync entry.

## Suggested Standard
Use these stable ports going forward if possible:
- `55025` for web UI
- `55024` for SSH
- `55026-55035` for auxiliary services

## Known Caveat
Current setup appears operational but not fully normalized; restart behavior may reassign published ports if the container is recreated differently.
