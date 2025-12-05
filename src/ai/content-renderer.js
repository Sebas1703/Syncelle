/**
 * Content Renderer Module
 * Handles content injection into templates and iframe management
 * Separates rendering logic from other concerns
 */

class ContentRenderer {
  constructor() {
    this.iframe = null;
    this.retryAttempts = [800, 2000, 4000]; // Retry intervals in ms
  }

  /**
   * Initialize renderer with iframe element
   * @param {HTMLIFrameElement} iframeElement - The iframe to render content in
   */
  initialize(iframeElement) {
    this.iframe = iframeElement;
  }

  /**
   * Render content in the specified template
   * @param {Object} content - AI generated content
   * @param {string} templatePath - Path to the template
   */
  async render(content, templatePath) {
    if (!this.iframe) {
      throw new Error('Renderer not initialized with iframe element');
    }

    if (!content || !templatePath) {
      throw new Error('Content and template path are required');
    }

    // Load template
    this.iframe.src = templatePath;

    // Set up content injection after template loads
    return new Promise((resolve, reject) => {
      const onLoad = () => {
        try {
          this._injectContentWithRetries(content);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      this.iframe.addEventListener('load', onLoad, { once: true });
      
      // Timeout fallback
      setTimeout(() => {
        reject(new Error('Template loading timeout'));
      }, 10000);
    });
  }

  /**
   * Inject content with multiple retry attempts
   * @param {Object} content - Content to inject
   * @private
   */
  _injectContentWithRetries(content) {
    try {
      const doc = this._getIframeDocument();
      if (!doc) {
        throw new Error('Cannot access iframe document');
      }

      // Initial injection
      this._hidePreloaders(doc);
      this._injectContent(doc, content);

      // Schedule retries for dynamic templates
      this.retryAttempts.forEach(delay => {
        setTimeout(() => {
          this._safeReinject(doc, content);
        }, delay);
      });

    } catch (error) {
      console.error('Content injection failed:', error);
      throw error;
    }
  }

  /**
   * Safe reinject with error handling
   * @param {Document} doc - Iframe document
   * @param {Object} content - Content to inject
   * @private
   */
  _safeReinject(doc, content) {
    try {
      this._hidePreloaders(doc);
      this._injectContent(doc, content);
    } catch (error) {
      console.warn('Reinject failed:', error.message);
    }
  }

  /**
   * Get iframe document with cross-origin safety
   * @returns {Document|null} - Iframe document or null
   * @private
   */
  _getIframeDocument() {
    try {
      return this.iframe.contentDocument || this.iframe.contentWindow?.document;
    } catch (error) {
      console.error('Cross-origin iframe access denied:', error);
      return null;
    }
  }

  /**
   * Hide preloaders and loading overlays
   * @param {Document} doc - Iframe document
   * @private
   */
  _hidePreloaders(doc) {
    try {
      // Add CSS to hide preloaders
      const style = doc.createElement('style');
      style.textContent = `
        .js-preloader, 
        #preloader, 
        .preloader { 
          display: none !important; 
          visibility: hidden !important; 
          opacity: 0 !important; 
        } 
        body { 
          overflow: auto !important; 
        }
      `;
      doc.head.appendChild(style);

      // Remove preloader elements
      const preloaders = doc.querySelectorAll('.js-preloader, #preloader, .preloader');
      preloaders.forEach(element => element.remove());

      // Remove loading classes from body
      if (doc.body?.classList) {
        doc.body.classList.remove('no-scroll', 'overflow-hidden', 'loading');
      }

      // Reset overflow styles
      if (doc.documentElement?.style) {
        doc.documentElement.style.overflow = 'auto';
      }
      if (doc.body?.style) {
        doc.body.style.overflow = 'auto';
      }

    } catch (error) {
      console.warn('Preloader hiding failed:', error);
    }
  }

  /**
   * Inject content into template using data-ai attributes
   * @param {Document} doc - Iframe document
   * @param {Object} content - Content to inject
   * @private
   */
  _injectContent(doc, content) {
    if (!content || !doc) return;

    // Inject simple text fields
    const simpleFields = ['titulo', 'eslogan', 'descripcion', 'cta'];
    simpleFields.forEach(field => {
      if (content[field] != null) {
        const elements = doc.querySelectorAll(`[data-ai="${field}"]`);
        elements.forEach(element => {
          element.textContent = content[field];
        });
      }
    });

    // Inject nested object fields
    this._injectNestedFields(doc, content, 'about');
    this._injectNestedFields(doc, content, 'menu');
    this._injectNestedFields(doc, content, 'chefs');
    this._injectNestedFields(doc, content, 'contacto');
    this._injectNestedFields(doc, content, 'ofertas');
    this._injectNestedFields(doc, content, 'formulario');
    this._injectNestedFields(doc, content, 'footer');
    this._injectNestedFields(doc, content, 'navegacion');

    // Inject placeholders
    this._injectPlaceholders(doc, content);

    // Inject list fields
    const listFields = ['beneficios', 'servicios', 'caracteristicas', 'menuItems', 'desayuno', 'almuerzo', 'cena', 'chefs'];
    listFields.forEach(listField => {
      if (Array.isArray(content[listField]) && content[listField].length > 0) {
        content[listField].forEach((item, index) => {
          // Handle simple arrays (strings)
          if (typeof item === 'string') {
            const selector = `[data-ai="${listField}[${index}]"]`;
            const elements = doc.querySelectorAll(selector);
            elements.forEach(element => {
              element.textContent = item;
            });
          }
          // Handle object arrays (like menu items with nombre, descripcion, precio)
          else if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach(key => {
              const selector = `[data-ai="${listField}[${index}].${key}"]`;
              const elements = doc.querySelectorAll(selector);
              elements.forEach(element => {
                element.textContent = item[key];
              });
            });
          }
        });
      }
    });
  }

  /**
   * Inject nested object fields recursively
   * @param {Document} doc - Iframe document
   * @param {Object} content - Content object
   * @param {string} parentKey - Parent key name
   * @private
   */
  _injectNestedFields(doc, content, parentKey) {
    if (!content[parentKey] || typeof content[parentKey] !== 'object') return;

    const parentObj = content[parentKey];
    
    // Handle nested objects recursively
    Object.keys(parentObj).forEach(key => {
      const value = parentObj[key];
      const selector = `[data-ai="${parentKey}.${key}"]`;
      
      if (typeof value === 'string' || typeof value === 'number') {
        const elements = doc.querySelectorAll(selector);
        elements.forEach(element => {
          element.textContent = value;
        });
      } else if (typeof value === 'object' && value !== null) {
        // Handle deeper nesting (e.g., contacto.telefono.numero1)
        Object.keys(value).forEach(nestedKey => {
          const nestedValue = value[nestedKey];
          const nestedSelector = `[data-ai="${parentKey}.${key}.${nestedKey}"]`;
          if (typeof nestedValue === 'string' || typeof nestedValue === 'number') {
            const elements = doc.querySelectorAll(nestedSelector);
            elements.forEach(element => {
              element.textContent = nestedValue;
            });
          }
        });
      }
    });
  }

  /**
   * Inject placeholders into form elements
   * @param {Document} doc - Iframe document
   * @param {Object} content - Content object
   * @private
   */
  _injectPlaceholders(doc, content) {
    const placeholderElements = doc.querySelectorAll('[data-ai-placeholder]');
    placeholderElements.forEach(element => {
      const placeholderPath = element.getAttribute('data-ai-placeholder');
      const value = this._getNestedValue(content, placeholderPath);
      if (value) {
        element.placeholder = value;
      }
    });
  }

  /**
   * Get nested value from object using dot notation
   * @param {Object} obj - Object to search in
   * @param {string} path - Dot notation path (e.g., 'formulario.placeholder.nombre')
   * @returns {*} - Found value or null
   * @private
   */
  _getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  /**
   * Get rendering status and metadata
   * @returns {Object} - Status information
   */
  getStatus() {
    return {
      initialized: !!this.iframe,
      hasDocument: !!this._getIframeDocument(),
      templateLoaded: this.iframe?.src ? true : false
    };
  }

  /**
   * Clear the current render
   */
  clear() {
    if (this.iframe) {
      this.iframe.src = 'about:blank';
    }
  }
}

// Export for use in other modules
window.ContentRenderer = ContentRenderer; 