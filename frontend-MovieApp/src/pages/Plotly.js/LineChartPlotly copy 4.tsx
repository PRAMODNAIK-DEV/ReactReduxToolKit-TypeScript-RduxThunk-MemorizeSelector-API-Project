import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart: React.FC = () => {
  const [yRange, setYRange] = useState<[number, number]>([0, 1000]);
  const [xRange, setXRange] = useState<[number, number]>([0, 50]);

  const data = {
    labels: Array.from({ length: 50 }, (_, i) => i + 1), // Example x-axis labels, you can customize this
    datasets: [
      {
        label: 'Activations',
        data: Array.from({ length: 50 }, (_, i) => Math.min(i * 6, 300)), // Example data for green curve
        borderColor: 'green',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'LSR Solver',
        data: Array.from({ length: 50 }, (_, i) => i * 20), // Example data for blue curve
        borderColor: 'blue',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        min: xRange[0],
        max: xRange[1],
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        min: yRange[0],
        max: yRange[1],
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <Box>
      <Line data={data} options={options} />
      
      {/* Slider for Y-Axis */}
      <Slider
        orientation="vertical"
        value={yRange}
        onChange={(_, newValue) => setYRange(newValue as [number, number])}
        min={0}
        max={1000}
        step={10}
        valueLabelDisplay="auto"
        style={{ position: 'absolute', left: 20, top: 20, height: 400 }}
      />
      
      {/* Slider for X-Axis */}
      <Slider
        value={xRange}
        onChange={(_, newValue) => setXRange(newValue as [number, number])}
        min={0}
        max={50}
        step={1}
        valueLabelDisplay="auto"
        style={{ marginTop: 20 }}
      />
    </Box>
  );
};

export default LineChart;
