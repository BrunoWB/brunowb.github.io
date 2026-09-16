import React from 'react';
import {
  useTypewriterRewriter,
  type UseTypewriterRewriterOptions,
} from '../../hooks/useTypewriterRewriter';

export interface TypewriterRewriterProps extends UseTypewriterRewriterOptions {
  text: string;
  className?: string;
  cursor?: boolean;
  cursorClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const TypewriterRewriter: React.FC<TypewriterRewriterProps> = ({
  text,
  deleteSpeed,
  typeSpeed,
  pauseDelay,
  cursorLingerMs,
  initialAnimate = false,
  onComplete,
  className = '',
  cursor = true,
  cursorClassName = '',
  as: Component = 'span',
}) => {
  const { displayedText, showCursor } = useTypewriterRewriter(text, {
    deleteSpeed,
    typeSpeed,
    pauseDelay,
    cursorLingerMs,
    initialAnimate,
    onComplete,
  });

  return (
    <Component
      className={`inline-flex items-center align-baseline ${className}`}
      aria-label={text}
    >
      <span className="whitespace-pre-wrap">
        {displayedText || (
          <span className="invisible select-none pointer-events-none" aria-hidden="true">
            &nbsp;
          </span>
        )}
      </span>
      {cursor && (
        <span
          aria-hidden="true"
          className={`inline-block w-[2px] h-[1.15em] align-middle bg-[var(--brand-primary)] dark:bg-cyan-300 ml-0.5 select-none transition-opacity duration-150 ${
            showCursor ? 'opacity-100 animate-typewriter-cursor' : 'opacity-0'
          } ${cursorClassName}`}
        />
      )}
    </Component>
  );
};
