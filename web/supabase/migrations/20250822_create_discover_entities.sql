-- Discover entities: announcements, ministries, small_groups
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid primary key default gen_random_uuid(),
  title varchar(200) not null,
  body text,
  link_url text,
  pinned boolean default false,
  status varchar(20) default 'draft', -- draft, published, archived
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_status ON public.announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_time ON public.announcements(starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned ON public.announcements(pinned);

-- Ministries
CREATE TABLE IF NOT EXISTS public.ministries (
  id uuid primary key default gen_random_uuid(),
  name varchar(120) not null,
  short_desc text,
  contact_link text,
  status varchar(20) default 'active', -- active, hidden
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS idx_ministries_status ON public.ministries(status);

-- Small Groups
CREATE TABLE IF NOT EXISTS public.small_groups (
  id uuid primary key default gen_random_uuid(),
  name varchar(120) not null,
  schedule varchar(120), -- e.g. Thursdays 7pm
  contact_link text,
  location text,
  status varchar(20) default 'active', -- active, hidden
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS idx_small_groups_status ON public.small_groups(status);

-- updated_at trigger (reuse)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ministries_updated_at
BEFORE UPDATE ON public.ministries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_small_groups_updated_at
BEFORE UPDATE ON public.small_groups
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed sample data
INSERT INTO public.announcements (title, body, link_url, pinned, status, starts_at)
VALUES
  ('Baptism Class – Register', 'Baptism class begins next month. Sign up at the Welcome Desk or online.', '/contact', true, 'published', now()),
  ('Volunteer Training', 'Training for new volunteers this Saturday 10am in Main Hall.', '/contact', false, 'published', now())
ON CONFLICT DO NOTHING;

INSERT INTO public.ministries (name, short_desc, contact_link)
VALUES
  ('Worship Team', 'Serve in music and production.', '/contact'),
  ('Kids Ministry', 'Invest in the next generation.', '/contact'),
  ('Hospitality', 'Create a welcoming environment.', '/contact'),
  ('Outreach', 'Love our community practically.', '/contact')
ON CONFLICT DO NOTHING;

INSERT INTO public.small_groups (name, schedule, contact_link, location)
VALUES
  ('Young Adults', 'Thursdays 7pm', '/contact', 'KGIC Campus'),
  ('Families', 'Saturdays 5pm', '/contact', 'Offsite'),
  ('Men''s Study', 'Wednesdays 6:30am', '/contact', 'Cafe'),
  ('Women''s Gathering', 'Tuesdays 7pm', '/contact', 'Room 3')
ON CONFLICT DO NOTHING;

-- RLS and policies
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.small_groups ENABLE ROW LEVEL SECURITY;

-- Authenticated: full CRUD
DO $$ BEGIN
  -- Announcements
  DROP POLICY IF EXISTS announcements_select_authenticated ON public.announcements;
  CREATE POLICY announcements_select_authenticated ON public.announcements FOR SELECT TO authenticated USING (true);
  DROP POLICY IF EXISTS announcements_insert_authenticated ON public.announcements;
  CREATE POLICY announcements_insert_authenticated ON public.announcements FOR INSERT TO authenticated WITH CHECK (true);
  DROP POLICY IF EXISTS announcements_update_authenticated ON public.announcements;
  CREATE POLICY announcements_update_authenticated ON public.announcements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS announcements_delete_authenticated ON public.announcements;
  CREATE POLICY announcements_delete_authenticated ON public.announcements FOR DELETE TO authenticated USING (true);

  -- Ministries
  DROP POLICY IF EXISTS ministries_select_authenticated ON public.ministries;
  CREATE POLICY ministries_select_authenticated ON public.ministries FOR SELECT TO authenticated USING (true);
  DROP POLICY IF EXISTS ministries_insert_authenticated ON public.ministries;
  CREATE POLICY ministries_insert_authenticated ON public.ministries FOR INSERT TO authenticated WITH CHECK (true);
  DROP POLICY IF EXISTS ministries_update_authenticated ON public.ministries;
  CREATE POLICY ministries_update_authenticated ON public.ministries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS ministries_delete_authenticated ON public.ministries;
  CREATE POLICY ministries_delete_authenticated ON public.ministries FOR DELETE TO authenticated USING (true);

  -- Small Groups
  DROP POLICY IF EXISTS small_groups_select_authenticated ON public.small_groups;
  CREATE POLICY small_groups_select_authenticated ON public.small_groups FOR SELECT TO authenticated USING (true);
  DROP POLICY IF EXISTS small_groups_insert_authenticated ON public.small_groups;
  CREATE POLICY small_groups_insert_authenticated ON public.small_groups FOR INSERT TO authenticated WITH CHECK (true);
  DROP POLICY IF EXISTS small_groups_update_authenticated ON public.small_groups;
  CREATE POLICY small_groups_update_authenticated ON public.small_groups FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  DROP POLICY IF EXISTS small_groups_delete_authenticated ON public.small_groups;
  CREATE POLICY small_groups_delete_authenticated ON public.small_groups FOR DELETE TO authenticated USING (true);
END $$;

GRANT ALL ON TABLE public.announcements TO authenticated;
GRANT ALL ON TABLE public.ministries TO authenticated;
GRANT ALL ON TABLE public.small_groups TO authenticated;
GRANT ALL ON TABLE public.announcements TO service_role;
GRANT ALL ON TABLE public.ministries TO service_role;
GRANT ALL ON TABLE public.small_groups TO service_role;

-- Anonymous: read only published/active and within time window for announcements
DO $$ BEGIN
  DROP POLICY IF EXISTS announcements_select_anon ON public.announcements;
  CREATE POLICY announcements_select_anon ON public.announcements
    FOR SELECT TO anon
    USING (
      status = 'published' AND (
        starts_at IS NULL OR starts_at <= now()
      ) AND (
        ends_at IS NULL OR ends_at >= now()
      )
    );

  DROP POLICY IF EXISTS ministries_select_anon ON public.ministries;
  CREATE POLICY ministries_select_anon ON public.ministries
    FOR SELECT TO anon
    USING (status = 'active');

  DROP POLICY IF EXISTS small_groups_select_anon ON public.small_groups;
  CREATE POLICY small_groups_select_anon ON public.small_groups
    FOR SELECT TO anon
    USING (status = 'active');
END $$;

GRANT SELECT ON TABLE public.announcements TO anon;
GRANT SELECT ON TABLE public.ministries TO anon;
GRANT SELECT ON TABLE public.small_groups TO anon;