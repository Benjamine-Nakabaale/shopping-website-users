import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://qijksonqrtuqutnmwslc.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpamtzb25xcnR1cXV0bm13c2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjUzNTQsImV4cCI6MjA2NDQ0MTM1NH0.gcVvSds425FUK1PGjl9PrQwt4BfYO2tYbPLhX8fB1-Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);