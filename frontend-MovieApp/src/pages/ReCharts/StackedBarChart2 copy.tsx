



import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import dayjs from "dayjs";

type DataItem = {
  date: string;
  [key: string]: number | string;
};

const generateCumulativeData = () => {
  const rawData: DataItem[] = Array.from({ length: 60 }, (_, i) => {
    const date = dayjs("2024-07-15").add(i, "day").format("YYYY-MM-DD");
    return {
      date,
      argentina: Math.floor(Math.random() * 5),
      australia: Math.floor(Math.random() * 4),
      belgium: Math.floor(Math.random() * 2),
      bulgaria: Math.floor(Math.random() * 2),
      brazil: Math.floor(Math.random() * 3),
      canada: Math.floor(Math.random() * 2),
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
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#8dd1e1", "#ff8042"];

const CumulativeActivationCurve: React.FC = () => {
  const keys = Object.keys(data[0]).filter((key) => key !== "date");

  const dayTickFormatter = (tick: string) => {
    const date = dayjs(tick);
    return date.date().toString();
  };

  const renderCustomAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const date = dayjs(payload.value);
    const day = date.date();
    const month = date.format("MMM");
    return (
      <>
        <text x={x} y={y + 10} textAnchor="middle" fontSize={10}>
          {day}
        </text>
        {day === 15 && (
          <text x={x} y={y + 25} textAnchor="middle" fontSize={12} fontWeight="bold">
            {month}
          </text>
        )}
      </>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          tick={renderCustomAxisTick}
          interval={0}
        />
        <YAxis />
        <Tooltip />
        {keys.map((key, index) => (
          <Area
            key={key}
            dataKey={key}
            stackId="1"
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CumulativeActivationCurve;