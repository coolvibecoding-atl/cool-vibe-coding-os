# BMAD Plan: 4 Custom Skills
**Date:** 2026-03-14  
**Client:** Cool Vibe Coding  
**Goal:** $10M revenue by Nov 2026 | Awwwards-level production quality

---

## Executive Summary

Four complementary CLI skills forming an **AI automation toolchain**:
- **inference-sh** → Execute AI models (images, video, LLMs) via inference.sh
- **skillboss** → Manage skill lifecycle (install/update/publish to clawhub)
- **intelligence** → Research pipeline (scraping, trends, competitive intel)
- **content-engine** → Content generation + distribution workflow

**Shared Infrastructure:** `auth-vault` (credential management) — extracted as 5th component

**Build Order:** auth-vault → skillboss → inference-sh → intelligence → content-engine

**Timeline:** 6-8 weeks for full suite

---

## 🔍 PRE-PHASE 1: THE INTERROGATION

### Hard Questions Asked

**inference-sh:**
- Why not just use `inference` CLI directly? → **Wrapper adds:** batching, caching, progress tracking, queue management
- Who actually pays for this? → **Dev teams** needing structured AI pipelines, not casual users
- What if inference.sh changes pricing/API? → **Abstraction layer** protects downstream code
- NOT building: Model training, fine-tuning, custom model hosting

**skillboss:**
- Why not just use git/npm? → **Skills have metadata, OpenClaw integration, MCP protocols** — different domain
- Who manages the registry? → **clawhub.com** (existing), skillboss is the client
- What prevents skill bloat? → **Manifest validation + dependency checks**
- NOT building: General package manager (not competing with npm/brew)

**intelligence:**
- Why not just use existing tools (Tavily, Perplexity)? → **Offline-first, cost control, custom scrapers for specific sites**
- Who needs this vs just googling? → **Agents needing structured, repeatable research at scale**
- Legal risks with scraping? → **Robots.txt respect + rate limiting + user responsibility**
- NOT building: Dark web monitoring, illegal content access

**content-engine:**
- Why not just use Buffer/Hootsuite? → **Agent-native, API-first, multi-variant generation**
- Who writes the content? → **AI generates drafts, human approves, system optimizes**
- Platform API fragility? → **Graceful degradation + webhook fallback**
- NOT building: Full social media management (inbox, DMs), influencer marketplace

---

## PHASE 1: ANALYST (Problem Definition)

### Skill 1: inference-sh
**Problem:** Developers waste time on: manual API calls, no batching, no caching, no queue management for long jobs, scattered output handling.

**Target Users:**
- AI automation engineers
- Content pipeline builders  
- Agent developers needing reliable inference

**Success Metrics:**
- 90% reduction in boilerplate API code
- <5 min to go from idea to batch job running
- 99% job completion rate (queue resilience)

**Constraints:**
- Depends on inference.sh API stability
- Rate limits vary by model
- Large file handling (videos up to 1GB)

**MVP Scope:** Text-to-image batch, async job tracking, basic caching

---

### Skill 2: skillboss
**Problem:** OpenClaw skills are scattered (git repos, local files, no versioning). Installing means manual clone + setup. No dependency management.

**Target Users:**
- OpenClaw users installing skills
- Skill developers publishing to clawhub
- CI/CD pipelines validating skills

**Success Metrics:**
- Install skill in <30 seconds
- Zero broken dependencies on install
- 100% manifest validation before publish

**Constraints:**
- Must integrate with clawhub API
- Handle multiple skill formats (JS, Python, binary)
- Security: validate before execution

**MVP Scope:** Install from clawhub, list installed, basic update

---

### Skill 3: intelligence
**Problem:** Research is manual, non-repeatable, expensive via APIs. Need structured data extraction from web sources with caching.

**Target Users:**
- Market researchers
- Competitive intelligence teams
- Content strategists tracking trends
- Agents needing fresh context

**Success Metrics:**
- Scrape target site in <10s (cached: <100ms)
- Extract structured data with 95% accuracy
- Monitor 100+ sources continuously

**Constraints:**
- Legal: robots.txt, terms of service
- Rate limits on target sites
- Anti-bot detection (may need rotating proxies)

**MVP Scope:** Single-site scrape, RSS monitoring, basic entity extraction

---

