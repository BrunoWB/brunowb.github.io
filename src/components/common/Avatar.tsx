import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  showGlow?: boolean;
  isHidden?: boolean;
  style?: React.CSSProperties;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src = 'https://github.com/BrunoWB.png',
      alt = 'Bruno Barcellos',
      size = 'hero',
      className = '',
      showGlow = true,
      isHidden = false,
      style,
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-12 h-12 border-2',
      md: 'w-20 h-20 border-2',
      lg: 'w-28 h-28 border-3',
      hero: 'w-32 h-32 sm:w-36 sm:h-36 border-3',
    }[size];

    return (
      <div
        ref={ref}
        style={style}
        className={`relative inline-flex items-center justify-center ${
          isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${className}`}
      >
        {showGlow && (
          <div
            className="absolute -inset-2.5 rounded-full pointer-events-none animate-avatar-breathe"
            style={{
              background:
                'radial-gradient(circle, rgba(0, 229, 255, 0.75) 0%, rgba(168, 85, 247, 0.35) 45%, transparent 70%)',
            }}
            aria-hidden="true"
          />
        )}
        <img
          src={src}
          alt={alt}
          className={`relative rounded-full object-cover transition-transform duration-300 ease-out hover:scale-105 animate-avatar-pulse bg-[#0b323c] ${sizeClasses}`}
          style={{
            borderColor: 'rgba(0, 210, 235, 0.85)',
            boxShadow: '0 10px 30px rgba(0, 210, 235, 0.25)',
          }}
          loading="eager"
        />
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

