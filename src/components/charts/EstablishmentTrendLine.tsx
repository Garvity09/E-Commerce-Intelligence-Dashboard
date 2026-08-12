import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CHART_COLORS, formatCurrency } from './chartConstants';

interface EstablishmentTrendLineProps {
  data: { year: number; sales: number; count: number }[];
}

export default function EstablishmentTrendLine({ data }: EstablishmentTrendLineProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-md text-xs font-display">
          <p className="font-bold text-slate-800">Year: {dataPoint.year}</p>
          <p className="text-brand-forest mt-1">
            Total Sales: <span className="font-extrabold">{formatCurrency(dataPoint.sales)}</span>
          </p>
          <p className="text-slate-500">
            Transactions: <span className="font-semibold">{dataPoint.count.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.forest} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={CHART_COLORS.forest} stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.gridLines} vertical={false} />
          <XAxis 
            dataKey="year" 
            stroke="#94a3b8"
            fontSize={10}
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
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke={CHART_COLORS.forest} 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorSales)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
