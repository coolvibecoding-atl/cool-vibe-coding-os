# Cool Vibe Coding Skill Routing Map

## Audit Summary
- Claude skills: 859
- Codex skills: 858
- Gemini/Antigravity skills: 859
- Kilo skills: 858
- OpenClaw skills before import: 1000
- Duplicated across all major systems: 850
- Missing in OpenClaw before import: 8

## Duplicated Core
Most shared skills already existed across Claude, Codex, Gemini, and Kilo. The main issue was duplication and routing, not lack of skills.

## Imported High-Value Missing Skills
1. `ai-product`
2. `ai-sdk`
3. `ai-wrapper-product`
4. `code-documentation-code-explain`
5. `code-documentation-doc-generate`
6. `code-refactoring-refactor-clean`
7. `code-review-ai-ai-review`
8. `mobile-design`

## How To Route Them
### AI Mixer Pro / AI SaaS
- `ai-product`
- `ai-wrapper-product`
- `ai-sdk`
- `mobile-design`
- `analytics-tracking`
- `application-performance-performance-optimization`

### Code Quality / Refactors
- `code-refactoring-refactor-clean`
- `code-review-ai-ai-review`
- `architect-review`
- `run-e2e-tests`
- `run-smoke-tests`

### Documentation / Handoff
- `code-documentation-code-explain`
- `code-documentation-doc-generate`
- `docs-narrator`-style internal workflows

### Mobile-First Products
- `mobile-design`
- `Frontend Responsive Design Standards`
- `accessibility-compliance`

## Practical Rule
Do not import skills blindly. Prefer:
1. shared duplicated skills already present in OpenClaw
2. imported missing high-value skills only
3. routing by project type rather than agent brand
