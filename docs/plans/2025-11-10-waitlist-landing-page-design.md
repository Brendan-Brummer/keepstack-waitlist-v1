# KeepStack Waitlist Landing Page - Design Document

**Date:** 2025-11-10
**Status:** Approved for Implementation

## Overview

Single-page, no-scroll landing page for KeepStack waitlist. Minimal, trustworthy design focused on capturing signups with immediate Resend Audience sync.

## Goals

1. Capture waitlist signups (name optional, email required)
2. Sync emails to Resend Audiences for drip campaigns
3. Send confirmation + admin notification emails
4. Feel complete and trustworthy without scrolling
5. Vercel-ready deployment

## Tech Stack

- **Frontend:** Nuxt 3, Vue 3, Tailwind CSS
- **Backend:** Nuxt server API routes
- **Database:** Supabase
- **Email:** Resend (transactional + audiences)
- **Security:** Nuxt CSRF module
- **Deployment:** Vercel with cron jobs

## Color Palette

```
Obsidian (backgrounds): #08080a
White (text/elements): #ffffff
Blue (main/CTAs): #0201d7
Charcoal (secondary): #1e1e26
Indigo (muted text): #6c6e80
Volt Gradient: #0201d7 → #12e6ff
```

## Typography

- **Primary (Headings):** Aeonik (self-hosted)
- **Secondary (Body):** Suisse Int'l (self-hosted)
- **Scale:** Fluid sizing using clamp() for responsive text

## Page Content

### Hero Section
- **Headline:** Stack memories, keep them forever.
- **Subheadline:** The only photo app that guarantees your family's memories will be accessible in 18 years—even if we're not.
- **Logo:** [LOGO PLACEHOLDER]

### Value Props (3 Columns)

1. **Permanent Storage**
   Your photos backed up across multiple tiers with blockchain timestamps. Delete-proof by design.

2. **3-Second Capture**
   Voice notes, photos, moments—captured faster than a text. Built for playground speed.

3. **Always Exportable**
   One-click download of everything. A promise we literally cannot break, enforced by code.

### Waitlist Form
- **Title:** Be first to preserve what matters
- **Fields:** Name (optional), Email (required)
- **Button:** Join Waitlist
- **Privacy:** We'll only email about KeepStack. No spam, ever.
- **Success:** You're in! We'll notify you when we launch.

### Trust Signal
"Built by parents who've lost photos to dead apps"

## Architecture

### File Structure
```
keepstack-waitlist-lander-v1/
├── nuxt.config.ts
├── tailwind.config.ts
├── app.vue
├── pages/
│   └── index.vue
├── components/
│   └── WaitlistForm.vue
├── composables/
│   ├── useSupabase.ts
│   └── useWaitlist.ts
├── server/
│   └── api/
│       ├── waitlist.post.ts
│       └── sync-waitlist.get.ts
├── public/
│   └── fonts/
│       ├── aeonik/
│       └── suisse/
└── assets/
    └── css/
        └── fonts.css
```

### Data Flow

**User Signup:**
1. Client-side validation (email format, required)
2. POST to `/api/waitlist` with CSRF token
3. Server validates CSRF + input (Zod schema)
4. Insert into Supabase `waitlist` table
5. If successful → Sync to Resend Audience
6. Send confirmation email to user
7. Send admin notification
8. Return success to client
9. Show success message

**Error Handling:**
- Supabase fails → Show error, user retries
- Resend sync fails → Log to `sync_pending`, user sees success
- Email fails → Log warning, user sees success (non-critical)

**Daily Sync (Resilience):**
- Vercel cron hits `/api/sync-waitlist` at 2 AM daily
- Protected by `CRON_SECRET` header
- Syncs any pending emails to Resend
- Retries failed syncs

### Database Schema

```sql
-- Main waitlist
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync tracking (for resilience)
CREATE TABLE sync_pending (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  retry_count INT DEFAULT 0,
  last_attempted TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## UI Design

### Responsive Strategy

**Mobile (< 768px):**
- Stack all sections vertically
- Smaller headline (clamp ~2rem)
- Full-width inputs, large touch targets (44px min)
- 1rem padding

**Tablet (768px - 1024px):**
- Value props: 2-3 columns
- Medium sizing
- 1.5rem padding

**Desktop (> 1024px):**
- Value props: 3 equal columns
- Full-scale typography
- Max-width 1200px container
- 3rem+ section spacing

### Layout Approach
- Content-first sizing (not fixed viewport percentages)
- Feels complete at all breakpoints
- Allow natural scroll if needed
- No horizontal scroll ever

### Animations

**Volt Gradient:**
```css
background: linear-gradient(90deg, #0201d7, #12e6ff, #0201d7);
background-size: 200% 100%;
animation: gradient-shift 8s ease infinite;
```

**Form Interactions:**
- Input focus: Blue ring, subtle scale (1.01)
- Button hover: Brightness increase + volt gradient
- Button active: Scale down (0.98)
- Loading: Pulse spinner
- Success: Fade out form, fade in message with checkmark bounce

**Page Load:**
- Subtle staggered fade-ins on hero
- Value props fade in on view
- Minimal, trustworthy feel (not flashy)

**Performance:**
- CSS transforms only
- Sparing `will-change` usage
- `prefers-reduced-motion` support

## Security

1. **CSRF Protection:** Nuxt CSRF module
2. **Input Validation:** Zod schemas on server
3. **Email Privacy:** Unique constraint, no public query API
4. **Cron Security:** `CRON_SECRET` header protection
5. **Rate Limiting:** Not implemented initially (add if needed)

## Environment Variables

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
ADMIN_EMAIL=
CRON_SECRET=
```

## Deployment

**Platform:** Vercel

**Vercel Config:**
```json
{
  "crons": [{
    "path": "/api/sync-waitlist",
    "schedule": "0 2 * * *"
  }]
}
```

## SEO

```html
<title>KeepStack - Stack memories, keep them forever</title>
<meta name="description" content="The only photo app that guarantees your family's memories will be accessible in 18 years—even if we're not.">
<meta property="og:image" content="/og-image.png">
```

## Design Principles Applied

Following "A Philosophy of Software Design":

- **Deep modules:** Composables hide complexity (Supabase, Resend logic)
- **Information hiding:** API routes encapsulate sync logic
- **General-purpose:** WaitlistForm component reusable
- **Pull complexity down:** Form component handles state, parent just uses it
- **Define errors out:** Graceful degradation (email fails don't block signup)

## Implementation Notes

- Start simple, iterate if needed
- No rate limiting initially
- Daily cron is backup, not primary sync mechanism
- Content-first responsive (not viewport-percentage-based)
- Premium fonts self-hosted for performance and privacy
