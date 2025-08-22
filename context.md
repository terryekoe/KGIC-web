# Project Context: Church Web App (Podcasts, Morning Prayers, Events)

## Goal
Build a modern web application for a church that showcases:
- Daily morning prayers
- Podcasts (with playback and downloads)
- Upcoming events (with calendar-style display)

The site should feel **bold, modern, and minimalistic**, inspired by **Uber’s branding style**.

## Design Guidelines
- **Colors**: 
  - Primary: Black (#000000)
  - Text: White (#FFFFFF)
  - Accent: Uber Yellow (#FFC043) or Uber Green (#06C167)
- **Typography**: Use Inter or Manrope (Google Fonts). Bold for headers, clean sans-serif for body.
- **Style**: Large typography, strong contrasts, clean grids, rounded corners, soft shadows.

## Core Features
1. **Morning Prayers**
   - Daily prayer section
   - Ability to schedule posts
   - Optional push notifications

2. **Podcasts**
   - Audio player embedded per episode
   - Download option
   - RSS feed integration for Spotify/Apple

3. **Events**
   - Showcase upcoming church events
   - Event cards with date, time, location, and RSVP link
   - Calendar-style view or vertical timeline

4. **General Pages**
   - Home (Hero + Highlights)
   - About the Church
   - Contact

## Tech Stack
- **Frontend**: Next.js (React), TailwindCSS, shadcn/ui
- **Backend**: Supabase (Postgres DB, Auth, Storage)
- **CMS (optional)**: Sanity or Strapi
- **Deployment**: Vercel (frontend), Supabase Cloud (backend)

## User Flow
- Landing page → Highlights morning prayer of the day
- Navigation → Podcasts, Events, About, Contact
- Users can stream/download podcasts
- Users can see upcoming events and RSVP

## Stretch Features
- Push notifications for daily morning prayer
- Podcast playlist & categories
- Integration with YouTube/Facebook Live for sermons
- Mobile-first design with fast loading

## Deliverables
- Fully functional responsive web app
- Dark theme with Uber-inspired color scheme
- Admin-friendly content management (via Supabase dashboard or CMS)
