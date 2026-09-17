import { describe, it, expect } from 'vitest';
import { formatSkillsInText, SKILL_PATTERNS } from '../../../src/components/cv/cvSkillHighlighter';

describe('cvSkillHighlighter Pattern Matcher', () => {
  it('orders skill patterns with composite phrases before single words', () => {
    const javaSpringIdx = SKILL_PATTERNS.findIndex((p) => p.pattern === 'Java (Spring Boot)');
    const javaIdx = SKILL_PATTERNS.findIndex((p) => p.pattern === 'Java');
    expect(javaSpringIdx).toBeLessThan(javaIdx);

    const react19Idx = SKILL_PATTERNS.findIndex((p) => p.pattern === 'React 19');
    const reactIdx = SKILL_PATTERNS.findIndex((p) => p.pattern === 'React');
    expect(react19Idx).toBeLessThan(reactIdx);
  });

  it('preserves text without skill matches as a plain string', () => {
    const result = formatSkillsInText('Just a simple text without matches', false, null);
    expect(result).toBe('Just a simple text without matches');
  });

  it('splits matched skill keywords into formatted elements', () => {
    const result = formatSkillsInText('Engineered with TypeScript and React 19', false, null);
    expect(Array.isArray(result)).toBe(true);
  });
});

