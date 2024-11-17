// InteractiveLineChart.tsx
import React, { useState, useCallback } from 'react';
import Plot from 'react-plotly.js';

// Debounce function to delay updates
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const LineChartRe: React.FC = () => {
  // Sample data for demonstration
  const xValues = Array.from({ length: 100 }, (_, i) => i + 1); // [1, 2, ..., 100]
  const yValues1 = xValues.map((x) => Math.random() * 50); // Random values for "Activations"
  const yValues2 = xValues.map((x) => Math.random() * 100); // Random values for "LSR Solver"

  // State to manage X and Y axis range controlled by the sliders
  const [yRange, setYRange] = useState<[number, number]>([0, 150]);
  const [xRange, setXRange] = useState<[number, number]>([1, 100]);

  // Debounced handlers to control updates
  const debouncedSetYRange = useCallback(debounce(setYRange, 100), []);
  const debouncedSetXRange = useCallback(debounce(setXRange, 100), []);

  // Handler for changing Y-axis range
  const handleYRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    debouncedSetYRange([0, newValue]);
  };

  // Handler for changing X-axis range
  const handleXRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    debouncedSetXRange([1, newValue]);
  };

  return (
    <div>
      <div style={{ margin: '30px 0 30px 30px' }}>
        <span>Y-Axis Max: 0 - </span>
        <input
          type="range"
          min="50"
          max="150"
          step="10"
          defaultValue={yRange[1]}
          onChange={handleYRangeChange}
          // style={{ margin: '0 10px', width: '300px' }}
        />
        <span>{yRange[1]}</span>
      </div>

      <div style={{ margin: '20px' }}>
        <span>X-Axis Max: 1 - </span>
        <input
          type="range"
          min="10"
          max="100"
          step="10"
          defaultValue={xRange[1]}
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
            hoverinfo: 'y', // Show y-value on hover only
          },
          {
            x: xValues,
            y: yValues2,
            mode: 'lines+markers',
            name: 'LSR Solver',
            line: { color: 'blue' },
            hoverinfo: 'y', // Show y-value on hover only
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
