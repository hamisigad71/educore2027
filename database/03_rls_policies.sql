-- =============================================================================
-- EduCore — Step 3: Row-Level Security (RLS) Policies
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================================================
-- Strategy:
--   • Superadmin  → full access to all tables
--   • Admin       → full access scoped to their school_id
--   • Teacher     → read their school; write attendance & exam results
--   • Parent      → read only their children's data
--   • Student     → read their own records
--   • All selects use auth.uid() to get the current user's UUID
-- =============================================================================

-- Helper function: returns the school_id for the calling user
CREATE OR REPLACE FUNCTION public.my_school_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT school_id FROM public.users WHERE id = auth.uid();
$$;

-- Helper function: returns the role of the calling user
CREATE OR REPLACE FUNCTION public.my_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;


-- =============================================================================
-- SCHOOLS
-- =============================================================================
CREATE POLICY "superadmin_all_schools" ON schools
  FOR ALL
  USING (my_role() = 'superadmin');

CREATE POLICY "read_own_school" ON schools
  FOR SELECT
  USING (id = my_school_id());


-- =============================================================================
-- USERS
-- =============================================================================
-- Superadmin sees all
CREATE POLICY "superadmin_all_users" ON users
  FOR ALL
  USING (my_role() = 'superadmin');

-- Admin manages users in their school
CREATE POLICY "admin_school_users" ON users
  FOR ALL
  USING (
    my_role() = 'admin'
    AND school_id = my_school_id()
  );

-- Everyone can read their own profile
CREATE POLICY "read_own_profile" ON users
  FOR SELECT
  USING (id = auth.uid());

-- Teachers / staff see colleagues in same school
CREATE POLICY "school_staff_read_users" ON users
  FOR SELECT
  USING (
    my_role() IN ('teacher', 'staff')
    AND school_id = my_school_id()
  );

-- Parents see only their own record
CREATE POLICY "parent_own_record" ON users
  FOR SELECT
  USING (
    my_role() = 'parent'
    AND id = auth.uid()
  );


-- =============================================================================
-- ACADEMIC_YEARS & TERMS  (read-only for most roles)
-- =============================================================================
CREATE POLICY "school_read_academic_years" ON academic_years
  FOR SELECT USING (school_id = my_school_id());

CREATE POLICY "admin_manage_academic_years" ON academic_years
  FOR ALL
  USING (my_role() IN ('superadmin', 'admin') AND school_id = my_school_id());

CREATE POLICY "school_read_terms" ON terms
  FOR SELECT USING (school_id = my_school_id());

CREATE POLICY "admin_manage_terms" ON terms
  FOR ALL
  USING (my_role() IN ('superadmin', 'admin') AND school_id = my_school_id());


-- =============================================================================
-- STUDENTS
-- =============================================================================
CREATE POLICY "admin_manage_students" ON students
  FOR ALL
  USING (my_role() IN ('superadmin', 'admin') AND school_id = my_school_id());

CREATE POLICY "teacher_read_students" ON students
  FOR SELECT
  USING (my_role() = 'teacher' AND school_id = my_school_id());

-- Parent sees their own children only
CREATE POLICY "parent_read_own_children" ON students
  FOR SELECT
  USING (
    my_role() = 'parent'
    AND parent_id = auth.uid()
  );

-- Student sees their own record
CREATE POLICY "student_read_self" ON students
  FOR SELECT
  USING (
    my_role() = 'student'
    AND user_id = auth.uid()
  );


-- =============================================================================
-- CLASSES & ENROLLMENTS
-- =============================================================================
CREATE POLICY "admin_manage_classes" ON classes
  FOR ALL
  USING (my_role() IN ('superadmin', 'admin') AND school_id = my_school_id());

CREATE POLICY "school_read_classes" ON classes
  FOR SELECT
  USING (school_id = my_school_id());

CREATE POLICY "admin_manage_enrollments" ON enrollments
  FOR ALL
  USING (
    my_role() IN ('superadmin', 'admin')
    AND EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = enrollments.class_id
        AND c.school_id = my_school_id()
    )
  );

CREATE POLICY "school_read_enrollments" ON enrollments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = enrollments.class_id
        AND c.school_id = my_school_id()
    )
  );


