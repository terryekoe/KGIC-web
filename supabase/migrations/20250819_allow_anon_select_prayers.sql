-- Allow anonymous users to read published prayers
-- This policy ensures the public website can display Morning Prayers without requiring sign-in

-- Make sure RLS is enabled (no-op if already enabled)
alter table if exists public.prayers enable row level security;

-- Ensure anon role has SELECT privilege in addition to RLS policy
grant select on table public.prayers to anon;

-- Replace the policy if it already exists
drop policy if exists "Allow anonymous read on published prayers" on public.prayers;
create policy "Allow anonymous read on published prayers"
  on public.prayers
  for select
  to anon
  using (status = 'published');