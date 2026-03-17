# SkillBoss Skills Repository Analysis

**Date:** 2026-03-14  
**Source:** https://github.com/heeyo-life/skillboss-skills.git  
**Analyzer:** Cool Vibe Coding Deep Research Agent  

---

## Executive Summary

SkillBoss is a **production-ready multi-AI gateway platform** backed by the OpenAI Fund, providing a unified API layer for 100+ AI services. The repository contains well-structured skills that integrate with Claude Code, Codex, OpenClaw, and other agent platforms.

**Key Finding:** This is a **high-value acquisition target** for Cool Vibe Coding. The platform provides a single API key for everything we need: image/video generation, LLM routing, deployment, payments, and email - all with a clean CLI interface.

---

## 1. Repository Structure

### Stats
| Metric | Value |
|--------|-------|
| Total Skills | 1 (SkillBoss with 7 workflow guides) |
| Extensions | 1 (Remotion - video production) |
| JavaScript/TypeScript Files | 30+ |
| Documentation Files | 50+ |
| MCP Server | Yes (`@skillboss/mcp-server` npm package) |

### Directory Layout
```
skillboss-skills/
├── skillboss/                    # Main skill
│   ├── SKILL.md                  # Master documentation
│   ├── commands.md               # CLI reference
│   ├── reference.md              # Model catalog
│   ├── workflows.md              # Workflow index
│   ├── api-integration.md        # Embedding in user code
│   ├── deployment.md             # CF Workers deployment
│   ├── billing.md                # Pricing & credits
│   ├── error-handling.md         # Error patterns
│   ├── config.json               # API configuration
│   ├── scripts/                  # CLI tools
│   │   ├── api-hub.js            # Main CLI entry
│   │   ├── serve-build.js        # Deployment
│   │   ├── stripe-connect.js     # Stripe OAuth
│   │   ├── product-manager.js    # E-commerce products
│   │   └── commands/             # Command modules
│   │       ├── pilot.js          # Smart model selector ⭐
│   │       ├── chat.js           # LLM chat
│   │       ├── image.js          # Image generation
│   │       ├── video.js          # Video generation
│   │       ├── tts.js            # Text-to-speech
│   │       ├── stt.js            # Speech-to-text
│   │       ├── music.js          # Music generation
│   │       ├── search.js         # Web search/scrape
│   │       ├── email.js          # Email sending
│   │       ├── sms.js            # SMS/OTP
│   │       ├── document.js       # PDF processing
│   │       └── models.js         # Model listing
│   ├── workflows/                # Task guides
│   │   ├── logo-maker/
│   │   ├── website-builder/
│   │   ├── content-creator/
│   │   ├── podcast-maker/
│   │   ├── email-campaign/
│   │   ├── login-integration/
│   │   └── ecommerce/
│   ├── extensions/               # Third-party skills
│   │   └── remotion/             # React video framework
│   └── templates/                # Starter templates
│       └── worker-ecommerce/     # Full-stack e-commerce
├── mcp-server/                   # MCP registry entry
│   └── server.json               # MCP server manifest
└── blog/                         # Marketing content
```

---

## 2. Skill Inventory - Deep Dive

### Core Skill: SkillBoss API Hub

**Purpose:** Multi-provider AI gateway - one API key, 100+ AI services

**Tech Stack:**
- Language: JavaScript (Node.js)
- Architecture: CLI + API client
- Deployment: Cloudflare Workers
- Storage: R2 (static), D1 (database), KV (cache)
- Auth: SkillBoss API key (centralized)

**Quality Assessment: ⭐⭐⭐⭐⭐ Production-Ready**

- Clean modular architecture
- Comprehensive error handling
- Retry logic with exponential backoff
- Rate limit handling
- Detailed documentation
- MCP server available
- Backed by OpenAI Fund

**What It Provides:**

| Category | Capabilities |
|----------|--------------|
| **LLMs** | Claude 4.6 Opus, GPT-5, Gemini 2.5/3, DeepSeek R1, 50+ models |
| **Images** | Gemini Image, FLUX (dev/schnell), upscaling, img2img |
| **Video** | Google Veo 3.1, Minimax |
| **Audio** | ElevenLabs TTS, OpenAI TTS/STT, music generation |
| **Search** | Perplexity, Firecrawl, ScrapingDog, Linkup |
| **Deploy** | Static sites, Cloudflare Workers (auto D1/KV/R2) |
| **Commerce** | Stripe Connect, checkout sessions, subscriptions |
| **Comms** | Email (AWS SES), SMS/OTP (Prelude) |
| **Docs** | PDF parsing, extraction, presentations (Gamma) |

**Unique Features:**
- **Pilot Command:** Smart model selector (`pilot --type image --prefer price`)
- **HuggingFace Dynamic Routing:** Any HF model works without pre-registration
- **Centralized Billing:** One credit system for all providers
- **Auto-Provisioning:** D1/KV/R2 created automatically on deploy