### Skill 4: content-engine
**Problem:** Creating multi-platform content is tedious: write once, reformat for each platform, schedule manually, no A/B testing.

**Target Users:**
- Social media managers
- Marketing teams
- Founders building in public
- Agents posting on behalf of users

**Success Metrics:**
- Generate 10 platform variants in <30s
- Schedule accuracy: 99.9%
- A/B test setup: <2 min

**Constraints:**
- Platform API limits (X, LinkedIn, etc.)
- Content approval workflows needed
- Brand voice consistency

**MVP Scope:** Single post multi-variant generation, schedule to 1 platform

---

## PHASE 2: PRODUCT MANAGER (Stories & Roadmap)

### inference-sh

**Vision:** "The kubectl of AI inference — one CLI to run any model, anywhere."

**Epics:**

| Epic | User Story | Acceptance Criteria |
|------|-----------|---------------------|
| E1: Image Generation | As a developer, I want to batch-generate 100 images so that I can build a dataset | Given a prompt file, when I run batch command, then I get job IDs and progress |
| E2: Video Generation | As a creator, I want to generate videos from images so that I can make product demos | Given image + prompt, when submitted, then video is queued and I get download link |
| E3: LLM Inference | As an engineer, I want to query LLMs via CLI so that I can script AI responses | Given prompt + model, when I run infer, then I get streaming text response |
| E4: Job Management | As a pipeline operator, I want to track job status so that I can handle failures | Given running jobs, when I list status, then I see % complete + errors |
| E5: Caching | As a cost-conscious user, I want cached responses so that I don't pay twice for same prompt | Given identical request, when submitted twice, second returns cache instantly |

**MoSCoW:**
- **Must:** Batch image gen, job tracking, basic caching
- **Should:** Video gen, LLM streaming, queue management
- **Could:** Fine-tuning integration, custom model uploads
- **Won't:** Model training, hosting, marketplace

**Roadmap:**
- **Phase 1 (Weeks 1-2):** Image batch + job tracking
- **Phase 2 (Weeks 3-4):** Video + LLM support
- **Phase 3 (Weeks 5-6):** Advanced caching + queue optimization

---

### skillboss

**Vision:** "Homebrew for AI agent skills — install, manage, publish effortlessly."

**Epics:**

| Epic | User Story | Acceptance Criteria |
|------|-----------|---------------------|
| E1: Discovery | As a user, I want to search clawhub so that I can find skills | Given search term, when I run search, then I get matching skills with ratings |
| E2: Installation | As a user, I want one-command install so that I don't manual setup | Given skill name, when I run install, then skill is ready to use |
| E3: Updates | As a user, I want to update skills so that I have latest features | Given outdated skill, when I run update, then latest version is installed |
| E4: Publishing | As a developer, I want to publish my skill so that others can use it | Given valid skill folder, when I run publish, then it appears on clawhub |
| E5: Dependencies | As a user, I want auto-resolved deps so that skills just work | Given skill with deps, when installed, then all deps are installed automatically |

**MoSCoW:**
- **Must:** Install, list, update, remove
- **Should:** Dependency resolution, version pinning, search
- **Could:** Skill validation CI, rating system
- **Won't:** General package management (not npm replacement)

**Roadmap:**
- **Phase 1 (Weeks 1-2):** Install/list/remove
- **Phase 2 (Weeks 3-4):** Update + dependency resolution
- **Phase 3 (Weeks 5-6):** Publish workflow + validation

---

### intelligence

**Vision:** "Your research department that never sleeps — structured intelligence at scale."

**Epics:**

| Epic | User Story | Acceptance Criteria |
|------|-----------|---------------------|
| E1: Web Scraping | As a researcher, I want to extract data from sites so that I can build datasets | Given URL + selectors, when I run scrape, then structured JSON is returned |
| E2: Trend Monitoring | As a strategist, I want to track keyword trends so that I can spot opportunities | Given keywords, when monitored, then I get alerts on significant changes |
| E3: Competitive Intel | As a founder, I want to monitor competitors so that I can react quickly | Given competitor list, when tracked, then I get updates on their changes |
| E4: RSS Aggregation | As a content curator, I want to monitor RSS feeds so that I stay informed | Given feed URLs, when aggregated, then I get digest of new items |
| E5: Entity Extraction | As an analyst, I want auto-extracted entities so that I can build knowledge graphs | Given text, when processed, then entities (people, orgs, products) are identified |

