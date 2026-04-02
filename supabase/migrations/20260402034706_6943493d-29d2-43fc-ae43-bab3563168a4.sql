
-- Awards table
CREATE TABLE public.awards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    organization text NOT NULL DEFAULT '',
    year text NOT NULL DEFAULT '',
    description text NOT NULL DEFAULT '',
    image_url text DEFAULT '',
    gallery jsonb DEFAULT '[]'::jsonb
);

ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read awards" ON public.awards FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert awards" ON public.awards FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update awards" ON public.awards FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete awards" ON public.awards FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Photography table
CREATE TABLE public.photography (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    location text NOT NULL DEFAULT '',
    year text NOT NULL DEFAULT '',
    camera text NOT NULL DEFAULT '',
    image_url text DEFAULT '',
    description text NOT NULL DEFAULT ''
);

ALTER TABLE public.photography ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read photography" ON public.photography FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert photography" ON public.photography FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update photography" ON public.photography FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete photography" ON public.photography FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for award/photo images
INSERT INTO storage.buckets (id, name, public) VALUES ('award-images', 'award-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('photo-images', 'photo-images', true);

CREATE POLICY "Anyone can view award images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'award-images');
CREATE POLICY "Admins can upload award images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'award-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete award images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'award-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view photo images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'photo-images');
CREATE POLICY "Admins can upload photo images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'photo-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete photo images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'photo-images' AND public.has_role(auth.uid(), 'admin'));
