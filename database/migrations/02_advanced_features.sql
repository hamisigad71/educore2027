-- =============================================================================
-- EduCore Extensions Schema — High-Value Strategic Features Migration
-- Features:
-- 1. Official Stamped Fee Receipts (with verification QR code & digital signatures)
-- 2. CBC Rubric Assessments (EE, ME, AE, BE strands & competencies)
-- 3. Gate Pass & Exeat Tracking (Boarding & Day school security checks)
-- 4. NEMIS / UPI Synchronizer Tracking & Audit
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ENUM Types for New Capabilities
-- ---------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE cbc_performance_level AS ENUM (
        'EE', -- Exceeding Expectation (80 - 100%)
        'ME', -- Meeting Expectation   (65 - 79%)
        'AE', -- Approaching Expectation (50 - 64%)
        'BE'  -- Below Expectation     (0 - 49%)
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE exeat_status AS ENUM (
        'requested', 'approved', 'departed', 'returned', 'overdue', 'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 1. OFFICIAL STAMPED FEE RECEIPTS & TRANSACTIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS official_receipts (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id         UUID REFERENCES schools (id) ON DELETE CASCADE,
    student_id        UUID REFERENCES students (id) ON DELETE CASCADE,
    receipt_number    TEXT UNIQUE NOT NULL,            -- e.g. RCP-2026-00412
    amount_paid       NUMERIC(12, 2) NOT NULL,
    total_balance     NUMERIC(12, 2) NOT NULL,
    payment_method    payment_method NOT NULL DEFAULT 'mpesa',
    transaction_ref   TEXT NOT NULL,                   -- M-Pesa Code / Bank Ref
    term              academic_term NOT NULL,
    year              INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    issued_by_name    TEXT NOT NULL DEFAULT 'Bursar Office',
    digital_signature TEXT,                            -- Cryptographic seal or hash
    qr_verify_url     TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_receipts_student ON official_receipts (student_id);
CREATE INDEX IF NOT EXISTS idx_receipts_number  ON official_receipts (receipt_number);


-- =============================================================================
-- 2. CBC RUBRICS & STRANDS ASSESSMENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS cbc_assessments (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id         UUID REFERENCES schools (id) ON DELETE CASCADE,
    student_id        UUID REFERENCES students (id) ON DELETE CASCADE,
    teacher_id        UUID REFERENCES teachers (id) ON DELETE SET NULL,
    class_id          UUID REFERENCES classes (id) ON DELETE CASCADE,
    learning_area     TEXT NOT NULL,                   -- e.g. Mathematics Activities, Science & Tech
    strand            TEXT NOT NULL,                   -- e.g. Numbers, Living Things
    sub_strand        TEXT NOT NULL,                   -- e.g. Fractions, Plant Nutrition
    level             cbc_performance_level NOT NULL,  -- EE, ME, AE, BE
    term              academic_term NOT NULL,
    year              INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    teacher_comment   TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cbc_student ON cbc_assessments (student_id);
CREATE INDEX IF NOT EXISTS idx_cbc_class   ON cbc_assessments (class_id);


-- =============================================================================
-- 3. GATE PASS & EXEAT CLEARANCE TRACKING
-- =============================================================================
CREATE TABLE IF NOT EXISTS gate_exeats (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id         UUID REFERENCES schools (id) ON DELETE CASCADE,
    student_id        UUID REFERENCES students (id) ON DELETE CASCADE,
    reason            TEXT NOT NULL,                   -- Medical, Midterm, Compassionate, Academic
    destination       TEXT NOT NULL,
    authorized_by     UUID REFERENCES users (id) ON DELETE SET NULL,
    guardian_contact  TEXT,
    departure_time    TIMESTAMPTZ,
    expected_return   TIMESTAMPTZ NOT NULL,
    actual_return     TIMESTAMPTZ,
    status            exeat_status NOT NULL DEFAULT 'requested',
    gate_officer_name TEXT,
    qr_pass_code      TEXT UNIQUE NOT NULL,            -- Token scanned at gate
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exeats_student ON gate_exeats (student_id);
CREATE INDEX IF NOT EXISTS idx_exeats_status  ON gate_exeats (status);


-- =============================================================================
-- 4. NEMIS / UPI REGISTRATION AUDIT
-- =============================================================================
CREATE TABLE IF NOT EXISTS nemis_sync_records (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id         UUID REFERENCES schools (id) ON DELETE CASCADE,
    student_id        UUID REFERENCES students (id) ON DELETE CASCADE,
    upi_number        TEXT UNIQUE NOT NULL,            -- Unique Personal Identifier
    birth_cert_no     TEXT,
    nationality       TEXT DEFAULT 'Kenyan',
    special_needs     BOOLEAN DEFAULT FALSE,
    sync_status       TEXT DEFAULT 'synced',           -- 'synced', 'flagged', 'pending'
    last_verified_at  TIMESTAMPTZ DEFAULT NOW(),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nemis_upi ON nemis_sync_records (upi_number);

-- =============================================================================
-- RLS Policies for New Tables
-- =============================================================================
ALTER TABLE official_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cbc_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gate_exeats ENABLE ROW LEVEL SECURITY;
ALTER TABLE nemis_sync_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_receipts" ON official_receipts FOR SELECT USING (true);
CREATE POLICY "public_insert_receipts" ON official_receipts FOR INSERT WITH CHECK (true);

CREATE POLICY "public_read_cbc" ON cbc_assessments FOR SELECT USING (true);
CREATE POLICY "public_insert_cbc" ON cbc_assessments FOR INSERT WITH CHECK (true);

CREATE POLICY "public_read_exeats" ON gate_exeats FOR SELECT USING (true);
CREATE POLICY "public_manage_exeats" ON gate_exeats FOR ALL USING (true);

CREATE POLICY "public_read_nemis" ON nemis_sync_records FOR SELECT USING (true);
CREATE POLICY "public_manage_nemis" ON nemis_sync_records FOR ALL USING (true);

