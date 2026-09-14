-- =============================================================================
-- EduCore School Management System — PostgreSQL Schema
-- Version: 1.0.0  |  Date: 2026-09-12
-- Supports: Multi-tenancy (school_id on every major table)
--           High School & Primary School portals
--           M-Pesa STK Push fee payment integration
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "citext";     -- case-insensitive email


-- ---------------------------------------------------------------------------
-- ENUM Types
-- ---------------------------------------------------------------------------
CREATE TYPE school_type          AS ENUM ('primary', 'secondary', 'mixed');
CREATE TYPE user_role            AS ENUM ('superadmin', 'admin', 'teacher', 'staff', 'parent', 'student');
CREATE TYPE gender_type          AS ENUM ('male', 'female', 'other');
CREATE TYPE student_status       AS ENUM ('active', 'transferred', 'graduated', 'suspended', 'expelled');
CREATE TYPE employment_type      AS ENUM ('permanent', 'contract', 'bom');       -- bom = Board of Management
CREATE TYPE staff_employment     AS ENUM ('permanent', 'contract', 'casual');
CREATE TYPE day_of_week          AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday');
CREATE TYPE attendance_status    AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE exam_type            AS ENUM ('opener', 'midterm', 'endterm', 'mock', 'kcse', 'kcpe');
CREATE TYPE fee_status           AS ENUM ('unpaid', 'partial', 'paid');
CREATE TYPE payment_method       AS ENUM ('mpesa', 'cash', 'bank', 'airtel_money', 'equity');
CREATE TYPE transaction_status   AS ENUM ('pending', 'success', 'failed', 'reversed');
CREATE TYPE target_audience      AS ENUM ('all', 'students', 'parents', 'teachers', 'staff');


-- =============================================================================
-- 1. SCHOOLS  (top-level multi-tenant anchor)
-- =============================================================================
CREATE TABLE schools (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT            NOT NULL,
    type            school_type     NOT NULL,
    county          TEXT,
    sub_county      TEXT,
    knec_code       TEXT            UNIQUE,          -- Government registration code
    logo_url        TEXT,
    principal_name  TEXT,
    phone           TEXT,
    email           CITEXT,
    mpesa_paybill   TEXT,                            -- For M-Pesa fee payments
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_schools_knec ON schools (knec_code);


-- =============================================================================
-- 2. USERS  (universal auth table — all roles)
-- =============================================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID            REFERENCES schools (id) ON DELETE CASCADE,
    email           CITEXT          UNIQUE NOT NULL,
    phone           TEXT,
    password_hash   TEXT            NOT NULL,        -- bcrypt
    role            user_role       NOT NULL,
    first_name      TEXT            NOT NULL,
    last_name       TEXT            NOT NULL,
    gender          gender_type,
    date_of_birth   DATE,
    avatar_url      TEXT,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    last_login      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_school    ON users (school_id);
CREATE INDEX idx_users_role      ON users (role);
CREATE INDEX idx_users_email     ON users (email);


-- =============================================================================
-- 3. ACADEMIC YEARS
-- =============================================================================
CREATE TABLE academic_years (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID            NOT NULL REFERENCES schools (id) ON DELETE CASCADE,
    year            INT             NOT NULL,                -- e.g. 2026
    is_current      BOOLEAN         NOT NULL DEFAULT FALSE,
    UNIQUE (school_id, year)
);

-- Enforce only ONE current year per school via partial unique index
CREATE UNIQUE INDEX idx_academic_years_current
    ON academic_years (school_id)
    WHERE is_current = TRUE;


-- =============================================================================
-- 4. TERMS
-- =============================================================================
CREATE TABLE terms (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID            NOT NULL REFERENCES schools (id) ON DELETE CASCADE,
    academic_year_id    UUID            NOT NULL REFERENCES academic_years (id) ON DELETE CASCADE,
    term_number         INT             NOT NULL CHECK (term_number BETWEEN 1 AND 3),
    start_date          DATE            NOT NULL,
    end_date            DATE            NOT NULL,
    is_current          BOOLEAN         NOT NULL DEFAULT FALSE,
    UNIQUE (school_id, academic_year_id, term_number),
    CONSTRAINT terms_dates_valid CHECK (end_date > start_date)
);

CREATE UNIQUE INDEX idx_terms_current
    ON terms (school_id)
    WHERE is_current = TRUE;


-- =============================================================================
-- 5. STUDENTS  (extended profile for role = 'student')
-- =============================================================================
CREATE TABLE students (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID            NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    school_id               UUID            NOT NULL REFERENCES schools (id) ON DELETE CASCADE,
    admission_number        TEXT            NOT NULL,
    admission_date          DATE,
    kcpe_marks              INT,                            -- Entry marks for secondary
    parent_id               UUID            REFERENCES users (id),          -- Parent's user account
    guardian_name           TEXT,
    guardian_phone          TEXT,
    guardian_relationship   TEXT,
    special_needs           TEXT,
    status                  student_status  NOT NULL DEFAULT 'active',
    UNIQUE (school_id, admission_number)
);

CREATE INDEX idx_students_school      ON students (school_id);
CREATE INDEX idx_students_parent      ON students (parent_id);
CREATE INDEX idx_students_status      ON students (status);


-- =============================================================================
-- 6. CLASSES  (e.g. "Form 3 East", "Grade 5 Blue")
-- =============================================================================
CREATE TABLE classes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID            NOT NULL REFERENCES schools (id) ON DELETE CASCADE,
    name                TEXT            NOT NULL,           -- e.g. "Form 3 East"
    level               TEXT            NOT NULL,           -- e.g. "Form 3", "Grade 5"
    stream              TEXT,                               -- e.g. "East", "Blue"
    class_teacher_id    UUID            REFERENCES users (id),
    capacity            INT,
    academic_year_id    UUID            NOT NULL REFERENCES academic_years (id) ON DELETE CASCADE
);

