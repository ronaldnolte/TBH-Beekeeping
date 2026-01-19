-- FIX PERMISSIONS SCRIPT
-- Run this in your Supabase SQL Editor to fix "Permission Denied" errors.

-- 1. Grant usage permissions to all roles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.feature_requests TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.feature_votes TO postgres, anon, authenticated, service_role;

-- 2. Reset and Re-apply RLS Policies (Idempotent)

-- FEATURE REQUESTS
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view feature requests" ON public.feature_requests;
CREATE POLICY "Everyone can view feature requests" 
ON public.feature_requests FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can create feature requests" ON public.feature_requests;
CREATE POLICY "Authenticated users can create feature requests" 
ON public.feature_requests FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own feature requests" ON public.feature_requests;
CREATE POLICY "Users can update their own feature requests" 
ON public.feature_requests FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- FEATURE VOTES
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view votes" ON public.feature_votes;
CREATE POLICY "Everyone can view votes" 
ON public.feature_votes FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can vote" ON public.feature_votes;
CREATE POLICY "Authenticated users can vote" 
ON public.feature_votes FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can remove their vote" ON public.feature_votes;
CREATE POLICY "Authenticated users can remove their vote" 
ON public.feature_votes FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
