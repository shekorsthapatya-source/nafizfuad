CREATE POLICY "Anyone can read contact messages"
  ON public.contact_messages
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can delete contact messages"
  ON public.contact_messages
  FOR DELETE
  TO anon, authenticated
  USING (true);