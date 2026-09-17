import React from 'react';

interface ControlCardProps {
  title: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ControlCard: React.FC<ControlCardProps> = ({
  title,
  icon,
  headerAction,
  children,
  className = '',
}) => {
  return (
    <div className={`p-3 rounded-xl bg-[var(--bg-card)]/40 border border-[var(--border-subtle)]/50 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-xs text-[var(--text-primary)] flex items-center gap-1.5">
          {icon}
          {title}
        </span>
        {headerAction && <div className="flex items-center gap-1.5">{headerAction}</div>}
      </div>
      {children}
    </div>
  );
};

export default ControlCard;
