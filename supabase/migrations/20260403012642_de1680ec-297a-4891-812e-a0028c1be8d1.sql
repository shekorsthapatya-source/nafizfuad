
CREATE POLICY "Admins can update award images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'award-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update photo images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'photo-images' AND public.has_role(auth.uid(), 'admin'::app_role));