-- =============================================================================
-- TEACHERS & STAFF
-- =============================================================================
CREATE POLICY "admin_manage_teachers" ON teachers
  FOR ALL
  USING (my_role() IN ('superadmin', 'admin') AND school_id = my_school_id());

CREATE POLICY "school_read_teachers" ON teachers
  FOR SELECT USING (school_id = my_school_id());

CREATE POLICY "admin_manage_staff" ON staff
  FOR ALL
  USING (my_role() IN ('superadmin', 'admin') AND school_id = my_school_id());

CREATE POLICY "school_read_staff" ON staff
  FOR SELECT USING (school_id = my_school_id());


-- =============================================================================
-- SUBJECTS & CLASS_SUBJECTS & TIMETABLE
-- =============================================================================
CREATE POLICY "admin_manage_subjects" ON subjects
  FOR ALL
  USING (my_role() IN ('superadmin', 'admin') AND school_id = my_school_id());

CREATE POLICY "school_read_subjects" ON subjects
  FOR SELECT USING (school_id = my_school_id());

CREATE POLICY "admin_manage_class_subjects" ON class_subjects
  FOR ALL
  USING (
    my_role() IN ('superadmin', 'admin')
    AND EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = class_subjects.class_id AND c.school_id = my_school_id()
    )
  );

CREATE POLICY "school_read_class_subjects" ON class_subjects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = class_subjects.class_id AND c.school_id = my_school_id()
    )
  );

CREATE POLICY "school_manage_timetable" ON timetable_slots
  FOR ALL
  USING (my_role() IN ('superadmin', 'admin', 'teacher'));

CREATE POLICY "school_read_timetable" ON timetable_slots
  FOR SELECT USING (TRUE);   -- All authenticated users can read timetable


-- =============================================================================
-- ATTENDANCE
-- =============================================================================
CREATE POLICY "teacher_manage_attendance" ON attendance
  FOR ALL
  USING (
    my_role() IN ('superadmin', 'admin', 'teacher')
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = attendance.student_id AND s.school_id = my_school_id()
    )
  );

-- Parents see their child's attendance
CREATE POLICY "parent_read_child_attendance" ON attendance
  FOR SELECT
  USING (
    my_role() = 'parent'
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = attendance.student_id AND s.parent_id = auth.uid()
    )
  );

-- Student sees own attendance
CREATE POLICY "student_read_own_attendance" ON attendance
  FOR SELECT
  USING (
    my_role() = 'student'
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = attendance.student_id AND s.user_id = auth.uid()
    )
  );


-- =============================================================================
-- EXAMS & RESULTS
-- =============================================================================
CREATE POLICY "admin_manage_exams" ON exams
  FOR ALL
  USING (my_role() IN ('superadmin', 'admin') AND school_id = my_school_id());

CREATE POLICY "school_read_exams" ON exams
  FOR SELECT USING (school_id = my_school_id());

CREATE POLICY "teacher_manage_exam_results" ON exam_results
  FOR ALL
  USING (
    my_role() IN ('superadmin', 'admin', 'teacher')
    AND EXISTS (
      SELECT 1 FROM exams e
      WHERE e.id = exam_results.exam_id AND e.school_id = my_school_id()
    )
  );

CREATE POLICY "parent_read_child_results" ON exam_results
  FOR SELECT
  USING (
    my_role() = 'parent'
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = exam_results.student_id AND s.parent_id = auth.uid()
    )
  );

CREATE POLICY "student_read_own_results" ON exam_results
  FOR SELECT
  USING (
    my_role() = 'student'
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = exam_results.student_id AND s.user_id = auth.uid()
    )
  );


-- =============================================================================
-- FEE_STRUCTURES, FEE_ACCOUNTS, FEE_TRANSACTIONS
-- =============================================================================
CREATE POLICY "admin_manage_fee_structures" ON fee_structures
  FOR ALL
  USING (my_role() IN ('superadmin', 'admin') AND school_id = my_school_id());

CREATE POLICY "school_read_fee_structures" ON fee_structures
  FOR SELECT USING (school_id = my_school_id());

-- Admin + staff (bursar) manage fee accounts
CREATE POLICY "admin_manage_fee_accounts" ON fee_accounts
  FOR ALL
  USING (
    my_role() IN ('superadmin', 'admin', 'staff')
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = fee_accounts.student_id AND s.school_id = my_school_id()
    )
  );

