import React from 'react';
import { useTypewriterController } from '../../context/TypewriterContext';
import { useTypewriter } from '../../hooks/useTypewriter';

export interface TypewriterTextProps {
  text: string;
  step?: number;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  onComplete?: () => void;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'li' | 'div';
  formatter?: (text: string) => React.ReactNode;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  step = 1,
  speed = 18,
  delay = 0,
  cursor = true,
  onComplete,
  className = '',
  as: Component = 'span',
  formatter,
}) => {
  const { currentStep, isSkipped } = useTypewriterController();
  const active = currentStep >= step;

  const { displayText } = useTypewriter(text, {
    speed,
    delay,
    active,
    isSkipped,
    onComplete,
  });

  const isComplete = isSkipped || displayText.length >= text.length;

  return (
    <Component className={`relative ${Component === 'span' ? 'inline-block' : 'block'} ${className}`}>
      {/* Invisible placeholder that takes total height and wrapping in advance to prevent pushing elements around */}
      <span className="invisible select-none pointer-events-none block" aria-hidden="true">
        {formatter ? formatter(text) : text}
      </span>

      {/* Visible typewriter overlay that streams in text without shifting layout */}
      <span className="absolute inset-0 block">
        {active || isSkipped ? (formatter ? formatter(displayText) : displayText) : ''}
        {cursor && active && !isComplete && (
          <span className="inline-block font-mono font-bold text-cyan-400 dark:text-cyan-300 animate-typewriter-cursor ml-0.5">
            |
          </span>
        )}
      </span>
    </Component>
  );
};
