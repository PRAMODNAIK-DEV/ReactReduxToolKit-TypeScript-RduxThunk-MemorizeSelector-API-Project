import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface GraphProps {
  data: any[];
  selectedCountry: string;
}

const Graph: React.FC<GraphProps> = ({ data, selectedCountry }) => {
  return (
    
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="country" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.map((entry) => (
          <Line
            key={entry.country}
            type="monotone"
            dataKey="p90"
            stroke={entry.country === selectedCountry ? 'red' : '#8884d8'}
            strokeWidth={entry.country === selectedCountry ? 3 : 1}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Graph;
