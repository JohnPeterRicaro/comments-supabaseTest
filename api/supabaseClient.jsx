import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://yhlbzapdadkgogfywczi.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlobGJ6YXBkYWRrZ29nZnl3Y3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ3NDIwNzUsImV4cCI6MjAwMDMxODA3NX0.8FRCsjEBPQSY8GmNQ5w9yoedYTbUfhmerIx_IKzCnqE')

export default supabase