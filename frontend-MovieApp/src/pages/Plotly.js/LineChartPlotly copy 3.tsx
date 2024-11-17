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
  // Sample data to mimic the graph in the image
  const xValues = Array.from({ length: 1000 }, (_, i) => i + 1); // Representing days or months over time

  // "Activations" rapid growth curve
  const yValues1 = xValues.map((x) => 
    x < 250 ? (x * 1.2) : (300) // Rapid increase until 300, then plateau
  );

  // "LSR Solver" steady growth curve
  const yValues2 = xValues.map((x) => x * 1); // Linear growth up to 1000

  // State to manage X and Y axis range controlled by the sliders
  const [yRange, setYRange] = useState<[number, number]>([0, 1000]);
  const [xRange, setXRange] = useState<[number, number]>([1, 1000]);

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
          min="300"
          max="1000"
          step="50"
          defaultValue={yRange[1]}
          onChange={handleYRangeChange}
        />
        <span>{yRange[1]}</span>
      </div>

      <div style={{ margin: '20px' }}>
        <span>X-Axis Max: 1 - </span>
        <input
          type="range"
          min="100"
          max="1000"
          step="50"
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
            mode: 'lines',
            name: 'Activations',
            line: { color: 'green' },
            hoverinfo: 'y', // Show y-value on hover only
          },
          {
            x: xValues,
            y: yValues2,
            mode: 'lines',
            name: 'LSR Solver',
            line: { color: 'blue' },
            hoverinfo: 'y', // Show y-value on hover only
          },
        ]}
        layout={{
          title: 'Activations and LSR Solver Growth Over Time',
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
