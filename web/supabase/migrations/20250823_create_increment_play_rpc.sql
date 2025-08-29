-- RPC to atomically increment play_count for a podcast row
create or replace function public.increment_podcast_play_count(p_id uuid)
returns void
security definer
set search_path = public
language plpgsql
as $$
begin
  update public.podcasts
  set play_count = coalesce(play_count, 0) + 1
  where id = p_id;
end;
$$;

-- Allow calls from anon/authenticated; function runs with definer privileges
grant execute on function public.increment_podcast_play_count(uuid) to anon, authenticated, service_role;