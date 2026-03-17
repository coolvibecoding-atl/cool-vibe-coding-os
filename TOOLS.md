# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### Coding Agents

- **Primary:** Qwen 3.5 Flash (via OpenRouter) - fast, cheap, reasoning enabled
- **Secondary:** Gemini 2.5 Flash for complex tasks
- **Fallback:** Google Gemma 2.9B, NVIDIA Nemotron 3 Nano (free tier)
- **Usage:** Build features, review PRs, refactoring, any code creation

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod

### Current Model Configuration

- **Primary Model:** openrouter/hunter-alpha (FREE! 1M context)
- **Fallback Models:** openrouter/nemotron-3-super-120b-a12b:free, skillboss (backup)

### Memory Search

- **Provider:** Local embeddings (ChromaDB)
- **Status:** Enabled for semantic search across tasks/code/decisions
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

<!-- clawx:begin -->
## ClawX Tool Notes

### uv (Python)

- `uv` is bundled with ClawX and on PATH. Do NOT use bare `python` or `pip`.
- Run scripts: `uv run python <script>` | Install packages: `uv pip install <package>`

### Browser

- `browser` tool provides full automation (scraping, form filling, testing) via an isolated managed browser.
- Flow: `action="start"` → `action="snapshot"` (see page + get element refs like `e12`) → `action="act"` (click/type using refs).
- Open new tabs: `action="open"` with `targetUrl`.
- To just open a URL for the user to view, use `shell:openExternal` instead.
<!-- clawx:end -->
