# Frontend Reference Blueprint: SouthDownATL World Cup App
**Reference Sources:**
1. Ex-Google PM Builds God's Eye to Monitor Iran in 4D (https://youtu.be/0p8o7AeHDzg)
2. Ex-Google Maps PM Vibe Coded Palantir In a Weekend (https://youtu.be/rXvU7bPJ8n4)

## BMAD Phase 3 & 6 Handoff

This blueprint synthesizes the advanced, 4D spatial data visualization and "Palantir-like" HUD interfaces demonstrated in the reference videos. It serves as the architectural and design foundation for the SouthDownATL World Cup App's frontend using the 2026 tech stack.

### 1. Architecture & Core Tech Stack (2026)
* **Spatial & 3D Rendering:** `React Three Fiber` (R3F) + `WebGL 3.0` + `Deck.gl` (for massive geographic data overlays).
* **Motion & Animation:** `GSAP 4` (complex timelines, scroll-driven spatial zooming) + `Framer Motion` (fluid UI transitions, micro-interactions).
* **Layout & Styling:** `CSS Subgrid` (complex HUD alignment) + `Fluid Typography` (CSS clamp functions for adaptive scaling).
* **State & Data Streaming:** `Zustand` (high-frequency state updates) + WebSockets/Server-Sent Events for real-time match/player telemetry.

### 2. UI/UX Paradigm: The "God's Eye" HUD
The user interface must feel like a military-grade, real-time command center, adapted for sports intelligence. 
* **Global View to Pitch View:** Users start at a 3D globe/city level (Atlanta World Cup venues) and zoom seamlessly into a 4D pitch view.
* **Non-Blocking UI:** The data viz *is* the app. UI elements (menus, filters) should be floating, translucent, glassmorphic panels overlaid on the WebGL canvas.
* **Fluid Typography:** Data numbers and player stats use highly legible, monospaced tech fonts that fluidly scale based on viewport, preventing layout shifts during intense data streams.

### 3. Data Visualization Mechanics
* **4D Player Tracking:** Players are represented not as dots, but as glowing spatial heat signatures with trajectory trails (using R3F shaders).
* **Real-time Telemetry:** Speed, heart rate, and pass-probability vectors overlaid in 3D space. 
* **Time-Scrubbing (The 4th Dimension):** A prominent timeline slider at the bottom (styled via GSAP) allows users to scrub backward/forward in the match, instantly updating the 3D state of the pitch.

### 4. Animation & Motion Design
* **Entry Sequence:** A sweeping, cinematic camera fly-in from orbit to the specific Atlanta stadium, built with GSAP and R3F camera manipulation.
* **Data Layer Transitions:** Toggling layers (e.g., heat maps, passing networks) should use staggered, easing animations (Framer Motion) so data "grows" into the scene rather than popping in.
* **HUD Glitch Effects:** Minimal, controlled chromatic aberration and scanline effects on the UI panels to sell the "Palantir" vibe without compromising readability.

### 5. BMAD Phase 6: Design System
* **Color Palette:** 
  * Deep Space/Graphite Base (`#0B0C10`, `#1F2833`)
  * Neon Accent/Data Highlights (`#66FCF1`, `#45A29E`)
  * Alert/Critical (`#FF2E63`)
* **Typography:** 
  * Primary Data: `JetBrains Mono` or `Space Mono` (monospaced for tabular data).
  * Headers/HUD: `Inter` or `Geist` (clean, neo-grotesque).
* **Grid System:** Extensive use of CSS Subgrid to align complex nested data panels perfectly to the master viewport grid, ensuring 100% precision across devices.
