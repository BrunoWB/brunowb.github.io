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

assert.strictEqual(cvData.experience.positions.length, 6, 'Must have 6 timeline positions');
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
console.log('✓ cvData multi-language parity verified (6 timeline entries with en/fr/pt roles/bullets).');

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

console.log('--- ALL TESTS PASSED SUCCESSFULLY! ---');
