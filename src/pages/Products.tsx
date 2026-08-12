import { ShoppingBag, Star, TrendingUp, BarChart2 } from 'lucide-react';
import type { GroceryItem, DashboardKPIs } from '../types';
import KPICard from '../components/kpi/KPICard';
import ProductScatterPlot from '../components/charts/ProductScatterPlot';
import ItemTypeTable from '../components/tables/ItemTypeTable';
import { getSalesByItemType, getSalesVsVisibilitySample } from '../lib/dataProcessor';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CHART_COLORS, formatCurrency } from '../components/charts/chartConstants';

interface ProductsProps {
  filteredData: GroceryItem[];
  kpis: DashboardKPIs;
}

export default function Products({ filteredData, kpis }: ProductsProps) {
  const itemTypeData = getSalesByItemType(filteredData);
  const scatterData = getSalesVsVisibilitySample(filteredData, 800); // sample up to 800 items

  // Summary Metrics
  const totalItems = filteredData.length;
  const topProductType = itemTypeData[0]?.name || 'N/A';
  const topProductSales = itemTypeData[0]?.sales || 0;
  
  // Calculate average visibility
  const avgVisibility = totalItems > 0 
    ? (filteredData.reduce((acc, curr) => acc + curr.itemVisibility, 0) / totalItems) * 100 
    : 0;

  // Recharts custom tooltip for Item Count & Rating Chart
  const ComboTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const label = payload[0].payload.name;
      const count = payload.find((p: any) => p.dataKey === 'count')?.value || 0;
      const rating = payload.find((p: any) => p.dataKey === 'avgRating')?.value || 0;
      return (
        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-md text-xs font-display">
          <p className="font-bold text-slate-800">{label}</p>
          <div className="border-t border-slate-100 my-1.5" />
          <p className="text-brand-forest">
            Items Listed: <span className="font-extrabold">{count.toLocaleString()}</span>
          </p>
          <p className="text-amber-500">
            Avg Rating: <span className="font-bold">⭐ {rating.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Products Listed"
          value={totalItems}
          formatter={(v) => v.toLocaleString()}
          icon={ShoppingBag}
          description="Count of active items matching filters"
        />
        <KPICard
          title="Top Category Sales"
          value={topProductSales}
          formatter={formatCurrency}
          icon={TrendingUp}
          description={`Leading category: ${topProductType}`}
        />
        <KPICard
          title="Average Product Rating"
          value={kpis.averageRating}
          formatter={(v) => `⭐ ${v.toFixed(2)}`}
          icon={Star}
          description="Average customer rating"
        />
        <KPICard
          title="Avg Store Visibility"
          value={avgVisibility}
          formatter={(v) => `${v.toFixed(2)}%`}
          icon={BarChart2}
          description="Average item visibility score"
        />
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500 font-medium">No data available for the selected filters.</p>
          <p className="text-slate-400 text-xs mt-1">Try resetting or modifying your filters to display product analytics.</p>
        </div>
      )}

      {filteredData.length > 0 && (
        <>
          {/* Main Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Sales vs Visibility Scatter Plot */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <div className="mb-4">
                <h3 className="font-display font-bold text-sm text-slate-800">
                  Sales vs Item Visibility
                </h3>
                <p className="text-[11px] text-slate-500">
                  Scatter distribution checking if higher digital shelf-space visibility translates to higher sales (Sampled)
                </p>
              </div>
              <ProductScatterPlot data={scatterData} />
            </div>

            {/* Item Count & Ratings by Category */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <div className="mb-4">
                <h3 className="font-display font-bold text-sm text-slate-800">
                  Listing Volumes & Ratings by Category
                </h3>
                <p className="text-[11px] text-slate-500">
                  Number of unique items and average customer score per category
                </p>
              </div>
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={itemTypeData.slice(0, 8)}
                    margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.gridLines} vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8"
                      fontSize={9}
                      tickLine={false}
                      tickMargin={8}
                    />
                    <YAxis 
                      yAxisId="left"
                      orientation="left"
                      stroke={CHART_COLORS.forest}
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 5]}
                      stroke="#f59e0b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<ComboTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 600 }}
                    />
                    <Bar yAxisId="left" dataKey="count" name="Item Count" fill={CHART_COLORS.forest} radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="avgRating" name="Avg Rating (Out of 5)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sortable Item Type Table */}
          <ItemTypeTable data={itemTypeData} />
        </>
      )}
    </div>
  );
}
