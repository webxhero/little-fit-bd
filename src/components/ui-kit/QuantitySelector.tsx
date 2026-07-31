import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  value,
  onChange,
  max = 99,
  compact = false,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  compact?: boolean;
}) {
  const btn = compact ? "h-9 w-9" : "h-11 w-11";
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-card">
      <button
        type="button"
        aria-label="Decrease quantity"
        className={`${btn} inline-flex items-center justify-center rounded-l-lg text-heading transition-colors hover:bg-secondary disabled:opacity-40`}
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
      >
        <Minus size={16} />
      </button>
      <span aria-live="polite" className={`${compact ? "w-9" : "w-12"} text-center text-sm font-medium text-heading`}>
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className={`${btn} inline-flex items-center justify-center rounded-r-lg text-heading transition-colors hover:bg-secondary disabled:opacity-40`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
