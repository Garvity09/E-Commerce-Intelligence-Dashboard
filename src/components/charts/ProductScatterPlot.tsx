import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis } from 'recharts';
import { CHART_COLORS, formatCurrency } from './chartConstants';

interface ProductScatterPlotProps {
  data: { sales: number; visibility: number; name: string; type: string }[];
}

export default function ProductScatterPlot({ data }: ProductScatterPlotProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-md text-xs font-display max-w-[200px]">
          <p className="font-bold text-slate-800">{dataPoint.name}</p>
          <p className="text-slate-500 italic mt-0.5">{dataPoint.type}</p>
          <div className="border-t border-slate-100 my-1.5" />
          <p className="text-brand-forest">
            Sales: <span className="font-extrabold">{formatCurrency(dataPoint.sales)}</span>
          </p>
          <p className="text-slate-600">
            Visibility: <span className="font-bold">{dataPoint.visibility}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 15, right: 20, bottom: 5, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.gridLines} />
          <XAxis 
            type="number" 
            dataKey="visibility" 
            name="Visibility" 
            unit="%" 
            stroke="#94a3b8"
            fontSize={10}
            tickLine={false}
          />
          <YAxis 
            type="number" 
            dataKey="sales" 
            name="Sales" 
            tickFormatter={formatCurrency}
            stroke="#94a3b8"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <ZAxis type="number" range={[20, 20]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter 
            name="Products" 
            data={data} 
            fill={CHART_COLORS.forest} 
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
