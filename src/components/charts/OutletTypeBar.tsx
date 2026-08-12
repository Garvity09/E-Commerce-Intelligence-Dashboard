import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { CHART_COLORS, formatCurrency } from './chartConstants';

interface OutletTypeBarProps {
  data: { name: string; sales: number; count: number }[];
}

export default function OutletTypeBar({ data }: OutletTypeBarProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-md text-xs font-display">
          <p className="font-bold text-slate-800">{dataPoint.name}</p>
          <p className="text-brand-forest mt-1">
            Total Sales: <span className="font-extrabold">{formatCurrency(dataPoint.sales)}</span>
          </p>
          <p className="text-slate-500">
            Items Sold: <span className="font-bold">{dataPoint.count.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
            tickFormatter={formatCurrency}
            stroke="#94a3b8"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(30, 63, 32, 0.03)' }} />
          <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? CHART_COLORS.forest : index === 1 ? CHART_COLORS.olive : index === 2 ? CHART_COLORS.lime : CHART_COLORS.muted} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
