-- Creates the parent_student mapping table if it does not exist.
-- This is needed before RLS policies can reference it.

CREATE TABLE IF NOT EXISTS public.parent_student (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL DEFAULT 'parent',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (parent_id, student_id)
);

-- Index for fast parent-to-child lookups
CREATE INDEX IF NOT EXISTS idx_parent_student_parent ON public.parent_student(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_student ON public.parent_student(student_id);

-- Enable RLS on the mapping table
ALTER TABLE public.parent_student ENABLE ROW LEVEL SECURITY;

-- Parents can see only their own mappings
CREATE POLICY "parent_student_select_own" ON public.parent_student
  FOR SELECT USING (parent_id = auth.uid());

-- Admins can see all mappings in their school
CREATE POLICY "parent_student_select_admin" ON public.parent_student
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only backend (service role) can insert links
CREATE POLICY "parent_student_insert_backend" ON public.parent_student
  FOR INSERT WITH CHECK (false);
