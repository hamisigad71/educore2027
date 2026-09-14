-- =============================================================================
-- EduCore — Step 6: Full Realistic Database Seed Script
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================================================
-- Populates:
--   1. School, Academic Year (2026), Terms 1-3
--   2. Classes & Subjects
--   3. Users (Teachers, Staff, Parents, Students) with profile records
--   4. Enrollments & Class-Subject Teacher Assignments
--   5. Fee Structures, Student Fee Ledgers & M-Pesa Transactions
--   6. Exams & Exam Results (with CBC/KCSE grades & mean points)
--   7. Attendance Records (Present, Absent, Late)
--   8. Library Books & Active Loans
--   9. Announcements & Notifications
-- =============================================================================

DO $$
DECLARE
  v_school_id       UUID;
  v_ay_id           UUID;
  v_term1_id        UUID;
  v_term2_id        UUID;
  v_term3_id        UUID;

  -- Class UUIDs
  v_class_f1        UUID := gen_random_uuid();
  v_class_f2        UUID := gen_random_uuid();
  v_class_f3        UUID := gen_random_uuid();
  v_class_f4        UUID := gen_random_uuid();

  -- Subject UUIDs
  v_sub_math        UUID := gen_random_uuid();
  v_sub_eng         UUID := gen_random_uuid();
  v_sub_kisw        UUID := gen_random_uuid();
  v_sub_bio         UUID := gen_random_uuid();
  v_sub_chem        UUID := gen_random_uuid();

  -- Teacher User & Profile UUIDs
  v_u_t1 UUID := gen_random_uuid(); v_t1 UUID := gen_random_uuid();
  v_u_t2 UUID := gen_random_uuid(); v_t2 UUID := gen_random_uuid();
  v_u_t3 UUID := gen_random_uuid(); v_t3 UUID := gen_random_uuid();

  -- Staff User & Profile UUIDs
  v_u_bursar UUID := gen_random_uuid(); v_st_bursar UUID := gen_random_uuid();
  v_u_lib    UUID := gen_random_uuid(); v_st_lib    UUID := gen_random_uuid();

  -- Parent User UUIDs
  v_u_p1 UUID := gen_random_uuid();
  v_u_p2 UUID := gen_random_uuid();
  v_u_p3 UUID := gen_random_uuid();

  -- Student User & Profile UUIDs
  v_u_s1 UUID := gen_random_uuid(); v_s1 UUID := gen_random_uuid();
  v_u_s2 UUID := gen_random_uuid(); v_s2 UUID := gen_random_uuid();
  v_u_s3 UUID := gen_random_uuid(); v_s3 UUID := gen_random_uuid();
  v_u_s4 UUID := gen_random_uuid(); v_s4 UUID := gen_random_uuid();
  v_u_s5 UUID := gen_random_uuid(); v_s5 UUID := gen_random_uuid();

  -- Exam UUIDs
  v_exam_term1 UUID := gen_random_uuid();
  v_exam_term3 UUID := gen_random_uuid();

  -- Fee Account UUIDs
  v_fa_s1 UUID := gen_random_uuid();
  v_fa_s2 UUID := gen_random_uuid();
  v_fa_s3 UUID := gen_random_uuid();

  -- Book UUIDs
  v_bk1 UUID := gen_random_uuid();
  v_bk2 UUID := gen_random_uuid();

