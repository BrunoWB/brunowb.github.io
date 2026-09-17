import React from 'react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  statusText?: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  statusText,
  disabled = false,
}) => {
  return (
    <div className="pt-2 border-t border-[var(--border-subtle)]/30 flex items-center justify-between">
      <label className="text-xs text-[var(--text-secondary)] flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 accent-cyan-400 focus:ring-cyan-400/30 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <span>{label}</span>
      </label>
      {statusText && (
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          {statusText}
        </span>
      )}
    </div>
  );
};

export default ToggleSwitch;
