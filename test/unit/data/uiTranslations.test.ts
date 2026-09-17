import { describe, it, expect } from 'vitest';
import { uiTranslations } from '../../../src/data/uiTranslations';

describe('uiTranslations Parity', () => {
  const languages = ['en', 'fr', 'pt'] as const;

  it('provides translations for all UI dictionary keys across en, fr, pt', () => {
    function checkNode(obj: Record<string, unknown>, path: string) {
      if ('en' in obj && 'fr' in obj && 'pt' in obj) {
        for (const lang of languages) {
          expect(
            typeof (obj as Record<string, unknown>)[lang],
            `Missing or non-string translation at ${path}.${lang}`
          ).toBe('string');
        }
        return;
      }
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          checkNode(value as Record<string, unknown>, `${path}.${key}`);
        }
      }
    }

    checkNode(uiTranslations as unknown as Record<string, unknown>, 'uiTranslations');
  });
});