CREATE INDEX idx_classes_school       ON classes (school_id);
CREATE INDEX idx_classes_year         ON classes (academic_year_id);


-- =============================================================================
-- 7. ENROLLMENTS  (student ↔ class junction)
-- =============================================================================
CREATE TABLE enrollments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id          UUID            NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    class_id            UUID            NOT NULL REFERENCES classes (id) ON DELETE CASCADE,
    academic_year_id    UUID            NOT NULL REFERENCES academic_years (id) ON DELETE CASCADE,
    roll_number         INT,                                -- Position in class register
    enrolled_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, academic_year_id)                  -- One class per student per year
);

CREATE INDEX idx_enrollments_class    ON enrollments (class_id);
CREATE INDEX idx_enrollments_student  ON enrollments (student_id);


-- =============================================================================
-- 8. TEACHERS  (extended profile for role = 'teacher')
-- =============================================================================
CREATE TABLE teachers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID            NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    school_id           UUID            NOT NULL REFERENCES schools (id) ON DELETE CASCADE,
    tsc_number          TEXT,                               -- Teacher Service Commission #
    employee_number     TEXT,
    specialization      TEXT,                               -- Main subject(s) they teach
    employment_type     employment_type NOT NULL DEFAULT 'permanent',
    date_employed       DATE
);

CREATE INDEX idx_teachers_school      ON teachers (school_id);


-- =============================================================================
-- 9. STAFF  (non-teaching: bursar, secretary, librarian …)
-- =============================================================================
CREATE TABLE staff (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID            NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    school_id           UUID            NOT NULL REFERENCES schools (id) ON DELETE CASCADE,
    employee_number     TEXT,
    department          TEXT,                               -- e.g. "Finance", "Library"
    position            TEXT,                               -- e.g. "Bursar", "Secretary"
    employment_type     staff_employment NOT NULL DEFAULT 'permanent',
    date_employed       DATE
);

CREATE INDEX idx_staff_school         ON staff (school_id);


-- =============================================================================
-- 10. SUBJECTS
-- =============================================================================
CREATE TABLE subjects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID            NOT NULL REFERENCES schools (id) ON DELETE CASCADE,
    name            TEXT            NOT NULL,               -- e.g. "Mathematics"
    code            TEXT            NOT NULL,               -- e.g. "MATH"
    category        TEXT,                                   -- e.g. "Compulsory", "Science"
    is_examinable   BOOLEAN         NOT NULL DEFAULT TRUE,
    UNIQUE (school_id, code)
);

