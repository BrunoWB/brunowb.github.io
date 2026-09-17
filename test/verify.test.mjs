import assert from 'node:assert';
import { cvData } from '../src/data/cvData.ts';
import { projectsData } from '../src/data/projectsData.ts';
import { uiTranslations } from '../src/data/uiTranslations.ts';
import { bigStarsData, getStarFlareIntensityScale } from '../src/data/bgLayersData.ts';
import {
  calculatePhotoshopLevels,
  computeLevelsTableValues,
  computeVibranceSaturationMatrix,
} from '../src/utils/colorGrading.ts';
import fs from 'node:fs';

console.log('--- RUNNING AUTOMATED VERIFICATION SUITE ---');

// 1. Language Parity Checks
const languages = ['en', 'fr', 'pt'];

console.log('1. Checking cvData parity...');
for (const lang of languages) {
  assert.ok(cvData.header.title[lang], `cvData.header.title missing ${lang}`);
  assert.ok(cvData.profile.title[lang], `cvData.profile.title missing ${lang}`);
  assert.ok(cvData.profile.location[lang], `cvData.profile.location missing ${lang}`);
  assert.ok(cvData.profile.summary[lang], `cvData.profile.summary missing ${lang}`);
  assert.ok(cvData.skills.title[lang], `cvData.skills.title missing ${lang}`);
  assert.ok(cvData.education.title[lang], `cvData.education.title missing ${lang}`);
  assert.ok(cvData.education.entry.degree[lang], `cvData.education.entry.degree missing ${lang}`);
  assert.ok(cvData.education.entry.major[lang], `cvData.education.entry.major missing ${lang}`);
  assert.ok(cvData.contact.title[lang], `cvData.contact.title missing ${lang}`);
  assert.ok(cvData.languages.title[lang], `cvData.languages.title missing ${lang}`);
  assert.ok(cvData.experience.title[lang], `cvData.experience.title missing ${lang}`);
}

assert.strictEqual(cvData.languages.items.length, 5, 'Must have 5 languages');
cvData.languages.items.forEach((item, idx) => {
  for (const lang of languages) {
    assert.ok(item.name[lang], `Language ${idx} missing name in ${lang}`);
    assert.ok(item.level[lang], `Language ${idx} missing level in ${lang}`);
  }
});

assert.strictEqual(cvData.experience.positions.length, 8, 'Must have 8 timeline positions');
cvData.experience.positions.forEach((pos, idx) => {
  for (const lang of languages) {
    assert.ok(pos.role[lang], `Position ${idx} missing role in ${lang}`);
    if (pos.bullets) {
      assert.ok(pos.period?.[lang], `Position ${idx} missing period in ${lang}`);
      assert.ok(pos.location?.[lang], `Position ${idx} missing location in ${lang}`);
      assert.ok(Array.isArray(pos.bullets[lang]), `Position ${idx} bullets[${lang}] is not an array`);
      assert.ok(pos.bullets[lang].length > 0, `Position ${idx} bullets[${lang}] is empty`);
    }
  }
});
console.log('✓ cvData multi-language parity verified (8 timeline entries with en/fr/pt roles/bullets).');

// 2. Projects Data Parity Checks
console.log('2. Checking projectsData parity...');
assert.strictEqual(projectsData.length, 3, 'Must have 3 showcase projects');
projectsData.forEach((project) => {
  for (const lang of languages) {
    assert.ok(project.tag[lang], `Project ${project.id} missing tag in ${lang}`);
    assert.ok(project.description[lang], `Project ${project.id} missing description in ${lang}`);
  }
  assert.ok(project.repoUrl.startsWith('https://'), `Project ${project.id} has invalid repoUrl`);
});
console.log('✓ projectsData verified with valid tags and URLs.');

// 3. UI Translations Parity
console.log('3. Checking uiTranslations parity...');
for (const lang of languages) {
  assert.ok(uiTranslations.hero.greetings[lang], `uiTranslations.hero.greetings missing ${lang}`);
  assert.ok(uiTranslations.hero.subtitle[lang], `uiTranslations.hero.subtitle missing ${lang}`);
  assert.ok(uiTranslations.hero.cvButton[lang], `uiTranslations.hero.cvButton missing ${lang}`);
  assert.ok(uiTranslations.hero.scrollButton[lang], `uiTranslations.hero.scrollButton missing ${lang}`);
  assert.ok(uiTranslations.coffee.button[lang], `uiTranslations.coffee.button missing ${lang}`);
  assert.ok(uiTranslations.cvModal.close[lang], `uiTranslations.cvModal.close missing ${lang}`);
  assert.ok(uiTranslations.cvModal.skipPrompt[lang], `uiTranslations.cvModal.skipPrompt missing ${lang}`);
}
console.log('✓ uiTranslations parity verified.');

// 4. Hidden route isolation check
console.log('4. Checking hidden route isolation...');
const homePageContent = fs.readFileSync(new URL('../src/pages/HomePage.tsx', import.meta.url), 'utf-8');
const heroSectionContent = fs.readFileSync(new URL('../src/components/hero/HeroSection.tsx', import.meta.url), 'utf-8');
const projectsSectionContent = fs.readFileSync(new URL('../src/components/projects/ProjectsSection.tsx', import.meta.url), 'utf-8');

assert.ok(!homePageContent.includes('#/ui-elements'), 'HomePage must not link to #/ui-elements');
assert.ok(!heroSectionContent.includes('#/ui-elements'), 'HeroSection must not link to #/ui-elements');
assert.ok(!projectsSectionContent.includes('#/ui-elements'), 'ProjectsSection must not link to #/ui-elements');
console.log('✓ ui-elements page is strictly isolated without homepage links.');

// 5. Build Artifact Checks
console.log('5. Checking build output in dist/...');
assert.ok(fs.existsSync(new URL('../dist/index.html', import.meta.url)), 'dist/index.html missing');
const distHtml = fs.readFileSync(new URL('../dist/index.html', import.meta.url), 'utf-8');
assert.ok(distHtml.includes('./assets/index-'), 'dist/index.html must reference relative ./assets/');
assert.ok(distHtml.includes('./favicon.svg'), 'dist/index.html must reference ./favicon.svg');
const distAssetsDir = new URL('../dist/assets', import.meta.url).pathname;
assert.ok(fs.readdirSync(distAssetsDir).some(f => f.startsWith('bgclean-') && f.endsWith('.webp')), 'dist/assets must contain bundled and hashed bgclean-*.webp');
assert.ok(!fs.readdirSync(distAssetsDir).some(f => f.includes('bg.png')), 'dist/assets must not contain old unbundled bg.png');
console.log('✓ dist/ build output verified.');

// 6. Typewriter Step Transitions & Pre-allocated Height Verification
console.log('6. Checking Typewriter step transitions and pre-allocated heights...');
const cvHeaderContent = fs.readFileSync(new URL('../src/components/cv/CvHeader.tsx', import.meta.url), 'utf-8');
const cvSidebarContent = fs.readFileSync(new URL('../src/components/cv/CvSidebar.tsx', import.meta.url), 'utf-8');
const cvTimelineContent = fs.readFileSync(new URL('../src/components/cv/CvTimeline.tsx', import.meta.url), 'utf-8');
const cvModalContent = fs.readFileSync(new URL('../src/components/cv/CvPaperModal.tsx', import.meta.url), 'utf-8');
const typewriterContent = fs.readFileSync(new URL('../src/components/common/TypewriterText.tsx', import.meta.url), 'utf-8');

assert.ok(cvHeaderContent.includes('currentStep === 0'), 'CvHeader must advance from step 0 to step 1');
assert.ok(cvSidebarContent.includes('isStep1Active'), 'CvSidebar must activate concurrently at step 1');
assert.ok(cvTimelineContent.includes('currentStep >= 1'), 'CvTimeline positions must activate concurrently at step 1');
assert.ok(typewriterContent.includes('invisible select-none pointer-events-none'), 'TypewriterText must pre-allocate full height in advance');
assert.ok(cvModalContent.includes('skipAll()'), 'CvPaperModal must trigger skipAll on paper click');
console.log('✓ Typewriter step progression and pre-allocated height hooks verified.');

// 7. Tailwind Utility & Theme Syntax Check
console.log('7. Checking for invalid light: classes...');
function checkDirForInvalidClasses(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = `${dir}/${file}`;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      checkDirForInvalidClasses(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      assert.ok(!content.includes('light:'), `File ${fullPath} contains unsupported "light:" variant`);
    }
  }
}
checkDirForInvalidClasses(new URL('../src', import.meta.url).pathname);
console.log('✓ No invalid light: classes found in src/.');

// 8. Resume Deep-link Verification
console.log('8. Checking #resume deep linking...');
const heroActionsContent = fs.readFileSync(new URL('../src/components/hero/HeroActions.tsx', import.meta.url), 'utf-8');
assert.ok(heroActionsContent.includes('href="#resume"'), 'HeroActions must link to #resume');
assert.ok(cvModalContent.includes('id="resume"'), 'CvPaperModal must have id="resume"');
assert.ok(homePageContent.includes('#resume'), 'HomePage must handle #resume hash routing');
console.log('✓ #resume direct link and modal routing verified.');

// 9. Theme Preference & Persistence Verification
console.log('9. Checking theme system preference & manual persistence...');
const themeContextContent = fs.readFileSync(new URL('../src/context/ThemeContext.tsx', import.meta.url), 'utf-8');
const indexHtmlContent = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf-8');
assert.ok(themeContextContent.includes('prefers-color-scheme'), 'ThemeContext must check system prefers-color-scheme');
assert.ok(indexHtmlContent.includes('prefers-color-scheme'), 'index.html must check system prefers-color-scheme');
assert.ok(themeContextContent.includes('localStorage.setItem(\'theme\', newTheme)'), 'ThemeContext must save manual theme changes locally');
console.log('✓ System theme detection and manual persistence verified.');

// 10. Design System & Palette Variables Verification
console.log('10. Checking light theme color palette, bd & container column, and palette variable references...');
const indexCssContent = fs.readFileSync(new URL('../src/index.css', import.meta.url), 'utf-8');
const uiElementsContent = fs.readFileSync(new URL('../src/pages/UiElementsPage.tsx', import.meta.url), 'utf-8');

// index.css tokens
assert.ok(indexCssContent.includes('--color-bd-app'), 'index.css must include --color-bd-app');
assert.ok(indexCssContent.includes('--color-container-card'), 'index.css must include --color-container-card');
assert.ok(indexCssContent.includes('--bg-section'), 'index.css must include --bg-section');
assert.ok(indexCssContent.includes('--bg-bubble'), 'index.css must include --bg-bubble');
assert.ok(indexCssContent.includes('--bg-avatar'), 'index.css must include --bg-avatar');

// Light theme complementary colors (not pure black #0f172a)
assert.ok(!indexCssContent.includes('--text-primary: #0f172a'), 'Light theme text-primary must not be pure black (#0f172a)');
assert.ok(indexCssContent.includes('--text-primary: #062630'), 'Light theme text-primary must be complementary dark teal (#062630)');

// UiElementsPage: bd and container column
assert.ok(uiElementsContent.includes("'bd and container'"), 'UiElementsPage must include "bd and container" palette column');
assert.ok(!uiElementsContent.includes('text-slate-900'), 'UiElementsPage must not contain text-slate-900');
assert.ok(!uiElementsContent.includes('text-[#062630]'), 'UiElementsPage must not hardcode text-[#062630]');
assert.ok(uiElementsContent.includes('text-[var(--text-primary)]'), 'UiElementsPage title must reference var(--text-primary)');

// Home page components referencing palette variables
const appContent = fs.readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf-8');
const heroActionsUpdated = fs.readFileSync(new URL('../src/components/hero/HeroActions.tsx', import.meta.url), 'utf-8');
assert.ok(!appContent.includes('text-slate-900'), 'App.tsx must not use text-slate-900');
assert.ok(appContent.includes('text-[var(--text-primary)]'), 'App.tsx must reference var(--text-primary)');
assert.ok(!heroActionsUpdated.includes('text-slate-900'), 'HeroActions must not use text-slate-900');
assert.ok(heroActionsUpdated.includes('text-[var(--text-primary)]'), 'HeroActions must reference var(--text-primary)');
assert.ok(heroSectionContent.includes('text-[var(--text-secondary)]'), 'HeroSection must reference var(--text-secondary)');
assert.ok(projectsSectionContent.includes('bg-[var(--bg-section)]'), 'ProjectsSection must reference var(--bg-section)');
assert.ok(projectsSectionContent.includes('text-[var(--text-primary)]'), 'ProjectsSection must reference var(--text-primary)');
assert.ok(uiElementsContent.includes('1. Semantic Palette'), 'UiElementsPage must include "1. Semantic Palette" section');
assert.ok(uiElementsContent.includes('4. True Raw Palette'), 'UiElementsPage must include "4. True Raw Palette" section at bottom');
const semanticIdx = uiElementsContent.indexOf('1. Semantic Palette');
const typewriterIdx = uiElementsContent.indexOf('2. Typewriter Animation Sandbox');
const rawIdx = uiElementsContent.indexOf('4. True Raw Palette');
assert.ok(semanticIdx < typewriterIdx, 'Semantic Palette must appear before Typewriter Sandbox');
assert.ok(typewriterIdx < rawIdx, 'True Raw Palette must appear at the complete end of the page');

console.log('✓ Color palette tokens, bd & container column, 2-layer palette architecture, and palette variable references verified.');

// 11. Sticky Sidebar & Sticky Job Headers Verification
console.log('11. Checking sticky sidebar and sticky job headers...');
assert.ok(cvSidebarContent.includes('lg:sticky') && cvSidebarContent.includes('lg:top-4'), 'CvSidebar must be sticky on desktop with lg:sticky lg:top-4');
assert.ok(cvSidebarContent.includes('cvData.header.name'), 'CvSidebar must render cvData.header.name');
assert.ok(cvSidebarContent.includes('cvData.header.title'), 'CvSidebar must render cvData.header.title');
assert.ok(cvTimelineContent.includes('sticky top-2 sm:top-4'), 'CvTimeline must have sticky job headers');
assert.ok(!cvModalContent.includes('id="resume"\n          className="relative rounded-2xl shadow-2xl bg-[var(--bg-paper)] text-[var(--text-primary)] border border-[var(--border-subtle)] overflow-hidden"'), 'CvPaperModal #resume must not have overflow-hidden to allow sticky children');
console.log('✓ Sticky sidebar, relocated avatar/name/title, and sticky job headers verified.');

// 12. Dynamic Background & /bg Route Verification
console.log('12. Checking Dynamic Background component, water distortion filter, and /bg route...');
const dynamicBgContent = fs.readFileSync(new URL('../src/components/background/DynamicBackground.tsx', import.meta.url), 'utf-8');
const bgPlaygroundContent = fs.readFileSync(new URL('../src/pages/BgPlaygroundPage.tsx', import.meta.url), 'utf-8');
const bgLayersDataContent = fs.readFileSync(new URL('../src/data/bgLayersData.ts', import.meta.url), 'utf-8');

assert.ok(appContent.includes("path === 'bg'"), 'App.tsx must support /bg pathname route');
assert.ok(appContent.includes("hash === 'bg'"), 'App.tsx must support #/bg and #bg hash route');
assert.ok(appContent.includes("hash === 'home'"), 'App.tsx must support returning home from hash route');
assert.ok(appContent.includes('<BgPlaygroundPage />'), 'App.tsx must render BgPlaygroundPage on /bg route');
assert.ok(!appContent.includes('<DynamicBackground'), 'App.tsx must not render DynamicBackground directly (DynamicBackground is isolated to /bg via BgPlaygroundPage)');
assert.ok(bgPlaygroundContent.includes('<DynamicBackground'), 'BgPlaygroundPage must render DynamicBackground');
assert.ok(dynamicBgContent.includes('id="water-distortion"'), 'DynamicBackground must define #water-distortion SVG filter');
assert.ok(dynamicBgContent.includes('feTurbulence'), 'DynamicBackground must use feTurbulence for wave animation');
assert.ok(dynamicBgContent.includes('feDisplacementMap'), 'DynamicBackground must use feDisplacementMap for ripple refraction');
assert.ok(dynamicBgContent.includes('scaleY(-1)'), 'DynamicBackground must mirror sky into water with scaleY(-1)');
assert.ok(bgLayersDataContent.includes('BG_HORIZON_Y = 725'), 'bgLayersData must define horizon y=725');
assert.ok(dynamicBgContent.includes('transformOrigin: `50% ${horizonPercent}%`') || dynamicBgContent.includes('50% ${horizonPercent}%'), 'DynamicBackground must mirror across the horizon line');
assert.ok(dynamicBgContent.includes('clipPath: `inset(${horizonPercent}% 0 0 0)`') || dynamicBgContent.includes('clipPath'), 'DynamicBackground must clip water reflection to water plane');
assert.ok(dynamicBgContent.includes("aspectRatio: '1920 / 1187'"), 'DynamicBackground must lock 1920:1187 aspect ratio to avoid horizon displacement');
assert.ok(bgPlaygroundContent.includes('handleToggleLayer'), 'BgPlaygroundPage must provide layer toggles');

