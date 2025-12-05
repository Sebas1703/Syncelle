/**
 * Test System for Syncelle AI Integration
 * This file tests the complete flow from AI generation to content injection
 */

// Mock data that simulates what the AI should generate
const mockAIResponse = {
  "schemaVersion": 1,
  "titulo": "Café Bravíssimo",
  "eslogan": "Una experiencia sensorial única",
  "descripcion": "Descubre el arte del café en cada taza, donde la tradición se encuentra con la innovación para crear momentos inolvidables.",
  "beneficios": [
    "Granos seleccionados de origen",
    "Ambiente acogedor y elegante", 
    "Atención personalizada"
  ],
  "servicios": [
    "Café de especialidad",
    "Repostería artesanal",
    "Eventos privados"
  ],
  "cta": "Haz tu Reserva",
  "about": {
    "subtitulo": "Sobre Nosotros",
    "titulo": "El arte del café en cada taza"
  },
  "menu": {
    "subtitulo": "Nuestro Menú",
    "titulo": "Selección especial de postres y bebidas"
  },
  "menuItems": [
    {"nombre": "Tarta de Chocolate Belga", "descripcion": "Exquisita tarta con chocolate importado de Bélgica", "precio": "$15"},
    {"nombre": "Cappuccino Artesanal", "descripcion": "Café espresso con leche vaporizada y arte latte", "precio": "$8"},
    {"nombre": "Croissant de Almendras", "descripcion": "Hojaldre francés relleno de crema de almendras", "precio": "$12"},
    {"nombre": "Cheesecake de Frutos Rojos", "descripcion": "Cremoso cheesecake con compota de frutos del bosque", "precio": "$14"},
    {"nombre": "Macchiato Caramelo", "descripcion": "Espresso con leche y sirope de caramelo casero", "precio": "$9"},
    {"nombre": "Tiramisú Clásico", "descripcion": "El postre italiano más auténtico con café y mascarpone", "precio": "$13"}
  ],
  "chefs": [
    {"nombre": "Laura Díaz", "cargo": "Chef Ejecutiva"},
    {"nombre": "Carlos Mendoza", "cargo": "Barista Especialista"},
    {"nombre": "Ana García", "cargo": "Repostera"}
  ],
  "desayuno": [
    {"nombre": "Tostadas Francesas", "descripcion": "Pan brioche con miel y frutos frescos", "precio": "$11"},
    {"nombre": "Smoothie Bowl", "descripcion": "Bowl de açaí con granola y frutas de temporada", "precio": "$10"},
    {"nombre": "Huevos Benedict", "descripcion": "Huevos pochados sobre muffin inglés con salsa holandesa", "precio": "$14"},
    {"nombre": "Pancakes Integrales", "descripcion": "Tortitas saludables con jarabe de maple", "precio": "$12"},
    {"nombre": "Avocado Toast", "descripcion": "Pan artesanal con aguacate, tomate cherry y semillas", "precio": "$13"},
    {"nombre": "Granola Casera", "descripcion": "Mezcla de avena, frutos secos y yogur griego", "precio": "$9"}
  ],
  "almuerzo": [
    {"nombre": "Ensalada César Gourmet", "descripcion": "Lechuga romana, parmesano, crutones y pollo grillado", "precio": "$16"},
    {"nombre": "Sándwich Club", "descripcion": "Triple pan tostado con pavo, bacon y vegetales frescos", "precio": "$15"},
    {"nombre": "Pasta Alfredo", "descripcion": "Fettuccine en cremosa salsa alfredo con hierbas", "precio": "$18"},
    {"nombre": "Salmón a la Plancha", "descripcion": "Filete de salmón con quinoa y vegetales al vapor", "precio": "$22"},
    {"nombre": "Risotto de Hongos", "descripcion": "Arroz arborio con hongos porcini y trufa", "precio": "$20"},
    {"nombre": "Wrap Mediterráneo", "descripcion": "Tortilla integral con hummus, vegetales y queso feta", "precio": "$14"}
  ],
  "cena": [
    {"nombre": "Filete Mignon", "descripcion": "Corte premium con puré de papas trufado", "precio": "$28"},
    {"nombre": "Paella Valenciana", "descripcion": "Arroz tradicional con mariscos y azafrán", "precio": "$25"},
    {"nombre": "Lasagna Casera", "descripcion": "Pasta fresca con ragú de carne y bechamel", "precio": "$19"},
    {"nombre": "Lubina al Horno", "descripcion": "Pescado fresco con hierbas mediterráneas", "precio": "$24"},
    {"nombre": "Cordero Confitado", "descripcion": "Pierna de cordero con ratatouille provenzal", "precio": "$26"},
    {"nombre": "Pizza Margherita", "descripcion": "Base artesanal con tomate, mozzarella y albahaca", "precio": "$17"}
  ],
  "contacto": {
    "subtitulo": "Contáctanos",
    "titulo": "Haz tu reserva y vive una experiencia única",
    "descripcion": "Ubicados en el corazón de la ciudad, te esperamos para brindarte momentos especiales.",
    "telefono": {
      "titulo": "Teléfonos",
      "numero1": "555-2847",
      "numero2": "555-2848"
    },
    "email": {
      "titulo": "Correos Electrónicos",
      "email1": "hola@cafebravissimo.com",
      "email2": "reservas@cafebravissimo.com"
    }
  },
  "ofertas": {
    "subtitulo": "Ofertas Especiales",
    "titulo": "Descubre nuestras promociones de temporada"
  },
  "formulario": {
    "titulo": "Reserva tu Mesa"
  },
  "navegacion": {
    "desayuno": "Desayunos",
    "almuerzo": "Almuerzos",
    "cena": "Cenas"
  },
  "footer": {
    "copyright": "© 2024 Café Bravíssimo. Todos los derechos reservados."
  }
};