**MoSCoW:**
- **Must:** Basic scraping, RSS monitoring
- **Should:** Trend analysis, entity extraction
- **Could:** Competitive tracking UI, knowledge graphs
- **Won't:** Dark web, illegal content, real-time social monitoring

**Roadmap:**
- **Phase 1 (Weeks 1-2):** Scraping + RSS
- **Phase 2 (Weeks 3-4):** Entity extraction + trend detection
- **Phase 3 (Weeks 5-6):** Competitive intel workflows

---

### content-engine

**Vision:** "Write once, publish everywhere — AI-native content distribution."

**Epics:**

| Epic | User Story | Acceptance Criteria |
|------|-----------|---------------------|
| E1: Multi-Variant Generation | As a marketer, I want platform-optimized variants so that I don't rewrite manually | Given source content, when I run generate, then I get X, LinkedIn, IG variants |
| E2: Scheduling | As a manager, I want scheduled posts so that I can batch content | Given content + time, when scheduled, then it posts automatically |
| E3: A/B Testing | As a growth hacker, I want to test variants so that I optimize engagement | Given 2 variants, when A/B test runs, then I get performance comparison |
| E4: Analytics | As a strategist, I want engagement metrics so that I can iterate | Given posted content, when I check analytics, then I see views/likes/shares |
| E5: Approval Workflow | As a brand manager, I want review gates so that off-brand content doesn't post | Given draft, when submitted, then approver gets notification before publish |

**MoSCoW:**
- **Must:** Variant generation, basic scheduling
- **Should:** A/B testing, analytics integration
- **Could:** Approval workflows, brand voice training
- **Won't:** Social inbox management, influencer discovery

**Roadmap:**
- **Phase 1 (Weeks 1-2):** Variant generation + X posting
- **Phase 2 (Weeks 3-4):** Scheduling + LinkedIn/IG
- **Phase 3 (Weeks 5-6):** A/B testing + analytics

---

## PHASE 3: UX DESIGNER (CLI Experience)

### UX Principles (All Skills)

1. **Progressive Disclosure:** Simple commands by default, `--advanced` for power users
2. **Visual Feedback:** Spinners for async, progress bars for batches, colors for status
3. **JSON-First:** All output structured; `--format table` for human-readable
4. **Fail Fast:** Clear errors, suggested fixes, never silent failures
5. **Help at Fingertips:** Examples in every help text, `--examples` flag

### Command Structure (Consistent)

```
skill <noun> <verb> [args] [flags]
skill <noun> <verb> --help
```

Examples:
```bash
inference-sh image generate "prompt" --model flux --count 10
skillboss skill install inference-sh --version latest
intelligence source scrape https://example.com --selectors selectors.json
content-engine post create "Hello world" --platforms x,linkedin
```

### Output Formats

**Default (TTY):** Rich tables, colors, spinners  
**--json:** Machine-parseable, includes metadata  
**--quiet:** IDs only (for piping)  
**--verbose:** Full request/response logging

### Error Handling Pattern

```
❌ Error: <what happened>
💡 Suggestion: <how to fix>
📚 Docs: <link>
```

---

## PHASE 4: ARCHITECT (System Design)

### Shared Infrastructure: auth-vault

**Purpose:** Centralized credential management for all skills

**Data Model:**
```typescript
interface Credential {
  id: string;           // "inference-sh-api-key"
  service: string;      // "inference-sh"
  type: "api-key" | "oauth" | "basic";
  value: string;        // encrypted at rest
  scopes?: string[];    // ["read", "write"]
  expiresAt?: Date;
  metadata: {
    lastUsed: Date;
    rotationHint: string;
  };
}
```

**Commands:**
- `auth-vault set <service> <value>` — store credential
- `auth-vault get <service>` — retrieve (for scripts)
- `auth-vault list` — show all services
- `auth-vault rotate <service>` — update with validation

**Security:**
- AES-256-GCM encryption at rest
- Key stored in macOS Keychain / Linux keyring
- Never log credential values
- `--mask` flag to redact in output

---

### Skill 1: inference-sh Architecture

**Stack:** TypeScript + Node.js (20+), published as npm + standalone binary