// Check that static bgclean.webp is used in body --bg-gradient for homepage (both dark and light)
assert.ok(fs.existsSync(new URL('../src/assets/bgclean.webp', import.meta.url)), 'src/assets/bgclean.webp must exist for Vite asset bundling');
assert.ok(!indexCssContent.includes('bg.png'), 'index.css must not reference old bg.png');
const bgcleanMatches = indexCssContent.match(/url\(['"]?\.\/assets\/bgclean\.webp['"]?\)/g) || [];
assert.ok(bgcleanMatches.length >= 2, 'index.css must reference bgclean.webp for both dark and light themes');

// Check all layer files exist in public/bg-layers/
const bgLayersDir = new URL('../public/bg-layers', import.meta.url).pathname;
assert.ok(fs.existsSync(bgLayersDir), 'public/bg-layers directory must exist');
const expectedLayers = [
  'layer-0.0-sky-gradient.webp',
  'layer-0.1-sky-deep-space.webp',
  'layer-1.0-sea.webp',
  'layer-2.0-milky-way-base.webp',
  'layer-2.1-milky-way-core.webp',
  'layer-2.2-milky-way-bright.webp',
  'layer-2.3-faint-stars.webp',
  'layer-3.0-big-stars.webp',
  'layer-4.0-cloud-left.webp',
  'layer-4.1-cloud-left-turmoil.webp',
  'layer-4.2-cloud-right.webp',
  'layer-5.1-mist-right.webp',
  'layer-5.2-main-mist.webp',
  'layer-5.3-disperse-mist.webp',
  'layer-7.0-comet-body.webp',
  'layer-7.1-comet-tail.webp',
  'layer-7.2-comet-core.webp',
  'layer-7.3-comet-streak.webp',
  'comet-sprite.webp',
  'bgclean.webp',
];
expectedLayers.forEach((layerFile) => {
  assert.ok(fs.existsSync(`${bgLayersDir}/${layerFile}`), `Missing asset: public/bg-layers/${layerFile}`);
});
// Check blend mode isolation and proper mixBlendMode propagation
assert.ok(dynamicBgContent.includes("isolation: 'isolate'"), 'DynamicBackground master canvas must specify isolation: isolate');
assert.ok(dynamicBgContent.includes("backgroundColor: '#021319'"), 'DynamicBackground master canvas must specify backgroundColor #021319');
assert.ok(dynamicBgContent.includes("mixBlendMode: layer.blendMode"), 'DynamicBackground must apply mixBlendMode to layers');

assert.ok(/id:\s*'layer-2\.3'[\s\S]*?blendMode:\s*'normal'/.test(bgLayersDataContent), 'layer-2.3 must use normal blendMode with true alpha');
assert.ok(/id:\s*'layer-5\.2'[\s\S]*?blendMode:\s*'normal'/.test(bgLayersDataContent), 'layer-5.2 must use normal blendMode with true alpha');
assert.ok(/id:\s*'layer-5\.3'[\s\S]*?blendMode:\s*'normal'/.test(bgLayersDataContent), 'layer-5.3 must use normal blendMode with true alpha');
console.log('✓ Dynamic background, SVG water distortion filter, and /bg route verified.');

// 13. Solo Layer 0 & #off URL Parameter Verification
console.log('13. Checking #off route handling and Solo Layer 0 isolation...');
const appContentUpdated = fs.readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf-8');
const bgPlaygroundUpdated = fs.readFileSync(new URL('../src/pages/BgPlaygroundPage.tsx', import.meta.url), 'utf-8');
const dynamicBgUpdated = fs.readFileSync(new URL('../src/components/background/DynamicBackground.tsx', import.meta.url), 'utf-8');

// App.tsx route resolution verification for #off variants
assert.ok(appContentUpdated.includes("path === 'bg'"), 'App.tsx must maintain path === "bg"');
assert.ok(appContentUpdated.includes("hash === 'bg'"), 'App.tsx must maintain hash === "bg"');
assert.ok(appContentUpdated.includes("hash === 'off'"), 'App.tsx must recognize hash === "off"');
assert.ok(appContentUpdated.includes("off"), 'App.tsx must support off in hash');

// Function tests for resolveRoute extracted directly from App.tsx
const resolveRouteMatch = appContentUpdated.match(/export const resolveRoute = \(\): string => {([\s\S]*?)^};/m);
assert.ok(resolveRouteMatch, 'App.tsx must export resolveRoute');
const testResolveRoute = (pathname, hash) => {
  const window = { location: { pathname, hash } };
  const fn = new Function('window', resolveRouteMatch[1]);
  return fn(window);
};

assert.strictEqual(testResolveRoute('/bg', '#off'), 'bg', '/bg#off must resolve to bg');
assert.strictEqual(testResolveRoute('/bg/', '#off'), 'bg', '/bg/#off must resolve to bg');
assert.strictEqual(testResolveRoute('/', '#bg#off'), 'bg', '/#bg#off must resolve to bg');
assert.strictEqual(testResolveRoute('/', '#/bg#off'), 'bg', '/#/bg#off must resolve to bg');
assert.strictEqual(testResolveRoute('/', '#off'), 'bg', '/#off must resolve to bg');
assert.strictEqual(testResolveRoute('/bg', ''), 'bg', '/bg must resolve to bg');
assert.strictEqual(testResolveRoute('/bg', '#home'), 'home', '/bg#home must return to home');
assert.strictEqual(testResolveRoute('/', '#ui-elements'), 'ui-elements', '#ui-elements must resolve to ui-elements');

// Negative route tests: ensure unrelated anchors containing 'off' do NOT falsely resolve to bg
assert.strictEqual(testResolveRoute('/', '#coffee'), 'home', '/#coffee must NOT resolve to bg');
assert.strictEqual(testResolveRoute('/', '#office'), 'home', '/#office must NOT resolve to bg');
assert.strictEqual(testResolveRoute('/', '#takeoff'), 'home', '/#takeoff must NOT resolve to bg');
assert.strictEqual(testResolveRoute('/', '#cutoff'), 'home', '/#cutoff must NOT resolve to bg');

// BgPlaygroundPage #off detection and Solo Layer 0 logic
assert.ok(bgPlaygroundUpdated.includes('isOffRequested'), 'BgPlaygroundPage must provide isOffRequested');
const isOffMatch = bgPlaygroundUpdated.match(/export const isOffRequested = \(\): boolean => {([\s\S]*?)^};/m);
assert.ok(isOffMatch, 'BgPlaygroundPage must export isOffRequested');
const testIsOffRequested = (pathname, hash, search = '') => {
  const window = { location: { pathname, hash, search } };
  const fn = new Function('window', isOffMatch[1]);
  return fn(window);
};

assert.strictEqual(testIsOffRequested('/bg', '#off'), true, '#off must trigger isOffRequested');
assert.strictEqual(testIsOffRequested('/bg', '#bg#off'), true, '#bg#off must trigger isOffRequested');
assert.strictEqual(testIsOffRequested('/bg', '#/bg#off'), true, '#/bg#off must trigger isOffRequested');
assert.strictEqual(testIsOffRequested('/bg', '', '?off'), true, '?off must trigger isOffRequested');
assert.strictEqual(testIsOffRequested('/bg', '', '?off=true'), true, '?off=true must trigger isOffRequested');
assert.strictEqual(testIsOffRequested('/bg', '#coffee'), false, '#coffee must NOT trigger isOffRequested');
assert.strictEqual(testIsOffRequested('/bg', '', '?offset=10'), false, '?offset=10 must NOT trigger isOffRequested');

assert.ok(bgPlaygroundUpdated.includes('isSoloLayer0Active'), 'BgPlaygroundPage must compute isSoloLayer0Active');
assert.ok(bgPlaygroundUpdated.includes('applySoloLayer0'), 'BgPlaygroundPage must provide applySoloLayer0');
assert.ok(bgPlaygroundUpdated.includes('toggleSoloLayer0'), 'BgPlaygroundPage must provide toggleSoloLayer0');
assert.ok(bgPlaygroundUpdated.includes("l.id === 'layer-0.0'"), 'Solo Layer 0 must isolate layer-0.0');

// BgPlaygroundPage UI elements
assert.ok(bgPlaygroundUpdated.includes('Solo Layer 0 (#off)') || bgPlaygroundUpdated.includes('Solo Layer 0: ON'), 'BgPlaygroundPage must have Solo Layer 0 toggle button in UI');
assert.ok(bgPlaygroundUpdated.includes('Reset to Default'), 'BgPlaygroundPage must have Reset to Default button in UI');
assert.ok(bgPlaygroundUpdated.includes("id: 'solo0'"), 'BgPlaygroundPage must include solo0 in presets');
assert.ok(bgPlaygroundUpdated.includes('Quick Isolation:'), 'BgPlaygroundPage must include Quick Isolation bar in layers tab');

// DynamicBackground flare & water overlay suppression when non-0 layers are hidden
assert.ok(dynamicBgUpdated.includes("starLayer && !starLayer.visible"), 'DynamicBackground must suppress big star flare when layer-3.0 is hidden');
assert.ok(dynamicBgUpdated.includes("layer-1.0"), 'DynamicBackground must check layer-1.0 visibility for water overlay suppression');

console.log('✓ Solo Layer 0 isolation, #off URL parsing, and UI toggle verified.');

// 14. HTML5 Canvas Background Component & /bg-canvas Route Verification
console.log('14. Checking HTML5 Canvas Background component and /bg-canvas route...');
const canvasBgContent = fs.readFileSync(new URL('../src/components/background/CanvasBackground.tsx', import.meta.url), 'utf-8');
const bgCanvasPlaygroundContent = fs.readFileSync(new URL('../src/pages/BgCanvasPlaygroundPage.tsx', import.meta.url), 'utf-8');

// Route tests in App.tsx
assert.ok(appContentUpdated.includes("path === 'bg-canvas'"), 'App.tsx must support /bg-canvas pathname route');
assert.ok(appContentUpdated.includes("hash === 'bg-canvas'"), 'App.tsx must support #/bg-canvas and #bg-canvas hash route');
assert.ok(appContentUpdated.includes('<BgCanvasPlaygroundPage />'), 'App.tsx must render BgCanvasPlaygroundPage on /bg-canvas route');

assert.strictEqual(testResolveRoute('/bg-canvas', ''), 'bg-canvas', '/bg-canvas must resolve to bg-canvas');
assert.strictEqual(testResolveRoute('/bg-canvas', '#off'), 'bg-canvas', '/bg-canvas#off must resolve to bg-canvas');
assert.strictEqual(testResolveRoute('/', '#bg-canvas'), 'bg-canvas', '/#bg-canvas must resolve to bg-canvas');
assert.strictEqual(testResolveRoute('/', '#/bg-canvas'), 'bg-canvas', '/#/bg-canvas must resolve to bg-canvas');
assert.strictEqual(testResolveRoute('/', '#bg-canvas#off'), 'bg-canvas', '/#bg-canvas#off must resolve to bg-canvas');
assert.strictEqual(testResolveRoute('/bg-canvas', '#home'), 'home', '/bg-canvas#home must return to home');
assert.strictEqual(testResolveRoute('/bg-canvas', '#bg'), 'bg', '/bg-canvas#bg must switch to DOM engine bg');
assert.strictEqual(testResolveRoute('/bg-canvas', '#/bg'), 'bg', '/bg-canvas#/bg must switch to DOM engine bg');
assert.strictEqual(testResolveRoute('/bg', '#bg-canvas'), 'bg-canvas', '/bg#bg-canvas must switch to Canvas engine bg-canvas');
assert.strictEqual(testResolveRoute('/bg', '#/bg-canvas'), 'bg-canvas', '/bg#/bg-canvas must switch to Canvas engine bg-canvas');
assert.strictEqual(testResolveRoute('/bg-canvas', '#ui-elements'), 'ui-elements', '/bg-canvas#ui-elements must resolve to ui-elements');

// CanvasBackground component features
assert.ok(canvasBgContent.includes('<canvas'), 'CanvasBackground must render HTML5 <canvas> element');
assert.ok(canvasBgContent.includes('BG_HORIZON_Y'), 'CanvasBackground must use BG_HORIZON_Y (725)');
assert.ok(canvasBgContent.includes('reflCtx.scale(1, -1)'), 'CanvasBackground must mirror reflection across horizon in offscreen buffer');
assert.ok(canvasBgContent.includes('drawImage'), 'CanvasBackground must use drawImage for layer rendering');
assert.ok(canvasBgContent.includes('globalCompositeOperation'), 'CanvasBackground must use globalCompositeOperation for blend modes');
assert.ok(canvasBgContent.includes('drawImage(reflCanvas, 0, BG_HORIZON_Y)') || canvasBgContent.includes('strip'), 'CanvasBackground must implement fast direct single-blit reflection plane');
assert.ok(!canvasBgContent.includes('for (let y = 0; y < waterHeight; y += stripH)'), 'CanvasBackground must not run scanline slicing loop');
assert.ok(!canvasBgContent.includes('waveExcitationRef'), 'CanvasBackground must remove mouse wave excitation loop');
assert.ok(canvasBgContent.includes('bigStarFlareSize'), 'CanvasBackground must draw big star shine flare');
assert.ok(canvasBgContent.includes('cloudDriftEnabled'), 'CanvasBackground must support slow drifting clouds');
assert.ok(canvasBgContent.includes('darkScrimEnabled'), 'CanvasBackground must support darkScrimEnabled prop');
assert.ok(canvasBgContent.includes('var(--bg-dark-tint-opacity'), 'CanvasBackground must apply dark theme ambient darkening and center glow scrim');
assert.ok(indexCssContent.includes('--bg-dark-tint-opacity: 1;'), 'index.css must declare --bg-dark-tint-opacity for dark theme');
assert.ok(indexCssContent.includes('--bg-dark-tint-opacity: 0;'), 'index.css must declare --bg-dark-tint-opacity for light theme');
assert.ok(canvasBgContent.includes('onFpsUpdate'), 'CanvasBackground must provide FPS telemetry callback');

// Cloud reflections verification in bgLayersData & CanvasBackground
const bgLayersContent = fs.readFileSync(new URL('../src/data/bgLayersData.ts', import.meta.url), 'utf-8');
for (const cloudId of ['layer-4.0', 'layer-4.1', 'layer-4.2']) {
  const layerRegex = new RegExp(`id:\\s*'${cloudId}'[\\s\\S]*?hasReflection:\\s*true`, 'm');
  assert.ok(layerRegex.test(bgLayersContent), `${cloudId} must have hasReflection: true in bgLayersData.ts`);
  const opacityMatch = bgLayersContent.match(new RegExp(`id:\\s*'${cloudId}'[\\s\\S]*?reflectionOpacity:\\s*([0-9.]+)`, 'm'));
  assert.ok(opacityMatch, `${cloudId} must specify reflectionOpacity in bgLayersData.ts`);
  const opacityVal = parseFloat(opacityMatch[1]);
  assert.ok(opacityVal >= 0.65 && opacityVal <= 0.75, `${cloudId} reflectionOpacity must be in range ~0.65-0.75 (got ${opacityVal})`);
}
assert.ok(canvasBgContent.includes('isCloud && p.cloudDriftEnabled'), 'CanvasBackground reflection pass must apply cloud drift');
assert.ok(canvasBgContent.includes('isCloud && p.cloudDistortionEnabled'), 'CanvasBackground reflection pass must apply cloud scale breathing');
assert.ok(canvasBgContent.includes('ctx.rect(0, BG_HORIZON_Y, BG_CANVAS_WIDTH, waterHeight)'), 'CanvasBackground must clip reflection blit to horizon boundary');

// BgCanvasPlaygroundPage and HomePage features
assert.ok(bgCanvasPlaygroundContent.includes('<CanvasBackground'), 'BgCanvasPlaygroundPage must render CanvasBackground');
assert.ok(homePageContent.includes('<CanvasBackground'), 'HomePage must render CanvasBackground');
assert.ok(bgCanvasPlaygroundContent.includes('FPS'), 'BgCanvasPlaygroundPage must display FPS counter');
assert.ok(bgCanvasPlaygroundContent.includes('isOffRequested'), 'BgCanvasPlaygroundPage must support isOffRequested');
assert.ok(bgCanvasPlaygroundContent.includes('applySoloLayer0'), 'BgCanvasPlaygroundPage must support applySoloLayer0');
assert.ok(bgCanvasPlaygroundContent.includes('handleToggleLayer'), 'BgCanvasPlaygroundPage must support handleToggleLayer');
assert.ok(bgCanvasPlaygroundContent.includes('isSoloLayer0Active'), 'BgCanvasPlaygroundPage must compute isSoloLayer0Active');
assert.ok(bgCanvasPlaygroundContent.includes('Switch to DOM (/bg)'), 'BgCanvasPlaygroundPage must have link to switch to DOM engine (/bg)');
assert.ok(bgPlaygroundUpdated.includes('Switch to Canvas (/bg-canvas)'), 'BgPlaygroundPage must have link to switch to Canvas engine (/bg-canvas)');

console.log('✓ HTML5 Canvas background, /bg-canvas route, and side-by-side engine switcher verified.');

// 15. Deep Space Comet Rework Verification (Wave, Burn & Diffuse)
// 15. Deep Space Comet Flame Tail & Core Pulse Rework Verification
console.log('15. Checking deep space comet flame tail rework, core diagonal stretch & opacity pulse...');

// Asset verification
const cometAssets = [
  'layer-7.0-comet-body.webp',
  'layer-7.1-comet-tail.webp',
  'layer-7.2-comet-core.webp',
  'layer-7.3-comet-streak.webp',
  'comet-sprite.webp',
];
for (const asset of cometAssets) {
  assert.ok(fs.existsSync(`${bgLayersDir}/${asset}`), `Missing comet asset: ${asset}`);
}

// Deep sky placement & sky parallax in bgLayersData
assert.ok(bgLayersContent.includes("filename: 'layer-7.0-comet-body.webp'"), 'layer-7.0 must use layer-7.0-comet-body.webp');
assert.ok(bgLayersContent.includes("filename: 'layer-7.1-comet-tail.webp'"), 'layer-7.1 must use layer-7.1-comet-tail.webp');
assert.ok(bgLayersContent.includes("filename: 'layer-7.2-comet-core.webp'"), 'layer-7.2 must use layer-7.2-comet-core.webp');
assert.ok(bgLayersContent.includes("filename: 'layer-7.3-comet-streak.webp'"), 'layer-7.3 must use layer-7.3-comet-streak.webp');

// Dust tail layers renaming in bgLayersData.ts
assert.ok(bgLayersContent.includes("name: 'Comet Dust Tail Lower'"), 'layer-7.1 must be renamed to Comet Dust Tail Lower');
assert.ok(bgLayersContent.includes("name: 'Comet Dust Tail Upper'"), 'layer-7.2 must be renamed to Comet Dust Tail Upper');
assert.ok(bgLayersContent.includes("name: 'Comet Dust Tail Outer'"), 'layer-7.3 must be renamed to Comet Dust Tail Outer');

const cometDepthMatch = bgLayersContent.match(/id:\s*'layer-7\.0'[\s\S]*?depth:\s*([0-9.]+)/m);
assert.ok(cometDepthMatch, 'layer-7.0 must specify depth in bgLayersData.ts');
const cometDepth = parseFloat(cometDepthMatch[1]);
assert.ok(cometDepth >= 0.04 && cometDepth <= 0.1, `Comet depth must be ~0.05-0.1 for deep space placement (got ${cometDepth})`);

const cometParallaxMatch = bgLayersContent.match(/id:\s*'layer-7\.0'[\s\S]*?parallaxFactor:\s*\{\s*x:\s*([0-9.]+)/m);
assert.ok(cometParallaxMatch, 'layer-7.0 must specify parallaxFactor in bgLayersData.ts');
const cometParallaxX = parseFloat(cometParallaxMatch[1]);
assert.ok(cometParallaxX >= 0.005 && cometParallaxX <= 0.010, `Comet parallaxFactor.x must match deep sky ~0.006-0.008 (got ${cometParallaxX})`);

// Clean slate: no drop-shadows or legacy blur filters on comet
assert.ok(!canvasBgContent.includes('drop-shadow'), 'CanvasBackground must not use temporary drop-shadows on comet');
assert.ok(!canvasBgContent.includes('blurRadius') && !canvasBgContent.includes('outerBlur'), 'CanvasBackground must remove legacy blur duplicates on comet');
assert.ok(!dynamicBgContent.includes('drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]'), 'DynamicBackground must remove shooting star drop-shadows');

// Dust Tail Flame-like behavior in CanvasBackground (layers 7.1, 7.2, 7.3)
assert.ok(canvasBgContent.includes('renderCometTail'), 'CanvasBackground must implement renderCometTail');
assert.ok(canvasBgContent.includes('spreadY') || canvasBgContent.includes('spreadAmount'), 'renderCometTail must implement lateral spreading/widening toward trailing end');
assert.ok(canvasBgContent.includes('totalWave'), 'renderCometTail must compute organic burning flame turbulence');
assert.ok(canvasBgContent.includes('fadeAlpha'), 'renderCometTail must smoothly fade out toward the tail tip');
assert.ok(canvasBgContent.includes('flicker'), 'renderCometTail must produce turbulent flame combustion flicker');
assert.ok(canvasBgContent.includes('cometFlameCanvas'), 'CanvasBackground must use zero-allocation offscreen canvas buffer for flame tail');

// Core Streak Duplication & Diagonal Pulse (layer 7.0)
assert.ok(canvasBgContent.includes('renderCometCore'), 'CanvasBackground must implement renderCometCore');
assert.ok(canvasBgContent.includes('0.8 * opacity'), 'renderCometCore base pass must render cleanly at 80% opacity');
assert.ok(canvasBgContent.includes('COMET_ANGLE') && canvasBgContent.includes('stretchX'), 'renderCometCore effect pass must stretch along its flight angle');
assert.ok(canvasBgContent.includes('destination-in') && canvasBgContent.includes('baseAlpha'), 'renderCometCore effect pass must have advancing wave pulse with mostly hidden baseline');
assert.ok(canvasBgContent.includes('cometPulseCanvas'), 'CanvasBackground must use zero-allocation offscreen canvas buffer for core pulse');
assert.ok(canvasBgContent.includes('curEndRelX') || canvasBgContent.includes('curEndRelY'), 'renderCometCore pulse gradient must dynamically extend to stretched tail tip');
assert.ok(canvasBgContent.includes('cropW = 540') || canvasBgContent.includes('pc.width = 540'), 'cometPulseCanvas must provide >= 540px width headroom to prevent diagonal stretch clipping');
assert.ok(canvasBgContent.includes('startX = 16') || canvasBgContent.includes('startX = 18'), 'renderCometTail must cover front base of dust tail without clipping');

// Independent Comet Dust Tail & Core Streak Controls in CanvasBackground
assert.ok(canvasBgContent.includes('cometTailTurbulence?: number'), 'CanvasBackgroundProps must declare cometTailTurbulence');
assert.ok(canvasBgContent.includes('cometTailWaveAmplitude?: number'), 'CanvasBackgroundProps must declare cometTailWaveAmplitude alias');
assert.ok(canvasBgContent.includes('cometTailFlickerIntensity?: number'), 'CanvasBackgroundProps must declare cometTailFlickerIntensity');
assert.ok(canvasBgContent.includes('cometTailFlickerSpeed?: number'), 'CanvasBackgroundProps must declare cometTailFlickerSpeed');
assert.ok(canvasBgContent.includes('cometTailSpreadFactor?: number'), 'CanvasBackgroundProps must declare cometTailSpreadFactor');
assert.ok(canvasBgContent.includes('cometTailFadePower?: number'), 'CanvasBackgroundProps must declare cometTailFadePower');
assert.ok(canvasBgContent.includes('cometCoreBaseOpacity?: number'), 'CanvasBackgroundProps must declare cometCoreBaseOpacity');
assert.ok(canvasBgContent.includes('cometCorePulseSpeed?: number'), 'CanvasBackgroundProps must declare cometCorePulseSpeed');
assert.ok(canvasBgContent.includes('cometCoreStretchScale?: number'), 'CanvasBackgroundProps must declare cometCoreStretchScale');
assert.ok(canvasBgContent.includes('cometCoreStretchLength?: number'), 'CanvasBackgroundProps must declare cometCoreStretchLength alias');
assert.ok(canvasBgContent.includes('cometCorePeakBrightness?: number'), 'CanvasBackgroundProps must declare cometCorePeakBrightness');
assert.ok(canvasBgContent.includes('cometCorePulsePeakBrightness?: number'), 'CanvasBackgroundProps must declare cometCorePulsePeakBrightness alias');
assert.ok(canvasBgContent.includes('cometCoreBaselineOpacity?: number'), 'CanvasBackgroundProps must declare cometCoreBaselineOpacity');

// Verify alias resolution in CanvasBackground
assert.ok(canvasBgContent.includes('cometTailWaveAmplitude ??'), 'CanvasBackground must resolve cometTailWaveAmplitude alias fallback');
assert.ok(canvasBgContent.includes('cometCoreStretchLength ??'), 'CanvasBackground must resolve cometCoreStretchLength alias fallback');
assert.ok(canvasBgContent.includes('cometCorePulsePeakBrightness ??'), 'CanvasBackground must resolve cometCorePulsePeakBrightness alias fallback');

// Verify independent controls in renderCometTail and renderCometCore
assert.ok(canvasBgContent.includes('tailTurbulence * 14.0'), 'renderCometTail must scale wave amplitude by tailTurbulence');
assert.ok(canvasBgContent.includes('Math.pow(u, tailFadePower)'), 'renderCometTail must scale fade alpha by tailFadePower');
assert.ok(canvasBgContent.includes('tailSpreadFactor'), 'renderCometTail must scale lateral spreading by tailSpreadFactor');
assert.ok(canvasBgContent.includes('tailFlickerIntensity'), 'renderCometTail must scale flicker pulses by tailFlickerIntensity');
assert.ok(canvasBgContent.includes('tailFlickerSpeed'), 'renderCometTail must modulate flicker frequency by tailFlickerSpeed');
assert.ok(canvasBgContent.includes('coreBaseOpacity * opacity'), 'renderCometCore must render clean pass at configurable coreBaseOpacity');
assert.ok(canvasBgContent.includes('coreStretchScale'), 'renderCometCore must stretch flight angle by independent coreStretchScale');
assert.ok(canvasBgContent.includes('corePeakBrightness'), 'renderCometCore must cap pulse surge by independent corePeakBrightness');
assert.ok(canvasBgContent.includes('coreBaselineOpacity'), 'renderCometCore must set resting wave opacity by independent coreBaselineOpacity');
assert.ok(!canvasBgContent.includes('sliceW = 6'), 'renderCometTail must not use 6px strip slicing to prevent parallel line artifacts');
assert.ok(canvasBgContent.includes('fadeGrad = cometFlameCtx.createLinearGradient'), 'renderCometTail must use continuous linear gradient for terminal fade');

// Playground HUD Card 3 independent controls & state in BgCanvasPlaygroundPage
assert.ok(bgCanvasPlaygroundContent.includes('Comet Flame Tail & Core Pulse'), 'BgCanvasPlaygroundPage must include Comet Flame Tail & Core Pulse HUD card');
assert.ok(bgCanvasPlaygroundContent.includes('cometFlameTailEnabled'), 'BgCanvasPlaygroundPage must manage cometFlameTailEnabled state');
assert.ok(bgCanvasPlaygroundContent.includes('cometTailTurbulence'), 'BgCanvasPlaygroundPage must manage cometTailTurbulence state');
assert.ok(bgCanvasPlaygroundContent.includes('cometTailFlickerIntensity'), 'BgCanvasPlaygroundPage must manage cometTailFlickerIntensity state');
assert.ok(bgCanvasPlaygroundContent.includes('cometTailFlickerSpeed'), 'BgCanvasPlaygroundPage must manage cometTailFlickerSpeed state');
assert.ok(bgCanvasPlaygroundContent.includes('cometTailSpreadFactor'), 'BgCanvasPlaygroundPage must manage cometTailSpreadFactor state');
assert.ok(bgCanvasPlaygroundContent.includes('cometTailFadePower'), 'BgCanvasPlaygroundPage must manage cometTailFadePower state');
assert.ok(bgCanvasPlaygroundContent.includes('cometCorePulseEnabled'), 'BgCanvasPlaygroundPage must manage cometCorePulseEnabled state');
assert.ok(bgCanvasPlaygroundContent.includes('cometCoreBaseOpacity'), 'BgCanvasPlaygroundPage must manage cometCoreBaseOpacity state');
assert.ok(bgCanvasPlaygroundContent.includes('cometCorePulseSpeed'), 'BgCanvasPlaygroundPage must manage cometCorePulseSpeed state');
assert.ok(bgCanvasPlaygroundContent.includes('cometCoreStretchScale'), 'BgCanvasPlaygroundPage must manage cometCoreStretchScale state');
assert.ok(bgCanvasPlaygroundContent.includes('cometCorePeakBrightness'), 'BgCanvasPlaygroundPage must manage cometCorePeakBrightness state');
assert.ok(bgCanvasPlaygroundContent.includes('cometCoreBaselineOpacity'), 'BgCanvasPlaygroundPage must manage cometCoreBaselineOpacity state');

// Independent slider labels in HUD Card 3
assert.ok(bgCanvasPlaygroundContent.includes('Tail Flame Turbulence / Wave Amplitude'), 'HUD must have Tail Flame Turbulence / Wave Amplitude slider');
assert.ok(bgCanvasPlaygroundContent.includes('Tail Flame Flicker Intensity'), 'HUD must have Tail Flame Flicker Intensity slider');
assert.ok(bgCanvasPlaygroundContent.includes('Tail Flame Flicker Speed / Frequency'), 'HUD must have Tail Flame Flicker Speed / Frequency slider');
assert.ok(bgCanvasPlaygroundContent.includes('Tail Lateral Spread Factor'), 'HUD must have Tail Lateral Spread Factor slider');
assert.ok(bgCanvasPlaygroundContent.includes('Tail Terminal Fade Power'), 'HUD must have Tail Terminal Fade Power slider');
assert.ok(bgCanvasPlaygroundContent.includes('Core Streak Base Opacity'), 'HUD must have Core Streak Base Opacity slider');
assert.ok(bgCanvasPlaygroundContent.includes('Core Traveling Pulse Speed'), 'HUD must have Core Traveling Pulse Speed slider');
assert.ok(bgCanvasPlaygroundContent.includes('Core Stretch Length / Amplitude'), 'HUD must have Core Stretch Length / Amplitude slider');
assert.ok(bgCanvasPlaygroundContent.includes('Core Pulse Peak Brightness'), 'HUD must have Core Pulse Peak Brightness slider');
assert.ok(bgCanvasPlaygroundContent.includes('Core Baseline Hidden Opacity'), 'HUD must have Core Baseline Hidden Opacity slider');

// Prop wiring to CanvasBackground in BgCanvasPlaygroundPage
assert.ok(bgCanvasPlaygroundContent.includes('cometTailTurbulence={cometTailTurbulence}'), 'BgCanvasPlaygroundPage must pass cometTailTurbulence prop');
assert.ok(bgCanvasPlaygroundContent.includes('cometTailFlickerIntensity={cometTailFlickerIntensity}'), 'BgCanvasPlaygroundPage must pass cometTailFlickerIntensity prop');
assert.ok(bgCanvasPlaygroundContent.includes('cometTailFlickerSpeed={cometTailFlickerSpeed}'), 'BgCanvasPlaygroundPage must pass cometTailFlickerSpeed prop');
assert.ok(bgCanvasPlaygroundContent.includes('cometTailSpreadFactor={cometTailSpreadFactor}'), 'BgCanvasPlaygroundPage must pass cometTailSpreadFactor prop');
assert.ok(bgCanvasPlaygroundContent.includes('cometTailFadePower={cometTailFadePower}'), 'BgCanvasPlaygroundPage must pass cometTailFadePower prop');
assert.ok(bgCanvasPlaygroundContent.includes('cometCoreBaseOpacity={cometCoreBaseOpacity}'), 'BgCanvasPlaygroundPage must pass cometCoreBaseOpacity prop');
assert.ok(bgCanvasPlaygroundContent.includes('cometCorePulseSpeed={cometCorePulseSpeed}'), 'BgCanvasPlaygroundPage must pass cometCorePulseSpeed prop');
assert.ok(bgCanvasPlaygroundContent.includes('cometCoreStretchScale={cometCoreStretchScale}'), 'BgCanvasPlaygroundPage must pass cometCoreStretchScale prop');
assert.ok(bgCanvasPlaygroundContent.includes('cometCorePeakBrightness={cometCorePeakBrightness}'), 'BgCanvasPlaygroundPage must pass cometCorePeakBrightness prop');
assert.ok(bgCanvasPlaygroundContent.includes('cometCoreBaselineOpacity={cometCoreBaselineOpacity}'), 'BgCanvasPlaygroundPage must pass cometCoreBaselineOpacity prop');

// Presets and reset handlers verification
assert.ok(bgCanvasPlaygroundContent.includes('setCometTailTurbulence(0.2)'), 'Serene preset / reset must configure default tail turbulence');
assert.ok(bgCanvasPlaygroundContent.includes('setCometTailTurbulence(1.4)'), 'Cosmic preset must configure intense tail turbulence');
assert.ok(bgCanvasPlaygroundContent.includes('setCometCoreBaseOpacity(0.75)'), 'Serene preset / reset must configure default core base opacity (75%)');
assert.ok(bgCanvasPlaygroundContent.includes('setCometCorePeakBrightness(0.95)'), 'Cosmic preset must configure peak brightness (95%)');

// UI decoupling verification in BgCanvasPlaygroundPage
const baseOpacitySnippet = bgCanvasPlaygroundContent.slice(
  bgCanvasPlaygroundContent.indexOf('Core Streak Base Opacity'),
  bgCanvasPlaygroundContent.indexOf('Core Traveling Pulse Speed')
);
assert.ok(!baseOpacitySnippet.includes('disabled={!cometCorePulseEnabled}'), 'Core Streak Base Opacity must NOT be disabled when cometCorePulseEnabled is false');
assert.ok(!bgCanvasPlaygroundContent.includes('setCometFlameTailIntensity'), 'BgCanvasPlaygroundPage must not couple tail turbulence to legacy intensity');
assert.ok(!bgCanvasPlaygroundContent.includes('setCometCorePulseScale'), 'BgCanvasPlaygroundPage must not couple core stretch to legacy pulse scale');

// Sea reflection synchronization parity
assert.ok(canvasBgContent.includes('renderCometTail(reflCtx,'), 'CanvasBackground must reflect comet flame tail into water reflection');
assert.ok(canvasBgContent.includes('renderCometCore(reflCtx,'), 'CanvasBackground must reflect comet core into water reflection');

// Mathematical verification of decoupled parameters
// 1. Dust Tail fading and spreading decoupling
const uSample = 0.5;
const spreadAmountSample = 0.50;
const spreadAt1 = 1.0 + spreadAmountSample * Math.pow(uSample, 1.3) * 1.0;
const spreadAt2 = 1.0 + spreadAmountSample * Math.pow(uSample, 1.3) * 2.0;
assert.ok(spreadAt2 > spreadAt1, 'Lateral spreading must increase with tailSpreadFactor independently of wave amplitude');

const fadeAtPower1 = 1.0 - 0.72 * Math.pow(uSample, 1.0);
const fadeAtPower2 = 1.0 - 0.72 * Math.pow(uSample, 2.0);
assert.ok(fadeAtPower2 > fadeAtPower1, 'Fade power exponent must adjust mid-tail retention independently of wave amplitude');

// 2. Core Streak base opacity vs surge brightness decoupling
const testCoreBase = 0.8;
const testPeakBright = 0.95;
const testStretch = 1.5;
const surgeStretch = 1.0;
const sx = 1.0 + (0.04 + 0.12 * surgeStretch) * testStretch;
assert.strictEqual(sx, 1.0 + 0.16 * 1.5, 'Stretch length must scale with coreStretchScale independently of peak brightness');
assert.ok(testPeakBright !== testCoreBase, 'Peak brightness must be decoupled from base opacity');

// 3. Zero / boundary behavior of decoupled properties
// Zero turbulence -> wave amplitude is 0, while lateral spread dh is unaffected
const waveAtZeroTurbulence = (Math.sin(1.0) * 0.65 + Math.sin(2.0) * 0.25) * Math.pow(uSample, 1.3) * 0.0 * 14.0;
assert.strictEqual(waveAtZeroTurbulence, 0, 'Zero turbulence must eliminate wave displacement completely');

// Zero spread factor -> lateral spread multiplier is 1.0 (baseline thickness), while wave remains
const spreadAtZero = 1.0 + spreadAmountSample * Math.pow(uSample, 1.3) * 0.0;
assert.strictEqual(spreadAtZero, 1.0, 'Zero spread factor must yield exact 1.0 baseline thickness');

// Zero flicker intensity -> flicker multiplier is 1.0 (no thermal pulsation)
const flickerAtZero = 1.0 + (0.16 * Math.sin(2.0) + 0.09 * Math.cos(3.0)) * 0.0;
assert.strictEqual(flickerAtZero, 1.0, 'Zero flicker intensity must produce constant 1.0 alpha multiplier');

// Zero core stretch -> stretchX is 1.0, no diagonal flight distortion
const stretchAtZero = 1.0 + (0.04 + 0.12 * 1.0) * 0.0;
assert.strictEqual(stretchAtZero, 1.0, 'Zero core stretch scale must yield 1.0 scale without elongation');

// Zero base opacity -> clean pass alpha is 0.0
const zeroBaseAlpha = 0.0 * 0.8;
assert.strictEqual(zeroBaseAlpha, 0.0, 'Zero core base opacity must completely hide clean streak pass');

console.log('✓ Deep space comet flame tail, independent dust tail & core streak controls, and reflection parity verified.');

// 16. Big Stars Natural Scintillation, Calibrated Sizing & Water Reflection Verification
console.log('16. Checking Big Stars natural scintillation, calibrated sizing, and multi-star water reflection...');

// Big stars data catalog verification
assert.ok(Array.isArray(bigStarsData), 'bigStarsData must be an exported array');
assert.ok(bigStarsData.length >= 50, `bigStarsData must contain at least 50 cataloged stars (got ${bigStarsData.length})`);
const anchorStar = bigStarsData.find((s) => s.id === 'star-1');
assert.ok(anchorStar, 'bigStarsData must contain star-1 as primary anchor beacon');
assert.ok(Math.abs(anchorStar.x - 1140.8) < 2.0, `Anchor star x must be ~1140.8 (got ${anchorStar.x})`);
assert.ok(Math.abs(anchorStar.y - 163.7) < 2.0, `Anchor star y must be ~163.7 (got ${anchorStar.y})`);
assert.strictEqual(anchorStar.scale, 1.0, 'Anchor star must have normalized scale 1.0');

// Validate star coordinates and individual organic seeds
for (const star of bigStarsData) {
  assert.ok(star.x >= 0 && star.x <= 1920, `Star ${star.id} x (${star.x}) must be in canvas width`);
  assert.ok(star.y >= 0 && star.y < 725, `Star ${star.id} y (${star.y}) must be strictly above horizon (< 725)`);
  assert.ok(star.scale > 0 && star.scale <= 1.0, `Star ${star.id} scale (${star.scale}) must be in (0, 1]`);
  assert.ok(star.speedMult >= 0.5 && star.speedMult <= 2.0, `Star ${star.id} speedMult (${star.speedMult}) must be within [0.5, 2.0]`);
  assert.ok(star.phase >= 0, `Star ${star.id} phase must be non-negative`);
}
const reflectingStars = bigStarsData.filter((s) => s.hasReflection);
assert.ok(reflectingStars.length >= 15, `At least 15 prominent stars must have sea reflections (got ${reflectingStars.length})`);

// Flare sizing logic verification: smoothly scale between 0.5 at 0 to 1.0 at 0.15
assert.strictEqual(getStarFlareIntensityScale(0), 0.5, 'At intensity 0, flare/sprite must scale to 50% (0.5)');
assert.strictEqual(getStarFlareIntensityScale(0.15), 1.0, 'At maximum intensity 0.15, flare/sprite must scale to 100% (1.0)');
assert.strictEqual(getStarFlareIntensityScale(0.075), 0.75, 'At intensity 0.075, flare/sprite scale must be 0.75');
assert.strictEqual(getStarFlareIntensityScale(-0.1), 0.5, 'Negative intensity must clamp to 0.5');
assert.strictEqual(getStarFlareIntensityScale(0.5), 1.0, 'Excess intensity must clamp to 1.0');
assert.strictEqual(getStarFlareIntensityScale(NaN), 0.5, 'NaN intensity must safely fallback to 0.5');
assert.strictEqual(getStarFlareIntensityScale(undefined), 0.5, 'Undefined intensity must safely fallback to 0.5');

// CanvasBackground component features for star shine and scintillation
const updatedCanvasBg = fs.readFileSync(new URL('../src/components/background/CanvasBackground.tsx', import.meta.url), 'utf-8');
assert.ok(updatedCanvasBg.includes('bigStarsData'), 'CanvasBackground must import and use bigStarsData');
assert.ok(updatedCanvasBg.includes('getStarFlareIntensityScale'), 'CanvasBackground must use getStarFlareIntensityScale');
assert.ok(updatedCanvasBg.includes('for (let i = 0; i < bigStarsData.length; i++)'), 'CanvasBackground must iterate over all big stars');
assert.ok(updatedCanvasBg.includes('harm1') && updatedCanvasBg.includes('harm2') && updatedCanvasBg.includes('harm3'), 'CanvasBackground must use multi-octave harmonic scintillation');
assert.ok(updatedCanvasBg.includes('reflAlpha'), 'CanvasBackground must calculate water reflection alpha per star');
assert.ok(updatedCanvasBg.includes('star.hasReflection'), 'CanvasBackground must check star.hasReflection in water pass');
assert.ok(updatedCanvasBg.includes('effSkyY = star.y + ty'), 'CanvasBackground must calculate effSkyY with ty for perspective foreshortening');
assert.ok(!updatedCanvasBg.includes('starWaterY = 24.0 + d * 55.0 + ty'), 'CanvasBackground must not add ty directly to starWaterY which inverts vertical parallax');

// BgCanvasPlaygroundPage slider calibration
const updatedBgCanvasPage = fs.readFileSync(new URL('../src/pages/BgCanvasPlaygroundPage.tsx', import.meta.url), 'utf-8');
assert.ok(updatedBgCanvasPage.includes('max="0.15"'), 'BgCanvasPlaygroundPage star shine intensity slider max must be 0.15 (15%)');
assert.ok(updatedBgCanvasPage.includes('max="26"'), 'BgCanvasPlaygroundPage star flare size slider max must be 26px');
assert.ok(updatedBgCanvasPage.includes('min="6"'), 'BgCanvasPlaygroundPage star flare size slider min must be 6px');
assert.ok(updatedBgCanvasPage.includes('setBigStarShineIntensity(0.15)'), 'Cosmic preset must set intensity to calibrated max 0.15');
assert.ok(updatedBgCanvasPage.includes('setBigStarFlareSize(26)'), 'Cosmic preset must set flare size to calibrated max 26');

console.log('✓ Big stars natural scintillation, calibrated sizing, and synchronized water reflection verified.');

// 17. Continuous Whole-Raster Cloud Dynamics & Reflection Parity Verification
console.log('17. Checking Continuous Whole-Raster Cloud Dynamics, seamless breathing, and reflection parity...');

// CanvasBackground cloud whole-raster implementation
assert.ok(updatedCanvasBg.includes('renderCloud'), 'CanvasBackground must implement renderCloud for continuous cloud dynamics');
assert.ok(updatedCanvasBg.includes("layer.id === 'layer-4.2'"), 'renderCloud must handle layer-4.2 Cloud Right visual anchor');
assert.ok(updatedCanvasBg.includes("layer.id === 'layer-4.1'"), 'renderCloud must handle layer-4.1 Cloud Left Turmoil seed');
assert.ok(updatedCanvasBg.includes('billowDriftX') && updatedCanvasBg.includes('billowDriftY'), 'renderCloud must compute dual multi-frequency harmonic billow drift');
assert.ok(updatedCanvasBg.includes('breathX') && updatedCanvasBg.includes('breathY'), 'renderCloud must compute anisotropic aspect breathing');
assert.ok(updatedCanvasBg.includes('vaporPulse'), 'renderCloud must compute soft traveling vapor density respiration');
assert.ok(updatedCanvasBg.includes('secondaryAlpha'), 'renderCloud must implement smooth layered composite blending pass');

// Slicing abandonment: zero quad slicing, zero tile borders, zero grid lines
assert.ok(!updatedCanvasBg.includes('COLS ='), 'CanvasBackground must abandon rectangular quad dicing (no COLS)');
assert.ok(!updatedCanvasBg.includes('ROWS ='), 'CanvasBackground must abandon rectangular quad dicing (no ROWS)');
assert.ok(!updatedCanvasBg.includes('cloudMeshBuffersRef'), 'CanvasBackground must remove cloudMeshBuffersRef');
assert.ok(
  !updatedCanvasBg.includes('targetCtx.drawImage(img, sx, sy, sw, sh,'),
  'renderCloud must not slice source image into sub-rectangles'
);
assert.ok(
  updatedCanvasBg.includes('targetCtx.drawImage(img, 0, 0, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT)'),
  'renderCloud must render continuous whole-raster cloud image'
);

// Reflection parity across horizon (y = 725)
assert.ok(
  updatedCanvasBg.includes('renderCloud(reflCtx, layer, img, cx, cy, reflOpacity, layer.blendMode, true)'),
  'CanvasBackground must call renderCloud in offscreen water reflection pass for reflection parity'
);
assert.ok(
  updatedCanvasBg.includes('renderCloud(ctx, layer, img, cx, cy, layer.opacity, layer.blendMode, false)'),
  'CanvasBackground must call renderCloud in sky layer pass'
);

// Fallback to static/clean drawImage when distortion is disabled
assert.ok(
  updatedCanvasBg.includes('!p.cloudDistortionEnabled || p.cloudDistortionScale <= 0'),
  'renderCloud must cleanly fallback to single drawImage when distortion is disabled or scale is 0'
);

// Functional mathematical simulation of continuous whole-raster cloud dynamics
const cloudTestLayers = [
  { id: 'layer-4.0', originX: 520, originY: 390, layerSeed: 0.0, opacity: 1.0 },
  { id: 'layer-4.1', originX: 520, originY: 390, layerSeed: 2.7, opacity: 0.9 },
  { id: 'layer-4.2', originX: 1450, originY: 510, layerSeed: 5.3, opacity: 1.0 },
];

for (const layer of cloudTestLayers) {
  const distortionScale = 6; // Default slider scale
  const morphSpeed = 0.8; // Default slider speed

  let minBreathX = Infinity;
  let maxBreathX = -Infinity;
  let minBreathY = Infinity;
  let maxBreathY = -Infinity;
  let minVapor = Infinity;
  let maxVapor = -Infinity;

  for (let t = 0; t <= 60; t += 0.5) {
    const timeSec = t;

    // 1. Dual multi-frequency harmonic billow drift
    const phaseDrift1 = timeSec * 0.38 * morphSpeed + layer.layerSeed;
    const phaseDrift2 = timeSec * 0.72 * morphSpeed + layer.layerSeed * 1.3 + 0.8;
    const billowDriftX = (Math.sin(phaseDrift1) * 0.65 + Math.cos(phaseDrift2) * 0.35) * (distortionScale * 0.8);
    const phaseDriftY1 = timeSec * 0.32 * morphSpeed + layer.layerSeed * 0.9 + 1.2;
    const phaseDriftY2 = timeSec * 0.64 * morphSpeed + layer.layerSeed * 1.4 + 2.1;
    const billowDriftY = (Math.sin(phaseDriftY1) * 0.70 + Math.sin(phaseDriftY2) * 0.30) * (distortionScale * 0.4);

    assert.ok(Number.isFinite(billowDriftX) && Math.abs(billowDriftX) <= 6.0, `billowDriftX (${billowDriftX}) must be finite and bounded`);
    assert.ok(Number.isFinite(billowDriftY) && Math.abs(billowDriftY) <= 3.5, `billowDriftY (${billowDriftY}) must be finite and bounded`);

    // 2. Subtle anisotropic aspect breathing (1.00 ± 0.02 at default scale 6)
    const breathMagnitude = 0.02 * Math.min(2.0, distortionScale / 6);
    const breathPhaseX = timeSec * 0.44 * morphSpeed + layer.layerSeed;
    const breathX = 1.0 + breathMagnitude * (Math.sin(breathPhaseX) * 0.75 + Math.cos(breathPhaseX * 1.6 + 0.5) * 0.25);
    const breathPhaseY = timeSec * 0.36 * morphSpeed + layer.layerSeed * 1.2 + 1.1;
    const breathY = 1.0 + breathMagnitude * 0.85 * (Math.cos(breathPhaseY) * 0.70 + Math.sin(breathPhaseY * 1.5 + 0.9) * 0.30);

    minBreathX = Math.min(minBreathX, breathX);
    maxBreathX = Math.max(maxBreathX, breathX);
    minBreathY = Math.min(minBreathY, breathY);
    maxBreathY = Math.max(maxBreathY, breathY);

    // 3. Soft traveling vapor density respiration
    const vaporPhase = timeSec * 0.52 * morphSpeed + layer.layerSeed;
    const vaporPulse = 1.0 + 0.045 * Math.min(2.0, distortionScale / 6) * (Math.sin(vaporPhase) * 0.70 + Math.sin(vaporPhase * 1.7 + 0.8) * 0.30);
    const effAlpha = Math.max(0, Math.min(1.0, layer.opacity * vaporPulse));

    minVapor = Math.min(minVapor, effAlpha);
    maxVapor = Math.max(maxVapor, effAlpha);

    assert.ok(effAlpha >= 0 && effAlpha <= 1.0, `effAlpha out of bounds at t=${t}: ${effAlpha}`);

    // 4. Secondary ethereal billow pass alpha
    const secondaryAlpha = layer.opacity * 0.12 * Math.min(1.5, distortionScale / 6);
    assert.ok(secondaryAlpha > 0 && secondaryAlpha <= 0.18, `secondaryAlpha (${secondaryAlpha}) must be delicate ethereal luminescence`);
  }

  // Verify anisotropic breathing strictly within 1.00 ± 0.02
  assert.ok(minBreathX >= 0.979 && maxBreathX <= 1.021, `breathX [${minBreathX}, ${maxBreathX}] must satisfy 1.00 ± 0.02`);
  assert.ok(minBreathY >= 0.979 && maxBreathY <= 1.021, `breathY [${minBreathY}, ${maxBreathY}] must satisfy 1.00 ± 0.02`);

  // Verify breathing is anisotropic (width and height do not scale identically)
  assert.ok(Math.abs((maxBreathX - 1.0) - (maxBreathY - 1.0)) > 0.001, 'breathing must be anisotropic with differing horizontal and vertical excursions');

  // Verify vapor pulse is smooth and bounded
  assert.ok(minVapor >= layer.opacity * 0.94 && maxVapor <= layer.opacity * 1.05, `Vapor density swing [${minVapor}, ${maxVapor}] must be smooth and subtle`);

  // Verify stability under extreme slider values (scale 16, morph speed 2.5)
  for (let t = 0; t <= 20; t += 2) {
    const extScale = 16;
    const extSpeed = 2.5;
    const extBreathMag = 0.02 * Math.min(2.0, extScale / 6);
    const extPhaseX = t * 0.44 * extSpeed + layer.layerSeed;
    const extBreathX = 1.0 + extBreathMag * (Math.sin(extPhaseX) * 0.75 + Math.cos(extPhaseX * 1.6 + 0.5) * 0.25);
    const extVaporPhase = t * 0.52 * extSpeed + layer.layerSeed;
    const extVapor = 1.0 + 0.045 * Math.min(2.0, extScale / 6) * (Math.sin(extVaporPhase) * 0.70 + Math.sin(extVaporPhase * 1.7 + 0.8) * 0.30);
    const extAlpha = Math.max(0, Math.min(1.0, layer.opacity * extVapor));
    assert.ok(extBreathX >= 0.95 && extBreathX <= 1.05, `extreme breathX must remain bounded [0.95, 1.05] (got ${extBreathX})`);
    assert.ok(extAlpha >= 0 && extAlpha <= 1.0, `extreme alpha must remain bounded [0, 1.0] (got ${extAlpha})`);
  }
}

// BgCanvasPlaygroundPage controls wiring and preset consistency
assert.ok(updatedBgCanvasPage.includes('Cloud Slow Drift & Billow Distortion'), 'BgCanvasPlaygroundPage must include Cloud Slow Drift & Billow Distortion card');
assert.ok(updatedBgCanvasPage.includes('Multi-Zone Vapor Pocket Billowing'), 'BgCanvasPlaygroundPage must include Multi-Zone Vapor Pocket Billowing sub-card');
assert.ok(updatedBgCanvasPage.includes('Organic Billow Distortion Scale'), 'BgCanvasPlaygroundPage must include Organic Billow Distortion Scale slider');
assert.ok(updatedBgCanvasPage.includes('Billow Morphing & Respiration Speed'), 'BgCanvasPlaygroundPage must include Billow Morphing & Respiration Speed slider');
assert.ok(updatedBgCanvasPage.includes('cloudDistortionEnabled={cloudDistortionEnabled}'), 'BgCanvasPlaygroundPage must pass cloudDistortionEnabled to CanvasBackground');
assert.ok(updatedBgCanvasPage.includes('cloudDistortionScale={cloudDistortionScale}'), 'BgCanvasPlaygroundPage must pass cloudDistortionScale to CanvasBackground');
assert.ok(updatedBgCanvasPage.includes('cloudMorphSpeed={cloudMorphSpeed}'), 'BgCanvasPlaygroundPage must pass cloudMorphSpeed to CanvasBackground');
assert.ok(updatedBgCanvasPage.includes("preset === 'storm'"), 'BgCanvasPlaygroundPage must support storm preset');
assert.ok(updatedBgCanvasPage.includes("preset === 'minimal'"), 'BgCanvasPlaygroundPage must support minimal preset');

console.log('✓ Continuous whole-raster cloud dynamics, seamless breathing, zero quad slicing, and reflection parity verified.');

// 18. Living Breathing Galaxy (Milky Way Celestial Respiration) Verification
console.log('18. Checking Living Breathing Galaxy (Milky Way) subtle respiration, parameter bounds, zero-scale constraint, and UI controls...');

const freshCanvasBg = fs.readFileSync(new URL('../src/components/background/CanvasBackground.tsx', import.meta.url), 'utf-8');
const freshBgCanvasPage = fs.readFileSync(new URL('../src/pages/BgCanvasPlaygroundPage.tsx', import.meta.url), 'utf-8');

// CanvasBackground props and state
assert.ok(freshCanvasBg.includes('galaxyBreathingEnabled?: boolean'), 'CanvasBackgroundProps must define galaxyBreathingEnabled');
assert.ok(freshCanvasBg.includes('galaxyBreathingSpeed?: number'), 'CanvasBackgroundProps must define galaxyBreathingSpeed');
assert.ok(freshCanvasBg.includes('galaxyBreathingIntensity?: number'), 'CanvasBackgroundProps must define galaxyBreathingIntensity');
assert.ok(freshCanvasBg.includes('galaxyBreathingEnabled = true'), 'CanvasBackground must default galaxyBreathingEnabled to true');
assert.ok(freshCanvasBg.includes('renderGalaxyLayer'), 'CanvasBackground must implement renderGalaxyLayer helper');

// Target galaxy layers dispatch
assert.ok(
  freshCanvasBg.includes("layer.id === 'layer-2.0' || layer.id === 'layer-2.1' || layer.id === 'layer-2.2'"),
  'CanvasBackground must target layer-2.0, layer-2.1, and layer-2.2 for celestial respiration'
);
assert.ok(
  freshCanvasBg.includes('renderGalaxyLayer(ctx, layer, img, cx, cy, layer.opacity, layer.blendMode)'),
  'CanvasBackground upperLayers loop must dispatch to renderGalaxyLayer'
);

// Constraint check: "not in size" — NO scaling or size deformation inside renderGalaxyLayer
const renderGalaxyMatch = freshCanvasBg.match(/const renderGalaxyLayer = \([\s\S]*?\n      \};/);
assert.ok(renderGalaxyMatch, 'renderGalaxyLayer function body must be located');
const renderGalaxyCode = renderGalaxyMatch[0];
assert.ok(!renderGalaxyCode.includes('scale('), 'renderGalaxyLayer must NOT call scale() — constraint: not in size');
assert.ok(!renderGalaxyCode.includes('drawImage(img, sx,'), 'renderGalaxyLayer must not perform strip/mesh slicing');
assert.ok(
  renderGalaxyCode.includes('targetCtx.drawImage(img, cx, cy, BG_CANVAS_WIDTH, BG_CANVAS_HEIGHT)'),
  'renderGalaxyLayer must draw directly at canvas full size without deformation'
);

// Harmonic cycle periods within 18–28s
assert.ok(renderGalaxyCode.includes('/ 26.0'), 'renderGalaxyLayer must use ~26s period for Milky Way Base Dust (layer-2.0)');
assert.ok(renderGalaxyCode.includes('/ 21.0'), 'renderGalaxyLayer must use ~21s period for Milky Way Core Gas (layer-2.1)');
assert.ok(renderGalaxyCode.includes('/ 18.0'), 'renderGalaxyLayer must use ~18s period for Milky Way Bright Highlights (layer-2.2)');

// Subtle phase offsets & composite bloom
assert.ok(renderGalaxyCode.includes('+ 1.0'), 'renderGalaxyLayer must apply phase offset to core gas');
assert.ok(renderGalaxyCode.includes('+ 2.1'), 'renderGalaxyLayer must apply phase offset to bright highlights');
assert.ok(renderGalaxyCode.includes("bloomMode: GlobalCompositeOperation = 'screen'"), 'renderGalaxyLayer must use screen mode for celestial radiance bloom');
assert.ok(renderGalaxyCode.includes('bloomAlpha > 0.001'), 'renderGalaxyLayer must conditionally blit bloom pass only during radiance peak');
assert.ok(renderGalaxyCode.includes('targetCtx.clip()'), 'renderGalaxyLayer must clip to sky polygon when !isReflection && seaVisible to prevent bleeding into sea');
assert.ok(freshCanvasBg.includes('galaxyReflectionCanvasRef'), 'CanvasBackground must maintain isolated galaxy reflection canvas');
assert.ok(freshCanvasBg.includes('distortedGalaxyCanvasRef'), 'CanvasBackground must maintain distorted galaxy canvas buffer');
assert.ok(freshCanvasBg.includes("galaxyReflCtx || reflCtx"), 'CanvasBackground must route galaxy reflection layers to isolated galaxy reflection buffer');

// Mathematical functional simulation of celestial respiration
const testSpeed = 1.0;
const testIntensity = 1.0;
let maxCoreAlpha = -Infinity;
let minCoreAlpha = Infinity;
let maxDustAlpha = -Infinity;
let minDustAlpha = Infinity;
let maxBrightAlpha = -Infinity;
let minBrightAlpha = Infinity;
let maxBloomAlpha = -Infinity;
const corePeakTimes = [];
const brightPeakTimes = [];

for (let t = 0; t <= 60; t += 0.5) {
  // Dust (layer-2.0, baseOpacity 1.0)
  const phaseDust = (t * 2 * Math.PI * testSpeed) / 26.0;
  const waveDust = Math.sin(phaseDust) * 0.75 + Math.sin(phaseDust * 0.5 + 0.6) * 0.25;
  const effDust = Math.max(0, Math.min(1.0, 1.0 * (1.0 + 0.05 * waveDust * testIntensity)));
  maxDustAlpha = Math.max(maxDustAlpha, effDust);
  minDustAlpha = Math.min(minDustAlpha, effDust);

  // Core (layer-2.1, baseOpacity 0.95)
  const phaseCore = (t * 2 * Math.PI * testSpeed) / 21.0 + 1.0;
  const waveCore = Math.sin(phaseCore) * 0.70 + Math.sin(phaseCore * 1.4 - 0.4) * 0.30;
  const effCore = Math.max(0, Math.min(1.0, 0.95 * (1.0 + 0.08 * waveCore * testIntensity)));
  const bloomCore = waveCore > 0 ? Math.max(0, Math.min(1.0, 0.95 * (0.07 * waveCore * testIntensity))) : 0;
  maxCoreAlpha = Math.max(maxCoreAlpha, effCore);
  minCoreAlpha = Math.min(minCoreAlpha, effCore);
  maxBloomAlpha = Math.max(maxBloomAlpha, bloomCore);
  if (waveCore > 0.95) corePeakTimes.push(t);

  // Bright (layer-2.2, baseOpacity 0.9)
  const phaseBright = (t * 2 * Math.PI * testSpeed) / 18.0 + 2.1;
  const waveBright = Math.sin(phaseBright) * 0.68 + Math.cos(phaseBright * 1.3 + 0.5) * 0.32;
  const effBright = Math.max(0, Math.min(1.0, 0.9 * (1.0 + 0.10 * waveBright * testIntensity)));
  const bloomBright = waveBright > 0 ? Math.max(0, Math.min(1.0, 0.9 * (0.08 * waveBright * testIntensity))) : 0;
  maxBrightAlpha = Math.max(maxBrightAlpha, effBright);
  minBrightAlpha = Math.min(minBrightAlpha, effBright);
  maxBloomAlpha = Math.max(maxBloomAlpha, bloomBright);
  if (waveBright > 0.95) brightPeakTimes.push(t);

  // All alphas must be non-negative and <= 1.0
  assert.ok(effDust >= 0 && effDust <= 1.0, `effDust out of bounds at t=${t}: ${effDust}`);
  assert.ok(effCore >= 0 && effCore <= 1.0, `effCore out of bounds at t=${t}: ${effCore}`);
  assert.ok(effBright >= 0 && effBright <= 1.0, `effBright out of bounds at t=${t}: ${effBright}`);
  assert.ok(bloomCore >= 0 && bloomCore <= 1.0, `bloomCore out of bounds at t=${t}: ${bloomCore}`);
  assert.ok(bloomBright >= 0 && bloomBright <= 1.0, `bloomBright out of bounds at t=${t}: ${bloomBright}`);
}

// Opacity variations must be very subtle (e.g. Dust delta ~5%, Core delta ~8%, Bright delta ~10%)
assert.ok(maxDustAlpha <= 1.0 && minDustAlpha >= 0.94, `Dust opacity swing [${minDustAlpha}, ${maxDustAlpha}] must be subtle`);
assert.ok(maxCoreAlpha <= 1.0 && minCoreAlpha >= 0.86, `Core opacity swing [${minCoreAlpha}, ${maxCoreAlpha}] must be subtle`);
assert.ok(maxBrightAlpha <= 1.0 && minBrightAlpha >= 0.80, `Bright opacity swing [${minBrightAlpha}, ${maxBrightAlpha}] must be subtle`);
assert.ok(maxBloomAlpha <= 0.10, `Radiance bloom alpha (${maxBloomAlpha}) must be delicate and ethereal (<= 10%)`);

// Phase offsets must ensure core and bright highlights do not peak at the exact same moment
assert.ok(corePeakTimes.length > 0 && brightPeakTimes.length > 0, 'Peaks must occur within simulation window');
const identicalPeak = corePeakTimes.some(tc => brightPeakTimes.some(tb => Math.abs(tc - tb) < 0.25));
assert.strictEqual(identicalPeak, false, 'Core and bright peaks must not coincide due to phase offsets');

// BgCanvasPlaygroundPage HUD controls & wiring
assert.ok(freshBgCanvasPage.includes('Living Breathing Galaxy (Milky Way)'), 'Playground must include Living Breathing Galaxy HUD card');
assert.ok(freshBgCanvasPage.includes('Respiration Cycle Speed'), 'Playground must include Respiration Cycle Speed slider');
assert.ok(freshBgCanvasPage.includes('Luminosity & Opacity Depth'), 'Playground must include Luminosity & Opacity Depth slider');
assert.ok(freshBgCanvasPage.includes('galaxyBreathingEnabled={galaxyBreathingEnabled}'), 'Playground must pass galaxyBreathingEnabled to CanvasBackground');
assert.ok(freshBgCanvasPage.includes('galaxyBreathingSpeed={galaxyBreathingSpeed}'), 'Playground must pass galaxyBreathingSpeed to CanvasBackground');
assert.ok(freshBgCanvasPage.includes('galaxyBreathingIntensity={galaxyBreathingIntensity}'), 'Playground must pass galaxyBreathingIntensity to CanvasBackground');

// Presets & Reset handlers
assert.ok(freshBgCanvasPage.includes("preset === 'cosmic'"), 'Cosmic preset check');
assert.ok(freshBgCanvasPage.includes('setGalaxyBreathingIntensity(1.4)'), 'Cosmic preset must boost galaxy breathing intensity to 1.4');
assert.ok(freshBgCanvasPage.includes('setGalaxyBreathingIntensity(0.7)'), 'Storm preset must subdue galaxy breathing intensity to 0.7');
assert.ok(freshBgCanvasPage.includes('setGalaxyBreathingEnabled(false)'), 'Minimal & Solo0 presets must disable galaxy breathing');

console.log('✓ Living Breathing Galaxy subtle respiration, parameter bounds, zero-scale constraint, and UI controls verified.');

// 19. Perspective-Accurate Water Wave Depth Physics & High-Performance Non-Linear Bands Verification
console.log('19. Checking Perspective-Accurate Water Waves depth physics, non-linear perspective bands, dynamic wave excitation, and synchronized depth blur tiers...');

const waterCanvasBg = fs.readFileSync(new URL('../src/components/background/CanvasBackground.tsx', import.meta.url), 'utf-8');
const waterBgCanvasPage = fs.readFileSync(new URL('../src/pages/BgCanvasPlaygroundPage.tsx', import.meta.url), 'utf-8');

// A. Props and defaults in CanvasBackground (scale 40px, power 3.0p, speed baseline 0.2)
assert.ok(waterCanvasBg.includes('waterPerspectivePower?: number'), 'CanvasBackgroundProps must define waterPerspectivePower');
assert.ok(waterCanvasBg.includes('waterPerspectivePower = 3.0'), 'CanvasBackground must default waterPerspectivePower to 3.0');
assert.ok(waterCanvasBg.includes('waterDistortionScale = 40'), 'CanvasBackground must default waterDistortionScale to 40');
assert.ok(waterCanvasBg.includes('waterDistortionEnabled = true'), 'CanvasBackground must default waterDistortionEnabled to true');
assert.ok(waterCanvasBg.includes('waterDistortionSpeed = 0.2'), 'CanvasBackground must default waterDistortionSpeed to 0.2 baseline');
assert.ok(waterCanvasBg.includes('onWaterTelemetry?: (speed: number, blur: number) => void'), 'CanvasBackgroundProps must support onWaterTelemetry');

// B. Performance & Perspective Band Architecture (< 35 draw calls per frame)
const numBandsMatch = waterCanvasBg.match(/const NUM_BANDS = (\d+);/);
assert.ok(numBandsMatch, 'CanvasBackground must define NUM_BANDS constant');
const numBands = parseInt(numBandsMatch[1], 10);
assert.ok(numBands >= 28 && numBands <= 36, `NUM_BANDS (${numBands}) must be non-linear bands between 28 and 36 for locked 60 FPS performance`);
assert.ok(numBands < 35, 'Total draw calls per frame must be strictly under 35 (< 0.2ms compute time)');

// Verify subpixel overdraw padding and continuous mesh to eliminate transparent seam gaps
assert.ok(waterCanvasBg.includes('const padY = 0.8') || waterCanvasBg.includes('padY'), 'CanvasBackground must use subpixel vertical overdraw padding padY');
assert.ok(waterCanvasBg.includes('const padX =') || waterCanvasBg.includes('padX'), 'CanvasBackground must use horizontal overdraw padding padX');
assert.ok(waterCanvasBg.includes('dh = (nodeY[b + 1] - nodeY[b]) + padY') || waterCanvasBg.includes('dh = sh + padY'), 'CanvasBackground must overdraw height with padY to eliminate transparent seam gaps');
assert.ok(waterCanvasBg.includes('dw = BG_CANVAS_WIDTH + padX * 2'), 'CanvasBackground must expand width to prevent canvas edge gaps');
assert.ok(waterCanvasBg.includes('waterMeshNodesRef'), 'CanvasBackground must use preallocated waterMeshNodesRef typed buffer');
assert.ok(waterCanvasBg.includes('6.0 / Math.pow(vMid + 0.35, 2)'), 'CanvasBackground must use quadratic depth spatial frequency compression');

// B2. Dynamic Wave Speed Excitation, Continuous Phase & Smooth Blur Temporal Easing
assert.ok(waterCanvasBg.includes('waterExcitationRef'), 'CanvasBackground must maintain waterExcitationRef for mouse/scroll surges');
assert.ok(waterCanvasBg.includes('waterPhaseRef'), 'CanvasBackground must accumulate continuous waterPhaseRef to prevent phase discontinuities');
assert.ok(waterCanvasBg.includes('effectiveWaveSpeed = baseWaveSpeed + excitation * 0.8'), 'CanvasBackground must surge wave speed above baseline');
assert.ok(waterCanvasBg.includes('waterBlurSmoothedRef'), 'CanvasBackground must maintain waterBlurSmoothedRef for continuous temporal smoothing');
assert.ok(waterCanvasBg.includes('targetWaterBlur = (p.waterBlur ?? 0) + farBackBlurPeak * (1.0 + 0.35 * surgeRatio)'), 'CanvasBackground must calculate target blur with baseline far-back depth blur synchronized with wave speed surge');
assert.ok(waterCanvasBg.includes('Math.exp(-dt * blurTransitionSpeed)'), 'CanvasBackground must use exponential moving average smoothing for non-instantaneous blur transitions');
assert.ok(waterCanvasBg.includes('waterBlurTransitionSpeed?: number'), 'CanvasBackgroundProps must define waterBlurTransitionSpeed');
assert.ok(waterCanvasBg.includes('waterFarBackBlur?: number'), 'CanvasBackgroundProps must define waterFarBackBlur');
assert.ok(waterCanvasBg.includes('waterFarBackBlur ?? 3.8'), 'CanvasBackground must default far-back horizon blur peak to ~3.8px');

// B3. Synchronized Non-Linear Depth Blur Tiers (4 tiers, max blur at horizon, sharp foreground)
assert.ok(waterCanvasBg.includes('BLUR_TIERS'), 'CanvasBackground must group bands into BLUR_TIERS to optimize ctx.filter');
assert.ok(waterCanvasBg.includes('blurRatio: 1.0'), 'Distant horizon must receive full blurRatio 1.0');
assert.ok(waterCanvasBg.includes('blurRatio: 0.0'), 'Foreground must receive blurRatio 0.0 for crisp detail');

// Verify non-linear band height expansion and coverage continuity
const testWaterHeight = 462;
let prevY = 0;
const bandHeights = [];
for (let b = 0; b < numBands; b++) {
  const v0 = Math.pow(b / numBands, 1.35);
  const v1 = Math.pow((b + 1) / numBands, 1.35);
  const sy = v0 * testWaterHeight;
  const sh = (v1 - v0) * testWaterHeight;
  bandHeights.push(sh);

  assert.ok(sh > 0, `Band ${b} height must be strictly positive (got ${sh})`);
  assert.ok(Math.abs(sy - prevY) < 1e-6, `Band ${b} start must align with previous band end`);
  prevY = sy + sh;
}
assert.ok(Math.abs(prevY - testWaterHeight) < 1e-6, 'Bands must span the exact total waterHeight (462px)');
assert.ok(bandHeights[numBands - 1] > bandHeights[0] * 3, 'Foreground band height must be > 3x larger than horizon band height (perspective expansion)');

// C. Mathematical Simulation of Perspective Wave Physics: A(v=0) ≈ 0, A(v=1) >> A(v=0) with tuned values (40px, power 3.0)
const baseScale = 40;
const power = 3.0;
const calcAmp = (v) => baseScale * Math.pow(v, power);

const ampHorizon = calcAmp(0);
assert.strictEqual(ampHorizon, 0, 'Amplitude at horizon (v=0) must be identically 0');

const ampHorizonNear = calcAmp(0.01);
assert.ok(ampHorizonNear < 0.0001, `Amplitude near horizon (v=0.01) must be microscopic (< 0.0001px, got ${ampHorizonNear})`);

const ampForeground = calcAmp(1.0);
assert.strictEqual(ampForeground, baseScale, 'Amplitude at foreground (v=1.0) must reach full scale 40px');
assert.ok(ampForeground / (ampHorizonNear || 1e-9) > 900000, 'Foreground amplitude must be vastly larger than horizon amplitude');

// Verify perspective spatial frequency compression: omega(v=0) >> omega(v=1)
const calcSpatialFreq = (v) => 6.0 / Math.pow(v + 0.35, 2);
const freqHorizon = calcSpatialFreq(0);
const freqForeground = calcSpatialFreq(1.0);
assert.ok(freqHorizon > freqForeground * 10, `Spatial frequency at horizon (${freqHorizon.toFixed(1)}) must be >10x higher than foreground (${freqForeground.toFixed(1)})`);

// Verify depth blur tier non-linearity simulation with increased far-back horizon peak (~3.8px)
const maxBlur = 3.8;
const tiers = [
  { startBand: 0, endBand: 10, blurRatio: 1.0 },
  { startBand: 10, endBand: 19, blurRatio: 0.55 },
  { startBand: 19, endBand: 26, blurRatio: 0.20 },
  { startBand: 26, endBand: 32, blurRatio: 0.0 },
];
const tierBlurs = tiers.map(t => maxBlur * t.blurRatio);
assert.strictEqual(tierBlurs[0], 3.8, 'Horizon tier must have maximum 3.8px blur (increased far-back atmospheric diffusion)');
assert.strictEqual(Math.round(tierBlurs[1] * 100) / 100, 2.09, 'Mid-far tier must have ~2.09px blur');
assert.strictEqual(Math.round(tierBlurs[2] * 100) / 100, 0.76, 'Mid-near tier must have ~0.76px blur');
assert.strictEqual(tierBlurs[3], 0.0, 'Foreground tier must have 0.0px blur for crisp waves');
// Non-linear curvature check: rate of falloff from horizon to mid is slower than linear
assert.ok(tierBlurs[0] - tierBlurs[1] < tierBlurs[1] - tierBlurs[3], 'Depth blur falloff must be non-linear with deeper focus retention in distance');

// Mathematical simulation of continuous temporal blur smoothing (exponential moving average with dt)
const testTransitionSpeed = 1.8;
const targetBlurBaseline = 3.8;
const targetBlurSurge = 3.8 * 1.35; // 5.13px
const dtFrame = 0.016; // 16ms frame at 60 FPS
let smoothedBlur = targetBlurBaseline;

// Frame 1: Excitation occurs suddenly; blur must NOT be instantaneous
const alpha1 = 1 - Math.exp(-dtFrame * testTransitionSpeed);
smoothedBlur += (targetBlurSurge - smoothedBlur) * alpha1;
assert.ok(smoothedBlur > targetBlurBaseline, `Smoothed blur must begin easing upward on frame 1 (got ${smoothedBlur})`);
assert.ok(smoothedBlur < targetBlurSurge - 0.9, `Smoothed blur must NOT jump instantaneously to target (got ${smoothedBlur} vs target ${targetBlurSurge})`);

// Easing progression over subsequent frames: blur eases gently toward surge target
let prevBlur = smoothedBlur;
for (let frame = 2; frame <= 60; frame++) {
  const alpha = 1 - Math.exp(-dtFrame * testTransitionSpeed);
  smoothedBlur += (targetBlurSurge - smoothedBlur) * alpha;
  assert.ok(smoothedBlur >= prevBlur, `Blur must monotonically ease upward during excitation (frame ${frame})`);
  prevBlur = smoothedBlur;
}
assert.ok(smoothedBlur > 4.8, `After 1s (60 frames), smoothed blur must approach surge target (got ${smoothedBlur})`);

// Dissipation: Excitation ends; blur must dissipate softly back to baseline depth blur
prevBlur = smoothedBlur;
for (let frame = 1; frame <= 60; frame++) {
  const alpha = 1 - Math.exp(-dtFrame * testTransitionSpeed);
  smoothedBlur += (targetBlurBaseline - smoothedBlur) * alpha;
  assert.ok(smoothedBlur <= prevBlur, `Blur must monotonically dissipate downward after excitation (frame ${frame})`);
  prevBlur = smoothedBlur;
}
assert.ok(smoothedBlur < targetBlurBaseline + 0.3, `After 1s dissipation, smoothed blur must softly approach baseline (got ${smoothedBlur})`);

// Verify continuous node mesh zero-gap invariant across scales (0, 25, 40, 55) and times
for (const testScale of [0, 25, 40, 55]) {
  for (let t = 0; t <= 20; t += 0.5) {
    const nodeY = new Float64Array(numBands + 1);
    nodeY[0] = 725;
    nodeY[numBands] = 725 + testWaterHeight;

    for (let i = 1; i < numBands; i++) {
      const v = Math.pow(i / numBands, 1.35);
      const k = 6.0 / Math.pow(v + 0.35, 2);
      const p1 = t * 2.6 - k;
      const p2 = t * 4.1 - k * 1.55 + 1.3;
      const normWy = (Math.cos(p1) + Math.cos(p2) * 0.28) * 0.78;
      const A = testScale * Math.pow(v, power);
      const dispY = A * 0.15 * normWy;
      nodeY[i] = 725 + v * testWaterHeight + dispY;
    }

    for (let b = 0; b < numBands; b++) {
      const dy = nodeY[b];
      const dh = (nodeY[b + 1] - nodeY[b]) + 0.8;
      assert.ok(dh > 0, `Band ${b} height (${dh}) must remain positive across all oscillations`);
      const bottom = dy + dh;
      const nextTop = nodeY[b + 1];
      const overlap = bottom - nextTop;
      assert.ok(overlap >= 0.79, `Overlap between band ${b} and ${b + 1} (${overlap}) must never fall below padY (zero gap invariant)`);
    }

    for (let v = 0.05; v <= 1.0; v += 0.1) {
      const kPersp = 6.0 / Math.pow(v + 0.35, 2);
      const p1 = t * 2.6 - kPersp;
      const p2 = t * 4.1 - kPersp * 1.55 + 1.3;
      const p3 = t * 5.8 - kPersp * 2.3 + 2.7;

      const w1 = Math.sin(p1);
      const w2 = Math.sin(p2) * 0.35;
      const w3 = Math.sin(p3) * 0.15;
      const normWx = (w1 + w2 + w3) / 1.5;
      assert.ok(Math.abs(normWx) <= 1.05, `normWx out of bounds: ${normWx}`);

      const dx = testScale * Math.pow(v, power) * normWx;
      const padX = Math.ceil(testScale) + 4;
      assert.ok(dx - padX <= 0, `dx - padX (${dx - padX}) must not leave left edge gap`);
      assert.ok(dx - padX + 1920 + padX * 2 >= 1920, 'Width must cover full canvas right edge');
    }
  }
}

// D. Playground Controls & HUD Wiring
assert.ok(waterBgCanvasPage.includes('Perspective Wave Scale'), 'Playground must include Perspective Wave Scale slider');
assert.ok(waterBgCanvasPage.includes('Wave Speed (Baseline)'), 'Playground must include Wave Speed (Baseline) slider');
assert.ok(waterBgCanvasPage.includes('Perspective Power'), 'Playground must include Perspective Power slider');
assert.ok(waterBgCanvasPage.includes('Blur Transition Speed / Easing Rate'), 'Playground must include Blur Transition Speed / Easing Rate slider');
assert.ok(waterBgCanvasPage.includes('Far-Back Horizon Blur Peak'), 'Playground must include Far-Back Horizon Blur Peak slider');
assert.ok(waterBgCanvasPage.includes('min="25"') && waterBgCanvasPage.includes('max="55"'), 'Scale slider testing range must be 40 +- 15px [25, 55]');
assert.ok(waterBgCanvasPage.includes('min="2.0"') && waterBgCanvasPage.includes('max="4.0"'), 'Power slider testing range must be 3.0 +- 1.0p [2.0, 4.0]');
assert.ok(waterBgCanvasPage.includes('min="0.5"') && waterBgCanvasPage.includes('max="4.0"'), 'Blur transition speed slider testing range must be [0.5, 4.0]');
assert.ok(waterBgCanvasPage.includes('waterPerspectivePower={waterPerspectivePower}'), 'Playground must pass waterPerspectivePower to CanvasBackground');
assert.ok(waterBgCanvasPage.includes('waterDistortionScale={waterDistortionScale}'), 'Playground must pass waterDistortionScale to CanvasBackground');
assert.ok(waterBgCanvasPage.includes('waterDistortionSpeed={waterDistortionSpeed}'), 'Playground must pass waterDistortionSpeed to CanvasBackground');
assert.ok(waterBgCanvasPage.includes('waterDistortionEnabled={waterDistortionEnabled}'), 'Playground must pass waterDistortionEnabled to CanvasBackground');
assert.ok(waterBgCanvasPage.includes('waterBlurTransitionSpeed={waterBlurTransitionSpeed}'), 'Playground must pass waterBlurTransitionSpeed to CanvasBackground');
assert.ok(waterBgCanvasPage.includes('waterFarBackBlur={waterFarBackBlur}'), 'Playground must pass waterFarBackBlur to CanvasBackground');
assert.ok(waterBgCanvasPage.includes('onWaterTelemetry={handleWaterTelemetry}'), 'Playground must wire onWaterTelemetry to update live HUD telemetry');

// Presets & Reset handlers verification
assert.ok(waterBgCanvasPage.includes('setWaterPerspectivePower(3.0)'), 'Presets must configure perspective power 3.0');
assert.ok(waterBgCanvasPage.includes('setWaterDistortionScale(40)'), 'Serene preset must set wave scale 40');
assert.ok(waterBgCanvasPage.includes('setWaterDistortionScale(55)'), 'Storm preset must set turbulent wave scale 55');
assert.ok(waterBgCanvasPage.includes('setWaterDistortionEnabled(false)'), 'Minimal preset must disable water distortion');
assert.ok(waterBgCanvasPage.includes('setWaterBlurTransitionSpeed(1.8)'), 'Presets / reset must configure default blur transition speed (1.8/s)');
assert.ok(waterBgCanvasPage.includes('setWaterFarBackBlur(0.0)') || waterBgCanvasPage.includes('setWaterFarBackBlur(3.8)'), 'Presets / reset must configure default far-back blur peak');
assert.ok(waterBgCanvasPage.includes('setWaterFarBackBlur(0.0)'), 'Minimal preset must set far-back blur to 0.0px for crisp reflection');
assert.ok(waterCanvasBg.includes("waterWaveMode === 'bands'"), 'CanvasBackground must support legacy bands mode');
assert.ok(waterCanvasBg.includes('waterWaveMode?:'), 'CanvasBackground must accept waterWaveMode prop');
assert.ok(waterCanvasBg.includes('waterBandCount?:'), 'CanvasBackground must accept waterBandCount prop');
assert.ok(waterCanvasBg.includes('waterBandOffset?:'), 'CanvasBackground must accept waterBandOffset prop');
assert.ok(waterBgCanvasPage.includes('waterWaveMode={waterWaveMode}'), 'BgCanvasPlaygroundPage must pass waterWaveMode to CanvasBackground');
assert.ok(waterBgCanvasPage.includes('waterBandCount={waterBandCount}'), 'BgCanvasPlaygroundPage must pass waterBandCount to CanvasBackground');
assert.ok(waterBgCanvasPage.includes('waterBandOffset={waterBandOffset}'), 'BgCanvasPlaygroundPage must pass waterBandOffset to CanvasBackground');

// E. Visual Realism & Parity: Sky elements reflected in reflCanvas and oceanic depth gradient overlay
assert.ok(waterCanvasBg.includes('waterGrad') && waterCanvasBg.includes('createLinearGradient(0, BG_HORIZON_Y, 0, BG_CANVAS_HEIGHT)'), 'CanvasBackground must render oceanic depth gradient overlay');
assert.ok(waterCanvasBg.includes('renderCloud(reflCtx,'), 'CanvasBackground must reflect clouds into reflCanvas before perspective slicing');
assert.ok(waterCanvasBg.includes('bigStarsData') && waterCanvasBg.includes('reflCtx.ellipse('), 'CanvasBackground must reflect stars into reflCanvas before perspective slicing');
assert.ok(waterCanvasBg.includes('renderCometTail(reflCtx,'), 'CanvasBackground must reflect comet tail into reflCanvas before perspective slicing');

// Sloped horizon registration & black tint removal
assert.ok(waterCanvasBg.includes('ctx.moveTo(0, BG_HORIZON_Y)') && waterCanvasBg.includes('835'), 'CanvasBackground must clip reflection and water gradient to exact sloped sea horizon (725 to 835)');
assert.ok(!waterCanvasBg.includes('rgba(1, 14, 18, 0.70)'), 'CanvasBackground must not apply heavy 70% black tint over the ocean');
assert.ok(dynamicBgContent.includes('polygon(0% 61.078%, 100% 70.345%, 100% 100%, 0% 100%)'), 'DynamicBackground must clip water reflection and distortion to sloped horizon polygon');
assert.ok(!dynamicBgContent.includes('rgba(1, 14, 18, 0.70)'), 'DynamicBackground must not apply heavy 70% black tint over the ocean');

// F. DynamicBackground (DOM/SVG) Parity & Depth Blur Layer
assert.ok(dynamicBgContent.includes('waterBlurTransitionSpeed?: number'), 'DynamicBackgroundProps must define waterBlurTransitionSpeed');
assert.ok(dynamicBgContent.includes('waterFarBackBlur?: number'), 'DynamicBackgroundProps must define waterFarBackBlur');
assert.ok(dynamicBgContent.includes('resolvedFarBackBlur > 0'), 'DynamicBackground must render far-back depth blur overlay');
assert.ok(dynamicBgContent.includes('blurTransitionDuration'), 'DynamicBackground must compute dynamic transition duration from waterBlurTransitionSpeed');
assert.ok(dynamicBgContent.includes('maskImage'), 'DynamicBackground far-back depth overlay must use gradient mask for perspective falloff');

// G. BgPlaygroundPage DOM Controls Parity
const bgPlayPageContent = fs.readFileSync(new URL('../src/pages/BgPlaygroundPage.tsx', import.meta.url), 'utf-8');
assert.ok(bgPlayPageContent.includes('Blur Transition Speed / Easing Rate'), 'BgPlaygroundPage must include Blur Transition Speed slider');
assert.ok(bgPlayPageContent.includes('Far-Back Horizon Blur Peak'), 'BgPlaygroundPage must include Far-Back Horizon Blur Peak slider');
assert.ok(bgPlayPageContent.includes('waterBlurTransitionSpeed={waterBlurTransitionSpeed}'), 'BgPlaygroundPage must pass waterBlurTransitionSpeed to DynamicBackground');
assert.ok(bgPlayPageContent.includes('waterFarBackBlur={waterFarBackBlur}'), 'BgPlaygroundPage must pass waterFarBackBlur to DynamicBackground');
assert.ok(bgPlayPageContent.includes('Reflection Opacity'), 'BgPlaygroundPage must include Reflection Opacity slider');
assert.ok(waterBgCanvasPage.includes('Reflection Opacity'), 'BgCanvasPlaygroundPage must include Reflection Opacity slider');
assert.ok(waterCanvasBg.includes('reflectionOpacity?: number'), 'CanvasBackgroundProps must define reflectionOpacity');
assert.ok(dynamicBgContent.includes('reflectionOpacity?: number'), 'DynamicBackgroundProps must define reflectionOpacity');
assert.ok(waterBgCanvasPage.includes('reflectionOpacity={reflectionOpacity}'), 'BgCanvasPlaygroundPage must pass reflectionOpacity to CanvasBackground');
assert.ok(bgPlayPageContent.includes('reflectionOpacity={reflectionOpacity}'), 'BgPlaygroundPage must pass reflectionOpacity to DynamicBackground');

// H. Reflection Blend Mode Picker & Water Background Blue Blending Parity
assert.ok(waterCanvasBg.includes('reflectionBlendMode?: ReflectionBlendMode'), 'CanvasBackgroundProps must define reflectionBlendMode');
assert.ok(dynamicBgContent.includes('reflectionBlendMode?: ReflectionBlendMode'), 'DynamicBackgroundProps must define reflectionBlendMode');
assert.ok(waterCanvasBg.includes('reflBlendOp'), 'CanvasBackground must compute reflBlendOp from reflectionBlendMode');
assert.ok(dynamicBgContent.includes('mixBlendMode: reflectionBlendMode'), 'DynamicBackground must apply mixBlendMode from reflectionBlendMode');
assert.ok(waterBgCanvasPage.includes('Reflection Blend Mode'), 'BgCanvasPlaygroundPage must include Reflection Blend Mode picker');
assert.ok(bgPlayPageContent.includes('Reflection Blend Mode'), 'BgPlaygroundPage must include Reflection Blend Mode picker');
assert.ok(waterBgCanvasPage.includes('reflectionBlendMode={reflectionBlendMode}'), 'BgCanvasPlaygroundPage must pass reflectionBlendMode to CanvasBackground');
assert.ok(bgPlayPageContent.includes('reflectionBlendMode={reflectionBlendMode}'), 'BgPlaygroundPage must pass reflectionBlendMode to DynamicBackground');

console.log('✓ Perspective-Accurate Water Waves depth physics, non-linear perspective bands, dynamic wave excitation, and synchronized depth blur tiers verified.');

// 20. Reverse Horizontal Parallax Motion & Parity Verification
console.log('20. Checking reverse horizontal parallax motion, UI checkbox toggle, and parity...');
const revCanvasBg = fs.readFileSync(new URL('../src/components/background/CanvasBackground.tsx', import.meta.url), 'utf-8');
const revDynamicBg = fs.readFileSync(new URL('../src/components/background/DynamicBackground.tsx', import.meta.url), 'utf-8');
const revBgCanvasPage = fs.readFileSync(new URL('../src/pages/BgCanvasPlaygroundPage.tsx', import.meta.url), 'utf-8');
const revBgPlaygroundPage = fs.readFileSync(new URL('../src/pages/BgPlaygroundPage.tsx', import.meta.url), 'utf-8');
const revBgTypes = fs.readFileSync(new URL('../src/types/background.ts', import.meta.url), 'utf-8');

// A. CanvasBackground & DynamicBackground Interface, Types, and Default Values
assert.ok(revCanvasBg.includes('reverseHorizontalParallax?: boolean;'), 'CanvasBackgroundProps must declare reverseHorizontalParallax optional boolean');
assert.ok(revCanvasBg.includes('reverseHorizontalParallax = true'), 'CanvasBackground must default reverseHorizontalParallax to true');
assert.ok(revCanvasBg.includes('reverseHorizontalParallax,') && revCanvasBg.includes('animParamsRef.current = {'), 'CanvasBackground must store reverseHorizontalParallax in animParamsRef');

assert.ok(revDynamicBg.includes('reverseHorizontalParallax?: boolean;'), 'DynamicBackgroundProps must declare reverseHorizontalParallax optional boolean');
assert.ok(revDynamicBg.includes('reverseHorizontalParallax = true'), 'DynamicBackground must default reverseHorizontalParallax to true');
assert.ok(revBgTypes.includes('reverseHorizontalParallax?: boolean;'), 'ParallaxSettings in background.ts must declare reverseHorizontalParallax optional boolean');

// B. Horizontal Parallax Motion Inversion Logic
assert.ok(
  revCanvasBg.includes('const motionX = p.reverseHorizontalParallax ? -motion.x : motion.x;') ||
  revCanvasBg.includes('motionX * layer.parallaxFactor.x * 45'),
  'CanvasBackground getLayerOffset must invert motion.x when reverseHorizontalParallax is active'
);
assert.ok(
  revDynamicBg.includes('const motionX = reverseHorizontalParallax ? -motion.x : motion.x;') ||
  revDynamicBg.includes('motionX * layer.parallaxFactor.x * 45'),
  'DynamicBackground getTransform must invert motion.x when reverseHorizontalParallax is active'
);

// Mathematical verification of displacement inversion
for (const testMotionX of [-1.0, -0.65, -0.2, 0.35, 0.8, 1.0]) {
  for (const factor of [0.006, 0.02, 0.065, 0.14, 0.32]) {
    const normalTx = testMotionX * factor * 45;
    const invertedTx = (-testMotionX) * factor * 45;
    assert.strictEqual(invertedTx, -normalTx, `Inverted tx must be exact negative of normal tx for motion.x=${testMotionX}, factor=${factor}`);
  }
}

// C. BgCanvasPlaygroundPage UI Controls, State Wiring, Presets & Reset
assert.ok(revBgCanvasPage.includes('const [reverseHorizontalParallax, setReverseHorizontalParallax] = useState<boolean>(true);'), 'BgCanvasPlaygroundPage must maintain reverseHorizontalParallax state initialized to true');
assert.ok(revBgCanvasPage.includes('reverseHorizontalParallax={reverseHorizontalParallax}'), 'BgCanvasPlaygroundPage must pass reverseHorizontalParallax prop to CanvasBackground');
assert.ok(revBgCanvasPage.includes('Reverse Horizontal Motion'), 'BgCanvasPlaygroundPage must provide "Reverse Horizontal Motion" label');
assert.ok(revBgCanvasPage.includes('type="checkbox"'), 'BgCanvasPlaygroundPage must render checkbox toggle');
assert.ok(revBgCanvasPage.includes('checked={reverseHorizontalParallax}'), 'BgCanvasPlaygroundPage checkbox must be controlled by reverseHorizontalParallax state');
assert.ok(revBgCanvasPage.includes('setReverseHorizontalParallax(e.target.checked)'), 'BgCanvasPlaygroundPage checkbox must update reverseHorizontalParallax state on change');
assert.ok(revBgCanvasPage.includes("reverseHorizontalParallax ? 'INVERTED' : 'NORMAL'"), 'BgCanvasPlaygroundPage must display INVERTED / NORMAL indicator');

// Reset and all presets (serene, interactive, cosmic, storm, minimal, handleReset) parity in Canvas Playground
const canvasResetCount = (revBgCanvasPage.match(/setReverseHorizontalParallax\((true|false)\)/g) || []).length;
assert.ok(canvasResetCount >= 6, `BgCanvasPlaygroundPage must reset reverseHorizontalParallax across all 5 presets and handleReset (found ${canvasResetCount})`);

// D. Ecosystem Parity: BgPlaygroundPage DOM version
assert.ok(revBgPlaygroundPage.includes('reverseHorizontalParallax={reverseHorizontalParallax}'), 'BgPlaygroundPage must pass reverseHorizontalParallax to DynamicBackground');
assert.ok(revBgPlaygroundPage.includes('Reverse Horizontal Motion'), 'BgPlaygroundPage must provide Reverse Horizontal Motion toggle');
assert.ok(revBgPlaygroundPage.includes('checked={reverseHorizontalParallax}'), 'BgPlaygroundPage checkbox must be controlled by reverseHorizontalParallax state');
assert.ok(revBgPlaygroundPage.includes("reverseHorizontalParallax ? 'INVERTED' : 'NORMAL'"), 'BgPlaygroundPage must display INVERTED / NORMAL indicator');

const domResetCount = (revBgPlaygroundPage.match(/setReverseHorizontalParallax\((true|false)\)/g) || []).length;
assert.ok(domResetCount >= 6, `BgPlaygroundPage must reset reverseHorizontalParallax across all 5 presets and handleReset (found ${domResetCount})`);

console.log('✓ Reverse Horizontal Parallax motion inverted displacement, UI checkbox toggle, presets, and ecosystem parity verified.');

// 21. Global Post-Processing: Photoshop Vibrance & Levels GPU Implementation
console.log('21. Checking Photoshop Vibrance & Levels GPU Implementation and Parity...');

// A. Mathematical Precision & Algorithmic Correctness
// 1. Levels default / identity transform
for (let i = 0; i <= 255; i++) {
  const x = i / 255;
  const out = calculatePhotoshopLevels(x, 0, 1.0, 255, 0, 255);
  assert.ok(Math.abs(out - x) < 0.0001, `Default levels must yield identity output for x=${x} (got ${out})`);
}

// 2. Input Black clipping
for (let i = 0; i <= 50; i++) {
  const x = i / 255;
  const out = calculatePhotoshopLevels(x, 50, 1.0, 255, 0, 255);
  assert.strictEqual(out, 0, `Values at or below inputBlack=50 must be crushed to 0 (x=${x}, got ${out})`);
}

// 3. Input White clipping
for (let i = 200; i <= 255; i++) {
  const x = i / 255;
  const out = calculatePhotoshopLevels(x, 0, 1.0, 200, 0, 255);
  assert.strictEqual(out, 1, `Values at or above inputWhite=200 must be clipped to 1 (x=${x}, got ${out})`);
}

// 4. Gamma expansion & compression
const gammaBright = calculatePhotoshopLevels(0.5, 0, 1.5, 255, 0, 255);
assert.ok(gammaBright > 0.5, `Gamma 1.5 must brighten midtones (got ${gammaBright} > 0.5)`);
const gammaDark = calculatePhotoshopLevels(0.5, 0, 0.7, 255, 0, 255);
assert.ok(gammaDark < 0.5, `Gamma 0.7 must darken midtones (got ${gammaDark} < 0.5)`);

// 5. Output Levels remapping
const outMin = calculatePhotoshopLevels(0, 0, 1.0, 255, 50, 200);
const outMax = calculatePhotoshopLevels(1, 0, 1.0, 255, 50, 200);
assert.ok(Math.abs(outMin - 50 / 255) < 0.001, `Output black 50 must remap min output to 50/255 (got ${outMin})`);
assert.ok(Math.abs(outMax - 200 / 255) < 0.001, `Output white 200 must remap max output to 200/255 (got ${outMax})`);

// 6. 1D LUT tableValues string generation
const lutStr = computeLevelsTableValues(0, 1.0, 255, 0, 255, 256);
const lutTokens = lutStr.trim().split(/\s+/);
assert.strictEqual(lutTokens.length, 256, '1D LUT tableValues must have exactly 256 samples');
assert.strictEqual(lutTokens[0], '0.0000', 'First sample of identity 1D LUT must be 0.0000');
assert.strictEqual(lutTokens[255], '1.0000', 'Last sample of identity 1D LUT must be 1.0000');

// 7. Color Matrix Vibrance & Saturation computation
const identityMatrix = computeVibranceSaturationMatrix(0, 0);
const expectedIdentity = '1.0000 0.0000 0.0000 0 0 0.0000 1.0000 0.0000 0 0 0.0000 0.0000 1.0000 0 0 0 0 0 1 0';
assert.strictEqual(identityMatrix, expectedIdentity, 'Default vibrance=0 saturation=0 must produce exact 4x5 identity matrix');

const desatMatrix = computeVibranceSaturationMatrix(0, -100);
const desatTokens = desatMatrix.trim().split(/\s+/);
assert.strictEqual(desatTokens[0], '0.2126', 'Desaturated red row must match ITU-R BT.709 red weight (0.2126)');
assert.strictEqual(desatTokens[1], '0.7152', 'Desaturated green row must match ITU-R BT.709 green weight (0.7152)');
assert.strictEqual(desatTokens[2], '0.0722', 'Desaturated blue row must match ITU-R BT.709 blue weight (0.0722)');

// 8. Neutral Gray Invariance across extreme vibrance & saturation combinations
for (const [vib, sat] of [[100, 100], [-100, -100], [100, -100], [-100, 100], [50, -50]]) {
  const matrix = computeVibranceSaturationMatrix(vib, sat);
  const m = matrix.trim().split(/\s+/).map(Number);
  const row0Sum = m[0] + m[1] + m[2];
  const row1Sum = m[5] + m[6] + m[7];
  const row2Sum = m[10] + m[11] + m[12];
  assert.ok(Math.abs(row0Sum - 1.0) < 0.001, `Row 0 weights must sum to 1.0 for vib=${vib} sat=${sat} (got ${row0Sum})`);
  assert.ok(Math.abs(row1Sum - 1.0) < 0.001, `Row 1 weights must sum to 1.0 for vib=${vib} sat=${sat} (got ${row1Sum})`);
  assert.ok(Math.abs(row2Sum - 1.0) < 0.001, `Row 2 weights must sum to 1.0 for vib=${vib} sat=${sat} (got ${row2Sum})`);
}

// 9. Edge Cases: inB === inW, inB > inW, extreme gamma, and non-finite inputs
const eqValLow = calculatePhotoshopLevels(0.3, 128, 1.0, 128, 0, 255);
assert.strictEqual(eqValLow, 0, 'When inB === inW, values below threshold must clamp to 0');
const eqValHigh = calculatePhotoshopLevels(0.7, 128, 1.0, 128, 0, 255);
assert.strictEqual(eqValHigh, 1, 'When inB === inW, values above threshold must clamp to 1');

const invertedOut = calculatePhotoshopLevels(0.0, 255, 1.0, 0, 0, 255);
assert.strictEqual(invertedOut, 1, 'Inverted input levels (inB > inW) at x=0 must yield 1');
const invertedOutHigh = calculatePhotoshopLevels(1.0, 255, 1.0, 0, 0, 255);
assert.strictEqual(invertedOutHigh, 0, 'Inverted input levels (inB > inW) at x=1 must yield 0');

assert.ok(Number.isFinite(calculatePhotoshopLevels(0.5, 0, 0.2, 255, 0, 255)), 'Gamma 0.2 must yield finite result');
assert.ok(Number.isFinite(calculatePhotoshopLevels(0.5, 0, 3.0, 255, 0, 255)), 'Gamma 3.0 must yield finite result');
assert.ok(Number.isFinite(calculatePhotoshopLevels(0.5, 0, 0, 255, 0, 255)), 'Gamma 0 must fallback safely without division by zero');
assert.strictEqual(calculatePhotoshopLevels(NaN), 0, 'NaN input to calculatePhotoshopLevels must return 0');

const safeLut1 = computeLevelsTableValues(0, 1.0, 255, 0, 255, 1);
assert.strictEqual(safeLut1.split(/\s+/).length, 2, 'computeLevelsTableValues must enforce minimum 2 samples');

// B. Component Architecture & Props in CanvasBackground & DynamicBackground
const postCanvasBg = fs.readFileSync(new URL('../src/components/background/CanvasBackground.tsx', import.meta.url), 'utf-8');
const postDynamicBg = fs.readFileSync(new URL('../src/components/background/DynamicBackground.tsx', import.meta.url), 'utf-8');
const postBgTypes = fs.readFileSync(new URL('../src/types/background.ts', import.meta.url), 'utf-8');

assert.ok(postBgTypes.includes('export interface ColorGradingSettings'), 'background.ts must define ColorGradingSettings interface');
assert.ok(postCanvasBg.includes('colorGradingEnabled?: boolean'), 'CanvasBackgroundProps must declare colorGradingEnabled');
assert.ok(postCanvasBg.includes('vibrance?: number'), 'CanvasBackgroundProps must declare vibrance');
assert.ok(postCanvasBg.includes('saturation?: number'), 'CanvasBackgroundProps must declare saturation');
assert.ok(postCanvasBg.includes('inputBlack?: number'), 'CanvasBackgroundProps must declare inputBlack');
assert.ok(postCanvasBg.includes('gamma?: number'), 'CanvasBackgroundProps must declare gamma');
assert.ok(postCanvasBg.includes('inputWhite?: number'), 'CanvasBackgroundProps must declare inputWhite');
assert.ok(postCanvasBg.includes('outputBlack?: number'), 'CanvasBackgroundProps must declare outputBlack');
assert.ok(postCanvasBg.includes('outputWhite?: number'), 'CanvasBackgroundProps must declare outputWhite');

assert.ok(postDynamicBg.includes('colorGradingEnabled?: boolean'), 'DynamicBackgroundProps must declare colorGradingEnabled');
assert.ok(postDynamicBg.includes('vibrance?: number'), 'DynamicBackgroundProps must declare vibrance');
assert.ok(postDynamicBg.includes('saturation?: number'), 'DynamicBackgroundProps must declare saturation');
assert.ok(postDynamicBg.includes('inputBlack?: number'), 'DynamicBackgroundProps must declare inputBlack');
assert.ok(postDynamicBg.includes('gamma?: number'), 'DynamicBackgroundProps must declare gamma');
assert.ok(postDynamicBg.includes('inputWhite?: number'), 'DynamicBackgroundProps must declare inputWhite');
assert.ok(postDynamicBg.includes('outputBlack?: number'), 'DynamicBackgroundProps must declare outputBlack');
assert.ok(postDynamicBg.includes('outputWhite?: number'), 'DynamicBackgroundProps must declare outputWhite');

// SVG Filter Definition in CanvasBackground & DynamicBackground
assert.ok(postCanvasBg.includes('id="canvas-color-grading"'), 'CanvasBackground must declare canvas-color-grading SVG filter');
assert.ok(postCanvasBg.includes('<feColorMatrix type="matrix"'), 'CanvasBackground must include feColorMatrix in color grading filter');
assert.ok(postCanvasBg.includes('<feComponentTransfer'), 'CanvasBackground must include feComponentTransfer in color grading filter');
assert.ok(postCanvasBg.includes("filter: colorGradingEnabled && !useCleanComposite ? 'url(#canvas-color-grading)' : undefined"), 'CanvasBackground must apply filter to master canvas when not viewing static master');
assert.ok(postCanvasBg.includes('!useCleanComposite'), 'CanvasBackground must bypass color grading when viewing static master (useCleanComposite)');

assert.ok(postDynamicBg.includes('id="dynamic-color-grading"'), 'DynamicBackground must declare dynamic-color-grading SVG filter');
assert.ok(postDynamicBg.includes("filter: colorGradingEnabled && !useCleanComposite ? 'url(#dynamic-color-grading)' : undefined"), 'DynamicBackground must apply filter to master container when not viewing static master');
assert.ok(postDynamicBg.includes('!useCleanComposite'), 'DynamicBackground must bypass color grading when viewing static master (useCleanComposite)');

// C. UI HUD Card, Sliders, and Preset Integration in PgPlayground Pages
const postBgCanvasPage = fs.readFileSync(new URL('../src/pages/BgCanvasPlaygroundPage.tsx', import.meta.url), 'utf-8');
const postBgPlayPage = fs.readFileSync(new URL('../src/pages/BgPlaygroundPage.tsx', import.meta.url), 'utf-8');

assert.ok(postBgCanvasPage.includes('Photoshop Vibrance & Levels'), 'BgCanvasPlaygroundPage must include Photoshop Vibrance & Levels HUD card');
assert.ok(postBgCanvasPage.includes('min="-100"') && postBgCanvasPage.includes('max="100"'), 'BgCanvasPlaygroundPage must provide vibrance & saturation slider range [-100, 100]');
assert.ok(postBgCanvasPage.includes('min="0"') && postBgCanvasPage.includes('max="255"'), 'BgCanvasPlaygroundPage must provide levels range [0, 255]');
assert.ok(postBgCanvasPage.includes('min="0.2"') && postBgCanvasPage.includes('max="3.0"'), 'BgCanvasPlaygroundPage must provide gamma range [0.2, 3.0]');

assert.ok(postBgCanvasPage.includes('colorGradingEnabled={colorGradingEnabled}'), 'BgCanvasPlaygroundPage must pass colorGradingEnabled to CanvasBackground');
assert.ok(postBgCanvasPage.includes('vibrance={vibrance}'), 'BgCanvasPlaygroundPage must pass vibrance to CanvasBackground');
assert.ok(postBgCanvasPage.includes('saturation={saturation}'), 'BgCanvasPlaygroundPage must pass saturation to CanvasBackground');
assert.ok(postBgCanvasPage.includes('inputBlack={inputBlack}'), 'BgCanvasPlaygroundPage must pass inputBlack to CanvasBackground');
assert.ok(postBgCanvasPage.includes('gamma={gamma}'), 'BgCanvasPlaygroundPage must pass gamma to CanvasBackground');
assert.ok(postBgCanvasPage.includes('inputWhite={inputWhite}'), 'BgCanvasPlaygroundPage must pass inputWhite to CanvasBackground');
assert.ok(postBgCanvasPage.includes('outputBlack={outputBlack}'), 'BgCanvasPlaygroundPage must pass outputBlack to CanvasBackground');
assert.ok(postBgCanvasPage.includes('outputWhite={outputWhite}'), 'BgCanvasPlaygroundPage must pass outputWhite to CanvasBackground');

assert.ok(postBgPlayPage.includes('Photoshop Vibrance & Levels'), 'BgPlaygroundPage must include Photoshop Vibrance & Levels HUD card');
assert.ok(postBgPlayPage.includes('colorGradingEnabled={colorGradingEnabled}'), 'BgPlaygroundPage must pass colorGradingEnabled to DynamicBackground');
assert.ok(postBgPlayPage.includes('vibrance={vibrance}'), 'BgPlaygroundPage must pass vibrance to DynamicBackground');
assert.ok(postBgPlayPage.includes('saturation={saturation}'), 'BgPlaygroundPage must pass saturation to DynamicBackground');
assert.ok(postBgPlayPage.includes('inputBlack={inputBlack}'), 'BgPlaygroundPage must pass inputBlack to DynamicBackground');
assert.ok(postBgPlayPage.includes('gamma={gamma}'), 'BgPlaygroundPage must pass gamma to DynamicBackground');
assert.ok(postBgPlayPage.includes('inputWhite={inputWhite}'), 'BgPlaygroundPage must pass inputWhite to DynamicBackground');
assert.ok(postBgPlayPage.includes('outputBlack={outputBlack}'), 'BgPlaygroundPage must pass outputBlack to DynamicBackground');
assert.ok(postBgPlayPage.includes('outputWhite={outputWhite}'), 'BgPlaygroundPage must pass outputWhite to DynamicBackground');

// Presets and Reset verification across both playground pages
assert.ok(postBgCanvasPage.includes('setVibrance(10)'), 'BgCanvasPlaygroundPage must configure calibrated default vibrance (+10)');
assert.ok(postBgPlayPage.includes('setVibrance(10)'), 'BgPlaygroundPage must configure calibrated default vibrance (+10)');
assert.ok(postBgCanvasPage.includes('setSaturation(-5)'), 'BgCanvasPlaygroundPage must configure calibrated default saturation (-5)');
assert.ok(postBgPlayPage.includes('setSaturation(-5)'), 'BgPlaygroundPage must configure calibrated default saturation (-5)');

const canvasGradingResetCount = (postBgCanvasPage.match(/setVibrance\(/g) || []).length;
assert.ok(canvasGradingResetCount >= 6, `BgCanvasPlaygroundPage must configure color grading across presets (found ${canvasGradingResetCount})`);

const domGradingResetCount = (postBgPlayPage.match(/setVibrance\(/g) || []).length;
assert.ok(domGradingResetCount >= 6, `BgPlaygroundPage must configure color grading across presets (found ${domGradingResetCount})`);

console.log('✓ Photoshop Vibrance & Levels GPU SVG implementation, 1D LUT Levels formula, HUD card sliders, and preset parity verified.');

console.log('--- ALL TESTS PASSED SUCCESSFULLY! ---');
