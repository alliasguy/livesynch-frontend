const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayOfFiles;
}

function processFiles() {
  const files = getAllFiles(directoryPath);
  files.forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(file, 'utf8');
      
      let newContent = content
        .replace(/service_7p8jplz/g, 'service_hyldfcr')
        .replace(/template_zjn6zro/g, 'template_f5cd92h')
        .replace(/rtqTlHuc9A8eus7Xh/g, '4JUt2Qxatj7_YsTxw');
        
      if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated:', file);
      }
    }
  });
}

processFiles();
console.log('EmailJS credentials updated.');
