import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Architectural Invariants & Design System Checks', () => {
  const rootDir = path.resolve(__dirname, '../../');
  const srcDir = path.join(rootDir, 'src');

  it('ensures ui-elements page is isolated without direct links from HomePage', () => {
    const homePagePath = path.join(srcDir, 'pages/HomePage.tsx');
    const homeContent = fs.readFileSync(homePagePath, 'utf-8');
    expect(homeContent.includes('ui-elements')).toBe(false);
  });

  it('verifies src/assets/bgclean.webp exists for asset bundling', () => {
    const assetPath = path.join(srcDir, 'assets/bgclean.webp');
    expect(fs.existsSync(assetPath)).toBe(true);
  });

  it('checks that no invalid light: variant classes exist in src/', () => {
    function walkDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          expect(
            content.includes('light:'),
            `Found invalid "light:" class in ${fullPath}`
          ).toBe(false);
        }
      }
    }

    walkDir(srcDir);
  });

  it('verifies 2-layer design system tokens are defined in index.css', () => {
    const cssPath = path.join(srcDir, 'index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    expect(cssContent).toContain('--color-cyan-500');
    expect(cssContent).toContain('--color-purple-500');
    expect(cssContent).toContain('--color-orange-500');
    expect(cssContent).toContain('--bg-app');
    expect(cssContent).toContain('--bg-card');
    expect(cssContent).toContain('--brand-primary');
  });
});

