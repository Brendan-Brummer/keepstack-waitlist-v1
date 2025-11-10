# KeepStack Waitlist Landing Page - Setup Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Resend account
- Font files (Aeonik and Suisse Int'l)

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Supabase

### Create Project
1. Go to [Supabase](https://app.supabase.com)
2. Create a new project

### Create Database Tables

Run this SQL in the Supabase SQL Editor:

```sql
-- Main waitlist table
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);

-- Sync tracking table for resilience
CREATE TABLE sync_pending (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  retry_count INT DEFAULT 0,
  last_attempted TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster pending sync queries
CREATE INDEX idx_sync_pending_retry ON sync_pending(retry_count);
```

### Get API Keys
1. Go to Project Settings → API
2. Copy `URL` → This is your `SUPABASE_URL`
3. Copy `anon public` key → This is your `SUPABASE_ANON_KEY`
4. Copy `service_role` key → This is your `SUPABASE_SERVICE_KEY` (keep this secret!)

## 3. Set Up Resend

### Get API Key
1. Go to [Resend](https://resend.com)
2. Navigate to API Keys
3. Create a new API key → This is your `RESEND_API_KEY`

### Create Audience
1. Go to Audiences in Resend
2. Create a new audience (e.g., "KeepStack Waitlist")
3. Copy the Audience ID → This is your `RESEND_AUDIENCE_ID`

### Verify Domain (Important!)
1. Go to Domains in Resend
2. Add your domain (e.g., `keepstack.com`)
3. Add the DNS records provided by Resend
4. Wait for verification
5. Update the email `from` addresses in `/server/api/waitlist.post.ts` to use your verified domain

## 4. Add Font Files

Place your font files in the following directories:

### Aeonik
- `/public/fonts/aeonik/Aeonik-Regular.woff2`
- `/public/fonts/aeonik/Aeonik-Medium.woff2`
- `/public/fonts/aeonik/Aeonik-Bold.woff2`

### Suisse Int'l
- `/public/fonts/suisse/SuisseIntl-Regular.woff2`
- `/public/fonts/suisse/SuisseIntl-Medium.woff2`

**Note:** Font files should be in `.woff2` format for optimal performance.

## 5. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_KEY=eyJ...
   RESEND_API_KEY=re_...
   RESEND_AUDIENCE_ID=aud_...
   ADMIN_EMAIL=you@keepstack.com
   CRON_SECRET=generate-random-secret-here
   ```

3. Generate a random CRON_SECRET:
   ```bash
   openssl rand -base64 32
   ```

## 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your landing page!

## 7. Deploy to Vercel

### Prerequisites
- GitHub repository with your code
- Vercel account

### Steps

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. Connect to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Nuxt 3

3. Add Environment Variables:
   - In Vercel project settings → Environment Variables
   - Add all variables from your `.env` file
   - Make sure to add them for Production, Preview, and Development

4. Configure Cron Job:
   - Vercel will automatically detect `vercel.json`
   - The daily sync cron will run at 2 AM daily
   - Add the `CRON_SECRET` in the cron request headers (Vercel does this automatically)

5. Deploy:
   ```bash
   vercel --prod
   ```

### After Deployment

1. Test the waitlist form
2. Check that emails are being sent
3. Verify Resend Audience sync
4. Monitor cron job logs in Vercel

## Troubleshooting

### Emails Not Sending
- Verify your domain in Resend
- Check that `from` addresses use your verified domain
- Review Resend logs for errors

### CSRF Errors
- Make sure `nuxt-csurf` is installed
- Check that cookies are enabled in your browser
- Verify HTTPS is enabled in production

### Font Not Loading
- Verify font files are in correct directories
- Check file names match exactly in `assets/css/fonts.css`
- Clear browser cache

### Cron Job Not Running
- Verify `vercel.json` is in root directory
- Check Vercel logs for cron execution
- Verify `CRON_SECRET` is set correctly in environment variables

## Next Steps

1. Add your logo (replace `[LOGO PLACEHOLDER]`)
2. Add icons for value props (replace `[ICON]`)
3. Customize email templates in `/server/api/waitlist.post.ts`
4. Set up email drip campaign in Resend Audiences
5. Add analytics (Google Analytics, Plausible, etc.)
6. Create OG image for social sharing

## Support

For issues or questions, refer to:
- [Nuxt 3 Docs](https://nuxt.com)
- [Supabase Docs](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Vercel Docs](https://vercel.com/docs)
