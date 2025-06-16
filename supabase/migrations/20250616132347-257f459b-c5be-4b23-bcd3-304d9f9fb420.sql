
-- Ensure pgcrypto extension is available for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create dev_logs table for development dashboard
CREATE TABLE public.dev_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  successes TEXT[] DEFAULT '{}',
  challenges TEXT[] DEFAULT '{}',
  solutions TEXT[] DEFAULT '{}',
  next_steps TEXT,
  stakeholder_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.dev_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users to manage their own logs
CREATE POLICY "Users can view their own dev logs" 
  ON public.dev_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dev logs" 
  ON public.dev_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dev logs" 
  ON public.dev_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dev logs" 
  ON public.dev_logs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_dev_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dev_logs_updated_at
  BEFORE UPDATE ON public.dev_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_dev_logs_updated_at();

-- Add performance index for faster queries by user and date
CREATE INDEX idx_dev_logs_user_date ON public.dev_logs (user_id, date);

-- Add unique constraint to ensure only one log entry per user per date
ALTER TABLE public.dev_logs
  ADD CONSTRAINT unique_user_date UNIQUE (user_id, date);
