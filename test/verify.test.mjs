import assert from 'node:assert';
import { cvData } from '../src/data/cvData.ts';
import { projectsData } from '../src/data/projectsData.ts';
import { uiTranslations } from '../src/data/uiTranslations.ts';
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
  'layer-7.0-shooting-star.webp',
  'layer-7.1-shooting-star-hardlight1.webp',
  'layer-7.2-shooting-star-hardlight2.webp',
  'layer-7.3-shooting-star-hidden.webp',
  'shooting-sprite.webp',
  'bgclean.webp',
];
expectedLayers.forEach((layerFile) => {
  assert.ok(fs.existsSync(`${bgLayersDir}/${layerFile}`), `Missing asset: public/bg-layers/${layerFile}`);
});
console.log('✓ Dynamic background, SVG water distortion filter, and /bg route verified.');

console.log('--- ALL TESTS PASSED SUCCESSFULLY! ---');
