/**
 * Auth Service
 * Handles user authentication, session management, and route protection.
 */

class AuthService {
  constructor() {
    this.supabase = window.getSupabase();
  }

  /**
   * Sign up new user
   * @param {string} email 
   * @param {string} password 
   */
  async signUp(email, password) {
    if (!this.supabase) throw new Error("Supabase no inicializado");
    
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign in existing user
   * @param {string} email 
   * @param {string} password 
   */
  async signIn(email, password) {
    if (!this.supabase) throw new Error("Supabase no inicializado");

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign out
   */
  async signOut() {
    if (!this.supabase) return;
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    
    // Redirigir a login tras logout
    window.location.href = '/login.html';
  }

  /**
   * Get current session
   */
  async getSession() {
    if (!this.supabase) return null;
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  /**
   * Get current user
   */
  async getUser() {
    if (!this.supabase) return null;
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  /**
   * Require auth for current page
   * Redirects to login if no user found
   */
  async requireAuth() {
    const user = await this.getUser();
    if (!user) {
      // Guardar URL de intento para redirigir después
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login.html';
      return null;
    }
    return user;
  }
}

window.AuthService = AuthService;