**Core Commands:**
```bash
inference-sh image generate <prompt> [options]
inference-sh video generate <image> <prompt> [options]
inference-sh llm complete <prompt> [options]
inference-sh job list [status]
inference-sh job status <job-id>
inference-sh job cancel <job-id>
inference-sh cache clear [pattern]
```

**Data Models:**
```typescript
interface Job {
  id: string;
  type: "image" | "video" | "llm";
  model: string;
  status: "queued" | "running" | "completed" | "failed";
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  output?: string[];    // URLs to results
  error?: string;
  cost: number;         // tracked for budgeting
}

interface CacheEntry {
  key: string;          // hash of request params
  response: unknown;
  expiresAt: Date;
}
```

**Integration Patterns:**
- Reads API key from `auth-vault get inference-sh`
- MCP server for OpenClaw integration
- Webhook callbacks for job completion

**Scalability:**
- Local SQLite for job queue (up to 10k jobs)
- Redis option for distributed setups
- Batching: max 100 per batch, auto-chunking

**Risks & Mitigations:**
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| inference.sh API change | Medium | High | Abstraction layer, version pinning |
| Rate limiting | High | Medium | Exponential backoff, queue management |
| Large file storage | Medium | Medium | Stream to temp, cleanup on completion |
| Cost overruns | Medium | High | Budget caps, cost alerts per job |

---

### Skill 2: skillboss Architecture

**Stack:** TypeScript + Node.js

**Core Commands:**
```bash
skillboss search <query> [--filter category]
skillboss install <skill-name> [--version x.y.z] [--source github|clawhub]
skillboss list [--outdated]
skillboss update [skill-name]
skillboss remove <skill-name>
skillboss publish [path] [--dry-run]
skillboss validate [path]
```

**Data Models:**
```typescript
interface SkillManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  entry: string;              // main file
  bin: Record<string, string>; // command -> file
  dependencies?: string[];     // other skills
  requirements?: {
    node?: string;
    python?: string;
    bins?: string[];
  };
  openclaw?: {
    emoji: string;
    requires: object;
  };
}

interface InstalledSkill {
  manifest: SkillManifest;
  installPath: string;
  installedAt: Date;
  updatedAt: Date;
  source: string;             // clawhub, github, local
}
```

**Integration Patterns:**
- clawhub.com REST API for search/publish
- GitHub API for direct repo installs
- MCP server for OpenClaw
- Reads auth token from `auth-vault get clawhub`

**Scalability:**
- Local registry: `~/.openclaw/skills.json`
- Lazy-load skill manifests

**Risks & Mitigations:**
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Malicious skill | Medium | Critical | Manifest validation, sandboxing, permission model |
| Dependency hell | Medium | High | Lock files, semver resolution |
| clawhub downtime | Low | Medium | Cache fallback, git direct install |
| Breaking changes | Medium | High | Version pinning, deprecation warnings |

---

### Skill 3: intelligence Architecture

**Stack:** TypeScript + Python (via uv) for ML-heavy extraction

**Core Commands:**
```bash
intelligence source scrape <url> [--selectors <file>]
intelligence source monitor <url> [--interval <minutes>]
intelligence feed add <rss-url>
intelligence feed list
intelligence feed digest [--since <hours>]
intelligence trend track <keyword> [--sources <list>]
intelligence trend report <keyword>
intelligence entity extract <text|file>
intelligence competitive track <domain> [--watch <selectors>]
```

**Data Models:**
```typescript
interface ScrapedPage {
  url: string;
  fetchedAt: Date;
  title: string;
  content: string;
  extracted: Record<string, unknown>; // from selectors
  entities?: Entity[];
  hash: string; // for change detection
}

interface Entity {
  type: "person" | "org" | "product" | "location" | "event";
  name: string;
  confidence: number;
  context: string; // surrounding text
}

interface Trend {
  keyword: string;
  volume: number;
  velocity: number; // change rate
  sources: string[];
  samples: string[];
}
```

**Integration Patterns:**
- Puppeteer/Playwright for browser automation
- Read proxy config from `auth-vault get proxy`
- MCP server for feeding data to agents

**Scalability:**
- SQLite for local storage (pages, entities)
- Optional: PostgreSQL for team setups
- Caching: 24h default, configurable

