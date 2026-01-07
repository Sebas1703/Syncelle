/**
 * App Controller Module
 * Coordinates all AI-related functionality
 * Main entry point for the AI website generation flow
 */

class AppController {
  constructor() {
    this.aiService = new AIService();
    this.templateManager = new TemplateManager();
    this.contentRenderer = new ContentRenderer();
    this.isProcessing = false;
  }

  /**
   * Generate and render a website from business idea
   * @param {string} businessIdea - User's business description
   * @param {HTMLElement} loadingElement - Loading indicator element
   * @returns {Promise<void>}
   */
  async generateWebsite(businessIdea, loadingElement = null) {
    if (this.isProcessing) {
      throw new Error('Already processing a request');
    }

    this.isProcessing = true;
    this._updateLoadingState(loadingElement, getTranslation('generatingContent'));

    try {
      // Step 1: Generate content with AI
      const content = await this.aiService.generateContent(businessIdea);
      
      // CHECK FOR V2 (DESIGN ENGINE)
      if (content.meta && (content.meta.version === "2.0" || content.meta.version === 2)) {
        this._updateLoadingState(loadingElement, getTranslation('savingProject'));
        
        // 1. Guardar en Supabase (Persistencia Real)
        let savedProject;
        try {
           // Pasamos null como template porque es V2 (sin plantilla fija)
           savedProject = await this.templateManager.storeContentAndTemplate(content, null);
        } catch (err) {
           console.error("Error guardando en DB, usando fallback local:", err);
           // Fallback de emergencia
           localStorage.setItem('syncelle_site_data', JSON.stringify(content));
           const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
           window.location.href = isLocal ? 'http://localhost:3000' : '/v2/index.html';
           return;
        }

        const projectId = savedProject.id;
        this._updateLoadingState(loadingElement, getTranslation('startingEngine'));

        // 2. Redirigir a la URL dinámica de Next.js
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isLocal) {
            // Desarrollo: Next.js corre en puerto 3000
            window.location.href = `http://localhost:3000/site/${projectId}`; 
        } else {
            // Producción: Redirigir a la App Next.js en Vercel
            window.location.href = `https://syncelle-98d6nqz13-sebas1703s-projects.vercel.app/site/${projectId}`;
        }
        return;
      }

      // Step 2: Select appropriate template (LEGACY V1)
      this._updateLoadingState(loadingElement, getTranslation('selectingTemplate'));
      const template = this.templateManager.selectTemplate(content, businessIdea);
      
      // Step 3: Store data for rendering
      await this.templateManager.storeContentAndTemplate(content, template);
      
      // Step 4: Navigate to render page
      this._updateLoadingState(loadingElement, getTranslation('preparingView'));
      this._navigateToRender();

    } catch (error) {
      console.error('Website generation failed:', error);
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Render stored content (used in render.html)
   * @param {HTMLIFrameElement} iframe - Iframe element for rendering
   * @param {HTMLElement} errorElement - Error display element
   * @param {HTMLElement} metaElement - Metadata display element
   * @param {HTMLElement} jsonElement - JSON display element
   * @returns {Promise<void>}
   */
  async renderStoredContent(iframe, errorElement = null, metaElement = null, jsonElement = null) {
    try {
      // Load stored data
      const { content, templatePath, templateId, schemaVersion, hasValidData } = 
        await this.templateManager.loadStoredData();

      // Update metadata display
      if (metaElement) {
        this._updateMetadataDisplay(metaElement, schemaVersion, templatePath);
      }

      // Display JSON for debugging
      if (jsonElement && content) {
        jsonElement.textContent = JSON.stringify(content, null, 2);
      }

      // Validate data
      if (!hasValidData) {
        throw new Error(getTranslation('noData'));
      }

      // Initialize renderer and render content
      this.contentRenderer.initialize(iframe);
      await this.contentRenderer.render(content, templatePath);

    } catch (error) {
      console.error('Rendering failed:', error);
      if (errorElement) {
        this._showError(errorElement, error.message);
      }
      throw error;
    }
  }

  /**
   * Clear all stored data
   */
  clearData() {
    this.templateManager.clearStoredData();
  }

  /**
   * Get current processing status
   * @returns {boolean}
   */
  isProcessingRequest() {
    return this.isProcessing;
  }

  /**
   * Get available templates
   * @returns {Array}
   */
  getAvailableTemplates() {
    return this.templateManager.getAllTemplates();
  }

  /**
   * Update loading state
   * @param {HTMLElement} element - Loading element
   * @param {string} message - Loading message
   * @private
   */
  _updateLoadingState(element, message) {
    if (element) {
      element.style.display = 'block';
      element.textContent = message;
    }
  }

  /**
   * Navigate to render page
   * @private
   */
  _navigateToRender() {
    const lang = window.currentLanguage || 'es';
    if (lang === 'en') {
      window.location.href = '/en/ai/render.html';
    } else {
      // Use lowercase 'ai' to match directory structure
      window.location.href = '/ai/render.html';
    }
  }

  /**
   * Update metadata display
   * @param {HTMLElement} element - Metadata element
   * @param {string} schemaVersion - Schema version
   * @param {string} templatePath - Template path
   * @private
   */
  _updateMetadataDisplay(element, schemaVersion, templatePath) {
    element.innerHTML = `
      <span class="badge">schemaVersion: ${schemaVersion}</span>
      <span class="badge">template: ${templatePath || '(no encontrado)'}</span>
    `;
  }

  /**
   * Show error message
   * @param {HTMLElement} element - Error element
   * @param {string} message - Error message
   * @private
   */
  _showError(element, message) {
    element.style.display = 'block';
    element.textContent = message;
  }
}

// Export for use in other modules
window.AppController = AppController;
