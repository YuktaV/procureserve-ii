-- Create storage bucket for business documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-documents', 'business-documents', false);

-- Set up RLS policies for business documents bucket
CREATE POLICY "Business documents upload access"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'business-documents' AND auth.uid()::text = (storage.foldername(name))[2]);

CREATE POLICY "Business documents read access"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'business-documents' AND auth.uid()::text = (storage.foldername(name))[2]);

CREATE POLICY "Business documents delete access"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'business-documents' AND auth.uid()::text = (storage.foldername(name))[2]);
