import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://ticfnujyxksjdfkwuoyk.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpY2ZudWp5eGtzamRma3d1b3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1ODI0OTQsImV4cCI6MjA3MzE1ODQ5NH0.vpjTc2DJXh4uU2_q6OgrXaNGjjNE519-lyqJFB3_ljY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)