CREATE INDEX idx_subjects_school      ON subjects (school_id);


-- =============================================================================
-- 11. CLASS_SUBJECTS  (teacher ↔ class ↔ subject assignment)
-- =============================================================================
CREATE TABLE class_subjects (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id            UUID            NOT NULL REFERENCES classes (id) ON DELETE CASCADE,
    subject_id          UUID            NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
    teacher_id          UUID            NOT NULL REFERENCES teachers (id) ON DELETE CASCADE,
    academic_year_id    UUID            NOT NULL REFERENCES academic_years (id) ON DELETE CASCADE,
    lessons_per_week    INT             DEFAULT 0,
    UNIQUE (class_id, subject_id, academic_year_id)
);

CREATE INDEX idx_cs_class             ON class_subjects (class_id);
CREATE INDEX idx_cs_teacher           ON class_subjects (teacher_id);


-- =============================================================================
-- 12. TIMETABLE_SLOTS
-- =============================================================================
CREATE TABLE timetable_slots (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_subject_id    UUID            NOT NULL REFERENCES class_subjects (id) ON DELETE CASCADE,
    day_of_week         day_of_week     NOT NULL,
    start_time          TIME            NOT NULL,
    end_time            TIME            NOT NULL,
    room                TEXT,
    term_id             UUID            NOT NULL REFERENCES terms (id) ON DELETE CASCADE,
    CONSTRAINT timetable_times_valid CHECK (end_time > start_time)
);

CREATE INDEX idx_timetable_term       ON timetable_slots (term_id);
CREATE INDEX idx_timetable_cs         ON timetable_slots (class_subject_id);


-- =============================================================================
-- 13. ATTENDANCE
-- =============================================================================
CREATE TABLE attendance (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID                NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    class_id        UUID                NOT NULL REFERENCES classes (id) ON DELETE CASCADE,
    date            DATE                NOT NULL,
    status          attendance_status   NOT NULL,
    notes           TEXT,
    recorded_by     UUID                NOT NULL REFERENCES users (id),
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, date)                               -- One record per student per day
);

CREATE INDEX idx_attendance_student   ON attendance (student_id);
CREATE INDEX idx_attendance_class     ON attendance (class_id);
CREATE INDEX idx_attendance_date      ON attendance (date);


-- =============================================================================
-- 14. EXAMS
-- =============================================================================
CREATE TABLE exams (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id   UUID            NOT NULL REFERENCES schools (id) ON DELETE CASCADE,
    term_id     UUID            NOT NULL REFERENCES terms (id) ON DELETE CASCADE,
    name        TEXT            NOT NULL,               -- e.g. "Term 1 Mid-Term"
    type        exam_type       NOT NULL,
    start_date  DATE,
    end_date    DATE,
    max_marks   INT             NOT NULL DEFAULT 100,
    CONSTRAINT exams_dates_valid CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_exams_school         ON exams (school_id);
CREATE INDEX idx_exams_term           ON exams (term_id);


-- =============================================================================
-- 15. EXAM_RESULTS
-- =============================================================================
CREATE TABLE exam_results (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id         UUID            NOT NULL REFERENCES exams (id) ON DELETE CASCADE,
    student_id      UUID            NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    subject_id      UUID            NOT NULL REFERENCES subjects (id) ON DELETE CASCADE,
    marks_obtained  DECIMAL(5,2)    NOT NULL CHECK (marks_obtained >= 0),
    grade           TEXT,                               -- A, B+, B, C+ … or 1-12 for CBC
    points          INT,                                -- For mean grade calculation
    remarks         TEXT,
    entered_by      UUID            NOT NULL REFERENCES users (id),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    UNIQUE (exam_id, student_id, subject_id)
);

CREATE INDEX idx_results_exam         ON exam_results (exam_id);
CREATE INDEX idx_results_student      ON exam_results (student_id);


-- =============================================================================
-- 16. FEE_STRUCTURES  (what a school charges per term)
-- =============================================================================
CREATE TABLE fee_structures (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id   UUID            NOT NULL REFERENCES schools (id) ON DELETE CASCADE,
    term_id     UUID            NOT NULL REFERENCES terms (id) ON DELETE CASCADE,
    class_level TEXT            NOT NULL,               -- e.g. "Form 1", "Grade 4"
    item_name   TEXT            NOT NULL,               -- e.g. "Tuition", "Boarding"
    amount      DECIMAL(12,2)   NOT NULL CHECK (amount >= 0)
);

CREATE INDEX idx_fee_structures_term  ON fee_structures (term_id);


-- =============================================================================
-- 17. FEE_ACCOUNTS  (one ledger per student per term)
-- =============================================================================
CREATE TABLE fee_accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID            NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    term_id         UUID            NOT NULL REFERENCES terms (id) ON DELETE CASCADE,
    total_billed    DECIMAL(12,2)   NOT NULL DEFAULT 0 CHECK (total_billed >= 0),
    total_paid      DECIMAL(12,2)   NOT NULL DEFAULT 0 CHECK (total_paid >= 0),
    -- PostgreSQL generated column: balance computed automatically
    balance         DECIMAL(12,2)   GENERATED ALWAYS AS (total_billed - total_paid) STORED,
    status          fee_status      NOT NULL DEFAULT 'unpaid',
    UNIQUE (student_id, term_id)
);

