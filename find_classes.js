const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function findCssFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findCssFiles(filePath, fileList);
        } else if (filePath.endsWith('.css')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const cssFiles = findCssFiles(srcDir);
const containerClasses = new Set();

const classRegex = /\.([a-zA-Z0-9_-]+)\s*\{([^}]*width:\s*90%;[^}]*)\}/g;

cssFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = classRegex.exec(content)) !== null) {
        const className = match[1];
        // Only include if it targets mother containers, e.g. often accompanied by max-width or flex
        // But the user said "every mother container of every section", these are almost all `width: 90%`.
        containerClasses.add('.' + className);
    }
});

console.log(Array.from(containerClasses).join(', '));
