const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sources = JSON.parse(fs.readFileSync(path.join(__dirname, '../client/src/lib/content-sources.json'), 'utf8'));
const tempDir = path.join(__dirname, '../.content-temp');

function syncSource(type, repoUrl) {
  const targetDir = path.join(__dirname, '../client/public', type);
  
  console.log(`Syncing ${type} from ${repoUrl}...`);

  try {
    // Create target dir if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Clean temp dir
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    // Clone repo (shallow)
    execSync(`git clone --depth 1 ${repoUrl} ${tempDir}`, { stdio: 'inherit' });

    // Copy .md files to target directory
    const files = fs.readdirSync(tempDir);
    let count = 0;
    files.forEach(file => {
      if (file.endsWith('.md')) {
        fs.copyFileSync(path.join(tempDir, file), path.join(targetDir, file));
        count++;
      }
    });

    console.log(`Synced ${count} .md files to ${targetDir}`);
  } catch (error) {
    console.error(`Failed to sync ${type}:`, error.message);
    // Don't fail the whole process, just log it
  } finally {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

syncSource('blog', sources.blog);
syncSource('events', sources.events);
