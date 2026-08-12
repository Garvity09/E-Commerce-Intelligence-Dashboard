import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import type { FilterState } from '../../types';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  uniqueValues: {
    fatContent: string[];
    itemType: string[];
    establishmentYear: number[];
    locationType: string[];
    outletSize: string[];
    outletType: string[];
  };
}

export default function FilterPanel({ filters, onChange, uniqueValues }: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    fatContent: true,
    itemType: false,
    establishmentYear: false,
    locationType: true,
    outletSize: true,
    outletType: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (
    key: keyof FilterState,
    value: string | number
  ) => {
    const currentValues = filters[key] as any[];
    let newValues: any[];

    if (currentValues.includes(value)) {
      newValues = currentValues.filter(val => val !== value);
    } else {
      newValues = [...currentValues, value];
    }

    onChange({
      ...filters,
      [key]: newValues,
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

  const isFilterActive = Object.values(filters).some(arr => arr.length > 0);

  const renderSection = (
    label: string,
    key: keyof FilterState,
    options: (string | number)[]
  ) => {
    const isExpanded = expandedSections[key];
    const activeCount = filters[key].length;

    return (
      <div className="border-b border-slate-100 last:border-0 py-3.5">
        <button
          onClick={() => toggleSection(key)}
          className="w-full flex items-center justify-between font-display text-sm font-semibold text-slate-700 hover:text-brand-forest focus:outline-none"
        >
          <span className="flex items-center space-x-2">
            <span>{label}</span>
            {activeCount > 0 && (
              <span className="bg-brand-forest/10 text-brand-forest text-[11px] font-extrabold px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {isExpanded && (
          <div className="mt-3.5 space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {options.map(opt => {
              const isChecked = (filters[key] as any[]).includes(opt);
              return (
                <label key={opt} className="flex items-center space-x-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(key, opt)}
                    className="w-4 h-4 rounded border-slate-300 text-brand-forest focus:ring-brand-lime"
                  />
                  <span className="truncate">{opt}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
        <h3 className="font-display font-bold text-sm text-slate-800 flex items-center space-x-2">
          <Filter className="w-4 h-4 text-brand-forest" />
          <span>Filters</span>
        </h3>
        {isFilterActive && (
          <button
            onClick={clearAll}
            className="text-[11px] font-bold text-brand-muted hover:text-brand-forest flex items-center space-x-1 border border-slate-200 px-2 py-1 rounded-lg hover:border-slate-300 transition-colors focus:outline-none"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {renderSection('Fat Content', 'fatContent', uniqueValues.fatContent)}
        {renderSection('Outlet Type', 'outletType', uniqueValues.outletType)}
        {renderSection('Outlet Size', 'outletSize', uniqueValues.outletSize)}
        {renderSection('Outlet Location', 'locationType', uniqueValues.locationType)}
        {renderSection('Item Type', 'itemType', uniqueValues.itemType)}
        {renderSection('Establishment Year', 'establishmentYear', uniqueValues.establishmentYear)}
      </div>
    </div>
  );
}
