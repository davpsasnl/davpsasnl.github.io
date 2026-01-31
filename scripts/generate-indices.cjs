const fs = require('fs');
const path = require('path');

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const data = {};
  let body = content;

  if (match) {
    const frontmatter = match[1];
    body = match[2];
    frontmatter.split('\n').forEach(line => {
      const [key, ...val] = line.split(':');
      if (key && val.length) {
        data[key.trim()] = val.join(':').trim();
      }
    });
  }

  return { data, content: body };
}

function generateIndex(dir, outputFilename) {
  const fullDir = path.join(__dirname, '../client/public', dir);
  if (!fs.existsSync(fullDir)) {
    console.log(`Directory ${fullDir} not found, skipping.`);
    return;
  }

  const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.md'));
  const entries = files.map(file => {
    const content = fs.readFileSync(path.join(fullDir, file), 'utf8');
    const { data } = parseFrontmatter(content);
    const id = file.replace('.md', '');
    
    // For Blog
    if (dir === 'blog') {
      return {
        id,
        title: data.title || id,
        date: data.date || '',
        author: data.author || 'Admin',
        excerpt: data.excerpt || '',
        filename: file
      };
    }
    
    // For Events (Mapping to existing EventItem structure)
    // Existing structure: TITLE, DESCRIPTION, IMG_1, IMG_2, IMG_3, DATE
    return {
      TITLE: data.title || id,
      DESCRIPTION: data.description || '',
      IMG_1: data.image1 || data.img1 || '',
      IMG_2: data.image2 || data.img2 || '',
      IMG_3: data.image3 || data.img3 || '',
      DATE: data.date || '',
      filename: file,
      id: id
    };
  });

  // Sort by date descending
  entries.sort((a, b) => {
    const dateA = new Date(a.date || a.DATE || 0);
    const dateB = new Date(b.date || b.DATE || 0);
    return dateB - dateA;
  });

  fs.writeFileSync(
    path.join(fullDir, outputFilename),
    JSON.stringify(entries, null, 2)
  );
  console.log(`Generated ${outputFilename} with ${entries.length} entries.`);
}

generateIndex('blog', 'posts.json');
generateIndex('events', 'events.json');
