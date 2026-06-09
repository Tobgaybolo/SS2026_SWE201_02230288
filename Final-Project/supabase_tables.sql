-- ============================================================
-- CST INTERNSHIP PORTAL - COMPLETE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- USER ROLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'supervisor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================
-- STUDENT PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  student_id TEXT,
  department TEXT,
  organization TEXT,
  supervisor_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================
-- SUPERVISOR PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.supervisor_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================
-- LOGBOOKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.logbooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  activities_performed TEXT NOT NULL,
  skills_learned TEXT NOT NULL,
  challenges_faced TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'needs_revision')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================
-- LOGBOOK REVIEWS / FEEDBACK TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.logbook_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  logbook_id UUID REFERENCES public.logbooks(id) ON DELETE CASCADE,
  supervisor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  review_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status TEXT NOT NULL DEFAULT 'reviewed' CHECK (status IN ('reviewed', 'approved', 'needs_revision')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================
-- ATTENDANCE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in_time TEXT NOT NULL,
  check_out_time TEXT NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================
-- MONTHLY REFLECTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.monthly_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  reflection_summary TEXT NOT NULL,
  key_achievements TEXT NOT NULL,
  areas_for_improvement TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================
-- PUSH NOTIFICATION TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.push_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  token TEXT NOT NULL,
  platform TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================
-- NOTIFICATIONS LOG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logbook_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES - USER ROLES
-- ============================================================
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role"
  ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES - STUDENT PROFILES
-- ============================================================
CREATE POLICY "Students can view own profile"
  ON public.student_profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Supervisors can view assigned student profiles"
  ON public.student_profiles FOR SELECT
  USING (supervisor_id = auth.uid());

CREATE POLICY "Students can insert own profile"
  ON public.student_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update own profile"
  ON public.student_profiles FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES - SUPERVISOR PROFILES
-- ============================================================
CREATE POLICY "Supervisors can view own profile"
  ON public.supervisor_profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Supervisors can insert own profile"
  ON public.supervisor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Supervisors can update own profile"
  ON public.supervisor_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students can view supervisor profiles"
  ON public.supervisor_profiles FOR SELECT USING (true);

-- ============================================================
-- RLS POLICIES - LOGBOOKS
-- ============================================================
CREATE POLICY "Students can view own logbooks"
  ON public.logbooks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Supervisors can view assigned student logbooks"
  ON public.logbooks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.student_profiles sp
      WHERE sp.user_id = logbooks.user_id
      AND sp.supervisor_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert own logbooks"
  ON public.logbooks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update own logbooks"
  ON public.logbooks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students can delete own logbooks"
  ON public.logbooks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Supervisors can update logbook status"
  ON public.logbooks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.student_profiles sp
      WHERE sp.user_id = logbooks.user_id
      AND sp.supervisor_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES - LOGBOOK REVIEWS
-- ============================================================
CREATE POLICY "Students can view reviews of their logbooks"
  ON public.logbook_reviews FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Supervisors can view their own reviews"
  ON public.logbook_reviews FOR SELECT USING (auth.uid() = supervisor_id);

CREATE POLICY "Supervisors can insert reviews"
  ON public.logbook_reviews FOR INSERT WITH CHECK (auth.uid() = supervisor_id);

CREATE POLICY "Supervisors can update their reviews"
  ON public.logbook_reviews FOR UPDATE USING (auth.uid() = supervisor_id);

-- ============================================================
-- RLS POLICIES - ATTENDANCE
-- ============================================================
CREATE POLICY "Students can view own attendance"
  ON public.attendance FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Supervisors can view assigned student attendance"
  ON public.attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.student_profiles sp
      WHERE sp.user_id = attendance.user_id
      AND sp.supervisor_id = auth.uid()
    )
  );

CREATE POLICY "Students can insert own attendance"
  ON public.attendance FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update own attendance"
  ON public.attendance FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students can delete own attendance"
  ON public.attendance FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES - MONTHLY REFLECTIONS
-- ============================================================
CREATE POLICY "Users can view own reflections"
  ON public.monthly_reflections FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections"
  ON public.monthly_reflections FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections"
  ON public.monthly_reflections FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reflections"
  ON public.monthly_reflections FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES - PUSH TOKENS
-- ============================================================
CREATE POLICY "Users can manage own push token"
  ON public.push_tokens FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES - NOTIFICATIONS
-- ============================================================
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Users can insert notifications"
  ON public.notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can mark own notifications as read"
  ON public.notifications FOR UPDATE USING (auth.uid() = recipient_id);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON public.student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_supervisor_id ON public.student_profiles(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_supervisor_profiles_user_id ON public.supervisor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_logbooks_user_id ON public.logbooks(user_id);
CREATE INDEX IF NOT EXISTS idx_logbooks_date ON public.logbooks(date);
CREATE INDEX IF NOT EXISTS idx_logbooks_status ON public.logbooks(status);
CREATE INDEX IF NOT EXISTS idx_logbook_reviews_logbook_id ON public.logbook_reviews(logbook_id);
CREATE INDEX IF NOT EXISTS idx_logbook_reviews_student_id ON public.logbook_reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_logbook_reviews_supervisor_id ON public.logbook_reviews(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_monthly_reflections_user_id ON public.monthly_reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON public.push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- ============================================================
-- SEED DATA - How to add users with roles:
-- After creating a user in Supabase Auth, run:
-- INSERT INTO public.user_roles (user_id, role) VALUES ('USER_UUID', 'student');
-- INSERT INTO public.user_roles (user_id, role) VALUES ('SUPERVISOR_UUID', 'supervisor');
-- ============================================================
