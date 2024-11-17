// InteractiveLineChart.tsx
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Generate labels from July 2025 to December 2026
const generateDateLabels = () => {
  const start = dayjs('2025-07-01');
  const end = dayjs('2026-12-31');
  const labels = [];

  for (let date = start; date.isBefore(end) || date.isSame(end); date = date.add(1, 'day')) {
    const day = date.format('D');
    const month = date.format('MMM');
    const year = date.format('YYYY');
    labels.push(`${day}\n${month}\n${year}`);
  }

  return labels;
};

const InteractiveLineChart: React.FC = () => {
  const xValues = generateDateLabels();
  const yValues1 = Array.from({ length: xValues.length }, () => Math.random() * 50);
  const yValues2 = Array.from({ length: xValues.length }, () => Math.random() * 100);

  const [yMin, setYMin] = useState<number>(0);
  const [yMax, setYMax] = useState<number>(150);
  const [xMin, setXMin] = useState<number>(0);
  const [xMax, setXMax] = useState<number>(xValues.length);

  const handleYMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYMin(parseInt(event.target.value, 10));
  };

  const handleYMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYMax(parseInt(event.target.value, 10));
  };

  const handleXMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setXMin(parseInt(event.target.value, 10));
  };

  const handleXMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setXMax(parseInt(event.target.value, 10));
  };

  const chartData = {
    labels: xValues.slice(xMin, xMax),
    datasets: [
      {
        label: 'Activations',
        data: yValues1.slice(xMin, xMax),
        borderColor: 'green',
        backgroundColor: 'rgba(0, 128, 0, 0.3)',
        tension: 0.3,
        pointRadius: 3,
        hoverRadius: 6,
      },
      {
        label: 'LSR Solver',
        data: yValues2.slice(xMin, xMax),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.3)',
        tension: 0.3,
        pointRadius: 3,
        hoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Interactive Line Chart with Custom X-axis Labels' },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: { display: true, text: 'Time' },
        ticks: {
          callback: function (value: string | number, index: number): string | undefined {
            const label = xValues[Number(value)];
            const [day, month, year] = label.split('\n');

            if (index % 365 === 0) {
              return year;
            }
            if (index % 31 === 0) {
              return month;
            }
            if (index % 7 === 0) {
              return `${day}`;
            }
            return undefined;
          },
          maxRotation: 0,
          autoSkip: false,
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
          color: (context: any) => {
            if (context.tick.index % 31 === 0) {
              return '#000';
            }
            if (context.tick.index % 365 === 0) {
              return '#000';
            }
            return '#e0e0e0';
          },
          lineWidth: (context: any) => {
            if (context.tick.index % 31 === 0 || context.tick.index % 365 === 0) {
              return 2;
            }
            return 1;
          },
        },
      },
      y: {
        title: { display: true, text: 'Count' },
        min: yMin,
        max: yMax,
      },
    },
  };

  return (
    <div>
      <div >
        <span>Y-Axis Min: </span>
        <input
          type="range"
          min="0"
          max="50"
          step="5"
          value={yMin}
          onChange={handleYMinChange}
          // style={{ margin: '0 10px', width: '200px' }}
        />
        <span>{yMin}</span>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <span>Y-Axis Max: </span>
        <input
          type="range"
          min="50"
          max="200"
          step="10"
          value={yMax}
          onChange={handleYMaxChange}
          // style={{ margin: '0 10px', width: '200px' }}
        />
        <span>{yMax}</span>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <span>X-Axis Min: </span>
        <input
          type="range"
          min="0"
          max={xValues.length - 30}
          step="30"
          value={xMin}
          onChange={handleXMinChange}
          // style={{ margin: '0 10px', width: '200px' }}
        />
        <span>{xMin}</span>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <span>X-Axis Max: </span>
        <input
          type="range"
          min="30"
          max={xValues.length}
          step="30"
          value={xMax}
          onChange={handleXMaxChange}
          style={{ margin: '0 10px', width: '200px' }}
        />
        <span>{xMax}</span>
      </div>

      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default InteractiveLineChart;
