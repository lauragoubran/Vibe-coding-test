import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type SurveyResponse = {
  id: string
  q1_answer: string
  q2_answer: string
  q3_answer: string
  q4_answer: string
  submitted_at: string
}
