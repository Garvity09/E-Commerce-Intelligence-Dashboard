import { DollarSign, Percent, TrendingUp, ShoppingBag } from 'lucide-react';
import type { GroceryItem, DashboardKPIs } from '../types';
import KPICard from '../components/kpi/KPICard';
import FatContentDonut from '../components/charts/FatContentDonut';
import ItemTypeBar from '../components/charts/ItemTypeBar';
import EstablishmentTrendLine from '../components/charts/EstablishmentTrendLine';
import OutletLocationBar from '../components/charts/OutletLocationBar';
import OutletTypeBar from '../components/charts/OutletTypeBar';
import { formatCurrency } from '../components/charts/chartConstants';
import {
  getSalesByFatContent,
  getSalesByItemType,
  getSalesByOutletYear,
  getSalesByOutletLocation,
  getSalesByOutletType
} from '../lib/dataProcessor';

interface SalesProps {
  filteredData: GroceryItem[];
  kpis: DashboardKPIs;
}

export default function Sales({ filteredData, kpis }: SalesProps) {
  const fatContentData = getSalesByFatContent(filteredData);
  const itemTypeData = getSalesByItemType(filteredData);
  const outletYearData = getSalesByOutletYear(filteredData);
  const outletLocationData = getSalesByOutletLocation(filteredData);
  const outletTypeData = getSalesByOutletType(filteredData);

  // Quick helper calculations
  const fatContentPercentage = fatContentData.reduce((acc, curr) => {
    acc[curr.name] = (curr.value / (kpis.totalSales || 1)) * 100;
    return acc;
  }, {} as Record<string, number>);

  const topOutletType = outletTypeData[0]?.name || 'N/A';
  const topOutletTypeSales = outletTypeData[0]?.sales || 0;

  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={kpis.totalSales}
          formatter={formatCurrency}
          icon={DollarSign}
          description="Total sales of items"
        />
        <KPICard
          title="Average Order Value"
          value={kpis.averageSales}
          formatter={formatCurrency}
          icon={TrendingUp}
          description="Average sales per item sold"
        />
        <KPICard
          title="Low Fat Sales Ratio"
          value={fatContentPercentage['Low Fat'] || 0}
          formatter={(v) => `${v.toFixed(1)}%`}
          icon={Percent}
          description="Percentage of sales from low fat items"
        />
        <KPICard
          title="Primary Sales Channel"
          value={topOutletTypeSales}
          formatter={formatCurrency}
          icon={ShoppingBag}
          description={`Sales from ${topOutletType}`}
        />
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500 font-medium">No data available for the selected filters.</p>
          <p className="text-slate-400 text-xs mt-1">Try resetting or modifying your filters to display sales analytics.</p>
        </div>
      )}

      {filteredData.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Sales Trend line */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm xl:col-span-2">
            <h3 className="font-display font-bold text-sm text-slate-800 mb-1">
              Sales Trend by Year
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Historical yearly sales distribution across established outlets
            </p>
            <EstablishmentTrendLine data={outletYearData} />
          </div>

          {/* Sales by Item Type */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm xl:col-span-2">
            <h3 className="font-display font-bold text-sm text-slate-800 mb-1">
              Sales by Item Type Category
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Detailed performance ranking of grocery item types
            </p>
            <ItemTypeBar data={itemTypeData} />
          </div>

          {/* Sales by Fat Content */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-display font-bold text-sm text-slate-800 mb-1">
              Fat Content Breakdown
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Share of Low Fat vs Regular items in total sales
            </p>
            <FatContentDonut data={fatContentData} />
          </div>

          {/* Sales by Location */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-display font-bold text-sm text-slate-800 mb-1">
              Location Tier Performance
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Sales performance across Tier 1, Tier 2, and Tier 3 location tiers
            </p>
            <OutletLocationBar data={outletLocationData} />
          </div>

          {/* Sales by Outlet Type */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm xl:col-span-2">
            <h3 className="font-display font-bold text-sm text-slate-800 mb-1">
              Outlet Format Comparison
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Comparative sales performance across Supermarkets and Grocery Stores
            </p>
            <OutletTypeBar data={outletTypeData} />
          </div>
        </div>
      )}
    </div>
  );
}
