import { describe, it, expect } from 'vitest';
import { cvData } from '../../../src/data/cvData';

describe('cvData Multi-Language Parity', () => {
  const languages = ['en', 'fr', 'pt'] as const;

  it('provides all header and profile fields in en, fr, pt', () => {
    expect(cvData.header.name).toBeTruthy();
    expect(cvData.header.avatarUrl).toBeTruthy();

    for (const lang of languages) {
      expect(cvData.header.title[lang]).toBeTruthy();
      expect(cvData.profile.title[lang]).toBeTruthy();
      expect(cvData.profile.location[lang]).toBeTruthy();
      expect(cvData.profile.summary[lang]).toBeTruthy();
      expect(cvData.skills.title[lang]).toBeTruthy();
      expect(cvData.education.title[lang]).toBeTruthy();
      expect(cvData.education.entry.degree[lang]).toBeTruthy();
      expect(cvData.education.entry.major[lang]).toBeTruthy();
      expect(cvData.contact.title[lang]).toBeTruthy();
      expect(cvData.languages.title[lang]).toBeTruthy();
      expect(cvData.experience.title[lang]).toBeTruthy();
    }
  });

  it('has valid language items with en/fr/pt translations', () => {
    expect(cvData.languages.items.length).toBeGreaterThanOrEqual(5);
    for (const item of cvData.languages.items) {
      for (const lang of languages) {
        expect(item.name[lang]).toBeTruthy();
        expect(item.level[lang]).toBeTruthy();
      }
    }
  });

  it('has valid experience positions with roles and bullets in en, fr, pt', () => {
    expect(cvData.experience.positions.length).toBe(8);
    for (const pos of cvData.experience.positions) {
      for (const lang of languages) {
        expect(pos.role[lang]).toBeTruthy();
        if (pos.bullets) {
          expect(pos.period?.[lang]).toBeTruthy();
          expect(pos.location?.[lang]).toBeTruthy();
          expect(Array.isArray(pos.bullets[lang])).toBe(true);
          expect(pos.bullets[lang].length).toBeGreaterThan(0);
        }
      }
    }
  });
});

