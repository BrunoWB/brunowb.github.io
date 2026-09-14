import React from 'react';

interface FloatingBubbleProps {
  position?: 'bottom-left' | 'bottom-right';
  className?: string;
  children: React.ReactNode;
}

export const FloatingBubble: React.FC<FloatingBubbleProps> = ({
  position = 'bottom-right',
  className = '',
  children,
}) => {
  const positionClass =
    position === 'bottom-left'
      ? 'bottom-4 left-4 sm:bottom-6 sm:left-6'
      : 'bottom-4 right-4 sm:bottom-6 sm:right-6';

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-out hover:-translate-y-1 ${positionClass} ${className}`}
    >
      {children}
    </div>
  );
};
