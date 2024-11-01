import React from "react";
import Plot from "react-plotly.js";
import dayjs from "dayjs";

type DataItem = {
  date: string;
  [key: string]: number | string;
};

const generateCumulativeData = (): DataItem[] => {
  const rawData: DataItem[] = Array.from({ length: 60 }, (_, i) => {
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

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#d0ed57",
  "#8dd1e1",
  "#ff8042",
];

const StackedBarChartWithPlotly: React.FC = () => {
  const keys = Object.keys(data[0]).filter((key) => key !== "date");

  const traces: Plotly.Data[] = keys.map((key, index) => ({
    x: data.map((item) => item.date),
    y: data.map((item) => item[key] as number),
    type: "bar" as const,
    name: key,
    marker: { color: COLORS[index % COLORS.length] },
    stackgroup: "one",
    hoverinfo: "y+name",
  }));

  const layout: Partial<Plotly.Layout> = {
    title: "Cumulative Stacked Bar Chart",
    barmode: "stack",
    xaxis: {
      title: "Date",
      tickformat: "%d", // Display day only
    },
    yaxis: {
      title: "Value",
    },
    showlegend: true,
    autosize: true, // Enables resizing based on the container
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <Plot
        data={traces}
        layout={layout as Plotly.Layout}
        config={{ responsive: true }} // Enables responsive behavior
        // style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default StackedBarChartWithPlotly;
