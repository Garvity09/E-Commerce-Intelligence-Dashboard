import { useState } from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { formatCurrency } from '../charts/chartConstants';

interface ItemTypeRow {
  name: string;
  sales: number;
  count: number;
  avgRating: number;
}

interface ItemTypeTableProps {
  data: ItemTypeRow[];
}

type SortField = 'name' | 'sales' | 'count' | 'avgRating';
type SortOrder = 'asc' | 'desc';

export default function ItemTypeTable({ data }: ItemTypeTableProps) {
  const [sortField, setSortField] = useState<SortField>('sales');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // default to descending for new fields
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      return sortOrder === 'asc' 
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    }

    return sortOrder === 'asc'
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-slate-400 opacity-60" />;
    return sortOrder === 'asc' 
      ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-brand-forest" />
      : <ChevronDown className="w-3.5 h-3.5 ml-1 text-brand-forest" />;
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-slate-800">
          Product Performance by Item Type
        </h3>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          {data.length} Types
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-display font-semibold text-slate-500 uppercase tracking-wider select-none">
              <th 
                className="py-3.5 px-5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Item Type <SortIcon field="name" />
                </div>
              </th>
              <th 
                className="py-3.5 px-5 text-right cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('sales')}
              >
                <div className="flex items-center justify-end">
                  Total Sales <SortIcon field="sales" />
                </div>
              </th>
              <th 
                className="py-3.5 px-5 text-right cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('count')}
              >
                <div className="flex items-center justify-end">
                  Item Count <SortIcon field="count" />
                </div>
              </th>
              <th 
                className="py-3.5 px-5 text-right cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('avgRating')}
              >
                <div className="flex items-center justify-end">
                  Avg Rating <SortIcon field="avgRating" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {sortedData.map((row) => (
              <tr key={row.name} className="hover:bg-slate-50/50 transition-colors font-medium text-slate-700">
                <td className="py-3.5 px-5 font-semibold text-slate-800">{row.name}</td>
                <td className="py-3.5 px-5 text-right font-display text-slate-900 tabular-nums">
                  {formatCurrency(row.sales)}
                </td>
                <td className="py-3.5 px-5 text-right text-slate-600 tabular-nums">
                  {row.count.toLocaleString()}
                </td>
                <td className="py-3.5 px-5 text-right font-semibold text-slate-800 tabular-nums">
                  ⭐ {row.avgRating.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