CREATE INDEX idx_fee_accounts_student ON fee_accounts (student_id);
CREATE INDEX idx_fee_accounts_term    ON fee_accounts (term_id);
CREATE INDEX idx_fee_accounts_status  ON fee_accounts (status);


-- =============================================================================
-- 18. FEE_TRANSACTIONS  (every payment event: M-Pesa / cash / bank)
-- =============================================================================
CREATE TABLE fee_transactions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fee_account_id          UUID                NOT NULL REFERENCES fee_accounts (id) ON DELETE CASCADE,
    student_id              UUID                NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    amount                  DECIMAL(12,2)       NOT NULL CHECK (amount > 0),
    payment_method          payment_method      NOT NULL,
    reference               TEXT,                               -- Transaction ID / receipt #
    mpesa_receipt           TEXT,                               -- e.g. QWE12345
    mpesa_phone             TEXT,
    checkout_request_id     TEXT,                               -- Safaricom STK Push ID
    status                  transaction_status  NOT NULL DEFAULT 'pending',
    recorded_by             UUID                REFERENCES users (id),
    paid_at                 TIMESTAMPTZ,
    created_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fee_txn_account      ON fee_transactions (fee_account_id);
CREATE INDEX idx_fee_txn_student      ON fee_transactions (student_id);
CREATE INDEX idx_fee_txn_checkout     ON fee_transactions (checkout_request_id);  -- STK Push lookup
CREATE INDEX idx_fee_txn_status       ON fee_transactions (status);


-- =============================================================================
-- 19. BOOKS  (library catalogue)
-- =============================================================================
CREATE TABLE books (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id           UUID            NOT NULL REFERENCES schools (id) ON DELETE CASCADE,
    title               TEXT            NOT NULL,
    author              TEXT,
    isbn                TEXT,
    category            TEXT,
    total_copies        INT             NOT NULL DEFAULT 1 CHECK (total_copies >= 0),
    available_copies    INT             NOT NULL DEFAULT 1 CHECK (available_copies >= 0),
    cover_url           TEXT,
    CONSTRAINT books_copies_valid CHECK (available_copies <= total_copies)
);

CREATE INDEX idx_books_school         ON books (school_id);


-- =============================================================================
-- 20. LIBRARY_LOANS
-- =============================================================================
CREATE TABLE library_loans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id         UUID            NOT NULL REFERENCES books (id) ON DELETE CASCADE,
    student_id      UUID            NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    borrowed_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    due_at          TIMESTAMPTZ     NOT NULL,
    returned_at     TIMESTAMPTZ,                        -- NULL = still borrowed
    fine_amount     DECIMAL(8,2)    NOT NULL DEFAULT 0 CHECK (fine_amount >= 0),
    issued_by       UUID            NOT NULL REFERENCES users (id),  -- Librarian
    CONSTRAINT loans_dates_valid CHECK (due_at > borrowed_at)
);

