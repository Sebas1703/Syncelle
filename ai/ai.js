/**
 * AI Page Controller
 * Handles the prompt form and initiates website generation
 * Uses the modular AI system for clean separation of concerns
 * Includes AI animation control
 */

// Initialize controller when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Wait for modules to load
  if (typeof AppController === 'undefined') {
    console.error('AppController not loaded. Make sure all modules are included.');
    return;
  }

  const appController = new AppController();
  const form = document.getElementById("prompt-form");
  const input = document.getElementById("prompt-input");
  const loading = document.getElementById("loading");
  const aiGlow = document.getElementById("ai-glow");
  const generateBtn = document.querySelector('.ai-btn-primary');

  if (!form || !input || !loading) {
    console.error('Required DOM elements not found');
    return;
  }

  // AI Animation Controller
  const aiAnimationController = {
    start() {
      if (aiGlow) {
        aiGlow.classList.add('active');
      }
      if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generando con IA...';
      }
    },
    
    stop() {
      if (aiGlow) {
        aiGlow.classList.remove('active');
      }
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generar Página';
      }
    },
    
    preview() {
      if (aiGlow && !form.classList.contains('generating')) {
        aiGlow.classList.add('active');
        setTimeout(() => {
          if (!form.classList.contains('generating')) {
            aiGlow.classList.remove('active');
          }
        }, 3000);
      }
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const businessIdea = input.value.trim();
    if (!businessIdea) {
      alert("Por favor, escribe tu idea de página web.");
      return;
    }

    // Mark as generating and start AI animation
    form.classList.add('generating');
    aiAnimationController.start();

    // Disable form during processing
    form.style.pointerEvents = 'none';
    input.disabled = true;

    try {
      await appController.generateWebsite(businessIdea, loading);
      
      // Success - stop animation after a brief delay
      setTimeout(() => {
        aiAnimationController.stop();
      }, 1000);
      
    } catch (error) {
      console.error('Generation error:', error);
      alert(`Ocurrió un error al generar la página: ${error.message}`);
      
      // Error - stop animation immediately
      aiAnimationController.stop();
      
      // Re-enable form
      form.style.pointerEvents = 'auto';
      input.disabled = false;
      loading.style.display = 'none';
      form.classList.remove('generating');
    }
  });

  // Enhanced input validation with AI preview animation
  input.addEventListener('input', function() {
    const value = this.value.trim();
    const wordCount = value.split(/\s+/).filter(word => word.length > 0).length;
    
    // Visual feedback for input quality
    if (wordCount < 5) {
      this.style.borderColor = '#ff6b6b';
    } else if (wordCount < 15) {
      this.style.borderColor = '#ffd93d';
    } else {
      this.style.borderColor = '#00f4ae';
      // Trigger preview animation for quality content
      if (wordCount > 20) {
        aiAnimationController.preview();
      }
    }
  });

  // Focus effects for better UX
  input.addEventListener('focus', function() {
    if (this.value.trim().length > 15) {
      aiAnimationController.preview();
    }
  });

  // Clear any previous data when page loads
  appController.clearData();

  // Make animation controller available globally if needed
  window.aiAnimationController = aiAnimationController;
});
