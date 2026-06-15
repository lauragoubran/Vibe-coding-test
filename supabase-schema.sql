-- Run this in your Supabase SQL Editor (Database > SQL Editor)

CREATE TABLE responses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  q1_answer text NOT NULL,
  q2_answer text NOT NULL,
  q3_answer text NOT NULL,
  q4_answer text NOT NULL,
  submitted_at timestamptz DEFAULT now()
);

-- Allow anonymous inserts (survey submission)
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a response"
  ON responses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read responses"
  ON responses FOR SELECT
  TO anon
  USING (true);
