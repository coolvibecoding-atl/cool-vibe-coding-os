# Whats Up ATL - BMAD Planning

## Phase 1: Analyst

### Problem Statement
Atlanta residents and visitors need a centralized platform to discover local events, hotspots, trending locations, and hidden gems - currently there's no single source of truth for what's happening in the city.

### Target Users
1. **Atlanta Residents** - Looking for new places to explore, local events
2. **Visitors/Tourists** - Want authentic ATL experiences
3. **Local Businesses** - Want to promote events and locations
4. **Event Organizers** - Want to reach local audiences

### Success Metrics
- 10K monthly active users within 6 months
- 100+ local business partners
- $50K MRR by end of year

### Constraints
- Mobile-first design required
- Need App Store approval (no Apple Developer yet - need to resolve)
- Content moderation needed

---

## Phase 2: Product Manager

### Vision
The ultimate Atlanta city companion - discover what's trending, find events, and explore hidden gems all in one app.

### Epics & User Stories

**Epic 1: Discovery**
- As a user, I want to see trending locations so I know what's hot
- As a user, I want to filter by category (food, music, arts, nightlife)
- As a user, I want to see location photos and ratings

**Epic 2: Events**
- As a user, I want to see upcoming events in Atlanta
- As a user, I want to save events to my calendar
- As a user, I want to share events with friends

**Epic 3: Business Listings**
- As a business, I want to claim my listing
- As a business, I want to post events/promotions
- As a business, I want to respond to reviews

**Epic 4: User Engagement**
- As a user, I want to save favorite places
- As a user, I want to follow other users with similar tastes
- As a user, I want to get personalized recommendations

### MoSCoW Prioritization
**Must Have:**
- Location discovery feed
- Category filtering
- Basic business listings
- Event calendar

**Should Have:**
- User accounts/profiles
- Save favorites
- Business claiming
- Search functionality

**Could Have:**
- Social following
- Reviews/ratings
- In-app messaging

**Won't Have (MVP):**
- Ticket purchasing
- In-app ordering
- Loyalty programs

---

## Phase 3: UX Designer

### User Journey
1. **Onboarding** → Select interests → Get personalized feed
2. **Discovery** → Browse trending → Filter by category → View details
3. **Events** → Browse events → Save to calendar → Share
4. **Business** → Claim listing → Update info → Post promotions

### Screen Structure
1. Home (Discovery Feed)
2. Explore (Categories/Search)
3. Events
4. Profile
5. Business Dashboard (separate flow)

### 3-5 UX Principles
1. **Location-first** - Always show relevant local content
2. **Visual-heavy** - Photos and videos over text
3. **Real-time** - Live trending data
4. **Social proof** - Ratings, reviews, user counts
5. **Low friction** - Minimal taps to get value

---

## Phase 4: Architect

### Tech Stack
- **Frontend:** React Native (Expo) - mobile-first
- **Backend:** Node.js + Express with AI agents
- **Database:** PostgreSQL + Redis for caching
- **Auth:** Clerk or custom JWT
- **Maps:** Mapbox or Google Maps API
- **Hosting:** Vercel (backend), Expo (mobile)

### Data Models
- Users
- Locations
- Events
- Categories
- Reviews
- SavedItems
- BusinessProfiles

### API Endpoints
- GET /locations (with filters)
- GET /locations/:id
- GET /events
- GET /events/:id
- POST /locations (business only)
- POST /events (business only)
- GET /trending

---

## Phase 5: Product Owner

### Definition of Done
- [ ] User can browse locations by category
- [ ] User can view location details
- [ ] User can see upcoming events
- [ ] User can save favorites (requires auth)
- [ ] Basic search works

### Sprint 1 Scope
1. Location discovery feed
2. Category filtering
3. Location detail view
4. Basic navigation

### Risk Register
1. **Apple Developer** - Need credentials for App Store
2. **Content moderation** - Need automated + manual review
3. **Map API costs** - Need to monitor usage
4. **User acquisition** - Need marketing budget

---

## Phase 6: Design Architect

### Brand Direction
- **Tone:** Fresh, urban, authentic ATL
- **Colors:** 
  - Primary: Electric Blue (#00E5FF)
  - Secondary: Hot Pink (#FF00FF)
  - Background: Dark (#0A0A0F)
  - Accent: Gold (#FFD700)
- **Typography:** Bold, modern sans-serif
- **Vibe:** Energy of Atlanta nightlife meets Southern hospitality

---

## Next Steps
1. Resolve Apple Developer account issue
2. Set up React Native project
3. Build MVP based on Sprint 1 scope

---

*BMAD Completed: March 12, 2026 (Night Mode)*
