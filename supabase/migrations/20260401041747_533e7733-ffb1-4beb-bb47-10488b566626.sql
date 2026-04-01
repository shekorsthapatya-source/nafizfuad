
CREATE TABLE public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text NOT NULL DEFAULT '',
    long_description text DEFAULT '',
    location text NOT NULL DEFAULT '',
    year text NOT NULL DEFAULT '',
    status text DEFAULT '',
    category text NOT NULL DEFAULT '',
    size text DEFAULT '',
    image_url text DEFAULT '',
    gallery jsonb DEFAULT '[]'::jsonb,
    credits jsonb DEFAULT '[]'::jsonb
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Anyone can read projects (public portfolio)
CREATE POLICY "Anyone can read projects"
ON public.projects FOR SELECT TO anon, authenticated
USING (true);

-- Only admins can insert projects
CREATE POLICY "Admins can insert projects"
ON public.projects FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update projects
CREATE POLICY "Admins can update projects"
ON public.projects FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete projects
CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
