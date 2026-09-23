-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES + PERFORMANCE INDEXES
-- Enforces multitenancy and role boundaries.
-- Idempotent: drops then recreates all policies safely.
-- Uses only columns that actually exist in the live database.
-- ============================================================

-- ── Drop all existing policies first so this migration is re-runnable ────────
DO $$ DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN ('users','students','teachers','staff','exam_results','fee_accounts','parent_student')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- ── HELPER FUNCTIONS ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_my_school_id()
RETURNS UUID AS $$
  SELECT school_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ── CREATE PARENT_STUDENT TABLE IF NOT EXISTS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.parent_student (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL DEFAULT 'parent',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (parent_id, student_id)
);


-- ════════════════════════════════════════════════════════════
-- 1. USERS TABLE  (has school_id)
-- ════════════════════════════════════════════════════════════
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_same_school" ON public.users
  FOR SELECT USING (school_id = public.get_my_school_id());

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (id = auth.uid());

-- Block all direct client inserts; only trigger (SECURITY DEFINER) can insert
CREATE POLICY "users_insert_backend_only" ON public.users
  FOR INSERT WITH CHECK (false);


-- ════════════════════════════════════════════════════════════
-- 2. STUDENTS TABLE  (has school_id)
-- ════════════════════════════════════════════════════════════
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students_select_school" ON public.students
  FOR SELECT USING (
    school_id = public.get_my_school_id()
    AND public.get_my_role() IN ('admin', 'teacher', 'staff')
  );

CREATE POLICY "students_select_parent" ON public.students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parent_student ps
      WHERE ps.parent_id = auth.uid() AND ps.student_id = students.user_id
    )
  );

CREATE POLICY "students_select_own" ON public.students
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "students_insert_backend_only" ON public.students
  FOR INSERT WITH CHECK (false);

CREATE POLICY "students_update_backend_only" ON public.students
  FOR UPDATE USING (false);


-- ════════════════════════════════════════════════════════════
-- 3. TEACHERS TABLE  (has school_id)
-- ════════════════════════════════════════════════════════════
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teachers_select_school" ON public.teachers
  FOR SELECT USING (
    school_id = public.get_my_school_id()
    AND public.get_my_role() IN ('admin')
  );

CREATE POLICY "teachers_select_own" ON public.teachers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "teachers_insert_backend_only" ON public.teachers
  FOR INSERT WITH CHECK (false);

CREATE POLICY "teachers_update_backend_only" ON public.teachers
  FOR UPDATE USING (false);


-- ════════════════════════════════════════════════════════════
-- 4. STAFF TABLE  (has school_id)
-- ════════════════════════════════════════════════════════════
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_select_school" ON public.staff
  FOR SELECT USING (
    school_id = public.get_my_school_id()
    AND public.get_my_role() IN ('admin')
  );

CREATE POLICY "staff_select_own" ON public.staff
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "staff_insert_backend_only" ON public.staff
  FOR INSERT WITH CHECK (false);

CREATE POLICY "staff_update_backend_only" ON public.staff
  FOR UPDATE USING (false);


-- ════════════════════════════════════════════════════════════
-- 5. EXAM RESULTS TABLE  (NO school_id — scope via student_id join)
-- ════════════════════════════════════════════════════════════
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

-- Admins and teachers: can read results for students in their school
CREATE POLICY "results_select_school_staff" ON public.exam_results
  FOR SELECT USING (
    public.get_my_role() IN ('admin', 'teacher')
    AND EXISTS (
      SELECT 1 FROM public.students st
      WHERE st.user_id = exam_results.student_id
        AND st.school_id = public.get_my_school_id()
    )
  );

-- Parents: can only read their linked child's results
CREATE POLICY "results_select_parent" ON public.exam_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parent_student ps
      WHERE ps.parent_id = auth.uid() AND ps.student_id = exam_results.student_id
    )
  );

-- Students: can only read their own results
CREATE POLICY "results_select_student" ON public.exam_results
  FOR SELECT USING (student_id = auth.uid());

-- Only teachers and admins can insert results (scoped to their school via student)
CREATE POLICY "results_insert_teacher_admin" ON public.exam_results
  FOR INSERT WITH CHECK (
    public.get_my_role() IN ('admin', 'teacher')
    AND EXISTS (
      SELECT 1 FROM public.students st
      WHERE st.user_id = exam_results.student_id
        AND st.school_id = public.get_my_school_id()
    )
  );


-- ════════════════════════════════════════════════════════════
-- 6. FEE ACCOUNTS TABLE  (scope via student_id join if no school_id)
-- ════════════════════════════════════════════════════════════
ALTER TABLE public.fee_accounts ENABLE ROW LEVEL SECURITY;

-- Admins and bursars: can read all fee accounts for students in their school
CREATE POLICY "fees_select_school" ON public.fee_accounts
  FOR SELECT USING (
    public.get_my_role() IN ('admin', 'staff')
    AND EXISTS (
      SELECT 1 FROM public.students st
      WHERE st.user_id = fee_accounts.student_id
        AND st.school_id = public.get_my_school_id()
    )
  );

-- Parents: can only see their child's fee account
CREATE POLICY "fees_select_parent" ON public.fee_accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.parent_student ps
      WHERE ps.parent_id = auth.uid() AND ps.student_id = fee_accounts.student_id
    )
  );


-- ════════════════════════════════════════════════════════════
-- 7. PARENT_STUDENT TABLE
-- ════════════════════════════════════════════════════════════
ALTER TABLE public.parent_student ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parent_student_select_own" ON public.parent_student
  FOR SELECT USING (parent_id = auth.uid());

CREATE POLICY "parent_student_select_admin" ON public.parent_student
  FOR SELECT USING (public.get_my_role() = 'admin');

CREATE POLICY "parent_student_insert_backend" ON public.parent_student
  FOR INSERT WITH CHECK (false);


-- ════════════════════════════════════════════════════════════
-- PERFORMANCE INDEXES
-- ════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_users_school_id          ON public.users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_role               ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_students_school_id       ON public.students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_admission       ON public.students(admission_number);
CREATE INDEX IF NOT EXISTS idx_students_user_id         ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id       ON public.teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_staff_school_id          ON public.staff(school_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_student     ON public.exam_results(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_accounts_student     ON public.fee_accounts(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_parent    ON public.parent_student(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_student   ON public.parent_student(student_id);
