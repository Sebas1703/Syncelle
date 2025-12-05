const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'renderer', 'src', 'components', 'blocks');
const destDir = path.join(__dirname, 'web', 'src', 'components', 'blocks');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(srcDir)) {
    fs.readdirSync(srcDir).forEach(file => {
        const srcFile = path.join(srcDir, file);
        const destFile = path.join(destDir, file);
        fs.copyFileSync(srcFile, destFile);
        console.log(`Copiado: ${file}`);
    });
    console.log('Migración de componentes completada.');
} else {
    console.error('No se encontró la carpeta de origen de componentes.');
}