BEGIN

  -- ───────────────────────────────────────────────────────────────────────────
  -- 1. SCHOOL SETUP
  -- ───────────────────────────────────────────────────────────────────────────
  INSERT INTO schools (name, type, county, sub_county, knec_code, email, phone, principal_name, mpesa_paybill)
  VALUES ('Alliance High School', 'secondary', 'Kiambu', 'Kikuyu', 'KE/SEC/001', 'info@alliance.ac.ke', '+254712345678', 'Dr. James Mwangi', '123456')
  ON CONFLICT (knec_code) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_school_id;

  -- ───────────────────────────────────────────────────────────────────────────
  -- 2. ACADEMIC YEAR & TERMS
  -- ───────────────────────────────────────────────────────────────────────────
  INSERT INTO academic_years (school_id, year, is_current)
  VALUES (v_school_id, 2026, TRUE)
  ON CONFLICT (school_id, year) DO UPDATE SET is_current = TRUE
  RETURNING id INTO v_ay_id;

  INSERT INTO terms (school_id, academic_year_id, term_number, start_date, end_date, is_current)
  VALUES (v_school_id, v_ay_id, 1, '2026-01-06', '2026-03-27', FALSE)
  ON CONFLICT (school_id, academic_year_id, term_number) DO UPDATE SET start_date = EXCLUDED.start_date
  RETURNING id INTO v_term1_id;

  INSERT INTO terms (school_id, academic_year_id, term_number, start_date, end_date, is_current)
  VALUES (v_school_id, v_ay_id, 2, '2026-04-21', '2026-07-10', FALSE)
  ON CONFLICT (school_id, academic_year_id, term_number) DO UPDATE SET start_date = EXCLUDED.start_date
  RETURNING id INTO v_term2_id;

  INSERT INTO terms (school_id, academic_year_id, term_number, start_date, end_date, is_current)
  VALUES (v_school_id, v_ay_id, 3, '2026-09-01', '2026-11-20', TRUE)
  ON CONFLICT (school_id, academic_year_id, term_number) DO UPDATE SET is_current = TRUE
  RETURNING id INTO v_term3_id;

  -- ───────────────────────────────────────────────────────────────────────────
  -- 3. CLASSES
  -- ───────────────────────────────────────────────────────────────────────────
  INSERT INTO classes (id, school_id, name, level, stream, capacity, academic_year_id)
  VALUES
    (v_class_f1, v_school_id, 'Form 1 East',  'Form 1', 'East',  45, v_ay_id),
    (v_class_f2, v_school_id, 'Form 2 North', 'Form 2', 'North', 45, v_ay_id),
    (v_class_f3, v_school_id, 'Form 3 West',  'Form 3', 'West',  40, v_ay_id),
    (v_class_f4, v_school_id, 'Form 4 South', 'Form 4', 'South', 40, v_ay_id)
  ON CONFLICT DO NOTHING;

  -- ───────────────────────────────────────────────────────────────────────────
  -- 4. SUBJECTS
  -- ───────────────────────────────────────────────────────────────────────────
  INSERT INTO subjects (id, school_id, name, code, category, is_examinable)
  VALUES
    (v_sub_math, v_school_id, 'Mathematics', 'MATH', 'Compulsory', TRUE),
    (v_sub_eng,  v_school_id, 'English',     'ENG',  'Compulsory', TRUE),
    (v_sub_kisw, v_school_id, 'Kiswahili',    'KISW', 'Compulsory', TRUE),
    (v_sub_bio,  v_school_id, 'Biology',      'BIO',  'Sciences',   TRUE),
    (v_sub_chem, v_school_id, 'Chemistry',    'CHEM', 'Sciences',   TRUE)
  ON CONFLICT (school_id, code) DO NOTHING;

  -- ───────────────────────────────────────────────────────────────────────────
  -- 5. TEACHERS (USERS + TEACHER PROFILES)
  -- ───────────────────────────────────────────────────────────────────────────
  INSERT INTO users (id, school_id, email, password_hash, role, first_name, last_name, gender, is_active)
  VALUES
    (v_u_t1, v_school_id, 'peter.omondi@alliance.ac.ke', '', 'teacher', 'Peter', 'Omondi', 'male', TRUE),
    (v_u_t2, v_school_id, 'grace.wanjiku@alliance.ac.ke', '', 'teacher', 'Grace', 'Wanjiku', 'female', TRUE),
    (v_u_t3, v_school_id, 'david.kiprop@alliance.ac.ke', '', 'teacher', 'David', 'Kiprop', 'male', TRUE)
  ON CONFLICT (email) DO NOTHING;

  INSERT INTO teachers (id, user_id, school_id, tsc_number, employee_number, specialization, employment_type)
  VALUES
    (v_t1, v_u_t1, v_school_id, 'TSC/2014/88392', 'EMP-T101', 'Mathematics & Physics', 'permanent'),
    (v_t2, v_u_t2, v_school_id, 'TSC/2018/19482', 'EMP-T102', 'English & Literature',  'permanent'),
    (v_t3, v_u_t3, v_school_id, 'TSC/2020/55921', 'EMP-T103', 'Chemistry & Biology',   'permanent')
  ON CONFLICT (user_id) DO NOTHING;

  -- Assign class teachers
  UPDATE classes SET class_teacher_id = v_u_t1 WHERE id = v_class_f3;
  UPDATE classes SET class_teacher_id = v_u_t2 WHERE id = v_class_f1;

  -- Assign subject teachers to classes
  INSERT INTO class_subjects (class_id, subject_id, teacher_id, academic_year_id, lessons_per_week)
  VALUES
    (v_class_f3, v_sub_math, v_t1, v_ay_id, 6),
    (v_class_f3, v_sub_eng,  v_t2, v_ay_id, 5),
    (v_class_f3, v_sub_chem, v_t3, v_ay_id, 5),
    (v_class_f1, v_sub_math, v_t1, v_ay_id, 6)
  ON CONFLICT (class_id, subject_id, academic_year_id) DO NOTHING;

  -- ───────────────────────────────────────────────────────────────────────────
  -- 6. STAFF (BURSAR & LIBRARIAN)
  -- ───────────────────────────────────────────────────────────────────────────
  INSERT INTO users (id, school_id, email, password_hash, role, first_name, last_name, gender, is_active)
  VALUES
    (v_u_bursar, v_school_id, 'bursar@alliance.ac.ke', '', 'staff', 'Kevin', 'Njoroge', 'male', TRUE),
    (v_u_lib,    v_school_id, 'library@alliance.ac.ke', '', 'staff', 'Sarah', 'Achieng', 'female', TRUE)
  ON CONFLICT (email) DO NOTHING;

  INSERT INTO staff (id, user_id, school_id, employee_number, department, position)
  VALUES
    (v_st_bursar, v_u_bursar, v_school_id, 'EMP-S001', 'Finance', 'School Bursar'),
    (v_st_lib,    v_u_lib,    v_school_id, 'EMP-S002', 'Library', 'Head Librarian')
  ON CONFLICT (user_id) DO NOTHING;

  -- ───────────────────────────────────────────────────────────────────────────
  -- 7. PARENTS
  -- ───────────────────────────────────────────────────────────────────────────
  INSERT INTO users (id, school_id, email, password_hash, role, first_name, last_name, phone, is_active)
  VALUES
    (v_u_p1, v_school_id, 'parent1@gmail.com', '', 'parent', 'Joseph', 'Kamau', '+254722111222', TRUE),
    (v_u_p2, v_school_id, 'parent2@gmail.com', '', 'parent', 'Mary', 'Otieno', '+254733444555', TRUE),
    (v_u_p3, v_school_id, 'parent3@gmail.com', '', 'parent', 'Bernard', 'Kiprop', '+254711888999', TRUE)
  ON CONFLICT (email) DO NOTHING;

  -- ───────────────────────────────────────────────────────────────────────────
  -- 8. STUDENTS (USERS + STUDENT PROFILES + ENROLLMENTS)
  -- ───────────────────────────────────────────────────────────────────────────
  INSERT INTO users (id, school_id, email, password_hash, role, first_name, last_name, gender, is_active)
  VALUES
    (v_u_s1, v_school_id, 'john.kamau@student.alliance.ac.ke',   '', 'student', 'John', 'Kamau', 'male', TRUE),
    (v_u_s2, v_school_id, 'jane.otieno@student.alliance.ac.ke',  '', 'student', 'Jane', 'Otieno', 'female', TRUE),
    (v_u_s3, v_school_id, 'brian.kiprop@student.alliance.ac.ke', '', 'student', 'Brian', 'Kiprop', 'male', TRUE),
    (v_u_s4, v_school_id, 'faith.wambui@student.alliance.ac.ke', '', 'student', 'Faith', 'Wambui', 'female', TRUE),
    (v_u_s5, v_school_id, 'dennis.mutua@student.alliance.ac.ke', '', 'student', 'Dennis', 'Mutua', 'male', TRUE)
  ON CONFLICT (email) DO NOTHING;

  INSERT INTO students (id, user_id, school_id, admission_number, admission_date, kcpe_marks, parent_id, status)
  VALUES
    (v_s1, v_u_s1, v_school_id, 'ADM/2024/001', '2024-01-15', 388, v_u_p1, 'active'),
    (v_s2, v_u_s2, v_school_id, 'ADM/2024/002', '2024-01-15', 402, v_u_p2, 'active'),
    (v_s3, v_u_s3, v_school_id, 'ADM/2024/003', '2024-01-15', 375, v_u_p3, 'active'),
    (v_s4, v_u_s4, v_school_id, 'ADM/2025/012', '2025-01-13', 391, v_u_p1, 'active'),
    (v_s5, v_u_s5, v_school_id, 'ADM/2026/045', '2026-01-12', 410, NULL,   'active')
  ON CONFLICT (school_id, admission_number) DO NOTHING;

  -- Enroll students in classes for 2026
  INSERT INTO enrollments (student_id, class_id, academic_year_id, roll_number)
  VALUES
    (v_s1, v_class_f3, v_ay_id, 1),
    (v_s2, v_class_f3, v_ay_id, 2),
    (v_s3, v_class_f3, v_ay_id, 3),
    (v_s4, v_class_f2, v_ay_id, 1),
    (v_s5, v_class_f1, v_ay_id, 1)
  ON CONFLICT (student_id, academic_year_id) DO NOTHING;

  -- ───────────────────────────────────────────────────────────────────────────
  -- 9. FEE STRUCTURES, ACCOUNTS & TRANSACTIONS
  -- ───────────────────────────────────────────────────────────────────────────
  INSERT INTO fee_structures (school_id, term_id, class_level, item_name, amount)
  VALUES
    (v_school_id, v_term3_id, 'Form 3', 'Tuition Fee',     25000.00),
    (v_school_id, v_term3_id, 'Form 3', 'Boarding & Meals',18000.00),
    (v_school_id, v_term3_id, 'Form 3', 'Activity Fee',     3500.00),
    (v_school_id, v_term3_id, 'Form 1', 'Tuition Fee',     28000.00),
    (v_school_id, v_term3_id, 'Form 1', 'Boarding & Meals',18000.00)
  ON CONFLICT DO NOTHING;

  -- Create fee accounts for Term 3 (Total billed = 46,500 for Form 3)
  INSERT INTO fee_accounts (id, student_id, term_id, total_billed, total_paid)
  VALUES
    (v_fa_s1, v_s1, v_term3_id, 46500.00, 46500.00),  -- Fully paid
    (v_fa_s2, v_s2, v_term3_id, 46500.00, 30000.00),  -- Partial (16,500 balance)
    (v_fa_s3, v_s3, v_term3_id, 46500.00, 0.00)       -- Unpaid
  ON CONFLICT (student_id, term_id) DO NOTHING;

  -- Insert sample M-Pesa STK push & Cash transactions
  INSERT INTO fee_transactions (fee_account_id, student_id, amount, payment_method, reference, mpesa_receipt, status, paid_at)
  VALUES
    (v_fa_s1, v_s1, 46500.00, 'mpesa', 'STK-882910', 'QWE718291', 'success', '2026-09-02 10:14:00+03'),
    (v_fa_s2, v_s2, 30000.00, 'mpesa', 'STK-882911', 'QWE718295', 'success', '2026-09-04 14:30:00+03')
  ON CONFLICT DO NOTHING;

  -- ───────────────────────────────────────────────────────────────────────────
  -- 10. EXAMS & RESULTS
  -- ───────────────────────────────────────────────────────────────────────────
  INSERT INTO exams (id, school_id, term_id, name, type, start_date, end_date, max_marks)
  VALUES
    (v_exam_term1, v_school_id, v_term1_id, 'Term 1 End-Term Examination', 'endterm', '2026-03-16', '2026-03-25', 100),
    (v_exam_term3, v_school_id, v_term3_id, 'Term 3 Mid-Term Examination', 'midterm', '2026-10-05', '2026-10-12', 100)
  ON CONFLICT DO NOTHING;

  -- Insert exam results for Form 3 students (Term 1 End-Term)
  INSERT INTO exam_results (exam_id, student_id, subject_id, marks_obtained, grade, points, entered_by)
  VALUES
    (v_exam_term1, v_s1, v_sub_math, 85.00, 'A',  12, v_u_t1),
    (v_exam_term1, v_s1, v_sub_eng,  78.00, 'A-', 11, v_u_t2),
    (v_exam_term1, v_s1, v_sub_chem, 81.00, 'A',  12, v_u_t3),

    (v_exam_term1, v_s2, v_sub_math, 92.00, 'A',  12, v_u_t1),
    (v_exam_term1, v_s2, v_sub_eng,  88.00, 'A',  12, v_u_t2),
    (v_exam_term1, v_s2, v_sub_chem, 89.00, 'A',  12, v_u_t3),

    (v_exam_term1, v_s3, v_sub_math, 64.00, 'B',   9, v_u_t1),
    (v_exam_term1, v_s3, v_sub_eng,  70.00, 'B+', 10, v_u_t2),
    (v_exam_term1, v_s3, v_sub_chem, 58.00, 'C+',  7, v_u_t3)
  ON CONFLICT (exam_id, student_id, subject_id) DO NOTHING;

  -- ───────────────────────────────────────────────────────────────────────────
  -- 11. ATTENDANCE LOGS
  -- ───────────────────────────────────────────────────────────────────────────
  INSERT INTO attendance (student_id, class_id, date, status, recorded_by)
  VALUES
    (v_s1, v_class_f3, '2026-09-08', 'present', v_u_t1),
    (v_s1, v_class_f3, '2026-09-09', 'present', v_u_t1),
    (v_s1, v_class_f3, '2026-09-10', 'present', v_u_t1),

    (v_s2, v_class_f3, '2026-09-08', 'present', v_u_t1),
    (v_s2, v_class_f3, '2026-09-09', 'late',    v_u_t1),
    (v_s2, v_class_f3, '2026-09-10', 'present', v_u_t1),

    (v_s3, v_class_f3, '2026-09-08', 'absent',  v_u_t1),
    (v_s3, v_class_f3, '2026-09-09', 'excused', v_u_t1),
    (v_s3, v_class_f3, '2026-09-10', 'present', v_u_t1)
  ON CONFLICT (student_id, date) DO NOTHING;

  -- ───────────────────────────────────────────────────────────────────────────
  -- 12. LIBRARY BOOKS & LOANS
  -- ───────────────────────────────────────────────────────────────────────────
  INSERT INTO books (id, school_id, title, author, isbn, category, total_copies, available_copies)
  VALUES
    (v_bk1, v_school_id, 'KCSE Secondary Mathematics Form 3', 'KLB', '978-9966-10-101-1', 'Mathematics', 50, 48),
    (v_bk2, v_school_id, 'Blossoms of the Savannah', 'Henry ole Kulet', '978-9966-34-402-2', 'Literature', 60, 59)
  ON CONFLICT DO NOTHING;

  INSERT INTO library_loans (book_id, student_id, borrowed_at, due_at, issued_by)
  VALUES
    (v_bk1, v_s1, NOW() - INTERVAL '3 days', NOW() + INTERVAL '11 days', v_u_lib),
    (v_bk2, v_s2, NOW() - INTERVAL '5 days', NOW() + INTERVAL '9 days',  v_u_lib)
  ON CONFLICT DO NOTHING;

  -- ───────────────────────────────────────────────────────────────────────────
  -- 13. ANNOUNCEMENTS & NOTIFICATIONS
  -- ───────────────────────────────────────────────────────────────────────────
  INSERT INTO announcements (school_id, author_id, title, body, target_audience)
  VALUES
    (v_school_id, v_u_t1, 'Term 3 Visiting Day Notice', 'Visiting day is scheduled for Saturday 24th October from 9:00 AM to 4:00 PM.', 'all'),
    (v_school_id, v_u_t1, 'Form 3 Physics Practical Sessions', 'Physics practicals will take place every Tuesday 2:00 PM in Lab B.', 'students')
  ON CONFLICT DO NOTHING;

  INSERT INTO notifications (user_id, type, title, body)
  VALUES
    (v_u_p2, 'fee_reminder', 'Term 3 Fee Clearance Notice', 'Dear Parent, your child Jane Otieno has an outstanding fee balance of KES 16,500.'),
    (v_u_s1, 'exam_published', 'Term 1 Exam Results Published', 'Your Term 1 examination results have been published. Mean Grade: A (81.33%)')
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '══════════════════════════════════════════════════════════════';
  RAISE NOTICE '✅ FULL SEED COMPLETE FOR ALLIANCE HIGH SCHOOL!';
  RAISE NOTICE '   • School ID:       %', v_school_id;
  RAISE NOTICE '   • Academic Year:   2026 (Term 3 active)';
  RAISE NOTICE '   • Classes Created: Form 1 East, Form 2 North, Form 3 West, Form 4 South';
  RAISE NOTICE '   • Teachers:        3 (Peter Omondi, Grace Wanjiku, David Kiprop)';
  RAISE NOTICE '   • Staff:           2 (Bursar, Librarian)';
  RAISE NOTICE '   • Students:        5 (John Kamau, Jane Otieno, Brian Kiprop, etc)';
  RAISE NOTICE '   • Ledger Balances: John Kamau (KES 0 - Paid), Jane Otieno (KES 16,500 - Partial)';
  RAISE NOTICE '══════════════════════════════════════════════════════════════';

END $$;

-- ───────────────────────────────────────────────────────────────────────────
-- Quick Verification Query
-- ───────────────────────────────────────────────────────────────────────────
SELECT
    s.admission_number,
    u.first_name || ' ' || u.last_name AS student_name,
    c.name                             AS class_name,
    fa.total_billed,
    fa.total_paid,
    fa.balance,
    fa.status                          AS fee_status
FROM students s
JOIN users u         ON u.id = s.user_id
JOIN enrollments e   ON e.student_id = s.id
JOIN classes c       ON c.id = e.class_id
LEFT JOIN fee_accounts fa ON fa.student_id = s.id;
