import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Slider from 'react-slider';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineGraphWithSliders: React.FC = () => {
  // Generate large, smooth data points for a curve-like effect
  const labels = Array.from({ length: 500 }, (_, i) => `Month ${i + 1}`);
  const activations = Array.from({ length: 500 }, (_, i) => 300 * (1 - Math.exp(-i / 50))); // S-curve growth
  const solver = Array.from({ length: 500 }, (_, i) => i * 2); // Linear growth

  // State for sliders
  const [xRange, setXRange] = useState([0, 499]);
  const [yRange, setYRange] = useState([0, 1000]);

  // Chart data and options
  const data = {
    labels: labels.slice(xRange[0], xRange[1] + 1),
    datasets: [
      {
        label: 'Activations',
        data: activations.slice(xRange[0], xRange[1] + 1),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        pointRadius: 0, // remove individual points to make the line smoother
      },
      {
        label: 'LSR Solver',
        data: solver.slice(xRange[0], xRange[1] + 1),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
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
          text: 'Count',
        },
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '80%', height: '400px' }}>
        <Line data={data} options={options} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px', width: '80%' }}>
        <div style={{ width: '80%', marginRight: '20px' }}>
          <h4>X-Axis Range</h4>
          <Slider
            value={xRange}
            min={0}
            max={499}
            onChange={(value: number[]) => setXRange(value as number[])}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
          />
        </div>
        <div style={{ width: '20%' }}>
          <h4>Y-Axis Range</h4>
          <Slider
            value={yRange}
            min={0}
            max={1000}
            onChange={(value:number[]) => setYRange(value as number[])}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            orientation="vertical"
          />
        </div>
      </div>
    </div>
  );
};

export default LineGraphWithSliders;
