import { Store, Layers, MapPin, Calendar } from 'lucide-react';
import type { GroceryItem, DashboardKPIs } from '../types';
import KPICard from '../components/kpi/KPICard';
import OutletSizePie from '../components/charts/OutletSizePie';
import OutletLocationBar from '../components/charts/OutletLocationBar';
import OutletTypeBar from '../components/charts/OutletTypeBar';
import EstablishmentTrendLine from '../components/charts/EstablishmentTrendLine';
import OutletTable from '../components/tables/OutletTable';
import { formatCurrency } from '../components/charts/chartConstants';
import {
  getSalesByOutletSize,
  getSalesByOutletLocation,
  getSalesByOutletType,
  getSalesByOutletYear,
  getOutletComparison
} from '../lib/dataProcessor';

interface OutletsProps {
  filteredData: GroceryItem[];
  kpis: DashboardKPIs;
}

export default function Outlets({ filteredData }: OutletsProps) {
  const outletSizeData = getSalesByOutletSize(filteredData);
  const outletLocationData = getSalesByOutletLocation(filteredData);
  const outletTypeData = getSalesByOutletType(filteredData);
  const outletYearData = getSalesByOutletYear(filteredData);
  const comparisonData = getOutletComparison(filteredData);

  // Compute Outlet summary stats
  const totalOutlets = comparisonData.length;
  const avgOutletSales = totalOutlets > 0 
    ? comparisonData.reduce((acc, curr) => acc + curr.totalSales, 0) / totalOutlets
    : 0;

  const topOutletType = outletTypeData[0]?.name || 'N/A';
  const topLocation = outletLocationData[0]?.name || 'N/A';

  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Outlets"
          value={totalOutlets}
          formatter={(v) => v.toLocaleString()}
          icon={Store}
          description="Total active outlets in dataset"
        />
        <KPICard
          title="Avg Sales per Outlet"
          value={avgOutletSales}
          formatter={formatCurrency}
          icon={Layers}
          description="Average revenue per location"
        />
        <KPICard
          title="Top Location by Sales"
          value={outletLocationData[0]?.sales || 0}
          formatter={formatCurrency}
          icon={MapPin}
          description={topLocation}
        />
        <KPICard
          title="Top Outlet Type by Sales"
          value={outletTypeData[0]?.sales || 0}
          formatter={formatCurrency}
          icon={Calendar}
          description={topOutletType}
        />
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500 font-medium">No data available for the selected filters.</p>
          <p className="text-slate-400 text-xs mt-1">Try resetting or modifying your filters to display outlet analytics.</p>
        </div>
      )}

      {filteredData.length > 0 && (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Outlet Type Performance */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-display font-bold text-sm text-slate-800 mb-1">
                Outlet Type Performance
              </h3>
              <p className="text-[11px] text-slate-500 mb-4">
                Total sales revenue across grocery store types and supermarkets
              </p>
              <OutletTypeBar data={outletTypeData} />
            </div>

            {/* Outlet Size Performance */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-display font-bold text-sm text-slate-800 mb-1">
                Outlet Size Performance
              </h3>
              <p className="text-[11px] text-slate-500 mb-4">
                Revenue distribution across small, medium, and high size categories
              </p>
              <OutletSizePie data={outletSizeData} />
            </div>

            {/* Location Tier Performance */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-display font-bold text-sm text-slate-800 mb-1">
                Location Tier Performance
              </h3>
              <p className="text-[11px] text-slate-500 mb-4">
                Geographical sales distribution (Tier 1, Tier 2, Tier 3)
              </p>
              <OutletLocationBar data={outletLocationData} />
            </div>

            {/* Establishment Year Performance */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-display font-bold text-sm text-slate-800 mb-1">
                Outlet Establishment Vintage
              </h3>
              <p className="text-[11px] text-slate-500 mb-4">
                Total sales grouped by the year the outlets were established
              </p>
              <EstablishmentTrendLine data={outletYearData} />
            </div>
          </div>

          {/* Outlet Comparison Table */}
          <OutletTable data={comparisonData} />
        </>
      )}
    </div>
  );
}
