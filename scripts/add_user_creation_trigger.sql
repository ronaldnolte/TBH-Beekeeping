-- =====================================================
-- AUTO-CREATE USER RECORD ON SIGNUP
-- =====================================================
-- This trigger automatically creates a record in the public.users table
-- whenever a new user signs up via Supabase Auth
-- 
-- Run this in: Your Supabase SQL Editor
-- =====================================================

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'display_name',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ALSO ADD POLICY TO ALLOW USER CREATION
-- =====================================================
-- Users who sign up need to be able to create their own user record

DROP POLICY IF EXISTS "Users can insert own profile on signup" ON users;
CREATE POLICY "Users can insert own profile on signup"
ON users FOR INSERT
WITH CHECK (id = auth.uid());

-- =====================================================
-- DONE!
-- =====================================================

SELECT 'User creation trigger installed successfully!' as message;
