// Node.js script to find and replace all instances of CraveSMP with RavenMC
// Save this as rename-server.js and run with: node rename-server.js

const fs = require('fs');
const path = require('path');

// Define directories to search (add more if needed)
const directories = [
  '.',  // Current directory
  './assets',  // Assets directory if you have one
];

// Define file extensions to search
const fileExtensions = ['.html', '.js', '.css', '.json'];

// Define replacements
const replacements = [
  { from: 'CraveSMP', to: 'RavenMC' },
  { from: 'cravesmp', to: 'ravenmc' },
  { from: 'Crave SMP', to: 'RavenMC' },
  { from: 'Crave<span>SMP</span>', to: 'Raven<span>MC</span>' },
  { from: 'play.cravesmp.com', to: 'play.ravenmc.com' },
];

// Function to recursively search directories
function searchDirectory(dir) {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }
    
    files.forEach(file => {
      const filePath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        // Recursively search subdirectories
        searchDirectory(filePath);
      } else {
        // Check if the file has one of our target extensions
        const ext = path.extname(file.name).toLowerCase();
        if (fileExtensions.includes(ext)) {
          processFile(filePath);
        }
      }
    });
  });
}

// Function to process each file
function processFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }
    
    let modifiedContent = data;
    let hasChanges = false;
    
    // Apply all replacements
    replacements.forEach(({ from, to }) => {
      // Create case-insensitive RegExp for the 'from' value
      const regex = new RegExp(from, 'gi');
      
      if (regex.test(modifiedContent)) {
        // Use a function to preserve case if possible
        modifiedContent = modifiedContent.replace(regex, match => {
          hasChanges = true;
          
          // Try to preserve casing
          if (match === match.toUpperCase()) {
            return to.toUpperCase();
          } else if (match[0] === match[0].toUpperCase()) {
            return to.charAt(0).toUpperCase() + to.slice(1);
          } else {
            return to;
          }
        });
      }
    });
    
    // Only write the file if changes were made
    if (hasChanges) {
      fs.writeFile(filePath, modifiedContent, 'utf8', err => {
        if (err) {
          console.error(`Error writing file ${filePath}:`, err);
        } else {
          console.log(`Updated: ${filePath}`);
        }
      });
    }
  });
}

// Start processing each directory
console.log('Starting server name replacement...');
directories.forEach(dir => {
  searchDirectory(dir);
});