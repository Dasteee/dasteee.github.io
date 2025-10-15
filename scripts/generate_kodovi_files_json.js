#!/usr/bin/env node
/*
  Scans the `kodovi/` directory and generates `kodovi/files.json` with the
  structure expected by the UI in `kodovi/index.html` and `kodovi/kodovi.js`.
*/
const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.cwd();
const KODOVI_DIR = path.join(REPO_ROOT, 'kodovi');
const OUTPUT_FILE = path.join(KODOVI_DIR, 'files.json');

const EXCLUDE_FILE_NAMES = new Set([
  'index.html',
  'kodovi.css',
  'kodovi.js',
  'files.json',
]);

function getLanguageByExt(ext) {
  const e = ext.toLowerCase();
  switch (e) {
    case '.c': return 'c';
    case '.cpp':
    case '.cc':
    case '.cxx':
    case '.hpp':
    case '.hxx':
    case '.hh': return 'cpp';
    case '.cs': return 'csharp';
    case '.lua': return 'lua';
    case '.js': return 'javascript';
    case '.ts': return 'typescript';
    case '.html': return 'html';
    case '.css': return 'css';
    case '.py': return 'python';
    case '.java': return 'java';
    case '.rb': return 'ruby';
    case '.go': return 'go';
    case '.rs': return 'rust';
    case '.php': return 'php';
    case '.kt':
    case '.kts': return 'kotlin';
    case '.swift': return 'swift';
    case '.sh': return 'bash';
    default: return 'text';
  }
}

function getIconByExt(ext) {
  const e = ext.toLowerCase();
  switch (e) {
    case '.c': return 'fab fa-cuttlefish';
    case '.cpp':
    case '.cc':
    case '.cxx':
    case '.hpp':
    case '.hxx':
    case '.hh': return 'fas fa-plus';
    case '.cs': return 'fas fa-hashtag';
    case '.lua': return 'fas fa-cube';
    case '.js': return 'fab fa-js-square';
    case '.ts': return 'fas fa-code';
    case '.html': return 'fab fa-html5';
    case '.css': return 'fab fa-css3-alt';
    case '.py': return 'fab fa-python';
    case '.java': return 'fab fa-java';
    case '.rb': return 'fas fa-gem';
    case '.go': return 'fas fa-rocket';
    case '.rs': return 'fas fa-gears';
    case '.php': return 'fab fa-php';
    case '.kt':
    case '.kts': return 'fas fa-code';
    case '.swift': return 'fas fa-feather';
    case '.sh': return 'fas fa-terminal';
    default: return 'far fa-file-code';
  }
}

function isHidden(name) {
  return name.startsWith('.') || name === 'node_modules';
}

function buildTree(absDir, relDir) {
  const entries = fs.readdirSync(absDir, { withFileTypes: true });

  // Sort directories first, then files, alphabetically
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  const items = [];

  for (const entry of entries) {
    const name = entry.name;
    if (isHidden(name)) continue;

    const absPath = path.join(absDir, name);
    const relPath = relDir ? path.posix.join(relDir, name) : name;

    if (entry.isDirectory()) {
      const children = buildTree(absPath, relPath);
      items.push({
        type: 'folder',
        name,
        path: relPath,
        icon: 'fas fa-folder',
        children,
      });
    } else if (entry.isFile()) {
      if (relDir === '' && EXCLUDE_FILE_NAMES.has(name)) {
        // Exclude top-level UI files inside kodovi/
        continue;
      }
      const stat = fs.statSync(absPath);
      const ext = path.extname(name);
      items.push({
        type: 'file',
        name,
        path: relPath,
        icon: getIconByExt(ext),
        language: getLanguageByExt(ext),
        size: stat.size,
      });
    }
  }

  return items;
}

function main() {
  if (!fs.existsSync(KODOVI_DIR)) {
    console.error('kodovi/ directory not found');
    process.exit(1);
  }

  const structure = buildTree(KODOVI_DIR, '');
  const data = {
    last_updated: Date.now() / 1000,
    structure,
  };

  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(OUTPUT_FILE, json + '\n');
  console.log(`Wrote ${OUTPUT_FILE}`);
}

main();
