# THE COOL VIBE CODING TEST-DRIVEN PROTOCOL

Effective Immediately (March 21, 2026). This protocol is non-negotiable for all future development.

## 1. Visual QA & Pixel Perfect Delivery
- Every web app must have Playwright E2E tests covering the critical user paths.
- Before claiming a UI is "done", Nova MUST run browser automation to verify the paint and layout on responsive screen sizes.
- No pushing code with broken mobile margins or text overflows. Awwwards-level design requires a visual check.

## 2. Pro Audio Plugins (VST/AU)
- C++ build environment (CMake, Ninja) is installed.
- JUCE framework will be used for all DSP audio plugins.
- Every audio project must have an automated build script configured.

## 3. Game Development (WebGL / Three.js)
- All 3D web experiences must utilize `react-three-fiber` and `three` best practices.
- Physics engines (Rapier) must have dedicated test scenes before integration into the main product.
- FPS (Frames Per Second) must be verified via Lighthouse/Playwright performance metrics.

## 4. Zero Defect Delivery
- **Test-Driven Development (TDD):** Write the tests before or alongside the feature.
- **Unit Tests:** Jest must cover all core logic and helper functions.
- **Integration Tests:** Playwright handles user flows.
- **NEVER** deliver a product to DaWizKid or Dot Com unless all tests pass. If it fails, fix it silently before presenting it.

## 5. Implementation Command
- Run `npx playwright test` on every PR.
- Run `npm run test` (Jest) before every commit.

*"We are not in the giving business. We sell elite, flawless products."* — Nova
