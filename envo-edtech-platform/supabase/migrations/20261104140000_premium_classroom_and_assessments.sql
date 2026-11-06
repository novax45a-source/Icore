-- ==============================================================================
-- ENVO Commercial Platform - Premium Upgrade Migration
-- Migration: 20261104140000_premium_classroom_and_assessments.sql
-- Features:
--   1. Gender & Audience Preferences on Teacher & Student Profiles
--   2. Subject Catalog with Arabic & German Language Expansion
--   3. Exams, Question Banks, and Exam Submissions System
--   4. Homework Assignments, Submissions & Multi-child Parent Tracking
--   5. Strict Audience Matching Enforcement Function
-- ==============================================================================

-- 1. ENUMS FOR GENDER AND AUDIENCE PREFERENCE
DO $$ BEGIN
  CREATE TYPE envo_gender AS ENUM ('male', 'female');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE envo_audience_preference AS ENUM ('all', 'male_only', 'female_only');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 2. ALTER TEACHER AND USER TABLES
ALTER TABLE public.user_roles 
  ADD COLUMN IF NOT EXISTS gender envo_gender DEFAULT 'male';

-- Independent teachers table / profiles extension
ALTER TABLE public.teacher_wallets
  ADD COLUMN IF NOT EXISTS gender envo_gender DEFAULT 'male',
  ADD COLUMN IF NOT EXISTS audience_preference envo_audience_preference DEFAULT 'all';

-- 3. SUBJECTS CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.envo_subjects (
  id text PRIMARY KEY,
  name_uz text NOT NULL,
  name_en text NOT NULL,
  name_ru text NOT NULL,
  category text NOT NULL DEFAULT 'language', -- 'language', 'stem', 'humanities', 'test_prep'
  icon_name text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Seed core subjects including Arabic and German
INSERT INTO public.envo_subjects (id, name_uz, name_en, name_ru, category, icon_name)
VALUES
  ('ingliz_tili', 'Ingliz tili', 'English Language', 'Английский язык', 'language', 'Globe'),
  ('arab_tili', 'Arab tili', 'Arabic Language', 'Арабский язык', 'language', 'BookOpen'),
  ('nemis_tili', 'Nemis tili', 'German Language', 'Немецкий язык', 'language', 'Languages'),
  ('matematika', 'Matematika', 'Mathematics', 'Математика', 'stem', 'Calculator'),
  ('ona_tili', 'Ona tili va adabiyot', 'Uzbek Language & Literature', 'Родной язык и литература', 'humanities', 'BookText'),
  ('fizika', 'Fizika', 'Physics', 'Физика', 'stem', 'Atom'),
  ('kimyo', 'Kimyo', 'Chemistry', 'Химия', 'stem', 'FlaskConical'),
  ('biologiya', 'Biologiya', 'Biology', 'Биология', 'stem', 'Dna'),
  ('tarix', 'Tarix', 'History', 'История', 'humanities', 'Landmark'),
  ('sat_prep', 'SAT (Verbal & Math)', 'SAT Prep', 'Подготовка к SAT', 'test_prep', 'Sparkles'),
  ('ielts_prep', 'IELTS Preparation', 'IELTS Prep', 'Подготовка к IELTS', 'test_prep', 'Award')
ON CONFLICT (id) DO UPDATE SET
  name_uz = EXCLUDED.name_uz,
  name_en = EXCLUDED.name_en,
  category = EXCLUDED.category;

-- 4. EXAMS AND QUESTION BANKS
CREATE TABLE IF NOT EXISTS public.envo_exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  course_id uuid,
  center_id uuid REFERENCES public.envo_centers(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  duration_minutes integer NOT NULL DEFAULT 45,
  passing_points integer NOT NULL DEFAULT 70,
  total_points integer NOT NULL DEFAULT 100,
  schedule_start timestamptz,
  schedule_end timestamptz,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.envo_exam_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.envo_exams(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'multiple_choice', -- 'multiple_choice', 'written'
  options jsonb, -- array of strings for multiple choice
  correct_option_index integer,
  points integer NOT NULL DEFAULT 10,
  explanation text,
  order_index integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.envo_exam_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.envo_exams(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  score integer,
  percentage numeric(5,2),
  status text NOT NULL DEFAULT 'submitted', -- 'submitted', 'graded'
  teacher_feedback text,
  graded_by uuid REFERENCES auth.users(id),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  graded_at timestamptz
);

-- 5. HOMEWORK ASSIGNMENTS & SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.envo_homework_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  subject text NOT NULL,
  group_id uuid,
  center_id uuid REFERENCES public.envo_centers(id) ON DELETE CASCADE,
  assigned_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by_name text NOT NULL,
  due_date timestamptz NOT NULL,
  attachment_url text,
  max_score integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.envo_homework_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.envo_homework_assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  content text,
  file_url text,
  file_name text,
  score integer,
  teacher_feedback text,
  status text NOT NULL DEFAULT 'submitted', -- 'submitted', 'graded', 'resubmit_requested'
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

-- 6. AUDIENCE MATCHING VALIDATION FUNCTION
-- Enforces that male students cannot enroll in female_only groups, and female students cannot enroll in male_only groups.
CREATE OR REPLACE FUNCTION public.check_teacher_audience_eligibility(
  p_teacher_audience text,
  p_student_gender text
)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF p_teacher_audience = 'all' OR p_teacher_audience IS NULL THEN
    RETURN true;
  ELSIF p_teacher_audience = 'male_only' AND p_student_gender = 'male' THEN
    RETURN true;
  ELSIF p_teacher_audience = 'female_only' AND p_student_gender = 'female' THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$;

-- 7. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.envo_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.envo_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.envo_exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.envo_exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.envo_homework_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.envo_homework_submissions ENABLE ROW LEVEL SECURITY;

-- Read policies
DROP POLICY IF EXISTS "Public can view active subjects" ON public.envo_subjects;
CREATE POLICY "Public can view active subjects" ON public.envo_subjects
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Students and teachers can view exams" ON public.envo_exams;
CREATE POLICY "Students and teachers can view exams" ON public.envo_exams
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Students can view exam questions" ON public.envo_exam_questions;
CREATE POLICY "Students can view exam questions" ON public.envo_exam_questions
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can view own exam submissions" ON public.envo_exam_submissions;
CREATE POLICY "Users can view own exam submissions" ON public.envo_exam_submissions
  FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role IN ('super_admin', 'lc_admin', 'teacher')
  ));

DROP POLICY IF EXISTS "Users can view homework assignments" ON public.envo_homework_assignments;
CREATE POLICY "Users can view homework assignments" ON public.envo_homework_assignments
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can view own homework submissions" ON public.envo_homework_submissions;
CREATE POLICY "Users can view own homework submissions" ON public.envo_homework_submissions
  FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role IN ('super_admin', 'lc_admin', 'teacher')
  ));