**Risks & Mitigations:**
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Legal (scraping) | Medium | High | robots.txt respect, ToS warnings, user responsibility |
| Bot detection | High | Medium | Rotating proxies, request throttling, headless browsers |
| Data accuracy | Medium | Medium | Confidence scores, multiple source validation |
| Storage bloat | Medium | Medium | Auto-cleanup, retention policies |

---

### Skill 4: content-engine Architecture

**Stack:** TypeScript + Node.js

**Core Commands:**
```bash
content-engine variant create <content> --platforms x,linkedin,instagram
content-engine variant list <content-id>
content-engine post schedule <variant-id> --at <iso-time>
content-engine post now <variant-id>
content-engine post list [--status scheduled|published|failed]
content-engine ab create <variant-a> <variant-b> --duration <hours>
content-engine ab results <test-id>
content-engine analytics fetch [--since <days>]
```

**Data Models:**
```typescript
interface ContentVariant {
  id: string;
  sourceId: string;
  platform: "x" | "linkedin" | "instagram" | "tiktok";
  content: string;
  media?: string[]; // file paths
  hashtags?: string[];
  mentions?: string[];
  scheduledAt?: Date;
  postedAt?: Date;
  status: "draft" | "scheduled" | "posted" | "failed";
  engagement?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

interface ABTest {
  id: string;
  variants: [string, string]; // variant IDs
  platform: string;
  startedAt: Date;
  duration: number; // hours
  winner?: string;
  metrics: Record<string, number>;
}
```

**Integration Patterns:**
- X API via xurl (reads from auth-vault)
- LinkedIn API
- Instagram Basic Display API
- Webhook receivers for engagement callbacks

**Scalability:**
- SQLite for local queue
- Redis for distributed scheduling
- Cron-based polling or webhook triggers

**Risks & Mitigations:**
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| API rate limits | High | High | Queue management, exponential backoff |
| Content policy violations | Medium | High | Pre-flight validation, approval gates |
| Token expiry | Medium | Medium | Auto-refresh via auth-vault |
| Platform API changes | Medium | Medium | Abstraction layer, graceful degradation |

---

## PHASE 5: PRODUCT OWNER (Validation & Planning)

### Cross-Validation Check

| Check | Status | Notes |
|-------|--------|-------|
| Stories match architecture | ✅ | Each epic has clear command mapping |
| UX matches PRD | ✅ | CLI patterns consistent across skills |
| Stack supports requirements | ✅ | TypeScript + uv covers all needs |
| Dependencies resolved | ✅ | auth-vault is foundation skill |
| Security model valid | ✅ | Credential isolation, encryption |

### Gap Analysis

| Gap | Resolution |
|-----|------------|
| X API auth (content-engine) | Uses xurl CLI, reads from auth-vault |
| Scraping legality | Documentation + user acknowledgment required |
| Distributed queue | Phase 2: add Redis adapter |

### Sprint 1 Scope (Per Skill)

**inference-sh:**
- Image batch generation
- Job status tracking
- Basic caching

**skillboss:**
- Install from clawhub
- List installed skills
- Remove skill

**intelligence:**
- Single-page scrape
- Basic entity extraction
- RSS feed add/list

**content-engine:**
- Variant generation for X
- Schedule post
- Post now

### Story Point Estimates (Fibonacci)

| Skill | Phase 1 | Phase 2 | Phase 3 | Total |
|-------|---------|---------|---------|-------|
| inference-sh | 13 | 8 | 5 | 26 |
| skillboss | 8 | 8 | 5 | 21 |
| intelligence | 8 | 13 | 8 | 29 |
| content-engine | 8 | 8 | 8 | 24 |
| **auth-vault** | 5 | - | - | 5 |
| **TOTAL** | | | | **105 pts** |

**Velocity assumption:** 13 pts/week → **8 weeks** for full suite

### Definition of Done

- [ ] All commands have `--help` with examples
- [ ] 90% test coverage (unit + integration)
- [ ] Documentation in `/docs`
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Published to npm/clawhub
- [ ] MCP server integration tested
- [ ] Security audit (credential handling)

### Risk Register

