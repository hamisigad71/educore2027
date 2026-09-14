-- =============================================================================
-- EduCore — Step 1: Supabase Auth → public.users sync trigger
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================================================

-- Function: fires after a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER            -- Runs as DB owner, bypasses RLS
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    school_id,
    email,
    password_hash,
    role,
    first_name,
    last_name
  )
  VALUES (
    NEW.id,                                                   -- UUID from auth.users
    (NEW.raw_user_meta_data->>'school_id')::UUID,             -- Passed during signup
    NEW.email,
    '',                                                       -- Auth handles password; hash unused
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'parent'::user_role
    ),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  )
  ON CONFLICT (id) DO NOTHING;                               -- Safe re-runs

  RETURN NEW;
END;
$$;

-- Trigger: fires after every new auth.users row
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ✅ After running this, new Supabase signups will auto-create a public.users row.
-- Pass metadata during signup from your frontend:
--   supabase.auth.signUp({
--     email, password,
--     options: { data: { school_id, role, first_name, last_name } }
--   })
