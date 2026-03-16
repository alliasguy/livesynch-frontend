const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

// Function to recursively find all files in a directory
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
    // Only process .js, .jsx, and .css files
    if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css')) {
      let content = fs.readFileSync(file, 'utf8');
      
      let newContent = content
        // Branding words
        .replace(/EliteSynch/g, 'Live-Synch')
        .replace(/elitesynch/g, 'live-synch')
        .replace(/Elitesynch/g, 'Live-synch')
        
        // Colors
        .replace(/rgb\(48, 193, 142\)/g, '#FFC107') // Primary Gold
        .replace(/rgb\(40, 160, 120\)/g, '#E0A800') // Darker Gold 1
        .replace(/rgb\(38, 153, 112\)/g, '#C69500') // Darker Gold 2
        .replace(/rgb\(28, 150, 110\)/g, '#C69500')
        .replace(/rgb\(28, 113, 82\)/g, '#A37B00')
        .replace(/#30c18e/gi, '#FFC107')
        
        // Images (specific exact replacements first)
        .replace(/live-synchmock9\.png/g, 'livesynchlogo3.png') // Note: elitesynch becomes live-synch from above step!
        .replace(/live-synchmock1\.png/g, 'livesynchlogo3.png')
        .replace(/live-synchmockup2\.png/g, 'livesynchlogo3.png')
        .replace(/live-synchmockup1\.png/g, 'livesynchlogo3.png')
        .replace(/live-synchmockup3\.png/g, 'livesynchlogo3.png');
        
      if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Updated:', file);
      }
    }
  });
  
  // also process App.js and index.js etc just in case they are outside src? No, they are inside src.
}

processFiles();
console.log('Replacement complete.');