---

### Extension: Remotion

**Purpose:** Programmatic video creation with React

**Tech Stack:**
- React + TypeScript
- Remotion framework
- Tailwind CSS support
- Three.js/React Three Fiber support

**Quality: ⭐⭐⭐⭐⭐ Excellent**

- 25+ detailed rule files
- Code examples for every pattern
- Covers: animations, transitions, captions, audio, 3D, charts, maps

**Use When:** Building video apps with code (vs AI-generated videos)

---

### Workflow Guides

| Workflow | Use Case | Quality |
|----------|----------|---------|
| Logo Maker | Design logos, brand icons | ⭐⭐⭐⭐☆ |
| Website Builder | Deploy static sites | ⭐⭐⭐⭐⭐ |
| Content Creator | AI images/video/audio | ⭐⭐⭐⭐⭐ |
| Podcast Maker | Article → podcast | ⭐⭐⭐⭐☆ |
| Email Campaign | Batch marketing emails | ⭐⭐⭐⭐☆ |
| Login Integration | Auth for React apps | ⭐⭐⭐⭐⭐ |
| E-Commerce | Stripe payments | ⭐⭐⭐⭐⭐ |

---

## 3. Architecture Patterns

### Authentication Pattern

```
┌─────────────────┐     ┌─────────────────┐
│   User/Agent    │────▶│  ~/.config/     │
│                 │     │  skillboss/     │
│                 │◄────│  credentials.json│
└─────────────────┘     └─────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  Resolution Order:                  │
│  1. ~/.config/skillboss/credentials.json│
│  2. skillboss/config.json           │
└─────────────────────────────────────┘
```

**Key Points:**
- Supports trial keys (`sk-tmp-*`) with auto-provisioning
- Browser-based OAuth for permanent accounts
- Automatic credential storage
- No API keys in code

### API Client Pattern

```javascript
// lib/client.js - Configuration
const config = {
  apiKey: fromCredentials(),
  baseUrl: "https://api.heybossai.com/v1",
  buildApiUrl: "https://build.skillbossai.com",
  stripeConnectUrl: "https://heyboss.ai"
}

// lib/fetch-retry.js - Resilient HTTP
fetchWithRetry(url, options, {
  maxRetries: 3,
  backoff: exponential
})
```

### Command Pattern

Each command is a module with standardized interface:
```javascript
// commands/image.js
async function image(args) { /* ... */ }
async function upscale(args) { /* ... */ }
module.exports = { image, upscale, img2img }
```

### Error Handling Pattern

```javascript
// Standard error structure
{
  error: true,
  message: "Human-readable error",
  code: "ERROR_CODE",
  retryable: true/false
}

// Balance warnings included in responses
{
  _balance_warning: "Low credits: $2.50 remaining"
}
```

### Deployment Pattern

```
User Worker Code
       │
       ▼
┌─────────────────┐
│ serve-build.js  │──▶ Validates wrangler.toml
│                 │──▶ Auto-detects bindings
└─────────────────┘
       │
       ▼
┌─────────────────┐
│ build.skillbossai.com │──▶ Provisions D1/KV/R2
│                      │──▶ Uploads code
└─────────────────┘
       │
       ▼
┌─────────────────┐
│ Cloudflare Edge │──▶ Worker deployed globally
└─────────────────┘
```

---

## 4. Integration Opportunities

### BMAD Plan Mapping

| BMAD Component | SkillBoss Mapping | Status |
|----------------|-------------------|--------|
| **inference-sh** | `pilot` command + all media commands | ✅ Perfect fit |
| **intelligence** | `search`, `scrape`, `linkup-*`, `ceointerviews` | ✅ Strong fit |
| **content-engine** | `image`, `video`, `tts`, `music`, `send-email` | ✅ Strong fit |
| **skillboss** | This IS skillboss - adopt patterns | ✅ Direct use |

### What's Missing That We Need

| Gap | Priority | Solution |
|-----|----------|----------|
| Telegram bot integration | High | Build wrapper skill |
| Instagram/X posting APIs | High | Add to content-engine |
| Analytics/tracking | Medium | Integrate with existing tools |
| A/B testing framework | Medium | Build or integrate |
| Multi-agent orchestration | High | BMAD does this |

### What's Redundant

| Redundancy | Note |
|------------|------|
| Our inference-sh tools | SkillBoss `pilot` is superior |
| Our deployment scripts | SkillBoss `serve-build.js` is better |
| Individual API wrappers | SkillBoss unified API replaces all |

---

## 5. Actionable Recommendations

### ⭐ Priority 1: DIRECT USE (Adopt Immediately)

| Component | Action | Effort |
|-----------|--------|--------|
| **SkillBoss API Hub** | Install as primary AI gateway | 30 min |
| **Pilot command** | Replace model selection logic | 1 hour |
| **Deployment** | Use `serve-build.js` for all CF deploys | 2 hours |
| **E-commerce template** | Base for any commerce projects | Immediate |

