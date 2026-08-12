import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CHART_COLORS, formatCurrency } from './chartConstants';

interface OutletSizePieProps {
  data: { name: string; value: number; count: number }[];
}

export default function OutletSizePie({ data }: OutletSizePieProps) {
  const COLORS = [
    CHART_COLORS.forest,
    CHART_COLORS.olive,
    CHART_COLORS.lime,
    CHART_COLORS.muted
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-md text-xs font-display">
          <p className="font-bold text-slate-800">Outlet Size: {dataPoint.name}</p>
          <p className="text-brand-forest mt-1">
            Total Sales: <span className="font-extrabold">{formatCurrency(dataPoint.value)}</span>
          </p>
          <p className="text-slate-500">
            Outlet Count: <span className="font-bold">{dataPoint.count.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 600 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
