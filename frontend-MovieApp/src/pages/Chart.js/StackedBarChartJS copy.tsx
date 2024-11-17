import React from "react";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

// Define the data type
type DataItem = {
  date: string; // YYYY-MM-DD format
  [key: string]: number | string;
};

// Generate cumulative data function
const generateCumulativeData = () => {
  const rawData: DataItem[] = Array.from({ length: 120 }, (_, i) => {
    const date = dayjs("2024-07-15").add(i, "day").format("YYYY-MM-DD");
    return {
      date,
      argentina: Math.floor(Math.random() * 5),
      australia: Math.floor(Math.random() * 4),
      belgium: Math.floor(Math.random() * 2),
      bulgaria: Math.floor(Math.random() * 2),
      china: Math.floor(Math.random() * 3),
      denmark: Math.floor(Math.random() * 2),
    };
  });

  const cumulativeData: DataItem[] = [];

  rawData.forEach((item, index) => {
    if (index === 0) {
      cumulativeData.push(item);
    } else {
      const previousItem = cumulativeData[index - 1];
      const cumulativeItem: DataItem = { date: item.date };

      Object.keys(item).forEach((key) => {
        if (key !== "date") {
          cumulativeItem[key] =
            (previousItem[key] as number) + (item[key] as number);
        }
      });

      cumulativeData.push(cumulativeItem);
    }
  });

  return cumulativeData;
};

const data = generateCumulativeData();

// Colors for each country
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#d0ed57",
  "#8dd1e1",
  "#ff8042",
];

const CumulativeStackedBarChart: React.FC = () => {
  const labels = data.map((item) => item.date);
  const keys = Object.keys(data[0]).filter((key) => key !== "date");

  // Create datasets for each country
  const datasets = keys.map((key, index) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    data: data.map((item) => (item[key] as number) > 0 ? (item[key] as number) : 0),
    backgroundColor: COLORS[index % COLORS.length],
    stack: "cumulative",
    barPercentage: 0.99,           // Remove space within the bar
    categoryPercentage: 1.0,      // Remove space between stacks
  }));

  const chartData = {
    labels,
    datasets,
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
      },
      datalabels: {
        display: (context: any) => context.datasetIndex === datasets.length - 1,
        anchor: "end",
        align: "end",
        formatter: (value: number, context: any) => {
          const dayIndex = context.dataIndex;
          const cumulativeTotal = keys.reduce(
            (sum, key) => sum + ((data[dayIndex][key] as number) > 0 ? (data[dayIndex][key] as number) : 0),
            0
          );
          return cumulativeTotal > 0 ? cumulativeTotal : "";
        },
        font: {
          weight: "bold",
          size: 12,
        },
        color: "#000",
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: (value: any, index: number) => {
            const date = dayjs(labels[index]);
            const day = date.date();
            const month = date.format("MMM");

            // Display day on the first line
            let label = `${day}`;

            // Display the month on a separate line if it's the first occurrence of the month
            if (index === 0 || dayjs(labels[index - 1]).format("MMM") !== month) {
              label += `\n${month}`;
            }
            return label;
          },
        },
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "500px", display: 'flex'}}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CumulativeStackedBarChart;
