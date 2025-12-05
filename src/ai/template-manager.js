/**
 * Template Manager Module
 * Handles template selection and delegates storage to ProjectStore
 */

class TemplateManager {
  constructor() {
    this.templates = this._initializeTemplates();
    this.currentTemplate = null;
    this.projectStore = new ProjectStore(); // Dependency injection ready
  }

  /**
   * Initialize available templates
   * @private
   */
  _initializeTemplates() {
    return [
      {
        id: 'klassy-cafe',
        name: 'Klassy Cafe',
        path: '/templates/klassy/klassy_cafe_actualizada/index.html',
        tags: ['restaurant', 'cafe', 'food', 'elegant', 'classic'],
        description: 'Elegant template perfect for restaurants, cafes, and food businesses',
        dataFields: {
          simple: ['titulo', 'eslogan', 'descripcion', 'cta'],
          arrays: ['beneficios', 'servicios', 'menuItems', 'chefs', 'desayuno', 'almuerzo', 'cena'],
          nested: ['about', 'menu', 'contacto', 'ofertas', 'formulario', 'footer', 'navegacion'],
          totalElements: 150
        }
      },
      {
        id: 'barbershop',
        name: 'Barbershop',
        path: '/templates/Barbershop/index.html',
        tags: ['barbershop', 'barbería', 'peluquería', 'barbero', 'grooming', 'afeitado', 'fade', 'corte', 'haircut'],
        description: 'Professional template perfect for barbershops, hair salons, and grooming businesses',
        dataFields: {
          simple: ['titulo', 'eslogan', 'cta'],
          arrays: ['servicios', 'precios', 'equipo'],
          nested: ['about', 'hero', 'promocion', 'reservas', 'contacto', 'formulario', 'footer'],
          totalElements: 80
        }
      }
    ];
  }

  /**
   * Select the best template based on business content
   * @param {Object} content - Generated content from AI
   * @param {string} originalPrompt - Original user prompt for context
   * @returns {Object} - Selected template object
   */
  selectTemplate(content, originalPrompt = '') {
    const textToAnalyze = `${originalPrompt} ${JSON.stringify(content)}`.toLowerCase();
    
    const businessPatterns = {
      barbershop: [
        'barber', 'barbería', 'peluquería', 'barbero', 'corte', 'haircut', 
        'afeitado', 'fade', 'grooming', 'pelo', 'cabello', 'hair', 'salon',
        'estilista', 'tijeras', 'navaja', 'bigote', 'beard', 'shave'
      ],
      restaurant: [
        'restaurant', 'restaurante', 'cafe', 'cafetería', 'food', 'comida',
        'menu', 'menú', 'chef', 'cocina', 'plato', 'dish', 'dining',
        'cena', 'almuerzo', 'desayuno', 'bebida', 'drink', 'bar'
      ]
    };

    // Score templates based on keyword matches
    const templateScores = this.templates.map(template => {
      let score = 0;
      const templateTags = template.tags;
      
      // Check for direct tag matches in text
      templateTags.forEach(tag => {
        const regex = new RegExp(`\\b${tag}\\b`, 'gi');
        const matches = textToAnalyze.match(regex);
        if (matches) {
          score += matches.length * 2;
        }
      });
      
      // Check for business pattern matches
      if (template.id === 'barbershop') {
        businessPatterns.barbershop.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          const matches = textToAnalyze.match(regex);
          if (matches) {
            score += matches.length;
          }
        });
      } else if (template.id === 'klassy-cafe') {
        businessPatterns.restaurant.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          const matches = textToAnalyze.match(regex);
          if (matches) {
            score += matches.length;
          }
        });
      }
      
      return { template, score };
    });

    templateScores.sort((a, b) => b.score - a.score);
    
    const selectedTemplate = templateScores[0].score > 0 
      ? templateScores[0].template 
      : this.templates.find(t => t.id === 'klassy-cafe');
    
    this.currentTemplate = selectedTemplate;
    return selectedTemplate;
  }

  /**
   * Store content and template selection (Async)
   * @param {Object} content - AI generated content
   * @param {Object} template - Selected template
   * @returns {Promise<boolean>}
   */
  async storeContentAndTemplate(content, template = null) {
    const selectedTemplate = template || this.currentTemplate || this.templates[0];
    
    return await this.projectStore.saveProject({
      content,
      templateId: selectedTemplate.id,
      templatePath: selectedTemplate.path,
      schemaVersion: content.schemaVersion
    });
  }

  /**
   * Load stored content and template (Async)
   * @returns {Promise<Object>}
   */
  async loadStoredData() {
    const project = await this.projectStore.loadProject();

    if (!project) {
      return {
        content: {},
        templatePath: null,
        templateId: null,
        schemaVersion: '1',
        hasValidData: false
      };
    }

    return {
      content: project.content,
      templatePath: project.templatePath,
      templateId: project.templateId,
      schemaVersion: project.schemaVersion,
      hasValidData: !!project.content && !!project.templatePath
    };
  }

  getTemplateById(templateId) {
    return this.templates.find(t => t.id === templateId) || null;
  }

  getAllTemplates() {
    return [...this.templates];
  }

  clearStoredData() {
    if (this.projectStore && typeof this.projectStore.clearCurrentContext === 'function') {
      return this.projectStore.clearCurrentContext();
    }
    // Fallback antiguo por si acaso
    localStorage.removeItem('ai_generated_content');
    localStorage.removeItem('selected_template');
  }
}

window.TemplateManager = TemplateManager;
