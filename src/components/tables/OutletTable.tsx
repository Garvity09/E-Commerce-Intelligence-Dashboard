import { useState } from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import type { OutletComparisonData } from '../../lib/dataProcessor';
import { formatCurrency } from '../charts/chartConstants';

interface OutletTableProps {
  data: OutletComparisonData[];
}

type SortField = keyof OutletComparisonData;
type SortOrder = 'asc' | 'desc';

export default function OutletTable({ data }: OutletTableProps) {
  const [sortField, setSortField] = useState<SortField>('totalSales');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
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
          Outlet Performance Comparison
        </h3>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          {data.length} Outlets
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-display font-semibold text-slate-500 uppercase tracking-wider select-none">
              <th 
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('outletIdentifier')}
              >
                <div className="flex items-center">
                  Outlet ID <SortIcon field="outletIdentifier" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('outletType')}
              >
                <div className="flex items-center">
                  Type <SortIcon field="outletType" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('outletSize')}
              >
                <div className="flex items-center">
                  Size <SortIcon field="outletSize" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('outletLocationType')}
              >
                <div className="flex items-center">
                  Tier <SortIcon field="outletLocationType" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('outletEstablishmentYear')}
              >
                <div className="flex items-center justify-end">
                  Est. Year <SortIcon field="outletEstablishmentYear" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('totalSales')}
              >
                <div className="flex items-center justify-end">
                  Total Sales <SortIcon field="totalSales" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('avgSales')}
              >
                <div className="flex items-center justify-end">
                  Avg Sales <SortIcon field="avgSales" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('itemCount')}
              >
                <div className="flex items-center justify-end">
                  Items <SortIcon field="itemCount" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('avgRating')}
              >
                <div className="flex items-center justify-end">
                  Avg Rating <SortIcon field="avgRating" />
                </div>
              </th>
              <th 
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors"
                onClick={() => handleSort('avgVisibility')}
              >
                <div className="flex items-center justify-end">
                  Visibility <SortIcon field="avgVisibility" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {sortedData.map((row) => (
              <tr key={row.outletIdentifier} className="hover:bg-slate-50/50 transition-colors font-medium text-slate-700">
                <td className="py-3.5 px-4 font-bold text-brand-forest">{row.outletIdentifier}</td>
                <td className="py-3.5 px-4 text-slate-600">{row.outletType}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    row.outletSize === 'High' ? 'bg-emerald-50 text-emerald-700' :
                    row.outletSize === 'Medium' ? 'bg-sky-50 text-sky-700' :
                    row.outletSize === 'Small' ? 'bg-amber-50 text-amber-700' :
                    'bg-slate-50 text-slate-700'
                  }`}>
                    {row.outletSize}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600">{row.outletLocationType}</td>
                <td className="py-3.5 px-4 text-right text-slate-500 tabular-nums">{row.outletEstablishmentYear}</td>
                <td className="py-3.5 px-4 text-right font-display text-slate-900 font-bold tabular-nums">
                  {formatCurrency(row.totalSales)}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-700 tabular-nums">
                  {formatCurrency(row.avgSales)}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-600 tabular-nums">
                  {row.itemCount.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-slate-800 tabular-nums">
                  ⭐ {row.avgRating.toFixed(2)}
                </td>
                <td className="py-3.5 px-4 text-right text-slate-500 tabular-nums">
                  {row.avgVisibility.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
