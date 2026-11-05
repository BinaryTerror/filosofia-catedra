-- Executar no SQL Editor do Supabase. Não altera as antigas tabelas cms/Payload.
BEGIN;
CREATE TABLE IF NOT EXISTS public.catedra_admins (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS public.catedra_posts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 160),
 summary text NOT NULL CHECK (length(trim(summary)) BETWEEN 1 AND 300),
 body text NOT NULL CHECK (length(trim(body)) BETWEEN 1 AND 50000),
 category text NOT NULL DEFAULT 'noticias' CHECK (category IN ('noticias','reflexoes','actividades','publicacoes')),
 cover_path text NOT NULL CHECK (length(cover_path)>0),
 cover_alt text NOT NULL CHECK (length(trim(cover_alt)) BETWEEN 1 AND 300),
 published boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS catedra_posts_public_date ON public.catedra_posts (published,created_at DESC);
ALTER TABLE public.catedra_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catedra_posts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.catedra_admins FROM anon, authenticated;
GRANT SELECT ON public.catedra_admins TO authenticated;
REVOKE ALL ON public.catedra_posts FROM anon, authenticated;
GRANT SELECT ON public.catedra_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.catedra_posts TO authenticated;
DROP POLICY IF EXISTS catedra_admin_self ON public.catedra_admins;
CREATE POLICY catedra_admin_self ON public.catedra_admins FOR SELECT TO authenticated
 USING (user_id=(SELECT auth.uid()));
DROP POLICY IF EXISTS catedra_read_public ON public.catedra_posts;
CREATE POLICY catedra_read_public ON public.catedra_posts FOR SELECT TO anon,authenticated USING (published=true);
DROP POLICY IF EXISTS catedra_admin_read ON public.catedra_posts;
CREATE POLICY catedra_admin_read ON public.catedra_posts FOR SELECT TO authenticated
 USING (EXISTS (SELECT 1 FROM public.catedra_admins WHERE user_id=(SELECT auth.uid())));
DROP POLICY IF EXISTS catedra_admin_insert ON public.catedra_posts;
CREATE POLICY catedra_admin_insert ON public.catedra_posts FOR INSERT TO authenticated
 WITH CHECK (EXISTS (SELECT 1 FROM public.catedra_admins WHERE user_id=(SELECT auth.uid())));
DROP POLICY IF EXISTS catedra_admin_update ON public.catedra_posts;
CREATE POLICY catedra_admin_update ON public.catedra_posts FOR UPDATE TO authenticated
 USING (EXISTS (SELECT 1 FROM public.catedra_admins WHERE user_id=(SELECT auth.uid())))
 WITH CHECK (EXISTS (SELECT 1 FROM public.catedra_admins WHERE user_id=(SELECT auth.uid())));
DROP POLICY IF EXISTS catedra_admin_delete ON public.catedra_posts;
CREATE POLICY catedra_admin_delete ON public.catedra_posts FOR DELETE TO authenticated
 USING (EXISTS (SELECT 1 FROM public.catedra_admins WHERE user_id=(SELECT auth.uid())));
CREATE OR REPLACE FUNCTION public.catedra_stamp_updated() RETURNS trigger LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
 NEW.updated_at=clock_timestamp();
 NEW.created_at=OLD.created_at;
 NEW.slug=OLD.slug;
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS catedra_stamp ON public.catedra_posts;
CREATE TRIGGER catedra_stamp BEFORE UPDATE ON public.catedra_posts FOR EACH ROW EXECUTE FUNCTION public.catedra_stamp_updated();
-- Bucket novo, separado do catedra-media usado pelo Payload antigo.
INSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
 VALUES ('catedra-site','catedra-site',true,10485760,ARRAY['image/jpeg','image/png','image/webp'])
 ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS catedra_media_insert ON storage.objects;
CREATE POLICY catedra_media_insert ON storage.objects FOR INSERT TO authenticated
 WITH CHECK (bucket_id='catedra-site' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text
 AND EXISTS (SELECT 1 FROM public.catedra_admins WHERE user_id=(SELECT auth.uid())));
DROP POLICY IF EXISTS catedra_media_read ON storage.objects;
CREATE POLICY catedra_media_read ON storage.objects FOR SELECT TO authenticated
 USING (bucket_id='catedra-site' AND EXISTS (SELECT 1 FROM public.catedra_admins WHERE user_id=(SELECT auth.uid())));
DROP POLICY IF EXISTS catedra_media_delete ON storage.objects;
CREATE POLICY catedra_media_delete ON storage.objects FOR DELETE TO authenticated
 USING (bucket_id='catedra-site' AND EXISTS (SELECT 1 FROM public.catedra_admins WHERE user_id=(SELECT auth.uid())));
COMMIT;
-- DEPOIS: Authentication > Users > Add user > Create new user, com email confirmado.
-- Copiar o UUID da conta e executar separadamente:
-- INSERT INTO public.catedra_admins(user_id) VALUES ('UUID-REAL-DA-CONTA') ON CONFLICT DO NOTHING;
