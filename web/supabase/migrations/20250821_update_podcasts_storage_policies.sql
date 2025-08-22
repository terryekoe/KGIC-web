-- Ensure the podcasts bucket exists and is public
insert into storage.buckets (id, name, public)
values ('podcasts', 'podcasts', true)
on conflict (id) do update set public = excluded.public;

-- Allow public read access to objects in the podcasts bucket (useful for listing/downloading via client)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public read for podcasts" ON storage.objects;
  CREATE POLICY "Public read for podcasts"
  ON storage.objects
  FOR SELECT
  TO public
  USING (
    bucket_id = 'podcasts'
  );
END $$;

-- Allow authenticated users to upload (insert) into the podcasts bucket (any path)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Authenticated uploads to podcasts" ON storage.objects;
  CREATE POLICY "Authenticated uploads to podcasts"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'podcasts'
  );
END $$;