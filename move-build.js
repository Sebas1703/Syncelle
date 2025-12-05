const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'renderer', 'dist');
const destination = path.join(__dirname, 'v2');

// Asegurar que existe destino
if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
}

// Función recursiva para copiar
function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

console.log(`Moviendo build de ${source} a ${destination}...`);

try {
    copyRecursive(source, destination);
    console.log('¡Build movido exitosamente a /v2!');
} catch (err) {
    console.error('Error moviendo archivos:', err);
    process.exit(1);
}

