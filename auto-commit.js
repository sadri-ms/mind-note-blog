// Auto-commit script - watches for file changes and automatically commits/pushes
// Run with: node auto-commit.js

const { exec } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

// Files/folders to ignore
const ignorePaths = [
  'node_modules',
  '.git',
  'dist',
  '.sanity',
  '*.log',
  '.DS_Store',
  'package-lock.json', // Optional: ignore lock file changes
];

// Watch for changes
const watcher = chokidar.watch('.', {
  ignored: ignorePaths,
  persistent: true,
  ignoreInitial: true,
});

let commitTimeout;
const COMMIT_DELAY = 5000; // Wait 5 seconds after last change before committing

watcher.on('all', (event, filePath) => {
  console.log(`📝 Change detected: ${filePath}`);
  
  // Clear previous timeout
  clearTimeout(commitTimeout);
  
  // Set new timeout to commit after no changes for 5 seconds
  commitTimeout = setTimeout(() => {
    console.log('🔄 Auto-committing changes...');
    
    exec('git add .', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error adding files:', error);
        return;
      }
      
      const commitMessage = `Auto-commit: ${new Date().toLocaleString()}`;
      
      exec(`git commit -m "${commitMessage}"`, (error, stdout, stderr) => {
        if (error) {
          // No changes to commit (normal)
          if (error.message.includes('nothing to commit')) {
            console.log('✅ No changes to commit');
            return;
          }
          console.error('❌ Error committing:', error);
          return;
        }
        
        console.log('✅ Committed:', commitMessage);
        console.log('💡 Review your changes, then push manually with: git push origin main');
        console.log('   (Auto-push is disabled for safety)');
        
        // Auto-push DISABLED for safety
        // You can manually push when ready: git push origin main
      });
    });
  }, COMMIT_DELAY);
});

console.log('👀 Watching for file changes...');
console.log('📦 Changes will be auto-committed after 5 seconds of inactivity');
console.log('🛑 Press Ctrl+C to stop');