CREATE INDEX idx_loans_student        ON library_loans (student_id);
CREATE INDEX idx_loans_book           ON library_loans (book_id);
CREATE INDEX idx_loans_returned       ON library_loans (returned_at) WHERE returned_at IS NULL;


-- =============================================================================
-- 21. MESSAGES  (internal messaging)
-- =============================================================================
CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID            NOT NULL REFERENCES schools (id) ON DELETE CASCADE,
    sender_id       UUID            NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    recipient_id    UUID            NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    subject         TEXT,
    body            TEXT            NOT NULL,
    is_read         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_recipient   ON messages (recipient_id);
CREATE INDEX idx_messages_sender      ON messages (sender_id);
CREATE INDEX idx_messages_school      ON messages (school_id);
CREATE INDEX idx_messages_unread      ON messages (recipient_id) WHERE is_read = FALSE;


-- =============================================================================
-- 22. NOTIFICATIONS  (system-generated alerts)
-- =============================================================================
CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID            NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    type        TEXT            NOT NULL,       -- e.g. 'fee_reminder', 'result_published'
    title       TEXT            NOT NULL,
    body        TEXT            NOT NULL,
    is_read     BOOLEAN         NOT NULL DEFAULT FALSE,
    action_url  TEXT,                           -- Deep link within app
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user   ON notifications (user_id);
CREATE INDEX idx_notifications_unread ON notifications (user_id) WHERE is_read = FALSE;


-- =============================================================================
-- 23. ANNOUNCEMENTS  (school-wide or class-specific notices)
-- =============================================================================
CREATE TABLE announcements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID            NOT NULL REFERENCES schools (id) ON DELETE CASCADE,
    author_id       UUID            NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title           TEXT            NOT NULL,
    body            TEXT            NOT NULL,
    target_audience target_audience NOT NULL DEFAULT 'all',
    class_id        UUID            REFERENCES classes (id) ON DELETE SET NULL,  -- If class-specific
    published_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ
);

CREATE INDEX idx_announcements_school     ON announcements (school_id);
CREATE INDEX idx_announcements_class      ON announcements (class_id);
CREATE INDEX idx_announcements_audience   ON announcements (target_audience);
CREATE INDEX idx_announcements_expires    ON announcements (school_id, expires_at);
-- Filter active announcements in queries: WHERE expires_at IS NULL OR expires_at > NOW()


-- =============================================================================
-- Helpful Views
-- =============================================================================

-- Current student balances (outstanding fees)
CREATE OR REPLACE VIEW v_outstanding_fees AS
SELECT
    fa.id               AS fee_account_id,
    s.admission_number,
    u.first_name || ' ' || u.last_name  AS student_name,
    c.name              AS class_name,
    t.term_number,
    ay.year,
    fa.total_billed,
    fa.total_paid,
    fa.balance,
    fa.status
FROM fee_accounts fa
JOIN students    s  ON s.id  = fa.student_id
JOIN users       u  ON u.id  = s.user_id
JOIN terms       t  ON t.id  = fa.term_id
JOIN academic_years ay ON ay.id = t.academic_year_id
LEFT JOIN enrollments e ON e.student_id = fa.student_id
                       AND e.academic_year_id = t.academic_year_id
LEFT JOIN classes  c ON c.id = e.class_id;


-- Current term attendance summary per student
CREATE OR REPLACE VIEW v_attendance_summary AS
SELECT
    a.student_id,
    a.class_id,
    COUNT(*) FILTER (WHERE a.status = 'present')  AS days_present,
    COUNT(*) FILTER (WHERE a.status = 'absent')   AS days_absent,
    COUNT(*) FILTER (WHERE a.status = 'late')     AS days_late,
    COUNT(*) FILTER (WHERE a.status = 'excused')  AS days_excused,
    COUNT(*)                                       AS total_days
FROM attendance a
GROUP BY a.student_id, a.class_id;


