/**
 * Project Store Module (Supabase Edition)
 * Centralized data persistence layer using Supabase.
 * Replaces localStorage with real Cloud DB.
 */

class ProjectStore {
  constructor() {
    this.supabase = window.getSupabase();
    this.authService = new window.AuthService();
  }

  /**
   * Save the current project state to Supabase
   * @param {Object} data - The project data to save
   * @returns {Promise<Object>} - The saved project record
   */
  async saveProject(data) {
    try {
      const user = await this.authService.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { content, templateId, templatePath, schemaVersion } = data;
      
      // Preparar payload para DB
      // Nota: Guardamos template info dentro de structured_data ya que la tabla no tiene columna template_id
      const projectPayload = {
        user_id: user.id,
        name: content.titulo || 'Nuevo Proyecto',
        prompt: content.originalPrompt || 'Generado con IA', // Asegúrate de pasar esto desde el controller
        structured_data: {
          ...content,
          _meta: {
            templateId,
            templatePath,
            schemaVersion: String(schemaVersion || '1')
          }
        },
        created_at: new Date().toISOString()
      };

      // Insertar en Supabase (tabla 'projects')
      const { data: savedProject, error } = await this.supabase
        .from('projects')
        .insert([projectPayload])
        .select()
        .single();

      if (error) throw error;

      console.log('Project saved to Supabase:', savedProject);
      
      // Guardar ID en sessionStorage para referencia inmediata si se necesita
      sessionStorage.setItem('currentProjectId', savedProject.id);

      return savedProject;

    } catch (error) {
      console.error('Failed to save project to Supabase:', error);
      
      // Fallback: Guardar en localStorage si falla la red (Optimistic)
      // Esto es temporal para no perder datos del usuario
      this._saveLocalBackup(data);
      
      throw new Error('Error guardando en la nube. Se ha guardado una copia local de emergencia.');
    }
  }

  /**
   * Load a project by ID
   * @param {string} projectId 
   */
  async loadProject(projectId) {
    if (!projectId) return null;

    try {
      const { data, error } = await this.supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Reconstruir formato esperado por TemplateManager
      const meta = data.structured_data._meta || {};
      
      return {
        content: data.structured_data,
        templateId: meta.templateId,
        templatePath: meta.templatePath,
        schemaVersion: meta.schemaVersion || '1',
        id: data.id,
        name: data.name
      };

    } catch (error) {
      console.error('Error loading project:', error);
      return null;
    }
  }

  /**
   * Get all projects for current user
   */
  async getUserProjects() {
    try {
      const user = await this.authService.getUser();
      if (!user) return [];

      const { data, error } = await this.supabase
        .from('projects')
        .select('id, name, created_at, prompt')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  /**
   * Clears current session context
   * (Doesn't delete from DB, just clears active session pointers)
   */
  clearCurrentContext() {
    sessionStorage.removeItem('currentProjectId');
    localStorage.removeItem('syncelle_backup_content');
    localStorage.removeItem('syncelle_site_data'); // V2 data
    console.log('Project context cleared');
  }

  /**
   * Private backup for network failures
   */
  _saveLocalBackup(data) {
    localStorage.setItem('syncelle_backup_content', JSON.stringify(data));
  }
}

window.ProjectStore = ProjectStore;
