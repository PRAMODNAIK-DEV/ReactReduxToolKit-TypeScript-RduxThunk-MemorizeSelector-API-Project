import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

// Define the data type
type DataItem = {
  date: string; // YYYY-MM-DD format
  [key: string]: number | string;
};

// Generate cumulative data function with sorted and filtered entries
const generateCumulativeData = () => {
  const rawData: DataItem[] = Array.from({ length: 80 }, (_, i) => {
    const date = dayjs("2024-07-15").add(i, "day").format("YYYY-MM-DD");
    return {
      date,
      argentina: i < 90 ? Math.floor(Math.random() * 5) : 0,
      australia: i >= 50 && i < 100 ? Math.floor(Math.random() * 4) : 0,
      belgium: i >= 40 ? Math.floor(Math.random() * 2) : 0,
      bulgaria: i >= 50 ? Math.floor(Math.random() * 2) : 0,
      china: i >= 20 ? Math.floor(Math.random() * 8) : 0,
      denmark: i >= 5 ? Math.floor(Math.random() * 2) : 0,
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
  const keys = Object.keys(data[0]).filter((key) => key !== "date");

  // Custom tick formatter for dates, displaying day and month labels
  const customTickFormatter = (dateString: string, index: number) => {
    const date = dayjs(dateString);
    const day = date.date();
    const month = date.format("MMM");

    let label = `${day}`;

    if (index === 0 || day === 15 || dayjs(data[index - 1].date).format("MMM") !== month) {
      label += `\n${month}`;
    }
    return label;
  };

  // Custom tooltip formatter to show the date, country, and activation count
  const customTooltip = (props: any) => {
    if (!props.active || !props.payload) return null;

    const dateLabel = dayjs(props.label).format("YYYY-MMMM-DD");
    return (
      <div style={{ backgroundColor: "white", padding: "10px", border: "1px solid #ccc" }}>
        <p>{`Date: ${dateLabel}`}</p>
        {props.payload.map((entry: any, index: number) => (
          <p key={`tooltip-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data}>
        <XAxis
          dataKey="date"
          tickFormatter={customTickFormatter}
          interval={0}
        />
        <YAxis />
        <Tooltip content={customTooltip} />
        <Legend />
        {keys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a"
            fill={COLORS[index % COLORS.length]}
            barSize={10} // Adjust as needed to remove space
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CumulativeStackedBarChart;
