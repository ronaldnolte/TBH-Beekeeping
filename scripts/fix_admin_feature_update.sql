-- FIX: Allow admins to update any feature request status
-- Run this in the Dev Supabase SQL Editor

-- First, drop the restrictive policy
DROP POLICY IF EXISTS "Users can update their own feature requests" ON public.feature_requests;

-- Create policy for users to update their own
CREATE POLICY "Users can update their own feature requests" 
ON public.feature_requests FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy for admins to update any request
CREATE POLICY "Admins can update any feature request" 
ON public.feature_requests FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'
    )
);
