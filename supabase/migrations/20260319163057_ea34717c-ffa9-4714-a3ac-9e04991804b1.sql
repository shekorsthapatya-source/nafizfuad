-- Tighten RLS: only authenticated users can read/delete
DROP POLICY IF EXISTS "Anyone can read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can delete contact messages" ON public.contact_messages;

CREATE POLICY "Authenticated users can read contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete contact messages"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (true);