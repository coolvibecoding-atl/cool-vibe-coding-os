# BMAD Blueprint: SoDoATL Community App
**Date:** March 16, 2026
**Target Launch:** Thursday, March 19, 2026 (3 days)
**Created by:** Nova (BMAD Planning Agent)

---

## PRE-PHASE 1 — THE INTERROGATION 🛑

### Hard Questions & Answers

**Q: What is the actual value proposition?**
A: Hyper-local community connection + discovery. Not just events — but the PEOPLE, businesses, and conversations that make a neighborhood alive.

**Q: Who is the primary user?**
A: Local residents who want to know what's happening AND connect with their community.

**Q: Why choose this over Nextdoor/Facebook Groups/Eventbrite?**
A: 
- Nextdoor = too nosy, fear-based
- Facebook Groups = algorithm-buried, not location-native
- Eventbrite = transactional, no community DNA
- **SoDoATL =** AI-powered personalization + real-time local pulse + community-first design

**Q: What makes this different?**
A: Google data integration for REAL-TIME local info + AI curation + gamification + monetization built for LOCAL businesses (not ads)

**Q: Can this work in ANY city?**
A: YES. The architecture is city-agnostic. ATL is the pilot, then template to other markets.

---

## PHASE 1 — ANALYST 🔍

### Problem Statement
Local residents lack a unified, modern platform to discover community happenings, connect with neighbors, and support local businesses. Existing solutions are either fear-based (Nextdoor), algorithm-buried (Facebook), or purely transactional (Eventbrite). There's no AI-powered, community-first platform that combines discovery, connection, AND local economic support.

### Target Users
1. **Primary:** Local residents (25-45, mobile-first, community-minded)
2. **Secondary:** Local business owners (want to reach locals authentically)
3. **Tertiary:** Event organizers (need better local discovery)

### Success Metrics
- DAU/MAU ratio > 30%
- Businesses claimed: 100+ in pilot city (Month 1)
- Events created: 50+ weekly
- Retention D7 > 40%
- Revenue: $1K MRR by Month 2

### Constraints
- 3-day MVP timeline (Thu Mar 19)
- Backend-first priority
- Google API rate limits/costs
- Mobile-first (but start with responsive web)

### MVP Scope
**IN:**
- User auth
- Location-based feed
- Google Places integration
- Business profiles
- Event creation/discovery
- Basic AI curation
- Monetization hooks (business premium)

**OUT (v2):**
- Native mobile apps
- Advanced AI features
- Payment processing
- Social graph depth
- Gamification system

---

## PHASE 2 — PRODUCT MANAGER 📌

### Product Vision
**"The AI-powered local community platform that helps residents discover, connect, and thrive together — one neighborhood at a time."**

### Epics & User Stories

#### EPIC 1: Core Location & Discovery
- US 1.1: As a resident, I want to set my location so I see relevant local content
- US 1.2: As a resident, I want to browse nearby businesses so I can support local
- US 1.3: As a resident, I want to see what's happening this week in my area
- US 1.4: As a resident, I want AI-curated recommendations based on my interests

#### EPIC 2: Community Feed
- US 2.1: As a resident, I want to post updates to my community
- US 2.2: As a resident, I want to comment on posts
- US 2.3: As a resident, I want to filter by category (events, deals, news, discussion)

#### EPIC 3: Business Profiles
- US 3.1: As a business owner, I want to claim my business profile
- US 3.2: As a business owner, I want to post updates/deals to locals
- US 3.3: As a business owner, I want to see engagement analytics
- US 3.4: As a business owner, I want to upgrade to premium visibility

#### EPIC 4: Events
- US 4.1: As a user, I want to discover local events
- US 4.2: As a user, I want to create and promote events
- US 4.3: As a user, I want to RSVP and see who's going

#### EPIC 5: Monetization
- US 5.1: As a business, I want premium placement in feed
- US 5.2: As a business, I want promoted event visibility
- US 5.3: As a business, I want analytics dashboard access

#### EPIC 6: AI Features
- US 6.1: As a user, I want personalized event recommendations
- US 6.2: As a user, I want AI-generated event descriptions
- US 6.3: As a business, I want AI-assisted post generation

### MoSCoW Prioritization

**MUST HAVE (Sprint 1 - Thu Mar 19):**
- User auth (Google/Email)
- Location detection/selection
- Google Places API integration
- Business listings feed
- Event creation + feed
- Basic AI curation
- Database schema

