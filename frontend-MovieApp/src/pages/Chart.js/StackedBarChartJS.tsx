import React, { forwardRef, useCallback, useRef } from "react";
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
import { reforwardRef } from "react-chartjs-2/dist/utils";
import { SMArT } from "../../SMArTData";

// This is mandatory after Chart.js 3
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  // ChartDataLabels
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

// const data = generateCumulativeData();
const data = SMArT;
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

console.log("COLORS",COLORS);
const CumulativeStackedBarChart = forwardRef<ChartJS<"bar"> | null>((_, ref) => {

  const chartInstanceRef = useRef<ChartJS<"bar"> | null>(null);


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
    data: data.map((item: any) =>    
      (item[key] as number) > 0 ? (item[key] as number) : null
    ), // Show only non-zero values
    backgroundColor: COLORS[index % COLORS.length],
    stack: "cumulative",
    barPercentage: 0.99,
    categoryPercentage: 1.0,
  })).sort((a,b)  => (a.label < b.label ? 1: -1));

  console.log("datasets", datasets);
  

  const chartData = {
    labels,
    datasets,
  };

  console.log("DataSets", datasets)
  const options: ChartOptions<"bar"> = {
    responsive: true,
    // maintainAspectRatio: true,
    plugins: {
      // legend: {
      //   position: "right",
      //   labels:{
      //     usePointStyle: true,
      //   }
      // },
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
  
            // Sort datasets based on labels in reverse order
            const sortedDatasets = datasets
              .map((dataset, index) => ({
                label: dataset.label,
                backgroundColor: dataset.backgroundColor,
                hidden: !chart.isDatasetVisible(index),
                datasetIndex: index,
              }))
              .sort((a, b) => (a.label! < b.label! ? -1 : 1)); // Reverse alphabetical order
  
            return sortedDatasets.map((item) => ({
              text: item.label || "",
              fillStyle: item.backgroundColor as string, 
              hidden: item.hidden,
              datasetIndex: item.datasetIndex,
            }));
          },
        },
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
          // Always display labels for the topmost visible stack
          const dayIndex = context.dataIndex;
          const datasets = context.chart.data.datasets;
          const meta = context.chart.getDatasetMeta(context.datasetIndex);
      
          // Check if the dataset is visible
          if (!meta.hidden) {
            // Find if this dataset is the topmost visible one for this dayIndex
            const isTopVisible = datasets.every((dataset, idx) => {
              const metaForDataset = context.chart.getDatasetMeta(idx);
              const dataValue = dataset.data[dayIndex];
              return (
                idx <= context.datasetIndex ||
                metaForDataset.hidden || // Ignore hidden datasets
                dataValue === null ||
                dataValue === undefined
              );
            });
            return isTopVisible; // Display label only for the topmost visible stack
          }
          return false; // Hide labels for hidden datasets
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
            const date = dayjs(labels[index]).format("DD-MMM-YYYY"); // Full date format
            return date; // Return the full formatted date
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
      <Bar 
        // ref={ref} 
        ref={(instance) => {
          // Assign Chart.js instance to the passed ref
          if (instance && instance instanceof ChartJS) {
            chartInstanceRef.current = instance;
            if (typeof ref === "function") {
              ref(instance);
            } else if (ref) {
              (ref as React.MutableRefObject<ChartJS<"bar"> | null>).current = instance;
            }
          }
        }}
        data={chartData} 
        options={options} 
        plugins={[ChartDataLabels, LinearScale]}/>
    </div>
  );
});

export default CumulativeStackedBarChart;
