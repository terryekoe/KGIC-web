-- Create podcasts table for sermons/messages audio
CREATE EXTENSION IF NOT EXISTS pgcrypto;

create table if not exists public.podcasts (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  description text,
  artist varchar(100),
  audio_url text not null,
  duration_seconds integer,
  status varchar(20) default 'draft', -- draft, published, archived
  published_at timestamptz,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for common queries
create index if not exists idx_podcasts_status on public.podcasts(status);
create index if not exists idx_podcasts_published_at on public.podcasts(published_at);

-- Reuse or create updated_at trigger function
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_podcasts_updated_at
before update on public.podcasts
for each row execute function public.update_updated_at_column();

-- Seed a few sample episodes
insert into public.podcasts (title, description, artist, audio_url, duration_seconds, status, published_at)
values
  ('Faith Over Fear', 'An encouraging word about trusting God beyond our fears.', 'KGIC', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 1458, 'published', now()),
  ('Walking in Grace', 'Growing in grace in everyday life.', 'KGIC', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 1086, 'published', now() - interval '1 day'),
  ('Hope in Trials', 'Finding hope when life is difficult.', 'KGIC', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', 1971, 'published', now() - interval '5 days')
on conflict do nothing;

-- Enable RLS and policies
alter table if exists public.podcasts enable row level security;

-- Authenticated users: full CRUD
DROP POLICY IF EXISTS "podcasts_select_authenticated" ON public.podcasts;
CREATE POLICY "podcasts_select_authenticated" ON public.podcasts
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "podcasts_insert_authenticated" ON public.podcasts;
CREATE POLICY "podcasts_insert_authenticated" ON public.podcasts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "podcasts_update_authenticated" ON public.podcasts;
CREATE POLICY "podcasts_update_authenticated" ON public.podcasts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "podcasts_delete_authenticated" ON public.podcasts;
CREATE POLICY "podcasts_delete_authenticated" ON public.podcasts
  FOR DELETE
  TO authenticated
  USING (true);

grant all on table public.podcasts to authenticated;
grant all on table public.podcasts to service_role;

-- Anonymous users: read only published (and not scheduled to the future)
drop policy if exists "Allow anonymous read on published podcasts" on public.podcasts;
create policy "Allow anonymous read on published podcasts" on public.podcasts
  for select to anon
  using (status = 'published' and (published_at is null or published_at <= now()));

grant select on table public.podcasts to anon;