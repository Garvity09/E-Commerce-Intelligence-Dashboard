import { X, RotateCcw } from 'lucide-react';
import type { FilterState } from '../../types';

interface FilterChipsProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function FilterChips({ filters, onChange }: FilterChipsProps) {
  const removeFilterItem = (key: keyof FilterState, value: string | number) => {
    const updatedValues = (filters[key] as any[]).filter(v => v !== value);
    onChange({
      ...filters,
      [key]: updatedValues,
    });
  };

  const clearAll = () => {
    onChange({
      fatContent: [],
      itemType: [],
      establishmentYear: [],
      locationType: [],
      outletSize: [],
      outletType: [],
    });
  };

  // Compile active filters
  const activeChips: { key: keyof FilterState; label: string; value: string | number }[] = [];

  const addChips = (key: keyof FilterState, categoryLabel: string) => {
    filters[key].forEach(val => {
      activeChips.push({
        key,
        label: `${categoryLabel}: ${val}`,
        value: val
      });
    });
  };

  addChips('fatContent', 'Fat');
  addChips('outletType', 'Type');
  addChips('outletSize', 'Size');
  addChips('locationType', 'Location');
  addChips('itemType', 'Product');
  addChips('establishmentYear', 'Est. Year');

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display mr-1">
        Active Filters ({activeChips.length})
      </span>

      {activeChips.map((chip, idx) => (
        <span
          key={`${chip.key}-${chip.value}-${idx}`}
          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-300 transition-colors shadow-xs"
        >
          <span>{chip.label}</span>
          <button
            onClick={() => removeFilterItem(chip.key, chip.value)}
            className="p-0.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        onClick={clearAll}
        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-brand-forest text-white text-xs font-bold hover:bg-brand-forest/90 transition-colors focus:outline-none ml-auto"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset All</span>
      </button>
    </div>
  );
}
