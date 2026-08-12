import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { CHART_COLORS, formatCurrency } from './chartConstants';

interface ItemTypeBarProps {
  data: { name: string; sales: number; count: number; avgRating: number }[];
  limit?: number;
}

export default function ItemTypeBar({ data, limit }: ItemTypeBarProps) {
  const chartData = limit ? data.slice(0, limit) : data;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-md text-xs font-display">
          <p className="font-bold text-slate-800">{dataPoint.name}</p>
          <p className="text-brand-forest mt-1">
            Total Sales: <span className="font-extrabold">{formatCurrency(dataPoint.sales)}</span>
          </p>
          <p className="text-slate-600">
            Avg Rating: <span className="font-bold">⭐ {dataPoint.avgRating}</span>
          </p>
          <p className="text-slate-500">
            Items Sold: <span className="font-semibold">{dataPoint.count.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.gridLines} horizontal={false} />
          <XAxis 
            type="number" 
            tickFormatter={formatCurrency}
            stroke="#94a3b8"
            fontSize={10}
            tickLine={false}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={120} 
            stroke="#94a3b8"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(30, 63, 32, 0.03)' }} />
          <Bar dataKey="sales" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? CHART_COLORS.forest : index < 3 ? CHART_COLORS.olive : CHART_COLORS.categorical[4]} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
