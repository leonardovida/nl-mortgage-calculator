'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ChartDataPoint = {
  month: number;
  annuityGross: number;
  annuityCapital: number;
  annuityInterest: number;
  linearGross: number;
  linearCapital: number;
  linearInterest: number;
};

type MortgageChartProps = {
  data: ChartDataPoint[];
};

export default function MortgageChart({ data }: MortgageChartProps) {
  // Improved color scheme with better contrast and accessibility
  const colors = {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    muted: 'hsl(var(--muted-foreground))',
    destructive: 'hsl(var(--destructive))',
    success: 'hsl(142 71% 45%)',
  };

  const formatTooltip = (value: number, name: string) => {
    return [`€${value.toFixed(2)}`, name];
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ 
          top: 10, 
          right: 10, 
          left: 10, 
          bottom: 10 
        }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--border))" 
          opacity={0.3}
        />
        <XAxis 
          dataKey="month" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={20}
        />
        <YAxis 
          unit="€" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          width={50}
          tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={formatTooltip}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            fontSize: '12px',
          }}
          cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
        />
        <Legend 
          wrapperStyle={{ 
            paddingTop: '10px',
            fontSize: '10px',
          }}
          content={({ payload }) => (
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 text-xs">
              {payload?.map((entry, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-0.5" 
                    style={{ 
                      backgroundColor: entry.color,
                      ...(entry.payload?.strokeDasharray ? {
                        borderTop: `2px dashed ${entry.color}`,
                        backgroundColor: 'transparent',
                      } : {})
                    }}
                  />
                  <span style={{ color: entry.color }}>{entry.value}</span>
                </div>
              ))}
            </div>
          )}
        />

        {/* Annuity Lines */}
        <Line
          type="monotone"
          dataKey="annuityGross"
          name="Gross (Annuity)"
          stroke={colors.primary}
          strokeWidth={2}
          dot={false}
          activeDot={{ 
            r: 5, 
            stroke: colors.primary, 
            strokeWidth: 2,
            fill: 'hsl(var(--background))'
          }}
        />
        <Line
          type="monotone"
          dataKey="annuityCapital"
          name="Capital (Annuity)"
          stroke={colors.success}
          strokeWidth={2}
          dot={false}
          activeDot={{ 
            r: 5, 
            stroke: colors.success, 
            strokeWidth: 2,
            fill: 'hsl(var(--background))'
          }}
        />
        <Line
          type="monotone"
          dataKey="annuityInterest"
          name="Interest (Annuity)"
          stroke={colors.destructive}
          strokeWidth={2}
          dot={false}
          activeDot={{ 
            r: 5, 
            stroke: colors.destructive, 
            strokeWidth: 2,
            fill: 'hsl(var(--background))'
          }}
        />

        {/* Linear Lines */}
        <Line
          type="monotone"
          dataKey="linearGross"
          name="Gross (Linear)"
          stroke={colors.primary}
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          activeDot={{ 
            r: 5, 
            stroke: colors.primary, 
            strokeWidth: 2,
            fill: 'hsl(var(--background))'
          }}
        />
        <Line
          type="monotone"
          dataKey="linearCapital"
          name="Capital (Linear)"
          stroke={colors.success}
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          activeDot={{ 
            r: 5, 
            stroke: colors.success, 
            strokeWidth: 2,
            fill: 'hsl(var(--background))'
          }}
        />
        <Line
          type="monotone"
          dataKey="linearInterest"
          name="Interest (Linear)"
          stroke={colors.destructive}
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          activeDot={{ 
            r: 5, 
            stroke: colors.destructive, 
            strokeWidth: 2,
            fill: 'hsl(var(--background))'
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}