| Rank | Risk | Likelihood | Impact | Mitigation | Owner |
|------|------|-----------|--------|------------|-------|
| 1 | X API auth breakage | High | High | Abstraction layer, multiple auth methods | content-engine |
| 2 | Scraping legal issues | Medium | High | ToS compliance, user warnings, rate limits | intelligence |
| 3 | inference.sh rate limits | High | Medium | Queue, backoff, user alerts | inference-sh |
| 4 | Malicious skill execution | Medium | Critical | Sandbox, manifest validation, permissions | skillboss |
| 5 | Scope creep (skill overlap) | Medium | Medium | Clear boundaries, shared auth-vault | All |

---

## PHASE 6: DESIGN ARCHITECT (Visual System)

### Brand Direction

**Tone:** Professional but approachable. Developer tools that don't feel corporate.

**Visual Concept:** "Circuit board meets blueprint" — clean lines, functional beauty, hints of electrical diagrams.

### CLI Output Styling

**Color System:**
```typescript
const colors = {
  primary: "#00D4AA",      // Success, primary actions
  secondary: "#6B7280",    // Secondary info
  accent: "#F59E0B",       // Warnings, highlights
  error: "#EF4444",        // Errors
  info: "#3B82F6",         // Info, links
  muted: "#9CA3AF",        // Disabled, timestamps
  background: "#111827",   // Dark mode bg
  surface: "#1F2937",      // Cards, panels
};
```

**Typography:**
- Headers: Bold, 1.2x line height
- Tables: Fixed column widths, truncated with "…"
- JSON: Syntax highlighted (2-space indent)
- Progress: ████████░░ 80%

**Component Specs:**

**Spinner:**
```
⏳ Generating images... (3/10)
```

**Progress Bar:**
```
[████████░░] 80% | ETA: 45s | 8/10 complete
```

**Table:**
```
ID        NAME              STATUS    CREATED
────────  ────────────────  ────────  ─────────────
abc123    inference-sh      ✅ Installed  2024-03-14
```

**Error:**
```
❌ Error: Rate limit exceeded (429)
💡 Suggestion: Wait 60s or use --priority high
📚 Docs: https://docs.inference.sh/rate-limits
```

### Design Tokens

```yaml
design_tokens:
  spacing:
    unit: 2
    scale: [2, 4, 8, 12, 16, 24, 32]
  
  border_radius:
    none: 0
    small: 4
    medium: 8
    
  animation:
    fast: 150ms
    normal: 300ms
    slow: 500ms
    easing: ease-out
    
  icons:
    success: "✅"
    error: "❌"
    warning: "⚠️"
    info: "ℹ️"
    pending: "⏳"
    tip: "💡"
    docs: "📚"
```

---

## Dependency Matrix

```
                    auth-vault
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    skillboss      inference-sh    intelligence
         │               │               │
         └───────────────┴───────────────┘
                         │
                         ▼
                  content-engine
                         │
                         ▼
                    (uses X API
                     via xurl or
                     direct)
```

**Key Dependencies:**
- All skills depend on **auth-vault**
- **content-engine** depends on X API (separate from skillboss)
- **skillboss** manages all skills including itself
- **intelligence** feeds data to **content-engine**

---

## Build Order

1. **Week 1:** auth-vault (foundation)
2. **Week 2-3:** skillboss (enables installing others)
3. **Week 4-5:** inference-sh (standalone value)
4. **Week 6-7:** intelligence (feeds content-engine)
5. **Week 7-8:** content-engine (integrates all)

---

## Next Steps

1. ✅ **BMAD Complete** — Blueprint approved
2. 🔄 **Fix xurl auth** — DaWizKid (manual, 2 min)
3. 📋 **Create tickets** — Break into GitHub issues per skill
4. 🔨 **Build auth-vault** — Sprint 1 starts

---

## Appendix: Regarding skillboss + X API

**Question:** Should skillboss include X API functionality?

**Answer:** No. Keep concerns separate:

| Component | Responsibility |
|-----------|---------------|
| **skillboss** | Install, update, publish skills |
| **xurl** | X API client (standalone skill) |
| **auth-vault** | Shared credential storage |
| **content-engine** | Uses X API for posting (via xurl or direct) |

**If cleaner credential handling is needed:**
- Add xurl as skillboss dependency
- xurl reads auth from auth-vault
- skillboss can `skillboss auth status` to check all skill auths

This maintains single responsibility while enabling coordination.

---

*BMAD Plan Complete. Ready for build phase.*
