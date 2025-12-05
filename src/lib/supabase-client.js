
/**
 * Supabase Client Initialization
 * Centralized configuration for the Supabase client
 */

// Cargar librería desde CDN (UMD) para evitar bundlers complejos por ahora
// En producción, esto debería estar en el HTML o usar un bundler, 
// pero para mantener la arquitectura actual, lo manejamos así.

const SUPABASE_URL = 'https://cmimzbqsoblwszgmkbkb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtaW16YnFzb2Jsd3N6Z21rYmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4OTA4NzIsImV4cCI6MjA4MDQ2Njg3Mn0.mAPUmMZnozHUA4ZMJDkNCeFlYBK8CxBPEcakjy9t7Ek';

let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;

  if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient === 'undefined') {
    console.error('Supabase library not loaded. Make sure to include the CDN script in your HTML.');
    return null;
  }

  // Configuración explícita para asegurar comportamiento V2 y persistencia
  const options = {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  };

  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options);
    
    // Verificación de integridad V2
    if (!supabaseClient || !supabaseClient.auth || typeof supabaseClient.auth.signInWithPassword !== 'function') {
      console.error('CRITICAL: Supabase Client initialized but missing V2 Auth methods. Check CDN version.');
    } else {
      console.log('Supabase Client V2 initialized successfully.');
    }
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }

  return supabaseClient;
}

// Exponer globalmente para módulos que no usen import/export moderno
window.getSupabase = getSupabase;