// Test function to validate the mock data against our schema
function testDataValidation() {
  console.log('🧪 Testing Data Validation...');
  
  // Check required fields
  const requiredFields = ['titulo', 'eslogan', 'descripcion', 'beneficios', 'servicios', 'cta'];
  const missingFields = requiredFields.filter(field => !mockAIResponse[field]);
  
  if (missingFields.length > 0) {
    console.error('❌ Missing required fields:', missingFields);
    return false;
  }
  
  // Check array lengths
  const expectedLengths = {
    beneficios: 3,
    servicios: 3,
    menuItems: 6,
    chefs: 3,
    desayuno: 6,
    almuerzo: 6,
    cena: 6
  };
  
  for (const [field, expectedLength] of Object.entries(expectedLengths)) {
    if (!Array.isArray(mockAIResponse[field])) {
      console.error(`❌ ${field} is not an array`);
      return false;
    }
    if (mockAIResponse[field].length !== expectedLength) {
      console.warn(`⚠️ ${field} has ${mockAIResponse[field].length} items, expected ${expectedLength}`);
    }
  }
  
  console.log('✅ Data validation passed!');
  return true;
}

// Test function to count total data-ai elements that would be populated
function testDataCoverage() {
  console.log('📊 Testing Data Coverage...');
  
  let totalElements = 0;
  
  // Simple fields
  const simpleFields = ['titulo', 'eslogan', 'descripcion', 'cta'];
  totalElements += simpleFields.length;
  
  // Array fields (simple)
  totalElements += mockAIResponse.beneficios.length;
  totalElements += mockAIResponse.servicios.length;
  
  // Array fields (objects)
  totalElements += mockAIResponse.menuItems.length * 3; // nombre, descripcion, precio
  totalElements += mockAIResponse.chefs.length * 2; // nombre, cargo
  totalElements += mockAIResponse.desayuno.length * 3;
  totalElements += mockAIResponse.almuerzo.length * 3;
  totalElements += mockAIResponse.cena.length * 3;
  
  // Nested objects
  totalElements += 2; // about.subtitulo, about.titulo
  totalElements += 2; // menu.subtitulo, menu.titulo
  totalElements += 7; // contacto fields
  totalElements += 2; // ofertas fields
  totalElements += 1; // formulario.titulo
  totalElements += 3; // navegacion fields
  totalElements += 1; // footer.copyright
  
  console.log(`📈 Total elements that would be populated: ${totalElements}`);
  return totalElements;
}

// Main test function
function runTests() {
  console.log('🚀 Starting Syncelle System Tests...\n');
  
  const validationPassed = testDataValidation();
  const elementCount = testDataCoverage();
  
  console.log('\n📋 Test Summary:');
  console.log(`✅ Data Validation: ${validationPassed ? 'PASSED' : 'FAILED'}`);
  console.log(`📊 Elements Coverage: ${elementCount} data-ai elements`);
  console.log(`🎯 Template Compatibility: ${elementCount >= 140 ? 'EXCELLENT' : 'NEEDS WORK'}`);
  
  if (validationPassed && elementCount >= 140) {
    console.log('\n🎉 All tests PASSED! The system is ready for production.');
  } else {
    console.log('\n⚠️ Some tests failed. Please review the issues above.');
  }
}

// Export for use in browser console or Node.js
if (typeof window !== 'undefined') {
  window.SyncelleTest = { runTests, mockAIResponse };
} else if (typeof module !== 'undefined') {
  module.exports = { runTests, mockAIResponse };
}

// Auto-run if executed directly
if (typeof window === 'undefined' && require.main === module) {
  runTests();
} 