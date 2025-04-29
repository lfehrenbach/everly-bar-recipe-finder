import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://xmvabbiefgecrewshvzj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdmFiYmllZmdlY3Jld3NodnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NTEwMzAsImV4cCI6MjA2MTEyNzAzMH0.SmGUY25ngFjahczuxvMUyUvyYzyFrNDmoPiAQTquGGs'
)
