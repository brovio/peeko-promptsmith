import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mrvptdrstohszeewchiv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ydnB0ZHJzdG9oc3plZXdjaGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzkzNDIsImV4cCI6MjA1MDU1NTM0Mn0.m5HA-qK0X3w_3E2BUENqG9KVnLh7_P5z8NlAD44l538";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    storage: localStorage,
    flowType: 'pkce',
    debug: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
});

// Add better error handling for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
  
  if (event === 'SIGNED_OUT') {
    // Clear any cached data when signing out
    localStorage.removeItem('supabase.auth.token');
    console.log('User signed out, cleared session data');
  } else if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.id);
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
});