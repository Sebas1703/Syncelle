import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cmimzbqsoblwszgmkbkb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtaW16YnFzb2Jsd3N6Z21rYmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4OTA4NzIsImV4cCI6MjA4MDQ2Njg3Mn0.mAPUmMZnozHUA4ZMJDkNCeFlYBK8CxBPEcakjy9t7Ek';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

