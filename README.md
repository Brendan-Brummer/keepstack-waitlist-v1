# KeepStack Waitlist Landing Page

A minimal, trustworthy single-page waitlist landing page for KeepStack - the memory preservation app for parents.

## Features

- **Single-page design** - Content-first responsive layout that feels complete without scrolling
- **Waitlist signup** - Name (optional) and email capture with validation
- **Supabase integration** - Secure waitlist storage with duplicate prevention
- **Resend email** - Automatic confirmation emails and admin notifications
- **Resend Audiences** - Immediate sync for drip campaigns
- **Daily cron sync** - Resilient backup sync for any failed Resend syncs
- **CSRF protection** - Secure form submissions
- **Dark theme** - Obsidian background with KeepStack blue accents
- **Custom typography** - Self-hosted Aeonik (headings) and Suisse Int'l (body)
- **Smooth animations** - Volt gradient effects and micro-interactions
- **Vercel-ready** - Optimized for Vercel deployment with cron jobs

## Tech Stack

- **Nuxt 3** - Vue 3 framework with SSR
- **Tailwind CSS** - Utility-first styling with custom color palette
- **Supabase** - PostgreSQL database for waitlist storage
- **Resend** - Transactional emails and audience management
- **Zod** - Runtime validation
- **TypeScript** - Type-safe development

## Project Structure

```
keepstack-waitlist-lander-v1/
├── app/
│   └── app.vue                    # Root application layout
├── pages/
│   └── index.vue                  # Main landing page
├── components/
│   └── WaitlistForm.vue           # Waitlist form component
├── composables/
│   ├── useSupabase.ts             # Supabase client
│   └── useWaitlist.ts             # Form submission logic
├── server/
│   └── api/
│       ├── waitlist.post.ts       # Signup endpoint
│       └── sync-waitlist.get.ts   # Daily cron sync
├── assets/
│   └── css/
│       └── fonts.css              # Font-face declarations
├── public/
│   └── fonts/                     # Self-hosted font files
│       ├── aeonik/
│       └── suisse/
├── docs/
│   └── plans/
│       └── 2025-11-10-waitlist-landing-page-design.md
├── nuxt.config.ts                 # Nuxt configuration
├── tailwind.config.ts             # Tailwind customization
├── vercel.json                    # Vercel cron configuration
├── .env.example                   # Environment variables template
├── SETUP.md                       # Detailed setup instructions
└── README.md                      # This file
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

See [SETUP.md](./SETUP.md) for detailed configuration instructions.

### 3. Add Font Files

Place your Aeonik and Suisse Int'l font files in:
- `/public/fonts/aeonik/`
- `/public/fonts/suisse/`

See `/public/fonts/README.md` for required file names.

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

Required environment variables (see `.env.example`):

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key (public) |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (private) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_AUDIENCE_ID` | Resend Audience ID for waitlist |
| `ADMIN_EMAIL` | Email to receive signup notifications |
| `CRON_SECRET` | Random secret for cron endpoint security |

## Database Schema

Run this SQL in your Supabase project:

```sql
-- Main waitlist table
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync tracking table
CREATE TABLE sync_pending (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  retry_count INT DEFAULT 0,
  last_attempted TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Obsidian | `#08080a` | Background |
| White | `#ffffff` | Text, elements |
| Blue | `#0201d7` | CTAs, brand |
| Charcoal | `#1e1e26` | Secondary background |
| Indigo | `#6c6e80` | Muted text |
| Volt Gradient | `#0201d7` → `#12e6ff` | Special effects |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

The `vercel.json` configuration includes a cron job that runs daily at 2 AM to sync any failed Resend additions.

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## Design Philosophy

This project follows principles from "A Philosophy of Software Design" by John Ousterhout:

- **Deep modules** - Simple interfaces hiding complex implementations
- **Information hiding** - Implementation details encapsulated in composables
- **Pull complexity down** - Server handles validation, sync logic, error handling
- **General-purpose design** - WaitlistForm component is reusable
- **Define errors out** - Graceful degradation (email failures don't block signups)

## Next Steps

1. **Add branding**
   - Replace `[LOGO PLACEHOLDER]` with your logo
   - Replace `[ICON]` placeholders with actual icons

2. **Customize emails**
   - Edit email templates in `/server/api/waitlist.post.ts`
   - Match your brand voice and tone

3. **Set up email drip campaign**
   - Configure automated emails in Resend Audiences
   - Create welcome sequence, updates, launch reminders

4. **Analytics**
   - Add Google Analytics, Plausible, or similar
   - Track form submissions, conversion rates

5. **SEO**
   - Add OG image for social sharing
   - Optimize meta descriptions
   - Set up proper redirects

6. **Testing**
   - Test form submission end-to-end
   - Verify emails are being sent
   - Check Resend Audience sync
   - Test cron job manually

## License

Private - KeepStack

## Support

For setup help, see [SETUP.md](./SETUP.md)

For design decisions, see [docs/plans/2025-11-10-waitlist-landing-page-design.md](./docs/plans/2025-11-10-waitlist-landing-page-design.md)
