-- Feature Request System Tables & RLS

-- 1. Feature Requests Table
CREATE TABLE IF NOT EXISTS public.feature_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL CHECK (char_length(title) >= 3),
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'planned', 'completed', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;

-- Policies for Feature Requests
-- Everyone can read
CREATE POLICY "Everyone can view feature requests" 
ON public.feature_requests FOR SELECT 
USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can create feature requests" 
ON public.feature_requests FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Only admins can update status (For now, we'll allow owners to update their own title/desc effectively if we wanted, but sticking to admin-only for simplicity or matching the plan. 
-- Actually, the user might want to edit their own request. Let's start with proper Admin checks later, for now we will assume only the author can edit content, or no one.)
-- Let's stick to: Author can update their own request content.
CREATE POLICY "Users can update their own feature requests" 
ON public.feature_requests FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Feature Votes Table
CREATE TABLE IF NOT EXISTS public.feature_votes (
    feature_id UUID REFERENCES public.feature_requests(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (feature_id, user_id)
);

-- Enable RLS
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;

-- Policies for Feature Votes
-- Everyone can read votes (to count them)
CREATE POLICY "Everyone can view votes" 
ON public.feature_votes FOR SELECT 
USING (true);

-- Authenticated users can vote (insert)
CREATE POLICY "Authenticated users can vote" 
ON public.feature_votes FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Authenticated users can unvote (delete)
CREATE POLICY "Authenticated users can remove their vote" 
ON public.feature_votes FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_feature_requests_status ON public.feature_requests(status);
CREATE INDEX IF NOT EXISTS idx_feature_votes_feature_id ON public.feature_votes(feature_id);

-- 4. Helper function to count votes (Optional, but useful for sorting if not doing it in app)
-- Simple view or just querying the count in the app is fine. 
-- We will stick to app-side counting or a view if needed later.
