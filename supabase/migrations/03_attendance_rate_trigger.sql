-- ============================================================
-- Attendance Rate Trigger
-- Automatically calculates the rolling attendance rate
-- for each student and stores it on students.attendance_rate.
-- Runs every time a row is inserted/updated in the attendance table.
-- ============================================================

-- 1. Add attendance_rate column to students if it doesn't exist
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS attendance_rate NUMERIC(5,2) DEFAULT 0;

-- 2. Create the function that recalculates the rate
CREATE OR REPLACE FUNCTION public.recalculate_attendance_rate()
RETURNS TRIGGER AS $$
DECLARE
  v_total   INTEGER;
  v_present INTEGER;
  v_rate    NUMERIC(5,2);
BEGIN
  -- Count total attendance records for this student
  SELECT COUNT(*) INTO v_total
  FROM public.attendance
  WHERE student_id = NEW.student_id;

  -- Count how many were present
  SELECT COUNT(*) INTO v_present
  FROM public.attendance
  WHERE student_id = NEW.student_id AND status = 'present';

  -- Calculate rate (avoid divide-by-zero)
  IF v_total > 0 THEN
    v_rate := ROUND((v_present::NUMERIC / v_total::NUMERIC) * 100, 2);
  ELSE
    v_rate := 0;
  END IF;

  -- Write rate back to the students table
  UPDATE public.students
  SET attendance_rate = v_rate
  WHERE user_id = NEW.student_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach trigger on attendance table
DROP TRIGGER IF EXISTS on_attendance_update ON public.attendance;
CREATE TRIGGER on_attendance_update
  AFTER INSERT OR UPDATE ON public.attendance
  FOR EACH ROW EXECUTE PROCEDURE public.recalculate_attendance_rate();
