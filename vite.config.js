import { defineConfig } from 'vite';
import { readdirSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';

const projectRoot = process.cwd();

function collectHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = resolve(directory, entry.name);
    if (entry.isDirectory() && !['node_modules', 'dist', '.npm-cache', '.git'].includes(entry.name)) {
      return collectHtmlFiles(absolutePath);
    }
    return entry.isFile() && extname(entry.name) === '.html' ? [absolutePath] : [];
  });
}

const htmlEntries = Object.fromEntries(
  collectHtmlFiles(projectRoot).map((file) => [relative(projectRoot, file).replace(/\\/g, '/'), file])
);

export default defineConfig({
  base: './',
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  build: {
    rollupOptions: {
      input: htmlEntries
    }
  }
});