**SHOULD HAVE (Sprint 2):**
- Community posts/comments
- Business claim flow
- Premium business tier UI
- Event RSVP

**COULD HAVE (Sprint 3):**
- Advanced AI features
- Push notifications
- Analytics dashboard
- Social features

**WON'T HAVE (v2):**
- Native apps
- Payment processing
- Full gamification

### 3-Phase Roadmap

| Phase | Timeline | Focus |
|-------|----------|-------|
| **Sprint 1** | Mar 16-19 (3 days) | Backend + Core Discovery MVP |
| **Sprint 2** | Mar 20-27 | Community Features + Monetization |
| **Sprint 3** | Mar 28-Apr 4 | AI Enhancement + Polish |

---

## PHASE 3 — UX DESIGNER 🎨

### User Journey Maps

**Journey 1: New User Discovery**
1. Land on homepage → See location prompt
2. Allow location → See personalized feed
3. Browse events → Tap for details
4. Discover local business → View profile
5. Return daily for updates

**Journey 2: Business Owner**
1. Search for business → Find unclaimed profile
2. Click "Claim" → Verify ownership
3. Update profile → Post first update
4. See engagement → Consider premium

### Information Architecture

```
├── Home (Feed)
│   ├── For You (AI-curated)
│   ├── Events
│   ├── Businesses
│   └── Community Posts
├── Explore
│   ├── Map View
│   ├── Categories
│   └── Trending
├── Events
│   ├── This Week
│   ├── Create Event
│   └── My RSVPs
├── Businesses
│   ├── Nearby
│   ├── Categories
│   └── Claim Yours
├── Profile
│   ├── Settings
│   ├── My Posts
│   └── Saved
└── Business Portal (if claimed)
    ├── Dashboard
    ├── Analytics
    └── Upgrade
```

### User Flows

**Flow: Location Setup**
```
Open App → Location Prompt → [Allow] → Auto-detect city → Show feed
                                    ↓
                              [Deny] → Manual city search → Select → Show feed
```

**Flow: Event Creation**
```
Events Tab → [+] Create → Form (title, date, location, desc) → AI enhance (optional) → Publish → Appear in feed
```

### Wireframe Descriptions

**Home Feed:**
- Sticky header with location + search
- Tab bar: For You | Events | Biz | Posts
- Card-based feed with infinite scroll
- Each card: image, title, meta (distance, time), quick actions

**Event Detail:**
- Hero image
- Title + date/time
- Location with mini-map
- Description (AI-enhanced)
- RSVP button + attendee count
- Related events carousel

**Business Profile:**
- Cover photo + logo
- Name + category
- Google rating + reviews link
- Hours + contact
- Recent posts/deals
- Claim button (if unclaimed)

### Design Principles (Awwwards-Level)

1. **Locally Alive:** Warm, vibrant colors that feel like a neighborhood block party
2. **Effortless Discovery:** AI works invisibly, surfacing the right content
3. **Community-First:** Faces and stories over transactions
4. **Mobile-Native:** Thumb-friendly, glanceable, fast
5. **Inclusive:** Accessible, welcoming, diverse representation

### Accessibility (WCAG 2.2 AA)
- Color contrast ≥ 4.5:1
- Keyboard navigation
- Screen reader optimized
- Touch targets ≥ 44px
- Motion preferences respected

---

## PHASE 4 — ARCHITECT 🏗️

### Tech Stack (2026 Latest)

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | Next.js 15 + React 19 + TypeScript | App Router, Server Components, fastest DX |
| **Styling** | Tailwind CSS 4 + shadcn/ui | Rapid styling, accessible components |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime) | All-in-one, scalable, real-time capable |
| **AI** | Vercel AI SDK + Claude 4 / GPT-5-mini | Streaming, tool calling, agentic features |
| **Maps/Places** | Google Places API + Maps SDK | Best local data, business info |
| **Hosting** | Vercel | Edge functions, auto-scaling |
| **Cache** | Upstash Redis | Rate limiting, session cache |

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL EDGE                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Next.js 15 App Router                  │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │  Pages   │  │   API    │  │  Server  │         │    │
│  │  │ (RSC)    │  │ Routes   │  │ Actions  │         │    │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘         │    │
│  └───────┼─────────────┼─────────────┼───────────────┘    │
└──────────┼─────────────┼─────────────┼────────────────────┘
           │             │             │
           ▼             ▼             ▼
    ┌──────────┐  ┌──────────────┐  ┌─────────────┐
    │ Supabase │  │ Google APIs  │  │  AI Models  │
    │ - Auth   │  │ - Places     │  │ - Claude 4  │
    │ - DB     │  │ - Maps       │  │ - GPT-5     │
    │ - RT     │  │ - Geocoding  │  │             │
    └──────────┘  └──────────────┘  └─────────────┘
           │
           ▼
    ┌──────────────┐
    │ Upstash Redis│
    │ - Cache      │
    │ - Rate Limit │
    └──────────────┘
