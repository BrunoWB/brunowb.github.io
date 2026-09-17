import React from 'react';

interface RangeSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (val: number) => string;
  description?: string;
  disabled?: boolean;
  accentColor?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  formatValue,
  description,
  disabled = false,
  accentColor = 'accent-cyan-400',
}) => {
  const displayVal = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div className={disabled ? 'opacity-40 select-none' : ''}>
      <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
        <span>{label}</span>
        <span className="font-mono text-cyan-300">{displayVal}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className={`w-full ${accentColor} h-1.5 bg-slate-700 rounded-lg cursor-pointer disabled:cursor-not-allowed`}
      />
      {description && (
        <div className="text-[10px] text-[var(--text-muted)] mt-1">{description}</div>
      )}
    </div>
  );
};

export default RangeSlider;
