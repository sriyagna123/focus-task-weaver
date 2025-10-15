-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_classes INTEGER NOT NULL DEFAULT 0,
  attended_classes INTEGER NOT NULL DEFAULT 0,
  required_percentage INTEGER NOT NULL DEFAULT 75,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT valid_attendance CHECK (attended_classes >= 0 AND attended_classes <= total_classes),
  CONSTRAINT valid_percentage CHECK (required_percentage >= 0 AND required_percentage <= 100)
);

-- Enable RLS
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Users can view their own attendance records
CREATE POLICY "Users can view own attendance"
  ON public.attendance_records
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own attendance records
CREATE POLICY "Users can insert own attendance"
  ON public.attendance_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own attendance records
CREATE POLICY "Users can update own attendance"
  ON public.attendance_records
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own attendance records
CREATE POLICY "Users can delete own attendance"
  ON public.attendance_records
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();