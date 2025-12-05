import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ydvgyrlbfeihnekfolvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkdmd5cmxiZmVpaG5la2ZvbHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MDcyODAsImV4cCI6MjA4MDQ4MzI4MH0.MzOztB_Al0FV_krl1wId_WxHLYty72mDqNPUbLz3IB8';

// Initialize the Supabase client with explicit auth settings for browser environment stability
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});