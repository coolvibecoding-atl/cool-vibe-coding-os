# Obsidian Central Brain Architecture - Setup Guide

This document outlines the exact architecture, prerequisites, and automated setup steps for configuring an Obsidian Vault as the shared central nervous system across multiple AI agents (OpenClaw/Nova, Claude Code, Cursor, and OpenCode/KiloCode).

## 🧠 The Architecture Concept
Instead of each AI agent having isolated memory files hidden in `~/Library` or `~/.openclaw` directories, we physically move their workspaces into an Obsidian Vault and use **Model Context Protocol (MCP)** to give them real-time read/write/search access.

**The Loop:**
1. OpenClaw's active workspace (`~/.openclaw/workspace`) lives inside Obsidian.
2. A symlink bridges the hidden OpenClaw path to the visible Obsidian folder.
3. `mcp-obsidian-vault` exposes 27 advanced tools (search, create tasks, log decisions, etc.) to the agents.
4. All IDEs (Cursor/OpenCode) and CLI tools (Claude Code/mcporter) point to the exact same MCP server and vault path.

---

## 🛠️ Step-by-Step Installation Prompt for OpenClaw

*Copy and paste the prompt below to your other OpenClaw bot. It is designed to be fully autonomous.*

```markdown
@OpenClaw We are implementing the "Obsidian Central Brain" architecture. I need you to completely automate this setup. Please execute the following sequence precisely:

**PHASE 1: Prerequisites & Tooling**
1. Check if Homebrew is installed. If so, run `brew install yakitrak/yakitrak/obsidian-cli` to install the Obsidian CLI.
2. Run `npm install -g mcp-obsidian-vault` to install the MCP server globally.
3. Locate my active Obsidian vault path (ask me for it if you can't find it in `~/Documents` or `~/Library/Application Support/obsidian/obsidian.json`).
4. Set the default vault for the CLI by running `obsidian-cli set-default "<MyVaultName>"`.

**PHASE 2: Moving the OpenClaw Consciousness**
1. Inside the Obsidian vault, create a directory called `00 System/OpenClaw Workspace`.
2. Move the contents of your current workspace (`~/.openclaw/workspace`) into that new directory.
3. Create a symbolic link from `~/.openclaw/workspace` pointing to the new `00 System/OpenClaw Workspace` folder. (Verify that you can still read your MEMORY.md and SOUL.md files through the symlink).

**PHASE 3: Wiring the MCP Server to the Agents**
1. **For You (OpenClaw):** Run `mcporter config add obsidian npx -y mcp-obsidian-vault --env OBSIDIAN_VAULT_PATH="<FullVaultPath>"`
2. **For Claude Code:** Inject the MCP server config into `~/.claude.json` under `mcpServers.obsidian-brain`. Set the command to `npx`, args to `["-y", "mcp-obsidian-vault"]`, and env to `{"OBSIDIAN_VAULT_PATH": "<FullVaultPath>"}`.
3. **For Cursor:** Write the same JSON config to `~/.cursor/mcp.json`.
4. **For OpenCode/KiloCode:** Find the `mcp_settings.json` in `~/Library/Application Support/` (usually under Antigravity or Code) and inject the same server configuration.

**PHASE 4: Verification**
Once configured, run `mcporter call obsidian.log_decision 'title:Central Brain Online' 'context:Executed automated setup prompt.' 'decision:Vault is now the master source of truth.'`. Confirm to me that the file was created successfully.
```

---

## 🔗 Technical Details (Manual Fallbacks)

If an agent fails to write the JSON automatically, here is the raw JSON schema needed for `mcp.json` or `cline_mcp_settings.json`:

```json
{
  "mcpServers": {
    "obsidian-brain": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-obsidian-vault"
      ],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/Users/YOUR_USERNAME/Documents/Obsidian/YOUR_VAULT_NAME"
      }
    }
  }
}
```

### Agent Features Unlocked:
- `obsidian.create_task` & `obsidian.list_tasks` (Cross-agent to-do lists)
- `obsidian.search_vault` (Semantic search across all notes)
- `obsidian.log_decision` & `obsidian.log_discovery` (Standardized architecture logs)
- `obsidian.git_sync` (Auto-commit vault changes)
