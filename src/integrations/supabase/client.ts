// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tggcttcrjoyoauuzuiqa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZ2N0dGNyam95b2F1dXp1aXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNjcyMzMsImV4cCI6MjA2ODg0MzIzM30.l5OkLZqesAlawSkXEjXuB4FSUiDDVFJ55q2iWwWPn8Q";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});