```

### Core Data Models

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  city TEXT,
  interests TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Businesses
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_place_id TEXT UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  address TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  rating DECIMAL(2,1),
  photo_url TEXT,
  owner_id UUID REFERENCES users(id),
  is_claimed BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  ai_enhanced BOOLEAN DEFAULT FALSE,
  location_name TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  category TEXT,
  image_url TEXT,
  creator_id UUID REFERENCES users(id),
  business_id UUID REFERENCES businesses(id),
  is_promoted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- 'discussion', 'news', 'deal'
  author_id UUID REFERENCES users(id),
  business_id UUID REFERENCES businesses(id),
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSVPs
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  status TEXT CHECK (status IN ('going', 'interested')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Subscriptions (Monetization)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  plan TEXT CHECK (plan IN ('free', 'premium', 'promoted')),
  stripe_subscription_id TEXT,
  status TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Key API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/places/nearby` | Google Places nearby search |
| GET | `/api/places/[id]` | Business details |
| POST | `/api/events` | Create event |
| GET | `/api/events?lat=&lng=` | Events by location |
| POST | `/api/events/[id]/rsvp` | RSVP to event |
| GET | `/api/feed` | AI-curated feed |
| POST | `/api/posts` | Create community post |
| POST | `/api/businesses/claim` | Claim business |
| POST | `/api/ai/enhance` | AI enhance event description |
| GET | `/api/ai/recommendations` | Personalized recommendations |

### Security Model

- **Auth:** Supabase Auth (JWT tokens, Row Level Security)
- **RLS Policies:** Users can only edit own content; businesses editable by owner
- **API Keys:** Server-side only for Google/AI
- **Rate Limiting:** Upstash Redis (100 req/min per user)
- **Input Validation:** Zod schemas on all endpoints
- **CORS:** Restricted to production domain

### Scalability Strategy

- **Edge Caching:** Vercel Edge for static assets
- **Database Indexing:** PostGIS for geo queries
- **Pagination:** Cursor-based for infinite scroll
- **Real-time:** Supabase Realtime for live updates
- **CDN:** Vercel Image Optimization for photos

---

## PHASE 5 — PRODUCT OWNER ✅

### Sprint 1 Scope (Mar 16-19: 3 Days)

**Goal:** Backend MVP + Basic Discovery UI

| Ticket | Story | Points | Priority |
|--------|-------|--------|----------|
| S1-01 | Set up Supabase project + schema | 3 | P0 |
| S1-02 | Implement Google Places API integration | 5 | P0 |
| S1-03 | Build `/api/places/nearby` endpoint | 3 | P0 |
| S1-04 | Build `/api/events` CRUD endpoints | 5 | P0 |
| S1-05 | User auth flow (Google OAuth) | 3 | P0 |
| S1-06 | Location detection + selection UI | 2 | P0 |
| S1-07 | Business feed page (basic) | 3 | P1 |
| S1-08 | Event feed page (basic) | 3 | P1 |
| S1-09 | Event creation form | 3 | P1 |
| S1-10 | AI event description enhancement | 2 | P2 |

**Total Points:** 32
**Velocity Target:** ~10-12 points/day

### Definition of Done

- [ ] Code merged to main
- [ ] TypeScript passes (no `any`)
- [ ] API endpoints return correct responses
- [ ] Database queries use RLS
- [ ] Mobile-responsive UI
- [ ] Tested on Chrome + Safari
- [ ] Environment variables documented

### Definition of Ready

- [ ] Ticket has acceptance criteria
- [ ] Dependencies identified
- [ ] Estimated in story points
- [ ] Design reference (if UI)

### Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Google API costs exceed budget | Medium | High | Implement aggressive caching, free tier limits |
| 3-day timeline too aggressive | High | High | Cut P2 tickets, focus on P0 |
| AI API rate limits | Low | Medium | Queue requests, graceful degradation |
| Location permission denied | Medium | Low | Manual city selection fallback |
| Supabase cold starts | Low | Low | Use connection pooling |

---

## PHASE 6 — DESIGN ARCHITECT 🖌️

