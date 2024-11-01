// InteractiveLineChartRecharts.tsx
import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import dayjs from 'dayjs';

// Generate data for each day from July 2025 to December 2026
const generateData = () => {
  const start = dayjs('2025-07-01');
  const end = dayjs('2026-12-31');
  const data = [];

  for (let date = start; date.isBefore(end) || date.isSame(end); date = date.add(1, 'day')) {
    data.push({
      date: date.format('YYYY-MM-DD'),
      activations: Math.floor(Math.random() * 50),
      lsrSolver: Math.floor(Math.random() * 100),
    });
  }

  return data;
};

const InteractiveLineChartRecharts: React.FC = () => {
  const data = generateData();
  const [yMax, setYMax] = useState<number>(150);
  const [xMax, setXMax] = useState<number>(data.length);

  // Custom x-axis tick formatter
  const formatXAxis = (tick: string) => {
    const date = dayjs(tick);
    if (date.date() === 1) {
      // Show month abbreviation at the start of each month
      return date.format('MMM');
    }
    if (date.date() % 7 === 0) {
      // Show day every 7th day
      return date.format('D');
    }
    return '';
  };

  return (
    <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
      <h3 style={{ textAlign: 'center', color: '#333' }}>Interactive Line Chart with Custom X-axis Labels</h3>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <span>Y-Axis Max: 0 - </span>
        <input
          type="range"
          min="50"
          max="150"
          step="10"
          value={yMax}
          onChange={(e) => setYMax(parseInt(e.target.value, 10))}
          style={{ margin: '0 10px', width: '300px' }}
        />
        <span>{yMax}</span>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <span>X-Axis Max: 1 - </span>
        <input
          type="range"
          min="30"
          max={data.length}
          step="30"
          value={xMax}
          onChange={(e) => setXMax(parseInt(e.target.value, 10))}
          style={{ margin: '0 10px', width: '300px' }}
        />
        <span>{xMax}</span>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data.slice(0, xMax)}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorActivations" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34a853" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#34a853" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLSR" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4285f4" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4285f4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            interval={0}
            tick={{ fontSize: 12, fill: '#666' }}
          />
          <YAxis domain={[0, yMax]} tick={{ fontSize: 12, fill: '#666' }} />
          <Tooltip contentStyle={{ backgroundColor: '#f5f5f5', borderRadius: '8px', border: '1px solid #ccc' }} />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="activations"
            stroke="#34a853"
            strokeWidth={2}
            fill="url(#colorActivations)"
            dot={{ stroke: '#34a853', strokeWidth: 2, r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="lsrSolver"
            stroke="#4285f4"
            strokeWidth={2}
            fill="url(#colorLSR)"
            dot={{ stroke: '#4285f4', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InteractiveLineChartRecharts;
