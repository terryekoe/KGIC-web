# KGIC Web

A modern Next.js 15 application for The King's Generals International Church (KGIC), featuring podcasts, morning prayers, events, ministries, and more. Built with React, TypeScript, TailwindCSS, and Supabase.

## Tech Stack
- Next.js 15 (App Router, Turbopack)
- React 18 with TypeScript
- Tailwind CSS
- Supabase (Database, Storage, Auth)
- i18n with JSON locale files (en, fr, es)
- Vercel-ready configuration

## Local Development

1. Prerequisites
   - Node.js 18+
   - Supabase project with the following env set in `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Install and run
   ```bash
   cd web
   npm install
   npm run dev
   ```
   Dev server will start on an available port (commonly 3000/3001).

## Supabase Schema (Podcasts)
- Table: `public.podcasts`
- Important columns: `id`, `title`, `artist`, `audio_url`, `duration_seconds`, `status`, `published_at`, `description`, `image_url`
- RLS: Anonymous read access only for `status = 'published'` and `published_at <= now()`; authenticated users have full CRUD.

## What we fixed in this session

- Podcasts page not showing episodes:
  - Standardized the Supabase query to match deployed schema and removed `play_count` from the select list to avoid column mismatch when migrations haven’t yet run everywhere.
  - Ensured episodes are queried by `status = 'published'` and ordered by `published_at`.
- Sidebar translation errors on podcasts page:
  - Aligned translation keys with the English locale file: `filters.date`, `filters.duration`, `filters.durationAll`, `filters.short|medium|long`, etc.
  - Replaced a missing mobile drawer "Apply" translation with a safe "Close" label to prevent undefined key rendering.
- UX polish:
  - Kept filters visible even when no results, and moved the empty-state messaging into the results area.

## Current status
- Homepage: latest podcast and other sections load.
- Podcasts page: episodes list renders; filters and search work. Audio URLs must be reachable; if a storage object is private or missing CORS/public access, the browser will block playback.

## Known issues / Next steps
- Audio files returning `net::ERR_ABORTED` indicate the referenced storage object is missing or not publicly accessible. Ensure Supabase Storage bucket `podcasts` is public or signed URLs are used.
- Optional column `play_count` exists in a later migration; if needed in UI, ensure the migration has run in the target environment before selecting it.
- Visual: Consider showing the banner microphone illustration on smaller screens as needed.
- Tests and CI: Add minimal e2e (Playwright) to verify podcasts list and filters.

## Deployment
- Vercel: Set project to build from `web` folder.
- Environment variables: add supabase URL/anon key to Vercel project settings.

## Contributing
- Use conventional commits.
- Keep locales (en, fr, es) in sync when adding new UI text.