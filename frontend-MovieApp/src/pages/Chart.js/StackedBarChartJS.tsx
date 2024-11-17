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
import { log } from "console";

// This is mandatory after Chart.js 3
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

// Define the data type
type DataItem = {
  date: string; // YYYY-MM-DD format
  [key: string]: number | string;
};

// Generating rawdData and cumulative data function with sorted and filtered entries
//Here index starts from 0, So for 0 all the countries will have value 0
const generateCumulativeData = () => {
  const rawData: DataItem[] = Array.from({ length: 80 }, (_, i) => {
    const date = dayjs("2024-07-15").add(i, "day").format("YYYY-MM-DD");
    // console.log("Pramod", date);
    
    return {
      date,
      argentina: i < 90 ? Math.floor(Math.random() * 5) : 0,
      australia: i >= 50 && i < 100 ? Math.floor(Math.random() * 4) : 0,
      belgium: i >= 40 ? Math.floor(Math.random() * 2) : 0,
      bulgaria: i >= 50 ? Math.floor(Math.random() * 2) : 0,
      china: i >= 20 ? Math.floor(Math.random() * 8) : 0,
      denmark: i >= 5 ? Math.floor(Math.random() * 2) : 0,
      dubai: i >= 5 ? Math.floor(Math.random() * 2) : 0,
      pramod: i >= 50 ? Math.floor(Math.random() * 2) : 0,
      bang: i >= 5 ? Math.floor(Math.random() * 2) : 0,
      murdeshwar: i >= 60 ? Math.floor(Math.random() * 2) : 0,
    };
  });

    console.log("Pramod", rawData);

  // Calculating Cumulative Data from rawData. 
  const cumulativeData: DataItem[] = [];
  console.log("item", cumulativeData[0]);

  rawData.forEach((item, index) => {
    if (index === 0) {
      //Here I have to add one DataItem with all the values null.
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
console.log("data", data);


// Colors for each country
const generateColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor.padStart(6, '0')}`;
};

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#d0ed57",
  "#8dd1e1",
  "#ff8042",
];

while (COLORS.length < 35) {
  const newColor = generateColor();
  if (!COLORS.includes(newColor)) {
    COLORS.push(newColor);
  }
}

console.log(COLORS);
const CumulativeStackedBarChart: React.FC = () => {

  const labels = data.map((item) => item.date);   //Extracts all dates for the x-axis.
  const keys = Object.keys(data[0])               //keys: Extracts country names (excluding date) and sorts them alphabetically.
    .filter((key) => key !== "date")
    .sort(); 

  // Create datasets for each country. This is responsible for creating stack of countries for current date.
  // This will loop through list of all the countires i.e in keys constant and checks from starting day to end date wheterh it has a value for each date if not it will put null in that place (not 0) so the chart.js will not plot the bar for this country in stacked bar.
  // The outcome will be array of Object with 2 main keys {label: string, data: string, backgroundColor, stack: string and so on} and the size is equal to the number countries in the data.
  const datasets = keys.map((key, index) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),        // This will convert the 1st char of Country name to Capitall.
    
    // This will loop upto 80 times and check the value of it and repeats the same for each country in alphabetical order.
    // So data will return array integers and the size is equal to number of day's from start to end date.
    data: data.map((item) =>    
      (item[key] as number) > 0 ? (item[key] as number) : null
    ), // Show only non-zero values
    backgroundColor: COLORS[index % COLORS.length],
    stack: "cumulative",
    barPercentage: 0.99,
    categoryPercentage: 1.0,
  }));

  console.log("datasets", datasets);
  

  const chartData = {
    labels,
    datasets,
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const datasetLabel = context.dataset.label || ""; // Country name
            const dateLabel = dayjs(
              context.chart.data.labels[context.dataIndex]
            ).format("YYYY-MMMM-DD"); // Formated date
            const value = context.raw; // Value for the specific data point: Activations

            // if (value === null || value === undefined) return ""; // Skip tooltips for null/undefined values

            return [
              `Date: ${dateLabel}`,
              `Activations: ${value}`,
              `Country: ${datasetLabel}`,
            ];
          },
        },
      },
      // This will display cumulative total values as labels on the Stacked Bar
      datalabels: {
        // display: (context: any) => context.datasetIndex === datasets.length - 1,      // This will decide whether to display the label or not as Labels are only displayed for the last dataset (e.g., the top bar in each stack)
        // display: (context) => {
        //   const datasetIndex = context.datasetIndex;
        //   const totalDatasets = context.chart.data.datasets.length;
        //   // Display label only for the top dataset
        //   return datasetIndex === totalDatasets - 1;
        // },
        display: (context) => {
          const value = context.dataset.data[context.dataIndex];
          // Display only for valid data points (not null or undefined)
          return value !== null && value !== undefined;
        },
        anchor: "end",
        align: "end",
        // offset: 5,
        clip: true,
        // formatter: (value: number) => (value > 1000 ? `${(value / 1000).toFixed(1)}k` : value),
        // formatter: (value: number, context: any) => {
        //   const dayIndex = context.dataIndex;
        //   const cumulativeTotal = keys.reduce(            //Iterates over all country keys (keys) and sums up their values for the current date (data[dayIndex][key]).
        //     (sum, key) =>
        //       sum +
        //       ((data[dayIndex][key] as number) > 0
        //         ? (data[dayIndex][key] as number)
        //         : 0),
        //     0
        //   );
        //   return cumulativeTotal > 0 ? cumulativeTotal : "";
        // },
        // formatter: (value: number, context: any) => {
        //   const datasetIndex = context.datasetIndex;
        //   const totalDatasets = context.chart.data.datasets.length;
        //   const isTopStack = datasetIndex === totalDatasets - 1;
          
        //   if (isTopStack) {
        //     const dayIndex = context.dataIndex;
        //     const cumulativeTotal = keys.reduce(
        //       (sum, key) =>
        //         sum +
        //         ((data[dayIndex][key] as number) > 0
        //           ? (data[dayIndex][key] as number)
        //           : 0),
        //       0
        //     );
        //     return cumulativeTotal > 0 ? cumulativeTotal : "";
        //   }
        //   return ""; // Don't display for non-top datasets
        // },
        formatter: (value, context) => {
          if (typeof value !== "number") return ""; // Skip rendering for non-numeric values
      
          // Calculate the cumulative total for the current data index
          const dayIndex = context.dataIndex;
          const datasets = context.chart.data.datasets;
          const cumulativeTotal = datasets.reduce((sum, dataset) => {
            const dataValue = dataset.data[dayIndex];
            // Ensure dataValue is a number before adding to the sum
            return sum + (typeof dataValue === "number" ? dataValue : 0);
          }, 0);
      
          return cumulativeTotal > 0 ? cumulativeTotal : "";
        },
        
        font: {
          weight: "bold",
          size: 6,
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
      
            // Initial label for the day
            let label = `${day}`;
      
            // Check if this is the first label of the month or it's the 15th
            if (index === 0 || day === 15 || dayjs(labels[index - 1]).format("MMM") !== month) {
              label += `\n${month}`;
            }
      
            // Handle skipping of the 15th by checking if 16 or 17 is available
            if (day !== 15 && (day === 16 || day === 17) && !labels.some((label: string, idx: number) => dayjs(label).date() === 15)) {
              // If 15th is skipped, add a label for 16th or 17th
              label = `${day}\n${month}`;
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
    <div style={{ width: "100%", height: "500px", display: "flex" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CumulativeStackedBarChart;
