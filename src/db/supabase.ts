import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pahjkcjiwxhohqfuurhw.supabase.co'
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhaGprY2ppd3hob2hxZnV1cmh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjU4NjMsImV4cCI6MjA3ODU0MTg2M30.pFBYXFTYBSJHxAsPit0rUkZhnoD67KSSwYHFjBtN0iM" as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

