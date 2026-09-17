import { describe, it, expect } from 'vitest';
import { projectsData } from '../../../src/data/projectsData';

describe('projectsData Contract & Links', () => {
  const languages = ['en', 'fr', 'pt'] as const;

  it('contains valid showcase projects with required URLs and multilingual tags', () => {
    expect(projectsData.length).toBeGreaterThanOrEqual(3);

    for (const project of projectsData) {
      expect(project.id).toBeTruthy();
      expect(project.title).toBeTruthy();
      expect(project.repo).toBeTruthy();
      expect(project.repoUrl).toMatch(/^https:\/\/github\.com\//);

      for (const lang of languages) {
        expect(project.tag[lang]).toBeTruthy();
        expect(project.description[lang]).toBeTruthy();
      }

      if (project.preview) {
        expect(['video', 'image']).toContain(project.preview.type);
        expect(project.preview.src).toBeTruthy();
      }
    }
  });
});

