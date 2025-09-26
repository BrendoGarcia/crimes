import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface CrimeChartProps {
  type: 'pie' | 'bar' | 'line';
  data: ChartData[];
  title?: string;
  height?: number;
}

const COLORS = [
  'hsl(0 73% 41%)',   // Primary red
  'hsl(0 84% 60%)',   // Danger red
  'hsl(38 92% 50%)',  // Warning orange
  'hsl(0 0% 45%)',    // Neutral gray
  'hsl(0 0% 15%)',    // Dark gray
  'hsl(0 73% 35%)',   // Darker red
];

export const CrimeChart = ({ type, data, title, height = 300 }: CrimeChartProps) => {
  const renderCustomLabel = ({ name, percent, x, y }: any) => {
  const truncated = name.length > 12 ? name.slice(0, 12) + '…' : name;
  return `${truncated} ${(percent * 100).toFixed(0)}%`;
  };
  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={125}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--foreground))'
              }}
            />
          </PieChart>
        );

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(0 73% 41%)" 
              strokeWidth={3}
              dot={{ fill: 'hsl(0 73% 41%)', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );

      default: // bar
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};