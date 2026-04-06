
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS position integer DEFAULT 0;
ALTER TABLE public.awards ADD COLUMN IF NOT EXISTS position integer DEFAULT 0;
ALTER TABLE public.photography ADD COLUMN IF NOT EXISTS position integer DEFAULT 0;