-- =============================================================================
-- Trigger: auto-update fee_accounts.status when total_paid changes
-- =============================================================================
CREATE OR REPLACE FUNCTION trg_update_fee_status()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.status :=
        CASE
            WHEN NEW.total_paid = 0                         THEN 'unpaid'::fee_status
            WHEN NEW.total_paid >= NEW.total_billed         THEN 'paid'::fee_status
            ELSE                                                 'partial'::fee_status
        END;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_fee_accounts_status
    BEFORE INSERT OR UPDATE OF total_paid, total_billed ON fee_accounts
    FOR EACH ROW EXECUTE FUNCTION trg_update_fee_status();


-- =============================================================================
-- Trigger: update available_copies when a library loan is created / returned
-- =============================================================================
CREATE OR REPLACE FUNCTION trg_book_loan_copies()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE books SET available_copies = available_copies - 1
        WHERE id = NEW.book_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.returned_at IS NULL AND NEW.returned_at IS NOT NULL THEN
        UPDATE books SET available_copies = available_copies + 1
        WHERE id = NEW.book_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_library_loans_copies
    AFTER INSERT OR UPDATE OF returned_at ON library_loans
    FOR EACH ROW EXECUTE FUNCTION trg_book_loan_copies();


-- =============================================================================
-- Row-Level Security (RLS) — enable per table (configure policies in Supabase)
-- =============================================================================
ALTER TABLE schools          ENABLE ROW LEVEL SECURITY;
ALTER TABLE users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years   ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms            ENABLE ROW LEVEL SECURITY;
ALTER TABLE students         ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff            ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects   ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots  ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance       ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams            ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results     ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures   ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_accounts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE books            ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_loans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements    ENABLE ROW LEVEL SECURITY;

-- Example RLS policy (school-scoped isolation):
-- CREATE POLICY school_isolation ON students
--     USING (school_id = current_setting('app.current_school_id')::UUID);


-- =============================================================================
-- Auth Trigger — auto-create public.users on Supabase Auth sign-up
-- =============================================================================
-- This function fires every time a new user registers via Supabase Auth.
-- It reads the metadata passed during signUpUser() and inserts a matching
-- row into public.users so all other tables can reference it.

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER                       -- runs as owner, bypasses RLS
SET search_path = public
AS $$
DECLARE
  v_role      user_role;
  v_school_id UUID;
BEGIN
  -- Handle NULLs securely by defaulting to 'parent'
  BEGIN
    v_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'parent'::user_role);
  EXCEPTION WHEN OTHERS THEN
    v_role := 'parent'::user_role;
  END;

  BEGIN
    v_school_id := (NEW.raw_user_meta_data->>'school_id')::UUID;
  EXCEPTION WHEN OTHERS THEN
    v_school_id := NULL;
  END;

  INSERT INTO public.users (
    id,
    school_id,
    email,
    phone,
    password_hash,
    role,
    first_name,
    last_name,
    is_active,
    created_at
  ) VALUES (
    NEW.id,
    v_school_id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    'supabase_auth',                   -- placeholder: real auth is handled by Supabase
    v_role,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(NEW.raw_user_meta_data->>'last_name',  'User'),
    TRUE,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;        -- idempotent: won't duplicate if trigger fires twice

  RETURN NEW;
END;
$$;

-- Attach the trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();


-- =============================================================================
-- RLS Policies — allow authenticated users to write their own data
-- =============================================================================

-- public.users: owner can read & update their own row
CREATE POLICY "users_select_own"   ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own"   ON users FOR UPDATE USING (auth.uid() = id);

-- students: new user can insert their own student profile
CREATE POLICY "students_insert_own" ON students FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "students_select_own" ON students FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = parent_id);

-- teachers: teacher can insert/update their own profile
CREATE POLICY "teachers_insert_own" ON teachers FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "teachers_select_own" ON teachers FOR SELECT
  USING (auth.uid() = user_id);

-- staff: staff can insert/update their own profile
CREATE POLICY "staff_insert_own" ON staff FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "staff_select_own"  ON staff FOR SELECT
  USING (auth.uid() = user_id);