**Installation:**
```bash
# Clone to OpenClaw skills directory
cp -r /tmp/skillboss-skills/skillboss ~/.openclaw/skills/

# Get API key
node ~/.openclaw/skills/skillboss/scripts/skillboss auth trial
```

### 🔧 Priority 2: FORK & MODIFY

| Component | Modification | Effort |
|-----------|--------------|--------|
| **Remotion extension** | Add TikTok/Reels templates | 1 day |
| **Workflows** | Add Telegram bot workflow | 4 hours |
| **Content creator** | Add social posting capabilities | 1 day |

### 🔄 Priority 3: REBUILD (Good Ideas, Custom Implementation)

| Component | Why Rebuild | New Approach |
|-----------|-------------|--------------|
| **Agent orchestration** | SkillBoss is single-agent | BMAD multi-agent |
| **Skill management** | Use their patterns, custom code | JSON-based skill registry |

### 🚫 Priority 4: IGNORE

| Component | Reason |
|-----------|--------|
| Blog content | Marketing material, not technical |
| Claude-specific settings | We're OpenClaw |

---

## 6. Integration Roadmap

### Week 1: Foundation
- [ ] Install SkillBoss skill to `~/.openclaw/skills/`
- [ ] Configure API key (trial → permanent)
- [ ] Update BMAD to use `pilot` command
- [ ] Test all media generation (image, video, tts, music)

### Week 2: Deployment Pipeline
- [ ] Migrate deployment to `serve-build.js`
- [ ] Update all templates to use SkillBoss patterns
- [ ] Document new deployment flow

### Week 3: Content Engine
- [ ] Build Telegram posting wrapper
- [ ] Build Instagram/X posting wrapper
- [ ] Integrate with SkillBoss media generation

### Week 4: E-commerce
- [ ] Fork e-commerce template
- [ ] Customize for Cool Vibe Coding brand
- [ ] Test Stripe Connect flow

---

## 7. Technical Specifications

### Model IDs We Should Use

**Image Generation:**
```bash
# Primary
vertex/gemini-2.5-flash-image-preview

# Fallback
replicate/black-forest-labs/flux-schnell
```

**Video Generation:**
```bash
# Primary
vertex/veo-3.1-fast-generate-preview
```

**TTS:**
```bash
# Primary
elevenlabs/eleven_multilingual_v2

# Fallback
openai/tts-1-hd
```

**Chat/Routing:**
```bash
# Complex reasoning
bedrock/claude-4-6-opus

# General use
openrouter/deepseek/deepseek-r1

# Fast/simple
vertex/gemini-2.5-flash
```

### Key CLI Commands

```bash
# Smart model selection
node ./scripts/api-hub.js pilot --type image --prompt "sunset" --output sunset.png

# Deploy static site
node ./scripts/serve-build.js publish-static ./dist --project-id my-site

# Deploy Worker
node ./scripts/serve-build.js publish-worker ./worker --name my-api

# Stripe setup
node ./scripts/stripe-connect.js

# Product management
node ./scripts/product-manager.js create --name "Plan" --price 2999
```

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| SkillBoss API rate limits | Medium | High | Implement retries, cache responses |
| Credit exhaustion | Medium | High | Monitor `_balance_warning`, auto-notify |
| Vendor lock-in | Low | Medium | Abstract behind BMAD interfaces |
| Service downtime | Low | High | Fallback to direct providers |

---

## 9. Conclusion

**SkillBoss is the missing piece** for Cool Vibe Coding's infrastructure. It provides:

1. **Unified AI Gateway** - One API key for 100+ services
2. **Production Deployment** - CF Workers with auto-provisioning
3. **Commerce Ready** - Stripe Connect + checkout
4. **Media Generation** - Image, video, audio, music
5. **Research Tools** - Search, scrape, CEO interviews

**Recommendation:** Adopt immediately as our primary AI gateway and deployment platform. Fork for customization but use core infrastructure as-is.

---

## Appendix: File Inventory

### Core Documentation (8 files)
- SKILL.md - Main skill documentation
- reference.md - Complete model catalog
- commands.md - CLI reference
- workflows.md - Workflow index
- deployment.md - Deployment guide
- api-integration.md - Embedding in code
- error-handling.md - Error patterns
- billing.md - Pricing info

### Scripts (17 files)
- api-hub.js - Main CLI (884 lines)
- serve-build.js - Deployment
- stripe-connect.js - Stripe OAuth
- product-manager.js - E-commerce CRUD
- commands/ - 13 command modules

### Extensions (26 files)
- Remotion rules (25 .md files)
- EXTENSION_SKILL.md

### Workflows (7 directories)
- logo-maker, website-builder, content-creator, podcast-maker, email-campaign, login-integration, ecommerce

### Templates (9 files)
- worker-ecommerce - Full-stack starter

**Total: 67+ files, ~15,000 lines of code/documentation**
