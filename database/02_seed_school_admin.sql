-- =============================================================================
-- EduCore — Step 2: Seed Data (School + Admin User)
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================================================
-- NOTE: This seeds data directly into public.users (bypassing Supabase Auth).
--       For production, create the admin via Supabase Auth signup instead so
--       they can log in. See the comment at the bottom.
-- =============================================================================

-- ─────────────────────────────────────────────
-- 1. Insert the school
-- ─────────────────────────────────────────────
INSERT INTO schools (
  name, type, county, sub_county, knec_code,
  email, phone, principal_name, mpesa_paybill
)
VALUES (
  'Alliance High School',
  'secondary',
  'Kiambu',
  'Kikuyu',
  'KE/SEC/001',
  'info@alliance.ac.ke',
  '+254712345678',
  'Dr. James Mwangi',
  '123456'
)
ON CONFLICT (knec_code) DO NOTHING;


-- ─────────────────────────────────────────────
-- 2. Capture the school UUID for use below
-- ─────────────────────────────────────────────
DO $$
DECLARE
  v_school_id   UUID;
  v_admin_id    UUID := gen_random_uuid();
BEGIN

  SELECT id INTO v_school_id
  FROM schools
  WHERE knec_code = 'KE/SEC/001';

  -- ─────────────────────────────────────────
  -- 3. Insert the admin user into public.users
  --    (password_hash is intentionally blank;
  --     auth is handled by Supabase Auth)
  -- ─────────────────────────────────────────
  INSERT INTO users (
    id, school_id, email, password_hash,
    role, first_name, last_name, is_active
  )
  VALUES (
    v_admin_id,
    v_school_id,
    'admin@alliance.ac.ke',
    '',               -- Supabase Auth manages passwords
    'admin',
    'John',
    'Doe',
    TRUE
  )
  ON CONFLICT (email) DO NOTHING;

  -- ─────────────────────────────────────────
  -- 4. Seed current academic year (2026)
  -- ─────────────────────────────────────────
  INSERT INTO academic_years (school_id, year, is_current)
  VALUES (v_school_id, 2026, TRUE)
  ON CONFLICT (school_id, year) DO NOTHING;

  -- ─────────────────────────────────────────
  -- 5. Seed 3 terms for 2026
  -- ─────────────────────────────────────────
  INSERT INTO terms (school_id, academic_year_id, term_number, start_date, end_date, is_current)
  SELECT
    v_school_id,
    ay.id,
    t.term_number,
    t.start_date::DATE,
    t.end_date::DATE,
    t.is_current
  FROM academic_years ay,
  (VALUES
    (1, '2026-01-06', '2026-03-27', FALSE),
    (2, '2026-04-21', '2026-07-10', FALSE),
    (3, '2026-09-01', '2026-11-20', TRUE)
  ) AS t(term_number, start_date, end_date, is_current)
  WHERE ay.school_id = v_school_id AND ay.year = 2026
  ON CONFLICT (school_id, academic_year_id, term_number) DO NOTHING;

  RAISE NOTICE 'Seed complete. School ID: %', v_school_id;
  RAISE NOTICE 'Admin user ID:             %', v_admin_id;
  RAISE NOTICE '';
  RAISE NOTICE 'NEXT: Create a Supabase Auth account for this admin at:';
  RAISE NOTICE '  Supabase Dashboard → Authentication → Users → Invite user';
  RAISE NOTICE '  Email: admin@alliance.ac.ke';
  RAISE NOTICE '  The on_auth_user_created trigger will link it to this row.';

END $$;


-- ─────────────────────────────────────────────
-- Quick verify — run after the block above
-- ─────────────────────────────────────────────
SELECT
  s.id          AS school_id,
  s.name        AS school_name,
  u.id          AS admin_user_id,
  u.email       AS admin_email,
  u.role,
  ay.year,
  ay.is_current
FROM schools       s
JOIN users         u  ON u.school_id = s.id AND u.role = 'admin'
JOIN academic_years ay ON ay.school_id = s.id
WHERE s.knec_code = 'KE/SEC/001';
