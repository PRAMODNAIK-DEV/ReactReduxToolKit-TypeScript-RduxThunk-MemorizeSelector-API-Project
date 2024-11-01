// InteractiveLineChart.tsx
import React, { useState } from 'react';
import Plot from 'react-plotly.js';

const LineChartRe: React.FC = () => {
  // Sample data for demonstration
  const xValues = Array.from({ length: 100 }, (_, i) => i + 1); // [1, 2, ..., 100]
  const yValues1 = xValues.map((x) => Math.random() * 50); // Random values for "Activations"
  const yValues2 = xValues.map((x) => Math.random() * 100); // Random values for "LSR Solver"

  // State to manage X and Y axis range controlled by the sliders
  const [yRange, setYRange] = useState<[number, number]>([0, 150]);
  const [xRange, setXRange] = useState<[number, number]>([1, 100]);

  // Handlers for changing X and Y axis slider ranges
  const handleYRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    setYRange([0, newValue]);
  };

  const handleXRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    setXRange([1, newValue]);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <span>Y-Axis Max: 0 - </span>
        <input
          type="range"
          min="50"
          max="150"
          step="10"
          value={yRange[1]}
          onChange={handleYRangeChange}
          style={{ margin: '0 10px', width: '300px' }}
        />
        <span>{yRange[1]}</span>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <span>X-Axis Max: 1 - </span>
        <input
          type="range"
          min="10"
          max="100"
          step="10"
          value={xRange[1]}
          onChange={handleXRangeChange}
          style={{ margin: '0 10px', width: '300px' }}
        />
        <span>{xRange[1]}</span>
      </div>

      <Plot
        data={[
          {
            x: xValues,
            y: yValues1,
            mode: 'lines+markers',
            name: 'Activations',
            line: { color: 'green' },
          },
          {
            x: xValues,
            y: yValues2,
            mode: 'lines+markers',
            name: 'LSR Solver',
            line: { color: 'blue' },
          },
        ]}
        layout={{
          title: 'Interactive Line Chart with X and Y Sliders',
          xaxis: {
            title: 'Time',
            range: xRange, // Dynamic range for X-axis from slider
            rangeslider: { visible: true },
          },
          yaxis: {
            title: 'Count',
            range: yRange, // Dynamic range for Y-axis from slider
          },
          showlegend: true,
        }}
        config={{
          responsive: true,
        }}
      />
    </div>
  );
};

export default LineChartRe;