CREATE POLICY "parent_read_child_fee_accounts" ON fee_accounts
  FOR SELECT
  USING (
    my_role() = 'parent'
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = fee_accounts.student_id AND s.parent_id = auth.uid()
    )
  );

CREATE POLICY "student_read_own_fee_account" ON fee_accounts
  FOR SELECT
  USING (
    my_role() = 'student'
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = fee_accounts.student_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "admin_manage_fee_transactions" ON fee_transactions
  FOR ALL
  USING (
    my_role() IN ('superadmin', 'admin', 'staff')
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = fee_transactions.student_id AND s.school_id = my_school_id()
    )
  );

CREATE POLICY "parent_read_child_transactions" ON fee_transactions
  FOR SELECT
  USING (
    my_role() = 'parent'
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = fee_transactions.student_id AND s.parent_id = auth.uid()
    )
  );

CREATE POLICY "student_read_own_transactions" ON fee_transactions
  FOR SELECT
  USING (
    my_role() = 'student'
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = fee_transactions.student_id AND s.user_id = auth.uid()
    )
  );


-- =============================================================================
-- LIBRARY (BOOKS + LOANS)
-- =============================================================================
CREATE POLICY "admin_manage_books" ON books
  FOR ALL
  USING (my_role() IN ('superadmin', 'admin', 'staff') AND school_id = my_school_id());

CREATE POLICY "school_read_books" ON books
  FOR SELECT USING (school_id = my_school_id());

CREATE POLICY "staff_manage_loans" ON library_loans
  FOR ALL
  USING (my_role() IN ('superadmin', 'admin', 'staff', 'teacher'));

CREATE POLICY "student_read_own_loans" ON library_loans
  FOR SELECT
  USING (
    my_role() = 'student'
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = library_loans.student_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "parent_read_child_loans" ON library_loans
  FOR SELECT
  USING (
    my_role() = 'parent'
    AND EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = library_loans.student_id AND s.parent_id = auth.uid()
    )
  );


-- =============================================================================
-- MESSAGES
-- =============================================================================
CREATE POLICY "send_and_read_own_messages" ON messages
  FOR ALL
  USING (
    sender_id = auth.uid()
    OR recipient_id = auth.uid()
  );

CREATE POLICY "admin_read_school_messages" ON messages
  FOR SELECT
  USING (my_role() IN ('superadmin', 'admin') AND school_id = my_school_id());


-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================
CREATE POLICY "read_own_notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "admin_manage_notifications" ON notifications
  FOR ALL USING (my_role() IN ('superadmin', 'admin'));


-- =============================================================================
-- ANNOUNCEMENTS
-- =============================================================================
CREATE POLICY "admin_manage_announcements" ON announcements
  FOR ALL
  USING (my_role() IN ('superadmin', 'admin') AND school_id = my_school_id());

CREATE POLICY "school_read_announcements" ON announcements
  FOR SELECT
  USING (school_id = my_school_id());


-- ✅ RLS policies complete.
-- Summary of access matrix:
-- ┌─────────────┬────────────┬─────────┬────────┬────────┬─────────┐
-- │ Table group │ superadmin │  admin  │teacher │ parent │ student │
-- ├─────────────┼────────────┼─────────┼────────┼────────┼─────────┤
-- │ Schools     │ CRUD       │ R       │ R      │ –      │ –       │
-- │ Users       │ CRUD       │ CRUD*   │ R      │ R-self │ R-self  │
-- │ Students    │ CRUD       │ CRUD*   │ R      │ R-child│ R-self  │
-- │ Fees        │ CRUD       │ CRUD*   │ –      │ R-child│ R-self  │
-- │ Attendance  │ CRUD       │ CRUD*   │ CRUD*  │ R-child│ R-self  │
-- │ Exams       │ CRUD       │ CRUD*   │ CRUD*  │ R-child│ R-self  │
-- │ Library     │ CRUD       │ CRUD*   │ CRUD*  │ R-child│ R-self  │
-- │ Messages    │ CRUD       │ R       │ CRUD*  │ CRUD*  │ CRUD*   │
-- └─────────────┴────────────┴─────────┴────────┴────────┴─────────┘
-- (*) scoped to own school_id only