### Brand Direction

**Tone:** Warm, energetic, inclusive, local-first
**Vibe:** "Your neighborhood block party in an app"

### Color System

```css
:root {
  /* Primary - Vibrant Coral */
  --color-primary-50: #FFF5F3;
  --color-primary-100: #FFE8E3;
  --color-primary-500: #FF6B4A;  /* Main */
  --color-primary-600: #E85A3A;
  --color-primary-700: #CC4A2D;
  
  /* Secondary - Deep Teal */
  --color-secondary-50: #F0FDFA;
  --color-secondary-500: #14B8A6;  /* Accent */
  --color-secondary-700: #0F766E;
  
  /* Neutral */
  --color-gray-50: #FAFAFA;
  --color-gray-100: #F4F4F5;
  --color-gray-500: #71717A;
  --color-gray-900: #18181B;
  
  /* Semantic */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  
  /* Background */
  --bg-primary: #FFFFFF;
  --bg-secondary: #FAFAFA;
  --bg-card: #FFFFFF;
}
```

### Typography

```css
:root {
  /* Primary: Plus Jakarta Sans - Modern, friendly */
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  /* Scale */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  
  /* Line Height */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### Spacing System

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### Component Specs

**Button:**
- Height: 44px (touch target)
- Padding: 12px 24px
- Radius: 12px
- Font: 14px semibold
- States: default, hover, active, disabled, loading

**Card:**
- Background: white
- Radius: 16px
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Padding: 16px
- Hover: shadow-lg, subtle scale

**Input:**
- Height: 48px
- Radius: 12px
- Border: 1px gray-200
- Focus: ring-2 primary-500
- Label: 12px medium, gray-600

### Motion Guidelines

```css
/* Easing */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);  /* Smooth deceleration */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

/* Duration */
--duration-fast: 150ms;    /* Micro-interactions */
--duration-normal: 300ms;  /* Standard transitions */
--duration-slow: 500ms;    /* Page transitions */

/* When to animate */
- Page transitions: fade + slide
- Cards: scale on hover
- Buttons: scale on press
- Modals: fade + scale from center
- Feed: stagger on load
```

### Design Tokens (Ready for Implementation)

```json
{
  "colors": {
    "primary": "#FF6B4A",
    "secondary": "#14B8A6",
    "background": "#FFFFFF",
    "surface": "#FAFAFA",
    "text": "#18181B",
    "textMuted": "#71717A"
  },
  "radius": {
    "sm": "8px",
    "md": "12px",
    "lg": "16px",
    "xl": "24px",
    "full": "9999px"
  },
  "shadow": {
    "sm": "0 1px 2px rgba(0,0,0,0.05)",
    "md": "0 2px 8px rgba(0,0,0,0.08)",
    "lg": "0 8px 24px rgba(0,0,0,0.12)"
  }
}
```

---

## SPRINT 1 BACKLOG (Priority Order)

### Day 1 (Today - Mar 16): Foundation
- [ ] S1-01: Supabase setup + schema (3 pts)
- [ ] S1-05: Google OAuth auth flow (3 pts)
- [ ] S1-02: Google Places API integration (5 pts)

### Day 2 (Mar 17): Core APIs
- [ ] S1-03: `/api/places/nearby` endpoint (3 pts)
- [ ] S1-04: `/api/events` CRUD (5 pts)
- [ ] S1-06: Location detection UI (2 pts)

### Day 3 (Mar 18): UI + Polish
- [ ] S1-07: Business feed page (3 pts)
- [ ] S1-08: Event feed page (3 pts)
- [ ] S1-09: Event creation form (3 pts)
- [ ] S1-10: AI enhancement (2 pts)

### Day 4 (Mar 19): Launch
- [ ] Testing + bug fixes
- [ ] Deploy to Vercel
- [ ] Basic monitoring setup

---

## SUCCESS CRITERIA (Thursday Mar 19)

✅ User can sign in with Google
✅ User location is detected or manually set
✅ User sees nearby businesses (from Google)
✅ User can create an event
✅ User sees events in their area
✅ AI can enhance event descriptions
✅ App is deployed and accessible
✅ Mobile-responsive design

---

## NEXT STEPS

1. **Dot Com/DaWizKid sign-off** on this blueprint
2. **Set up Supabase project** (I can do this)
3. **Get Google Places API key** (need from you)
4. **Start Sprint 1** — Backend first!

---

*Blueprint generated by Nova 🍑 | BMAD v2.0 | Mar 16, 2026*
