import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TypewriterText } from '../../src/components/common/TypewriterText';
import { TypewriterProvider } from '../../src/context/TypewriterContext';

describe('TypewriterText component', () => {
  it('renders invisible placeholder for zero layout shift reservation', () => {
    const { container } = render(
      <TypewriterProvider>
        <TypewriterText text="Zero Cumulative Layout Shift" />
      </TypewriterProvider>
    );

    const invisiblePlaceholder = container.querySelector('.invisible');
    expect(invisiblePlaceholder).not.toBeNull();
    expect(invisiblePlaceholder?.textContent).toBe('Zero Cumulative Layout Shift');
    expect(invisiblePlaceholder?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders as custom semantic tag when as prop is provided', () => {
    const { container } = render(
      <TypewriterProvider>
        <TypewriterText text="Heading Title" as="h1" />
      </TypewriterProvider>
    );

    const h1 = container.querySelector('h1');
    expect(h1).not.toBeNull();
  });
});

